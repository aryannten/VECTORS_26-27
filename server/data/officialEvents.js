/**
 * VECTORS 26–27 — Master Official Events
 * Extracted directly from official festival brochure (AC Patil College of Engineering)
 * Updated with official rulebooks, judging criteria, fees, and coordinators
 */

const officialEvents = [
  {
    "slug": "technical-debate",
    "name": "Technical Debate",
    "category": "Technical",
    "branch": "Open to All Branches",
    "isBranchExclusive": false,
    "fee": "₹50 / Participant (Teams of 2–3 participants)",
    "firstPrize": "₹500",
    "secondPrize": "₹300",
    "prizePool": "1st: ₹500 | 2nd: ₹300 (Prize money may vary depending on participant count)",
    "teamSize": "Team (2–3 members)",
    "minTeamSize": 2,
    "maxTeamSize": 3,
    "registrationOpen": true,
    "status": "open",
    "description": "Structured parliamentary technical debate. Teams defend or dispute cutting-edge engineering paradigms, AI ethics, and emerging technologies.",
    "rules": [
      "Debate topics provided by organizers; teams prepare arguments for both 'For' and 'Against' sides.",
      "Maintain discipline and sportsmanship; personal attacks and offensive language are prohibited.",
      "Mobile devices allowed only if explicitly permitted."
    ],
    "coordinators": [
      {
        "name": "Shravani Gosavi",
        "contact": "+91 86522 06648",
        "role": "Head"
      },
      {
        "name": "Soumya Pawar",
        "contact": "+91 96993 81920",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Technical Knowledge & Accuracy: 25",
      "Logical Reasoning & Arguments: 25",
      "Communication & Presentation: 20",
      "Rebuttal & Counterarguments: 15",
      "Team Coordination: 10",
      "Time Management: 5"
    ]
  },
  {
    "slug": "technical-quiz",
    "name": "Technical Quiz",
    "category": "Technical",
    "branch": "Open to All Branches",
    "isBranchExclusive": false,
    "fee": "₹50 / Participant (Individual participation)",
    "firstPrize": "₹500",
    "secondPrize": "₹300",
    "prizePool": "1st: ₹500 | 2nd: ₹300 (Prize money may vary depending on participation)",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "4-phase technical trivia battle: Tech Sprint, Engineer Kaun?, Guess The Tech, and Circuit Breaker buzzer round covering computing, hardware, and engineering.",
    "rules": [
      "Mobile phones, smartwatches, or searching gadgets are strictly prohibited.",
      "Answer independently without audience or peer assistance."
    ],
    "coordinators": [
      {
        "name": "Yukthi Devadiga",
        "contact": "+91 88287 18083",
        "role": "Head"
      },
      {
        "name": "Sara Mahadik",
        "contact": "+91 90829 04487",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Based on cumulative points across 4 phases (Tech Sprint, Engineer Kaun?, Guess The Tech, Circuit Breaker).",
      "Tie-breakers resolved via a dedicated technical question round."
    ]
  },
  {
    "slug": "prompt-mania",
    "name": "Prompt Mania – 2026",
    "category": "Technical",
    "branch": "Computer / IT / AI",
    "isBranchExclusive": false,
    "fee": "₹50 / Person (Solo participation)",
    "firstPrize": "₹1,500",
    "secondPrize": "₹1,000",
    "prizePool": "1st: ₹1,500 | 2nd: ₹1,000 (Prize money may vary depending on participation)",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "Harness AI generative engineering to solve dynamic programming challenges. Craft precise system prompts, generate working logic, and present production-ready apps.",
    "rules": [
      "Internet usage is permitted for AI tools and development.",
      "Pre-developed or copied projects are strictly prohibited.",
      "Core logic must be AI-generated (minor manual modifications permitted)."
    ],
    "coordinators": [
      {
        "name": "Akshata Mishra",
        "contact": "+91 89765 26414",
        "role": "Head"
      },
      {
        "name": "Mitansh Jadhav",
        "contact": "+91 85911 52587",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Functionality & Accuracy: 40%",
      "Practical Usefulness: 25%",
      "Innovation: 20%",
      "UI/UX: 10%",
      "Presentation: 5%"
    ]
  },
  {
    "slug": "tech-arena",
    "name": "Tech Arena 2.0",
    "category": "Technical",
    "branch": "Open to All Branches",
    "isBranchExclusive": false,
    "fee": "₹50 / Participant (Solo participation)",
    "firstPrize": "₹1,500",
    "secondPrize": "₹1,000",
    "prizePool": "1st: ₹1,500 | 2nd: ₹1,000 (Prize money may vary depending on total participation)",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "A multi-stage technical gauntlet testing logical reasoning, coding, and problem-solving across three intense elimination rounds.",
    "rules": [
      "Strict individual participation; communication or cheating leads to instant disqualification.",
      "Complete tasks within round time limits."
    ],
    "coordinators": [
      {
        "name": "Shridhar Kalasgonda",
        "contact": "+91 90047 89940",
        "role": "Head"
      },
      {
        "name": "Chaitanya Sawant",
        "contact": "+91 84519 64399",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Highest total score earned across all three rounds.",
      "Tie-breaker resolved by shortest completion time."
    ]
  },
  {
    "slug": "breaking-the-ai",
    "name": "Breaking the AI",
    "category": "Technical",
    "branch": "AI / Data Science / Computer",
    "isBranchExclusive": false,
    "fee": "₹50 / Person (Solo participation)",
    "firstPrize": "₹1,200",
    "secondPrize": "₹800",
    "prizePool": "1st: ₹1,200 | 2nd: ₹800",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "A 60-minute solo challenge to design, experiment, and break limits with AI tools. Participants must explain their solution and demonstrate how AI assisted them.",
    "rules": [
      "Use of AI tools is permitted.",
      "60 minutes allowed to design, experiment, and complete the challenge.",
      "Participants may bring their own PC/laptop.",
      "Pre-made complete solutions or templates are prohibited.",
      "Participants must explain their solution and demonstrate how AI assisted them.",
      "Follow instructions for each round. Unfair practice leads to disqualification."
    ],
    "coordinators": [
      {
        "name": "Taresh R. Ivalekar",
        "contact": "+91 99605 94908",
        "role": "Head"
      },
      {
        "name": "Tanishq Gore",
        "contact": "+91 99873 23799",
        "role": "Co-Head"
      },
      {
        "name": "Pranjal Dhanawade",
        "contact": "+91 98344 29122",
        "role": "Coordinator"
      },
      {
        "name": "Madhura Khade",
        "contact": "+91 87796 93988",
        "role": "Coordinator"
      }
    ],
    "judgingCriteria": [
      "Breaking AI (15 Marks): Creativity & originality, Quality of AI usage, Problem-solving, Overall execution.",
      "Pitching (5 Marks): Creativity explanation, Presentation, Effective use of prompts/tools, How convincingly the idea is justified."
    ]
  },
  {
    "slug": "ui-nightmare",
    "name": "UI Nightmare",
    "category": "Technical",
    "branch": "Design / Web / Computer",
    "isBranchExclusive": false,
    "fee": "₹50 / Person (Solo participation)",
    "firstPrize": "₹1,200",
    "secondPrize": "₹800",
    "prizePool": "1st: ₹1,200 | 2nd: ₹800",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "An inverted frontend design showdown. Create the most delightfully infuriating, counter-intuitive, and frustrating user interface imaginable, and pitch your sadistic UX choices.",
    "rules": [
      "AI tools allowed; 60 minutes duration.",
      "Participants may bring personal PCs.",
      "Pre-made UI designs or templates are strictly prohibited.",
      "Participants must explain their frustrating design choices."
    ],
    "coordinators": [
      {
        "name": "Taresh R. Ivalekar",
        "contact": "+91 99605 94908",
        "role": "Head"
      },
      {
        "name": "Tanishq Gore",
        "contact": "+91 99873 23799",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "UI Nightmare (15 Marks): Creativity, Confusing interaction, Overall execution.",
      "Pitching (5 Marks): Creativity Explanation, Presentation, How effectively participants justify their design."
    ]
  },
  {
    "slug": "code-musketeer",
    "name": "Code Musketeer",
    "category": "Technical",
    "branch": "Computer / IT",
    "isBranchExclusive": false,
    "fee": "₹50 / Team (Team size: 3 participants)",
    "firstPrize": "₹1,000",
    "secondPrize": "₹500",
    "prizePool": "1st: ₹1,000 | 2nd: ₹500 (Prize money may vary depending on participation)",
    "teamSize": "Team (3 members)",
    "minTeamSize": 3,
    "maxTeamSize": 3,
    "registrationOpen": true,
    "status": "open",
    "description": "A high-intensity collaborative coding and error-finding duel. Team members switch roles between Coding and Debugging, testing accuracy, syntax mastery, and speed.",
    "rules": [
      "Team size: strictly 3 participants per team.",
      "Internet usage is strictly prohibited.",
      "Adhere to coding and debugging time limits.",
      "AI decisions regarding reported errors are final and binding.",
      "Any malpractice or plagiarism results in immediate disqualification."
    ],
    "coordinators": [
      {
        "name": "Ali Lala",
        "contact": "+91 96534 94171",
        "role": "Head"
      },
      {
        "name": "Manasvi Khamkar",
        "contact": "+91 86690 27650",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "+1 point for each valid error identified by the Debug Team.",
      "+1 point to the Coding Team for each error missed by the Debug Team.",
      "Clean code correctly confirmed by Debug Team awards win to Debug Team.",
      "-1 point penalty for false error claims by the Debug Team."
    ]
  },
  {
    "slug": "project-competition",
    "name": "Technical Game Project Competition",
    "category": "Technical",
    "branch": "All Engineering Branches",
    "isBranchExclusive": false,
    "fee": "₹100 / Team",
    "firstPrize": "₹1,000",
    "secondPrize": "₹500",
    "prizePool": "1st: ₹1,000 | 2nd: ₹500 (Prize money may change depending on participation numbers)",
    "teamSize": "Team (1–4 members)",
    "minTeamSize": 1,
    "maxTeamSize": 4,
    "registrationOpen": true,
    "status": "open",
    "description": "Present your technical, hardware, or game project to a panel of expert judges. Demonstrate working functionality, real-world relevance, and innovative problem solving.",
    "rules": [
      "Complete registration before the announced deadline and report at the venue prior to the allotted time.",
      "Projects presented must be the team's own work or clearly identify external/open-source components.",
      "Teams must bring all hardware, software, adapters, cables, and demo materials.",
      "Follow presentation order and handle equipment responsibly.",
      "Any form of misbehavior, cheating, deliberate disruption, or vandalism may lead to disqualification."
    ],
    "coordinators": [
      {
        "name": "Aryan Patil",
        "contact": "+91 93216 38772",
        "role": "Head"
      },
      {
        "name": "Smita Nigade",
        "contact": "+91 93248 85232",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Technical Implementation: 20%",
      "Working Demonstration / Functionality: 20%",
      "Problem Relevance & Practical Impact: 20%",
      "Presentation & Explanation: 20%",
      "Team Response to Questions: 20%"
    ]
  },
  {
    "slug": "tech-traitors",
    "name": "Tech Traitors",
    "category": "Technical",
    "branch": "Open to All Branches",
    "isBranchExclusive": false,
    "fee": "₹80 / Participant (Individual participation)",
    "firstPrize": "₹1,500",
    "secondPrize": "₹1,200",
    "prizePool": "1st: ₹1,500 | 2nd: ₹1,200 (Prize money may vary depending on participating teams)",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "A psychological deception and tech puzzle tournament. Complete technical challenges while secretly detecting or playing the saboteur embedded among participants.",
    "rules": [
      "Mobile phones, internet, and outside assistance are prohibited unless specified.",
      "Challenges must be completed sequentially within fixed time limits.",
      "Traitor cannot damage, hide, or tamper with clues/equipment."
    ],
    "coordinators": [
      {
        "name": "Dhanshri Deshmukh",
        "contact": "+91 98217 79088",
        "role": "Head"
      },
      {
        "name": "Gargi Bhole",
        "contact": "+91 87887 70270",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Correct Answer, Speed, Traitor Identification, Accuracy, and Final Overall Score across all rounds."
    ]
  },
  {
    "slug": "cad-clash",
    "name": "CAD Clash",
    "category": "Technical",
    "branch": "Mechanical / Civil / Design",
    "isBranchExclusive": false,
    "fee": "₹80 / Participant (Solo participation only)",
    "firstPrize": "₹1,000",
    "secondPrize": "₹800",
    "prizePool": "1st: ₹1,000 | 2nd: ₹800 (Prize money may vary depending on total participation)",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "Solo computer-aided drafting speed and precision contest. Model complex engineering geometry with micron-level dimensioning accuracy under strict time limits.",
    "rules": [
      "Group or duo entries are strictly prohibited (Solo participation only).",
      "Must use official software provided (AutoCAD) or registered personal laptops.",
      "Pre-existing CAD blocks, templates, or external scripts are strictly prohibited.",
      "Hand over all storage devices (USBs/hard drives) and smartphones to volunteers prior to the event.",
      "Internet access during drafting phases is strictly forbidden."
    ],
    "coordinators": [
      {
        "name": "Deepak Choudhary",
        "contact": "+91 91529 01441",
        "role": "Head"
      },
      {
        "name": "Vaishnavi Bawaskar",
        "contact": "+91 83695 50995",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Manual evaluation of accuracy of drawing dimensions, alignment, and geometric correctness.",
      "Final Calculated Time = Actual Completion Time + Time Penalties.",
      "Lowest adjusted times or highest completion accuracy determines the winners."
    ]
  },
  {
    "slug": "code-fusion-ai",
    "name": "Code Fusion AI",
    "category": "Technical",
    "branch": "Computer / IT / AI",
    "isBranchExclusive": false,
    "fee": "₹50 / Participant (Solo Participation)",
    "firstPrize": "₹1,000",
    "secondPrize": "₹800",
    "prizePool": "1st: ₹1,000 | 2nd: ₹800 (Prize money may vary depending on total participation)",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "A multi-stage coding and AI debugging tournament. Solve rapid logic chits, fix complex bugs under time pressure, and craft prompts with ChatGPT to build live applications.",
    "rules": [
      "Strictly follow round deadlines and permitted tools (Solo Participation).",
      "ChatGPT is the only permitted AI tool (Round 3).",
      "Unauthorized AI tools or external assistance will lead to disqualification."
    ],
    "coordinators": [
      {
        "name": "Rudra Burbadkar",
        "contact": "+91 83695 66780",
        "role": "Head"
      },
      {
        "name": "Om Korade",
        "contact": "+91 95949 07384",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Round 1: Number of correctly solved chits within the allotted time.",
      "Round 2: Successfully completed debugging challenges within time/attempt limits.",
      "Round 3: Evaluated on Prompting Skills, AI Interaction, Requirement Completion, UI/UX & Creativity, Functionality, and Overall Execution."
    ]
  },
  {
    "slug": "technical-treasure-hunt",
    "name": "Technical Treasure Hunt",
    "category": "Technical",
    "branch": "Open to All Branches",
    "isBranchExclusive": false,
    "fee": "₹200 / Team (Max 4 members per team)",
    "firstPrize": "Winner Trophy & Cash Prize",
    "secondPrize": "Runner-up Trophy & Cash Prize",
    "prizePool": "1st Place: Winner | 2nd Place: Runner-up",
    "teamSize": "Team (2–4 members; max 4 members)",
    "minTeamSize": 2,
    "maxTeamSize": 4,
    "registrationOpen": true,
    "status": "open",
    "description": "A campus-wide tech puzzle and coding expedition. Decode algorithmic riddles, execute C/Java/Python programs, hunt physical QR coordinates, and locate the final chit.",
    "rules": [
      "Teams must remain together during rounds (Max 4 members per team; single participation not allowed).",
      "Do not damage, move, or tamper with setup, equipment, clues, QR codes, or computers.",
      "Do not reveal clues, answers, or codes to other teams or use unauthorized external assistance.",
      "Permitted programming languages: C, Java, Python."
    ],
    "coordinators": [
      {
        "name": "Atharv Kolhe",
        "contact": "+91 74004 84814",
        "role": "Head"
      },
      {
        "name": "Sahil Borse",
        "contact": "+91 90118 95074",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Evaluated on correctness of answers, coding accuracy, successful program execution, problem-solving ability, speed, clue identification, logical thinking, and teamwork.",
      "The first team to successfully complete the final Advanced Chit Finding challenge wins."
    ]
  },
  {
    "slug": "bolt-rush",
    "name": "Bolt Rush",
    "category": "Technical",
    "branch": "Electrical / Electronics",
    "isBranchExclusive": false,
    "fee": "Solo: ₹30 / player | Duo: ₹60 / team",
    "firstPrize": "₹600 (Duo Category Winner)",
    "secondPrize": "₹300 (Solo Category Winner)",
    "prizePool": "Duo Winner: ₹600 | Solo Winner: ₹300 (Prize money may vary depending on total participation)",
    "teamSize": "Solo / Duo (1–2 players)",
    "minTeamSize": 1,
    "maxTeamSize": 2,
    "registrationOpen": true,
    "status": "open",
    "description": "Tactile sensory-deprivation assembly sprint. Blindfolded engineers assemble components under verbal direction or solo tactile intuition against the clock.",
    "rules": [
      "Smartphones and light-emitting devices are forbidden inside the room; hand them over to volunteers.",
      "Duo Player 1 (Guide) must strictly avoid touching the hardware tray or Player 2's hands (violating this triggers a 'Reboot' physical walk penalty).",
      "Removing blindfolds early triggers a 10-second 'Freeze' penalty."
    ],
    "coordinators": [
      {
        "name": "Sarvesh Shinde",
        "contact": "+91 93215 46460",
        "role": "Head"
      },
      {
        "name": "Unnati Nankile",
        "contact": "+91 82088 27879",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Winner determined by fastest completion time in each category.",
      "Efficiency Bonus: Zero-penalty completion awards a 15-second time deduction from the final recorded time."
    ]
  },
  {
    "slug": "the-50",
    "name": "The 50",
    "category": "Technical",
    "branch": "Open to All Branches",
    "isBranchExclusive": false,
    "fee": "₹40 / Individual | ₹150 / Team (Team size: 2 or 4 members)",
    "firstPrize": "₹1,200",
    "secondPrize": "₹1,000",
    "prizePool": "1st: ₹1,200 | 2nd: ₹1,000",
    "teamSize": "Solo / Team (1, 2, or 4 members)",
    "minTeamSize": 1,
    "maxTeamSize": 4,
    "registrationOpen": true,
    "status": "open",
    "description": "5 dynamic puzzle and logic rounds pushing speed, problem-solving, and accuracy under pressure. Complete rounds in order and accumulate maximum points.",
    "rules": [
      "Mobile phones, internet, or outside assistance are forbidden.",
      "Must complete rounds in specified order and within given time limits."
    ],
    "coordinators": [
      {
        "name": "Mokshada Bhangale",
        "contact": "+91 88308 10614",
        "role": "Head"
      },
      {
        "name": "Samidha Bhamte",
        "contact": "+91 86050 94579",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Accuracy (correct answers)",
      "Speed (completion time)",
      "Problem-Solving (logical approach)",
      "Total overall score from all 5 rounds determines final ranking."
    ]
  },
  {
    "slug": "embedded-systems-showdown",
    "name": "Embedded Systems Showdown",
    "category": "Technical",
    "branch": "Electronics / IoT",
    "isBranchExclusive": false,
    "fee": "₹75 / Person (75/1P)",
    "firstPrize": "₹800",
    "secondPrize": "₹500",
    "prizePool": "1st: ₹800 | 2nd: ₹500",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "Crack the code: Solve clues and enter the code to unlock the box.",
    "rules": [
      "Individual embedded engineering challenge.",
      "Participants decipher hardware schematics, register values, and serial outputs.",
      "Program the designated microcontroller to trigger actuators and unlock the electronic vault.",
      "First participant to crack all stages and unlock the box claims victory."
    ],
    "coordinators": [
      {
        "name": "Manas Sanjay Bhise",
        "contact": "+91 91377 02048"
      },
      {
        "name": "Omkar Bali",
        "contact": "+91 87792 13361"
      }
    ]
  },
  {
    "slug": "rc-bomb-escape",
    "name": "RC Bomb Escape",
    "category": "Technical",
    "branch": "Robotics / Electronics",
    "isBranchExclusive": false,
    "fee": "₹70 / Person (70/1P)",
    "firstPrize": "₹800",
    "secondPrize": "₹500",
    "prizePool": "1st: ₹800 | 2nd: ₹500",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "RC driving challenge, navigate a narrow obstacle track with speed and precision while avoiding penalties.",
    "rules": [
      "Pilots steer remote-controlled vehicles across a hazardous obstacle course carrying a payload.",
      "Strict time penalties for touching boundary barriers, obstacles, or dropping the payload.",
      "Fastest pilot with zero or minimal penalty deductions takes top prize."
    ],
    "coordinators": [
      {
        "name": "Aryan Bhoir",
        "contact": "+91 70452 87346"
      },
      {
        "name": "Chinmay Gokhale",
        "contact": "+91 77771 04858"
      }
    ]
  },
  {
    "slug": "technical-maze",
    "name": "Technical Maze",
    "category": "Technical",
    "branch": "Open to All",
    "isBranchExclusive": false,
    "fee": "Free",
    "firstPrize": "",
    "secondPrize": "",
    "prizePool": "",
    "teamSize": "Solo / Duo (1–2 players)",
    "minTeamSize": 1,
    "maxTeamSize": 2,
    "registrationOpen": true,
    "status": "open",
    "description": "Hardware circuit and breadboard maze puzzle. Calculate equivalent resistor networks and navigate electronic logic paths with maximum component economy.",
    "rules": [
      "Calculators and physical scratchpads encouraged; smart devices/internet forbidden.",
      "Hand over smartphones to volunteers prior to the simulation."
    ],
    "coordinators": [
      {
        "name": "Prathamesh Arya",
        "contact": "+91 81043 75419",
        "role": "Head"
      },
      {
        "name": "Jayesh Sonawane",
        "contact": "+91 91520 71305",
        "role": "Co-Head"
      }
    ],
    "aliases": [
      "technical-paper-presentation"
    ],
    "judgingCriteria": [
      "1. Fewest Tries Used",
      "2. Minimum Resistors Used (Component Economy)",
      "3. Fastest Completion Time"
    ]
  },
  {
    "slug": "fpv-flight",
    "name": "FPV Flight",
    "category": "Technical",
    "branch": "Aero / Electronics / Drone",
    "isBranchExclusive": false,
    "fee": "₹50 / Person (50/1P)",
    "firstPrize": "₹600",
    "secondPrize": "₹400",
    "prizePool": "1st: ₹600 | 2nd: ₹400",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "Take flight, race the FPV drone, and conquer the challenge!",
    "rules": [
      "Pilots race first-person-view micro drones through lit hoops and obstacle gates.",
      "Time-trial format: 3 laps per heat; missed gates incur 5-second penalties.",
      "Safety goggles and emergency failsafe switches strictly required."
    ],
    "coordinators": [
      {
        "name": "Shriyash Choughule",
        "contact": "+91 99306 96186"
      },
      {
        "name": "Suresh Bhusnure",
        "contact": "+91 98925 05249"
      }
    ]
  },
  {
    "slug": "laser-room",
    "name": "Lazer Zone",
    "category": "Non-Technical",
    "branch": "Open to All",
    "isBranchExclusive": false,
    "fee": "₹50 / Person (Single participation)",
    "firstPrize": "₹1,000",
    "secondPrize": "₹800",
    "prizePool": "1st: ₹1,000 | 2nd: ₹800 (Prize money may vary depending on participation)",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "Darkened tactical laser grid security evasion. Navigate through calibrated tripwire laser beams to reach the terminal without triggering alarms.",
    "rules": [
      "Running or crawling inside the Lazer Zone is strictly prohibited.",
      "Do not use walls or structures for support."
    ],
    "coordinators": [
      {
        "name": "Kanishk Kadam",
        "contact": "+91 96536 17946",
        "role": "Head"
      },
      {
        "name": "Kartik Patil",
        "contact": "+91 81694 94827",
        "role": "Co-Head"
      }
    ],
    "aliases": [
      "lazer-zone"
    ],
    "judgingCriteria": [
      "Ranked by fastest total completion time.",
      "Penalty: Triggering a laser beam adds 5 seconds to the completion timer."
    ]
  },
  {
    "slug": "dooms-countdown",
    "name": "Dooms Countdown",
    "category": "Non-Technical",
    "branch": "Open to All",
    "isBranchExclusive": false,
    "fee": "₹90 / Team (90/3P)",
    "firstPrize": "₹600",
    "secondPrize": "₹450",
    "prizePool": "1st: ₹600 | 2nd: ₹450",
    "teamSize": "Team (3 members)",
    "minTeamSize": 3,
    "maxTeamSize": 3,
    "registrationOpen": true,
    "status": "open",
    "description": "A 5-minute team puzzle mission testing coordination and problem-solving.",
    "rules": [
      "Teams of 3 are locked in with a 5-minute countdown ticking on the main screen.",
      "Solve synchronized cryptographic, mechanical, and visual puzzles simultaneously.",
      "All 3 stations must be solved before the detonation timer reaches zero."
    ],
    "coordinators": [
      {
        "name": "Darshan Kandalgaokar",
        "contact": "+91 84589 36724"
      },
      {
        "name": "Sujal Rautela",
        "contact": "+91 99878 78949"
      }
    ]
  },
  {
    "slug": "flight-frenzy",
    "name": "Flight Frenzy",
    "category": "Non-Technical",
    "branch": "Open to All",
    "isBranchExclusive": false,
    "fee": "₹75 / Participant (Solo entry)",
    "firstPrize": "₹700",
    "secondPrize": "₹500",
    "prizePool": "1st: ₹700 | 2nd: ₹500 (Prize money may vary depending on participant count)",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "Paper airplane precision throwing tournament. Fold your aerodynamic gliders on the spot and navigate through multi-tiered obstacle rings for maximum points.",
    "rules": [
      "Participants fold their own planes on the spot using provided paper only (max 3 sheets per participant; no added weight/tape/outside materials).",
      "Every throw must be released behind the marked throw line within a 4-minute time limit (5 tries total).",
      "Re-registering for extra attempts or resetting scores is not allowed."
    ],
    "coordinators": [
      {
        "name": "Balraj Pattanayak",
        "contact": "+91 87798 41383",
        "role": "Head"
      },
      {
        "name": "Prajyot Mhatre",
        "contact": "+91 99302 40617",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Obstacles cleared in order (Near, Mid, Swinging, Far) award 1, 2, 3, and 4 points respectively.",
      "Perfect Flight (clearing all 4 in one throw) awards a +2 flat bonus.",
      "Standing is decided by highest cumulative score across both days."
    ]
  },
  {
    "slug": "neon-cricket",
    "name": "Neon Cricket",
    "category": "Non-Technical",
    "branch": "Open to All",
    "isBranchExclusive": false,
    "fee": "₹200 / Team (Squad of 4 players)",
    "firstPrize": "₹1,500",
    "secondPrize": "₹1,000",
    "prizePool": "1st: ₹1,500 | 2nd: ₹1,000 (Prize money may vary depending on participation)",
    "teamSize": "Team (4 members)",
    "minTeamSize": 4,
    "maxTeamSize": 4,
    "registrationOpen": true,
    "status": "open",
    "description": "High-octane indoor cricket under pure ultraviolet UV glow lights. Fluorescent wickets, neon cricket balls, glowing bats, and rapid 2-over matches.",
    "rules": [
      "Played in a blacked-out room under UV light using provided glow equipment only.",
      "Personal flashlights or light sources are strictly banned during play.",
      "Each team gets a maximum of 2 overs to bat."
    ],
    "coordinators": [
      {
        "name": "Parth Unde",
        "contact": "+91 70395 20331",
        "role": "Head"
      },
      {
        "name": "Siddhesh Dubal",
        "contact": "+91 81048 80788",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Team with the higher total run score wins."
    ]
  },
  {
    "slug": "takeshis-castle",
    "name": "Takeshi's Castle",
    "category": "Non-Technical",
    "branch": "Open to All",
    "isBranchExclusive": false,
    "fee": "₹50 / Participant (Solo participation)",
    "firstPrize": "₹2,000",
    "secondPrize": "₹1,000",
    "prizePool": "1st: ₹2,000 | 2nd: ₹1,000",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "Whimsical physical obstacle gauntlet inspired by the classic game show. Survive the Tissue Float, the Ping-Pong Shake, and the final Balloon Stomp ring.",
    "rules": [
      "Round 1: Hands behind back; keep tissue afloat purely by blowing (45–60s).",
      "Round 2: Shake ping-pong balls out of waist box without touching box or floor.",
      "Round 3: Balloon stomp knockout in battle ring; no physical pushing/shoving."
    ],
    "coordinators": [
      {
        "name": "Atharva Avhad",
        "contact": "+91 83560 53525",
        "role": "Head"
      },
      {
        "name": "Aryan Yadav",
        "contact": "+91 93212 72969",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Decided strictly by survival and elimination across rounds. The last survivor in Round 3 wins."
    ]
  },
  {
    "slug": "escape-room",
    "name": "Escape Room: TVA Sacred Timeline Protocol",
    "category": "Non-Technical",
    "branch": "Open to All",
    "isBranchExclusive": false,
    "fee": "₹120 / Team (Max 2 members)",
    "firstPrize": "₹1,000",
    "secondPrize": "₹500",
    "prizePool": "1st: ₹1,000 | 2nd: ₹500 (Prize money may vary depending on participation)",
    "teamSize": "Team (1–2 members)",
    "minTeamSize": 1,
    "maxTeamSize": 2,
    "registrationOpen": true,
    "status": "open",
    "description": "Immersive Marvel/TVA themed escape room. Decode branching timeline anomalies, unlock cryptex containers, and restore the Sacred Timeline before temporal collapse.",
    "rules": [
      "Mobile phones and external aids are strictly prohibited.",
      "Solve puzzles sequentially without skipping.",
      "Tampering with props results in immediate disqualification."
    ],
    "coordinators": [
      {
        "name": "Samruddhi Sagale",
        "contact": "+91 80970 41838",
        "role": "Head"
      },
      {
        "name": "Sanchi Jadhav",
        "contact": "+91 93562 14246",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Evaluated on fastest restoration time, total puzzles solved, and minimum hints used.",
      "Penalty: +5 minutes added for each hint taken."
    ]
  },
  {
    "slug": "squid-game",
    "name": "Squid Game 3.0",
    "category": "Non-Technical",
    "branch": "Open to All",
    "isBranchExclusive": false,
    "fee": "₹50 / Person (Solo participation; free entry for Ddackji gate winners)",
    "firstPrize": "₹2,500",
    "secondPrize": "₹1,500",
    "prizePool": "1st: ₹2,500 | 2nd: ₹1,500 (Prize money may vary depending on participation)",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "High-stakes survival tournament featuring Red Light Green Light, Mingle grouping, and the final Briefcase showdown. Outlast the opposition to claim the prize.",
    "rules": [
      "Physical aggression results in immediate disqualification.",
      "Leaving game boundary results in elimination.",
      "Damage to college property will be penalized."
    ],
    "coordinators": [
      {
        "name": "Ishwar Avsarkar",
        "contact": "+91 70583 44126",
        "role": "Head"
      },
      {
        "name": "Maithali Bhave",
        "contact": "+91 99674 33890",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Survival: Remaining in the game until the end.",
      "Coordination: Forming correct group numbers during Mingle round.",
      "Luck: Outcome of the Briefcase round."
    ]
  },
  {
    "slug": "neon-football",
    "name": "Neon Football",
    "category": "Non-Technical",
    "branch": "Open to All",
    "isBranchExclusive": false,
    "fee": "₹100 / Participant (1v1 Solo Knockout Duel)",
    "firstPrize": "₹1,000",
    "secondPrize": "₹800",
    "prizePool": "1st: ₹1,000 | 2nd: ₹800 (Prize money may vary depending on total participation)",
    "teamSize": "Solo (1 person)",
    "minTeamSize": 1,
    "maxTeamSize": 1,
    "registrationOpen": true,
    "status": "open",
    "description": "Intense 1v1 blacklight glow football played under UV illumination with fluorescent turf markings and high-visibility neon soccer balls.",
    "rules": [
      "Must wear dark or UV-reactive fluorescent gear; flat turf/rubber-soled shoes required (no studs).",
      "Electronics forbidden inside arena.",
      "Defense inside restricted crease/penalty box is prohibited.",
      "Conceding 3 corners awards a penalty kick to the opponent."
    ],
    "coordinators": [
      {
        "name": "Dharamraj Pardeshi",
        "contact": "+91 77387 51720",
        "role": "Head"
      },
      {
        "name": "Harsh Sutar",
        "contact": "+91 77188 43181",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Highest goals scored at full-time. Tie-breakers resolved via penalty shootout (3 spot-kicks then sudden death)."
    ]
  },
  {
    "slug": "ipl-auction",
    "name": "IPL Auction",
    "category": "Non-Technical",
    "branch": "Open to All",
    "isBranchExclusive": false,
    "fee": "₹120 / Team (120/2P)",
    "firstPrize": "₹1,200",
    "secondPrize": "₹800",
    "prizePool": "1st: ₹1,200 | 2nd: ₹800",
    "teamSize": "Team (2 members)",
    "minTeamSize": 2,
    "maxTeamSize": 2,
    "registrationOpen": true,
    "status": "open",
    "description": "Strategic team-building simulations where participants bid for real-world IPL players using a virtual budget.",
    "rules": [
      "Teams receive a standardized virtual purse of ₹100 Crores.",
      "Live bidding rounds covering batters, bowlers, all-rounders, and wicketkeepers with overseas quotas.",
      "Squads evaluated by analytical valuation algorithms considering player ratings and team synergy."
    ],
    "coordinators": [
      {
        "name": "Kshitij Deshmukh",
        "contact": "+91 70398 86061"
      },
      {
        "name": "Prajwal Dhawale",
        "contact": "+91 74995 51917"
      }
    ]
  },
  {
    "slug": "tech-hero",
    "name": "Tech Hero",
    "category": "Non-Technical",
    "branch": "Open to All",
    "isBranchExclusive": false,
    "fee": "₹100 / Duo team (Controller + Human Robot)",
    "firstPrize": "₹1,200",
    "secondPrize": "₹1,000",
    "prizePool": "1st: ₹1,200 | 2nd: ₹1,000 (Prize money may vary depending on team participation)",
    "teamSize": "Duo (2 members)",
    "minTeamSize": 2,
    "maxTeamSize": 2,
    "registrationOpen": true,
    "status": "open",
    "description": "One teammate serves as the blindfolded 'Human Robot' traversing an obstacle area, while the other serves as the 'Controller' transmitting precise verbal navigation codes.",
    "rules": [
      "Controller cannot enter obstacle area or physically touch/guide the Robot.",
      "Human Robot cannot see Controller's map.",
      "Strictly use predefined commands; mobile devices are forbidden."
    ],
    "coordinators": [
      {
        "name": "Tanvi Bhamre",
        "contact": "+91 87797 73908",
        "role": "Head"
      },
      {
        "name": "Arya Thakur",
        "contact": "+91 95271 97560",
        "role": "Co-Head"
      }
    ],
    "judgingCriteria": [
      "Final Score = Actual Completion Time + Penalty Time.",
      "Lowest final time wins; ties broken by fewest total penalties."
    ]
  },
  {
    "slug": "combat-core",
    "name": "Combat Core",
    "category": "Non-Technical",
    "branch": "Open to All",
    "isBranchExclusive": false,
    "fee": "₹120 / Team (120/2P)",
    "firstPrize": "₹1,200",
    "secondPrize": "₹800",
    "prizePool": "1st: ₹1,200 | 2nd: ₹800",
    "teamSize": "Team (2 members)",
    "minTeamSize": 2,
    "maxTeamSize": 2,
    "registrationOpen": true,
    "status": "open",
    "description": "A 2v2 gel-blaster elimination match with obstacles, targets, and tactical gameplay.",
    "rules": [
      "2v2 tactical elimination matches played with certified gel-blasters and protective eyewear.",
      "Obstacle course layout with strategic cover, capture points, and timed objectives.",
      "Matches scored based on tag accuracy, objective holding, and tactical survival."
    ],
    "coordinators": [
      {
        "name": "Tanmay Pawar",
        "contact": "+91 95293 50358"
      },
      {
        "name": "Parth Trimbake",
        "contact": "+91 90045 01391"
      }
    ]
  }
]

module.exports = officialEvents
