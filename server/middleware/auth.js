const { getAuth } = require('firebase-admin/auth')
const User = require('../models/User')

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
    const user = await User.findOne({ firebaseUid: decodedToken.uid })
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

module.exports = { verifyFirebaseToken, requireRole }
