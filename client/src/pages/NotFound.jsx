import { Link } from 'react-router-dom'

/**
 * 404 — Not Found page with FaultyTerminal background.
 */
export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 text-center overflow-hidden bg-transparent">

      {/* Foreground Alert Card */}
      <div className="relative z-10 p-6 sm:p-10 border border-brass-dim/30 bg-charcoal/85 backdrop-blur-md max-w-md w-full shadow-2xl">
        <div className="font-mono text-[10px] tracking-[0.25em] text-brass uppercase mb-2">
          // SYSTEM ANOMALY
        </div>
        <h1 className="font-display text-5xl sm:text-6xl text-crimson tracking-widest font-bold">404</h1>
        <p className="font-mono text-steel text-sm mt-4 tracking-wider uppercase">
          Sector Not Found // Corrupted Vault Coordinate
        </p>
        <Link
          to="/"
          className="inline-block mt-8 py-3 px-8 font-display text-xs tracking-[0.2em] uppercase border border-brass text-brass hover:bg-brass hover:text-charcoal transition-colors duration-300"
        >
          Return to Monolith
        </Link>
      </div>
    </div>
  )
}
