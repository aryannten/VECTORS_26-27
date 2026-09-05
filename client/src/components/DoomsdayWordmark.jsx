import React from 'react'

/**
 * DoomsdayWordmark — VECTORS 26 "Doomsday Protocol" Emblem
 * 
 * Features:
 * - Monumental brushed chrome gradient typography ("VECTORS")
 * - Faint Latverian throne-room Gothic ogival stained-glass arch framework
 * - Jagged Avengers crimson fracture lines splitting the letterforms
 * - Soft radioactive Doom emerald energy bleed pulsing through the cracks
 * - "BUILD // 26.0" offset tech-fest mono telemetry badge
 * - "BEYOND LOGIC" imperial decree subtitle
 */
export default function DoomsdayWordmark({ className = '' }) {
  return (
    <div className={`relative w-full max-w-[620px] mx-auto flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 800 370"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto overflow-visible"
        aria-label="VECTORS 26 — Doomsday Protocol"
      >
        <defs>
          {/* Brushed Chrome / Silver Gradient */}
          <linearGradient id="chromeGradient" x1="0%" y1="15%" x2="100%" y2="85%">
            <stop offset="0%" stopColor="#C7CCD1" />
            <stop offset="20%" stopColor="#FFFFFF" />
            <stop offset="42%" stopColor="#8A909B" />
            <stop offset="55%" stopColor="#5C6270" />
            <stop offset="75%" stopColor="#C7CCD1" />
            <stop offset="88%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#5C6270" />
          </linearGradient>

          {/* Chrome Stroke Gradient for letter bevel */}
          <linearGradient id="chromeStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#5C6270" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#171A1E" stopOpacity="0.9" />
          </linearGradient>

          {/* Crimson Core Gradient */}
          <linearGradient id="crimsonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B0000" />
            <stop offset="50%" stopColor="#C21807" />
            <stop offset="100%" stopColor="#FF2A14" />
          </linearGradient>

          {/* Doom Emerald Energy Bleed Filter */}
          <filter id="emeraldGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="14" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Arch Ambient Emerald Glow Filter */}
          <radialGradient id="archBacklight" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#1EFFA0" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#0B7A4E" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#0A0C0E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ====================================================
            1. LATVERIAN OGIVAL / GOTHIC STAINED GLASS ARCH
            ==================================================== */}
        <g className="opacity-70">
          {/* Subtle central radiance */}
          <ellipse cx="400" cy="180" rx="260" ry="150" fill="url(#archBacklight)" />

          {/* Outer Gothic Pointed Arch */}
          <path
            d="M 180 340 L 180 200 A 260 260 0 0 1 400 30 A 260 260 0 0 1 620 200 L 620 340"
            stroke="#1EFFA0"
            strokeWidth="1.2"
            strokeOpacity="0.22"
            strokeDasharray="4 2"
          />

          {/* Secondary Inset Arch */}
          <path
            d="M 215 340 L 215 205 A 220 220 0 0 1 400 68 A 220 220 0 0 1 585 205 L 585 340"
            stroke="#1EFFA0"
            strokeWidth="0.8"
            strokeOpacity="0.16"
          />

          {/* Third Inset Arch */}
          <path
            d="M 250 340 L 250 210 A 180 180 0 0 1 400 102 A 180 180 0 0 1 550 210 L 550 340"
            stroke="#5C6270"
            strokeWidth="0.8"
            strokeOpacity="0.28"
          />

          {/* Gothic Window Tracery / Mullions */}
          {/* Center vertical mullion */}
          <line x1="400" y1="135" x2="400" y2="340" stroke="#1EFFA0" strokeWidth="0.8" strokeOpacity="0.14" />
          {/* Left sub-arch */}
          <path
            d="M 285 340 L 285 235 A 80 80 0 0 1 400 170"
            stroke="#1EFFA0"
            strokeWidth="0.8"
            strokeOpacity="0.12"
          />
          {/* Right sub-arch */}
          <path
            d="M 515 340 L 515 235 A 80 80 0 0 0 400 170"
            stroke="#1EFFA0"
            strokeWidth="0.8"
            strokeOpacity="0.12"
          />

          {/* Top Gothic Trefoil / Rosette Ring */}
          <circle cx="400" cy="118" r="22" stroke="#1EFFA0" strokeWidth="0.9" strokeOpacity="0.22" />
          <circle cx="400" cy="118" r="8" stroke="#5C6270" strokeWidth="0.7" strokeOpacity="0.3" />
          <circle cx="388" cy="126" r="6" stroke="#1EFFA0" strokeWidth="0.6" strokeOpacity="0.18" />
          <circle cx="412" cy="126" r="6" stroke="#1EFFA0" strokeWidth="0.6" strokeOpacity="0.18" />
          <circle cx="400" cy="106" r="6" stroke="#1EFFA0" strokeWidth="0.6" strokeOpacity="0.18" />

          {/* Corner tick marks & mechanical datum lines */}
          <line x1="160" y1="340" x2="640" y2="340" stroke="#5C6270" strokeWidth="0.8" strokeOpacity="0.35" />
          <line x1="160" y1="336" x2="160" y2="344" stroke="#1EFFA0" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="640" y1="336" x2="640" y2="344" stroke="#1EFFA0" strokeWidth="1" strokeOpacity="0.4" />
        </g>

        {/* ====================================================
            2. IMPERIAL DECREE SUBTITLE ("BEYOND LOGIC")
            ==================================================== */}
        <text
          x="400"
          y="156"
          textAnchor="middle"
          fill="#C7CCD1"
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 600,
            fontSize: '13px',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            opacity: 0.85
          }}
        >
          — BEYOND LOGIC —
        </text>

        {/* ====================================================
            3. MAIN "VECTORS" WORDMARK (BRUSHED CHROME)
            ==================================================== */}
        <g id="vectors-wordmark">
          {/* Ambient drop shadow */}
          <text
            x="400"
            y="244"
            textAnchor="middle"
            fill="#0A0C0E"
            opacity="0.9"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: '84px',
              letterSpacing: '0.14em',
            }}
          >
            VECTORS
          </text>

          {/* Base Chrome Fill */}
          <text
            x="400"
            y="240"
            textAnchor="middle"
            fill="url(#chromeGradient)"
            stroke="url(#chromeStroke)"
            strokeWidth="0.75"
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: '84px',
              letterSpacing: '0.14em',
              filter: 'drop-shadow(0 4px 18px rgba(0,0,0,0.9))',
            }}
          >
            VECTORS
          </text>
        </g>

        {/* ====================================================
            4. FRACTURE SYSTEM: EMERALD ENERGY BLEED & CRIMSON CRACKS
            ==================================================== */}
        {/* Soft emerald energy bleeding out of the cracks */}
        <g className="doom-crack-glow" filter="url(#emeraldGlowFilter)">
          {/* Crack Line 1: Primary fracture across V - E - C */}
          <path
            d="M 175 228 L 222 214 L 246 226 L 285 204 L 325 218 L 358 196 L 392 215"
            stroke="#1EFFA0"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="bevel"
            opacity="0.85"
          />
          {/* Micro branching bleed */}
          <path
            d="M 246 226 L 260 248"
            stroke="#1EFFA0"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 325 218 L 334 238"
            stroke="#1EFFA0"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Crack Line 2: Secondary fracture across T - O - R - S */}
          <path
            d="M 405 216 L 438 198 L 476 222 L 515 206 L 554 228 L 592 212 L 625 230"
            stroke="#1EFFA0"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="bevel"
            opacity="0.85"
          />
          {/* Micro branching bleed */}
          <path
            d="M 476 222 L 490 246"
            stroke="#1EFFA0"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M 554 228 L 568 250"
            stroke="#1EFFA0"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>

        {/* Physical Fracture Void (Dark Seam cutting the letterforms) */}
        <path
          d="M 175 228 L 222 214 L 246 226 L 285 204 L 325 218 L 358 196 L 392 215"
          stroke="#0A0C0E"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="bevel"
        />
        <path
          d="M 246 226 L 260 248"
          stroke="#0A0C0E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 405 216 L 438 198 L 476 222 L 515 206 L 554 228 L 592 212 L 625 230"
          stroke="#0A0C0E"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="bevel"
        />
        <path
          d="M 476 222 L 490 246"
          stroke="#0A0C0E"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Avengers Crimson Fracture Core (The Split) */}
        <path
          d="M 175 228 L 222 214 L 246 226 L 285 204 L 325 218 L 358 196 L 392 215"
          stroke="url(#crimsonGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="bevel"
        />
        <path
          d="M 246 226 L 260 248"
          stroke="#C21807"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 325 218 L 334 238"
          stroke="#C21807"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        <path
          d="M 405 216 L 438 198 L 476 222 L 515 206 L 554 228 L 592 212 L 625 230"
          stroke="url(#crimsonGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="bevel"
        />
        <path
          d="M 476 222 L 490 246"
          stroke="#C21807"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M 554 228 L 568 250"
          stroke="#C21807"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* High-energy white/emerald crack sparkle nodes */}
        <circle cx="285" cy="204" r="2" fill="#FFFFFF" opacity="0.9" />
        <circle cx="358" cy="196" r="2.5" fill="#1EFFA0" opacity="0.95" />
        <circle cx="438" cy="198" r="2.5" fill="#1EFFA0" opacity="0.95" />
        <circle cx="515" cy="206" r="2" fill="#FFFFFF" opacity="0.9" />

        {/* ====================================================
            5. BUILD NUMBER & PROTOCOL TELEMETRY BADGE
            ==================================================== */}
        <g transform="translate(400, 292)">
          {/* Telemetry pill */}
          <rect
            x="-95"
            y="-14"
            width="190"
            height="26"
            rx="3"
            fill="#171A1E"
            stroke="rgba(30, 255, 160, 0.4)"
            strokeWidth="1"
          />
          {/* Active status pip with glowing halo */}
          <circle cx="-76" cy="-1" r="5" fill="#1EFFA0" opacity="0.25" />
          <circle cx="-76" cy="-1" r="2.5" fill="#1EFFA0" />

          {/* Telemetry build readout */}
          <text
            x="-62"
            y="3"
            fill="#EDEFF1"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.16em',
            }}
          >
            BUILD // 26.0
          </text>

          {/* Right indicator code */}
          <text
            x="64"
            y="3"
            fill="#8A909B"
            textAnchor="end"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 500,
              fontSize: '9.5px',
              letterSpacing: '0.12em',
            }}
          >
            SYS.ACT
          </text>
        </g>
      </svg>
    </div>
  )
}
