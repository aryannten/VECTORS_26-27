const mongoose = require('mongoose')

/**
 * RateLimit — Persistent, cross-instance rate limit tracking.
 *
 * Each document tracks the hit count for a single (key, category) pair
 * within a sliding window. The TTL index on `expiresAt` ensures MongoDB
 * automatically garbage-collects stale entries.
 *
 * Usage:
 *   key      = IP address or email (the identity being limited)
 *   category = limiter name, e.g. 'auth_sync_ip', 'reset_email'
 */
const rateLimitSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    hits: {
      type: Number,
      required: true,
      default: 0,
    },
    windowStart: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: false, // Not needed — windowStart and expiresAt are sufficient
  }
)

// Compound unique index for atomic upsert on (key, category)
rateLimitSchema.index({ key: 1, category: 1 }, { unique: true })

// TTL index — MongoDB automatically deletes documents when expiresAt passes
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('RateLimit', rateLimitSchema)
