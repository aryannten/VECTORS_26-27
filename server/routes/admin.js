const express = require('express')
const mongoose = require('mongoose')
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

// Pagination limit cap
const MAX_PAGE_LIMIT = 200

/**
 * Escape special regex characters to prevent ReDoS attacks.
 * Admin search values are used in $regex queries — raw user input must be escaped.
 */
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Validate that a string is a valid MongoDB ObjectId.
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

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
      recentUsersList,
    ] = await Promise.all([
      EntryRegistration.countDocuments(),
      EntryRegistration.countDocuments({ checkedIn: true }),
      Event.countDocuments({ isActive: true }),
      User.countDocuments(),
      User.countDocuments({ role: 'security' }),
      EventRegistration.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5),
    ])

    const recentUserEmails = recentUsersList.map(u => (u.email || '').toLowerCase())
    const recentPasses = await EntryRegistration.find({ email: { $in: recentUserEmails } }, 'registrationId email')
    const recentPassMap = new Map(recentPasses.map(p => [(p.email || '').toLowerCase(), p.registrationId]))

    const recentUsers = recentUsersList.map(u => ({
      id: u._id,
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      createdAt: u.createdAt,
      hasPass: recentPassMap.has((u.email || '').toLowerCase()),
      passId: recentPassMap.get((u.email || '').toLowerCase()) || null,
    }))

    const usersWithoutPass = Math.max(0, totalUsers - totalRegistrations)

    const payload = {
      totalRegistrations,
      checkedInCount,
      totalEvents,
      totalUsers,
      usersWithoutPass,
      securityUsers,
      totalEventRegistrations,
      recentUsers,
    }

    res.status(200).json({
      stats: payload,
      ...payload,
    })
  } catch (error) {
    console.error('[Admin] Stats error:', error.message)
    res.status(500).json({ message: 'Failed to fetch admin stats.' })
  }
})

/**
 * GET /api/admin/registrations
 * Paginated list of all entry registrations with search.
 * Query params: page, limit, search
 */
