# VECTORS 26-27 — Doomsday Protocol

The official web platform and digital entry system for VECTORS 2026, the annual college technical festival. Built around an **Avengers: Doomsday** visual identity (Doctor Doom / Latverian architecture aesthetic) featuring interactive WebGL shaders, role-based access control, digital entry passes with QR check-in, and an admin command center.

---

## Overview

VECTORS 26 is a full-stack web application designed to handle both festival experience and logistics:

1. **Cinematic Fest Experience**: Immersive dark-mode visual interface with Latverian architectural elements, custom SVG wordmarks, interactive liquid metal (OGL ferrofluid simulation), and Framer Motion micro-interactions.
2. **Access-Gated Event Discovery**: Event vaults (Technical and Non-Technical) are locked behind an mandatory verified digital Entry Pass. Visitors must register their details to unlock event schedules, problem statements, and registration links.
3. **QR Pass & Gate Scanner System**: Participants receive a unique digital pass (`VEC-XXXXXXXX`) with an on-screen QR code. Security personnel at the college gate scan passes with a mobile-optimized camera scanner to approve entry and prevent duplicate check-ins.
4. **Admin Command Center**: Organizers get real-time metrics on total registrations, live gate check-in counts, active events, and user account management (role promotion, password resets, and user creation).

---

## Tech Stack

### Frontend (`/client`)
- **Core**: React 19, Vite 8, React Router v7
- **Styling**: Tailwind CSS v4 (using the `@theme` engine in `index.css` with CSS custom properties)
- **Visuals & 3D**:
  - `OGL`: WebGL shader engine powering the interactive `<Ferrofluid />` liquid metal hero background
  - `Three.js` / `@react-three/fiber` / `@react-three/drei`: 3D rendering pipeline for the astrolabe mechanical elements
  - `Framer Motion` & `GSAP`: Page transitions, orchestrated typography reveals, and UI physics
  - `Lucide React`: Iconography
- **Auth & Scanning**:
  - `firebase`: Client SDK for email/password and Google Popup authentication
  - `qrcode.react`: SVG QR code generator for student passes
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
├── .gitignore
├── VECTORS_2026_Antigravity_Master_Specification.md
├── client
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── README.md
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   └── vectors-logo.png
│   ├── src
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   ├── vectors-logo.png
│   │   │   └── vite.svg
│   │   ├── components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Astrolabe3D.jsx
│   │   │   ├── DoomsdayWordmark.jsx
│   │   │   ├── EntryPassGate.jsx
│   │   │   ├── FaultyTerminal.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Particles.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ui
│   │   │       ├── FaultyTerminal.jsx
│   │   │       ├── Ferrofluid.jsx
│   │   │       ├── Particles.jsx
│   │   │       ├── beams-background.jsx
│   │   │       ├── blur-text.jsx
│   │   │       └── glow-button.jsx
│   │   ├── contexts
│   │   │   └── AuthContext.jsx
│   │   ├── data
│   │   │   └── events.js
│   │   ├── index.css
│   │   ├── lib
│   │   │   ├── firebase.js
│   │   │   └── utils.js
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── EntryRegistration.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyPass.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Security.jsx
│   │   │   ├── SecurityLogin.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── admin
│   │   │       ├── Admin.jsx
│   │   │       ├── AdminEvents.jsx
│   │   │       ├── AdminRegistrations.jsx
│   │   │       └── AdminUsers.jsx
│   │   └── vite-env.d.ts
│   ├── tsconfig.json
│   └── vite.config.js
├── docs
│   ├── ART_DIRECTION.md
│   ├── ASSET_MANIFEST.md
│   ├── CONCEPTS.md
│   ├── PERFORMANCE_REPORT.md
│   ├── PROJECT_STATE.md
│   ├── QA_REPORT.md
│   ├── RESEARCH.md
│   └── UX_FLOW.md
├── package-lock.json
├── package.json
└── server
    ├── .env
    ├── .env.example
    ├── config
    │   └── db.js
    ├── index.js
    ├── middleware
    │   └── auth.js
    ├── models
    │   ├── EntryRegistration.js
    │   ├── Event.js
    │   ├── SiteConfig.js
    │   └── User.js
    ├── package-lock.json
    ├── package.json
    ├── routes
    │   ├── admin.js
    │   ├── auth.js
    │   ├── events.js
    │   └── registration.js
    └── serviceAccountKey.json
