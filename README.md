# VECTORS 2026-27

The official web platform and digital gate admission infrastructure for **VECTORS 2026-27**, the annual national technical festival of **A. C. Patil College of Engineering (ACPCE)**.

The system provides an integrated digital operations backbone for the festival, combining high-throughput attendee intake, digital credential generation, atomic QR-based gate admissions, dynamic team event validations, administrative oversight, and forensic audit logging.

---

## System Architecture

```mermaid
flowchart TD
    subgraph ClientTier [Client Tier]
        SPA[React 19 Single Page Application]
        QRScanner[Camera QR Scanner Interface]
        AuthClient[Firebase Authentication Client SDK]
    end

    subgraph EdgeRouting [Vercel Edge Network]
        EdgeCDN[Edge CDN & Static Asset Cache]
        VercelRouter[Routing Engine & Rewrites]
    end

    subgraph ComputeTier [Serverless Compute Tier]
        FunctionBridge[api/index.js Bridge]
        ExpressCore[Express 5 Application]
        SecurityLayer[Helmet, Rate Limiter, Trust Proxy, Mongo Sanitize]
        RouteHandlers[Registration, Events, Admin, Security, User]
    end

    subgraph DataServices [Managed Cloud Services]
        MongoCluster[(MongoDB Atlas Cluster)]
        FirebaseEngine[Google Firebase Authentication Engine]
    end

    SPA -->|Static Assets: CSS, JS, Fonts| EdgeCDN
    SPA -->|API Requests: /api/*| VercelRouter
    VercelRouter -->|Serverless Invocation| FunctionBridge
    FunctionBridge --> ExpressCore
    ExpressCore --> SecurityLayer
    SecurityLayer --> RouteHandlers
    AuthClient -->|OAuth / Password Auth| FirebaseEngine
    RouteHandlers -->|Token Verification| FirebaseEngine
    RouteHandlers -->|Connection-Cached Queries| MongoCluster
```

---

## Technology Stack

### Frontend Application
- **Core Framework**: React 19, Vite 8, React Router v7
- **Styling Architecture**: Tailwind CSS v4 with custom design tokens and tactical dark palette
- **Developer Tooling & Linting**: Official Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`) integration with custom language associations for Tailwind v4 `@theme` directives
- **Graphics & Rendering**: Three.js & `@react-three/fiber` for procedural WebGL canvas rendering, Lucide React iconography
- **Hero & Visual Direction**: Cinematic DOOM monolith citadel visual integration with high-contrast tactical telemetry HUD elements (`#00E676`)
- **Performance & Code-Splitting**: Route-level dynamic loading (`React.lazy`) and manual Rollup vendor chunking (`vendor-three`, `vendor-motion`, `vendor-firebase`, `vendor-icons`) delivering a >75% reduction in initial payload (~398 kB entry)
- **Hardware Integration**: `@yudiel/react-qr-scanner` for browser-level camera stream acquisition
- **Credential Generation**: `qrcode.react` for vector-based SVG QR rendering

### Backend API & Services
- **Runtime Environment**: Node.js (v22.x configured on Vercel Serverless Functions & local dev)
- **API Framework**: Express 5
- **Authentication**: Google Firebase Authentication with Firebase Admin SDK (v13 LTS) token verification
- **CJS/ESM Compatibility**: `firebase-admin@13` + `jose@4.15.9` override ensuring native CommonJS execution without ESM resolution conflicts on Vercel Serverless Function runtimes
- **Database & Data Modeling**: MongoDB Atlas with Mongoose 9
- **Security Middleware**:
  - `helmet`: Secure HTTP headers
  - `cors`: Explicit origin allowlist supporting production and preview environments
  - `express-rate-limit`: Global production traffic shaping with reverse proxy trust
  - `rateLimitMongo` (Custom): Distributed MongoDB-backed multi-tier rate limiter utilizing atomic `$inc` updates and TTL index auto-eviction (`server/middleware/rateLimitMongo.js`)
  - `express-mongo-sanitize`: NoSQL injection query sanitization