router.get('/registrations', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, parseInt(req.query.limit) || 20))
    const search = req.query.search || ''
    const skip = (page - 1) * limit

    const escapedSearch = search ? escapeRegex(search) : ''
    const filter = escapedSearch
      ? {
          $or: [
            { name: { $regex: escapedSearch, $options: 'i' } },
            { email: { $regex: escapedSearch, $options: 'i' } },
            { college: { $regex: escapedSearch, $options: 'i' } },
            { registrationId: { $regex: escapedSearch, $options: 'i' } },
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
 * PUT /api/admin/registrations/:id
 * Admin updates an entry pass registration.
 * Accepts either Mongo _id or registrationId string.
 */
router.put('/registrations/:id', async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id || req.params.id.length > 50) {
      return res.status(400).json({ message: 'Invalid registration ID format.' })
    }
    const { name, email, phone, college, checkedIn, day1CheckedIn, day2CheckedIn } = req.body

    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id)
    const registration = await EntryRegistration.findOne(
      isObjectId
        ? { $or: [{ _id: req.params.id }, { registrationId: req.params.id }] }
        : { registrationId: req.params.id }
    )
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' })
    }

    const previousState = {
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
      college: registration.college,
      checkedIn: registration.checkedIn,
      day1CheckedIn: registration.day1CheckedIn,
      day2CheckedIn: registration.day2CheckedIn,
    }

    if (email && email.toLowerCase() !== registration.email.toLowerCase()) {
      const duplicate = await EntryRegistration.findOne({ email: email.toLowerCase() })
      if (duplicate && duplicate._id.toString() !== registration._id.toString()) {
        return res.status(409).json({ message: 'Another registration with this email already exists.' })
      }
      registration.email = email.toLowerCase().trim()
    }

    if (name !== undefined) registration.name = name.trim()
    if (phone !== undefined) registration.phone = phone.trim()
    if (college !== undefined) registration.college = college.trim()

    if (day1CheckedIn !== undefined) {
      const boolD1 = Boolean(day1CheckedIn)
      if (boolD1 && !registration.day1CheckedIn) {
        registration.day1CheckedIn = true
        registration.day1Timestamp = new Date()
        registration.checkedIn = true
        if (!registration.checkInTimestamp) registration.checkInTimestamp = new Date()
      } else if (!boolD1 && registration.day1CheckedIn) {
        registration.day1CheckedIn = false
        registration.day1Timestamp = null
        registration.checkedIn = Boolean(registration.day2CheckedIn)
      }
    }

    if (day2CheckedIn !== undefined) {
      const boolD2 = Boolean(day2CheckedIn)
      if (boolD2 && !registration.day2CheckedIn) {
        registration.day2CheckedIn = true
        registration.day2Timestamp = new Date()
        registration.checkedIn = true
        if (!registration.checkInTimestamp) registration.checkInTimestamp = new Date()
      } else if (!boolD2 && registration.day2CheckedIn) {
        registration.day2CheckedIn = false
        registration.day2Timestamp = null
        registration.checkedIn = Boolean(registration.day1CheckedIn)
      }
    }

    if (checkedIn !== undefined && day1CheckedIn === undefined && day2CheckedIn === undefined) {
      const boolCheckedIn = Boolean(checkedIn)
      if (boolCheckedIn && !registration.checkedIn) {
        registration.checkedIn = true
        registration.day1CheckedIn = true
        registration.day1Timestamp = new Date()
        registration.checkInTimestamp = new Date()
      } else if (!boolCheckedIn && registration.checkedIn) {
        registration.checkedIn = false
        registration.checkInTimestamp = null
        registration.day1CheckedIn = false
        registration.day1Timestamp = null
        registration.day2CheckedIn = false
        registration.day2Timestamp = null
      }
    }

    await registration.save()

    // Audit log
    await AuditLog.create({
      action: 'ENTRY_PASS_UPDATED',
      performedBy: req.user.email,
      targetType: 'EntryRegistration',
      targetId: registration._id.toString(),
      details: {
        registrationId: registration.registrationId,
        previousState,
        newState: {
          name: registration.name,
          email: registration.email,
          phone: registration.phone,
          college: registration.college,
          checkedIn: registration.checkedIn,
        },
      },
    }).catch((err) => console.error('[AuditLog] Error:', err.message))

    res.status(200).json({ registration })
  } catch (error) {
    console.error('[Admin] Update registration error:', error.message)
    res.status(500).json({ message: 'Failed to update registration.' })
  }
})

/**
 * DELETE /api/admin/registrations/:id
 * Admin deletes an entry pass registration.
 * Accepts either Mongo _id or registrationId string.
 */
router.delete('/registrations/:id', async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id || req.params.id.length > 50) {
      return res.status(400).json({ message: 'Invalid registration ID format.' })
    }
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id)
    const registration = await EntryRegistration.findOne(
      isObjectId
        ? { $or: [{ _id: req.params.id }, { registrationId: req.params.id }] }
        : { registrationId: req.params.id }
    )
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' })
    }

    await EntryRegistration.findByIdAndDelete(registration._id)

    // Audit log
    await AuditLog.create({
      action: 'ENTRY_PASS_DELETED',
      performedBy: req.user.email,
      targetType: 'EntryRegistration',
      targetId: registration._id.toString(),
      details: {
        registrationId: registration.registrationId,
        name: registration.name,
        email: registration.email,
      },
    }).catch((err) => console.error('[AuditLog] Error:', err.message))

    res.status(200).json({ message: `Pass ${registration.registrationId} deleted successfully.` })
  } catch (error) {
    console.error('[Admin] Delete registration error:', error.message)
    res.status(500).json({ message: 'Failed to delete registration.' })
  }
})

