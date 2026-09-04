const express = require('express')
const router = express.Router()
const { getAuth } = require('firebase-admin/auth')
const { verifyFirebaseToken, requireRole } = require('../middleware/auth')
const User = require('../models/User')
const EntryRegistration = require('../models/EntryRegistration')
const Event = require('../models/Event')

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
    ] = await Promise.all([
      EntryRegistration.countDocuments(),
      EntryRegistration.countDocuments({ checkedIn: true }),
      Event.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ role: 'security' }),
    ])

    res.status(200).json({
      totalRegistrations,
      checkedInCount,
      totalEvents,
      totalUsers,
      securityUsers,
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
