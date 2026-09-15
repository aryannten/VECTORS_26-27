const express = require('express')
const router = express.Router()
const { getAuth } = require('firebase-admin/auth')
const User = require('../models/User')
const EntryRegistration = require('../models/EntryRegistration')
const { verifyFirebaseToken } = require('../middleware/auth')
const { rateLimitMongo, incrementFailedAttempt, checkRateLimit } = require('../middleware/rateLimitMongo')

// ─── Rate Limiters ───────────────────────────────────────────────────────────

const FIFTEEN_MINUTES = 15 * 60 * 1000
const ONE_HOUR = 60 * 60 * 1000

/**
 * IP-based limiter for POST /api/auth/sync
 * 10 requests per IP per 15 minutes.
 */
const authSyncIpLimiter = rateLimitMongo({
  category: 'auth_sync_ip',
  windowMs: FIFTEEN_MINUTES,
  max: 10,
  keyGenerator: (req) => req.ip || req.connection?.remoteAddress || 'unknown',
  message: 'Too many authentication attempts. Please try again later.',
})

/**
 * IP-based limiter for POST /api/auth/reset-password
 * 5 requests per IP per 15 minutes.
 */
const resetIpLimiter = rateLimitMongo({
  category: 'reset_ip',
  windowMs: FIFTEEN_MINUTES,
  max: 5,
  keyGenerator: (req) => req.ip || req.connection?.remoteAddress || 'unknown',
  message: 'Too many password reset requests. Please try again later.',
})

/**
 * Email-based limiter for POST /api/auth/reset-password
 * 3 requests per email per hour.
 */
const resetEmailLimiter = rateLimitMongo({
  category: 'reset_email',
  windowMs: ONE_HOUR,
  max: 3,
  keyGenerator: (req) => {
    const email = (req.body?.email || '').trim().toLowerCase()
    return email || null // null = skip limiter
  },
  message: 'Too many password reset requests. Please try again later.',
})

// ─── Auth Sync Constants ─────────────────────────────────────────────────────

const AUTH_FAILED_EMAIL_CATEGORY = 'auth_sync_email_fail'
const AUTH_FAILED_EMAIL_MAX = 5

// ─── Routes ──────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/sync
 * Called after Firebase sign-in on the client.
 * Creates or updates the user in MongoDB and returns their role.
 *
 * Rate limits:
 *   - 10 requests/IP/15min (all requests)
 *   - 5 failed attempts/email/15min (after token verified, failures only)
 */
