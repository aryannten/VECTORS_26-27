# VECTORS 26-27

The official web platform and digital entry system for **VECTORS 26-27**, the annual technical festival of **A. C. Patil College of Engineering (ACPCE)**. Features an immersive brutalist/cyberpunk command center visual identity, role-based access control, digital college entry passes with QR gate check-in, brochure-synchronized event vaults, and an administrative control suite.

---

## Architecture Overview

VECTORS 26-27 is a full-stack platform built to handle both the attendee experience and gate logistics:

1. **Cyberpunk Command Experience**: Tactical dark-mode interface with brutalist typography, responsive HUD navigation, custom audio synthesizer telemetry, and refined micro-interactions.
2. **Mandatory College Entry Pass System**:
   - Visitors register their identity, contact, and college affiliation through a multi-stage intake flow (`/entry-registration`).
   - Generates a verified digital Entry Pass (`VEC-XXXXXXXX`) with an on-screen dynamic QR code viewable anytime at `/my-pass` and accessible from `/dashboard`.
3. **QR Gate Scanner System**: Security personnel at the college entrance use a camera-based QR scanner (`/security`) to verify pass validity in real-time, log admissions, and prevent duplicate campus check-ins.
4. **Official Event Vaults (29 Events)**:
   - **Gated Discovery**: Exploring festival events (`/events`) and viewing protocol specifications (`/events/:eventId`) is protected by `EntryPassGate`, ensuring only users with an active college entry pass can view event details.
   - **Brochure-Synchronized Data**: Features all 29 official events (18 Technical, 11 Non-Technical) with exact entry fees, prize pools (1st & 2nd prizes), team sizes, rules of engagement, and coordinator phone contacts.
   - **Centralized Event Registration**: Direct links to the official registration portals for each protocol.
5. **Admin Command Center**: Real-time analytics, attendee entry pass editing & status management, events configuration & live search, attendee lists with CSV export, role elevation, and forensic audit logging.

---

## Tech Stack

### Frontend (`/client`)
- **Core**: React 19, Vite 8, React Router v7
- **Styling**: Tailwind CSS v4 (using the `@theme` engine in `index.css` with tactical dark tokens)
- **Visuals & UI**:
  - `Lucide React`: UI iconography
  - Custom Canvas & HUD Telemetry Grid components
- **Auth & Scanning**:
  - `firebase`: Client SDK for email/password and Google Popup authentication
  - `qrcode.react`: Dynamic SVG QR code generator for student entry passes
  - `@yudiel/react-qr-scanner`: High-speed camera scanner with multi-device camera switching
- **Tooling**: Vite dev proxy (`/api -> http://localhost:5000`)

### Backend (`/server`)
- **Runtime & Framework**: Node.js, Express 5
- **Database**: MongoDB Atlas with Mongoose 9
- **Auth & Validation**:
  - `firebase-admin`: Token verification and server-side user management
  - Role-based authorization middleware (`user`, `security`, `admin`)
- **Security & Hygiene**:
  - `helmet`: HTTP security headers
  - `cors`: Explicit origin whitelist (`ALLOWED_ORIGINS`)
  - `express-rate-limit`: Tiered IP throttling (global API limiter + strict auth rate limiter)
  - `express-mongo-sanitize`: NoSQL injection sanitization
  - **Zero Plaintext Passwords**: Passwords are never stored in MongoDB. All authentication is delegated to Firebase Authentication, which secures credentials using salted **scrypt** cryptographic hashing.

---

## Folder Structure

