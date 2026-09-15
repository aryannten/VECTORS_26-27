/**
 * In-Memory TTL Cache Utility
 * Lightweight, high-performance in-memory key-value store with expiration and invalidation.
 * Ideal for caching expensive computed results, aggregations, and public catalog endpoints.
 */
class MemoryCache {
  constructor() {
    this.cache = new Map()
  }

  /**
   * Get a cached item if not expired.
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return null
    }

    return entry.value
  }

  /**
   * Set a cached item with TTL in seconds.
   * @param {string} key
   * @param {any} value
   * @param {number} ttlSeconds
   */
  set(key, value, ttlSeconds = 60) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000,
    })
  }

  /**
   * Delete a specific cache key.
   * @param {string} key
   */
  del(key) {
    this.cache.delete(key)
  }

  /**
   * Invalidate all keys matching a prefix.
   * @param {string} prefix
   */
  delPrefix(prefix) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Clear all cached data.
   */
  clear() {
    this.cache.clear()
  }
}

const memoryCache = new MemoryCache()

module.exports = memoryCache
