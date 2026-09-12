/**
 * Automated Verification Suite for Final Production Blockers:
 * 1. Google Form / Team Registration Validation Bypass Fixes
 * 2. Check-In Endpoint POST Method, Role Authorization & Concurrency Atomicity
 * 3. Admin Event Registration Status Lifecycle Management
 */
require('dotenv').config()
const http = require('http')
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')

// Helper for generating valid VEC-XXXXXXXX pass IDs
function generatePassId() {
  const chars = '0123456789ABCDEF'
  let id = 'VEC-'
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return id
}

async function runFinalBlockersTest() {
  console.log('===============================================================')
  console.log('  VECTORS 26-27 FINAL PRODUCTION BLOCKERS VERIFICATION SUITE   ')
  console.log('===============================================================')

  const connectDB = require('../config/db')
  await connectDB()
  console.log('✓ Connected to MongoDB Atlas.')

  // Import models
  const Event = require('../models/Event')
  const EventRegistration = require('../models/EventRegistration')
  const EntryRegistration = require('../models/EntryRegistration')
  const User = require('../models/User')

  // Setup test users & passes in MongoDB
  const TEST_PREFIX = `test_${Date.now()}`
  const userEmail = `${TEST_PREFIX}_user@example.com`
  const user2Email = `${TEST_PREFIX}_user2@example.com`
  const user3Email = `${TEST_PREFIX}_user3@example.com`
  const securityEmail = `${TEST_PREFIX}_sec@example.com`
  const adminEmail = `${TEST_PREFIX}_adm@example.com`

  // Create test entry passes for test users
  const userPassId = generatePassId()
  await EntryRegistration.create({
    registrationId: userPassId,
    name: 'Audit Test User 1',
    email: userEmail,
    phone: '9876543210',
    college: 'Engineering Institute',
    branch: 'Computer Engineering',
    year: 'TE',
    checkedIn: false,
  })

  const user2PassId = generatePassId()
  await EntryRegistration.create({
    registrationId: user2PassId,
    name: 'Audit Test User 2',
    email: user2Email,
    phone: '9876543220',
    college: 'Engineering Institute',
    branch: 'IT',
    year: 'SE',
    checkedIn: false,
  })

  const user3PassId = generatePassId()
  await EntryRegistration.create({
    registrationId: user3PassId,
    name: 'Audit Test User 3',
    email: user3Email,
    phone: '9876543230',
    college: 'Engineering Institute',
    branch: 'EXTC',
    year: 'BE',
    checkedIn: false,
  })

  // Create test entry pass for gate check-in tests
  const gatePassId = generatePassId()
  await EntryRegistration.create({
    registrationId: gatePassId,
    name: 'Gate Checkin Test Subject',
    email: `${TEST_PREFIX}_gate@example.com`,
    phone: '9876543211',
    college: 'Gate Test College',
    branch: 'IT',
    year: 'BE',
    checkedIn: false,
  })

  // Create test team event
  const teamEventSlug = `${TEST_PREFIX}-team-event`
  await Event.create({
    slug: teamEventSlug,
    name: 'Final Audit Robo Wars',
    category: 'Technical',
    branch: 'Open to All',
    fee: 'Free',
    teamSize: '2–4 members',
    minTeamSize: 2,
    maxTeamSize: 4,
    capacity: 20,
    registrationCount: 0,
    registrationOpen: true,
    status: 'open',
    date: 'March 20, 2026',
    startTime: '10:00 IST',
    endTime: '16:00 IST',
    venue: 'Audit Arena',
    description: 'Audit test team event.',
    rules: ['Rule 1'],
    coordinators: [{ name: 'Coord', contact: '+91 99999 88888' }],
  })

  // Create test 3-member minimum team event
  const teamEvent3Slug = `${TEST_PREFIX}-team-event-3`
  await Event.create({
    slug: teamEvent3Slug,
    name: 'Audit 3-Person Team Event',
    category: 'Technical',
    fee: 'Free',
    teamSize: '3–5 members',
    minTeamSize: 3,
    maxTeamSize: 5,
    capacity: 20,
    registrationCount: 0,
    registrationOpen: true,
    status: 'open',
    description: 'Audit test 3-person event.',
    rules: ['Rule 1'],
    coordinators: [{ name: 'Coord', contact: '+91 99999 88888' }],
  })

  // Create test solo event
  const soloEventSlug = `${TEST_PREFIX}-solo-event`
  await Event.create({
    slug: soloEventSlug,
    name: 'Final Audit Solo Coding',
    category: 'Technical',
    branch: 'Open to All',
    fee: 'Free',
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 30,
    registrationCount: 0,
    registrationOpen: true,
    status: 'open',
    date: 'March 20, 2026',
    startTime: '10:00 IST',
    endTime: '12:00 IST',
    venue: 'Lab 1',
    description: 'Audit test solo event.',
    rules: ['Rule 1'],
    coordinators: [{ name: 'Coord', contact: '+91 99999 88888' }],
  })

  // Setup Dynamic Auth Token Map
  const mockTokenMap = new Map([
    ['token-user', { email: userEmail, role: 'user', firebaseUid: 'uid-user' }],
    ['token-user2', { email: user2Email, role: 'user', firebaseUid: 'uid-user2' }],
    ['token-user3', { email: user3Email, role: 'user', firebaseUid: 'uid-user3' }],
    ['token-security', { email: securityEmail, role: 'security', firebaseUid: 'uid-sec' }],
    ['token-admin', { email: adminEmail, role: 'admin', firebaseUid: 'uid-adm' }],
  ])

  // Setup Express test app with auth injection
  const originalAuth = require('../middleware/auth')
  const authPath = require.resolve('../middleware/auth')

  const mockAuth = {
    ...originalAuth,
    verifyFirebaseToken: async (req, res, next) => {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No authentication token provided.' })
      }
      const token = authHeader.split('Bearer ')[1]
      if (mockTokenMap.has(token)) {
        req.user = mockTokenMap.get(token)
        return next()
      }
      if (token === 'invalid-token') {
        return res.status(401).json({ message: 'Invalid or expired token.' })
      }
      // Delegate to real auth for any other token
      return originalAuth.verifyFirebaseToken(req, res, next)
    },
  }

  // Override require.cache so routes use mockAuth
  require.cache[authPath] = {
    id: authPath,
    filename: authPath,
    loaded: true,
    exports: mockAuth,
  }

  // Fresh load of routes
  delete require.cache[require.resolve('../routes/events')]
  delete require.cache[require.resolve('../routes/registration')]
  delete require.cache[require.resolve('../routes/admin')]

  const eventRoutes = require('../routes/events')
  const registrationRoutes = require('../routes/registration')
  const adminRoutes = require('../routes/admin')

  const app = express()
  app.use(cors())
  app.use(express.json())

  app.use('/api/events', eventRoutes)
  app.use('/api', registrationRoutes)
  app.use('/api/admin', adminRoutes)

  const server = http.createServer(app)
  await new Promise((resolve) => server.listen(0, resolve))
  const port = server.address().port
  const baseUrl = `http://127.0.0.1:${port}`

  let passedTests = 0
  let failedTests = 0

  async function assertTest(name, fn) {
    try {
      await fn()
      console.log(`  [PASS] ${name}`)
      passedTests++
    } catch (err) {
      console.error(`  [FAIL] ${name}: ${err.message}`)
      failedTests++
    }
  }

  console.log('\n--- TEST SUITE 1: Team & Google Form Validation (Blocker 1) ---')

  // 1. Team event + no teamMembers -> status must be 'pending_verification', NOT 'confirmed'
  await assertTest('Team event + no teamMembers -> pending_verification (not confirmed)', async () => {
    const res = await fetch(`${baseUrl}/api/events/${teamEventSlug}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-user',
      },
      body: JSON.stringify({}),
    })
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`)
    const data = await res.json()
    if (data.registration.status !== 'pending_verification') {
      throw new Error(`Expected status 'pending_verification', got '${data.registration.status}'`)
    }
    if (data.registration.teamName !== 'Pending — Google Form') {
      throw new Error(`Expected teamName 'Pending — Google Form', got '${data.registration.teamName}'`)
    }
  })

  // 2. Team event + too few teamMembers -> 400
  await assertTest('Team event + too few teamMembers -> 400 with team size error message', async () => {
    const res = await fetch(`${baseUrl}/api/events/${teamEvent3Slug}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-user2',
      },
      body: JSON.stringify({
        teamName: 'Understaffed',
        teamMembers: [{ name: 'Member 1', email: 'm1@example.com' }], // total 2, but min is 3
      }),
    })
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`)
    const data = await res.json()
    if (!data.message || !data.message.includes('Minimum team size')) {
      throw new Error(`Expected error message mentioning Minimum team size, got: ${data.message}`)
    }
  })

  // 3. Team event + valid teamMembers -> status: 'confirmed'
  await assertTest('Team event + valid teamMembers -> status: confirmed', async () => {
    const res = await fetch(`${baseUrl}/api/events/${teamEvent3Slug}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-user2',
      },
      body: JSON.stringify({
        teamName: 'Full Squad',
        teamMembers: [
          { name: 'Member 1', email: 'm1@example.com' },
          { name: 'Member 2', email: 'm2@example.com' },
        ], // total 3 = minTeamSize
      }),
    })
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`)
    const data = await res.json()
    if (data.registration.status !== 'confirmed') {
      throw new Error(`Expected status 'confirmed', got '${data.registration.status}'`)
    }
    if (data.registration.teamMembers.length !== 2) {
      throw new Error(`Expected 2 team members, got ${data.registration.teamMembers.length}`)
    }
  })

  // 4. Normal user attempting bypass with legacy flags (confirmedViaGoogleForm: true)
  await assertTest('Legacy flag confirmedViaGoogleForm: true does NOT grant confirmed status', async () => {
    const res = await fetch(`${baseUrl}/api/events/${teamEventSlug}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-user3',
      },
      body: JSON.stringify({
        confirmedViaGoogleForm: true, // Legacy exploit flag
        registrationType: 'team',
      }),
    })
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`)
    const data = await res.json()
    // Must STILL be pending_verification, NOT confirmed
    if (data.registration.status !== 'pending_verification') {
      throw new Error(`EXPLOIT DETECTED: Status was '${data.registration.status}' instead of 'pending_verification'`)
    }
  })

  // 5. Solo event registration -> always confirmed
  await assertTest('Solo event registration -> status: confirmed', async () => {
    const res = await fetch(`${baseUrl}/api/events/${soloEventSlug}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-user3',
      },
      body: JSON.stringify({ registrationType: 'solo' }),
    })
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`)
    const data = await res.json()
    if (data.registration.status !== 'confirmed') {
      throw new Error(`Expected status 'confirmed', got '${data.registration.status}'`)
    }
  })

  console.log('\n--- TEST SUITE 2: Check-In Endpoint POST & Authorization (Blocker 2) ---')

  // 1. GET /api/verify/:id does NOT perform check-in (returns 404)
  await assertTest('GET /api/verify/:id -> 404 Not Found (GET cannot check-in)', async () => {
    const res = await fetch(`${baseUrl}/api/verify/${gatePassId}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer token-security' },
    })
    if (res.status !== 404) throw new Error(`Expected 404 for GET, got ${res.status}`)
    // Ensure pass in DB was NOT checked in
    const checkPass = await EntryRegistration.findOne({ registrationId: gatePassId })
    if (checkPass.checkedIn) throw new Error('Pass was checked in by GET request!')
  })

  // 2. Unauthenticated POST -> 401
  await assertTest('Unauthenticated POST /api/verify/:id -> 401 Unauthorized', async () => {
    const res = await fetch(`${baseUrl}/api/verify/${gatePassId}`, {
      method: 'POST',
    })
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`)
  })

  // 3. Normal user POST -> 403 Forbidden
  await assertTest('Normal user POST /api/verify/:id -> 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/verify/${gatePassId}`, {
      method: 'POST',
      headers: { Authorization: 'Bearer token-user3' },
    })
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`)
  })

  // 4. Security user POST -> 200 VALID
  await assertTest('Security role POST /api/verify/:id -> 200 VALID (checkedIn = true)', async () => {
    const res = await fetch(`${baseUrl}/api/verify/${gatePassId}`, {
      method: 'POST',
      headers: { Authorization: 'Bearer token-security' },
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const data = await res.json()
    if (data.status !== 'VALID') throw new Error(`Expected status 'VALID', got '${data.status}'`)
    const checkPass = await EntryRegistration.findOne({ registrationId: gatePassId })
    if (!checkPass.checkedIn) throw new Error('Pass was NOT marked checkedIn: true in DB!')
  })

  // 5. Second scan of the same pass -> 200 ALREADY_CHECKED_IN
  await assertTest('Second scan POST /api/verify/:id -> 200 ALREADY_CHECKED_IN', async () => {
    const res = await fetch(`${baseUrl}/api/verify/${gatePassId}`, {
      method: 'POST',
      headers: { Authorization: 'Bearer token-security' },
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const data = await res.json()
    if (data.status !== 'ALREADY_CHECKED_IN') {
      throw new Error(`Expected status 'ALREADY_CHECKED_IN', got '${data.status}'`)
    }
  })

  // 6. Admin user POST -> allowed on valid pass
  const adminTestPassId = generatePassId()
  await EntryRegistration.create({
    registrationId: adminTestPassId,
    name: 'Admin Test Subject',
    email: `${TEST_PREFIX}_adm_subject@example.com`,
    phone: '9876543299',
    college: 'Audit College',
    checkedIn: false,
  })

  await assertTest('Admin role POST /api/verify/:id -> allowed (200 VALID)', async () => {
    const res = await fetch(`${baseUrl}/api/verify/${adminTestPassId}`, {
      method: 'POST',
      headers: { Authorization: 'Bearer token-admin' },
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const data = await res.json()
    if (data.status !== 'VALID') throw new Error(`Expected status 'VALID', got '${data.status}'`)
  })

  // 7. Race condition / concurrency check: two simultaneous scans of the same pass
  const concurrentPassId = generatePassId()
  await EntryRegistration.create({
    registrationId: concurrentPassId,
    name: 'Concurrency Test Subject',
    email: `${TEST_PREFIX}_race@example.com`,
    phone: '9876543255',
    college: 'Race College',
    checkedIn: false,
  })

  await assertTest('Simultaneous concurrent scans -> exactly one VALID, exactly one ALREADY_CHECKED_IN', async () => {
    const [res1, res2] = await Promise.all([
      fetch(`${baseUrl}/api/verify/${concurrentPassId}`, {
        method: 'POST',
        headers: { Authorization: 'Bearer token-security' },
      }),
      fetch(`${baseUrl}/api/verify/${concurrentPassId}`, {
        method: 'POST',
        headers: { Authorization: 'Bearer token-security' },
      }),
    ])

    const d1 = await res1.json()
    const d2 = await res2.json()

    const statuses = [d1.status, d2.status].sort()
    if (statuses[0] !== 'ALREADY_CHECKED_IN' || statuses[1] !== 'VALID') {
      throw new Error(`Race condition failure! Got statuses: [${statuses.join(', ')}]`)
    }
  })

  console.log('\n--- TEST SUITE 3: Admin Event Registration Status Management ---')

  // Find a pending registration
  const pendingReg = await EventRegistration.findOne({
    userEmail: userEmail,
    eventSlug: teamEventSlug,
    status: 'pending_verification',
  })

  if (!pendingReg) {
    throw new Error('Could not find pending registration to test admin approval!')
  }

  // Normal user cannot update status -> 403
  await assertTest('Normal user cannot update event registration status -> 403', async () => {
    const res = await fetch(`${baseUrl}/api/admin/event-registrations/${pendingReg._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-user3',
      },
      body: JSON.stringify({ status: 'confirmed' }),
    })
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`)
  })

  // Admin approves pending registration -> status becomes 'confirmed'
  await assertTest('Admin updates pending registration to confirmed -> 200 & status updated in DB', async () => {
    const res = await fetch(`${baseUrl}/api/admin/event-registrations/${pendingReg._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-admin',
      },
      body: JSON.stringify({ status: 'confirmed' }),
    })
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`)
    const data = await res.json()
    if (data.registration.status !== 'confirmed') {
      throw new Error(`Expected confirmed, got ${data.registration.status}`)
    }
    const updated = await EventRegistration.findById(pendingReg._id)
    if (updated.status !== 'confirmed') {
      throw new Error(`DB document not updated! Got ${updated.status}`)
    }
  })

  // Clean up test documents
  await Promise.all([
    Event.deleteMany({ slug: { $regex: `^${TEST_PREFIX}` } }),
    EventRegistration.deleteMany({ userEmail: { $regex: `^${TEST_PREFIX}` } }),
    EntryRegistration.deleteMany({ email: { $regex: `^${TEST_PREFIX}` } }),
  ])

  server.close()
  await mongoose.disconnect()

  console.log('\n===============================================================')
  console.log(`TEST SUMMARY: ${passedTests} passed, ${failedTests} failed.`)
  console.log('===============================================================')

  if (failedTests > 0) {
    process.exit(1)
  } else {
    process.exit(0)
  }
}

runFinalBlockersTest().catch((err) => {
  console.error('Test runner fatal error:', err)
  process.exit(1)
})
