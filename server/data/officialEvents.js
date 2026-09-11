/**
 * VECTORS 26–27 — Master Official Events
 * Extracted directly from official festival brochure (AC Patil College of Engineering)
 */

const officialEvents = [
  // ==========================================
  // TECHNICAL EVENTS (18)
  // ==========================================
  {
    slug: 'technical-debate',
    name: 'Technical Debate',
    category: 'Technical',
    branch: 'Open to All Branches',
    isBranchExclusive: false,
    fee: '₹50 / Person (50/1P)',
    firstPrize: '₹500',
    secondPrize: '₹300',
    prizePool: '1st: ₹500 | 2nd: ₹300',
    date: 'March 15, 2026',
    startTime: '10:00 IST',
    endTime: '13:00 IST',
    venue: 'Seminar Hall B // First Floor',
    venueDetails: {
      building: 'Main Engineering Complex',
      floor: 'First Floor',
      room: 'Seminar Hall B',
      directions: 'Take Central Stairs to First Floor, corridor on left.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    description: 'Structured debate on engineering and technology topics.',
    rules: [
      'Individual participation; topics will be allotted on the spot with prep time.',
      'Participants will debate in favor or against the assigned technology paradigm.',
      'Evaluation criteria include logical argumentation, technical depth, and rebuttal agility.',
      'The jury decision is final and binding.'
    ],
    coordinators: [
      { name: 'Shravani Gosavi', contact: '+91 86522 06648' },
      { name: 'Soumya Pawar', contact: '+91 96993 81920' }
    ]
  },
  {
    slug: 'technical-quiz',
    name: 'Technical Quiz',
    category: 'Technical',
    branch: 'Open to All Branches',
    isBranchExclusive: false,
    fee: '₹50 / Person (50/1P)',
    firstPrize: '₹500',
    secondPrize: '₹300',
    prizePool: '1st: ₹500 | 2nd: ₹300',
    date: 'March 15, 2026',
    startTime: '11:00 IST',
    endTime: '13:30 IST',
    venue: 'Auditorium // Ground Floor',
    venueDetails: {
      building: 'Main Auditorium Complex',
      floor: 'Ground Floor',
      room: 'Main Hall',
      directions: 'Enter through central auditorium doors from front quad.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 60,
    registrationOpen: true,
    status: 'open',
    description: 'Quiz competition testing knowledge of engineering and IT.',
    rules: [
      'Round 1: Rapid-fire screening quiz across core engineering, IT, and emerging tech.',
      'Round 2: Top scorers advance to live onstage buzzer round.',
      'No electronic devices permitted during quiz rounds.',
      'Ties broken by sudden-death questions.'
    ],
    coordinators: [
      { name: 'Yukthi Devadiga', contact: '+91 88287 18083' },
      { name: 'Sara Mahadik', contact: '+91 90829 04487' }
    ]
  },
  {
    slug: 'prompt-mania',
    name: 'Prompt Mania',
    category: 'Technical',
    branch: 'Computer / IT / AI',
    isBranchExclusive: false,
    fee: '₹50 / Person (50/1P)',
    firstPrize: '₹1,500',
    secondPrize: '₹1,000',
    prizePool: '1st: ₹1,500 | 2nd: ₹1,000',
    date: 'March 15, 2026',
    startTime: '11:30 IST',
    endTime: '14:00 IST',
    venue: 'AI & Computing Lab // Room 302',
    venueDetails: {
      building: 'Computer Engineering Block',
      floor: '3rd Floor',
      room: 'Room 302',
      directions: 'Take North Wing stairs to 3rd Floor, directly facing the corridor.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 60,
    registrationOpen: true,
    status: 'open',
    description: 'A coding challenge driven by creative prompts.',
    rules: [
      'Participants receive dynamic problem prompts and must craft precise solutions.',
      'Judged on prompt engineering effectiveness, solution accuracy, and completion speed.',
      'Multiple difficulty tiers will be unveiled in rapid sequential rounds.',
      'Fair play protocol: External unauthorized solvers are prohibited.'
    ],
    coordinators: [
      { name: 'Akshata Mishra', contact: '+91 89765 26414' },
      { name: 'Mitansh Jadhav', contact: '+91 85911 52587' }
    ]
  },
  {
    slug: 'tech-arena',
    name: 'Tech Arena 2.0',
    category: 'Technical',
    branch: 'Open to All Branches',
    isBranchExclusive: false,
    fee: '₹50 / Person (50/1P)',
    firstPrize: '₹1,500',
    secondPrize: '₹1,000',
    prizePool: '1st: ₹1,500 | 2nd: ₹1,000',
    date: 'March 15, 2026',
    startTime: '14:00 IST',
    endTime: '17:00 IST',
    venue: 'Central Seminar Hall // Block A',
    venueDetails: {
      building: 'Tech Block A',
      floor: '2nd Floor',
      room: 'Central Hall',
      directions: 'Main entrance of Block A, take escalator to 2nd Floor.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    description: 'A multi-domain contest testing applied technical knowledge.',
    rules: [
      'Multi-domain arena challenging general engineering, digital logic, and aptitude.',
      'Round 1: Speed diagnostics and circuit/code debugging.',
      'Round 2: Applied technical integration and system troubleshooting.',
      'Top aggregate scores claim the arena championship.'
    ],
    coordinators: [
      { name: 'Shridhar Kalasgonda', contact: '+91 90047 89940' },
      { name: 'Chaitanya Sawant', contact: '+91 84519 64399' }
    ]
  },
  {
    slug: 'breaking-the-ai',
    name: 'Breaking the AI',
    category: 'Technical',
    branch: 'AI / Data Science / Computer',
    isBranchExclusive: false,
    fee: '₹50 / Person (50/1P)',
    firstPrize: '₹1,000',
    secondPrize: '₹600',
    prizePool: '1st: ₹1,000 | 2nd: ₹600',
    date: 'March 15, 2026',
    startTime: '14:30 IST',
    endTime: '17:00 IST',
    venue: 'Machine Learning Lab // Room 304',
    venueDetails: {
      building: 'Computer Engineering Block',
      floor: '3rd Floor',
      room: 'Lab 304',
      directions: 'Adjacent to AI Lab 302.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    description: 'Contest to test and challenge AI systems creatively.',
    rules: [
      'Participants interact with constrained AI models to identify vulnerabilities and jailbreaks.',
      'Points awarded for successful edge-case elicitation and guardrail bypassing.',
      'Systematic documentation of prompts and responses is mandatory.',
      'Ethical red-teaming guidelines must be adhered to throughout.'
    ],
    coordinators: [
      { name: 'Pranjal Dhanawade', contact: '+91 98344 29122' },
      { name: 'Madhura Khade', contact: '+91 87796 93988' }
    ]
  },
  {
    slug: 'ui-nightmare',
    name: 'UI Nightmare',
    category: 'Technical',
    branch: 'Design / Web / Computer',
    isBranchExclusive: false,
    fee: '₹50 / Person (50/1P)',
    firstPrize: '₹1,200',
    secondPrize: '₹800',
    prizePool: '1st: ₹1,200 | 2nd: ₹800',
    date: 'March 15, 2026',
    startTime: '12:00 IST',
    endTime: '14:30 IST',
    venue: 'Design & Graphics Lab // Room 205',
    venueDetails: {
      building: 'IT Block',
      floor: '2nd Floor',
      room: 'Lab 205',
      directions: '2nd Floor corridor, room on eastern wing.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    description: 'Participants fix flawed user interfaces to improve usability.',
    rules: [
      'Participants receive intentionally broken, chaotic, and anti-pattern web interfaces.',
      'Goal: Refactor code, layout, and UX to adhere to modern accessibility and design principles.',
      'Judged on visual polish, responsive behavior, usability heuristics, and code cleanliness.'
    ],
    coordinators: [
      { name: 'Taresh R. Ivalekar', contact: '+91 99605 94908' },
      { name: 'Tanishq Gore', contact: '+91 99873 23799' }
    ]
  },
  {
    slug: 'code-musketeer',
    name: 'Code Musketeer',
    category: 'Technical',
    branch: 'Computer / IT',
    isBranchExclusive: false,
    fee: '₹50 / Person (50/1P)',
    firstPrize: '₹1,000',
    secondPrize: '₹500',
    prizePool: '1st: ₹1,000 | 2nd: ₹500',
    date: 'March 15, 2026',
    startTime: '15:00 IST',
    endTime: '17:30 IST',
    venue: 'Software Center // Terminal 1',
    venueDetails: {
      building: 'Software Center',
      floor: 'Ground Floor',
      room: 'Terminal Bay 1',
      directions: 'Enter through north courtyard glass entrance.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 60,
    registrationOpen: true,
    status: 'open',
    description: 'Competitive coding contest solving algorithmic problems under time limits.',
    rules: [
      'Speed coding contest testing data structures, algorithms, and time complexity.',
      'Supported languages: C++, Java, Python 3, JavaScript.',
      'Automated judge scoring with hidden test cases; penalties for incorrect submissions.',
      'Any form of malpractice or code plagiarism leads to immediate disqualification.'
    ],
    coordinators: [
      { name: 'Ali Lala', contact: '+91 96534 94171' },
      { name: 'Manasvi Khamkar', contact: '+91 86690 27650' }
    ]
  },
  {
    slug: 'project-competition',
    name: 'Project Competition',
    category: 'Technical',
    branch: 'All Engineering Branches',
    isBranchExclusive: false,
    fee: '₹80 / Team (80/4P)',
    firstPrize: '₹1,000',
    secondPrize: '₹500',
    prizePool: '1st: ₹1,000 | 2nd: ₹500',
    date: 'March 16, 2026',
    startTime: '10:00 IST',
    endTime: '14:00 IST',
    venue: 'Project Exhibition Hall // Ground Floor',
    venueDetails: {
      building: 'Central Exhibition Hall',
      floor: 'Ground Floor',
      room: 'Exhibition Arena',
      directions: 'Follow signs from main foyer to Exhibition Hall.'
    },
    teamSize: 'Team (1–4 members)',
    minTeamSize: 1,
    maxTeamSize: 4,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    description: 'Students present innovative technical projects for evaluation.',
    rules: [
      'Open to hardware, software, IoT, and interdisciplinary engineering projects.',
      'Each team gets designated booth space and power supply for physical demonstration.',
      'Evaluation rubric: Innovation, technical complexity, social relevance, and presentation clarity.'
    ],
    coordinators: [
      { name: 'Aryan Patil', contact: '+91 93216 38772' },
      { name: 'Smita Nigade', contact: '+91 93248 85232' }
    ]
  },
  {
    slug: 'tech-traitors',
    name: 'Tech Traitors',
    category: 'Technical',
    branch: 'Open to All Branches',
    isBranchExclusive: false,
    fee: '₹80 / Team (80/4P)',
    firstPrize: '₹1,500',
    secondPrize: '₹1,200',
    prizePool: '1st: ₹1,500 | 2nd: ₹1,200',
    date: 'March 16, 2026',
    startTime: '11:00 IST',
    endTime: '14:00 IST',
    venue: 'Seminar Hall C // Second Floor',
    venueDetails: {
      building: 'Main Tech Block',
      floor: '2nd Floor',
      room: 'Hall C',
      directions: 'Second Floor south wing.'
    },
    teamSize: 'Team (4 members)',
    minTeamSize: 4,
    maxTeamSize: 4,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    description: 'Solve challenges, uncover the traitor, and survive to become the champion!',
    rules: [
      'Teams must solve complex engineering tasks while an undercover traitor secretly sabotages progress.',
      'Team members analyze clues, debate evidence, and vote each round.',
      'Survival, task completion rate, and deductive accuracy determine final champions.'
    ],
    coordinators: [
      { name: 'Dhanshri Deshmukh', contact: '+91 98217 79088' },
      { name: 'Gargi Bhole', contact: '+91 87887 70270' }
    ]
  },
  {
    slug: 'cad-clash',
    name: 'CAD Clash',
    category: 'Technical',
    branch: 'Mechanical / Civil / Design',
    isBranchExclusive: false,
    fee: '₹80 / Person (80/1P)',
    firstPrize: '₹1,000',
    secondPrize: '₹800',
    prizePool: '1st: ₹1,000 | 2nd: ₹800',
    date: 'March 15, 2026',
    startTime: '13:00 IST',
    endTime: '15:30 IST',
    venue: 'CAD/CAM Simulation Center // Room 108',
    venueDetails: {
      building: 'Mechanical Sciences Complex',
      floor: '1st Floor',
      room: 'Room 108',
      directions: 'Directly above Workshop Arena.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    description: 'A precision drafting challenge testing technical drawing, speed, and 3D visualization.',
    rules: [
      'Individual CAD modelling and drafting competition using standard industry tools (AutoCAD / SolidWorks / Fusion 360).',
      'Round 1: 2D drafting precision under strict time constraint.',
      'Round 2: Complex 3D parametric part modelling and assembly from isometric blueprints.',
      'Scoring based on dimensional accuracy, geometric constraints, and completion speed.'
    ],
    coordinators: [
      { name: 'Deepak Choudhary', contact: '+91 91529 01441' },
      { name: 'Vaishnavi Bawaskar', contact: '+91 83695 50995' }
    ]
  },
  {
    slug: 'code-fusion-ai',
    name: 'Code Fusion AI',
    category: 'Technical',
    branch: 'Computer / IT / AI',
    isBranchExclusive: false,
    fee: '₹50 / Person (50/1P)',
    firstPrize: '₹1,000',
    secondPrize: '₹800',
    prizePool: '1st: ₹1,000 | 2nd: ₹800',
    date: 'March 15, 2026',
    startTime: '15:30 IST',
    endTime: '18:00 IST',
    venue: 'Advanced AI Lab // Room 305',
    venueDetails: {
      building: 'Computer Engineering Block',
      floor: '3rd Floor',
      room: 'Lab 305',
      directions: 'Opposite ML Lab 304.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    description: 'A three-round technical competition testing programming, logic, and AI skills.',
    rules: [
      'Round 1: Algorithmic logic and data structure debugging.',
      'Round 2: Machine learning model tuning and feature engineering sprint.',
      'Round 3: Integrated problem solving combining programmatic logic with AI APIs.',
      'Judged on pipeline efficiency, solution validity, and execution latency.'
    ],
    coordinators: [
      { name: 'Rudra Burbadkar', contact: '+91 83695 66780' },
      { name: 'Om Korade', contact: '+91 95949 07384' }
    ]
  },
  {
    slug: 'technical-treasure-hunt',
    name: 'Technical Treasure Hunt',
    category: 'Technical',
    branch: 'Open to All Branches',
    isBranchExclusive: false,
    fee: '₹200 / Team (200/4P)',
    firstPrize: '₹1,200',
    secondPrize: '₹800',
    prizePool: '1st: ₹1,200 | 2nd: ₹800',
    date: 'March 16, 2026',
    startTime: '11:30 IST',
    endTime: '15:00 IST',
    venue: 'Campus Complex // Central Amphitheatre',
    venueDetails: {
      building: 'Central Campus Complex',
      floor: 'Ground',
      room: 'Amphitheatre Checkpoint',
      directions: 'Gather at the central amphitheatre stage.'
    },
    teamSize: 'Team (4 members)',
    minTeamSize: 4,
    maxTeamSize: 4,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    description: 'Clue-based hunt requiring engineering and IT problem-solving.',
    rules: [
      'Teams solve cryptograms, logic puzzles, circuit schematics, and binary riddles.',
      'Each solved clue reveals physical geo-coordinates to the next technical checkpoint across campus.',
      'First team to successfully decipher all checkpoints and reach the final vault wins.'
    ],
    coordinators: [
      { name: 'Atharv Kolhe', contact: '+91 74004 84814' },
      { name: 'Sahil Borse', contact: '+91 90118 95074' }
    ]
  },
  {
    slug: 'bolt-rush',
    name: 'Bolt Rush',
    category: 'Technical',
    branch: 'Electrical / Electronics',
    isBranchExclusive: false,
    fee: '₹30 (Solo) / ₹60 (Duo)',
    firstPrize: '₹300 (Solo)',
    secondPrize: '₹600 (Duo)',
    prizePool: 'Solo: ₹300 | Duo: ₹600',
    date: 'March 15, 2026',
    startTime: '12:30 IST',
    endTime: '15:00 IST',
    venue: 'Electrical Engineering Workshop // Room 102',
    venueDetails: {
      building: 'Electrical Complex',
      floor: 'Ground Floor',
      room: 'Workshop 102',
      directions: 'Directly opposite the robotics hub.'
    },
    teamSize: 'Solo / Duo (1–2 members)',
    minTeamSize: 1,
    maxTeamSize: 2,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    description: 'Electrical engineering challenge involving circuits and innovation.',
    rules: [
      'Solo or Duo participation permitted.',
      'Round 1: Component identification, circuit analysis, and impedance calculation.',
      'Round 2: Live breadboard circuit design, troubleshooting, and waveform synthesis.',
      'Evaluated on circuit functionality, safety adherence, and completion speed.'
    ],
    coordinators: [
      { name: 'Sarvesh Shinde', contact: '+91 93215 46460' },
      { name: 'Unnati Nankile', contact: '+91 82088 27879' }
    ]
  },
  {
    slug: 'the-50',
    name: 'The 50',
    category: 'Technical',
    branch: 'Open to All Branches',
    isBranchExclusive: false,
    fee: '₹150 / Team (1–4P)',
    firstPrize: '₹1,000',
    secondPrize: '₹800',
    prizePool: '1st: ₹1,000 | 2nd: ₹800',
    date: 'March 16, 2026',
    startTime: '14:00 IST',
    endTime: '16:30 IST',
    venue: 'Seminar Hall A // First Floor',
    venueDetails: {
      building: 'Main Tech Block',
      floor: '1st Floor',
      room: 'Hall A',
      directions: 'Opposite Library entrance on first floor.'
    },
    teamSize: 'Team (1–4 members)',
    minTeamSize: 1,
    maxTeamSize: 4,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    description: 'A fast-paced puzzle challenge testing logical thinking, observation, technical knowledge, and decision-making.',
    rules: [
      'Teams race against a 50-minute countdown to solve 50 escalating micro-puzzles.',
      'Puzzles range from algorithmic logic to pattern recognition and mechanical observation.',
      'Points awarded per correct solution; penalty applied for skipped or incorrect submissions.',
      'Highest aggregate score at the 50-minute buzzer wins.'
    ],
    coordinators: [
      { name: 'Tanvi Bhamare', contact: '+91 87797 73908' },
      { name: 'Arya Thakur', contact: '+91 95271 97560' }
    ]
  },
  {
    slug: 'embedded-systems-showdown',
    name: 'Embedded Systems Showdown',
    category: 'Technical',
    branch: 'Electronics / IoT',
    isBranchExclusive: false,
    fee: '₹75 / Person (75/1P)',
    firstPrize: '₹800',
    secondPrize: '₹500',
    prizePool: '1st: ₹800 | 2nd: ₹500',
    date: 'March 15, 2026',
    startTime: '13:30 IST',
    endTime: '16:30 IST',
    venue: 'Microcontroller & Embedded Lab // Room 210',
    venueDetails: {
      building: 'Electronics Block',
      floor: '2nd Floor',
      room: 'Lab 210',
      directions: 'Take South elevators to 2nd Floor, enter embedded lab.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 35,
    registrationOpen: true,
    status: 'open',
    description: 'Crack the code: Solve clues and enter the code to unlock the box.',
    rules: [
      'Individual embedded engineering challenge.',
      'Participants decipher hardware schematics, register values, and serial outputs.',
      'Program the designated microcontroller to trigger actuators and unlock the electronic vault.',
      'First participant to crack all stages and unlock the box claims victory.'
    ],
    coordinators: [
      { name: 'Manas Sanjay Bhise', contact: '+91 91377 02048' },
      { name: 'Omkar Bali', contact: '+91 87792 13361' }
    ]
  },
  {
    slug: 'rc-bomb-escape',
    name: 'RC Bomb Escape',
    category: 'Technical',
    branch: 'Robotics / Electronics',
    isBranchExclusive: false,
    fee: '₹70 / Person (70/1P)',
    firstPrize: '₹800',
    secondPrize: '₹500',
    prizePool: '1st: ₹800 | 2nd: ₹500',
    date: 'March 16, 2026',
    startTime: '12:00 IST',
    endTime: '15:00 IST',
    venue: 'RC Obstacle Arena // Outdoor Quad',
    venueDetails: {
      building: 'Outdoor Sports Quad',
      floor: 'Ground',
      room: 'RC Obstacle Track',
      directions: 'Enclosed perimeter inside the main lawn.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    description: 'RC driving challenge, navigate a narrow obstacle track with speed and precision while avoiding penalties.',
    rules: [
      'Pilots steer remote-controlled vehicles across a hazardous obstacle course carrying a payload.',
      'Strict time penalties for touching boundary barriers, obstacles, or dropping the payload.',
      'Fastest pilot with zero or minimal penalty deductions takes top prize.'
    ],
    coordinators: [
      { name: 'Aryan Bhoir', contact: '+91 70452 87346' },
      { name: 'Chinmay Gokhale', contact: '+91 77771 04858' }
    ]
  },
  {
    slug: 'technical-paper-presentation',
    name: 'Technical Paper Presentation',
    category: 'Technical',
    branch: 'Open to All Branches',
    isBranchExclusive: false,
    fee: '₹100 / Team (100/2P)',
    firstPrize: '₹1,000',
    secondPrize: '₹700',
    prizePool: '1st: ₹1,000 | 2nd: ₹700',
    date: 'March 15, 2026',
    startTime: '10:30 IST',
    endTime: '13:30 IST',
    venue: 'Conference Hall // Block B',
    venueDetails: {
      building: 'Administrative Block B',
      floor: '3rd Floor',
      room: 'Conference Hall',
      directions: 'Third floor executive wing.'
    },
    teamSize: 'Team (2 members)',
    minTeamSize: 2,
    maxTeamSize: 2,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    description: 'Present innovative ideas and technical research.',
    rules: [
      'Teams of 2 submit and present technical research papers adhering to standard IEEE format.',
      '10-minute presentation followed by 5 minutes of intensive Q&A with the academic jury.',
      'Judged on technical rigor, original methodology, presentation clarity, and citation depth.'
    ],
    coordinators: [
      { name: 'Prathamesh Arya', contact: '+91 81043 75419' },
      { name: 'Jayesh Sonawane', contact: '+91 91520 71305' }
    ]
  },
  {
    slug: 'fpv-flight',
    name: 'FPV Flight',
    category: 'Technical',
    branch: 'Aero / Electronics / Drone',
    isBranchExclusive: false,
    fee: '₹50 / Person (50/1P)',
    firstPrize: '₹600',
    secondPrize: '₹400',
    prizePool: '1st: ₹600 | 2nd: ₹400',
    date: 'March 16, 2026',
    startTime: '13:00 IST',
    endTime: '16:00 IST',
    venue: 'Drone Flying Cage // Ground Arena',
    venueDetails: {
      building: 'Grounds Complex',
      floor: 'Ground',
      room: 'Safety Mesh Drone Arena',
      directions: 'Located between basketball court and engineering lab block.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    description: 'Take flight, race the FPV drone, and conquer the challenge!',
    rules: [
      'Pilots race first-person-view micro drones through lit hoops and obstacle gates.',
      'Time-trial format: 3 laps per heat; missed gates incur 5-second penalties.',
      'Safety goggles and emergency failsafe switches strictly required.'
    ],
    coordinators: [
      { name: 'Shriyash Choughule', contact: '+91 99306 96186' },
      { name: 'Suresh Bhusnure', contact: '+91 98925 05249' }
    ]
  },

  // ==========================================
  // NON-TECHNICAL / ARENA EVENTS (11)
  // ==========================================
  {
    slug: 'laser-room',
    name: 'Laser Room',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: '₹100 / Team (100/2P)',
    firstPrize: '₹1,500',
    secondPrize: '₹800',
    prizePool: '1st: ₹1,500 | 2nd: ₹800',
    date: 'March 15, 2026',
    startTime: '11:00 IST',
    endTime: '18:00 IST',
    venue: 'Blackout Chamber // Ground Floor',
    venueDetails: {
      building: 'Activity Center',
      floor: 'Ground Floor',
      room: 'Chamber 01',
      directions: 'Directly behind central canteen complex.'
    },
    teamSize: 'Team (2 members)',
    minTeamSize: 2,
    maxTeamSize: 2,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    description: 'Laser mission: Teams race against the clock, testing speed, precision, and coordination.',
    rules: [
      'Teams navigate through a dense, crisscrossing laser beam maze without breaking any optical sensors.',
      'Breaking a beam triggers alarms and incurs time penalties.',
      'Fastest team to press the terminal deactivation button with minimal penalties wins.'
    ],
    coordinators: [
      { name: 'Kanishk Kadam', contact: '+91 96536 17946' },
      { name: 'Kartik Patil', contact: '+91 81694 94827' }
    ]
  },
  {
    slug: 'dooms-countdown',
    name: 'Dooms Countdown',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: '₹90 / Team (90/3P)',
    firstPrize: '₹600',
    secondPrize: '₹450',
    prizePool: '1st: ₹600 | 2nd: ₹450',
    date: 'March 16, 2026',
    startTime: '11:00 IST',
    endTime: '15:00 IST',
    venue: 'Puzzle Bunker // Room 105',
    venueDetails: {
      building: 'Applied Sciences Wing',
      floor: '1st Floor',
      room: 'Room 105',
      directions: 'Follow directional signs from south stairwell.'
    },
    teamSize: 'Team (3 members)',
    minTeamSize: 3,
    maxTeamSize: 3,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    description: 'A 5-minute team puzzle mission testing coordination and problem-solving.',
    rules: [
      'Teams of 3 are locked in with a 5-minute countdown ticking on the main screen.',
      'Solve synchronized cryptographic, mechanical, and visual puzzles simultaneously.',
      'All 3 stations must be solved before the detonation timer reaches zero.'
    ],
    coordinators: [
      { name: 'Darshan Kandalgaokar', contact: '+91 84589 36724' },
      { name: 'Sujal Rautela', contact: '+91 99878 78949' }
    ]
  },
  {
    slug: 'flight-frenzy',
    name: 'Flight Frenzy',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: '₹75 / Person (75/1P)',
    firstPrize: '₹700',
    secondPrize: '₹500',
    prizePool: '1st: ₹700 | 2nd: ₹500',
    date: 'March 15, 2026',
    startTime: '14:00 IST',
    endTime: '17:00 IST',
    venue: 'Central Quad // Lawn Arena',
    venueDetails: {
      building: 'Central Lawn',
      floor: 'Ground',
      room: 'Flight Range',
      directions: 'Open grass turf at central campus.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 60,
    registrationOpen: true,
    status: 'open',
    description: 'A solo paper-plane precision throwing challenge. Fold, aim, and hit the targets in 4 minutes!',
    rules: [
      'Standard A4 paper provided by the organizers; no additional weights or adhesives permitted.',
      'Participants fold their custom aerodynamic aircraft and target precision bullseyes and hoops.',
      'Scoring based on target accuracy, flight duration, and distance.'
    ],
    coordinators: [
      { name: 'Balraj Pattanayak', contact: '+91 87798 41383' },
      { name: 'Prajyot Mhatre', contact: '+91 99302 40617' }
    ]
  },
  {
    slug: 'neon-cricket',
    name: 'Neon Cricket',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: '₹200 / Team (200/4P)',
    firstPrize: '₹1,500',
    secondPrize: '₹1,000',
    prizePool: '1st: ₹1,500 | 2nd: ₹1,000',
    date: 'March 15, 2026',
    startTime: '17:00 IST',
    endTime: '21:00 IST',
    venue: 'Indoor Sports Complex // Neon Court 1',
    venueDetails: {
      building: 'Indoor Sports Complex',
      floor: 'Ground Floor',
      room: 'Court 1',
      directions: 'Follow glowing neon signpost from main walkway.'
    },
    teamSize: 'Team (4 members)',
    minTeamSize: 4,
    maxTeamSize: 4,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    description: 'Glow-in-the-dark sports event with neon lighting.',
    rules: [
      'Played in full blackout arena illuminated only by UV blacklights.',
      'Fluorescent glowing balls, neon boundary markers, and glowing bats.',
      'Short 3-over knockout format with sudden-death super overs in case of tie.'
    ],
    coordinators: [
      { name: 'Parth Unde', contact: '+91 70395 20331' },
      { name: 'Siddhesh Dubal', contact: '+91 81048 80788' }
    ]
  },
  {
    slug: 'takeshis-castle',
    name: 'Takeshi\'s Castle',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: '₹50 / Person (50/1P)',
    firstPrize: '₹2,000',
    secondPrize: '₹1,000',
    prizePool: '1st: ₹2,000 | 2nd: ₹1,000',
    date: 'March 16, 2026',
    startTime: '10:00 IST',
    endTime: '14:00 IST',
    venue: 'Main College Grounds // Obstacle Course',
    venueDetails: {
      building: 'Outdoor Sports Grounds',
      floor: 'Ground',
      room: 'Castle Course',
      directions: 'Behind engineering workshop block.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 100,
    registrationOpen: true,
    status: 'open',
    description: 'A Takeshi\'s Castle-inspired gauntlet of chaos, balance, and pure energy.',
    rules: [
      'Individual high-energy obstacle run featuring stepping stones, slippery surfaces, and maze doors.',
      'Contestants must complete stages without falling or stepping into penalty zones.',
      'Fastest contestants to storm the final castle gate win top prizes.'
    ],
    coordinators: [
      { name: 'Atharva Avhad', contact: '+91 83560 53525' },
      { name: 'Aryan Yadav', contact: '+91 93212 72969' }
    ]
  },
  {
    slug: 'escape-room',
    name: 'Escape Room',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: '₹120 / Team (120/2P)',
    firstPrize: '₹1,000',
    secondPrize: '₹500',
    prizePool: '1st: ₹1,000 | 2nd: ₹500',
    date: 'March 15, 2026',
    startTime: '12:00 IST',
    endTime: '17:00 IST',
    venue: 'Escape Chamber // Room 112',
    venueDetails: {
      building: 'Humanities Wing',
      floor: '1st Floor',
      room: 'Room 112',
      directions: 'Directly above student council boardroom.'
    },
    teamSize: 'Team (2 members)',
    minTeamSize: 2,
    maxTeamSize: 2,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    description: 'A problem-solving challenge where teams escape using logic and tech clues.',
    rules: [
      'Teams of 2 are locked inside a themed chamber with hidden lock codes and tactile clues.',
      'Solve progressive riddles to obtain keys and digital passcode combinations.',
      'Time limit: 15 minutes. Fastest escape time claims first place.'
    ],
    coordinators: [
      { name: 'Samruddhi Sagale', contact: '+91 80970 41838' },
      { name: 'Sanchi Jadhav', contact: '+91 93562 14246' }
    ]
  },
  {
    slug: 'squid-game',
    name: 'Squid Game',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: '₹50 / Person (50/1P)',
    firstPrize: '₹1,000',
    secondPrize: '₹800',
    prizePool: '1st: ₹1,000 | 2nd: ₹800',
    date: 'March 16, 2026',
    startTime: '14:00 IST',
    endTime: '17:00 IST',
    venue: 'Outdoor Amphitheatre Arena',
    venueDetails: {
      building: 'Campus Quadrangle',
      floor: 'Ground',
      room: 'Open Arena',
      directions: 'Center of festival activity square.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 100,
    registrationOpen: true,
    status: 'open',
    description: 'A set of competitive survival style tasks adapted with technical twists.',
    rules: [
      'Battle royale elimination rounds adapted from classic survival challenges.',
      'Strict referee enforcement on movement cues and boundary lines.',
      'Last remaining contestants in the final round contend for the championship prize.'
    ],
    coordinators: [
      { name: 'Ishwar Avsarkar', contact: '+91 70583 44126' },
      { name: 'Maithali Bhave', contact: '+91 99674 33890' }
    ]
  },
  {
    slug: 'neon-football',
    name: 'Neon Football',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: '₹100 / Person (100/1P)',
    firstPrize: '₹1,000',
    secondPrize: '₹800',
    prizePool: '1st: ₹1,000 | 2nd: ₹800',
    date: 'March 15, 2026',
    startTime: '18:30 IST',
    endTime: '21:30 IST',
    venue: 'Indoor Sports Complex // Neon Court 2',
    venueDetails: {
      building: 'Indoor Sports Complex',
      floor: 'Ground Floor',
      room: 'Court 2',
      directions: 'Directly adjacent to Neon Cricket arena.'
    },
    teamSize: 'Solo (1 person)',
    minTeamSize: 1,
    maxTeamSize: 1,
    capacity: 50,
    registrationOpen: true,
    status: 'open',
    description: 'Glow-in-the-dark sports event with neon lighting.',
    rules: [
      'Solo 1v1 fast-paced penalty shootout and target-striking in UV neon lighting.',
      'Glowing soccer balls and illuminated goal targets with varying multiplier scores.',
      'Knockout bracket format leading to the championship shootout.'
    ],
    coordinators: [
      { name: 'Dharamraj Pardeshi', contact: '+91 77387 51720' },
      { name: 'Harsh Sutar', contact: '+91 77188 43181' }
    ]
  },
  {
    slug: 'ipl-auction',
    name: 'IPL Auction',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: '₹120 / Team (120/2P)',
    firstPrize: '₹1,200',
    secondPrize: '₹800',
    prizePool: '1st: ₹1,200 | 2nd: ₹800',
    date: 'March 16, 2026',
    startTime: '12:30 IST',
    endTime: '16:30 IST',
    venue: 'Management Seminar Hall // Block C',
    venueDetails: {
      building: 'Management Block C',
      floor: '2nd Floor',
      room: 'Seminar Hall',
      directions: '2nd Floor above Dean\'s office.'
    },
    teamSize: 'Team (2 members)',
    minTeamSize: 2,
    maxTeamSize: 2,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    description: 'Strategic team-building simulations where participants bid for real-world IPL players using a virtual budget.',
    rules: [
      'Teams receive a standardized virtual purse of ₹100 Crores.',
      'Live bidding rounds covering batters, bowlers, all-rounders, and wicketkeepers with overseas quotas.',
      'Squads evaluated by analytical valuation algorithms considering player ratings and team synergy.'
    ],
    coordinators: [
      { name: 'Kshitij Deshmukh', contact: '+91 70398 86061' },
      { name: 'Prajwal Dhawale', contact: '+91 74995 51917' }
    ]
  },
  {
    slug: 'tech-hero',
    name: 'Tech Hero',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: '₹100 / Team (100/2P)',
    firstPrize: '₹1,200',
    secondPrize: '₹1,000',
    prizePool: '1st: ₹1,200 | 2nd: ₹1,000',
    date: 'March 16, 2026',
    startTime: '13:30 IST',
    endTime: '16:30 IST',
    venue: 'Activity Foyer // Central Complex',
    venueDetails: {
      building: 'Student Activity Hub',
      floor: 'Ground Floor',
      room: 'Central Foyer',
      directions: 'Main foyer outside auditorium entrance.'
    },
    teamSize: 'Team (2 members)',
    minTeamSize: 2,
    maxTeamSize: 2,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    description: 'A teamwork challenge of navigation, communication, and problem-solving.',
    rules: [
      'Teams of 2 tackle interactive coordination trials where one partner navigates blindfolded and the other guides via verbal tech protocols.',
      'Stations test verbal precision, memory sequencing, and collaborative problem-solving.',
      'Fastest combined time across all trial checkpoints claims the title.'
    ],
    coordinators: [
      { name: 'Tanvi Bhamare', contact: '+91 87797 73908' },
      { name: 'Arya Thakur', contact: '+91 95271 97560' }
    ]
  },
  {
    slug: 'combat-core',
    name: 'Combat Core',
    category: 'Non-Technical',
    branch: 'Open to All',
    isBranchExclusive: false,
    fee: '₹120 / Team (120/2P)',
    firstPrize: '₹1,200',
    secondPrize: '₹800',
    prizePool: '1st: ₹1,200 | 2nd: ₹800',
    date: 'March 16, 2026',
    startTime: '15:00 IST',
    endTime: '18:00 IST',
    venue: 'Tactical Combat Arena // Lower Ground',
    venueDetails: {
      building: 'Lower Ground Vault',
      floor: 'Basement / Lower Ground',
      room: 'Arena Sector 4',
      directions: 'Take Lower Ground ramp near cafeteria.'
    },
    teamSize: 'Team (2 members)',
    minTeamSize: 2,
    maxTeamSize: 2,
    capacity: 40,
    registrationOpen: true,
    status: 'open',
    description: 'A 2v2 gel-blaster elimination match with obstacles, targets, and tactical gameplay.',
    rules: [
      '2v2 tactical elimination matches played with certified gel-blasters and protective eyewear.',
      'Obstacle course layout with strategic cover, capture points, and timed objectives.',
      'Matches scored based on tag accuracy, objective holding, and tactical survival.'
    ],
    coordinators: [
      { name: 'Tanmay Pawar', contact: '+91 95293 50358' },
      { name: 'Parth Trimbake', contact: '+91 90045 01391' }
    ]
  }
]

module.exports = officialEvents