### Infrastructure & Deployment
- **Hosting Platform**: Vercel (Edge CDN + Node.js 22 Serverless Functions)
- **Domain & DNS**: Vercel `*.vercel.app` testing deployment & GoDaddy Custom Domain DNS integration
- **SSL / TLS**: Automatic zero-configuration certificate provisioning via Vercel Edge

---

## Repository Structure

```text
VECTORS_26-27/
├── .vscode/
│   ├── extensions.json               # Recommended extensions (Tailwind CSS IntelliSense)
│   └── settings.json                 # Editor associations and CSS linting rules for Tailwind v4
├── api/
│   └── index.js                      # Serverless function bridge for Vercel
├── client/
│   ├── index.html                    # Single Page Application entrypoint
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.js                # Build configuration and development proxy
│   ├── public/
│   │   ├── favicon.png               # Application icon and touch icon (square)
│   │   ├── vector26-logo-new.png     # Active transparent festival identity logo (UI banner/wordmark)
│   │   ├── vector26-logo.png         # Preserved legacy festival identity asset
│   │   ├── hero-bg.jpg               # Portal visual assets
│   │   └── fonts/                    # Display typography assets
│   └── src/
│       ├── App.jsx                   # Central routing and authorization guards
│       ├── components/               # Reusable UI, layout wrappers, and navigation
│       ├── contexts/AuthContext.jsx  # Authentication state machine and token sync
│       ├── data/events.js            # Festival event domain data
│       └── pages/                    # Application views (Portal, Events, Admin, Gate)
├── server/
│   ├── index.js                      # Express application configuration and exports
│   ├── package.json                  # Backend dependencies
│   ├── config/db.js                  # Database connection pooling and caching
│   ├── data/officialEvents.js        # Seed definitions for festival events
│   ├── middleware/                   # Authentication, RBAC, and rate limiting middleware
│   │   ├── auth.js                   # Token verification and role enforcement
│   │   └── rateLimitMongo.js         # Distributed MongoDB-backed atomic rate limiter
│   ├── models/                       # Mongoose schemas (Pass, Event, User, Audit, RateLimit)
│   ├── routes/                       # Express route controllers
│   └── test/                         # System validation and integration test suites (rate_limit, etc.)
├── vercel.json                       # Unified edge routing, rewrites, and security headers
├── .gitignore                        # Git exclusion rules for secrets, builds, and local configs
└── package.json                      # Monorepo workspaces and top-level lifecycle scripts
```

---

## Core System Modules

### 1. Digital Entry Pass & Identity Issuance
- Standardized attendee intake capturing verified identity, institutional affiliation, department, and contact details.
- Generation of permanent, cryptographically indexed identifiers (`VEC-XXXXXXXX`).
- Dynamic client-side QR generation encoding verifiable pass credentials for campus gate entry.
- **Immediate Post-Registration Sync**: After pass issuance, the client performs an optimistic local state update with full pass data (including phone, check-in flags) followed by an immediate authoritative backend sync via `checkPassStatus()`, ensuring the UI reflects the true database state without requiring page navigation or manual refresh.
- **On-Demand & Window Focus Status Sync**: Efficient status synchronization triggered on pass mount, tab focus (with 15-second cooldown), and manual user refresh via the tactical header action button (`REFRESH PASS`). The pass card layout eliminates intermediate sync banners so primary navigation actions (`ACCESS EVENT VAULTS`) remain clean and directly clickable without layout shifts.
- **Manual Attendance Administration**: Gate personnel can scan passes via `/security`, while event admins can perform 1-click Day 1 & Day 2 check-ins directly from the Attendee Registry table (`AdminRegistrations.jsx`).

### 2. High-Throughput Gate Security & Multi-Day Check-In
- Browser-based camera QR scanner optimized for mobile and desktop camera inputs.
- Dual-role authorization restricted to authorized gate personnel (`security` and `admin`).
- **Multi-Day Attendance Engine**: Independent atomic check-in tracking for both **Day 1** and **Day 2** using a single immutable attendee QR pass.
- **Tactical Day Selector**: Gate personnel toggle between `DAY 1 SCAN` and `DAY 2 SCAN` directly within the scanner interface.
- **Race Condition & Re-Scan Protection**: Atomic `findOneAndUpdate` conditional filtering prevents duplicate entry attempts on the same day while allowing legitimate entry on Day 2.
- **Visual Credential Badging**: Real-time feedback displaying attendee name, college, dual-day attendance badges (`Day 1: Checked In` / `Day 2: Pending`), and verification timestamps.