router.post('/sync', authSyncIpLimiter, async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No authentication token provided.' })
  }

  const idToken = authHeader.split('Bearer ')[1]

  let verifiedEmail = null

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken)
    const userEmail = (decodedToken.email || '').toLowerCase()
    verifiedEmail = userEmail

    // ── Identity-based sync rate limit check (post-verification, trusted identity) ──
    // Evaluated only after Firebase ID token verification has succeeded, ensuring
    // the email is authentic and cannot be spoofed by an unauthenticated client.
    if (verifiedEmail) {
      const { allowed, retryAfterSec } = await checkRateLimit(
        verifiedEmail,
        AUTH_FAILED_EMAIL_CATEGORY,
        FIFTEEN_MINUTES,
        AUTH_FAILED_EMAIL_MAX
      )
      if (!allowed) {
        res.set('Retry-After', String(retryAfterSec))
        return res.status(429).json({
          message: 'Too many sync attempts for this account. Please try again later.',
        })
      }
    }

    const adminEmailsRaw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || ''
    const adminEmails = adminEmailsRaw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    const isAdmin = adminEmails.includes(userEmail)

    const securityEmailsRaw = process.env.SECURITY_EMAILS || process.env.SECURITY_EMAIL || ''
    const securityEmails = securityEmailsRaw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    const isSecurity = securityEmails.includes(userEmail)

    const existingPass = await EntryRegistration.findOne({ email: userEmail })
    const userPhone = existingPass?.phone || decodedToken.phone_number || null

    // The ID token may lack the `name` claim for email/password signups
    // (token minted before updateProfile). Fall back to the Firebase
    // Admin user record which always has the latest displayName.
    let resolvedName = decodedToken.name || ''
    let resolvedPhoto = decodedToken.picture || ''
    if (!resolvedName) {
      try {
        const firebaseUserRecord = await getAuth().getUser(decodedToken.uid)
        resolvedName = firebaseUserRecord.displayName || ''
        resolvedPhoto = resolvedPhoto || firebaseUserRecord.photoURL || ''
      } catch (_) {
        // non-critical — continue with what we have
      }
    }

    // Find user by firebaseUid or email (to link pre-created accounts without duplicate key errors)
    const uidUser = await User.findOne({ firebaseUid: decodedToken.uid })
    const emailUser = userEmail
      ? await User.findOne({ email: userEmail })
      : null

    if (uidUser && emailUser && !uidUser._id.equals(emailUser._id)) {
      return res.status(409).json({ message: 'Account identity conflict.' })
    }

    let user = uidUser || emailUser

    if (user) {
      user.firebaseUid = decodedToken.uid
      user.email = decodedToken.email
      user.lastLoginAt = new Date()
      if (userPhone) user.phone = userPhone
      if (resolvedName) user.displayName = resolvedName
      if (resolvedPhoto) user.photoURL = resolvedPhoto
      user.role = isAdmin ? 'admin' : isSecurity ? 'security' : 'user'
      await user.save()
      try {
        user = await User.create({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          lastLoginAt: new Date(),
          phone: userPhone,
          displayName: resolvedName || '',
          photoURL: resolvedPhoto || null,
          role: isAdmin ? 'admin' : isSecurity ? 'security' : 'user',
        })
      } catch (createErr) {
        if (createErr.code === 11000) {
          user = await User.findOne({ firebaseUid: decodedToken.uid })
          if (!user && userEmail) {
            user = await User.findOne({ email: userEmail })
          }
        } else {
          throw createErr
        }
      }
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('[Auth] Sync error:', error.message)

    // Only increment failed identity counter if identity was cryptographically verified.
    // Unverified, malformed, or missing tokens must NEVER increment an account counter
    // to prevent attackers from causing denial-of-service on arbitrary accounts;
    // they are strictly bounded by the IP limiter.
    if (verifiedEmail) {
      try {
        await incrementFailedAttempt(
          verifiedEmail,
          AUTH_FAILED_EMAIL_CATEGORY,
          FIFTEEN_MINUTES
        )
      } catch (_) {}
    }

    res.status(401).json({ message: 'Invalid or expired token.' })
  }
})


/**
 * POST /api/auth/reset-password
 * Server-side password reset proxy.
 * Calls Firebase Admin SDK to generate a reset link/email.
 *
 * Security:
 *   - Always returns the same response regardless of whether the email exists.
 *   - Firebase errors are logged server-side only, never exposed to the client.
 *   - Rate limited: 5/IP/15min + 3/email/hour.
 */
router.post('/reset-password', resetIpLimiter, resetEmailLimiter, async (req, res) => {
  const { email } = req.body || {}
  const normalizedEmail = (email || '').trim().toLowerCase()

  // Generic success response — always the same, regardless of outcome
  const genericResponse = {
    message: 'If an account with that email exists, a password reset link has been sent. Please check your inbox and spam folder.',
  }

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    // Still return 200 with generic message to prevent enumeration
    return res.status(200).json(genericResponse)
  }

  const apiKey = process.env.FIREBASE_WEB_API_KEY || process.env.FIREBASE_API_KEY || 'AIzaSyAC4EnjMayPKqmckO38IWIPpUzS2hucAKs'

  try {
    // Send password reset email directly to user via Google Identity Toolkit
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: 'PASSWORD_RESET',
        email: normalizedEmail,
      }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      console.warn(`[Auth] Password reset notice for ${normalizedEmail}:`, errData.error?.message || response.status)
    } else {
      console.log(`[Auth] Password reset email sent for ${normalizedEmail}`)
    }
  } catch (error) {
    // Fallback: log error server-side, never expose to client
    console.error(`[Auth] Password reset error for ${normalizedEmail}:`, error.message)
  }

  // Always return the exact same generic response
  res.status(200).json(genericResponse)
})


/**
 * GET /api/auth/me
 * Get current user info (requires auth).
 */
router.get('/me', verifyFirebaseToken, async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      email: req.user.email,
      displayName: req.user.displayName,
      photoURL: req.user.photoURL,
      role: req.user.role,
    },
  })
})

module.exports = router
