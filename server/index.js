require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const { initializeApp, cert } = require('firebase-admin/app')
const connectDB = require('./config/db')
const User = require('./models/User')
const Event = require('./models/Event')
const Announcement = require('./models/Announcement')

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
const announcementRoutes = require('./routes/announcements')
const userRoutes = require('./routes/user')

const app = express()
const PORT = process.env.PORT || 5000

// 1. Hide framework signature
app.disable('x-powered-by')

// 2. HTTP Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible cross-origin asset loading
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// 3. CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true)
    } else {
      callback(new Error('Blocked by CORS policy'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// 4. Body parser with payload limits
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// 5. Sanitize request inputs against NoSQL injection
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    mongoSanitize.sanitize(req.body)
  }
  if (req.params && typeof req.params === 'object') {
    mongoSanitize.sanitize(req.params)
  }
  if (req.query && typeof req.query === 'object') {
    mongoSanitize.sanitize(req.query)
  }
  next()
})

// 6. Global API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP. Please try again after 15 minutes.' },
})
app.use('/api', apiLimiter)

// 7. Strict Auth & Registration Rate Limiter (Brute Force Protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again after 15 minutes.' },
})
app.use('/api/auth', authLimiter)
app.use('/api/register', authLimiter)

// Routes
app.use('/api', registrationRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/user', userRoutes)

// Health check — reports actual database connectivity
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose')
  const dbState = mongoose.connection.readyState
  // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const dbConnected = dbState === 1
  const statusCode = dbConnected ? 200 : 503
  res.status(statusCode).json({
    status: dbConnected ? 'ok' : 'degraded',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
})

// 404 handler for unmatched API routes (returns JSON instead of Express default HTML)
app.use('/api', (req, res) => {
  res.status(404).json({ message: `API endpoint ${req.method} ${req.originalUrl} not found.` })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message)
  const statusCode = err.status || 500
  res.status(statusCode).json({
    message: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An unexpected internal server error occurred.'
      : err.message || 'Internal server error',
  })
})

const officialEvents = require('./data/officialEvents')

/**
 * Seed master event definitions or sync brochure events.
 */
const seedMasterEvents = async () => {
  try {
    const activeSlugs = officialEvents.map((e) => e.slug)
    // Upsert official brochure events
    for (const evt of officialEvents) {
      await Event.findOneAndUpdate(
        { slug: evt.slug },
        { $set: evt },
        { upsert: true, returnDocument: 'after' }
      )
    }
    // Remove legacy events not in brochure
    await Event.deleteMany({ slug: { $nin: activeSlugs } })
    console.log(`[Seed] Synchronized ${officialEvents.length} official brochure event definitions in MongoDB.`)
  } catch (err) {
    console.warn('[Seed] Event seeding notice:', err.message)
  }
}

/**
 * Seed sample announcements if MongoDB collection is empty.
 */
const seedAnnouncements = async () => {
  try {
    const count = await Announcement.countDocuments()
    if (count > 0) return

    const defaultAnnouncements = [
      {
        title: 'VECTORS 26–27 Digital Passes Now Live',
        content: 'All participants must claim their digital Entry Pass before accessing event vaults and team registrations. Gate QR scanning will be enforced at main entrance points.',
        category: 'urgent',
        isPinned: true,
        isPublished: true,
        publishedAt: new Date(),
        author: 'Chief Coordinator',
      },
      {
        title: 'Doomsday Hackathon Problem Statements',
        content: 'Problem statements for the 24-Hour Hackathon will be officially unveiled during the opening ceremony in Computing Hub Lab 401. Ensure your team of 2–4 is fully registered in advance.',
        category: 'registration',
        relatedEventSlug: 'hackathon',
        isPinned: false,
        isPublished: true,
        publishedAt: new Date(),
        author: 'Tech Department',
      },
      {
        title: 'Robo Wars Arena Safety Weigh-In',
        content: 'Combat bot weigh-ins and failsafe testing start at 09:30 IST on March 16. Late entries will not be permitted into the tournament bracket.',
        category: 'schedule',
        relatedEventSlug: 'robo-wars',
        isPinned: false,
        isPublished: true,
        publishedAt: new Date(),
        author: 'Robotics Guild',
      },
    ]

    await Announcement.insertMany(defaultAnnouncements)
    console.log(`[Seed] Initialized ${defaultAnnouncements.length} announcements in MongoDB.`)
  } catch (err) {
    console.warn('[Seed] Announcement seeding notice:', err.message)
  }
}

/**
 * Seed the admin user on startup.
 */
const seedDefaults = async () => {
  const adminEmailsRaw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || ''
  const adminEmails = adminEmailsRaw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  for (const email of adminEmails) {
    try {
      const existingAdmin = await User.findOne({ email })
      if (existingAdmin && existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin'
        await existingAdmin.save()
        console.log(`[Seed] Promoted ${email} to admin.`)
      } else if (existingAdmin && existingAdmin.role === 'admin') {
        console.log(`[Seed] Confirmed admin account: ${email}`)
      } else {
        console.log(`[Seed] Admin user ${email} not registered yet — will be auto-promoted to admin on login.`)
      }
    } catch (err) {
      console.warn(`[Seed] Error verifying admin ${email}:`, err.message)
    }
  }

  const securityEmailsRaw = process.env.SECURITY_EMAILS || process.env.SECURITY_EMAIL || ''
  const securityEmails = securityEmailsRaw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  for (const email of securityEmails) {
    try {
      const existingSec = await User.findOne({ email })
      if (existingSec && existingSec.role !== 'security' && existingSec.role !== 'admin') {
        existingSec.role = 'security'
        await existingSec.save()
        console.log(`[Seed] Promoted ${email} to security personnel.`)
      } else if (existingSec && existingSec.role === 'security') {
        console.log(`[Seed] Confirmed security account: ${email}`)
      } else {
        console.log(`[Seed] Security user ${email} not registered yet — will be auto-promoted to security on login.`)
      }
    } catch (err) {
      console.warn(`[Seed] Error verifying security staff ${email}:`, err.message)
    }
  }
}

// Start server
const start = async () => {
  app.listen(PORT, () => {
    console.log(`[Server] VECTORS 2026 API running on port ${PORT}`)
  })

  try {
    await connectDB()
    await seedDefaults()
    await seedMasterEvents()
    await seedAnnouncements()
  } catch (err) {
    console.warn(`[Server] Database connection error: ${err.message}`)
    console.warn('[Server] Running in offline/pending database mode. If using MongoDB Atlas, verify your IP is whitelisted in Network Access.')
  }
}

start()