### 3. Event Registration Engine
- **Solo Events**: Instant credential linkage and confirmation.
- **Team Events**: Strict server-side enforcement of event-specific minimum and maximum team sizes.
- **External Integration Pipeline**: External claims without immediate roster validation are recorded as pending verification, requiring administrator review before final confirmation.

### 4. Administrative Control Suite
- **Analytics Overview**: Live metrics tracking campus check-in velocity across Day 1 & Day 2, total pass issuance, event registrations, and real-time account-to-pass onboarding funnel.
- **User Accounts & Onboarding Telemetry**: Complete directory of all user accounts created on the festival platform, with real-time tracking of whether each user has minted an Entry Pass (`QR Claimed` with Pass ID) or created an account only (`No Pass Yet`), joined timestamps, contact phone sync, and role controls.
- **Contact Details & Automatic Phone Sync**: Zero-friction signup allows initial account creation via Email/OAuth without SMS OTP hurdles. Once an attendee claims their campus QR Entry Pass, their phone number is automatically synced to their user profile. The admin user table displays direct `tel:` dialing links with an explicit indicator if an account has not yet claimed a pass.
- **Attendee Registry**: Searchable, paginated records with field updates, Day 1/Day 2 check-in toggles, and sanitized CSV exports.
- **Event Catalog Management**: Real-time configuration of event registration statuses and parameters.
- **Role-Based User Management**: User account creation, editing (name, phone, role), role elevation management (`user`, `security`, `admin`), account deletion with Firebase sync, and secure password reset link generation.
- **Account & Registration CSV Exports**: Injection-neutralized CSV downloads for QR Entry Passes, Event Registrations, and All User Accounts (including phone numbers and pass claim status).
- **Audit Logging**: Forensic system audit log records.

### 5. Client Navigation & Routing Architecture
- **Unified Navigation Across Views**: Both the Landing Page floating navbar (`LandingNav.jsx`) and internal layout header (`Navbar.jsx`) expose consistent, direct routing to core site destinations (`HOME`, `EVENTS`, `ENTRY PASS` / `MY PASS`, `DASHBOARD`, `FAQ`) across both desktop and mobile viewports.
- **Pathless Layout Routing**: Standardized React Router v6 pathless layout pattern (`<Route element={<Layout />}>`) eliminates route scoring collisions with the root landing view (`/`), ensuring seamless matching for public discovery views (`/events`, `/events/:eventId`, `/faq`) and protected user operations (`/dashboard`, `/entry-registration`, `/my-pass`).
- **Responsive Viewport Visibility**: Realigned desktop navigation breakpoints to `md:flex` (768px+) and mobile drawers to `md:hidden`, preventing navigation links from collapsing or disappearing on 1024px desktop and tablet displays with active scrollbars.
- **State-Preserving Authentication Redirection**: `ProtectedRoute` captures the user's intended destination (`location.state.from`), and both `Login.jsx` and `Signup.jsx` dynamically honor this target upon successful authentication, directing users straight to their requested dashboard or pass rather than forcing a redirect to the home screen.
- **Unrestricted Event Catalog Discovery**: Public exploration of the 20+ event arenas (`/events` and `/events/:eventId`) is open to all visitors and attendees without hard clearance gates, while non-intrusive advisory banners and action prompts guide users to claim their Entry Pass when ready to register and compete.

---

## REST API Specification

### Public Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Service health and database connectivity probe (`200` connected, `503` degraded) |
| `GET` | `/api/events` | List all active festival events with search and category filtering |
| `GET` | `/api/events/:slug` | Retrieve complete specifications and metadata for a specific event |
| `GET` | `/api/announcements` | Retrieve official broadcasts and pinned festival notices |
| `POST` | `/api/auth/reset-password` | Anti-enumeration password reset proxy dispatching reset links via Google Identity Toolkit (Rate limited: 5 req/IP/15m, 3 req/email/hr; returns uniform 200 message regardless of account existence) |

