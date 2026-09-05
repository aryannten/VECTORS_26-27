import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import FaultyTerminal from '../components/ui/FaultyTerminal'

/**
 * Home — The VECTORS 26 Portal.
 * Features the signature Beyond Logic VECTORS 26 logo, lore narrative, and gateway CTAs.
 */
export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Orchestrated entrance sequence
  const seq = {
    logo: { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
    text: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: 0.5, ease: 'easeOut' } },
    cta:  { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 1.0, ease: 'easeOut' } },
  }

  /**
   * Gate CTA buttons behind auth — if not logged in, redirect to /login.
   */
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
    <div className="relative min-h-screen bg-charcoal overflow-hidden flex flex-col">

      {/* === FAULTY TERMINAL BACKGROUND === */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={1}
          pause={false}
          scanlineIntensity={1}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0}
          tint="#2F5D3A"
          mouseReact={true}
          mouseStrength={0.5}
          pageLoadAnimation={false}
          brightness={1}
        />
      </div>

      {/* Atmospheric vignette blending terminal with monolithic architecture */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.65) 60%, rgba(10,10,10,0.94) 100%)'
        }}
      />

      {/* Atmospheric crimson backlight glow behind the logo */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 32%, rgba(220,38,38,0.12) 0%, rgba(184,156,73,0.04) 50%, transparent 75%)'
        }}
      />

      {/* Architectural edge frame */}
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />

      {/* Upper darkness */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-charcoal to-transparent z-10" />

      {/* === SCENE CONTENT === */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-16 min-h-screen">

        {/* LOGO — BEYOND LOGIC / VECTORS 26 */}
        <motion.div {...seq.logo} className="w-full max-w-xl flex justify-center mb-6 sm:mb-8">
          <img
            src="/vectors-logo.png"
            alt="VECTORS 26 — Beyond Logic"
            className="w-full max-w-[320px] xs:max-w-[400px] sm:max-w-[480px] md:max-w-[540px] h-auto object-contain drop-shadow-[0_0_40px_rgba(220,38,38,0.35)] select-none"
          />
        </motion.div>

        {/* NARRATIVE TEXT */}
        <motion.div {...seq.text} className="max-w-xl mx-auto text-center space-y-4 sm:space-y-5 px-2">
          <p className="font-mono text-xs sm:text-sm text-steel/90 tracking-wider leading-relaxed">
            The world is changing.<br />
            Technology is evolving.<br />
            And the next generation is being called.
          </p>

          <p className="font-mono text-xs sm:text-sm text-steel/90 tracking-wider leading-relaxed">
            <strong className="text-crimson font-bold">VECTORS</strong> is where minds collide, machines awaken, and ideas become reality.
          </p>

          <p className="font-mono text-xs sm:text-sm text-steel/90 tracking-wider leading-relaxed">
            From <strong className="text-bone font-semibold">robotics and coding</strong> to <strong className="text-bone font-semibold">hackathons and futuristic challenges</strong>, every battle demands skill, strategy, and innovation.
          </p>

          <div className="font-mono text-xs sm:text-sm tracking-widest uppercase font-bold leading-relaxed pt-2 text-brass">
            The arena is set.<br />
            The challenge awaits.<br />
            <span className="text-emerald drop-shadow-[0_0_12px_rgba(0,255,102,0.4)]">Will you answer the call?</span>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div {...seq.cta} className="mt-8 sm:mt-10 md:mt-12 w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={handleEntryPass}
            className="w-full py-4 text-center font-mono text-xs tracking-[0.2em] uppercase text-charcoal bg-emerald hover:bg-emerald-dim transition-colors cursor-pointer"
          >
            {user ? 'Get Entry Pass' : 'Sign In → Get Entry Pass'}
          </button>
          <button
            onClick={handleExploreEvents}
            className="w-full py-4 text-center font-mono text-xs tracking-[0.2em] uppercase text-steel border border-white/[0.08] hover:border-white/[0.15] hover:text-bone transition-all bg-white/[0.02] cursor-pointer"
          >
            {user ? 'Explore Events' : 'Sign In → Explore Events'}
          </button>
        </motion.div>
      </div>

      {/* === GROUND FOG === */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 50%, transparent 100%)'
        }}
      />
    </div>
  )
}
