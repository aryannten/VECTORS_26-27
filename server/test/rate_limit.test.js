/**
 * Rate Limit Integration Tests
 * 
 * Tests for MongoDB-backed rate limiting on auth, password reset,
 * and gate security verification endpoints.
 * 
 * Run: node test/rate_limit.test.js
 * 
 * Prerequisites:
 *   - MongoDB connection via MONGODB_URI in .env
 *   - Firebase Admin SDK initialized (serviceAccountKey.json)
 *   - Server NOT running (this test starts its own instance)
 */
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })

const http = require('http')
const { initializeApp, getApps, cert } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')
const mongoose = require('mongoose')
const fs = require('fs')

// Initialize Firebase Admin if not already done
if (getApps().length === 0) {
  const keyPath = path.resolve(__dirname, '..', 'serviceAccountKey.json')
  if (fs.existsSync(keyPath)) {
    const sa = JSON.parse(fs.readFileSync(keyPath, 'utf8'))
    initializeApp({ credential: cert(sa) })
  }
}

// Force production mode so rate limiters are active
process.env.NODE_ENV = 'production'

const connectDB = require('../config/db')
const RateLimit = require('../models/RateLimit')

// ─── Test Helpers ────────────────────────────────────────────────────────────

let app, server, baseUrl
let passed = 0, failed = 0, skipped = 0
const results = []

function assert(condition, testName) {
  if (condition) {
    passed++
    results.push(`  ✓ ${testName}`)
  } else {
    failed++
    results.push(`  ✗ ${testName}`)
  }
}