/**
 * GET /api/admin/event-registrations
 * Paginated list of all event-specific registrations with search & filters.
 * Query params: page, limit, search, eventSlug
 */
router.get('/event-registrations', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, parseInt(req.query.limit) || 20))
    const search = req.query.search || ''
    const eventSlug = req.query.eventSlug || ''
    const skip = (page - 1) * limit

    const filter = {}
    if (eventSlug) {
      filter.eventSlug = eventSlug.toLowerCase()
    }
    if (search) {
      const escapedSearch = escapeRegex(search)
      filter.$or = [
        { userName: { $regex: escapedSearch, $options: 'i' } },
        { userEmail: { $regex: escapedSearch, $options: 'i' } },
        { userCollege: { $regex: escapedSearch, $options: 'i' } },
        { registrationId: { $regex: escapedSearch, $options: 'i' } },
        { teamName: { $regex: escapedSearch, $options: 'i' } },
        { eventName: { $regex: escapedSearch, $options: 'i' } },
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
 * PATCH /api/admin/event-registrations/:id/status
 * Update an event registration status (e.g., approve a pending Google Form registration).
 */
router.patch('/event-registrations/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['confirmed', 'pending_verification', 'cancelled', 'attended']
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      })
    }

    const isObjectId = isValidObjectId(id)
    const query = isObjectId ? { _id: id } : { registrationId: id.trim().toUpperCase() }

    const registration = await EventRegistration.findOne(query)
    if (!registration) {
      return res.status(404).json({ message: 'Event registration not found.' })
    }

    const previousStatus = registration.status
    registration.status = status
    await registration.save()

    // Audit log
    await AuditLog.create({
      action: 'EVENT_REGISTRATION_STATUS_UPDATED',
      performedBy: req.user.email,
      targetType: 'EventRegistration',
      targetId: registration._id.toString(),
      details: {
        registrationId: registration.registrationId,
        eventSlug: registration.eventSlug,
        userEmail: registration.userEmail,
        previousStatus,
        newStatus: status,
      },
    }).catch((err) => console.error('[AuditLog] Error:', err.message))

    res.status(200).json({
      message: `Event registration status updated to '${status}'.`,
      registration,
    })
  } catch (error) {
    console.error('[Admin] Update event registration status error:', error.message)
    res.status(500).json({ message: 'Failed to update event registration status.' })
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
      let str = String(val).replace(/"/g, '""')
      // Neutralize CSV injection: prefix cells starting with formula characters
      if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str
      }
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
      let str = String(val).replace(/"/g, '""')
      // Neutralize CSV injection: prefix cells starting with formula characters
      if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str
      }
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
    if (!req.params.id || req.params.id.length > 100) {
      return res.status(400).json({ message: 'Invalid event ID format.' })
    }
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

    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id)
    const event = await Event.findOne(
      isObjectId
        ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] }
        : { slug: req.params.id }
    )
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
    if (status !== undefined) {
      const validStatuses = ['draft', 'published', 'coming_soon', 'open', 'almost_full', 'full', 'closed', 'completed']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid event status.' })
      }
      event.status = status
    }
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
    res.status(500).json({ message: 'Failed to update event.' })
  }
})

/**
 * GET /api/admin/audit-logs
 * Paginated list of audit logs.
 */
router.get('/audit-logs', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, parseInt(req.query.limit) || 30))
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
 * GET /api/admin/users/export
 * Export all user accounts as a sanitized CSV file.
 */