```
.
├── README.md
├── package.json
├── package-lock.json
├── Vectors-Brochure-OCR.pdf          # Official festival brochure reference
├── client
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src
│       ├── App.jsx                   # Central routing & lazy-loaded view definitions
│       ├── components
│       │   ├── AdminLayout.jsx       # Admin portal frame & sidebar navigation
│       │   ├── EntryPassGate.jsx     # Route gate requiring active college Entry Pass
│       │   ├── ErrorBoundary.jsx     # React error boundary fallback
│       │   ├── Layout.jsx            # Main user layout (Navbar + Footer)
│       │   ├── Navbar.jsx            # Sticky blurred navigation header
│       │   ├── ProtectedRoute.jsx    # Role-based route guard
│       │   ├── ScrollToTop.jsx       # Route transition scroll reset
│       │   ├── command/              # Doomsday Command Center UI components
│       │   └── landing/              # Landing page visual canvas components
│       ├── contexts
│       │   └── AuthContext.jsx       # Firebase auth, pass status, and token provider
│       ├── data
│       │   └── events.js             # Master client dataset for 29 official events
│       ├── lib
│       │   ├── firebase.js           # Firebase client initialization
│       │   └── utils.js              # Class merger utility (clsx + tailwind-merge)
│       ├── pages
│       │   ├── Dashboard.jsx         # User hub with entry pass status & quick links
│       │   ├── EntryRegistration.jsx # College entry pass intake form
│       │   ├── EventDetail.jsx       # Event rules, prizes, coordinators & registration gate
│       │   ├── Events.jsx            # Master event vaults with search & category filters
│       │   ├── FAQ.jsx               # Interactive accordion FAQ
│       │   ├── Home.jsx              # Fest portal & storyline
│       │   ├── Landing.jsx           # Immersive landing page experience
│       │   ├── Login.jsx             # User authentication (Email/Password + Google)
│       │   ├── MyPass.jsx            # Digital QR Entry Pass viewer
│       │   ├── NotFound.jsx          # Styled 404 screen
│       │   ├── Security.jsx          # Gate camera QR scanner interface
│       │   ├── Signup.jsx            # User account registration
│       │   └── admin
│       │       ├── Admin.jsx                  # Analytics & live check-in counters
│       │       ├── AdminAuditLogs.jsx         # Forensic audit log viewer
│       │       ├── AdminEventRegistrations.jsx# Event attendance monitoring & CSV export
│       │       ├── AdminEvents.jsx            # Event catalog manager with live search
│       │       ├── AdminRegistrations.jsx     # Searchable entry pass registry & editor
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
    │   ├── AuditLog.js               # System audit log schema
    │   ├── EntryRegistration.js      # College entry pass schema
    │   ├── Event.js                  # Event catalog schema (with 1st/2nd prize fields)
    │   ├── EventRegistration.js      # Event registration schema
    │   ├── SiteConfig.js             # Global feature flags & system config
    │   └── User.js                   # Synced user profile schema
    ├── routes
    │   ├── admin.js                  # Admin API endpoints
    │   ├── auth.js                   # Auth profile & role sync
    │   ├── events.js                 # Event listings & detail queries
    │   ├── registration.js           # Entry pass creation & QR verification
    │   └── user.js                   # User dashboard endpoints
    ├── scripts
    │   └── sync_events.js            # MongoDB Atlas brochure events upsert utility
    └── test
        ├── api_endpoints.test.js     # Backend integration test suite
        └── audit_verification.js     # System integrity & pass verification audit
```

---

## Pages & Routing Architecture

All application routes are configured in `client/src/App.jsx`.

### 1. Public Routes
- `/` (`Landing.jsx`): Hero portal featuring tactical animations, festival theme storyline, and entry pass CTAs.
- `/home` (`Home.jsx`): Interactive fest overview.
- `/login` (`Login.jsx`): User sign-in supporting email/password and Google authentication. Redirects back to intended destination after authentication.
- `/signup` (`Signup.jsx`): New account creation with display name, email, and password.
- `/faq` (`FAQ.jsx`): Accordion-style help center addressing pass registration, campus entry, event policies, and security procedures.

### 2. User Protected Routes (Requires Firebase Authentication)
- `/dashboard` (`Dashboard.jsx`): Personal portal displaying Entry Pass status, quick actions, event categories, and quick links.
- `/entry-registration` (`EntryRegistration.jsx`): Multi-stage intake form generating a permanent `VEC-XXXXXXXX` entry pass.
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
  - In-flow registration link directing participants to the official Google Form

### 3. Security Check-in Routes
- `/security` (`Security.jsx`): Camera-driven QR scanner interface (accessible to `security` and `admin` roles) to verify attendee passes at the college entrance, prevent duplicate admissions, and record check-in timestamps.

### 4. Admin Command Center (Requires `admin` role)
Wrapped in `AdminLayout.jsx` with persistent sidebar navigation:
- `/admin` (`Admin.jsx`): Command overview showing total passes registered, gate check-in rates, active event counts (29), and user counts.
- `/admin/registrations` (`AdminRegistrations.jsx`): Searchable, paginated registry of all attendee entry passes with:
  - Inline **Edit Attendee Pass Modal** (Full Name, Email, College, Phone, Gate Check-In toggle)
  - **Delete Pass** confirmation modal with automatic audit trail
  - CSV export of registered attendees
