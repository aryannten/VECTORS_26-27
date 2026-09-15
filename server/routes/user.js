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
    const entryPass = await EntryRegistration.findOne({ email: userEmail }).lean()

    // 2. Fetch user's event registrations
    const eventRegistrations = await EventRegistration.find({
      userEmail,
      status: { $ne: 'cancelled' },
    }).sort({ createdAt: -1 }).lean()

    const enrichedRegistrations = eventRegistrations.map((reg) => {
      return {
        registrationId: reg.registrationId,
        eventSlug: reg.eventSlug,
        eventName: reg.eventName,
        eventCategory: reg.eventCategory,
        teamName: reg.teamName,
        teamMembers: reg.teamMembers,
        status: reg.status,
        checkedIn: reg.checkedIn,
        createdAt: reg.createdAt,
      }
    })

    // 3. Fetch latest announcements
    const recentAnnouncements = await Announcement.find({ isPublished: true })
      .sort({ isPinned: -1, publishedAt: -1 })
      .limit(5)
      .lean()

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
            checkedIn: Boolean(entryPass.checkedIn || entryPass.day1CheckedIn || entryPass.day2CheckedIn),
            checkInTimestamp: entryPass.checkInTimestamp || entryPass.day1Timestamp || entryPass.day2Timestamp,
            day1CheckedIn: Boolean(entryPass.day1CheckedIn || entryPass.checkedIn),
            day1Timestamp: entryPass.day1Timestamp || entryPass.checkInTimestamp,
            day2CheckedIn: Boolean(entryPass.day2CheckedIn),
            day2Timestamp: entryPass.day2Timestamp,
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
    }).sort({ createdAt: -1 }).lean()
    res.status(200).json(registrations)
  } catch (error) {
    console.error('[User Registrations] Error:', error.message)
    res.status(500).json({ message: 'Failed to retrieve event registrations.' })
  }
})

/**
 * DELETE /api/user/registrations/:registrationId
 * Disallowed: Event registrations are permanent once confirmed.
 */
router.delete('/registrations/:registrationId', verifyFirebaseToken, async (req, res) => {
  return res.status(403).json({
    message: 'Event registrations are permanent and cannot be deleted or cancelled once confirmed.'
  })
})

module.exports = router
