/**
 * Script to synchronize all 23 official proposed events into MongoDB Atlas
 * Run with: node scripts/sync_events.js
 */
require('dotenv').config()
const mongoose = require('mongoose')
const Event = require('../models/Event')
const connectDB = require('../config/db')

const officialEvents = [
  // TECHNICAL (15)
  {
    slug: 'robo-soccer',
    name: 'Robo Soccer',
    category: 'Technical',
    branch: 'Electronics / Mechanical',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 15, 2026',
    startTime: '10:00 IST',
    endTime: '13:00 IST',
    venue: 'Robotics Arena // Ground Floor',
    teamSize: '2–4 members',
    minTeamSize: 2,
    maxTeamSize: 4,
    capacity: 32,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Trophies',
    description: 'Teams program robots to play soccer, blending mechanics and coding.',
    rules: [
      'Teams must consist of 2 to 4 members.',
      'Robots must comply with standard size, weight, and radio frequency regulations.',
      'Matches follow knockout tournament rules with 5-minute halves.',
      'Autonomous and manual wireless-controlled bots are evaluated based on agility, goals scored, and fair play.'
    ]
  },
  {
    slug: 'prompt-mania',
    name: 'Prompt Mania',
    category: 'Technical',
    branch: 'Computer',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 15, 2026',
    startTime: '11:30 IST',
    endTime: '13:30 IST',
    venue: 'AI & Computing Lab // Room 302',
    teamSize: 'Solo / Duo (1–2 members)',
    minTeamSize: 1,
    maxTeamSize: 2,
    capacity: 60,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Merch',
    description: 'A coding challenge driven by creative prompts.',
    rules: [
      'Participants receive dynamic scenario prompts and must engineer efficient code solutions.',
      'Prompt engineering skills, code accuracy, and algorithmic execution speed determine scoring.',
      'Multiple difficulty tiers will be unveiled in rapid rounds.',
      'Use of unauthorized third-party solvers is strictly prohibited.'
    ]
  },
  {
    slug: 'code-musketeer',
    name: 'Code Musketeer',
    category: 'Technical',
    branch: 'Computer',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 15, 2026',
    startTime: '14:00 IST',
    endTime: '16:00 IST',
    venue: 'Software Center // Terminal 1',
    teamSize: 'Solo',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 80,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Trophies',
    description: 'Competitive coding contest solving algorithmic problems under time limits.',
    rules: [
      'Individual speed coding contest testing data structures, algorithms, and complexity optimization.',
      'Supported languages: C++, Java, Python 3, Go.',
      'Automated judge scoring with hidden test cases; penalty on wrong submissions.',
      'Plagiarism or use of pre-written modules will result in immediate disqualification.'
    ]
  },
  {
    slug: 'tech-arena',
    name: 'Tech Arena',
    category: 'Technical',
    branch: 'Computer / Electronics',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 15, 2026',
    startTime: '15:30 IST',
    endTime: '17:30 IST',
    venue: 'Central Seminar Hall // Block A',
    teamSize: '2–3 members',
    minTeamSize: 2,
    maxTeamSize: 3,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Certificates',
    description: 'A multi-domain contest testing applied technical knowledge.',
    rules: [
      'Combines cross-disciplinary challenges across computer science, electronics, and logic systems.',
      'Round 1: Rapid technical triage and diagnostic round.',
      'Round 2: Applied problem-solving and architectural synthesis.',
      'Teams are evaluated on accuracy, technical breadth, and innovative approaches.'
    ]
  },
  {
    slug: 'technical-treasure-hunt',
    name: 'Technical Treasure Hunt',
    category: 'Technical',
    branch: 'Computer',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 16, 2026',
    startTime: '09:30 IST',
    endTime: '12:30 IST',
    venue: 'Campus IT Corridor & Tech Labs',
    teamSize: '3–4 members',
    minTeamSize: 3,
    maxTeamSize: 4,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Goodies',
    description: 'Clue-based hunt requiring engineering and IT problem-solving.',
    rules: [
      'Teams decrypt cryptographic clues, inspect source code puzzles, and debug server clues across campus stations.',
      'Each solved riddle unlocks coordinates to the next engineering checkpoint.',
      'Fastest team to complete all technical stages and decrypt the final token wins.',
      'Team members must stay together throughout the hunt.'
    ]
  },
  {
    slug: 'ui-nightmare',
    name: 'UI Nightmare',
    category: 'Technical',
    branch: 'Computer',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 16, 2026',
    startTime: '11:00 IST',
    endTime: '12:30 IST',
    venue: 'Design & Media Lab // Room 205',
    teamSize: 'Solo / Duo (1–2 members)',
    minTeamSize: 1,
    maxTeamSize: 2,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Certificates',
    description: 'Participants fix flawed user interfaces to improve usability.',
    rules: [
      'Participants are handed intentionally broken, inaccessible, and chaotic user interfaces.',
      'Tasks involve redesigning CSS, fixing layout bugs, improving responsiveness, and ensuring accessibility.',
      'Evaluated on UX heuristics, aesthetic polish, and clean code implementation.',
      'All fixes must be completed within the allotted 60-minute sprint.'
    ]
  },
  {
    slug: 'break-the-pattern',
    name: 'Break the Pattern',
    category: 'Technical',
    branch: 'Computer',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 16, 2026',
    startTime: '13:00 IST',
    endTime: '14:30 IST',
    venue: 'Logic & Computation Hall // Room 401',
    teamSize: 'Solo / Duo (1–2 members)',
    minTeamSize: 1,
    maxTeamSize: 2,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Merch',
    description: 'A design logic challenge focused on identifying and breaking patterns.',
    rules: [
      'Participants confront non-traditional mathematical sequences, logic mazes, and algorithmic traps.',
      'The objective is to identify hidden algorithmic patterns and formulate edge cases that break expected outputs.',
      'Speed and analytical lateral thinking are essential.',
      'Points awarded for rigorous proofs and counter-examples.'
    ]
  },
  {
    slug: 'project-competition',
    name: 'Project Competition',
    category: 'Technical',
    branch: 'Multi-branch',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 15, 2026',
    startTime: '10:00 IST',
    endTime: '15:00 IST',
    venue: 'Innovation Hub // Main Courtyard',
    teamSize: '2–4 members',
    minTeamSize: 2,
    maxTeamSize: 4,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Grand Cash Prizes & Trophies',
    description: 'Students present innovative technical projects for evaluation.',
    rules: [
      'Open to projects spanning software, hardware, IoT, AI, mechanical, and civil engineering.',
      'Working prototype demonstration is mandatory during jury evaluation.',
      'Teams must present a 5-minute pitch followed by technical Q&A.',
      'Judging criteria: Innovation (30%), Technical Depth (30%), Practical Impact (20%), Presentation (20%).'
    ]
  },
  {
    slug: 'technical-paper-presentation',
    name: 'Technical Paper Presentation',
    category: 'Technical',
    branch: 'Multi-branch',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 15, 2026',
    startTime: '13:30 IST',
    endTime: '16:30 IST',
    venue: 'Conference Auditorium 1',
    teamSize: '1–3 members',
    minTeamSize: 1,
    maxTeamSize: 3,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Publication Certificates',
    description: 'Formal presentation of research and technical papers.',
    rules: [
      'Papers must adhere to standard IEEE or equivalent academic format.',
      'Each team receives 8 minutes for presentation and 2 minutes for questions from the panel of professors.',
      'Plagiarism limit strictly enforced (below 15%).',
      'Evaluation based on research novelty, methodology, conclusions, and delivery.'
    ]
  },
  {
    slug: 'breaking-the-ai',
    name: 'Breaking the AI',
    category: 'Technical',
    branch: 'Computer',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 16, 2026',
    startTime: '14:30 IST',
    endTime: '16:30 IST',
    venue: 'Machine Learning Lab // Room 304',
    teamSize: 'Solo / Duo (1–2 members)',
    minTeamSize: 1,
    maxTeamSize: 2,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Tech Gear',
    description: 'Contest to test and challenge AI systems creatively.',
    rules: [
      'A jailbreaking, adversarial testing, and prompt red-teaming arena.',
      'Participants must induce guarded AI models to reveal hidden flags, bypass safety alignment, or produce logical paradoxes.',
      'Each successfully uncovered vulnerability or jailbreak earns points based on difficulty tier.',
      'All prompt logs are recorded for impartial jury verification.'
    ]
  },
  {
    slug: 'technical-debate',
    name: 'Technical Debate',
    category: 'Technical',
    branch: 'Multi-branch',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 15, 2026',
    startTime: '15:00 IST',
    endTime: '17:00 IST',
    venue: 'Seminar Hall B // Academic Block',
    teamSize: '2 members',
    minTeamSize: 2,
    maxTeamSize: 2,
    capacity: 32,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Trophies',
    description: 'Structured debate on engineering and technology topics.',
    rules: [
      'Topics cover contemporary engineering ethics, artificial intelligence, quantum computing, and green energy.',
      'Teams are allotted stance (For / Against) 10 minutes prior to the round.',
      'Format includes opening statements, cross-examination, and closing arguments.',
      'Scoring based on argumentative rigor, technical facts, rebuttal quality, and poise.'
    ]
  },
  {
    slug: 'technical-quiz',
    name: 'Technical Quiz',
    category: 'Technical',
    branch: 'Multi-branch',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 16, 2026',
    startTime: '10:30 IST',
    endTime: '12:30 IST',
    venue: 'Auditorium 2',
    teamSize: '2 members',
    minTeamSize: 2,
    maxTeamSize: 2,
    capacity: 60,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Certificates',
    description: 'Quiz competition testing knowledge of engineering and IT.',
    rules: [
      'Round 1: Written preliminary round covering science, engineering history, computing trivia, and tech current affairs.',
      'Top 6 teams advance to live onstage buzzer finals.',
      'Finals include visual connect rounds, rapid-fire gauntlets, and high-risk wager questions.',
      'Use of smartphones or external aids will result in disqualification.'
    ]
  },
  {
    slug: 'volt-rush',
    name: 'Volt Rush',
    category: 'Technical',
    branch: 'Electrical',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 15, 2026',
    startTime: '11:00 IST',
    endTime: '13:00 IST',
    venue: 'Power & Electronics Lab // Room 108',
    teamSize: '1–2 members',
    minTeamSize: 1,
    maxTeamSize: 2,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Hardware Kits',
    description: 'Electrical engineering challenge involving circuits and innovation.',
    rules: [
      'Hands-on troubleshooting of electrical circuits, transformers, and power regulation components.',
      'Participants must diagnose schematic anomalies, assemble breadboard circuits, and measure waveforms.',
      'Safety protocols and insulation equipment must be observed at all times.',
      'Evaluated on circuit accuracy, noise suppression, and speed.'
    ]
  },
  {
    slug: 'cad-design-sprint',
    name: 'CAD Design Sprint',
    category: 'Technical',
    branch: 'Mechanical',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 16, 2026',
    startTime: '11:30 IST',
    endTime: '13:30 IST',
    venue: 'CAD/CAM Modeling Studio // Room 202',
    teamSize: 'Solo / Duo (1–2 members)',
    minTeamSize: 1,
    maxTeamSize: 2,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Trophies',
    description: 'Mechanical design contest using CAD software to model parts/assemblies quickly.',
    rules: [
      'Problem statement provided on the spot with 2D mechanical engineering blueprints.',
      'Participants must model 3D parametric components and assemblies within the sprint timer.',
      'Supported CAD tools: AutoCAD, SolidWorks, Fusion 360, CATIA.',
      'Scoring based on dimensional accuracy, constraint definition, rendering quality, and speed.'
    ]
  },
  {
    slug: 'embedded-systems-showdown',
    name: 'Embedded Systems Showdown',
    category: 'Technical',
    branch: 'Electronics',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 16, 2026',
    startTime: '13:30 IST',
    endTime: '16:00 IST',
    venue: 'Microcontroller & IoT Lab // Room 112',
    teamSize: '2–3 members',
    minTeamSize: 2,
    maxTeamSize: 3,
    capacity: 35,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Development Boards',
    description: 'Electronics-focused challenge building microcontroller-based solutions (Arduino, ESP32, etc.).',
    rules: [
      'Teams are given sensor modules, actuators, and development boards (Arduino / ESP32 / STM32).',
      'The objective is to implement firmware and interface hardware to satisfy an embedded specification.',
      'Proper pin multiplexing, interrupt handling, and sensor telemetry must be demonstrated.',
      'Judged on firmware stability, wiring elegance, and problem resolution.'
    ]
  },

  // NON-TECHNICAL (8)
  {
    slug: 'lazar-room',
    name: 'Lazar Room',
    category: 'Non-Technical',
    branch: 'Electronics / Electrical',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 15, 2026',
    startTime: '10:30 IST',
    endTime: '13:30 IST',
    venue: 'Sensor Optics Lab // Ground Floor',
    teamSize: '2–4 members',
    minTeamSize: 2,
    maxTeamSize: 4,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Merch',
    description: 'A puzzle-based lab challenge testing engineering problem-solving.',
    rules: [
      'Teams enter a dark optics laboratory obstacle course equipped with light beams, mirrors, and sensors.',
      'Solve engineering riddles, calibrate optical alignments, and redirect beams to hit designated targets.',
      'Points awarded based on puzzle completion time and penalty-free moves.',
      'Safety eyewear must be worn throughout the trial.'
    ]
  },
  {
    slug: 'robo-sumo',
    name: 'Robo Sumo',
    category: 'Non-Technical',
    branch: 'Electronics / Mechanical',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 16, 2026',
    startTime: '11:00 IST',
    endTime: '14:00 IST',
    venue: 'Combat Ring // Central Arena',
    teamSize: '2–4 members',
    minTeamSize: 2,
    maxTeamSize: 4,
    capacity: 32,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Trophies',
    description: 'Robots battle in a sumo-style arena, showcasing design and control.',
    rules: [
      'Two autonomous or wireless bots clash within a circular dohyo (sumo ring).',
      'The bot that first pushes the opponent out of the ring or disables it wins the round.',
      'Weight limit: Max 5 kg; no destructive weapons (saws, flames) allowed; traction and pushing power only.',
      'Match consists of three 2-minute rounds.'
    ]
  },
  {
    slug: 'rc-racing',
    name: 'RC Racing',
    category: 'Non-Technical',
    branch: 'Mechanical',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 15, 2026',
    startTime: '14:00 IST',
    endTime: '17:00 IST',
    venue: 'Outdoor Velocity Track // Quadrangle',
    teamSize: 'Solo / Team (1–2 members)',
    minTeamSize: 1,
    maxTeamSize: 2,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Trophies',
    description: 'Remote-controlled cars race on tracks, testing speed and precision.',
    rules: [
      'Participants race custom or standard RC vehicles across high-speed obstacles, hairpin bends, and jumps.',
      'Format includes time-trial qualifying laps followed by elimination grid races.',
      'Battery voltage must adhere to track safety regulations.',
      'Fastest overall lap time wins the championship title.'
    ]
  },
  {
    slug: 'vr',
    name: 'VR (Virtual Reality)',
    category: 'Non-Technical',
    branch: 'Computer',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 15, 2026',
    startTime: '12:00 IST',
    endTime: '15:00 IST',
    venue: 'Immersive Tech Lounge // Room 301',
    teamSize: 'Solo / Duo (1–2 members)',
    minTeamSize: 1,
    maxTeamSize: 2,
    capacity: 60,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & VR Merchandise',
    description: 'Exploring and building virtual reality experiences.',
    rules: [
      'Experience competitive spatial challenges, immersive navigation, and rapid 3D environment exploration.',
      'High-performance VR headsets and sensory motion controllers provided on site.',
      'Scoring based on agility, spatial orientation, and score tallies in simulated trials.',
      'Fair play and safety guidelines strictly monitored by lab marshals.'
    ]
  },
  {
    slug: 'escape-room',
    name: 'Escape Room',
    category: 'Non-Technical',
    branch: 'Multi-branch',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 16, 2026',
    startTime: '10:00 IST',
    endTime: '13:00 IST',
    venue: 'Mystery Chambers // Basement Lab B',
    teamSize: '3–5 members',
    minTeamSize: 3,
    maxTeamSize: 5,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Goodies',
    description: 'A problem-solving challenge where teams escape using logic and tech clues.',
    rules: [
      'Teams are locked in a series of thematic chambers with 45 minutes on the countdown clock.',
      'Crack encrypted physical locks, discover hidden infrared clues, and bypass logic relays.',
      'Three hints are available with timed point penalties.',
      'The team that breaks out in the shortest time claims victory.'
    ]
  },
  {
    slug: 'squid-games',
    name: 'Squid Games',
    category: 'Non-Technical',
    branch: 'Multi-branch',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 16, 2026',
    startTime: '14:00 IST',
    endTime: '17:00 IST',
    venue: 'Campus Sports Ground // Sector 4',
    teamSize: 'Solo / Squad (up to 4 members)',
    minTeamSize: 1,
    maxTeamSize: 4,
    capacity: 100,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Trophies',
    description: 'A set of competitive survival-style tasks adapted with technical twists.',
    rules: [
      'High-intensity survival game rounds featuring sensory reaction trials, tug-of-logic, and agility gauntlets.',
      'Elimination format after each mini-game round.',
      'Referees and automated sensors judge boundary crossings and timer violations.',
      'Last remaining contestants contest the final showdown.'
    ]
  },
  {
    slug: 'ipl-auction',
    name: 'IPL Auction',
    category: 'Non-Technical',
    branch: 'Multi-branch',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 15, 2026',
    startTime: '15:30 IST',
    endTime: '18:30 IST',
    venue: 'Management Seminar Hall // Room 105',
    teamSize: '2–4 members',
    minTeamSize: 2,
    maxTeamSize: 4,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Trophies',
    description: 'Simulation of IPL-style bidding and team formation.',
    rules: [
      'Each franchise team starts with a fixed virtual purse budget and squad constraints.',
      'Dynamic live bidding on marquee batsmen, bowlers, all-rounders, and emerging cricket stars.',
      'Budget management, squad rating balance, and strategic bidding determine the final leaderboard.',
      'Franchises exceeding purse limits or failing team quota are penalized.'
    ]
  },
  {
    slug: 'neon-sports',
    name: 'Neon Football / Neon Cricket',
    category: 'Non-Technical',
    branch: 'Multi-branch',
    isBranchExclusive: false,
    fee: 'TBA',
    date: 'March 15, 2026',
    startTime: '18:00 IST',
    endTime: '21:00 IST',
    venue: 'Indoor Sports Complex // Neon Arena',
    teamSize: 'Squad (5–7 members)',
    minTeamSize: 5,
    maxTeamSize: 7,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    prizePool: 'Exciting Cash Prizes & Medals',
    description: 'Glow-in-the-dark sports event with neon lighting.',
    rules: [
      'Fast-paced 5-a-side matches played in complete darkness with UV neon boundary lines, glowing balls, and jerseys.',
      'Short 10-minute halves for Football; 4-over super-over brackets for Cricket.',
      'Strict non-contact rules to ensure player safety.',
      'Tournament follows single-elimination knockout format.'
    ]
  }
]

async function syncAllEvents() {
  console.log('Connecting to MongoDB Atlas...')
  await connectDB()

  console.log(`Starting sync for ${officialEvents.length} official proposed events...`)

  // Upsert all official events
  for (const evt of officialEvents) {
    await Event.findOneAndUpdate(
      { slug: evt.slug },
      { $set: evt },
      { upsert: true, new: true }
    )
    console.log(`✓ Upserted [${evt.category.toUpperCase()}] ${evt.name} (${evt.slug})`)
  }

  const total = await Event.countDocuments()
  console.log(`\nSynchronization complete! Total events in MongoDB Atlas: ${total}`)
  await mongoose.disconnect()
  process.exit(0)
}

syncAllEvents().catch((err) => {
  console.error('Failed to sync events:', err)
  process.exit(1)
})