```

---

## Pages & Routes

All routes are defined in `client/src/App.jsx`.

### Public Routes
- `/` (`Home.jsx`): Hero portal featuring interactive `<Ferrofluid />` WebGL background, SVG Doomsday wordmark with Latverian ogival arch, event narrative, and entry CTAs.
- `/login` (`Login.jsx`): User sign-in supporting email/password and Google authentication. Redirects back to intended route after authentication.
- `/signup` (`Signup.jsx`): New account creation with display name, email, and password.

### User Protected Routes (Requires standard user login)
- `/entry-registration` (`EntryRegistration.jsx`): 4-step multi-stage form (Identity &rarr; Contact &rarr; Affiliation/College &rarr; QR Pass Generation). Generates a permanent `VEC-XXXXXXXX` entry pass.
- `/my-pass` (`MyPass.jsx`): Renders the user's digital entry pass with a dynamic QR code (`qrcode.react`), pass ID, user details, and checked-in badge.
- `/events` (`Events.jsx`): Master Event Vaults. **Gated by EntryPassGate** — users without an active entry pass are shown a lock gate prompting pass registration. Features two major category vaults (**Technical** and **Non-Technical**) and departmental branch filters.
- `/events/:eventId` (`EventDetail.jsx`): Detailed view for an event containing rules, schedule, venue, team size, prize pool, coordinator contact info, and Google Form registration button.

### Admin Console (Requires `admin` role)
Wrapped in `AdminLayout.jsx` with persistent sidebar navigation:
- `/admin` (`Admin.jsx`): Dashboard showing metrics (total passes registered, check-in count, active events, registered users, and active gate staff).
- `/admin/registrations` (`AdminRegistrations.jsx`): Searchable, paginated registry of all student registrations with check-in timestamps.
- `/admin/events` (`AdminEvents.jsx`): Active events overview.
- `/admin/users` (`AdminUsers.jsx`): User directory. Allows creating accounts, changing roles (`user`, `security`, `admin`), generating password reset links, and deleting accounts.

### Fallback
- `*` (`NotFound.jsx`): Styled 404 screen with a return home shortcut.

---

## Key Components Explained

- **`Navbar.jsx` (`/client/src/components/Navbar.jsx`)**: Sticky header with backdrop blur (`rgba(10,12,14,0.75)` + 14px blur) and a 1px radioactive emerald glow seam along the bottom border. Shows a back button on nested routes, conditional nav links (`Home`, `Events`, `My Pass`), user avatar ring, and a slide-down mobile menu.
- **`DoomsdayWordmark.jsx` (`/client/src/components/DoomsdayWordmark.jsx`)**: High-detail SVG wordmark for the festival title. Uses brushed chrome linear gradients, crimson core fracture lines, and an emerald energy glow filter (`#1EFFA0`) set behind an ogival Latverian Gothic arch.
- **`EntryPassGate.jsx` (`/client/src/components/EntryPassGate.jsx`)**: Intercepts access on the `/events` page. If a logged-in user does not possess an active entry pass in MongoDB, it locks the view and prompts them to complete pass registration.
- **`Ferrofluid.jsx` (`/client/src/components/ui/Ferrofluid.jsx`)**: An OGL WebGL fragment shader simulating viscous magnetic liquid metal that ripples and shifts in real-time based on mouse coordinates and scroll velocity.
- **`Particles.jsx` (`/client/src/components/ui/Particles.jsx`)**: Lightweight canvas particle system in emerald and chrome tones rendered on non-landing subpages for atmospheric depth.
- **`ProtectedRoute.jsx` (`/client/src/components/ProtectedRoute.jsx`)**: Wraps protected routes in React Router. Verifies user authentication and checks `allowedRoles` (`['security', 'admin']` or `['admin']`), redirecting unauthenticated users to `/login`.
- **`Security.jsx` (`/client/src/pages/Security.jsx`)**: Dedicated interface for volunteers operating scanners at gates. Uses `navigator.mediaDevices` through `@yudiel/react-qr-scanner` to read pass codes, call `GET /api/verify/:registrationId`, and provide large high-contrast visual indicators (`VALID` green, `ALREADY CHECKED IN` amber, `INVALID` red).
- **`AdminLayout.jsx` (`/client/src/components/AdminLayout.jsx`)**: Persistent dark layout shell for the admin portal with breadcrumb status, quick stats, navigation tabs, and session sign-out.

---

## Customization Notes

VECTORS is re-themed and reused annually across different departments. Here is how to customize the site for future iterations:

###  Theme, Palette & Fonts
All design tokens are centralized in `client/src/index.css` inside the `@theme` block:
```css
@theme {
  --color-doom-bg: #0A0C0E;
  --color-doom-bg2: #171A1E;
  --color-doom-glow: #1EFFA0;           /* Primary accent glow */
  --color-doom-glow-muted: #0B7A4E;
  --color-doom-crimson: #8B0000;
  --color-chrome-light: #C7CCD1;
  --color-text-primary: #EDEFF1;
  --color-text-muted: #8A909B;

  --font-display: 'Rajdhani', sans-serif;
  --font-accent: 'Cinzel', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'Space Mono', monospace;
}
```
To change the aesthetic (e.g. cybernetic blue, synthwave neon, or minimal monochrome), edit these CSS variables and update the Google Fonts import in `client/index.html`.

Update this array to add or modify events. The UI automatically generates the category tabs, branch filter pills, and detail pages.

---


## Credits & Team

- **Festival**: VECTORS 26-27
- **Theme**: Avengers: Doomsday / The Monolithic Engine
