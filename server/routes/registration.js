const express = require('express')
const router = express.Router()
const EntryRegistration = require('../models/EntryRegistration')
const { verifyFirebaseToken, requireRole } = require('../middleware/auth')

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASS_ID_REGEX = /^VEC-[A-Z0-9]{8}$/i

/**
 * POST /api/register
 * Register a new entry pass.
 * Requires authenticated user.
 */
router.post('/register', verifyFirebaseToken, async (req, res) => {
  try {
    const { name, email, phone, college } = req.body

    // 1. Validate required fields
    if (!name || !email || !phone || !college) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    // 2. Type and length checks (anti-spam / sanitization)
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof phone !== 'string' ||
      typeof college !== 'string'
    ) {
      return res.status(400).json({ message: 'Invalid field types provided.' })
    }

    const cleanName = name.trim().slice(0, 100)
    const cleanEmail = email.trim().toLowerCase().slice(0, 150)
    const cleanPhone = phone.trim().slice(0, 20)
    const cleanCollege = college.trim().slice(0, 150)

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanCollege) {
      return res.status(400).json({ message: 'Fields cannot be empty.' })
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' })
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
 * GET /api/verify/:registrationId
 * Verify an entry pass (used by gate scanner).
 * Requires security or admin role.
 */
router.get('/verify/:registrationId', verifyFirebaseToken, requireRole('security', 'admin'), async (req, res) => {
  try {
    const { registrationId } = req.params

    if (!registrationId || !PASS_ID_REGEX.test(registrationId.trim())) {
      return res.status(400).json({ status: 'INVALID', message: 'Malformed pass ID format.' })
    }

    const registration = await EntryRegistration.findOne({ registrationId: registrationId.trim().toUpperCase() })

    if (!registration) {
      return res.status(404).json({ status: 'INVALID', message: 'Pass not found.' })
    }

    if (registration.checkedIn) {
      return res.status(200).json({
        status: 'ALREADY_CHECKED_IN',
        name: registration.name,
        college: registration.college,
        checkInTimestamp: registration.checkInTimestamp,
        message: 'This pass has already been used.',
      })
    }

    // Mark as checked in
    registration.checkedIn = true
    registration.checkInTimestamp = new Date()
    await registration.save()

    res.status(200).json({
      status: 'VALID',
      name: registration.name,
      college: registration.college,
      message: 'Entry approved.',
    })
  } catch (error) {
    console.error('[API] Verify error:', error.message)
    res.status(500).json({ status: 'ERROR', message: 'Internal server error.' })
  }
})

module.exports = router
