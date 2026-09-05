const express = require('express')
const router = express.Router()
const { getAuth } = require('firebase-admin/auth')
const User = require('../models/User')
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

    const updateSet = {
      email: decodedToken.email,
      lastLoginAt: new Date(),
      ...(decodedToken.name ? { displayName: decodedToken.name } : {}),
      ...(decodedToken.picture ? { photoURL: decodedToken.picture } : {}),
    }

    if (isAdmin) {
      updateSet.role = 'admin'
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid: decodedToken.uid },
      {
        $set: updateSet,
        $setOnInsert: {
          role: isAdmin ? 'admin' : 'user',
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
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
 * POST /api/auth/security-login
 * Security verification & access endpoint.
 * Automatically grants 'security' role to personnel logging in or registering
 * through the security terminal (unless they are already admin).
 */
router.post('/security-login', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' })
  }

  const idToken = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken)
    let user = await User.findOne({ firebaseUid: decodedToken.uid })

    if (user) {
      // Existing user logging in via security portal — grant security role (unless admin)
      if (user.role !== 'admin') {
        user.role = 'security'
      }
      user.lastLoginAt = new Date()
      await user.save()
    } else {
      // New user registering via security portal — grant security role directly
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || 'Security Personnel',
        photoURL: decodedToken.picture || null,
        role: 'security',
        lastLoginAt: new Date(),
      })
      console.log(`[Auth] New security user registered: ${user.email}`)
    }

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
    console.error('[Auth] Security login error:', error.message)
    res.status(401).json({ message: 'Authentication failed.' })
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
