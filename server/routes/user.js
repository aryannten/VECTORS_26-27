const express = require('express')
const router = express.Router()
const EventRegistration = require('../models/EventRegistration')
const EntryRegistration = require('../models/EntryRegistration')
const Event = require('../models/Event')
const Announcement = require('../models/Announcement')
const { verifyFirebaseToken } = require('../middleware/auth')

/**
 * GET /api/user/dashboard
 * Centralized dashboard summary for the logged-in user.
 */
router.get('/dashboard', verifyFirebaseToken, async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase()

    // 1. Fetch user's entry pass
    const entryPass = await EntryRegistration.findOne({ email: userEmail })

    // 2. Fetch user's event registrations
    const eventRegistrations = await EventRegistration.find({
      userEmail,
      status: { $ne: 'cancelled' },
    }).sort({ createdAt: -1 })

    // Enrich registrations with current event schedule/venue details
    const slugs = eventRegistrations.map((r) => r.eventSlug)
    const events = await Event.find({ slug: { $in: slugs } })
    const eventMap = new Map(events.map((e) => [e.slug, e]))

    const enrichedRegistrations = eventRegistrations.map((reg) => {
      const liveEvent = eventMap.get(reg.eventSlug)
      return {
        registrationId: reg.registrationId,
        eventSlug: reg.eventSlug,
        eventName: reg.eventName,
        eventCategory: reg.eventCategory,
        teamName: reg.teamName,
        teamMembers: reg.teamMembers,
        status: reg.status,
        checkedIn: reg.checkedIn,
        date: liveEvent?.date || 'March 15-16, 2026',
        startTime: liveEvent?.startTime || '09:00 IST',
        venue: liveEvent?.venue || 'Campus Main Block',
        venueDetails: liveEvent?.venueDetails,
        createdAt: reg.createdAt,
      }
    })

    // 3. Fetch latest announcements
    const recentAnnouncements = await Announcement.find({ isPublished: true })
      .sort({ isPinned: -1, publishedAt: -1 })
      .limit(5)

    res.status(200).json({
      user: {
        id: req.user._id,
        email: req.user.email,
        displayName: req.user.displayName,
        role: req.user.role,
      },
      hasPass: Boolean(entryPass),
      entryPass: entryPass
        ? {
            registrationId: entryPass.registrationId,
            name: entryPass.name,
            college: entryPass.college,
            email: entryPass.email,
            checkedIn: entryPass.checkedIn,
            checkInTimestamp: entryPass.checkInTimestamp,
            status: 'VERIFIED',
          }
        : null,
      registeredEvents: enrichedRegistrations,
      announcements: recentAnnouncements,
    })
  } catch (error) {
    console.error('[User Dashboard] Error:', error.message)
    res.status(500).json({ message: 'Failed to retrieve dashboard data.' })
  }
})

/**
 * GET /api/user/registrations
 * Returns all active event registrations for the user.
 */
router.get('/registrations', verifyFirebaseToken, async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase()
    const registrations = await EventRegistration.find({
      userEmail,
      status: { $ne: 'cancelled' },
    }).sort({ createdAt: -1 })
    res.status(200).json(registrations)
  } catch (error) {
    console.error('[User Registrations] Error:', error.message)
    res.status(500).json({ message: 'Failed to retrieve event registrations.' })
  }
})

/**
 * DELETE /api/user/registrations/:registrationId
 * Cancel an event registration and atomically release event capacity.
 */
router.delete('/registrations/:registrationId', verifyFirebaseToken, async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase()
    const regId = req.params.registrationId.trim().toUpperCase()

    const registration = await EventRegistration.findOne({
      registrationId: regId,
      userEmail,
      status: 'confirmed',
    })

    if (!registration) {
      return res.status(404).json({ message: 'Active registration not found or already cancelled.' })
    }

    registration.status = 'cancelled'
    await registration.save()

    // Atomically release 1 slot on the event
    await Event.findOneAndUpdate(
      { slug: registration.eventSlug, registrationCount: { $gt: 0 } },
      { $inc: { registrationCount: -1 } }
    )

    console.log(`[Registration Cancelled] ${regId} by ${userEmail}`)
    res.status(200).json({ message: 'Registration cancelled successfully.' })
  } catch (error) {
    console.error('[User Registration Cancel] Error:', error.message)
    res.status(500).json({ message: 'Failed to cancel registration.' })
  }
})

module.exports = router
