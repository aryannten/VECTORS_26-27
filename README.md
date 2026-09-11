# VECTORS 26-27

The official web platform and digital entry system for **VECTORS 26-27**, the annual college technical festival. Features an immersive brutalist/cyberpunk visual identity, interactive WebGL shaders, role-based access control, digital college entry passes with QR gate check-in, brochure-synchronized event vaults, and an admin command center.

---

## Architecture Overview

VECTORS 26-27 is a full-stack platform built to handle both the participant experience and gate logistics:

1. **Cinematic Fest Experience**: Immersive dark-mode visual interface with brutalist architectural geometry, custom SVG brand wordmarks, interactive liquid metal (OGL ferrofluid simulation), and Framer Motion micro-interactions.
2. **Mandatory College Entry Pass System**:
   - Visitors register their identity, contact, and college affiliation through a 4-step intake flow (`/entry-registration`).
   - Generates a verified digital Entry Pass (`VEC-XXXXXXXX`) with an on-screen QR code viewable anytime at `/my-pass` and accessible from `/dashboard`.
3. **QR Gate Scanner System**: Security personnel at the college gate log in at `/security/login` and use a camera scanner (`/security`) powered by `@yudiel/react-qr-scanner` to verify pass validity in real-time and prevent duplicate campus check-ins.
4. **Official Event Vaults (29 Events)**:
   - **Gated Discovery**: Browsing events (`/events`) and viewing protocol specifications (`/events/:eventId`) is protected by `EntryPassGate`, ensuring only users with an active college entry pass can view festival protocols.
   - **Brochure-Synchronized Data**: Features all 29 official events (18 Technical, 11 Non-Technical) with exact fees, prize pools (1st/2nd prize), team sizes, rules of engagement, and sector coordinator phone contacts.
   - **Unified Event Registration**: Per-event registration redirects directly to the official Google Form portal (`https://docs.google.com/forms/d/1TMafhheUgchGQZHPmEdVHght-KB_Nn_SN1pKOSkLXXI/viewform`).
5. **Admin Command Center**: Real-time metrics on total entry registrations, live gate check-in counts, user account directory (role elevation, password resets), event management, and system announcements.

---

## Tech Stack

### Frontend (`/client`)
- **Core**: React 19, Vite 8, React Router v7
- **Styling**: Tailwind CSS v4 (using the `@theme` engine in `index.css` with custom tokens)
- **Visuals & 3D**:
  - `OGL`: WebGL shader engine powering the interactive `<Ferrofluid />` liquid metal hero background
  - `Three.js` / `@react-three/fiber` / `@react-three/drei`: 3D rendering pipeline for mechanical astrolabe accents
  - `Framer Motion`: Page transitions, orchestrated reveals, and UI physics
  - `Lucide React`: UI iconography
- **Auth & Scanning**:
  - `firebase`: Client SDK for email/password and Google Popup authentication
  - `qrcode.react`: SVG QR code generator for student entry passes
  - `@yudiel/react-qr-scanner`: High-speed camera scanner with multi-device switching and torch support
- **Tooling**: Oxlint (`oxlint`), Vite dev proxy (`/api -> http://localhost:5000`)

### Backend (`/server`)
- **Runtime & Framework**: Node.js, Express 5
- **Database**: MongoDB Atlas with Mongoose 9
- **Auth & Validation**:
  - `firebase-admin`: Token verification and server-side user management
  - Role-based authorization middleware (`user`, `security`, `admin`)
- **Security & Hygiene**:
  - `helmet`: HTTP header security
  - `cors`: Explicit origin whitelist (`ALLOWED_ORIGINS`)
  - `express-rate-limit`: Tiered IP throttling (global API limiter + strict auth/registration limiter)
  - `express-mongo-sanitize`: NoSQL injection sanitization

---

## Folder Structure

