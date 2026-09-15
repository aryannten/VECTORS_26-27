const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const EventRegistration = require('../models/EventRegistration')
const { verifyFirebaseToken, requireEntryPass, requireRole } = require('../middleware/auth')

const officialEvents = require('../data/officialEvents')
const memoryCache = require('../utils/cache')

// Regex for phone validation
const PHONE_REGEX = /^[0-9+\s-]{7,20}$/

/**
 * GET /api/events
 * Get all active events.
 * Public or authenticated. Cached for 60s with Edge CDN stale-while-revalidate.
 */
router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600')
    const cached = memoryCache.get('events:all')
    if (cached) {
      return res.status(200).json(cached)
    }

    const events = await Event.find({ isActive: true }).sort({ category: 1, name: 1 }).lean()
    if (events && events.length > 0) {
      memoryCache.set('events:all', events, 60)
      return res.status(200).json(events)
    }
    // Fallback to official brochure events if DB not yet seeded
    memoryCache.set('events:all', officialEvents, 60)
    res.status(200).json(officialEvents)
  } catch (error) {
    console.warn('[API] Events fetch using fallback official brochure events:', error.message)
    res.status(200).json(officialEvents)
  }
})

/**
 * GET /api/events/:slug
 * Get a single event by slug.
 */
router.get('/:slug', async (req, res) => {
  const reqSlug = req.params.slug.toLowerCase()
  try {
    res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600')
    const cacheKey = `event:${reqSlug}`
    const cached = memoryCache.get(cacheKey)
    if (cached) {
      return res.status(200).json(cached)
    }

    const event = await Event.findOne({ slug: reqSlug, isActive: true }).lean()
    if (event) {
      memoryCache.set(cacheKey, event, 120)
      return res.status(200).json(event)
    }
    const fallback = officialEvents.find((e) => e.slug === reqSlug)
    if (fallback) {
      memoryCache.set(cacheKey, fallback, 120)
      return res.status(200).json(fallback)
    }
    res.status(404).json({ message: 'Event not found.' })
  } catch (error) {
    const fallback = officialEvents.find((e) => e.slug === reqSlug)
    if (fallback) {
      return res.status(200).json(fallback)
    }
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
 * Register for an event.
 * Requires:
 * 1. Authenticated User (verifyFirebaseToken)
 * 2. Verified Entry Pass (requireEntryPass)
 * 3. Input validation (participant info, team details, team size constraints)
 * 4. Concurrency-safe atomic registration counter (metric only — no capacity gate)
 * 5. Duplicate registration check
 *
 * Registration modes:
 * - Solo events (maxTeamSize == 1): always 'confirmed' — no team data needed.
 * - Team events with valid teamMembers: validates min/max team size → 'confirmed'.
 * - Team events WITHOUT teamMembers (external Google Form claim): creates registration
 *   as 'pending_verification'. The backend has no trusted integration with the external
 *   Google Form, so it cannot treat a client click as proof of completed registration.
 *   An admin must verify these registrations against actual Google Form responses.
 *
 * The verified Entry Pass (req.entryPass) provides trusted defaults for name, phone,
 * and college, supporting both flows without a client-controlled bypass flag.
 */
router.post('/:slug/register', verifyFirebaseToken, requireEntryPass, async (req, res) => {
  const eventSlug = req.params.slug.toLowerCase()
  const userEmail = req.user.email.toLowerCase()

  try {
    const { name, phone, college, teamName, teamMembers } = req.body

    // Use verified Entry Pass data as trusted defaults (requireEntryPass guarantees req.entryPass)
    const effectiveName = (name && typeof name === 'string' && name.trim())
      || req.entryPass.name
      || req.user.displayName
    const effectivePhone = (phone && typeof phone === 'string' && phone.trim())
      || req.entryPass.phone
    const effectiveCollege = (college && typeof college === 'string' && college.trim())
      || req.entryPass.college

    if (!effectiveName || !effectivePhone || !effectiveCollege) {
      return res.status(400).json({ message: 'Participant identity details are required. Please ensure your Entry Pass has complete information.' })
    }

    const cleanName = String(effectiveName).trim().slice(0, 100)
    const cleanPhone = String(effectivePhone).trim().slice(0, 20)
    const cleanCollege = String(effectiveCollege).trim().slice(0, 150)
    const cleanTeamName = teamName ? String(teamName).trim().slice(0, 100) : null

    // Validate phone format only when client provides a phone explicitly
    // (entry pass phone was already validated during pass registration)
    if (phone && typeof phone === 'string' && phone.trim() && !PHONE_REGEX.test(cleanPhone)) {
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
        message: existingRegistration.status === 'pending_verification'
          ? 'Your registration is pending admin verification. Please wait for confirmation.'
          : 'You are already registered for this event.',
        registrationId: existingRegistration.registrationId,
        status: existingRegistration.status,
      })
    }

    // 3. Find event definition to check status
    const eventDef = await Event.findOne({ slug: eventSlug, isActive: true })
    if (!eventDef) {
      return res.status(404).json({ message: 'Event not found or inactive.' })
    }

    if (!eventDef.registrationOpen || ['closed', 'completed'].includes(eventDef.status)) {
      return res.status(400).json({ message: 'Registrations for this event are currently closed.' })
    }

    // 4. Determine registration mode and validate accordingly
    const isTeamEvent = eventDef.maxTeamSize > 1
    const hasTeamMembers = Array.isArray(teamMembers) && teamMembers.length > 0
    const validatedTeamMembers = []
    let registrationStatus = 'confirmed'

    if (isTeamEvent) {
      if (hasTeamMembers) {
        // In-app team registration: validate team members against min/max constraints
        for (const m of teamMembers) {
          if (!m || typeof m !== 'object') continue
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
      } else {
        // External Google Form claim: no team data provided for a team event.
        // The backend cannot verify the external Google Form was actually completed.
        // Record as 'pending_verification' — admin must confirm after cross-referencing.
        registrationStatus = 'pending_verification'
      }
    }

    // 5. Atomic Registration Counter Increment (metric — no capacity gate)
    const updatedEvent = await Event.findOneAndUpdate(
      {
        slug: eventSlug,
        isActive: true,
        registrationOpen: true,
        status: { $nin: ['closed', 'completed'] },
      },
      { $inc: { registrationCount: 1 } },
      { returnDocument: 'after' }
    )

    if (!updatedEvent) {
      return res.status(400).json({ message: 'Registrations for this event are currently closed.' })
    }

    // 6. Create Event Registration record
    const resolvedTeamName = cleanTeamName
      || (registrationStatus === 'pending_verification' ? 'Pending — Google Form' : null)

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
        teamName: resolvedTeamName,
        teamMembers: validatedTeamMembers,
        status: registrationStatus,
      })
    } catch (createErr) {
      // Rollback atomic counter increment if registration document creation failed
      await Event.findOneAndUpdate({ slug: eventSlug }, { $inc: { registrationCount: -1 } })
      throw createErr
    }

    // Invalidate cached event counts
    memoryCache.del('events:all')
    memoryCache.del(`event:${eventSlug}`)

    const statusLabel = registrationStatus === 'pending_verification'
      ? 'pending admin verification'
      : 'confirmed'
    console.log(`[Registration] ${statusLabel}: ${registration.registrationId} for ${userEmail} in ${eventSlug}`)

    const responseMessage = registrationStatus === 'pending_verification'
      ? 'Your registration has been recorded and is pending admin verification. An admin will confirm it after cross-referencing with the Google Form responses.'
      : 'Event registration confirmed successfully.'

    res.status(201).json({
      message: responseMessage,
      registration: {
        registrationId: registration.registrationId,
        eventSlug: registration.eventSlug,
        eventName: registration.eventName,
        eventCategory: registration.eventCategory,
        userName: registration.userName,
        teamName: registration.teamName,
        teamMembers: registration.teamMembers,
        status: registration.status,
        createdAt: registration.createdAt,
      },
    })
  } catch (error) {
    console.error('[API] Event registration error:', error.message)
    res.status(500).json({ message: 'Failed to complete event registration.' })
  }
})

module.exports = router
