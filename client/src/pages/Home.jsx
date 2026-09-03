import { Link } from 'react-router-dom'

/**
 * Home Page — The Hero Sequence.
 * Phase 7: Functional scaffold. Cinematic 3D polish added in Phase 9.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
      {/* Hero Section */}
      <section id="hero" className="flex flex-col items-center text-center gap-8 max-w-2xl">
        {/* Placeholder for the Astrolabe 3D element (Phase 9) */}
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-brass/40 flex items-center justify-center bg-iron/30">
          <span className="font-mono text-steel text-sm">[Astrolabe 3D — Phase 9]</span>
        </div>

        {/* Wordmark */}
        <h1 className="font-display text-5xl md:text-7xl tracking-widest text-bone">
          VECTORS 2026
        </h1>
        <p className="font-mono text-steel text-sm md:text-base tracking-wide">
          A Technical Odyssey // Discover, Build, Innovate
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
          <Link
            to="/entry-registration"
            id="cta-entry-pass"
            className="flex-1 py-4 px-8 text-center font-display text-lg tracking-widest uppercase bg-emerald text-charcoal hover:bg-emerald-dim transition-colors duration-300"
          >
            Get Entry Pass
          </Link>
          <Link
            to="/events"
            id="cta-explore-events"
            className="flex-1 py-4 px-8 text-center font-display text-lg tracking-widest uppercase border-2 border-brass text-brass hover:bg-brass hover:text-charcoal transition-colors duration-300"
          >
            Explore Events
          </Link>
        </div>
      </section>
    </div>
  )
}