### Authenticated User Endpoints (Bearer Token Required)

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/sync` | Synchronize Firebase identity with MongoDB user profile, auto-assigning configured `admin` and `security` roles, resolving `displayName` via Firebase Admin SDK fallback, and auto-attaching verified phone numbers (Rate limited: 10 req/IP/15m baseline + 5 failed attempts/email/15m applied post-token verification) |
| `GET` | `/api/user/dashboard` | Aggregated user summary including pass status, Day 1 & Day 2 check-in timestamps, and active registrations |
| `POST` | `/api/register` | Mint a verified campus Entry Pass (`VEC-XXXXXXXX`) and sync attendee contact phone to user account (Rate limited: 100 req/IP/15m anti-bot defense) |
| `GET` | `/api/register/status` | Retrieve the authenticated user's authoritative pass status, QR payload, and Day 1 / Day 2 check-in telemetry |
| `GET` | `/api/my-pass` | Alias route retrieving digital pass details with Day 1 & Day 2 attendance stamps |
| `POST` | `/api/events/:slug/register` | Register for an event with validation of team parameters |

### Gate Security Endpoints (`security` or `admin` Role Required)

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/verify/:registrationId?day=1\|2` | Perform atomic check-in on an Entry Pass for Day 1 or Day 2 (returns `VALID` or `ALREADY_CHECKED_IN` with multi-day attendance metadata; Rate limited: 30 req/IP/15m scanner flood defense) |

### Administration Endpoints (`admin` Role Required)

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Aggregated system metrics, pass counts, account funnel breakdown, recent signups, and Day 1 / Day 2 check-in rates |
| `GET` | `/api/admin/registrations` | Paginated registry of attendee entry passes with query search |
| `PATCH` | `/api/admin/entry-registrations/:id` | Update attendee metadata or toggle manual check-in status (`day1CheckedIn`, `day2CheckedIn`) |
| `DELETE` | `/api/admin/entry-registrations/:id` | Revoke an entry pass and record audit log entry |
| `GET` | `/api/admin/event-registrations` | Searchable event registration records and team rosters |
| `PATCH` | `/api/admin/event-registrations/:id/status` | Confirm or cancel pending event registrations |
| `GET` | `/api/admin/event-registrations/export` | Download sanitized CSV export of event submissions |
| `GET` | `/api/admin/users` | Directory of all created user accounts with role assignment, contact phone numbers, Firebase auto-sync, and Entry Pass QR claim telemetry |
| `POST` | `/api/admin/users` | Create a new user account with role, password, and optional phone |
| `PUT` | `/api/admin/users/:id` | Update user details (displayName, phone, role, password) with automatic sync to `EntryRegistration` |
| `DELETE` | `/api/admin/users/:id` | Delete user account from both MongoDB and Firebase Auth |
| `PATCH` | `/api/admin/users/:id/role` | Quick role upgrade/downgrade (`user`, `security`, `admin`) |
| `POST` | `/api/admin/users/:id/reset-password` | Generate Firebase password reset link for user |
| `GET` | `/api/admin/users/export` | Download sanitized CSV export of all created user accounts, roles, phone numbers, and pass claim statuses |
| `GET` | `/api/admin/audit-logs` | Forensic system audit log records |

---

## Security Audit & Reliability Engineering

A comprehensive full-stack security and reliability audit was conducted across the codebase to ensure enterprise-grade resilience against OWASP Top 10 vulnerabilities, race conditions, and distributed serverless failure modes.

### Security Audit & Hardening Matrix

