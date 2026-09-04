import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * AstrolabeCore — The focal mechanical object of the VECTORS world.
 * 
 * Built with layered SVG to suggest mechanical depth.
 * Each ring is a distinct structural element with its own rotation speed,
 * material suggestion (stroke gradient), and segmentation.
 * 
 * NOTE: This is a CSS/SVG placeholder. If it does not achieve convincing
 * mechanical depth at review, it should be replaced with a proper 3D or
 * illustrated asset in the next phase. Do not pile on more CSS effects
 * to compensate.
 */
function AstrolabeCore() {
  return (
    <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px]">
      {/* Ring 1 — Outermost. Heavy iron. Slow rotation. */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))' }}
      >
        {/* Segmented outer ring — dark iron with structural gaps */}
        <circle cx="200" cy="200" r="190" fill="none" stroke="#1a1d21" strokeWidth="6"
          strokeDasharray="40 8 80 8 40 8 80 8" strokeLinecap="butt" />
        {/* Rivet marks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
          const rad = (angle * Math.PI) / 180
          const x = 200 + 190 * Math.cos(rad)
          const y = 200 + 190 * Math.sin(rad)
          return <circle key={angle} cx={x} cy={y} r="2" fill="#7a652a" />
        })}
      </motion.svg>

      {/* Ring 2 — Counter-rotating. Tarnished brass. Thinner, segmented. */}
      <motion.svg
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
      >
        <circle cx="200" cy="200" r="160" fill="none" stroke="#b89c49" strokeWidth="1.5"
          strokeDasharray="30 20" opacity="0.5" />
        <circle cx="200" cy="200" r="155" fill="none" stroke="#2a2e33" strokeWidth="3"
          strokeDasharray="15 5 45 5" strokeLinecap="butt" />
      </motion.svg>

      {/* Ring 3 — Inner structural ring. Very slow. Dark bronze. */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
      >
        <circle cx="200" cy="200" r="120" fill="none" stroke="#231c17" strokeWidth="8"
          strokeDasharray="25 4 60 4 25 4" />
        {/* Cross-hair structural lines */}
        <line x1="200" y1="72" x2="200" y2="88" stroke="#7a652a" strokeWidth="1" opacity="0.4" />
        <line x1="200" y1="312" x2="200" y2="328" stroke="#7a652a" strokeWidth="1" opacity="0.4" />
        <line x1="72" y1="200" x2="88" y2="200" stroke="#7a652a" strokeWidth="1" opacity="0.4" />
        <line x1="312" y1="200" x2="328" y2="200" stroke="#7a652a" strokeWidth="1" opacity="0.4" />
      </motion.svg>

      {/* Ring 4 — Innermost mechanical ring. Counter-rotating. */}
      <motion.svg
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
      >
        <circle cx="200" cy="200" r="80" fill="none" stroke="#1a1d21" strokeWidth="4"
          strokeDasharray="12 6" />
        <circle cx="200" cy="200" r="76" fill="none" stroke="#b89c49" strokeWidth="0.5" opacity="0.3" />
      </motion.svg>

      {/* The Core — emerald energy source. This is the light origin. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Core glow — the light source of the scene */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald/80"
            style={{
              boxShadow: '0 0 20px rgba(0,255,102,0.6), 0 0 60px rgba(0,255,102,0.3), 0 0 120px rgba(0,255,102,0.1)'
            }}
          />
          {/* Inner bright point */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/90" />
          </div>
        </div>
      </div>
    </div>
  )
}


/**
 * Home — The exterior of the Monolith.
 * 
 * The user stands before the massive wall. The Astrolabe Core is embedded
 * in the structure. The VECTORS wordmark is carved into the architecture.
 * The emerald core is the primary light source of the scene.
 * 
 * Composition (bottom to top):
 *   Ground fog → Architectural base → CTAs → Wordmark → Astrolabe → Upper wall
 * 
 * On mobile, this reads naturally as a tall vertical structure.
 */
export default function Home() {
  const navigate = useNavigate()

  // Orchestrated entrance sequence
  const seq = {
    core:  { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 2, ease: [0.16, 1, 0.3, 1] } },
    title: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1.5, delay: 0.8, ease: 'easeOut' } },
    sub:   { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1, delay: 1.6, ease: 'easeOut' } },
    cta:   { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 2.2, ease: 'easeOut' } },
  }

  return (
    <div className="relative min-h-screen bg-charcoal overflow-hidden flex flex-col">

      {/* === THE WALL === 
          Dark architectural surface. Not a gradient background—a physical wall
          with subtle material variation suggesting concrete/iron. */}
      <div className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 40%, #141311 0%, #0a0a0a 100%)
          `
        }}
      />

      {/* Light cast by the Astrolabe Core onto the wall behind it.
          This is not decorative—it's the reflected illumination from the core. */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 40% 35% at 50% 38%, rgba(0,255,102,0.04) 0%, transparent 70%)'
        }}
      />

      {/* === ARCHITECTURAL FRAME ===
          Vertical pillars at the edges suggesting the viewport is an opening
          in the wall. Creates depth without decorative borders. */}
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />

      {/* Upper darkness — the wall extends above the Astrolabe */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-charcoal to-transparent z-10" />


      {/* === SCENE CONTENT === */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-8 min-h-screen">

        {/* FOCAL OBJECT — The Astrolabe Core */}
        <motion.div {...seq.core} className="mb-10 md:mb-14">
          <AstrolabeCore />
        </motion.div>

        {/* VECTORS IDENTITY — Not just large text. 
            The wordmark is architectural: wide tracking, monumental weight,
            positioned as if carved into the wall below the Astrolabe. */}
        <motion.div {...seq.title} className="text-center">
          <h1 className="font-display text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.15em] sm:tracking-[0.2em] text-bone leading-[0.9] uppercase"
            style={{ textShadow: '0 2px 30px rgba(0,0,0,0.8)' }}
          >
            VECTORS
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-8 bg-brass-dim/40" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-brass-dim uppercase">2 0 2 6</span>
            <div className="h-px w-8 bg-brass-dim/40" />
          </div>
        </motion.div>

        {/* Tagline — technical readout beneath the identity */}
        <motion.p {...seq.sub}
          className="font-mono text-[10px] sm:text-xs tracking-[0.15em] text-steel/60 mt-6 text-center"
        >
          A Technical Odyssey
        </motion.p>

        {/* CTAs — Positioned at the base of the composition.
            Full-width on mobile for thumb reach. Not decorative. */}
        <motion.div {...seq.cta} className="mt-12 md:mt-16 w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={() => navigate('/entry-registration')}
            className="w-full py-4 text-center font-mono text-xs tracking-[0.2em] uppercase text-charcoal bg-emerald hover:bg-emerald-dim transition-colors"
          >
            Get Entry Pass
          </button>
          <button
            onClick={() => navigate('/events')}
            className="w-full py-4 text-center font-mono text-xs tracking-[0.2em] uppercase text-steel border border-white/[0.08] hover:border-white/[0.15] hover:text-bone transition-all bg-white/[0.02]"
          >
            Explore Events
          </button>
        </motion.div>
      </div>

      {/* === GROUND FOG ===
          Atmospheric haze at the base. Suggests physical space, 
          illuminated slightly by the downward light of the Astrolabe. */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 50%, transparent 100%)'
        }}
      />
    </div>
  )
}
