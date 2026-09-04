require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { initializeApp, cert } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')
const connectDB = require('./config/db')
const User = require('./models/User')

// Initialize Firebase Admin SDK
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json')
initializeApp({
  credential: cert(serviceAccount),
})
console.log('[Firebase] Admin SDK initialized.')

// Import routes
const registrationRoutes = require('./routes/registration')
const eventRoutes = require('./routes/events')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api', registrationRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

/**
 * Seed the admin user and initial site config on startup.
 */
const seedDefaults = async () => {
  // Seed admin user — only promotes an existing user by email
  const adminEmail = process.env.ADMIN_EMAIL
  if (adminEmail) {
    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() })
    if (existingAdmin && existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin'
      await existingAdmin.save()
      console.log(`[Seed] Promoted ${adminEmail} to admin.`)
    } else if (!existingAdmin) {
      console.log(`[Seed] Admin user ${adminEmail} not found yet — will be promoted on first login.`)
    }
  }
}

// Start server
const start = async () => {
  await connectDB()
  await seedDefaults()
  app.listen(PORT, () => {
    console.log(`[Server] VECTORS 2026 API running on port ${PORT}`)
  })
}

start()