```
.
├── README.md
├── package.json
├── package-lock.json
├── Vectors-Brochure-OCR.pdf          # Official brochure reference document
├── client
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src
│       ├── App.jsx                   # Central routing & lazy-loaded view definitions
│       ├── components
│       │   ├── AdminLayout.jsx       # Admin portal frame & sidebar navigation
│       │   ├── Astrolabe3D.jsx       # 3D mechanical astrolabe element
│       │   ├── DoomsdayWordmark.jsx  # Brushed chrome & emerald SVG fest wordmark
│       │   ├── EntryPassGate.jsx     # Route gate requiring active college Entry Pass
│       │   ├── ErrorBoundary.jsx     # React error boundary fallback
│       │   ├── Layout.jsx            # Main user layout (Navbar + Footer)
│       │   ├── Navbar.jsx            # Sticky blurred navigation header
│       │   ├── ProtectedRoute.jsx    # Role-based route guard
│       │   ├── ScrollToTop.jsx       # Route transition scroll reset
│       │   └── ui
│       │       ├── Ferrofluid.jsx    # Interactive WebGL liquid metal hero canvas
│       │       ├── PageLoading.jsx   # Cyberpunk route loader
│       │       └── Particles.jsx     # Ambient canvas particle background
│       ├── contexts
│       │   └── AuthContext.jsx       # Firebase auth, pass status, and token provider
│       ├── data
│       │   └── events.js             # Master client dataset for 29 official events
│       ├── lib
│       │   ├── firebase.js           # Firebase client initialization
│       │   └── utils.js              # Class merger utility (clsx + tailwind-merge)
│       ├── pages
│       │   ├── Dashboard.jsx         # User hub with entry pass status & quick links
│       │   ├── EntryRegistration.jsx # 4-step college entry pass intake form
│       │   ├── EventDetail.jsx       # Event rules, prizes, coordinators & registration gate
│       │   ├── Events.jsx            # Master event vaults with search & branch filters
│       │   ├── FAQ.jsx               # Interactive accordion FAQ
│       │   ├── Home.jsx              # Fest portal with Ferrofluid hero & story
│       │   ├── Login.jsx             # User authentication (Email/Password + Google)
│       │   ├── MyPass.jsx            # Digital QR Entry Pass viewer
│       │   ├── NotFound.jsx          # Styled 404 screen
│       │   ├── Security.jsx          # Gate camera QR scanner interface
│       │   ├── SecurityLogin.jsx     # Dedicated security personnel login
│       │   ├── Signup.jsx            # User account registration
│       │   └── admin
│       │       ├── Admin.jsx                  # Analytics & live check-in counters
│       │       ├── AdminAnnouncements.jsx     # System announcement dispatcher
│       │       ├── AdminEventRegistrations.jsx# Event attendance monitoring
│       │       ├── AdminEvents.jsx            # Event catalog manager
│       │       ├── AdminRegistrations.jsx     # Searchable entry pass registry
│       │       └── AdminUsers.jsx             # User directory & role editor
│       └── index.css                 # Tailwind v4 theme variables & custom utilities
└── server
    ├── index.js                      # Express application entry & auto-seeding
    ├── config
    │   └── db.js                     # MongoDB connection
    ├── data
    │   └── officialEvents.js         # Master server dataset of 29 brochure events
    ├── middleware
    │   └── auth.js                   # Firebase Admin token & role verification
    ├── models
    │   ├── EntryRegistration.js      # College entry pass schema
    │   ├── Event.js                  # Event catalog schema (with 1st/2nd prize fields)
    │   ├── SiteConfig.js             # Global feature flags & system config
    │   └── User.js                   # Synced user profile schema
    ├── routes
    │   ├── admin.js                  # Admin API endpoints
    │   ├── auth.js                   # Auth profile & role sync
    │   ├── events.js                 # Event listings & detail queries
    │   └── registration.js           # Entry pass creation & QR verification
    ├── scripts
    │   └── sync_events.js            # MongoDB Atlas brochure events upsert utility
    └── test
        ├── api_endpoints.test.js     # Backend integration test suite
        └── audit_verification.js     # System integrity & pass verification audit
```

---

## Pages & Routing Architecture

All application routes are defined in `client/src/App.jsx`.

### 1. Public Routes
- `/` (`Home.jsx`): Hero portal featuring interactive `<Ferrofluid />` WebGL canvas, custom SVG brand wordmark, fest storyline, and entry CTAs.
- `/login` (`Login.jsx`): User sign-in supporting email/password and Google authentication. Redirects back to intended destination after authentication.
- `/signup` (`Signup.jsx`): New account creation with display name, email, and password.
- `/faq` (`FAQ.jsx`): Accordion-style help center addressing pass registration, campus entry, event policies, and security procedures.

### 2. User Protected Routes (Requires Firebase Authentication)
- `/dashboard` (`Dashboard.jsx`): Personal portal displaying Entry Pass status, quick actions, event categories, and quick links.
- `/entry-registration` (`EntryRegistration.jsx`): 4-step multi-stage intake form (Identity &rarr; Contact &rarr; College Affiliation &rarr; Pass Confirmation) generating a permanent `VEC-XXXXXXXX` entry pass.
- `/my-pass` (`MyPass.jsx`): Displays the verified digital entry pass with a dynamic QR code (`qrcode.react`), unique pass code, attendee metadata, and real-time gate check-in status.
- `/events` (`Events.jsx`): Master Event Discovery. **Gated by EntryPassGate** — users without an active college entry pass cannot view event specifications until their pass is secured. Features:
  - Technical vs. Non-Technical category vaults
  - Real-time search query (event name, rules, description)
  - Departmental branch filter buttons (`CSE`, `ECE`, `MECH`, `CIVIL`, etc.)
  - Participation mode filter (`Solo` vs `Team`)
- `/events/:eventId` (`EventDetail.jsx`): Detailed protocol specifications:
  - Registration fee & team size matrix
  - Prize pool highlights (1st Prize & 2nd Prize breakdown)
  - Numbered Rules of Engagement
  - Sector coordinator cards with direct `tel:` call actions
  - Event FAQ accordion
  - **In-Flow Registration Gates**: Immediate registration button in the hero and a full-width Official Registration Gate section at the bottom directing participants to the official Google Form.