- `/admin/events` (`AdminEvents.jsx`): Real-time events control console featuring:
  - **Live Search Bar** across title, category, branch, fee, and keywords
  - Live reconfiguration modal (registration open/locked, status `open`/`closed`, prize pool)
- `/admin/event-registrations` (`AdminEventRegistrations.jsx`): Event signups monitoring with event selector, search, team details, and CSV export.
- `/admin/users` (`AdminUsers.jsx`): User directory. Allows creating accounts, changing roles (`user`, `security`, `admin`), issuing password resets, and account deletion.
- `/admin/audit-logs` (`AdminAuditLogs.jsx`): Forensic audit logging console tracking all mutations (`ENTRY_PASS_UPDATED`, `ENTRY_PASS_DELETED`, `EVENT_UPDATED`, etc.) with before/after state diffs.

---

## Official Events Roster (29 Events)

The platform includes **29 official events** categorized under Technical and Non-Technical sectors, mapped directly from the festival brochure:

### Technical Events (18 Events)
1. **Technical Debate** (Solo | Open to All)
2. **Technical Quiz** (Solo | Open to All)
3. **Prompt Mania** (Solo | Open to All)
4. **Tech Arena 2.0** (Team of 2 | Open to All)
5. **Breaking the AI** (Solo | Open to All)
6. **UI Nightmare** (Solo | Open to All)
7. **Code Musketeer** (Solo | Open to All)
8. **Project Competition** (Team of 2–4 | Open to All)
9. **Tech Traitors** (Solo | Open to All)
10. **CAD Clash** (Solo | Open to All)
11. **Code Fusion AI** (Solo | Open to All)
12. **Technical Treasure Hunt** (Team of 2 | Open to All)
13. **Bolt Rush** (Team of 2 | Open to All)
14. **The 50** (Solo | Open to All)
15. **Embedded Systems Showdown** (Team of 2 | Open to All)
16. **RC Bomb Escape** (Team of 2 | Open to All)
17. **Technical Paper Presentation** (Solo / Team of 2 | Open to All)
18. **FPV Flight** (Solo | Open to All)

### Non-Technical Events (11 Events)
19. **Laser Room** (Solo | Open to All)
20. **Dooms Countdown** (Team of 3 | Open to All)
21. **Flight Frenzy** (Solo | Open to All)
22. **Neon Cricket** (Team of 4 | Open to All)
23. **Takeshi's Castle** (Solo | Open to All)
24. **Escape Room** (Team of 2 | Open to All)
25. **Squid Game** (Solo | Open to All)
26. **Neon Football** (Team of 3 | Open to All)
27. **IPL Auction** (Team of 3 | Open to All)
28. **Tech Hero** (Solo | Open to All)
29. **Combat Core** (Team of 2 | Open to All)

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
ADMIN_EMAILS="admin@example.com"
SECURITY_EMAILS="security@example.com"
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

*(The backend also automatically seeds and synchronizes the 29 events upon startup in `server/index.js`).*

### 4. Running Verification Tests

```bash
npm test
```
Executes backend API endpoint validation, schema integrity checks, and atomic reservation tests.

### 5. Production Build

```bash
npm run build
```
Creates an optimized production bundle inside `client/dist`.

---

## Security & Authentication

- **Zero Plain-Text Passwords**: The application does not store passwords in MongoDB or anywhere on the local server. Authentication is entirely handled by Google Firebase Auth, which salts and hashes passwords using **scrypt**.
- **Role-Based Guards**: Protected endpoints verify Firebase ID tokens and enforce role claims (`user`, `security`, `admin`).
- **Gate Check-In Immutability**: Attendee entry passes carry a unique cryptographically generated registration ID (`VEC-XXXXXXXX`). Gate scans atomically update check-in status and timestamps, preventing duplicate entries.
- **Audit Trails**: All sensitive administrative actions (modifying an attendee pass, deleting a pass, updating event parameters, changing user roles) are written to the `AuditLog` collection.

---

## Credits & License

- **Festival**: VECTORS 26-27 Annual Technical Festival
- **Institution**: A. C. Patil College of Engineering (ACPCE)
- **Engineering**: VECTORS Technical Team
- **License**: Private & Proprietary (All rights reserved)
