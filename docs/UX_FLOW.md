# VECTORS 2026 — UX Flow Architecture

> **This document outlines the mobile-first User Experience (UX) and navigation architecture.**
> It applies the "Monolithic Engine" art direction to functional, step-by-step user journeys.

---

## 1. Global Navigation Architecture (Mobile-First)

The mobile experience relies on vertical scrolling (the Monolith) and horizontal/rotational carousels (the Engine). The primary navigation is kept intentionally minimal to prevent clutter on mobile screens.

### Primary Navigation Menu
Accessible via a clean, mechanical toggle (e.g., an interlocking gear icon) that opens a full-screen overlay menu.

*   **Home:** Return to the hero monolith sequence.
*   **Explore Events:** Jump to the event vaults.
*   **My Pass:** Quick access to the generated QR code (Requires Auth).
*   **Profile / Dashboard:** Manage user details and check registration status (Requires Auth).

### Footer Navigation
*   About VECTORS
*   Contact / Support
*   Terms & Conditions
*   Privacy Policy

---

## 2. Core Journey: Arrival to Registration

### A. The Hero Sequence
*   **State:** The site loads. A massive brutalist wall dominates the screen. A dark, intricate astrolabe is embedded in the center.
*   **Interaction:** The user scrolls down. The astrolabe mechanically unlocks, rotating opposite rings, and glows emerald green, revealing the "VECTORS 2026" wordmark and tagline.
*   **Action:** Two prominent, heavy buttons appear beneath the hero:
    1.  `GET ENTRY PASS` (Primary CTA)
    2.  `EXPLORE EVENTS` (Secondary CTA)

### B. The Decision Split
The UX must clearly separate **Free Entry** (Getting onto the campus) from **Paid Participation** (Registering for specific hackathons/competitions).

*   If the user clicks `GET ENTRY PASS` -> Proceeds to Auth / Entry Registration.
*   If the user clicks `EXPLORE EVENTS` -> Scrolls down to the Event Vaults.

### C. Authentication (Firebase)
*   **Trigger:** Trying to get an entry pass, accessing the dashboard, or saving profile data.
*   **Flow:** Standard Email/Password or Google Sign-in. 
*   **Styling:** The login modal/page looks like an arcane terminal input embedded in the monolithic wall.

---

## 3. Flow: Entry Registration & QR Pass

To avoid overwhelming the user on mobile, the entry registration is a smooth, multi-step process rather than a long scrolling form.

### Step-by-Step Flow: `/entry-registration`

1.  **Step 1: Identity**
    *   *Input:* Full Name
    *   *Action:* `NEXT` (Button illuminates green on valid input)
2.  **Step 2: Contact**
    *   *Input:* Email (Pre-filled from Auth), Phone Number
    *   *Action:* `NEXT`
3.  **Step 3: Affiliation**
    *   *Input:* College/Institution Name
    *   *Action:* `GENERATE PASS`
4.  **Step 4: Success & Generation**
    *   *Animation:* A mechanical locking animation confirms the data is saved to the MongoDB backend.
    *   *Display:* The user is immediately presented with their **Digital Entry Pass**.

### The Digital Entry Pass: `/my-pass`
*   **Visual:** Looks like a secure, glowing digital credential, not a cheap PDF. 
*   **Contents:** VECTORS branding, User Name, College, Unique Registration ID (`VEC-XXXXXXXX`), and a large, high-contrast QR code optimized for fast mobile scanning.

---

## 4. Flow: Event Exploration & Booking

The event browser avoids standard SaaS pricing cards. Instead, it uses the "Vault" concept.

### A. The Event Vaults (Browsing)
*   As the user scrolls vertically down the page, massive "vault doors" (representing Technical and Non-Technical categories) slide into view.
*   Within a category, the user swipes horizontally (or uses a thumb-wheel mechanic) to rotate through individual events.
*   Each event reveals a high-contrast cinematic image and a short description.
*   *Action:* `OPEN VAULT` (View Details).

### B. Event Detail Page
*   **Hero:** The cinematic event image/video filling the top half of the screen.
*   **Body:** Monospaced typography detailing the Rules, Eligibility, Date/Time, Venue, and Participation Fee.
*   **Action:** A massive, sticky bottom button on mobile: `REGISTER TO PARTICIPATE`.

### C. Participation Handoff
*   **Trigger:** User clicks `REGISTER TO PARTICIPATE`.
*   **Action:** The user is seamlessly directed out of the VECTORS site to the specific Google Form configured for that event in the admin panel.
*   **Note:** The VECTORS database does *not* handle payment processing or team registration forms. It acts solely as the gateway.

---

## 5. Flow: The Security Scanner

The security interface is designed for pure speed, prioritizing function over cinematic effects.

### A. Security Login: `/security`
*   Security personnel log in using specific Admin/Security credentials.

### B. The Scanner Interface
*   **Visual:** A stark, high-contrast camera viewfinder. No heavy 3D elements.
*   **Action:** Scans the attendee's QR code.
*   **Processing:** The backend verifies the `VEC-XXXXXXXX` token in real-time.

### C. Result States
1.  **VALID (Green):** Displays Attendee Name, College, and an `ALLOW ENTRY` confirmation. The backend logs the check-in timestamp.
2.  **ALREADY CHECKED IN (Yellow):** Displays a warning and the timestamp of the original check-in to prevent duplicate entry.
3.  **INVALID (Red):** Displays a clear rejection message (e.g., forged QR or expired pass).
