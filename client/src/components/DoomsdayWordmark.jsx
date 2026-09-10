import React from 'react'

/**
 * DoomsdayWordmark — VECTORS 26 "Doomsday Protocol" Emblem
 * Rendered using the official vector26-logo.svg asset.
 */
export default function DoomsdayWordmark({ className = '' }) {
  return (
    <div className={`relative w-full max-w-[640px] mx-auto flex flex-col items-center select-none ${className}`}>
      <img
        src="/vector26-logo.svg"
        alt="VECTORS 26 — Doomsday Protocol"
        className="w-full h-auto object-contain mix-blend-screen drop-shadow-[0_0_35px_rgba(30,255,160,0.25)] transition-all duration-500 hover:drop-shadow-[0_0_50px_rgba(30,255,160,0.45)]"
      />
    </div>
  )
}
