const express = require('express')
const router = express.Router()
const { getAuth } = require('firebase-admin/auth')
const User = require('../models/User')
const EntryRegistration = require('../models/EntryRegistration')
const { verifyFirebaseToken } = require('../middleware/auth')

/**
 * POST /api/auth/sync
 * Called after Firebase sign-in on the client.
 * Creates or updates the user in MongoDB and returns their role.
 */
router.post('/sync', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' })
  }

  const idToken = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken)
    const userEmail = (decodedToken.email || '').toLowerCase()

    const adminEmailsRaw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || ''
    const adminEmails = adminEmailsRaw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    const isAdmin = adminEmails.includes(userEmail)

    const securityEmailsRaw = process.env.SECURITY_EMAILS || process.env.SECURITY_EMAIL || ''
    const securityEmails = securityEmailsRaw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    const isSecurity = securityEmails.includes(userEmail)

    const existingPass = await EntryRegistration.findOne({ email: userEmail })
    const userPhone = existingPass?.phone || decodedToken.phone_number || null

    const updateSet = {
      email: decodedToken.email,
      lastLoginAt: new Date(),
      ...(userPhone ? { phone: userPhone } : {}),
      ...(decodedToken.name ? { displayName: decodedToken.name } : {}),
      ...(decodedToken.picture ? { photoURL: decodedToken.picture } : {}),
    }

    const updateOps = {
      $set: updateSet,
    }

    if (isAdmin) {
      updateSet.role = 'admin'
    } else if (isSecurity) {
      updateSet.role = 'security'
    } else {
      updateOps.$setOnInsert = { role: 'user' }
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid: decodedToken.uid },
      updateOps,
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    )

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('[Auth] Sync error:', error.message)
    res.status(401).json({ message: 'Invalid token.' })
  }
})


/**
 * GET /api/auth/me
 * Get current user info (requires auth).
 */
router.get('/me', verifyFirebaseToken, async (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      email: req.user.email,
      displayName: req.user.displayName,
      photoURL: req.user.photoURL,
      role: req.user.role,
    },
  })
})

module.exports = router
