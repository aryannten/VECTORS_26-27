# VECTORS 2026 — Art Direction

> **This document is the visual source of truth for the VECTORS 2026 website.**  
> It governs all UI design, 3D environment creation, and motion choreography.

## 1. Final Concept: The Monolithic Engine

The visual identity of VECTORS 2026 is a hybrid of brutalist architectural scale and intricate, ancient-yet-advanced machinery. The user is exploring a massive, imposing fortress (The Monolith) powered by complex, glowing mechanical systems and arcane circuitry (The Engine). 

The atmosphere is oppressive, majestic, and deeply intellectual, capturing the essence of Doctor Doom without relying on generic comic-book aesthetics.

## 2. Color System

Color must be used with strict hierarchy. The site is fundamentally dark, using color only for illumination, interaction, and emphasis.

*   **Primary Base (Architecture):** Deep Charcoal `#121212` and Gunmetal Gray `#2A2E33`.
*   **Secondary Base (Machinery):** Rusted Iron `#1C1A17` and Dark Bronze `#2D241E`.
*   **Primary Accent (Energy):** Latverian Emerald `#00FF66` — This is the "lifeblood" of the site. Used for glowing runes, active UI elements, and core 3D lighting.
*   **Secondary Accent (Mechanism):** Tarnished Brass `#B89C49` — Used for subtle UI borders, inactive states, and mechanical highlights.
*   **Primary Text:** Bone White `#F4F4F5`.
*   **Secondary Text (Data):** Muted Steel `#8F939C`.

## 3. Typography

*   **Display (Headers & Hero):** A monumental, sharp serif font (e.g., *Cinzel*, *Ogg*, or *Playfair Display*). It should look authoritative, as if engraved into stone or forged in steel.
*   **Body & UI Data:** A highly legible, slightly technical monospaced or geometric sans-serif (e.g., *JetBrains Mono* or *Inter*). This represents the "output" of the machine, providing absolute clarity for event details, times, and forms.

## 4. Logo Direction

The VECTORS 2026 wordmark should be constructed using the monumental serif font. It should be encased within a circular, astrolabe-like seal that combines sharp geometric lines with arcane circuitry patterns. It must look heavy, metallic, and permanent.

## 5. Material Direction

Materials in 3D and 2D UI should feel tangible and heavy.
*   **Dominant:** Matte concrete, worn steel, dark iron.
*   **Highlights:** Tarnished brass, copper.
*   **Avoid:** Glossy plastic, pristine Apple-like glass, bright gradients. Glassmorphism should only be used if it mimics thick, smoked, or dirty industrial glass.

## 6. Lighting Direction

Lighting is cinematic, directional, and moody.
*   **Key Lighting:** Strong, single-source directional light casting hard, deep shadows across the brutalist architecture.
*   **Practical Lighting:** The primary source of color. Green emerald energy glows from within crevices, runes, and UI active states.
*   **Atmosphere:** Volumetric fog/haze is essential at the base of structures to create a sense of massive scale and depth.

## 7. 3D Environment

The 3D environment is NOT a continuous, roaming playground. It is used for specific, high-impact moments (Hero, Event Vaults, QR Reveal).

*   **The Wall:** A massive vertical structure of concrete and dark metal taking up the background.
*   **The Core:** Enormous interlocking brass and iron gears, concentric rings, and astrolabe mechanics embedded in the wall. 
*   These mechanical elements are the primary moving parts of the site, turning slowly and heavily as the user scrolls.

## 8. Image & Video Treatment

*   **Images:** Must be treated to feel integrated into the environment. Use dark overlays, heavy contrast, and subtle emerald or amber color grading.
*   **Framing:** Images should not sit in basic white rectangles. They should appear within mechanical frames, behind smoked glass, or projected onto concrete surfaces.
*   **Videos:** Short, loopable, muted, and heavily color-graded to match the site's palette. Used to add life to event vaults.

## 9. Animation Language

*   **Weight and Gravity:** Nothing bounces. Animations should feel heavy. Use custom GSAP easings (e.g., `power4.inOut` or custom sine curves). 
*   **Mechanical Precision:** UI elements should snap or lock into place like gears engaging.
*   **Scroll-Scrubbed:** Major 3D movements and large typography reveals must be bound to the scroll position (`scrub: true`). The scrollbar drives the machinery.

## 10. UI Language

*   **Containers:** Panels and cards should look like machined metal plates or recessed vaults, not floating white boxes. Use 1px tarnished brass borders (`#B89C49`) to define edges against the dark background.
*   **Buttons:** Magnetic on desktop. Solid structural fills. Hover states should illuminate the button with the emerald green accent, like a machine powering up.
*   **Forms:** Registration forms should look like terminal inputs or mechanical control panels.

## 11. Mobile Design Principles

*   **Verticality is King:** The brutalist monolith design inherently supports scrolling up and down a massive wall.
*   **Thumb-Wheel Mechanics:** Interacting with event carousels or menus should mimic turning a combination dial or mechanical wheel.
*   **Degrade Gracefully:** The heavy 3D elements must fallback to baked cinematic videos or high-quality static imagery on low-end mobile devices, while keeping the UI fully interactive.

## 12. Things Explicitly Forbidden

> [!WARNING]
> Do NOT include any of the following elements in the design or implementation:
> 
> 1.  **Purple or Blue-Purple Gradients:** Often used in "cyberpunk" or generic tech sites. Stick strictly to the defined palette.
> 2.  **Floating Neon Cubes/Grids:** The 3D elements must be heavy, architectural, or mechanical. Nothing floats without a structural reason.
> 3.  **Bouncy/Spring Animations:** No playful UI physics.
> 4.  **Generic SaaS Cards:** Event details must not look like a standard pricing tier grid.
> 5.  **Hover-Only Functionality:** Mobile users must have clear touch targets for all interactions.
> 6.  **"Slop" AI Generation:** Any AI assets must be heavily curated, post-processed, and contextually relevant. No unedited midjourney output.
