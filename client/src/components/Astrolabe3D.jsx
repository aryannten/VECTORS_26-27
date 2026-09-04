/**
 * CinematicBackground — Replaces the broken WebGL Astrolabe.
 * Pure CSS animated background with floating gradient orbs and geometric grids.
 * Reliable, performant, and premium-looking across all devices.
 */
export default function CinematicBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030806] via-[#0a0a0a] to-[#0d0907]" />

      {/* Floating Orbs — soft ambient light sources */}
      <div className="orb orb-emerald" />
      <div className="orb orb-brass" />
      <div className="orb orb-emerald-secondary" />

      {/* Geometric Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Diagonal accent lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="100%" x2="100%" y2="0" stroke="#d4af37" strokeWidth="0.5" />
        <line x1="20%" y1="100%" x2="100%" y2="20%" stroke="#00FF66" strokeWidth="0.3" />
        <line x1="0" y1="60%" x2="60%" y2="0" stroke="#d4af37" strokeWidth="0.3" />
      </svg>

      {/* Vignette */}
      <div className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </div>
  )
}
