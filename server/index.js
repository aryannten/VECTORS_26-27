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

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
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

/**
 * Seed master event definitions if MongoDB collection is empty.
 */
const seedMasterEvents = async () => {
  try {
    const count = await Event.countDocuments()
    if (count > 0) return

    const defaultEvents = [
      {
        slug: 'hackathon',
        name: 'Doomsday Hackathon',
        category: 'Technical',
        branch: 'CSE / IT / AIML',
        isBranchExclusive: false,
        fee: 'Free',
        date: 'March 15, 2026',
        startTime: '09:00 IST',
        endTime: 'March 16, 09:00 IST (24h)',
        venue: 'Computing Hub // Lab 401',
        venueDetails: {
          building: 'Turing Innovation Center',
          floor: '4th Floor',
          room: 'Lab 401',
          directions: 'Take North Wing elevators to 4th Floor. Enter via Gate C.'
        },
        teamSize: '2–4 members',
        minTeamSize: 2,
        maxTeamSize: 4,
        capacity: 50,
        registrationOpen: true,
        registrationDeadline: 'March 14, 2026 // 23:59 IST',
        status: 'open',
        prizePool: '₹30,000 + Tech Gear',
        eligibility: 'Open to all enrolled undergraduate engineering & science students.',
        description: 'An intensive 24-hour engineering sprint where teams design, build, and deploy full-stack or AI-powered solutions to real-world problem statements under high pressure.',
        rules: [
          'Teams must consist of 2 to 4 eligible student participants.',
          'All product code, models, and architectures must be authored during the 24-hour sprint window.',
          'Open-source libraries, frameworks, and APIs are permitted provided they are properly cited.',
          'Evaluation criteria: Innovation (30%), Technical Depth (30%), Execution & Stability (20%), Final Pitch (20%).'
        ],
        coordinators: [
          { name: 'Aarav Sharma', contact: '+91 98765 43210' },
          { name: 'Priya Nair', contact: '+91 98765 43211' }
        ],
        faq: [
          { question: 'Will power and internet be provided?', answer: 'Yes, gigabit Wi-Fi and power strips are available at every team station.' }
        ]
      },
      {
        slug: 'robo-wars',
        name: 'Robo Wars: Metal Carnage',
        category: 'Technical',
        branch: 'Mechanical / EXTC',
        isBranchExclusive: false,
        fee: '₹500 / team',
        date: 'March 16, 2026',
        startTime: '11:00 IST',
        endTime: '16:00 IST',
        venue: 'The Steel Arena // Ground Courtyard',
        venueDetails: {
          building: 'Mechanical Complex',
          floor: 'Ground Level',
          room: 'Fortified Steel Arena',
          directions: 'Courtyard adjacent to Central Amphitheatre.'
        },
        teamSize: '3–5 members',
        minTeamSize: 3,
        maxTeamSize: 5,
        capacity: 24,
        registrationOpen: true,
        registrationDeadline: 'March 14, 2026 // 18:00 IST',
        status: 'open',
        prizePool: '₹40,000',
        eligibility: 'College combat robotics teams with verified builds.',
        description: 'Custom-engineered combat robots clash in a fortified steel arena. Test your armor, drive systems, and kinetic weapons in elimination deathmatches.',
        rules: [
          'Maximum robot weight limit: 25 kg (+/- 2% tolerance).',
          'Remote wireless control only (2.4GHz safe link). Redundant fail-safe kill switch required.',
          'Banned weapon systems: Liquid flammables, explosives, EMP transmitters, untethered projectiles.',
          'Bouts run for 3 minutes. Winner determined by knockout, immobilization, or judge points.'
        ],
        coordinators: [
          { name: 'Rohan Deshmukh', contact: '+91 98765 43212' },
          { name: 'Vikram Singh', contact: '+91 98765 43213' }
        ],
        faq: [
          { question: 'Is pit space provided for repairs?', answer: 'Yes, dedicated workshop pit tables with 230V AC supply are provided.' }
        ]
      },
      {
        slug: 'circuit-craft',
        name: 'Silicon Siege: Circuit Design & Hardware Trial',
        category: 'Technical',
        branch: 'EXTC / Electrical',
        isBranchExclusive: false,
        fee: '₹150 / participant',
        date: 'March 15, 2026',
        startTime: '14:00 IST',
        endTime: '17:00 IST',
        venue: 'Hardware Prototype Lab // Room 204',
        venueDetails: {
          building: 'Electrical Sciences Block',
          floor: '2nd Floor',
          room: 'Lab 204',
          directions: 'East corridor, second floor.'
        },
        teamSize: '1–2 members',
        minTeamSize: 1,
        maxTeamSize: 2,
        capacity: 40,
        registrationOpen: true,
        registrationDeadline: 'March 14, 2026 // 23:59 IST',
        status: 'open',
        prizePool: '₹15,000',
        eligibility: 'Undergraduate students interested in analog and digital circuitry.',
        description: 'Diagnose faulty circuit schematics, debug microcontroller telemetry, and solder custom sensor boards against the countdown clock.',
        rules: [
          'Round 1: Rapid fault detection on breadboards and digital logic analyzers (30 mins).',
          'Round 2: PCB layout optimization and physical component assembly (60 mins).',
          'All soldering stations, components, and safety equipment are provided on site.',
          'Scoring based on circuit accuracy, noise suppression, and speed.'
        ],
        coordinators: [
          { name: 'Ananya Verma', contact: '+91 98765 43214' }
        ],
        faq: [
          { question: 'Do we bring our own components?', answer: 'No, all hardware components, breadboards, and soldering equipment are provided.' }
        ]
      },
      {
        slug: 'code-chronicles',
        name: 'Algorithmic Arena: Speed Coding',
        category: 'Technical',
        branch: 'CSE / IT',
        isBranchExclusive: false,
        fee: 'Free',
        date: 'March 16, 2026',
        startTime: '10:00 IST',
        endTime: '13:00 IST',
        venue: 'Software Center // Terminal 1',
        venueDetails: {
          building: 'Computing Wing',
          floor: '3rd Floor',
          room: 'HPC Terminal 1',
          directions: 'North wing elevators to Floor 3, room on right.'
        },
        teamSize: 'Solo',
        minTeamSize: 1,
        maxTeamSize: 1,
        capacity: 80,
        registrationOpen: true,
        registrationDeadline: 'March 15, 2026 // 23:59 IST',
        status: 'open',
        prizePool: '₹12,000',
        eligibility: 'Individual coders across all engineering branches.',
        description: 'Competitive programming battle testing data structures, algorithmic efficiency, and edge-case handling under strict time limits.',
        rules: [
          'Supported languages: C++, Java, Python 3, Go, Rust.',
          'Automated online judge with hidden test cases and strict CPU/memory limits.',
          'Penalty applied for wrong submissions. Highest score with lowest total time wins.',
          'Zero tolerance for plagiarism or unauthorized external AI tools.'
        ],
        coordinators: [
          { name: 'Devendra Patel', contact: '+91 98765 43215' }
        ],
        faq: [
          { question: 'Can I use personal peripherals?', answer: 'Yes, mechanical keyboards and mice are allowed after coordinator verification.' }
        ]
      },
      {
        slug: 'gaming-arena',
        name: 'Cyber Arena: Esports Championship',
        category: 'Non-Technical',
        branch: 'Open to All',
        isBranchExclusive: false,
        fee: '₹300 / team',
        date: 'March 15, 2026',
        startTime: '12:00 IST',
        endTime: '18:00 IST',
        venue: 'Esports Dome // Seminar Hall B',
        venueDetails: {
          building: 'Student Activity Hub',
          floor: '1st Floor',
          room: 'Seminar Hall B',
          directions: 'Opposite Student Council office.'
        },
        teamSize: 'Solo / Squad (5)',
        minTeamSize: 1,
        maxTeamSize: 5,
        capacity: 32,
        registrationOpen: true,
        registrationDeadline: 'March 14, 2026 // 20:00 IST',
        status: 'open',
        prizePool: '₹25,000 + Merchandise',
        eligibility: 'Open to all college students with valid IDs.',
        description: 'High-octane competitive gaming tournaments across Valorant, BGMI, and FIFA. Strategy, reflexes, and tactical coordination decide who dominates the bracket.',
        rules: [
          'Tournament follows standard double-elimination knockout format.',
          'PC tournament: Tournament PCs provided; personal peripherals allowed.',
          'Mobile tournament: Bring your own mobile device; no emulators or third-party triggers.',
          'Unsportsmanlike conduct or toxic behavior results in immediate team disqualification.'
        ],
        coordinators: [
          { name: 'Sameer Khan', contact: '+91 98765 43216' },
          { name: 'Rahul Joshi', contact: '+91 98765 43217' }
        ],
        faq: [
          { question: 'What network is provided for mobile games?', answer: 'Dedicated low-latency 5GHz Wi-Fi is reserved for players.' }
        ]
      },
      {
        slug: 'cultural-night',
        name: 'Battle of the Bands & Stage Arts',
        category: 'Non-Technical',
        branch: 'Open to All',
        isBranchExclusive: false,
        fee: 'Free',
        date: 'March 16, 2026',
        startTime: '18:00 IST',
        endTime: '22:00 IST',
        venue: 'Open Air Amphitheatre',
        venueDetails: {
          building: 'Central Campus Grounds',
          floor: 'Ground Level',
          room: 'Festival Main Stage',
          directions: 'Directly in front of the central quadrangle.'
        },
        teamSize: 'Solo / Group (up to 8)',
        minTeamSize: 1,
        maxTeamSize: 8,
        capacity: 15,
        registrationOpen: true,
        registrationDeadline: 'March 15, 2026 // 12:00 IST',
        status: 'open',
        prizePool: '₹20,000 + Trophies',
        eligibility: 'Student bands, vocalists, acoustic artists, and theatrical troupes.',
        description: 'Live musical showdowns, acoustic battles, and theatrical stage performances under the festival spotlight. Bring raw energy and captivate the audience.',
        rules: [
          'Stage slot: 10 minutes total (including 2-minute line check).',
          'Standard drum kit, PA system, and monitor speakers provided. Bands bring personal instruments.',
          'Explicit or offensive lyrical content will result in point deductions or disqualification.',
          'Judged on musicality, stage presence, crowd engagement, and originality.'
        ],
        coordinators: [
          { name: 'Tanvi Kulkarni', contact: '+91 98765 43218' }
        ],
        faq: [
          { question: 'Is drum kit provided?', answer: 'Yes, a standard 5-piece acoustic drum kit is provided. Drummers bring their own cymbals and sticks.' }
        ]
      },
      {
        slug: 'trivia-protocol',
        name: 'The Latverian Inquisition: Pop & Mystery Quiz',
        category: 'Non-Technical',
        branch: 'Open to All',
        isBranchExclusive: false,
        fee: '₹100 / team',
        date: 'March 15, 2026',
        startTime: '15:30 IST',
        endTime: '18:00 IST',
        venue: 'Auditorium 2',
        venueDetails: {
          building: 'Auditorium Complex',
          floor: 'Ground Floor',
          room: 'Hall 2',
          directions: 'South Entrance of main auditorium building.'
        },
        teamSize: '2 members',
        minTeamSize: 2,
        maxTeamSize: 2,
        capacity: 50,
        registrationOpen: true,
        registrationDeadline: 'March 15, 2026 // 13:00 IST',
        status: 'open',
        prizePool: '₹10,000',
        eligibility: 'Teams of 2 students from any recognized college.',
        description: 'Fast-paced trivia gauntlet covering cinema, comics, sci-fi lore, memes, and pop-culture mysteries. Buzzer rounds, visual puzzles, and high-stakes wager questions.',
        rules: [
          'Round 1: 30-question written preliminary screening.',
          'Top 6 teams advance to live onstage buzzer finals.',
          'No electronic devices or smartphones permitted during quiz rounds.',
          'The Quizmaster decision is final and binding.'
        ],
        coordinators: [
          { name: 'Aditya Mehta', contact: '+91 98765 43219' }
        ],
        faq: [
          { question: 'Can teammates be from different colleges?', answer: 'Yes, inter-college teams are permitted.' }
        ]
      }
    ]

    await Event.insertMany(defaultEvents)
    console.log(`[Seed] Initialized ${defaultEvents.length} master event definitions in MongoDB.`)
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
  await seedMasterEvents()
  await seedAnnouncements()
  app.listen(PORT, () => {
    console.log(`[Server] VECTORS 2026 API running on port ${PORT}`)
  })
}

start()
