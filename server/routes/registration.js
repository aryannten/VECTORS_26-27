const express = require('express')
const router = express.Router()
const EntryRegistration = require('../models/EntryRegistration')
const User = require('../models/User')
const { verifyFirebaseToken, requireRole } = require('../middleware/auth')

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASS_ID_REGEX = /^VEC-[A-Z0-9]{8}$/i

/**
 * POST /api/register
 * Register a new entry pass.
 * Requires authenticated user.
 * The pass email is always the authenticated user's email (ownership enforced).
 */
router.post('/register', verifyFirebaseToken, async (req, res) => {
  try {
    const { name, phone, college } = req.body

    // 1. Validate required fields
    if (!name || !phone || !college) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    // 2. Type and length checks (anti-spam / sanitization)
    if (
      typeof name !== 'string' ||
      typeof phone !== 'string' ||
      typeof college !== 'string'
    ) {
      return res.status(400).json({ message: 'Invalid field types provided.' })
    }

    const cleanName = name.trim().slice(0, 100)
    // Use authenticated user's email — prevents registering passes for other users
    const cleanEmail = req.user.email.toLowerCase().trim()
    const cleanPhone = phone.trim().slice(0, 20)
    const cleanCollege = college.trim().slice(0, 150)

    if (!cleanName || !cleanPhone || !cleanCollege) {
      return res.status(400).json({ message: 'Fields cannot be empty.' })
    }

    // 3. Check for existing registration
    const existing = await EntryRegistration.findOne({ email: cleanEmail })
    if (existing) {
      return res.status(409).json({
        message: 'This email is already registered.',
        registrationId: existing.registrationId,
      })
    }

    // 4. Create new registration
    const registration = await EntryRegistration.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      college: cleanCollege,
    })

    // Sync phone number to User account
    await User.findOneAndUpdate(
      { email: cleanEmail },
      { $set: { phone: cleanPhone } }
    ).catch(err => console.warn('[Registration] User phone sync notice:', err.message))

    res.status(201).json({
      message: 'Registration successful.',
      registrationId: registration.registrationId,
    })
  } catch (error) {
    console.error('[API] Registration error:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

/**
 * GET /api/register/status (and alias /api/status)
 * Check if the currently authenticated user has an entry pass.
 * Returns { hasPass: true, pass: { ... } } or { hasPass: false }
 */
router.get(['/register/status', '/status'], verifyFirebaseToken, async (req, res) => {
  try {
    const userEmail = req.user?.email?.toLowerCase()
    if (!userEmail) {
      return res.status(400).json({ message: 'User email not found in token.' })
    }

    const registration = await EntryRegistration.findOne({ email: userEmail })
    if (!registration) {
      return res.status(200).json({ hasPass: false })
    }

    return res.status(200).json({
      hasPass: true,
      pass: {
        registrationId: registration.registrationId,
        name: registration.name,
        college: registration.college,
        email: registration.email,
        phone: registration.phone,
        checkedIn: Boolean(registration.checkedIn || registration.day1CheckedIn || registration.day2CheckedIn),
        checkInTimestamp: registration.checkInTimestamp || registration.day1Timestamp || registration.day2Timestamp,
        day1CheckedIn: Boolean(registration.day1CheckedIn || registration.checkedIn),
        day1Timestamp: registration.day1Timestamp || registration.checkInTimestamp,
        day2CheckedIn: Boolean(registration.day2CheckedIn),
        day2Timestamp: registration.day2Timestamp,
        status: 'VERIFIED',
      },
    })
  } catch (error) {
    console.error('[API] Check pass status error:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

/**
 * POST /api/verify/:registrationId
 * Check in an entry pass (used by gate scanner).
 * Uses POST because this is a state-changing operation (sets checkedIn = true).
 * Requires security or admin role.
 * Uses atomic findOneAndUpdate to prevent race conditions when two scanners
 * scan the same pass simultaneously.
 */
router.post('/verify/:registrationId', verifyFirebaseToken, requireRole('security', 'admin'), async (req, res) => {
  try {
    const { registrationId } = req.params

    if (!registrationId || !PASS_ID_REGEX.test(registrationId.trim())) {
      return res.status(400).json({ status: 'INVALID', message: 'Malformed pass ID format.' })
    }

    const cleanId = registrationId.trim().toUpperCase()
    const targetDay = Number(req.query.day || req.body?.day) === 2 ? 2 : 1
    const now = new Date()

    // Atomic check-in: only update if not already checked in for target day
    const updateQuery = targetDay === 1
      ? { registrationId: cleanId, day1CheckedIn: { $ne: true } }
      : { registrationId: cleanId, day2CheckedIn: { $ne: true } }

    const updateSet = targetDay === 1
      ? { $set: { day1CheckedIn: true, day1Timestamp: now, checkedIn: true, checkInTimestamp: now } }
      : { $set: { day2CheckedIn: true, day2Timestamp: now, checkedIn: true } }

    const checkedInPass = await EntryRegistration.findOneAndUpdate(
      updateQuery,
      updateSet,
      { returnDocument: 'after' }
    )

    if (checkedInPass) {
      // Successfully checked in for the target day
      return res.status(200).json({
        status: 'VALID',
        day: targetDay,
        name: checkedInPass.name,
        college: checkedInPass.college,
        day1CheckedIn: Boolean(checkedInPass.day1CheckedIn),
        day1Timestamp: checkedInPass.day1Timestamp,
        day2CheckedIn: Boolean(checkedInPass.day2CheckedIn),
        day2Timestamp: checkedInPass.day2Timestamp,
        message: `Day ${targetDay} entry approved.`,
      })
    }

    // Not updated — either already checked in or pass doesn't exist
    const existingPass = await EntryRegistration.findOne({ registrationId: cleanId })

    if (!existingPass) {
      return res.status(404).json({ status: 'INVALID', message: 'Pass not found.' })
    }

    // Pass exists but was already checked in for this target day
    const targetTimestamp = targetDay === 1
      ? (existingPass.day1Timestamp || existingPass.checkInTimestamp)
      : existingPass.day2Timestamp

    return res.status(200).json({
      status: 'ALREADY_CHECKED_IN',
      day: targetDay,
      name: existingPass.name,
      college: existingPass.college,
      checkInTimestamp: targetTimestamp,
      day1CheckedIn: Boolean(existingPass.day1CheckedIn || (targetDay !== 2 && existingPass.checkedIn)),
      day1Timestamp: existingPass.day1Timestamp || existingPass.checkInTimestamp,
      day2CheckedIn: Boolean(existingPass.day2CheckedIn),
      day2Timestamp: existingPass.day2Timestamp,
      message: `This pass has already been checked in for Day ${targetDay}.`,
    })
  } catch (error) {
    console.error('[API] Verify error:', error.message)
    res.status(500).json({ status: 'ERROR', message: 'Internal server error.' })
  }
})

module.exports = router

