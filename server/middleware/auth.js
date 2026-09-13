const { getAuth } = require('firebase-admin/auth')
const User = require('../models/User')
const EntryRegistration = require('../models/EntryRegistration')

/**
 * verifyFirebaseToken — Extracts and verifies the Firebase ID token
 * from the Authorization header. Attaches the MongoDB user to req.user.
 */
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No authentication token provided.' })
  }

  const idToken = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken)
    
    // Find the user in MongoDB
    let user = await User.findOne({ firebaseUid: decodedToken.uid })
    if (!user && decodedToken.email) {
      user = await User.findOne({ email: decodedToken.email.toLowerCase() })
      if (user && !user.firebaseUid) {
        user.firebaseUid = decodedToken.uid
        await user.save()
      }
    }
    if (!user && decodedToken.email) {
      const userEmail = decodedToken.email.toLowerCase()
      const adminEmailsRaw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || ''
      const adminEmails = adminEmailsRaw
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
      const isAdmin = adminEmails.includes(userEmail)
      const role = isAdmin ? 'admin' : 'user'

      // Resolve displayName from token or Firebase Admin record
      let resolvedName = decodedToken.name || ''
      let resolvedPhoto = decodedToken.picture || ''
      if (!resolvedName) {
        try {
          const firebaseUserRecord = await getAuth().getUser(decodedToken.uid)
          resolvedName = firebaseUserRecord.displayName || ''
          resolvedPhoto = resolvedPhoto || firebaseUserRecord.photoURL || ''
        } catch (_) { /* non-critical */ }
      }

      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: resolvedName,
        photoURL: resolvedPhoto,
        role
      })
    }
    if (!user) {
      return res.status(401).json({ message: 'User not found. Please sign up first.' })
    }

    req.user = user
    req.firebaseUser = decodedToken
    next()
  } catch (error) {
    console.error('[Auth] Token verification failed:', error.message)
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

/**
 * requireRole — Middleware factory that checks if the authenticated user
 * has one of the specified roles.
 * Must be used AFTER verifyFirebaseToken.
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' })
    }

    next()
  }
}

/**
 * requireEntryPass — Verifies that the authenticated user owns a valid
 * EntryRegistration pass in MongoDB. Blocks access if pass is missing.
 * Must be used AFTER verifyFirebaseToken.
 */
const requireEntryPass = async (req, res, next) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'Authentication required.' })
    }

    const pass = await EntryRegistration.findOne({ email: req.user.email.toLowerCase() })
    if (!pass) {
      return res.status(403).json({
        code: 'PASS_REQUIRED',
        message: 'A verified Entry Pass is required to perform this action. Claim your entry pass first.',
      })
    }

    req.entryPass = pass
    next()
  } catch (error) {
    console.error('[Auth] requireEntryPass error:', error.message)
    res.status(500).json({ message: 'Internal security verification error.' })
  }
}

module.exports = { verifyFirebaseToken, requireRole, requireEntryPass }
