# VECTORS 2026 — Asset Manifest

> This document tracks every required external or generated asset.  
> **Art Direction:** The Monolithic Engine (Brutalist Architecture + Arcane Machinery).

## Status Legend

| Status | Meaning |
|--------|---------|
| REQUIRED | Asset identified as needed, not yet created |
| IN PROGRESS | Asset generation/creation underway |
| READY | Asset created and quality-checked |
| IMPLEMENTED | Asset integrated into the codebase |
| REPLACE | Asset exists but needs replacement (e.g. placeholder) |
| OPTIONAL | Nice-to-have, not blocking |

---

## 1. Logos & Branding

```text
Asset ID: LOGO-01
Asset Name: VECTORS 2026 Wordmark
Type: 2D Graphic (SVG / Transparent PNG)
Status: REPLACE (Using old logo temporarily)
Required For: Hero sequence, Navigation, QR Pass
Dimensions: Vector (or 1000x300 min)
Aspect Ratio: Flexible (Wide preferred)
File Format: .svg or .png
Visual Description: The official VECTORS text.
Implementation Location: <Header />, <Hero />, <QRPass />
Notes: The user will provide the old logo as a placeholder. Once the new one is ready, it must match the "monumental serif / metallic" art direction.
```

## 2. 3D & Environmental Assets

```text
Asset ID: 3D-01
Asset Name: The Astrolabe Core
Type: 3D Model / WebGL Element
Status: REQUIRED
Required For: Hero Sequence
Dimensions: N/A
File Format: .glb or .gltf (draco compressed)
Visual Description: Intricate, interlocking brass and dark iron mechanical rings. Features glowing green arcane runes etched into the metal.
Implementation Location: <HeroScene /> (Three.js canvas)
Notes: Must be heavily optimized for mobile. Rotate slowly on scroll.
```

```text
Asset ID: TEX-01
Asset Name: Brutalist Concrete Wall
Type: Seamless Texture (Color, Normal, Roughness)
Status: REQUIRED
Required For: Background Environment
Dimensions: 2048x2048
File Format: .jpg / .webp
Visual Description: Dark, monolithic, heavily weathered concrete.
Implementation Location: Global background or 3D wall plane.
```

## 3. Event Imagery (AI Generation Prompts)

The user will generate these assets. Below are the strict prompt templates to ensure they match the art direction and don't look like generic AI slop.

### 3.1 Technical Event Hero (e.g. Hackathon)

```text
Asset ID: IMG-TECH-01
Asset Name: Hackathon Vault Image
Type: 2D Image
Status: REQUIRED
Required For: Event Detail Page / Vault Carousel
Dimensions: 1080x1920 (Mobile vertical crop) and 1920x1080 (Desktop)
Aspect Ratio: 9:16 and 16:9 versions needed
File Format: .webp
Visual Description: Cinematic shot of arcane technology.
Implementation Location: <EventVault /> component.

Generation Prompt:
ASSET: Hackathon Event Visual
PURPOSE: Background image for an event detail page.
STYLE: Cinematic sci-fi, dark, monumental, Avengers Doomsday style.
SUBJECT: A complex, dark iron mechanical core glowing with intense emerald green energy.
COMPOSITION: Centralized focal point, heavy shadows on the edges.
CAMERA: 35mm lens, slight low angle, cinematic depth of field.
LIGHTING: Hard directional light, volumetric fog, glowing green practical lights.
MATERIAL: Rusted iron, tarnished brass, dark concrete.
COLOR: Deep charcoal base, bright toxic green accents.
BACKGROUND: Cavernous brutalist architecture.
MOOD: Tense, intellectual, high-stakes.
ASPECT RATIO: 16:9
```

### 3.2 Non-Technical Event Hero (e.g. Cultural / Gaming)

```text
Asset ID: IMG-NONTECH-01
Asset Name: Gaming/Cultural Event Visual
Type: 2D Image
Status: REQUIRED
Required For: Event Detail Page / Vault Carousel
Dimensions: 1080x1920 (Mobile vertical crop) and 1920x1080 (Desktop)
Aspect Ratio: 9:16 and 16:9 versions needed
File Format: .webp
Visual Description: Cinematic shot fitting the theme but distinct from heavy machinery.
Implementation Location: <EventVault /> component.

Generation Prompt:
ASSET: Gaming Event Visual
PURPOSE: Background image for a non-technical event detail page.
STYLE: Cinematic sci-fi, dark, monumental.
SUBJECT: A glowing, abstract holographic arena floating above a dark metallic pedestal.
COMPOSITION: Wide, deep background.
CAMERA: 50mm lens, eye-level, cinematic framing.
LIGHTING: Striking crimson and amber rim lighting cutting through darkness.
MATERIAL: Obsidian glass, dark steel, holographic light.
COLOR: Pitch black base, crimson and tarnished brass accents.
BACKGROUND: Dark void with subtle smoke.
MOOD: Energetic, dangerous, competitive.
ASPECT RATIO: 16:9
```

## 4. UI Icons & Utilities

```text
Asset ID: ICON-01
Asset Name: Mechanical Icon Set
Type: 2D Vector Icons
Status: REQUIRED
Required For: Navigation, UI Controls, Event Details
Dimensions: 24x24 / 48x48
File Format: .svg (React components)
Visual Description: Sharp, structural icons. The menu toggle should look like an interlocking gear or heavy mechanical switch.
Implementation Location: Various UI components.
Notes: Will use an existing library (e.g., Lucide or Phosphor) but strictly styled with `#B89C49` (Tarnished Brass) and sharp strokes.
```

---

*Last updated: 2026-09-04*
