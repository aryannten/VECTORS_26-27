/**
 * Automated API Endpoint and Route Integration Tests
 */
require('dotenv').config()
const http = require('http')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')

// Import routers
const connectDB = require('../config/db')
const eventRoutes = require('../routes/events')
const announcementRoutes = require('../routes/announcements')
const userRoutes = require('../routes/user')
const adminRoutes = require('../routes/admin')

async function runApiTests() {
  console.log('--- Starting VECTORS 26-27 API Endpoint Integration Tests ---')

  await connectDB()
  console.log('✓ MongoDB connected for API testing.')

  const app = express()
  app.use(cors())
  app.use(express.json())

  // Mount test routers
  app.use('/api/events', eventRoutes)
  app.use('/api/announcements', announcementRoutes)
  app.use('/api/user', userRoutes)
  app.use('/api/admin', adminRoutes)
  app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }))

  const server = http.createServer(app)
  await new Promise((resolve) => server.listen(0, resolve))
  const port = server.address().port
  const baseUrl = `http://127.0.0.1:${port}`
  console.log(`✓ Test HTTP server listening on ${baseUrl}`)

  let allPassed = true

  const testEndpoint = async (name, url, options, expectedStatus, validator) => {
    try {
      const res = await fetch(baseUrl + url, options)
      if (res.status !== expectedStatus) {
        console.error(`✗ FAIL: ${name} — Expected status ${expectedStatus}, got ${res.status}`)
        allPassed = false
        return
      }
      const data = await res.json()
      if (validator && !validator(data)) {
        console.error(`✗ FAIL: ${name} — Validator check failed. Payload:`, data)
        allPassed = false
        return
      }
      console.log(`✓ PASS: ${name} (Status: ${res.status})`)
    } catch (err) {
      console.error(`✗ ERROR: ${name} — ${err.message}`)
      allPassed = false
    }
  }

  // 1. Health check
  await testEndpoint(
    'GET /api/health',
    '/api/health',
    { method: 'GET' },
    200,
    (d) => d.status === 'ok'
  )

  // 2. Events list
  await testEndpoint(
    'GET /api/events (Public Event Vault)',
    '/api/events',
    { method: 'GET' },
    200,
    (d) => Array.isArray(d) && d.length > 0 && d.some((e) => e.slug === 'hackathon')
  )

  // 3. Single event detail
  await testEndpoint(
    'GET /api/events/hackathon (Event Detail)',
    '/api/events/hackathon',
    { method: 'GET' },
    200,
    (d) => d.slug === 'hackathon' && d.capacity === 50
  )

  // 4. Announcements feed
  await testEndpoint(
    'GET /api/announcements (Public Broadcasts)',
    '/api/announcements',
    { method: 'GET' },
    200,
    (d) => Array.isArray(d) && d.length > 0
  )

  // 5. Announcements with category filter
  await testEndpoint(
    'GET /api/announcements?category=urgent',
    '/api/announcements?category=urgent',
    { method: 'GET' },
    200,
    (d) => Array.isArray(d) && d.every((a) => a.category === 'urgent')
  )

  // 6. Event registration without auth (Must be rejected with 401)
  await testEndpoint(
    'POST /api/events/hackathon/register (No Auth -> 401)',
    '/api/events/hackathon/register',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationType: 'solo' }),
    },
    401,
    (d) => d.message && d.message.toLowerCase().includes('token')
  )

  // 7. User dashboard without auth (Must be rejected with 401)
  await testEndpoint(
    'GET /api/user/dashboard (No Auth -> 401)',
    '/api/user/dashboard',
    { method: 'GET' },
    401,
    (d) => d.message && d.message.toLowerCase().includes('token')
  )

  // 8. Admin stats without auth (Must be rejected with 401)
  await testEndpoint(
    'GET /api/admin/stats (No Auth -> 401)',
    '/api/admin/stats',
    { method: 'GET' },
    401,
    (d) => d.message && d.message.toLowerCase().includes('token')
  )

  // 9. Admin event registrations without auth (Must be rejected with 401)
  await testEndpoint(
    'GET /api/admin/event-registrations (No Auth -> 401)',
    '/api/admin/event-registrations',
    { method: 'GET' },
    401,
    (d) => d.message && d.message.toLowerCase().includes('token')
  )

  // Teardown
  server.close()
  await mongoose.disconnect()

  if (allPassed) {
    console.log('\n✓ ALL 9 API ENDPOINT AND SECURITY SUITE TESTS PASSED!')
    process.exit(0)
  } else {
    console.error('\n✗ ONE OR MORE TESTS FAILED.')
    process.exit(1)
  }
}

runApiTests()