async function request(method, path, { body, headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl)
    const opts = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    const req = http.request(opts, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        let json
        try { json = JSON.parse(data) } catch { json = null }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: json,
          raw: data,
        })
      })
    })

    req.on('error', reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

// ─── Test Suites ─────────────────────────────────────────────────────────────

async function testAuthSyncIpLimit() {
  console.log('\n── Auth Sync IP Rate Limit (10/IP/15min) ──')

  // Clean up rate limit entries for this test
  await RateLimit.deleteMany({ category: 'auth_sync_ip' })

  // Send 10 requests (all should pass, even with invalid tokens)
  for (let i = 1; i <= 10; i++) {
    const res = await request('POST', '/api/auth/sync', {
      headers: { Authorization: 'Bearer invalid-token-' + i },
    })
    // These will be 401 (invalid token) but should NOT be 429 yet
    assert(res.status !== 429, `Request ${i}/10 should not be rate limited (got ${res.status})`)
  }

  // 11th request should be rate limited
  const res11 = await request('POST', '/api/auth/sync', {
    headers: { Authorization: 'Bearer invalid-token-11' },
  })
  assert(res11.status === 429, `Request 11/10 should be 429 (got ${res11.status})`)
  assert(res11.headers['retry-after'], 'Should include Retry-After header')
  assert(
    res11.body?.message && !res11.body.message.includes('user') && !res11.body.message.includes('email'),
    'Error message should not reveal account info'
  )
}

async function testAuthSyncNoToken() {
  console.log('\n── Auth Sync Missing/Invalid Token ──')

  await RateLimit.deleteMany({ category: 'auth_sync_ip' })

  // No Authorization header
  const res1 = await request('POST', '/api/auth/sync')
  assert(res1.status === 401, `No token should return 401 (got ${res1.status})`)

  // Empty Bearer
  const res2 = await request('POST', '/api/auth/sync', {
    headers: { Authorization: 'Bearer ' },
  })
  assert(res2.status === 401 || res2.status === 429, `Empty bearer handled (got ${res2.status})`)

  // Malformed header
  const res3 = await request('POST', '/api/auth/sync', {
    headers: { Authorization: 'NotBearer sometoken' },
  })
  assert(res3.status === 401, `Malformed auth header returns 401 (got ${res3.status})`)
}

async function testPasswordResetIpLimit() {
  console.log('\n── Password Reset IP Rate Limit (5/IP/15min) ──')

  await RateLimit.deleteMany({ category: 'reset_ip' })
  await RateLimit.deleteMany({ category: 'reset_email' })

  // Send 5 requests (all should be 200)
  for (let i = 1; i <= 5; i++) {
    const res = await request('POST', '/api/auth/reset-password', {
      body: { email: `test-reset-${i}@example.com` },
    })
    assert(res.status === 200, `Reset request ${i}/5 should be 200 (got ${res.status})`)
  }

  // 6th request should be rate limited
  const res6 = await request('POST', '/api/auth/reset-password', {
    body: { email: 'test-reset-6@example.com' },
  })
  assert(res6.status === 429, `Reset request 6/5 should be 429 (got ${res6.status})`)
  assert(res6.headers['retry-after'], 'Should include Retry-After header')
}

async function testPasswordResetEmailLimit() {
  console.log('\n── Password Reset Per-Email Rate Limit (3/email/hour) ──')

  await RateLimit.deleteMany({ category: 'reset_ip' })
  await RateLimit.deleteMany({ category: 'reset_email' })

  const targetEmail = 'repeated-reset@example.com'

  // Send 3 requests for the same email (all should be 200)
  for (let i = 1; i <= 3; i++) {
    const res = await request('POST', '/api/auth/reset-password', {
      body: { email: targetEmail },
    })
    assert(res.status === 200, `Same-email reset ${i}/3 should be 200 (got ${res.status})`)
  }

  // 4th request for the same email should be rate limited
  const res4 = await request('POST', '/api/auth/reset-password', {
    body: { email: targetEmail },
  })
  assert(res4.status === 429, `Same-email reset 4/3 should be 429 (got ${res4.status})`)
}

async function testPasswordResetAntiEnumeration() {
  console.log('\n── Password Reset Anti-Enumeration ──')

  await RateLimit.deleteMany({ category: 'reset_ip' })
  await RateLimit.deleteMany({ category: 'reset_email' })

  // Request for a definitely non-existent email
  const res1 = await request('POST', '/api/auth/reset-password', {
    body: { email: 'definitely-does-not-exist-xyz123@nowhere.invalid' },
  })

  // Request for a known admin email (exists in Firebase)
  const res2 = await request('POST', '/api/auth/reset-password', {
    body: { email: process.env.ADMIN_EMAIL?.split(',')[0] || 'admin@vectors2026.com' },
  })

  // Both should return 200 with identical structure
  assert(res1.status === 200, `Non-existent email returns 200 (got ${res1.status})`)
  assert(res2.status === 200, `Existing email returns 200 (got ${res2.status})`)
  assert(
    res1.body?.message === res2.body?.message,
    `Identical response body for existing vs non-existing email`
  )

  // Request with no email
  const res3 = await request('POST', '/api/auth/reset-password', {
    body: { email: '' },
  })
  assert(res3.status === 200, `Empty email returns 200 (got ${res3.status})`)

  // Request with invalid email
  const res4 = await request('POST', '/api/auth/reset-password', {
    body: { email: 'not-an-email' },
  })
  assert(res4.status === 200, `Invalid email returns 200 (got ${res4.status})`)
}

async function testGateScannerLimit() {
  console.log('\n── Gate Scanner Rate Limit (30/IP/15min) ──')

  await RateLimit.deleteMany({ category: 'verify_ip' })

  // Send 30 requests (all should pass — they'll be 401 because no auth, but not 429)
  for (let i = 1; i <= 30; i++) {
    const res = await request('POST', `/api/verify/VEC-TEST${String(i).padStart(4, '0')}`)
    // Will be 401 (no auth) but should NOT be 429
    assert(res.status !== 429, `Scan ${i}/30 should not be rate limited (got ${res.status})`)
  }

  // 31st request should be rate limited
  const res31 = await request('POST', '/api/verify/VEC-TEST0031')
  assert(res31.status === 429, `Scan 31/30 should be 429 (got ${res31.status})`)
  assert(res31.headers['retry-after'], 'Should include Retry-After header')
}

async function testConcurrentRequests() {
  console.log('\n── Concurrent Requests at Boundary ──')

  await RateLimit.deleteMany({ category: 'auth_sync_ip' })

  // Send 9 sequential requests first
  for (let i = 1; i <= 9; i++) {
    await request('POST', '/api/auth/sync', {
      headers: { Authorization: 'Bearer concurrent-test-' + i },
    })
  }

  // Fire 5 concurrent requests at the boundary (only 1 should pass, 4 should be 429)
  const concurrent = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      request('POST', '/api/auth/sync', {
        headers: { Authorization: 'Bearer concurrent-burst-' + i },
      })
    )
  )

  const passed429 = concurrent.filter((r) => r.status === 429).length
  const passedNon429 = concurrent.filter((r) => r.status !== 429).length

  assert(passed429 >= 4, `At least 4 of 5 concurrent requests at limit should be 429 (got ${passed429})`)
  assert(passedNon429 >= 1, `At least 1 concurrent request should pass (got ${passedNon429})`)
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  RATE LIMIT INTEGRATION TESTS')
  console.log('═══════════════════════════════════════════')

  // Connect to DB
  await connectDB()
  console.log('Database connected')

  // Start the Express app
  app = require('../index.js')
  server = app.listen(0, () => {
    const port = server.address().port
    baseUrl = `http://127.0.0.1:${port}`
    console.log(`Test server on port ${port}`)
  })

  // Wait for server to be ready
  await new Promise((resolve) => server.on('listening', resolve))

  try {
    await testAuthSyncIpLimit()
    await testAuthSyncNoToken()
    await testPasswordResetIpLimit()
    await testPasswordResetEmailLimit()
    await testPasswordResetAntiEnumeration()
    await testGateScannerLimit()
    await testConcurrentRequests()
  } catch (err) {
    console.error('\n⚠ Unexpected test error:', err.message)
    failed++
  }

  // Print results
  console.log('\n═══════════════════════════════════════════')
  console.log('  RESULTS')
  console.log('═══════════════════════════════════════════')
  results.forEach((r) => console.log(r))
  console.log(`\n  Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`)
  console.log('═══════════════════════════════════════════\n')

  // Cleanup
  await RateLimit.deleteMany({
    category: { $in: ['auth_sync_ip', 'auth_sync_email_fail', 'reset_ip', 'reset_email', 'verify_ip'] },
  })

  server.close()
  await mongoose.disconnect()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
