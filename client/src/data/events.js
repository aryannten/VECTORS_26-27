/**
 * VECTORS 26 — Master Event Data
 * 
 * Strict Structure:
 * - id: unique slug for URL routing (/events/:id)
 * - name: Official event title
 * - category: 'Technical' | 'Non-Technical'
 * - branch: Department/branch alignment (CSE, IT, AIML, EXTC, Mechanical, Civil, Open to All)
 * - description: Concise, engaging explanation of participant tasks
 * - fee: Entry fee
 * - date: Scheduled date/time
 * - venue: Venue or campus block
 * - teamSize: Team size requirements
 * - prizePool: Prize details if applicable
 * - rules: Rules of engagement
 * - googleFormUrl: External or internal registration link
 * - isBranchExclusive: Boolean flag (default false — branch does not restrict participation)
 */

export const eventsData = [
  // ==========================================
  // TECHNICAL EVENTS
  // ==========================================
  {
    id: 'hackathon',
    name: 'Doomsday Hackathon',
    category: 'Technical',
    branch: 'CSE / IT / AIML',
    isBranchExclusive: false,
    fee: 'Free',
    date: 'March 15, 2026 // 09:00 IST',
    venue: 'Computing Hub // Lab 401',
    teamSize: '2–4 members',
    prizePool: '₹30,000 + Tech Gear',
    description: 'An intensive 24-hour engineering sprint where teams design, build, and deploy full-stack or AI-powered solutions to real-world problem statements under high pressure.',
    rules: [
      'Teams must consist of 2 to 4 eligible student participants.',
      'All product code, models, and architectures must be authored during the 24-hour sprint window.',
      'Open-source libraries, frameworks, and APIs are permitted provided they are properly cited.',
      'Evaluation criteria: Innovation (30%), Technical Depth (30%), Execution & Stability (20%), Final Pitch (20%).'
    ],
    googleFormUrl: '#',
    coordinators: [
      { name: 'Aarav Sharma', contact: '+91 98765 43210' },
      { name: 'Priya Nair', contact: '+91 98765 43211' }
    ]
  },
  {
    id: 'robo-wars',
    name: 'Robo Wars: Metal Carnage',
    category: 'Technical',
    branch: 'Mechanical / EXTC',
    isBranchExclusive: false,
    fee: '₹500 / team',
    date: 'March 16, 2026 // 11:00 IST',
    venue: 'The Steel Arena // Ground Courtyard',
    teamSize: '3–5 members',
    prizePool: '₹40,000',
    description: 'Custom-engineered combat robots clash in a fortified steel arena. Test your armor, drive systems, and kinetic weapons in elimination deathmatches.',
    rules: [
      'Maximum robot weight limit: 25 kg (+/- 2% tolerance).',
      'Remote wireless control only (2.4GHz safe link). Redundant fail-safe kill switch required.',
      'Banned weapon systems: Liquid flammables, explosives, EMP/jammer transmitters, untethered projectiles.',
      'Bouts run for 3 minutes. Winner determined by knockout, immobilization, or judge points.'
    ],
    googleFormUrl: '#',
    coordinators: [
      { name: 'Rohan Deshmukh', contact: '+91 98765 43212' },
      { name: 'Vikram Singh', contact: '+91 98765 43213' }
    ]
  },
  {
    id: 'circuit-craft',
    name: 'Silicon Siege: Circuit Design & Hardware Trial',
    category: 'Technical',
    branch: 'EXTC / Electrical',
    isBranchExclusive: false,
    fee: '₹150 / participant',
    date: 'March 15, 2026 // 14:00 IST',
    venue: 'Hardware Prototype Lab // Room 204',
    teamSize: '1–2 members',
    prizePool: '₹15,000',
    description: 'Diagnose faulty circuit schematics, debug microcontroller telemetry, and solder custom sensor boards against the countdown clock.',
    rules: [
      'Round 1: Rapid fault detection on breadboards and digital logic analyzers (30 mins).',
      'Round 2: PCB layout optimization and physical component assembly (60 mins).',
      'All soldering stations, components, and safety equipment are provided on site.',
      'Scoring based on circuit accuracy, noise suppression, and speed.'
    ],
    googleFormUrl: '#',
    coordinators: [
      { name: 'Ananya Verma', contact: '+91 98765 43214' }
    ]
  },
  {
    id: 'code-chronicles',
    name: 'Algorithmic Arena: Speed Coding',
    category: 'Technical',
    branch: 'CSE / IT',
    isBranchExclusive: false,
    fee: 'Free',
    date: 'March 16, 2026 // 10:00 IST',
    venue: 'Software Center // Terminal 1',
    teamSize: 'Solo',
    prizePool: '₹12,000',
    description: 'Competitive programming battle testing data structures, algorithmic efficiency, and edge-case handling under strict time limits.',
    rules: [
      'Supported languages: C++, Java, Python 3, Go, Rust.',
      'Automated online judge with hidden test cases and strict CPU/memory limits.',
      'Penalty applied for wrong submissions. Highest score with lowest total time wins.',
      'Zero tolerance for plagiarism or unauthorized external AI tools.'
    ],
    googleFormUrl: '#',
    coordinators: [
      { name: 'Devendra Patel', contact: '+91 98765 43215' }
    ]
  },

  // ==========================================
  // NON-TECHNICAL EVENTS
  // ==========================================
  {
    id: 'gaming-arena',
    name: 'Cyber Arena: Esports Championship',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: '₹300 / team',
    date: 'March 15, 2026 // 12:00 IST',
    venue: 'Esports Dome // Seminar Hall B',
    teamSize: 'Solo / Squad (5)',
    prizePool: '₹25,000 + Merchandise',
    description: 'High-octane competitive gaming tournaments across Valorant, BGMI, and FIFA. Strategy, reflexes, and tactical coordination decide who dominates the bracket.',
    rules: [
      'Tournament follows standard double-elimination knockout format.',
      'PC tournament: Tournament PCs provided; personal mice, keyboards, and headsets allowed.',
      'Mobile tournament: Bring your own mobile device; no emulators or third-party triggers.',
      'Unsportsmanlike conduct or toxic behavior results in immediate team disqualification.'
    ],
    googleFormUrl: '#',
    coordinators: [
      { name: 'Sameer Khan', contact: '+91 98765 43216' },
      { name: 'Rahul Joshi', contact: '+91 98765 43217' }
    ]
  },
  {
    id: 'cultural-night',
    name: 'Battle of the Bands & Stage Arts',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: 'Free',
    date: 'March 16, 2026 // 18:00 IST',
    venue: 'Open Air Amphitheatre',
    teamSize: 'Solo / Group (up to 8)',
    prizePool: '₹20,000 + Trophies',
    description: 'Live musical showdowns, acoustic battles, and theatrical stage performances under the festival spotlight. Bring raw energy and captivate the audience.',
    rules: [
      'Stage slot: 10 minutes total (including 2-minute line check).',
      'Standard drum kit, PA system, and monitor speakers provided. Bands bring personal instruments.',
      'Explicit or offensive lyrical content will result in point deductions or disqualification.',
      'Judged on musicality, stage presence, crowd engagement, and originality.'
    ],
    googleFormUrl: '#',
    coordinators: [
      { name: 'Tanvi Kulkarni', contact: '+91 98765 43218' }
    ]
  },
  {
    id: 'trivia-protocol',
    name: 'The Latverian Inquisition: Pop & Mystery Quiz',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: '₹100 / team',
    date: 'March 15, 2026 // 15:30 IST',
    venue: 'Auditorium 2',
    teamSize: '2 members',
    prizePool: '₹10,000',
    description: 'Fast-paced trivia gauntlet covering cinema, comics, sci-fi lore, memes, and pop-culture mysteries. Buzzer rounds, visual puzzles, and high-stakes wager questions.',
    rules: [
      'Round 1: 30-question written preliminary screening.',
      'Top 6 teams advance to live onstage buzzer finals.',
      'No electronic devices or smartphones permitted during quiz rounds.',
      'The Quizmaster decision is final and binding.'
    ],
    googleFormUrl: '#',
    coordinators: [
      { name: 'Aditya Mehta', contact: '+91 98765 43219' }
    ]
  }
]

/**
 * Helper to fetch events filtered by category
 */
export function getEventsByCategory(category) {
  if (!category) return eventsData
  return eventsData.filter(
    (e) => e.category.toLowerCase() === category.toLowerCase()
  )
}

/**
 * Helper to get a single event by ID/slug
 */
export function getEventById(id) {
  return eventsData.find((e) => e.id.toLowerCase() === id.toLowerCase())
}
