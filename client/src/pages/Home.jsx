import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Ferrofluid from '../components/ui/Ferrofluid'
import DoomsdayWordmark from '../components/DoomsdayWordmark'

/**
 * Home — VECTORS 26 "Doomsday Protocol" Portal
 * 
 * Features:
 * - Interactive <Ferrofluid /> magnetic liquid metal background (React Bits)
 * - Fractured VECTORS 26 mark in brushed chrome with crimson cracks & emerald bleed
 * - Gothic Latverian ogival stained-glass arch framework
 * - Refined typography hierarchy: Inter body copy, Cinzel decrees, Space Mono UI
 * - Armor-plated primary CTA with 45° clipped corners & light surge sweep
 * - Ghost secondary CTA with animated arrow & expanding emerald energy underline
 */
export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Orchestrated entrance sequence
  const seq = {
    logo: {
      initial: { opacity: 0, scale: 0.95, y: -8 },
      animate: { opacity: 1, scale: 1, y: 0 },
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
    },
    text: {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, delay: 0.45, ease: 'easeOut' }
    },
    cta: {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.7, delay: 0.85, ease: 'easeOut' }
    },
  }

  const handleEntryPass = () => {
    if (user) {
      navigate('/entry-registration')
    } else {
      navigate('/login', { state: { from: { pathname: '/entry-registration' } } })
    }
  }

  const handleExploreEvents = () => {
    if (user) {
      navigate('/events')
    } else {
      navigate('/login', { state: { from: { pathname: '/events' } } })
    }
  }

  return (
    <div className="relative min-h-screen bg-doom-bg overflow-hidden flex flex-col">

      {/* === FERROFLUID INTERACTIVE LIQUID METAL BACKGROUND === */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Ferrofluid
          colors={["#cccccc", "#196c2d", "#757373"]}
          speed={0.5}
          scale={1}
          turbulence={1}
          fluidity={0.1}
          rimWidth={0.2}
          sharpness={3}
          shimmer={1}
          glow={2}
          flowDirection="down"
          opacity={0.88}
          mouseInteraction={true}
          mouseStrength={1}
          mouseRadius={0.3}
        />
      </div>

      {/* Environmental vignette: Gunmetal depth blending */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 75% 65% at 50% 40%, rgba(10,12,14,0.15) 0%, rgba(10,12,14,0.75) 60%, #0A0C0E 100%)'
        }}
      />

      {/* Atmospheric Doom emerald underglow */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse 60% 45% at 50% 32%, rgba(30,255,160,0.06) 0%, rgba(11,122,78,0.03) 50%, transparent 75%)'
        }}
      />

      {/* Architectural subtle vertical edge seams */}
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.04] to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.04] to-transparent pointer-events-none" />

      {/* Top and bottom fade masks */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-doom-bg to-transparent z-10 pointer-events-none" />

      {/* === SCENE CONTENT === */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 min-h-screen">

        {/* 1. FRACTURED WORDMARK & OGIVAL ARCH EMBLEM */}
        <motion.div {...seq.logo} className="w-full max-w-xl flex justify-center mb-4 sm:mb-6">
          <DoomsdayWordmark />
        </motion.div>

        {/* 2. NARRATIVE TEXT (Inter geometric sans for body, Cinzel for Latverian decrees) */}
        <motion.div {...seq.text} className="max-w-xl mx-auto text-center space-y-4 sm:space-y-5 px-2">
          
          {/* Lead paragraph: clean Inter geometric sans */}
          <p className="font-body text-sm sm:text-base text-text-primary/95 leading-relaxed font-normal">
            The world is changing.<br />
            Technology is evolving.<br />
            And the next generation is being called.
          </p>

          {/* Core statement */}
          <p className="font-body text-sm sm:text-base text-text-primary/95 leading-relaxed">
            <strong className="font-display font-bold text-base sm:text-lg tracking-wider text-chrome-light">VECTORS</strong> is where minds collide, machines awaken, and ideas become reality.
          </p>

          {/* Pillars statement */}
          <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
            From <span className="text-text-primary font-medium">robotics and coding</span> to <span className="text-text-primary font-medium">hackathons and futuristic challenges</span>, every battle demands skill, strategy, and innovation.
          </p>

          {/* Latverian decree + final callout in Cinzel */}
          <div className="pt-2 sm:pt-3 space-y-2">
            <p className="font-accent text-xs sm:text-sm font-semibold tracking-[0.25em] text-chrome-light uppercase">
              The arena is set.<br />
              The challenge awaits.
            </p>
            <p className="font-accent text-sm sm:text-base font-bold tracking-[0.22em] uppercase text-doom-glow drop-shadow-[0_0_15px_rgba(30,255,160,0.5)]">
              Will you answer the call?
            </p>
          </div>
        </motion.div>

        {/* 3. GATEWAY CTAs */}
        <motion.div {...seq.cta} className="mt-8 sm:mt-10 md:mt-12 w-full max-w-sm flex flex-col items-center gap-3">
          
          {/* Primary Armor-Plated Button */}
          <button
            onClick={handleEntryPass}
            className="doom-btn-primary w-full"
            aria-label="Get Entry Pass"
          >
            <span className="doom-btn-primary-inner">
              Get Entry Pass
            </span>
          </button>

          {/* Secondary Ghost Button */}
          <button
            onClick={handleExploreEvents}
            className="doom-btn-ghost w-full"
            aria-label="Explore Events"
          >
            <span>Explore Events</span>
            <ArrowRight size={14} className="ghost-arrow text-doom-glow shrink-0" />
          </button>
        </motion.div>
      </main>

      {/* === SUBTLE GROUND FOG === */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to top, rgba(10,12,14,0.95) 0%, rgba(10,12,14,0.4) 50%, transparent 100%)'
        }}
      />
    </div>
  )
}
