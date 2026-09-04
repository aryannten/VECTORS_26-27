require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
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
    // Allow non-browser requests (tools, curl, mobile apps) or matching origins
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

// 4. Body parser with payload limits (prevent memory exhaustion)
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
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again after 15 minutes.' },
})
app.use('/api/auth', authLimiter)
app.use('/api/register', authLimiter)

// Routes
app.use('/api', registrationRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Global Error Handler (Hides stack traces in production)
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message)
  const statusCode = err.status || 500
  res.status(statusCode).json({
    message: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An unexpected internal server error occurred.'
      : err.message || 'Internal server error',
  })
})

/**
 * Seed the admin user on startup.
 */
const seedDefaults = async () => {
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
