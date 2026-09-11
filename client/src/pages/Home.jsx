import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  Cpu, 
  Gamepad2, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  Sparkles, 
  Flame, 
  Award, 
  Users, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Ferrofluid from '../components/ui/Ferrofluid'

/**
 * Home — VECTORS 26–27 Official Portal
 * Complete experience: Hero + About + Pillars + Events Showcase +
 * Entry Pass Callout + FAQ + Footer.
 */
export default function Home() {
  const navigate = useNavigate()
  const { user, hasPass } = useAuth()
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const handleEntryPass = () => {
    if (user) {
      navigate(hasPass ? '/my-pass' : '/entry-registration')
    } else {
      navigate('/login')
    }
  }

  const handleExploreEvents = () => {
    if (user) {
      navigate('/events')
    } else {
      navigate('/login')
    }
  }

  // Hero animations
  const seq = {
    text: {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, delay: 0.15, ease: 'easeOut' }
    },
    cta: {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.7, delay: 0.45, ease: 'easeOut' }
    },
  }

  const pillars = [
    {
      title: 'Full-Stack & AI Innovation',
      desc: '24-hour sprint designing, building, and deploying real-world solutions under high pressure.',
      icon: Cpu,
      tag: 'CSE / IT / AIML',
    },
    {
      title: 'Combat Robotics & Hardware',
      desc: 'Kinetic armor deathmatches in a fortified steel arena, plus rapid PCB fault analysis.',
      icon: Flame,
      tag: 'MECH / EXTC / ELEC',
    },
    {
      title: 'Competitive Esports',
      desc: 'Double-elimination showdowns in Valorant, BGMI, and FIFA on dedicated tournament hardware.',
      icon: Gamepad2,
      tag: 'ALL DISCIPLINES',
    },
    {
      title: 'Stage & Performance Arts',
      desc: 'Battle of the Bands, acoustic showcases, and high-energy theatrical performances.',
      icon: Sparkles,
      tag: 'CREATIVE SECTOR',
    },
  ]

  const faqs = [
    {
      q: 'Who is eligible to participate in VECTORS 2026-27?',
      a: 'All currently enrolled undergraduate and diploma students from any recognized college or university are eligible. A valid college ID card is required during entry verification.',
    },
    {
      q: 'Is the Entry Pass mandatory for visiting the campus?',
      a: 'Yes. Campus security enforces digital QR entry pass verification at the gates. You must complete the quick Entry Pass registration to access the festival grounds and participate in events.',
    },
    {
      q: 'Can team members be from different colleges or departments?',
      a: 'Yes! Cross-college and cross-department teams are fully supported for hackathons, esports, robo wars, and quizzes.',
    },
    {
      q: 'Can I register for multiple events across sectors?',
      a: 'Absolutely. You can participate in both technical and non-technical events as long as their physical schedules do not clash.',
    },
    {
      q: 'Where do I find my digital pass once registered?',
      a: 'Your pass is permanently saved to your account and accessible at any time from the "My Pass" tab in the navigation bar or from your Dashboard.',
    },
  ]

  return (
    <div className="relative min-h-screen bg-doom-bg overflow-x-hidden flex flex-col">

      {/* =========================================================================
          SECTION 1: HERO PORTAL WITH FERROFLUID LIQUID METAL
          ========================================================================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Ferrofluid interactive canvas */}
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

        {/* Environmental Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'radial-gradient(ellipse 75% 65% at 50% 40%, rgba(10,12,14,0.15) 0%, rgba(10,12,14,0.75) 60%, #0A0C0E 100%)'
          }}
        />

        {/* Accent underglow */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            background: 'radial-gradient(ellipse 60% 45% at 50% 32%, rgba(30,255,160,0.06) 0%, rgba(11,122,78,0.03) 50%, transparent 75%)'
          }}
        />

        {/* Hero Content */}
        <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16">
          {/* Narrative text */}
          <motion.div {...seq.text} className="max-w-xl mx-auto text-center space-y-4 sm:space-y-5 px-2">
            <p className="font-body text-sm sm:text-base text-text-primary/95 leading-relaxed font-normal">
              The world is changing.<br />
              Technology is evolving.<br />
              And the next generation is being called.
            </p>

            <p className="font-body text-sm sm:text-base text-text-primary/95 leading-relaxed">
              <strong className="font-display font-bold text-base sm:text-lg tracking-wider text-chrome-light">VECTORS 2026-27</strong> is where minds collide, machines awaken, and ideas become reality.
            </p>

            <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
              From <span className="text-text-primary font-medium">robotics and coding</span> to <span className="text-text-primary font-medium">hackathons and futuristic challenges</span>, every battle demands skill, strategy, and innovation.
            </p>

            <div className="pt-2 sm:pt-3 space-y-1.5">
              <p className="font-accent text-xs sm:text-sm font-semibold tracking-[0.25em] text-chrome-light uppercase">
                The arena is set. The challenge awaits.
              </p>
              <p className="font-accent text-sm sm:text-base font-bold tracking-[0.22em] uppercase text-doom-glow drop-shadow-[0_0_15px_rgba(30,255,160,0.5)]">
                Will you answer the call?
              </p>
            </div>
          </motion.div>

          {/* Gateway CTAs */}
          <motion.div {...seq.cta} className="mt-8 sm:mt-10 w-full max-w-sm flex flex-col items-center gap-3">
            <button
              onClick={handleEntryPass}
              className="doom-btn-primary w-full"
              aria-label={hasPass ? 'View My Entry Pass' : 'Claim Entry Pass'}
            >
              <span className="doom-btn-primary-inner">
                {hasPass ? 'VIEW MY ENTRY PASS' : 'CLAIM ENTRY PASS'}
              </span>
            </button>

            <button
              onClick={handleExploreEvents}
              className="doom-btn-ghost w-full"
              aria-label="Explore Event Vaults"
            >
              <span>Explore Event Vaults</span>
              <ArrowRight size={14} className="ghost-arrow text-doom-glow shrink-0" />
            </button>
          </motion.div>

          {/* Quick Metrics Ticker */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-3xl text-center">
            {[
              { label: 'Protocol Status', val: 'Registration Open' },
              { label: 'Prize Pool', val: '₹1,50,000+' },
              { label: 'Active Arenas', val: '7 Sectors' },
              { label: 'Participants', val: '1,500+ Expected' },
            ].map((stat, i) => (
              <div key={i} className="p-3 bg-doom-bg2/80 border border-white/[0.06] doom-btn-clipped">
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest block">{stat.label}</span>
                <span className="font-display text-sm sm:text-base text-text-primary font-bold">{stat.val}</span>
              </div>
            ))}
          </div>
        </main>
      </section>

      {/* =========================================================================
          SECTION 2: ABOUT VECTORS & PILLARS
          ========================================================================= */}
      <section className="relative z-10 py-20 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center space-y-3 mb-12">
          <span className="font-mono text-xs text-doom-glow uppercase tracking-widest px-3 py-1 bg-doom-glow/10 border border-doom-glow/30 inline-block">
            ARCHITECTURAL BLUEPRINT
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider text-text-primary">
            ENGINEERED FOR SUPREMACY
          </h2>
          <p className="font-body text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
            VECTORS 2026-27 is our flagship annual inter-college symposium. Two intensive days of algorithmic battles, metal combat, hardware trials, and creative showdowns designed to push student engineering to its limits.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon
            return (
              <div
                key={i}
                className="p-6 bg-doom-bg2 border border-white/[0.08] doom-btn-clipped hover:border-doom-glow/40 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-sm bg-white/[0.04] border border-white/15 flex items-center justify-center text-doom-glow group-hover:bg-doom-glow/10 group-hover:border-doom-glow/40 transition-colors">
                    <Icon size={20} />
                  </div>
                  <span className="font-mono text-[10px] tracking-wider text-text-muted block uppercase">
                    {pillar.tag}
                  </span>
                  <h3 className="font-display text-lg font-bold text-text-primary tracking-wide group-hover:text-doom-glow transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-xs text-text-muted leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-[11px] text-text-muted">
                  <span>SECTOR // 0{i + 1}</span>
                  <ArrowRight size={12} className="text-doom-glow group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: MANDATORY ENTRY PASS CALLOUT
          ========================================================================= */}
      <section className="relative z-10 py-12 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
        <div className="p-6 sm:p-10 bg-gradient-to-r from-doom-glow/10 via-doom-bg2 to-doom-bg2 border border-doom-glow/50 doom-btn-clipped relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-doom-glow/10 border border-doom-glow/40 font-mono text-[10px] text-doom-glow tracking-widest uppercase font-bold">
              <ShieldCheck size={12} />
              <span>SECURITY PROTOCOL NOTICE</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-text-primary">
              MANDATORY DIGITAL ENTRY PASS
            </h2>
            <p className="font-body text-xs sm:text-sm text-text-muted leading-relaxed">
              To maintain campus security and crowd safety, every participant must hold a valid VECTORS 2026-27 digital pass with a verified QR credential. Events and registrations remain locked until your pass is generated.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleEntryPass}
              className="py-3.5 px-6 doom-btn-clipped bg-doom-glow text-doom-bg font-mono text-xs uppercase tracking-widest font-bold hover:bg-white transition-all shadow-[0_0_25px_rgba(30,255,160,0.35)] text-center flex items-center justify-center gap-2"
            >
              <span>{hasPass ? 'VIEW YOUR PASS' : 'CLAIM PASS NOW'}</span>
              <ArrowRight size={14} />
            </button>
            <Link
              to="/faq"
              className="py-3.5 px-6 doom-btn-clipped bg-white/[0.04] border border-white/[0.1] text-text-muted hover:text-white font-mono text-xs uppercase tracking-widest transition-all text-center"
            >
              Pass Guidelines
            </Link>
          </div>
        </div>
      </section>



      {/* =========================================================================
          SECTION 6: FAQ ACCORDION PREVIEW
          ========================================================================= */}
      <section className="relative z-10 py-16 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto border-t border-white/[0.08]">
        <div className="text-center space-y-2 mb-10">
          <span className="font-mono text-xs text-doom-glow uppercase tracking-widest">HELP & INQUIRIES</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-text-primary">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-doom-bg2 border border-white/[0.08] doom-btn-clipped overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:text-doom-glow transition-colors cursor-pointer"
                aria-expanded={openFaqIndex === idx}
              >
                <span className="font-display text-sm sm:text-base font-bold text-text-primary uppercase tracking-wide">
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-doom-glow shrink-0 transition-transform duration-300 ${
                    openFaqIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openFaqIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-text-muted font-body leading-relaxed border-t border-white/[0.04]"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 font-mono text-xs text-doom-glow hover:underline uppercase tracking-widest font-bold"
          >
            <span>View All Questions & Support Directory</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: SITE FOOTER
          ========================================================================= */}
      <footer className="relative z-10 py-12 px-4 sm:px-6 md:px-8 border-t border-white/[0.08] bg-doom-bg2/90 font-mono text-xs text-text-muted">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="font-display font-bold text-sm tracking-wider text-text-primary uppercase">
              VECTORS 2026-27 // TECHNICAL FESTIVAL
            </span>
            <p className="text-[11px] text-text-muted">
              Annual Technical Symposium • All Arenas & Sectors
            </p>
          </div>

          <div className="flex items-center gap-6 flex-wrap justify-center text-[11px] uppercase tracking-wider">
            <Link to="/" className="hover:text-doom-glow transition-colors">Home</Link>
            <Link to="/events" className="hover:text-doom-glow transition-colors">Events</Link>
            <Link to="/faq" className="hover:text-doom-glow transition-colors">FAQ</Link>
          </div>

          <div className="text-[10px] text-text-muted/60">
            © VECTORS 2026-27 Committee. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