### 3. Security Check-in Routes
- `/security/login` (`SecurityLogin.jsx`): Dedicated portal for security volunteers.
- `/security` (`Security.jsx`): Camera-driven QR scanner interface (accessible only to `security` and `admin` roles) to verify attendee passes at the college entrance, prevent duplicate admissions, and record check-in timestamps.

### 4. Admin Command Center (Requires `admin` role)
Wrapped in `AdminLayout.jsx` with persistent sidebar navigation:
- `/admin` (`Admin.jsx`): Command overview showing total passes registered, gate check-in rates, active event counts, and staff metrics.
- `/admin/registrations` (`AdminRegistrations.jsx`): Searchable, paginated registry of all student entry passes with check-in timestamps.
- `/admin/events` (`AdminEvents.jsx`): Management view of all 29 official events.
- `/admin/announcements` (`AdminAnnouncements.jsx`): System-wide broadcast dispatcher.
- `/admin/users` (`AdminUsers.jsx`): User directory. Allows creating accounts, elevating roles (`user`, `security`, `admin`), issuing password resets, and account deletion.

---

## Official Events Roster (Brochure Synchronized)

The platform includes **29 official events** categorized under Technical and Non-Technical sectors, mapped from `Vectors-Brochure-OCR.pdf`:

### Technical Events (18 Events)
1. **Prompt Mania** (AI/ML)
2. **CAD Crush** (Civil / Mech)
3. **Web Weave** (CSE / IT)
4. **Model Craft** (Civil)
5. **Chem-O-Car** (Chemical)
6. **PCB Design** (ECE / EEE)
7. **Line Follower** (Robotics)
8. **Blind Coding** (CSE / IT)
9. **Bridge Craft** (Civil)
10. **Code Storm** (CSE / IT)
11. **Paper Presentation** (All Technical Branches)
12. **Robo Soccer** (Robotics)
13. **Drone Challenge** (Aerospace / Robotics)
14. **LAN Gaming - Valorant** (Gaming)
15. **LAN Gaming - BGMI** (Gaming)
16. **Circuit Debugging** (ECE / EEE)
17. **Technical Quiz** (General Engineering)
18. **Poster Presentation** (All Technical Branches)

### Non-Technical Events (11 Events)
1. **Takeshi's Castle**
2. **Treasure Hunt**
3. **Photography / Reel Making**
4. **Face Painting**
5. **Tug of War**
6. **Open Mic (Standup & Poetry)**
7. **Talent Hunt**
8. **Chess Championship**
9. **Arm Wrestling**
10. **Escape Room**
11. **Street Play (Nukkad Natak)**

> **Per-Event Registration**: Every event detail page points to the centralized Google Form portal:
> `https://docs.google.com/forms/d/1TMafhheUgchGQZHPmEdVHght-KB_Nn_SN1pKOSkLXXI/viewform`

---

## Getting Started

### Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **MongoDB Atlas** or a local MongoDB instance
- **Firebase Project**: Authentication enabled (Email/Password & Google)

### 1. Environment Setup

#### Client (`client/.env`)
```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

#### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/vectors_db"
ALLOWED_ORIGINS="http://localhost:5173"
FIREBASE_SERVICE_ACCOUNT_PATH="./serviceAccountKey.json"
```

### 2. Installation & Running

From the root directory:

```bash
# Install root dependencies
npm install

# Install client and server dependencies
cd client && npm install && cd ..
cd server && npm install && cd ..

# Run both frontend and backend concurrently
npm run dev
```

The frontend will start on `http://localhost:5173` and the backend on `http://localhost:5000`.

### 3. Synchronizing Events with MongoDB

To manually sync or update all 29 official events in MongoDB Atlas:

```bash
node server/scripts/sync_events.js
```

*(The backend also automatically verifies and seeds any missing events upon startup in `server/index.js`).*

### 4. Running Verification Tests

```bash
npm test
```
Executes backend API endpoint validation and pass verification integrity audits.

### 5. Production Build

```bash
npm run build
```
Creates an optimized production bundle inside `client/dist`.

---

## Design System & Styling

Design tokens are configured in `client/src/index.css` under the Tailwind CSS v4 `@theme` engine:

```css
@theme {
  --color-doom-bg: #0A0C0E;             /* Deep void background */
  --color-doom-bg2: #171A1E;            /* Card & section background */
  --color-doom-glow: #1EFFA0;           /* Primary radioactive emerald glow */
  --color-doom-glow-muted: #0B7A4E;
  --color-doom-crimson: #8B0000;         /* Warning & error accent */
  --color-chrome-light: #C7CCD1;        /* Brushed metallic headers */
  --color-text-primary: #EDEFF1;
  --color-text-muted: #8A909B;

  --font-display: 'Rajdhani', sans-serif;
  --font-accent: 'Cinzel', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'Space Mono', monospace;
}
```

---

## Credits & License

- **Event**: VECTORS 26-27 Annual Technical Festival
- **Engineering**: VECTORS Technical Team
- **License**: Private & Proprietary (All rights reserved)
