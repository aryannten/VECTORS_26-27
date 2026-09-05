const express = require('express')
const router = express.Router()
const { getAuth } = require('firebase-admin/auth')
const { verifyFirebaseToken, requireRole } = require('../middleware/auth')
const User = require('../models/User')
const EntryRegistration = require('../models/EntryRegistration')
const Event = require('../models/Event')
const EventRegistration = require('../models/EventRegistration')
const AuditLog = require('../models/AuditLog')

// All admin routes require admin role
router.use(verifyFirebaseToken, requireRole('admin'))

/**
 * GET /api/admin/stats
 * Dashboard overview statistics.
 */
router.get('/stats', async (req, res) => {
  try {
    const [
      totalRegistrations,
      checkedInCount,
      totalEvents,
      totalUsers,
      securityUsers,
      totalEventRegistrations,
    ] = await Promise.all([
      EntryRegistration.countDocuments(),
      EntryRegistration.countDocuments({ checkedIn: true }),
      Event.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ role: 'security' }),
      EventRegistration.countDocuments({ status: 'confirmed' }),
    ])

    res.status(200).json({
      totalRegistrations,
      checkedInCount,
      totalEvents,
      totalUsers,
      securityUsers,
      totalEventRegistrations,
    })
  } catch (error) {
    console.error('[Admin] Stats error:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

/**
 * GET /api/admin/registrations
 * Paginated list of all entry registrations with search.
 * Query params: page, limit, search
 */
router.get('/registrations', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const search = req.query.search || ''
    const skip = (page - 1) * limit

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { college: { $regex: search, $options: 'i' } },
            { registrationId: { $regex: search, $options: 'i' } },
          ],
        }
      : {}

    const [registrations, total] = await Promise.all([
      EntryRegistration.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      EntryRegistration.countDocuments(filter),
    ])

    res.status(200).json({
      registrations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[Admin] Registrations error:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

/**
 * GET /api/admin/event-registrations
 * Paginated list of all event-specific registrations with search & filters.
 * Query params: page, limit, search, eventSlug
 */
router.get('/event-registrations', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const search = req.query.search || ''
    const eventSlug = req.query.eventSlug || ''
    const skip = (page - 1) * limit

    const filter = {}
    if (eventSlug) {
      filter.eventSlug = eventSlug.toLowerCase()
    }
    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { userCollege: { $regex: search, $options: 'i' } },
        { registrationId: { $regex: search, $options: 'i' } },
        { teamName: { $regex: search, $options: 'i' } },
        { eventName: { $regex: search, $options: 'i' } },
      ]
    }

    const [registrations, total] = await Promise.all([
      EventRegistration.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      EventRegistration.countDocuments(filter),
    ])

    res.status(200).json({
      registrations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[Admin] Event Registrations error:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

/**
 * GET /api/admin/event-registrations/export
 * Export event registrations as CSV.
 * Optional query param: eventSlug
 */
router.get('/event-registrations/export', async (req, res) => {
  try {
    const { eventSlug } = req.query
    const filter = {}
    if (eventSlug) filter.eventSlug = eventSlug.toLowerCase()

    const records = await EventRegistration.find(filter).sort({ createdAt: -1 })

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""'
      const str = String(val).replace(/"/g, '""')
      return `"${str}"`
    }

    const headers = [
      'Registration ID',
      'Event Name',
      'Event Slug',
      'User Name',
      'User Email',
      'User Phone',
      'User College',
      'Team Name',
      'Team Members',
      'Status',
      'Created At',
    ]

    const rows = records.map((r) => {
      const teamMems = (r.teamMembers || [])
        .map((m) => `${m.name} (${m.email || 'N/A'})`)
        .join('; ')
      return [
        escapeCsv(r.registrationId),
        escapeCsv(r.eventName),
        escapeCsv(r.eventSlug),
        escapeCsv(r.userName),
        escapeCsv(r.userEmail),
        escapeCsv(r.userPhone || ''),
        escapeCsv(r.userCollege || ''),
        escapeCsv(r.teamName || ''),
        escapeCsv(teamMems),
        escapeCsv(r.status),
        escapeCsv(r.createdAt ? new Date(r.createdAt).toISOString() : ''),
      ].join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\n')
    const filename = `vectors_event_registrations_${eventSlug || 'all'}_${Date.now()}.csv`

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    return res.status(200).send(csvContent)
  } catch (error) {
    console.error('[Admin] Export event registrations error:', error.message)
    res.status(500).json({ message: 'Failed to export CSV.' })
  }
})

/**
 * GET /api/admin/registrations/export
 * Export entry pass registrations as CSV.
 */
router.get('/registrations/export', async (req, res) => {
  try {
    const records = await EntryRegistration.find().sort({ createdAt: -1 })

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""'
      const str = String(val).replace(/"/g, '""')
      return `"${str}"`
    }

    const headers = [
      'Pass ID',
      'Name',
      'Email',
      'Phone',
      'College',
      'Branch',
      'Year',
      'Checked In',
      'Checked In At',
      'Created At',
    ]

    const rows = records.map((r) => [
      escapeCsv(r.registrationId),
      escapeCsv(r.name),
      escapeCsv(r.email),
      escapeCsv(r.phone),
      escapeCsv(r.college),
      escapeCsv(r.branch),
      escapeCsv(r.year),
      escapeCsv(r.checkedIn ? 'YES' : 'NO'),
      escapeCsv(r.checkedInAt ? new Date(r.checkedInAt).toISOString() : ''),
      escapeCsv(r.createdAt ? new Date(r.createdAt).toISOString() : ''),
    ].join(','))

    const csvContent = [headers.join(','), ...rows].join('\n')
    const filename = `vectors_entry_passes_${Date.now()}.csv`

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    return res.status(200).send(csvContent)
  } catch (error) {
    console.error('[Admin] Export entry passes error:', error.message)
    res.status(500).json({ message: 'Failed to export CSV.' })
  }
})

/**
 * PUT /api/admin/events/:id
 * Admin updates event properties (capacity, status, venue, deadline, registrationOpen).
 */
router.put('/events/:id', async (req, res) => {
  try {
    const {
      capacity,
      registrationOpen,
      status,
      venue,
      venueDetails,
      date,
      startTime,
      endTime,
      registrationDeadline,
      prizePool,
    } = req.body

    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' })
    }

    const previousState = {
      capacity: event.capacity,
      registrationOpen: event.registrationOpen,
      status: event.status,
      venue: event.venue,
    }

    if (capacity !== undefined) event.capacity = Number(capacity)
    if (registrationOpen !== undefined) event.registrationOpen = Boolean(registrationOpen)
    if (status !== undefined) event.status = status
    if (venue !== undefined) event.venue = venue
    if (venueDetails !== undefined) event.venueDetails = { ...event.venueDetails, ...venueDetails }
    if (date !== undefined) event.date = date
    if (startTime !== undefined) event.startTime = startTime
    if (endTime !== undefined) event.endTime = endTime
    if (registrationDeadline !== undefined) event.registrationDeadline = registrationDeadline
    if (prizePool !== undefined) event.prizePool = prizePool

    await event.save()

    // Audit log
    await AuditLog.create({
      action: 'EVENT_UPDATED',
      performedBy: req.user.email,
      targetType: 'Event',
      targetId: event._id.toString(),
      details: {
        slug: event.slug,
        name: event.name,
        previousState,
        newState: {
          capacity: event.capacity,
          registrationOpen: event.registrationOpen,
          status: event.status,
          venue: event.venue,
        },
      },
    }).catch(err => console.error('[AuditLog] Error:', err.message))

    res.status(200).json({ event })
  } catch (error) {
    console.error('[Admin] Update event error:', error.message)
    res.status(500).json({ message: 'Failed to update event: ' + error.message })
  }
})

/**
 * GET /api/admin/audit-logs
 * Paginated list of audit logs.
 */
router.get('/audit-logs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 30
    const skip = (page - 1) * limit

    const [logs, total] = await Promise.all([
      AuditLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AuditLog.countDocuments(),
    ])

    res.status(200).json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[Admin] Audit logs error:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

/**
 * GET /api/admin/users
 * All users with their roles.
 * Query params: search, role
 */
router.get('/users', async (req, res) => {
  try {
    const search = req.query.search || ''
    const role = req.query.role || ''

    const filter = {}
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { displayName: { $regex: search, $options: 'i' } },
      ]
    }
    if (role && ['user', 'security', 'admin'].includes(role)) {
      filter.role = role
    }

    const users = await User.find(filter).sort({ createdAt: -1 })
    res.status(200).json({ users })
  } catch (error) {
    console.error('[Admin] Users error:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

/**
 * POST /api/admin/users
 * Admin creates a new user account directly.
 */
router.post('/users', async (req, res) => {
  try {
    const { email, password, displayName, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }
    const validRole = ['user', 'security', 'admin'].includes(role) ? role : 'user'

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: 'A user with this email already exists in MongoDB.' })
    }

    // Create in Firebase Authentication
    let firebaseUser
    try {
      firebaseUser = await getAuth().createUser({
        email,
        password,
        displayName: displayName || '',
      })
    } catch (fbErr) {
      if (fbErr.code === 'auth/email-already-exists') {
        firebaseUser = await getAuth().getUserByEmail(email)
      } else {
        return res.status(400).json({ message: fbErr.message || 'Firebase user creation failed.' })
      }
    }

    // Create in MongoDB
    const user = await User.create({
      firebaseUid: firebaseUser.uid,
      email: email.toLowerCase(),
      displayName: displayName || firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || null,
      role: validRole,
      lastLoginAt: new Date(),
    })

    console.log(`[Admin] Created user: ${user.email} with role: ${user.role}`)
    res.status(201).json({ user })
  } catch (error) {
    console.error('[Admin] Create user error:', error.message)
    res.status(500).json({ message: error.message || 'Failed to create user.' })
  }
})

/**
 * PUT /api/admin/users/:id
 * Admin updates user details (name, role, or sets new password).
 */
router.put('/users/:id', async (req, res) => {
  try {
    const { displayName, role, password } = req.body
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (role && ['user', 'security', 'admin'].includes(role)) {
      user.role = role
    }
    if (displayName !== undefined) {
      user.displayName = displayName
    }

    await user.save()

    // Sync updates with Firebase Auth
    const fbUpdates = {}
    if (displayName !== undefined) fbUpdates.displayName = displayName
    if (password && password.length >= 6) fbUpdates.password = password

    if (Object.keys(fbUpdates).length > 0 && user.firebaseUid) {
      try {
        await getAuth().updateUser(user.firebaseUid, fbUpdates)
      } catch (fbErr) {
        console.warn(`[Admin] Firebase update warning for ${user.email}:`, fbErr.message)
      }
    }

    console.log(`[Admin] Updated user details: ${user.email}`)
    res.status(200).json({ user })
  } catch (error) {
    console.error('[Admin] Update user error:', error.message)
    res.status(500).json({ message: 'Failed to update user: ' + error.message })
  }
})

/**
 * DELETE /api/admin/users/:id
 * Admin permanently deletes a user from the system.
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // Safety check: prevent admin from deleting own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' })
    }

    // Delete from Firebase Auth
    try {
      if (user.firebaseUid) {
        await getAuth().deleteUser(user.firebaseUid)
      }
    } catch (fbErr) {
      console.warn(`[Admin] Firebase delete warning for ${user.firebaseUid}:`, fbErr.message)
    }

    // Delete from MongoDB
    await User.findByIdAndDelete(req.params.id)

    console.log(`[Admin] Deleted user: ${user.email}`)
    res.status(200).json({ message: `User ${user.email} removed successfully.` })
  } catch (error) {
    console.error('[Admin] Delete user error:', error.message)
    res.status(500).json({ message: 'Failed to delete user.' })
  }
})

/**
 * PATCH /api/admin/users/:id/role
 * Update a user's role.
 */
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body
    if (!['user', 'security', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    console.log(`[Admin] Role updated: ${user.email} → ${role}`)
    res.status(200).json({ user })
  } catch (error) {
    console.error('[Admin] Role update error:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

/**
 * POST /api/admin/users/:id/reset-password
 * Generates a secure password reset link for any user.
 */
router.post('/users/:id/reset-password', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const resetLink = await getAuth().generatePasswordResetLink(user.email)
    console.log(`[Admin] Password reset link generated for ${user.email}`)
    res.status(200).json({
      message: `Password reset link generated for ${user.email}`,
      resetLink,
    })
  } catch (error) {
    console.error('[Admin] Password reset error:', error.message)
    res.status(500).json({ message: 'Failed to generate reset link: ' + error.message })
  }
})

module.exports = router
