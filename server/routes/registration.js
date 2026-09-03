const express = require('express')
const router = express.Router()
const EntryRegistration = require('../models/EntryRegistration')

/**
 * POST /api/register
 * Register a new entry pass.
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, college } = req.body

    // Validate required fields
    if (!name || !email || !phone || !college) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    // Check for existing registration
    const existing = await EntryRegistration.findOne({ email })
    if (existing) {
      return res.status(409).json({
        message: 'This email is already registered.',
        registrationId: existing.registrationId,
      })
    }

    // Create new registration
    const registration = await EntryRegistration.create({ name, email, phone, college })

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
 * Verify an entry pass (used by security scanner).
 */
router.get('/verify/:registrationId', async (req, res) => {
  try {
    const { registrationId } = req.params
    const registration = await EntryRegistration.findOne({ registrationId })

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
