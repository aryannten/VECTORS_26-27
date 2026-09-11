import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDown,
  Users,
  Trophy,
  ChevronRight,
  Shield,
  Cpu,
  Terminal,
  Activity,
  Radar,
  Lock,
  Award,
  CheckCircle2,
  MapPin
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import LandingNav from '../components/landing/LandingNav'
import DoomsdayCanvas from '../components/landing/DoomsdayCanvas'
import DoomButton from '../components/ui/DoomButton'
import { eventsData } from '../data/events'

gsap.registerPlugin(ScrollTrigger)

export default function Landing() {
  const navigate = useNavigate()
  const { user, hasPass } = useAuth()

  // Active event category filter in protocols section
  const [activeCategory, setActiveCategory] = useState('All')

  // Section refs for GSAP ScrollTriggers
  const heroRef = useRef(null)
  const destinyRef = useRef(null)
  const supremacyRef = useRef(null)
  const eventsRef = useRef(null)
  const passesRef = useRef(null)

  // Navigation callbacks
  const handleEntryPass = useCallback(() => {
    if (user) {
      navigate(hasPass ? '/my-pass' : '/entry-registration')
    } else {
      navigate('/login')
    }
  }, [user, hasPass, navigate])

  const handleExploreEvents = useCallback(() => {
    const el = document.getElementById('events')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // GSAP ScrollTrigger animations (GPU-accelerated transforms, zero React re-renders)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Destiny section reveals
      if (destinyRef.current) {
        gsap.fromTo(
          destinyRef.current.querySelectorAll('.destiny-reveal'),
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: destinyRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Supremacy section reveals
      if (supremacyRef.current) {
        gsap.fromTo(
          supremacyRef.current.querySelectorAll('.supremacy-reveal'),
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: supremacyRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Events section reveals
      if (eventsRef.current) {
        gsap.fromTo(
          eventsRef.current.querySelectorAll('.event-reveal-card'),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.65,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: eventsRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Passes section reveals
      if (passesRef.current) {
        gsap.fromTo(
          passesRef.current.querySelectorAll('.pass-reveal'),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: passesRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      ScrollTrigger.refresh()
    })

    return () => ctx.revert()
  }, [])

  // Filtered events memo
  const filteredEvents = useMemo(() => {
    if (activeCategory === 'All') return eventsData.slice(0, 6)
    if (activeCategory === 'Technical') return eventsData.filter((e) => e.category === 'Technical').slice(0, 6)
    return eventsData.filter((e) => e.category === 'Non-Technical').slice(0, 6)
  }, [activeCategory])

  return (
    <div className="relative min-h-screen bg-doom-bg text-text-primary selection:bg-doom-glow selection:text-black overflow-x-hidden font-sans">
      {/* ── Ultra-smooth Optimized 3D WebGL Canvas Layer ── */}
      <DoomsdayCanvas />

      {/* ── Floating Sticky Navigation ── */}
      <LandingNav />

      {/* ═══════════════════════════════════════════════════════
          SECTION 01: THE MONOLITH ARRIVAL (HERO)
          Doctor Doom & Celestial Mural Unobstructed in Grand Citadel
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-screen flex flex-col justify-between pt-24 pb-8 px-4 sm:px-6 md:px-8 z-10 select-none overflow-hidden"
      >
        {/* Monumental Hero Visual: Fully illuminated artwork, clear character & mural */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/doom2/ezgif-frame-050.jpg"
            alt="Doctor Doom Citadel Throne Room"
            className="w-full h-full object-cover object-top sm:object-center filter contrast-105 brightness-95"
            loading="eager"
          />
          {/* Subtle natural lighting overlays: minimal top navbar gradient & soft base fade */}
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#060809] via-[#060809]/75 to-transparent" />
        </div>

        {/* Top Mission Telemetry Header */}
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono tracking-widest text-text-muted/80 uppercase pt-2 z-10">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-doom-glow rounded-full animate-ping" />
            <span className="text-doom-glow/90 font-semibold">[ LATVERIA SECTOR 07 // DOOMSDAY DIRECTIVE ]</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>COORDINATES: 28.6139° N, 77.2090° E</span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden md:inline text-doom-glow/90 font-bold">STATUS: SOVEREIGN REIGN</span>
          </div>
        </div>

        {/* Bottom-Anchored Monolith Typography, Subtitle & Tactical CTAs */}
        {/* Placed at lower third so Doctor Doom & the celestial mural up top remain 100% visible */}
        <div className="relative mt-auto mb-2 flex flex-col items-center justify-center w-full max-w-5xl mx-auto z-10 text-center">
          {/* Monumental Hero Headline Typography */}
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.08em] uppercase text-text-primary drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)] leading-none hover:scale-[1.01] transition-transform duration-300 cursor-default">
            VECTORS
          </h1>

          {/* Tagline & Subheading */}
          <div className="mt-3 flex items-center justify-center gap-4">
            <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-doom-glow" />
            <p className="font-accent text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase text-emerald-300 font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              THE DOOMSDAY PROTOCOL
            </p>
            <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-doom-glow" />
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <DoomButton
              size="lg"
              variant="doom"
              onClick={handleEntryPass}
              className="w-full sm:w-auto"
            >
              {hasPass ? 'VIEW YOUR PROTOCOL PASS' : 'CLAIM ACCESS PASS'}
            </DoomButton>

            <DoomButton
              size="lg"
              variant="titanium"
              onClick={handleExploreEvents}
              className="w-full sm:w-auto"
            >
              EXPLORE ARENAS
            </DoomButton>
          </div>

          {/* Scroll Prompt at base — Threshold to Enter Citadel */}
          <div
            onClick={handleExploreEvents}
            className="mt-6 flex flex-col items-center gap-2 text-zinc-400/80 hover:text-doom-glow font-mono text-[10px] tracking-[0.28em] uppercase cursor-pointer transition-all duration-300 group hover:-translate-y-0.5"
          >
            <span className="group-hover:tracking-[0.34em] transition-all duration-300">SCROLL TO ENTER CITADEL</span>
            <div className="w-7 h-7 rounded-full border border-doom-glow/40 group-hover:border-doom-glow flex items-center justify-center bg-black/60 backdrop-blur-sm shadow-[0_0_12px_rgba(30,255,160,0.2)] group-hover:shadow-[0_0_20px_rgba(30,255,160,0.5)] transition-all duration-300">
              <ArrowDown size={13} className="text-doom-glow animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 02: WHERE TECHNOLOGY MEETS DESTINY
          Monumental 3-Act Composition & Telemetry Grid
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={destinyRef}
        id="destiny"
        className="relative min-h-screen py-24 sm:py-32 md:py-36 px-4 sm:px-6 md:px-8 flex flex-col justify-center z-10 border-t border-white/[0.08] bg-gradient-to-b from-transparent via-[rgba(10,12,14,0.7)] to-transparent backdrop-blur-[2px]"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Section Overline & Category Tag */}
          <div className="destiny-reveal flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-doom-glow" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-doom-glow font-bold">
              DOCTRINE // SECTION 02
            </span>
          </div>

          {/* Section Headline */}
          <div className="destiny-reveal flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-white/10">
            <div>
              <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.04em] uppercase text-text-primary leading-[0.95]">
                WHERE TECHNOLOGY <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-doom-glow via-emerald-400 to-teal-200 drop-shadow-[0_0_25px_rgba(30,255,160,0.3)]">
                  MEETS DESTINY
                </span>
              </h2>
              <p className="font-accent text-xs sm:text-sm tracking-[0.25em] text-chrome-light/70 uppercase mt-3">
                INTELLECTUS IMPERIUM // THE SOVEREIGN FORUM OF INNOVATION
              </p>
            </div>
            <p className="font-mono text-xs sm:text-sm tracking-wider text-text-muted max-w-md uppercase leading-relaxed">
              "Technology without supremacy is merely noise. In this arena, intellect commands destiny. The weak observe; the elite sculpt the new epoch."
            </p>
          </div>

          {/* 3 Monumental Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Pillar 01: Quantum Intelligence */}
            <div className="destiny-reveal relative group p-6 sm:p-8 bg-[rgba(16,19,22,0.75)] border border-white/10 hover:border-doom-glow/60 hover:bg-[rgba(18,24,28,0.85)] hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(30,255,160,0.2)] transition-all duration-300 backdrop-blur-md overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-doom-glow/[0.05] rounded-bl-full pointer-events-none group-hover:scale-150 group-hover:opacity-40 transition-transform duration-500" />
              <div className="w-12 h-12 rounded-none bg-black/60 border border-doom-glow/40 flex items-center justify-center text-doom-glow mb-6 shadow-[0_0_15px_rgba(30,255,160,0.2)] group-hover:scale-110 group-hover:border-doom-glow group-hover:shadow-[0_0_20px_rgba(30,255,160,0.5)] transition-all duration-300">
                <Cpu size={22} />
              </div>
              <span className="font-mono text-[10px] tracking-[0.25em] text-doom-glow uppercase font-bold">PILLAR I // COGNITION</span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-wide uppercase text-text-primary group-hover:text-doom-glow transition-colors duration-300 mt-2">
                QUANTUM AI & SYNTHESIS
              </h3>
              <p className="font-sans text-xs sm:text-sm text-text-muted mt-3 leading-relaxed">
                Pioneering autonomous agents, neural architectures, and generative synthetic intelligence designed to outpace human intuition.
              </p>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-text-muted/80">
                <span>BENCHMARK // REAL-TIME</span>
                <span className="text-doom-glow font-bold">ACTIVE PROTOCOL</span>
              </div>
            </div>

            {/* Pillar 02: Cryptographic Defense */}
            <div className="destiny-reveal relative group p-6 sm:p-8 bg-[rgba(16,19,22,0.75)] border border-white/10 hover:border-doom-crimson/60 hover:bg-[rgba(24,14,16,0.85)] hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(255,42,77,0.2)] transition-all duration-300 backdrop-blur-md overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-doom-crimson/[0.05] rounded-bl-full pointer-events-none group-hover:scale-150 group-hover:opacity-40 transition-transform duration-500" />
              <div className="w-12 h-12 rounded-none bg-black/60 border border-doom-crimson/50 flex items-center justify-center text-doom-crimson-bright mb-6 shadow-[0_0_15px_rgba(194,24,7,0.2)] group-hover:scale-110 group-hover:border-doom-crimson group-hover:shadow-[0_0_20px_rgba(255,42,77,0.5)] transition-all duration-300">
                <Shield size={22} />
              </div>
              <span className="font-mono text-[10px] tracking-[0.25em] text-doom-crimson-bright uppercase font-bold">PILLAR II // SECURITY</span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-wide uppercase text-text-primary group-hover:text-doom-crimson-bright transition-colors duration-300 mt-2">
                CYBERNETIC WARFARE
              </h3>
              <p className="font-sans text-xs sm:text-sm text-text-muted mt-3 leading-relaxed">
                Zero-knowledge cryptographic barriers, offensive penetration vectors, and fortress-grade perimeter defense.
              </p>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-text-muted/80">
                <span>FIREWALL // ZERO-DAY</span>
                <span className="text-doom-crimson-bright font-bold">DEFCON 1</span>
              </div>
            </div>

            {/* Pillar 03: Autonomous Robotics */}
            <div className="destiny-reveal relative group p-6 sm:p-8 bg-[rgba(16,19,22,0.75)] border border-white/10 hover:border-white/50 hover:bg-[rgba(22,25,30,0.85)] hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(255,255,255,0.15)] transition-all duration-300 backdrop-blur-md overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.05] rounded-bl-full pointer-events-none group-hover:scale-150 group-hover:opacity-40 transition-transform duration-500" />
              <div className="w-12 h-12 rounded-none bg-black/60 border border-white/30 flex items-center justify-center text-chrome-light mb-6 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-110 group-hover:border-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300">
                <Terminal size={22} />
              </div>
              <span className="font-mono text-[10px] tracking-[0.25em] text-chrome-light uppercase font-bold">PILLAR III // KINETICS</span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-wide uppercase text-text-primary group-hover:text-white transition-colors duration-300 mt-2">
                BIONIC HEGEMONY
              </h3>
              <p className="font-sans text-xs sm:text-sm text-text-muted mt-3 leading-relaxed">
                Autonomous robotic combatants, high-torque micro-servos, and synchronized swarm robotics executing high-precision operations.
              </p>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-text-muted/80">
                <span>SERVO LOCK // ONLINE</span>
                <span className="text-white font-bold">CALIBRATED</span>
              </div>
            </div>
          </div>

          {/* The Supreme Telemetry Metrics Bar */}
          <div className="destiny-reveal mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-black/60 border border-white/10 backdrop-blur-md">
            <div className="text-center p-3 border-r border-white/5 last:border-r-0">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted">OPERATIVES</span>
              <p className="font-display text-3xl sm:text-4xl font-bold text-doom-glow mt-1">1,500+</p>
              <span className="text-[9px] font-mono text-text-muted/60 uppercase">VERIFIED ENTRIES</span>
            </div>
            <div className="text-center p-3 border-r border-white/5 last:border-r-0">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted">ARENAS</span>
              <p className="font-display text-3xl sm:text-4xl font-bold text-text-primary mt-1">24</p>
              <span className="text-[9px] font-mono text-text-muted/60 uppercase">ACTIVE PROTOCOLS</span>
            </div>
            <div className="text-center p-3 border-r border-white/5 last:border-r-0">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted">PRIZE POOL</span>
              <p className="font-display text-3xl sm:text-4xl font-bold text-doom-glow mt-1">₹2,50,000+</p>
              <span className="text-[9px] font-mono text-text-muted/60 uppercase">DIRECT ALLOCATION</span>
            </div>
            <div className="text-center p-3">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted">DURATION</span>
              <p className="font-display text-3xl sm:text-4xl font-bold text-text-primary mt-1">48 HRS</p>
              <span className="text-[9px] font-mono text-text-muted/60 uppercase">NON-STOP ARENA</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 03: ENGINEERED FOR SUPREMACY
          Tactical Command Grid & Architecture Breakdown
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={supremacyRef}
        id="supremacy"
        className="relative min-h-screen py-24 sm:py-32 md:py-36 px-4 sm:px-6 md:px-8 flex flex-col justify-center z-10 border-t border-white/[0.08] bg-gradient-to-b from-transparent via-[rgba(8,10,12,0.8)] to-transparent backdrop-blur-[2px]"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Section Header */}
          <div className="supremacy-reveal mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-doom-glow" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-doom-glow font-bold">
                TACTICAL MATRIX // SECTION 03
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.04em] uppercase text-text-primary leading-[0.95]">
              ENGINEERED FOR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-chrome-light via-white to-chrome-dark">
                SUPREMACY
              </span>
            </h2>
          </div>

          {/* Two-Column Grid: Dossier + Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Command Console & Latveria Radar (4 cols) */}
            <div className="supremacy-reveal lg:col-span-4 p-6 sm:p-8 bg-[rgba(14,17,20,0.85)] border border-white/10 flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-mono text-xs tracking-widest uppercase text-text-muted">TACTICAL DOSSIER</span>
                  <Radar size={18} className="text-doom-glow animate-spin" />
                </div>

                {/* Radar HUD Circle Simulation */}
                <div className="relative w-48 h-48 mx-auto my-6 rounded-full border border-doom-glow/20 flex items-center justify-center">
                  <div className="absolute inset-4 rounded-full border border-dashed border-white/10 animate-[spin_30s_linear_infinite]" />
                  <div className="absolute inset-12 rounded-full border border-doom-glow/30" />
                  <div className="w-2 h-2 rounded-full bg-doom-glow animate-ping" />
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 font-mono text-[8px] text-doom-glow tracking-widest">NORTH 000°</div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] text-text-muted tracking-widest">LATVERIA SECTOR</div>
                </div>

                <div className="space-y-2 font-mono text-xs text-text-muted/80">
                  <div className="flex justify-between">
                    <span>CLEARANCE:</span>
                    <span className="text-doom-glow font-bold">SOVEREIGN LEVEL 5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SECURITY HASH:</span>
                    <span className="text-white/60">0x7F2B...C91A</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CAMPUS GRID:</span>
                    <span className="text-white/60">ADGIPS SECTOR A-G</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <DoomButton
                  size="md"
                  variant="doom"
                  onClick={handleEntryPass}
                  className="w-full"
                >
                  ACQUIRE CLEARANCE
                </DoomButton>
              </div>
            </div>

            {/* Right Column: 4 Engineering Pillars (8 cols) */}
            <div className="supremacy-reveal lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Feature 01 */}
              <div className="group p-6 bg-[rgba(14,17,20,0.7)] border border-white/10 hover:border-doom-glow/50 hover:bg-[rgba(18,22,26,0.85)] hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(30,255,160,0.15)] transition-all duration-300 backdrop-blur-md cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs tracking-widest text-doom-glow font-bold">01 // EVALUATION</span>
                  <Activity size={18} className="text-doom-glow group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_#1EFFA0] transition-transform duration-300" />
                </div>
                <h4 className="font-display text-xl font-bold uppercase tracking-wide text-text-primary group-hover:text-white transition-colors duration-300">
                  ZERO-LATENCY ARBITRATION
                </h4>
                <p className="font-sans text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
                  Real-time telemetry, automated unit-test validation, and algorithmic scoring engines eliminate human bias and guarantee transparency.
                </p>
              </div>

              {/* Feature 02 */}
              <div className="group p-6 bg-[rgba(14,17,20,0.7)] border border-white/10 hover:border-doom-glow/50 hover:bg-[rgba(18,22,26,0.85)] hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(30,255,160,0.15)] transition-all duration-300 backdrop-blur-md cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs tracking-widest text-doom-glow font-bold">02 // ARCHITECTS</span>
                  <Award size={18} className="text-doom-glow group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_#1EFFA0] transition-transform duration-300" />
                </div>
                <h4 className="font-display text-xl font-bold uppercase tracking-wide text-text-primary group-hover:text-white transition-colors duration-300">
                  VANGUARD MENTORSHIP
                </h4>
                <p className="font-sans text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
                  Keynotes, code audits, and strategic technical juries composed of principal software architects and engineering directors.
                </p>
              </div>

              {/* Feature 03 */}
              <div className="group p-6 bg-[rgba(14,17,20,0.7)] border border-white/10 hover:border-doom-glow/50 hover:bg-[rgba(18,22,26,0.85)] hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(30,255,160,0.15)] transition-all duration-300 backdrop-blur-md cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs tracking-widest text-doom-glow font-bold">03 // PROTOCOL</span>
                  <Lock size={18} className="text-doom-glow group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_#1EFFA0] transition-transform duration-300" />
                </div>
                <h4 className="font-display text-xl font-bold uppercase tracking-wide text-text-primary group-hover:text-white transition-colors duration-300">
                  CRYPTOGRAPHIC PASSES
                </h4>
                <p className="font-sans text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
                  Instant tamper-proof digital entry credentials verified at all campus perimeters using decentralized verification protocols.
                </p>
              </div>

              {/* Feature 04 */}
              <div className="group p-6 bg-[rgba(14,17,20,0.7)] border border-white/10 hover:border-doom-glow/50 hover:bg-[rgba(18,22,26,0.85)] hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(30,255,160,0.15)] transition-all duration-300 backdrop-blur-md cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs tracking-widest text-doom-glow font-bold">04 // BOUNTIES</span>
                  <Trophy size={18} className="text-doom-glow group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_#1EFFA0] transition-transform duration-300" />
                </div>
                <h4 className="font-display text-xl font-bold uppercase tracking-wide text-text-primary group-hover:text-white transition-colors duration-300">
                  SUPREME DIVIDENDS
                </h4>
                <p className="font-sans text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
                  Direct bounty payouts, incubation sponsorships, investor matchmaking, and custom hand-forged titanium victory trophies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 04: THE PROTOCOLS (EVENTS SHOWCASE)
          Category-Driven Arenas with Specular Interaction
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={eventsRef}
        id="events"
        className="relative min-h-screen py-24 sm:py-32 md:py-36 px-4 sm:px-6 md:px-8 flex flex-col justify-center z-10 border-t border-white/[0.08] bg-gradient-to-b from-transparent via-[rgba(10,12,14,0.7)] to-transparent backdrop-blur-[2px]"
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Section Header & Category Filter Buttons */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-doom-glow" />
                <span className="font-mono text-xs tracking-[0.3em] uppercase text-doom-glow font-bold">
                  CHALLENGES // SECTION 04
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.04em] uppercase text-text-primary leading-[0.95]">
                THE PROTOCOLS
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 p-1.5 bg-black/60 border border-white/10 backdrop-blur-md">
              {['All', 'Technical', 'Non-Technical'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 font-mono text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-doom-glow text-black font-bold shadow-[0_0_12px_rgba(30,255,160,0.5)]'
                      : 'text-text-muted hover:text-white'
                  }`}
                >
                  {cat === 'All' ? 'ALL TRACKS' : cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="event-reveal-card relative group p-6 bg-[rgba(14,17,20,0.85)] border border-white/10 hover:border-doom-glow/60 hover:bg-[rgba(18,23,28,0.92)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(30,255,160,0.2)] transition-all duration-300 flex flex-col justify-between backdrop-blur-md cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-text-muted/70 pb-3 border-b border-white/5">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-doom-glow font-bold group-hover:border-doom-glow/40 transition-colors">
                      {event.category.toUpperCase()}
                    </span>
                    <span>{event.branch || 'OPEN TRACK'}</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-text-primary mt-4 group-hover:text-doom-glow transition-colors duration-200">
                    {event.name}
                  </h3>

                  <p className="font-sans text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-1.5 text-[11px] font-mono text-text-muted/80">
                    <div className="flex items-center gap-2">
                      <Trophy size={13} className="text-doom-glow shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:text-white transition-colors">{event.prizePool}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={13} className="text-white/60 shrink-0" />
                      <span>{event.teamSize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-white/60 shrink-0" />
                      <span>{event.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <DoomButton
                    to={`/events/${event.id}`}
                    size="sm"
                    variant="doom"
                  >
                    BRIEFING
                  </DoomButton>

                  <Link
                    to={`/events/${event.id}`}
                    className="group/link text-xs font-mono text-text-muted hover:text-doom-glow transition-colors flex items-center gap-1"
                  >
                    <span>DETAILS</span>
                    <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* View All Events CTA */}
          <div className="mt-12 text-center">
            <DoomButton
              to="/events"
              size="lg"
              variant="titanium"
            >
              VIEW ALL 24 PROTOCOLS
            </DoomButton>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 05: ACCESS PRIVILEGES & PASS TIERS
          Digital Pass Hologram & Seamless Grounded Outro
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={passesRef}
        id="passes"
        className="relative min-h-screen py-24 sm:py-32 md:py-36 px-4 sm:px-6 md:px-8 flex flex-col justify-center z-10 border-t border-white/[0.08] bg-gradient-to-b from-transparent via-[rgba(8,10,12,0.85)] to-doom-bg/95 backdrop-blur-[2px]"
      >
        <div className="max-w-5xl mx-auto w-full">
          <div className="pass-reveal text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-doom-glow/[0.06] border border-doom-glow/20">
              <span className="w-1.5 h-1.5 rounded-full bg-doom-glow" />
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-doom-glow font-bold">
                SECTOR CLEARANCE // SECTION 05
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.04em] uppercase text-text-primary">
              ACCESS PRIVILEGES
            </h2>
            <p className="font-mono text-xs sm:text-sm tracking-widest text-text-muted uppercase mt-3 max-w-xl mx-auto">
              Every participant requires a cryptographically validated entry pass for admission past campus perimeters.
            </p>
          </div>

          {/* Digital Holographic Pass Preview Card */}
          <div className="pass-reveal relative p-8 sm:p-12 bg-[rgba(16,20,24,0.9)] border border-doom-glow/40 shadow-[0_0_50px_rgba(30,255,160,0.12)] backdrop-blur-xl max-w-2xl mx-auto">
            {/* Top Pass Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <img
                  src="/vector26-logo.svg"
                  alt="VECTORS 26"
                  className="h-8 w-auto mix-blend-screen"
                />
                <span className="font-mono text-xs tracking-widest uppercase text-doom-glow font-bold">
                  DIGITAL CREDENTIAL
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-doom-glow/10 border border-doom-glow/30">
                <CheckCircle2 size={13} className="text-doom-glow" />
                <span className="font-mono text-[10px] tracking-wider text-doom-glow font-bold uppercase">
                  TAMPER-PROOF
                </span>
              </div>
            </div>

            {/* Pass Body Content */}
            <div className="my-8 space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-text-muted">OPERATIVE DESIGNATION:</span>
                <span className="text-white font-bold">{user ? (user.displayName || user.email) : 'GUEST OPERATIVE'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-text-muted">ACCESS LEVEL:</span>
                <span className="text-doom-glow font-bold">{hasPass ? 'SOVEREIGN // CLEARED' : 'PENDING REGISTRATION'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-text-muted">ADMISSION DATE:</span>
                <span className="text-white">FEB 27–28, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">CAMPUS SECTORS:</span>
                <span className="text-white">ARENAS 1–4 // MAIN AUDITORIUM</span>
              </div>
            </div>

            {/* Pass Action CTA */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left font-mono text-[11px] text-text-muted/70">
                <span>VERIFICATION TIME: &lt; 250MS AT GATE</span>
              </div>
              <DoomButton
                size="md"
                variant="doom"
                onClick={handleEntryPass}
                className="w-full sm:w-auto"
              >
                {hasPass ? 'OPEN MY PASS' : 'GENERATE ENTRY PASS'}
              </DoomButton>
            </div>
          </div>

          {/* Clean minimal integrated outro line */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-text-muted/50 gap-3">
            <span>&copy; 2026 VECTORS TECHNICAL SYMPOSIUM. ALL RIGHTS RESERVED.</span>
            <span className="text-doom-glow/60 font-semibold tracking-widest uppercase">
              DOCTOR DOOM PROTOCOL // SECURE SESSION
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