router.get('/users/export', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    const allPasses = await EntryRegistration.find({}, 'registrationId email college phone checkedIn day1CheckedIn day2CheckedIn')
    const passMap = new Map(allPasses.map(p => [(p.email || '').toLowerCase(), p]))

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""'
      let str = String(val).replace(/"/g, '""')
      if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str
      }
      return `"${str}"`
    }

    const headers = [
      'Account Name',
      'Email',
      'Role',
      'Account Created At',
      'Last Login At',
      'Has QR Pass',
      'Pass ID',
      'College',
      'Phone',
      'Day 1 Checked In',
      'Day 2 Checked In',
    ]

    const rows = users.map((u) => {
      const pass = passMap.get((u.email || '').toLowerCase())
      return [
        escapeCsv(u.displayName || ''),
        escapeCsv(u.email),
        escapeCsv(u.role),
        escapeCsv(u.createdAt ? new Date(u.createdAt).toISOString() : ''),
        escapeCsv(u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : ''),
        escapeCsv(pass ? 'YES' : 'NO'),
        escapeCsv(pass?.registrationId || 'NO_PASS'),
        escapeCsv(pass?.college || ''),
        escapeCsv(pass?.phone || ''),
        escapeCsv(pass ? (pass.day1CheckedIn || pass.checkedIn ? 'YES' : 'NO') : 'N/A'),
        escapeCsv(pass ? (pass.day2CheckedIn ? 'YES' : 'NO') : 'N/A'),
      ].join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\n')
    const filename = `vectors_user_accounts_${Date.now()}.csv`

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    return res.status(200).send(csvContent)
  } catch (error) {
    console.error('[Admin] Export users error:', error.message)
    res.status(500).json({ message: 'Failed to export users CSV.' })
  }
})

/**
 * GET /api/admin/users
 * All users with their roles, pass claim status, and account telemetry.
 * Query params: search, role, passStatus ('all' | 'has_pass' | 'no_pass'), sync ('true' | 'false')
 */
router.get('/users', async (req, res) => {
  try {
    const search = req.query.search || ''
    const role = req.query.role || ''
    const passStatus = req.query.passStatus || 'all'

    // Auto-sync missing users from Firebase Auth into MongoDB
    try {
      const fbUsersResult = await getAuth().listUsers(1000)
      if (fbUsersResult && fbUsersResult.users.length > 0) {
        const existingEmails = new Set((await User.find({}, 'email')).map(u => u.email?.toLowerCase()))
        const missingUsers = fbUsersResult.users.filter(u => u.email && !existingEmails.has(u.email.toLowerCase()))
        if (missingUsers.length > 0) {
          const toInsert = missingUsers.map(u => ({
            firebaseUid: u.uid,
            email: u.email.toLowerCase(),
            displayName: u.displayName || u.email.split('@')[0],
            photoURL: u.photoURL || null,
            role: 'user',
            createdAt: u.metadata?.creationTime ? new Date(u.metadata.creationTime) : new Date(),
            lastLoginAt: u.metadata?.lastSignInTime ? new Date(u.metadata.lastSignInTime) : null,
          }))
          await User.insertMany(toInsert, { ordered: false }).catch(() => {})
        }
      }
    } catch (syncErr) {
      console.warn('[Admin] Firebase users auto-sync notice:', syncErr.message)
    }

    const filter = {}
    if (search) {
      const escapedSearch = escapeRegex(search)
      filter.$or = [
        { email: { $regex: escapedSearch, $options: 'i' } },
        { displayName: { $regex: escapedSearch, $options: 'i' } },
      ]
    }
    if (role && ['user', 'security', 'admin'].includes(role)) {
      filter.role = role
    }

    const users = await User.find(filter).sort({ createdAt: -1 })

    // Enrich with EntryRegistration (QR pass) data
    const allPasses = await EntryRegistration.find({}, 'registrationId email name college phone checkedIn day1CheckedIn day2CheckedIn createdAt')
    const passMap = new Map(allPasses.map(p => [(p.email || '').toLowerCase(), p]))

    let enrichedUsers = users.map(u => {
      const userObj = u.toObject ? u.toObject() : u
      const pass = passMap.get((u.email || '').toLowerCase())
      return {
        ...userObj,
        hasPass: Boolean(pass),
        pass: pass ? {
          registrationId: pass.registrationId,
          name: pass.name,
          college: pass.college,
          phone: pass.phone,
          checkedIn: Boolean(pass.checkedIn || pass.day1CheckedIn || pass.day2CheckedIn),
          day1CheckedIn: Boolean(pass.day1CheckedIn || pass.checkedIn),
          day2CheckedIn: Boolean(pass.day2CheckedIn),
          createdAt: pass.createdAt,
        } : null,
      }
    })

    const totalAccounts = enrichedUsers.length
    const withPass = enrichedUsers.filter(u => u.hasPass).length
    const withoutPass = totalAccounts - withPass

    if (passStatus === 'has_pass') {
      enrichedUsers = enrichedUsers.filter(u => u.hasPass)
    } else if (passStatus === 'no_pass') {
      enrichedUsers = enrichedUsers.filter(u => !u.hasPass)
    }

    res.status(200).json({
      users: enrichedUsers,
      meta: {
        total: totalAccounts,
        withPass,
        withoutPass,
      },
    })
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

    // Audit log
    await AuditLog.create({
      action: 'USER_CREATED',
      performedBy: req.user.email,
      targetType: 'User',
      targetId: user._id.toString(),
      details: { email: user.email, role: user.role },
    }).catch(err => console.error('[AuditLog] Error:', err.message))

    console.log(`[Admin] Created user: ${user.email} with role: ${user.role}`)
    res.status(201).json({ user })
  } catch (error) {
    console.error('[Admin] Create user error:', error.message)
    res.status(500).json({ message: 'Failed to create user.' })
  }
})

