# VECTORS 2026 — Design Research

This document synthesizes visual, interactive, and thematic research to establish a design vocabulary for VECTORS 2026, aligned with the "Avengers: Doomsday" theme and the requirement to create a memorable, premium, cinematic experience.

---

## 1. Doomsday Visual Language

**Findings:**
The visual identity of *Avengers: Doomsday* revolves heavily around Doctor Doom, emphasizing a dark, ominous aesthetic. The tone is less about typical superhero action and more about "aura," dread, hubris, and scale. Marketing often uses gothic or medieval-inspired architectural motifs (like Latverian castles) mixed with high-tech elements.

**Key Design Principles Extracted:**
*   **Color Palette:** "Green metallic" paired with deep charcoal, true blacks, and desaturated tones. Accent with subtle, luminous green or restrained crimson.
*   **Composition:** Focus on a central, looming presence (scale). Use mural-like compositions that suggest history, tragedy, and multiversal scope.
*   **Tone:** The design must project power, intelligence, and inevitability, acting as a formidable digital environment rather than a playful one. "Entering a Marvel movie" means cinematic lighting and scale, not comic-book graphics.

## 2. Cinematic Production Design

**Findings:**
Cinematic sci-fi production design grounds futuristic concepts in reality. It uses a synthesis of architecture, practical lighting, and tactile materials to build believable worlds. 

**Key Design Principles Extracted:**
*   **Architecture & Scale:** Blend rigid, angular lines (signaling technology and control) with monumental scale to contrast the user against the environment.
*   **Lighting:** Utilize the 3-point lighting foundation in 3D. Emphasize "practical lighting" (e.g., glowing panels integrated into architecture). Use hard light and deep shadows ("negative fill") to create tension and mystery, and volumetric fog/haze to give the air texture and depth.
*   **Materials:** Avoid slick, sterile sci-fi. Use materials with a "patina" (brushed metal, dark steel, concrete, worn surfaces). Textural imperfections make the digital world feel lived-in and real.

## 3. Premium Event Websites

**Findings:**
Top-tier event sites (e.g., those featured on Awwwards) avoid standard grid templates, treating their platforms as digital stages. 

**Key Design Principles Extracted:**
*   **Scroll-Driven Storytelling:** The user’s scroll controls the sequencing of scenes and 3D transitions, establishing a narrative flow before presenting functional data.
*   **Micro-Interactions:** Subtle hover states, cursor tracking, and button magnetism create a tactile feel that elevates the platform above standard SaaS.
*   **Seamless Utility:** Despite the heavy cinematic feel, registration and ticketing flows remain frictionless, often using smooth, multi-step forms.

## 4. Interactive 3D / WebGL

**Findings:**
Modern 3D websites build "microverses." Technologies like Three.js and React Three Fiber allow for complex, shader-driven environments that perform well if optimized.

**Key Design Principles Extracted:**
*   **Spatial Storytelling:** Treat the viewport as a camera moving through a physical space. The user travels through the scene rather than just watching it.
*   **Interactive Hotspots:** Use the 3D environment to house information. Tapping specific areas reveals event data, keeping the main interface uncluttered.
*   **Performance is Paramount:** Optimize geometry and textures. Implement progressive loading and feature detection to ensure the site degrades gracefully on mid-range devices.

## 5. GSAP / Scroll-Driven Motion

**Findings:**
Awwwards-winning typography and motion rely on scrubbed timelines where animations are bound directly to scroll velocity.

**Key Design Principles Extracted:**
*   **Scrubbed Timelines:** Bind animations to the scroll position (`scrub: true`). The scrollbar acts as a cinematic timeline.
*   **Granular Text Control:** Split text into characters or words to apply staggered, 3D reveals (e.g., letters rotating in from the Z-axis).
*   **Custom Easing:** Avoid default robotic easing. Use custom cinematic curves to give motion a "weighted," physical feel.

## 6. Editorial Digital Experiences

**Findings:**
Magazine-style digital experiences leverage high-contrast typography and deep backgrounds to create a gallery-like atmosphere.

**Key Design Principles Extracted:**
*   **Typography as Hero:** Pair bold, high-contrast display fonts (serif or stylized sans-serif) for headers with clean, legible sans/mono fonts for technical event details.
*   **The Dark Canvas:** Deep backgrounds (true blacks, charcoals) allow photography and vibrant UI elements (like metallic green accents) to pop.
*   **Asymmetrical Layouts:** Break the monotony of grids. Treat event information like articles in a high-end publication.

## 7. Mobile-First Interaction

**Findings:**
Mobile UX for cinematic sites requires balancing visual impact with touch ergonomics. A shrunken desktop site always fails.

**Key Design Principles Extracted:**
*   **Vertical Scrollytelling:** Use the vertical scroll as the primary narrative driver on mobile.
*   **Thumb-Friendly Ergonomics:** Keep critical interactive elements (CTAs, navigation) in the lower half of the screen.
*   **Clear Touch Affordances:** Ensure 3D objects clearly communicate that they are interactive (e.g., subtle auto-rotation to hint at swipeability). Never rely on hover states for critical actions.

---

## 8. Synthesis — Design Vocabulary

To deliver a memorable, "Marvel movie" experience for VECTORS 2026:

*   **Color:** Charcoal/True Black base. Metallic Green (Doomsday motif) primary accent. Warm/Crimson secondary accent for warnings or specific high-stakes events.
*   **Materials:** Dark steel, brushed metal, concrete, subtle glass. High texture, low gloss.
*   **Typography:** Monumental, cinematic display font for headers; monospaced or highly legible technical font for data/details.
*   **Composition:** Deep Z-axis. Foreground elements framing a monumental midground subject.
*   **Motion:** Scroll-scrubbed, weighty, and deliberate. Nothing moves just to move.
*   **Interaction:** Touch-first on mobile, cursor-aware on desktop. Immersive but fundamentally functional.

---

## 9. Anti-Patterns (What to Avoid)

*   **"Cyberpunk Starter Pack":** Avoid excessive neon pinks/blues, random floating cubes, and generic glowing grids.
*   **Robotic Animation:** Avoid `toggleActions` that trigger long animations regardless of scroll speed. Do not animate every single element on the page.
*   **Desktop-Only Thinking:** Avoid complex drag-and-drop or hover-dependent navigation that breaks on mobile.
*   **Template Grids:** Avoid standard 3-column card layouts for event browsing.

---

## 10. Open Questions for Concept Phase

*   *Will the college logo need to be displayed prominently in the hero, or can it be treated as a subtle watermark?*
*   *Are there specific monumental structures on the college campus that could be abstracted into the 3D Latverian/Doomsday architectural style?*