| Threat Category | Attack Vector / Risk | Architectural Mitigation & Resolution |
|---|---|---|
| **Broken Authentication** | Client-side role claims or unverified token payloads | Cryptographic signature verification via Firebase Admin SDK; roles are mapped directly from server-side databases and secure environment configuration. |
| **Race Conditions / Double-Entry** | Concurrent requests attempting double check-in at campus entry gates | Atomic `findOneAndUpdate` conditional filtering (`checkedIn: false`) enforced at the database engine level, ensuring linear execution. |
| **NoSQL Injection** | Malicious operator payloads (`$gt`, `$ne`, `$where`) in JSON or query params | Pre-routing request sanitation using `express-mongo-sanitize` stripping operator syntax from all incoming payloads. |
| **ReDoS (Regex Denial of Service)** | Catastrophic backtracking in search and filter inputs | Special regex character sanitization and input length clamping before compilation into queries. |
| **CSV / Formula Injection** | Malicious spreadsheet formula prefixes (`=`, `+`, `-`, `@`) in attendee exports | Output encoding and formula neutralization escaping all exported string fields. |
| **Serverless Resource Exhaustion** | Connection storms and socket starvation across cold/warm function cycles | Global Mongoose connection caching and promise reuse across stateless invocation lifecycles. |
| **Client IP Spoofing & Rate Limiting** | Reverse proxy header manipulation and false-positive developer/attendee lockouts | Configured Express `trust proxy: 1` aligned with Vercel Edge CDN forwarding. Rate limiting automatically bypassed during development and for loopback proxies (`127.0.0.1`, `::1`); production global ceiling elevated to 5000 req/15min to prevent navigation lockouts while securing pass creation. |
| **Brute-Force, Account Enumeration & Scanner Flooding** | Token sync flood abuse on `/api/auth/sync`, user enumeration on `/api/auth/reset-password`, and high-frequency QR scanning race attacks | Multi-tier MongoDB-backed rate limiter (`rateLimitMongo`) with compound `(key, category)` unique indexes and atomic 3-phase `findOneAndUpdate` + `$inc` counters. TTL indexes automatically purge expired windows. Auth sync enforces 10 req/IP/15m baseline flood protection plus 5 failed sync attempts/identity/15m against verified identities for API abuse prevention. Password reset enforces 5 req/IP/15m plus 3 req/email/hr with uniform responses and server-side Identity Toolkit dispatch. Gate verification enforces 30 req/IP/15m defense-in-depth. |
| **Database Connectivity & IP Access** | Dynamic developer IP or VPN routing changes rejecting MongoDB Atlas handshakes | Health probes report status 503; client dashboard telemetry surfaces descriptive diagnostic messages directing administrators to Atlas IP Access List. |

### Automated Test Verification

The platform architecture is covered by automated integration test suites verifying critical security boundaries:
- Verification of cryptographic token rejection and access denials across unauthenticated requests.
- Enforcement of Role-Based Access Control (RBAC) preventing horizontal and vertical privilege escalation.
- Simulated concurrency tests verifying atomic check-in prevents duplicate gate admissions under load.
- Strict payload validation preventing unregistered or malformed team sizes from entering state persistence.
- Distributed MongoDB rate limiter and auth sync regression test suite (`server/test/rate_limit.test.js`) verifying 77 boundary conditions: valid token sync and RBAC role promotion (`user`, `admin`, `security`), IP quotas, email velocity caps, identical enumeration protection responses, gate scanner thresholds, and atomic concurrency limits.
- Sanity checks confirming safe fallback behavior during external dependency outages.

---

## Production Deployment Architecture

The platform is designed for unified single-domain hosting on Vercel:

```text
https://yourdomain.com/         --> Static Edge Distribution (client/dist)
https://yourdomain.com/api/*    --> Serverless Function Runtime (api/index.js)
```

### Routing Configuration
- Inbound requests matching `/api/(.*)` rewrite to the serverless function handler.
- Static assets matching `/assets/(.*)` and `/fonts/(.*)` are served directly from the edge cache with immutable cache control headers.
- All non-API, non-static document requests rewrite to `/index.html` to enable client-side React Router execution without 404 errors on deep links.

### DNS Mapping
For apex and subdomain configuration on GoDaddy:
- **Apex Record**: Type `A`, Host `@`, Points to `76.76.21.21`
- **Subdomain Record**: Type `CNAME`, Host `www`, Points to `cname.vercel-dns.com.`

---

## License & Ownership

- **Event**: VECTORS 2026-27 Annual National Technical Festival
- **Institution**: A. C. Patil College of Engineering (ACPCE), Navi Mumbai, Maharashtra, India
- **Engineering & Operations**: VECTORS Technical Team
- **Intellectual Property**: Private & Proprietary. All rights reserved.
