const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const EventRegistration = require('../models/EventRegistration')
const { verifyFirebaseToken, requireEntryPass, requireRole } = require('../middleware/auth')

// Regex for phone validation
const PHONE_REGEX = /^[0-9+\s-]{7,20}$/

/**
 * GET /api/events
 * Get all active events.
 * Public or authenticated.
 */
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ category: 1, name: 1 })
    res.status(200).json(events)
  } catch (error) {
    console.error('[API] Events fetch error:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

/**
 * GET /api/events/:slug
 * Get a single event by slug.
 */
router.get('/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug.toLowerCase(), isActive: true })
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' })
    }
    res.status(200).json(event)
  } catch (error) {
    console.error('[API] Event fetch error:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

/**
 * GET /api/events/:slug/my-registration
 * Check if the currently authenticated user is registered for this event.
 * Requires authenticated user.
 */
router.get('/:slug/my-registration', verifyFirebaseToken, async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase()
    const registration = await EventRegistration.findOne({
      eventSlug: req.params.slug.toLowerCase(),
      userEmail,
      status: { $ne: 'cancelled' },
    })

    if (!registration) {
      return res.status(200).json({ isRegistered: false })
    }

    res.status(200).json({
      isRegistered: true,
      registration,
    })
  } catch (error) {
    console.error('[API] My registration check error:', error.message)
    res.status(500).json({ message: 'Failed to verify event registration status.' })
  }
})

/**
 * POST /api/events/:slug/register
 * Register for an event in-app.
 * Requires:
 * 1. Authenticated User (verifyFirebaseToken)
 * 2. Verified Entry Pass (requireEntryPass)
 * 3. Input validation (participant info, team details, team size constraints)
 * 4. Concurrency-safe atomic capacity increment (prevents race conditions)
 * 5. Duplicate registration check
 */
router.post('/:slug/register', verifyFirebaseToken, requireEntryPass, async (req, res) => {
  const eventSlug = req.params.slug.toLowerCase()
  const userEmail = req.user.email.toLowerCase()

  try {
    const { name, phone, college, teamName, teamMembers } = req.body

    // 1. Validate required fields
    if (!name || !phone || !college) {
      return res.status(400).json({ message: 'Name, phone number, and college are required.' })
    }

    const cleanName = String(name).trim().slice(0, 100)
    const cleanPhone = String(phone).trim().slice(0, 20)
    const cleanCollege = String(college).trim().slice(0, 150)
    const cleanTeamName = teamName ? String(teamName).trim().slice(0, 100) : null

    if (!cleanName || !cleanPhone || !cleanCollege) {
      return res.status(400).json({ message: 'Fields cannot be empty.' })
    }

    if (!PHONE_REGEX.test(cleanPhone)) {
      return res.status(400).json({ message: 'Please provide a valid contact phone number.' })
    }

    // 2. Check for existing registration by this user for this event
    const existingRegistration = await EventRegistration.findOne({
      eventSlug,
      userEmail,
      status: { $ne: 'cancelled' },
    })

    if (existingRegistration) {
      return res.status(409).json({
        message: 'You are already registered for this event.',
        registrationId: existingRegistration.registrationId,
      })
    }

    // 3. Find event definition to check team rules
    const eventDef = await Event.findOne({ slug: eventSlug, isActive: true })
    if (!eventDef) {
      return res.status(404).json({ message: 'Event not found or inactive.' })
    }

    if (!eventDef.registrationOpen || ['closed', 'completed', 'full'].includes(eventDef.status)) {
      return res.status(400).json({ message: 'Registrations for this event are currently closed.' })
    }

    // 4. Validate team size if team event
    const validatedTeamMembers = []
    if (eventDef.maxTeamSize > 1) {
      // Primary participant counts as member 1
      if (Array.isArray(teamMembers) && teamMembers.length > 0) {
        for (const m of teamMembers) {
          if (!m.name || !m.email) {
            return res.status(400).json({ message: 'All team members must have a name and valid email.' })
          }
          validatedTeamMembers.push({
            name: String(m.name).trim().slice(0, 100),
            email: String(m.email).trim().toLowerCase().slice(0, 150),
            phone: m.phone ? String(m.phone).trim().slice(0, 20) : '',
            college: m.college ? String(m.college).trim().slice(0, 150) : cleanCollege,
          })
        }
      }

      const totalTeamSize = 1 + validatedTeamMembers.length
      if (totalTeamSize < eventDef.minTeamSize) {
        return res.status(400).json({
          message: `Minimum team size for ${eventDef.name} is ${eventDef.minTeamSize} members (including team lead). Current: ${totalTeamSize}.`,
        })
      }
      if (totalTeamSize > eventDef.maxTeamSize) {
        return res.status(400).json({
          message: `Maximum team size for ${eventDef.name} is ${eventDef.maxTeamSize} members. Current: ${totalTeamSize}.`,
        })
      }
    }

    // 5. Atomic Capacity Check & Reservation (Concurrency Safe)
    const updatedEvent = await Event.findOneAndUpdate(
      {
        slug: eventSlug,
        isActive: true,
        registrationOpen: true,
        $expr: {
          $or: [
            { $eq: ['$capacity', 0] }, // 0 = unlimited capacity
            { $lt: ['$registrationCount', '$capacity'] },
          ],
        },
      },
      { $inc: { registrationCount: 1 } },
      { new: true }
    )

    if (!updatedEvent) {
      return res.status(409).json({ message: 'Event has reached full capacity. Registration is closed.' })
    }

    // Update status if capacity reached
    if (updatedEvent.capacity > 0 && updatedEvent.registrationCount >= updatedEvent.capacity) {
      updatedEvent.status = 'full'
      await updatedEvent.save()
    } else if (updatedEvent.capacity > 0 && updatedEvent.registrationCount >= updatedEvent.capacity * 0.85) {
      updatedEvent.status = 'almost_full'
      await updatedEvent.save()
    }

    // 6. Create Event Registration record
    let registration
    try {
      registration = await EventRegistration.create({
        eventSlug,
        eventName: updatedEvent.name,
        eventCategory: updatedEvent.category,
        userEmail,
        userName: cleanName,
        userPhone: cleanPhone,
        userCollege: cleanCollege,
        teamName: cleanTeamName,
        teamMembers: validatedTeamMembers,
        status: 'confirmed',
      })
    } catch (createErr) {
      // Rollback atomic counter increment if registration document creation failed
      await Event.findOneAndUpdate({ slug: eventSlug }, { $inc: { registrationCount: -1 } })
      throw createErr
    }

    console.log(`[Registration] Confirmed ${registration.registrationId} for ${userEmail} in ${eventSlug}`)

    res.status(201).json({
      message: 'Event registration confirmed successfully.',
      registration: {
        registrationId: registration.registrationId,
        eventSlug: registration.eventSlug,
        eventName: registration.eventName,
        eventCategory: registration.eventCategory,
        userName: registration.userName,
        teamName: registration.teamName,
        teamMembers: registration.teamMembers,
        status: registration.status,
        date: updatedEvent.date,
        venue: updatedEvent.venue,
        venueDetails: updatedEvent.venueDetails,
        createdAt: registration.createdAt,
      },
    })
  } catch (error) {
    console.error('[API] Event registration error:', error.message)
    res.status(500).json({ message: error.message || 'Failed to complete event registration.' })
  }
})

module.exports = router
