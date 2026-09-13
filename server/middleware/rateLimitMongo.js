const RateLimit = require('../models/RateLimit')

/**
 * Atomic hit increment helper.
 *
 * 1. Increment within active window (windowStart >= now - windowMs).
 * 2. If window expired (windowStart < now - windowMs), atomically rollover (only the first concurrent caller succeeds).
 * 3. If no document exists, create one; on duplicate key race (E11000), increment active window.
 *
 * Guarantees linear monotonic hit counters with 0 lost updates or resets across concurrent requests.
 */
async function recordHit(key, category, windowMs) {
  const now = new Date()
  const windowStart = new Date(now.getTime() - windowMs)

  // 1. Try to increment within active window
  let doc = await RateLimit.findOneAndUpdate(
    { key, category, windowStart: { $gte: windowStart } },
    { $inc: { hits: 1 } },
    { returnDocument: 'after' }
  )
  if (doc) return { doc, now }

  // 2. Try to rollover an expired window atomically (only one caller resets)
  doc = await RateLimit.findOneAndUpdate(
    { key, category, windowStart: { $lt: windowStart } },
    {
      $set: {
        hits: 1,
        windowStart: now,
        expiresAt: new Date(now.getTime() + windowMs + 60000),
      },
    },
    { returnDocument: 'after' }
  )
  if (doc) return { doc, now }

  // 3. Document does not exist — create it.
  // If another concurrent request creates it first, catch E11000 and increment active window.
  try {
    doc = await RateLimit.create({
      key,
      category,
      hits: 1,
      windowStart: now,
      expiresAt: new Date(now.getTime() + windowMs + 60000),
    })
    return { doc, now }
  } catch (err) {
    if (err.code === 11000) {
      doc = await RateLimit.findOneAndUpdate(
        { key, category, windowStart: { $gte: windowStart } },
        { $inc: { hits: 1 } },
        { returnDocument: 'after' }
      )
      if (doc) return { doc, now }
    }
    throw err
  }
}

/**
 * rateLimitMongo — MongoDB-backed rate limit middleware factory.
 *
 * Creates Express middleware that enforces request rate limits using
 * persistent MongoDB storage. Safe for Vercel serverless (no in-memory state).
 *
 * @param {Object} options
 * @param {string}   options.category      — Limiter name (e.g. 'auth_sync_ip')
 * @param {number}   options.windowMs      — Window duration in milliseconds
 * @param {number}   options.max           — Maximum requests per window
 * @param {Function} options.keyGenerator  — (req) => string — returns the rate limit key
 * @param {boolean}  [options.skipInDev]   — Skip enforcement in non-production (default: true)
 * @param {string}   [options.message]     — Custom 429 response message
 *
 * @returns {Function} Express middleware
 */
function rateLimitMongo({
  category,
  windowMs,
  max,
  keyGenerator,
  skipInDev = true,
  message = 'Too many requests. Please try again later.',
}) {
  if (!category || !windowMs || !max || !keyGenerator) {
    throw new Error('rateLimitMongo: category, windowMs, max, and keyGenerator are required')
  }

  return async (req, res, next) => {
    // Skip in development if configured
    if (skipInDev && process.env.NODE_ENV !== 'production') {
      return next()
    }

    const key = keyGenerator(req)
    if (!key) {
      // No key to limit on (e.g. no email available) — let through
      return next()
    }

    try {
      const { doc, now } = await recordHit(key, category, windowMs)

      if (doc.hits > max) {
        const retryAfterMs = doc.windowStart.getTime() + windowMs - now.getTime()
        const retryAfterSec = Math.ceil(Math.max(retryAfterMs, 1000) / 1000)

        res.set('Retry-After', String(retryAfterSec))
        return res.status(429).json({ message })
      }

      return next()
    } catch (err) {
      // FAIL CLOSED: MongoDB errors on security-sensitive endpoints
      // must not silently disable rate limiting.
      console.error(`[RateLimit] MongoDB error for ${category}/${key}:`, err.message)
      return res.status(503).json({
        message: 'Service temporarily unavailable. Please try again shortly.',
      })
    }
  }
}

/**
 * incrementFailedAttempt — Manually increment the rate limit counter
 * for a specific (key, category) pair. Used for "failed attempts only"
 * limiters where we only count failures, not all requests.
 *
 * @param {string} key      — The rate limit key (e.g. email)
 * @param {string} category — The limiter category
 * @param {number} windowMs — Window duration in milliseconds
 * @returns {number|null}   — Current hit count, or null on error
 */
async function incrementFailedAttempt(key, category, windowMs) {
  if (!key || !category) return null

  try {
    const { doc } = await recordHit(key, category, windowMs)
    return doc ? doc.hits : null
  } catch (err) {
    console.error(`[RateLimit] incrementFailedAttempt error for ${category}/${key}:`, err.message)
    return null
  }
}

/**
 * checkRateLimit — Check if a (key, category) pair has exceeded
 * the limit WITHOUT incrementing. Used for pre-flight checks.
 *
 * @param {string} key
 * @param {string} category
 * @param {number} windowMs
 * @param {number} max
 * @returns {Object} { allowed: boolean, hits: number, retryAfterSec: number }
 */
async function checkRateLimit(key, category, windowMs, max) {
  if (!key || !category) return { allowed: true, hits: 0, retryAfterSec: 0 }

  const now = new Date()
  const windowStart = new Date(now.getTime() - windowMs)

  try {
    const entry = await RateLimit.findOne({
      key,
      category,
      windowStart: { $gte: windowStart },
    })

    if (!entry) return { allowed: true, hits: 0, retryAfterSec: 0 }

    const allowed = entry.hits < max
    const retryAfterMs = entry.windowStart.getTime() + windowMs - now.getTime()
    const retryAfterSec = Math.ceil(Math.max(retryAfterMs, 1000) / 1000)

    return { allowed, hits: entry.hits, retryAfterSec }
  } catch (err) {
    console.error(`[RateLimit] checkRateLimit error for ${category}/${key}:`, err.message)
    // Fail closed
    return { allowed: false, hits: max, retryAfterSec: 60 }
  }
}

module.exports = { rateLimitMongo, incrementFailedAttempt, checkRateLimit }