/**
 * PUT /api/admin/users/:id
 * Admin updates user details (name, role, or sets new password).
 */
router.put('/users/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID format.' })
    }
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

    // Audit log
    await AuditLog.create({
      action: 'USER_UPDATED',
      performedBy: req.user.email,
      targetType: 'User',
      targetId: user._id.toString(),
      details: { email: user.email, updatedFields: { displayName, role } },
    }).catch(err => console.error('[AuditLog] Error:', err.message))

    console.log(`[Admin] Updated user details: ${user.email}`)
    res.status(200).json({ user })
  } catch (error) {
    console.error('[Admin] Update user error:', error.message)
    res.status(500).json({ message: 'Failed to update user.' })
  }
})

/**
 * DELETE /api/admin/users/:id
 * Admin permanently deletes a user from the system.
 */
router.delete('/users/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID format.' })
    }
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

    // Audit log
    await AuditLog.create({
      action: 'USER_DELETED',
      performedBy: req.user.email,
      targetType: 'User',
      targetId: req.params.id,
      details: { email: user.email, role: user.role },
    }).catch(err => console.error('[AuditLog] Error:', err.message))

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
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID format.' })
    }
    const { role } = req.body
    if (!['user', 'security', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: 'after' }
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // Audit log
    await AuditLog.create({
      action: 'USER_ROLE_CHANGED',
      performedBy: req.user.email,
      targetType: 'User',
      targetId: user._id.toString(),
      details: { email: user.email, newRole: role },
    }).catch(err => console.error('[AuditLog] Error:', err.message))

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
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID format.' })
    }
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const resetLink = await getAuth().generatePasswordResetLink(user.email)
    // Audit log
    await AuditLog.create({
      action: 'PASSWORD_RESET_GENERATED',
      performedBy: req.user.email,
      targetType: 'User',
      targetId: user._id.toString(),
      details: { email: user.email },
    }).catch(err => console.error('[AuditLog] Error:', err.message))

    console.log(`[Admin] Password reset link generated for ${user.email}`)
    res.status(200).json({
      message: `Password reset link generated for ${user.email}`,
      resetLink,
    })
  } catch (error) {
    console.error('[Admin] Password reset error:', error.message)
    res.status(500).json({ message: 'Failed to generate reset link.' })
  }
})

module.exports = router
