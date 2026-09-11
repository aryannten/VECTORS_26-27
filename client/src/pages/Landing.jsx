import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  ArrowDown,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Trophy,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import LandingNav from '../components/landing/LandingNav'
import ScrollCanvas from '../components/landing/ScrollCanvas'
import { eventsData } from '../data/events'

gsap.registerPlugin(ScrollTrigger)

/* ─── constants ────────────────────────────────────────────── */
const STATS = [
  { label: 'Festival Dates', value: 'March 15–16' },
  { label: 'Prize Pool', value: '₹1,50,000+' },
  { label: 'Events Arsenal', value: '20+ Battles' },
  { label: 'Participants', value: '1,500+ Expected' },
]

/* ─── component ────────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate()
  const { user, hasPass } = useAuth()

  const [seqProgress, setSeqProgress] = useState(0)
  const [currentFrame, setCurrentFrame] = useState(1)

  const prologueRef = useRef(null)
  const overviewRef = useRef(null)
  const aboutRef = useRef(null)
  const eventsRef = useRef(null)
  const ctaRef = useRef(null)

  const handleEntryPass = useCallback(() => {
    if (user) {
      navigate(hasPass ? '/my-pass' : '/entry-registration')
    } else {
      navigate('/login')
    }
  }, [user, hasPass, navigate])

  const handleExploreEvents = useCallback(() => {
    navigate(user ? '/events' : '/login')
  }, [user, navigate])

  /* ─── GSAP scroll animations ─────────────────────────────── */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Overview section entrance reveals
      if (overviewRef.current) {
        const revealElements = overviewRef.current.querySelectorAll('.overview-reveal')
        gsap.fromTo(
          revealElements,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: overviewRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // About section reveals
      if (aboutRef.current) {
        const aboutElements = aboutRef.current.querySelectorAll('.reveal-up')
        gsap.fromTo(
          aboutElements,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: aboutRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Events section
      if (eventsRef.current) {
        const eventCards = eventsRef.current.querySelectorAll('.event-card')
        gsap.fromTo(
          eventCards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: eventsRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // CTA section
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current.querySelectorAll('.cta-reveal'),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Refresh ScrollTrigger to ensure all trigger positions are accurate
      ScrollTrigger.refresh()
    })

    return () => ctx.revert()
  }, [])

  /* ─── data helpers ───────────────────────────────────────── */
  const featuredTechnical = eventsData
    .filter((e) => e.category === 'Technical')
    .slice(0, 4)
  const featuredNonTechnical = eventsData
    .filter((e) => e.category === 'Non-Technical')
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-doom-bg text-text-primary overflow-x-hidden">
      <LandingNav />

      {/* ═══════════════════════════════════════════════════════
          SECTION 00 — CINEMATIC PROLOGUE (PINNED 50 FRAMES)
          The viewport is pinned while all 50 frames play on scroll.
          Zero visual overlap. Crisp, unobstructed Doom turnaround.
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={prologueRef}
        id="prologue"
        className="relative w-full h-screen overflow-hidden bg-doom-bg select-none"
      >
        <ScrollCanvas
          startFrame={1}
          endFrame={50}
          scrubDuration={0.3}
          triggerRef={prologueRef}
          pin={true}
          pinSpacing={true}
          start="top top"
          end="+=2500"
          onProgress={setSeqProgress}
          onFrameChange={setCurrentFrame}
          className="absolute inset-0"
        />

        {/* Cinematic Vignette */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, rgba(5,6,6,0.65) 100%)',
          }}
        />

        {/* Ambient top & bottom fades */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-doom-bg/85 to-transparent pointer-events-none z-[2]" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-doom-bg/90 via-doom-bg/40 to-transparent pointer-events-none z-[2]" />

        {/* Scroll Prompt — visible at scroll 0, gracefully fades out on initial scroll */}
        <div
          className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-end pb-14 transition-opacity duration-300"
          style={{
            opacity: Math.max(0, 1 - seqProgress * 18),
            transform: `translateY(${seqProgress * 25}px)`,
          }}
        >
          <div className="flex flex-col items-center gap-2.5">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-doom-glow/90 px-3 py-1 bg-doom-glow/[0.08] border border-doom-glow/20 backdrop-blur-md">
              AVENGERS: DOOMSDAY // TECHNICAL SYMPOSIUM
            </span>
            <div className="flex items-center gap-2 text-text-muted/70 font-mono text-[10px] tracking-[0.25em] uppercase mt-1">
              <span className="w-5 h-[1px] bg-doom-glow/40" />
              <span>Scroll to Play Sequence</span>
              <span className="w-5 h-[1px] bg-doom-glow/40" />
            </div>
            <ArrowDown size={14} className="text-doom-glow/80 animate-bounce mt-0.5" />
          </div>
        </div>

        {/* Top-Right HUD telemetry */}
        <div className="absolute top-20 right-4 sm:right-8 z-10 pointer-events-none hidden sm:flex flex-col items-end gap-1">
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-text-muted/40">
            CINEMATIC STREAM
          </span>
          <div className="flex items-center gap-2 px-2.5 py-1 bg-black/50 border border-white/[0.08] backdrop-blur-sm">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-doom-glow animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-doom-glow font-bold">
              FRAME {String(currentFrame).padStart(2, '0')} / 50
            </span>
          </div>
        </div>

        {/* Completion Cue — appears when Doom finishes turning around (frame 48-50) */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-all duration-300 flex flex-col items-center gap-2"
          style={{
            opacity: seqProgress >= 0.95 ? 1 : 0,
            transform: `translate(-50%, ${seqProgress >= 0.95 ? '0px' : '15px'})`,
          }}
        >
          <div className="flex items-center gap-2 px-4 py-1.5 bg-black/80 border border-doom-glow/50 shadow-[0_0_25px_rgba(30,255,160,0.3)] backdrop-blur-md">
            <Sparkles size={12} className="text-doom-glow animate-spin" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-doom-glow font-bold">
              Sequence Complete • Scroll for Website
            </span>
          </div>
          <ArrowDown size={14} className="text-doom-glow animate-pulse" />
        </div>

        {/* Bottom edge progress bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-white/[0.06]">
          <div
            className="h-full bg-gradient-to-r from-doom-glow/50 via-doom-glow to-doom-glow shadow-[0_0_12px_rgba(30,255,160,0.9)] origin-left transition-all duration-75"
            style={{ width: `${Math.min(100, Math.round(seqProgress * 100))}%` }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 01 — FESTIVAL OVERVIEW & COMMAND CENTER
          The website content begins here AFTER the 50 frames finish!
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={overviewRef}
        id="overview"
        className="relative min-h-screen py-24 sm:py-32 md:py-36 px-4 sm:px-6 md:px-8 flex flex-col justify-center border-t border-white/[0.06] bg-gradient-to-b from-doom-bg via-doom-bg2/40 to-doom-bg overflow-hidden"
      >
        {/* Background glow effects */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(30,255,160,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
          {/* Overline */}
          <div className="overview-reveal mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-doom-glow/[0.06] border border-doom-glow/20">
            <span className="w-1.5 h-1.5 rounded-full bg-doom-glow animate-ping" />
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-doom-glow font-bold">
              Technical Festival 2026 — Avengers: Doomsday
            </span>
          </div>

          {/* Main Display Title */}
          <h1 className="overview-reveal font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.88] tracking-[0.06em] uppercase text-text-primary drop-shadow-[0_4px_35px_rgba(0,0,0,0.9)]">
            VECTORS
          </h1>

          {/* Tagline separator */}
          <div className="overview-reveal mt-4 mb-4 flex items-center justify-center gap-3">
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-doom-glow/60" />
            <p className="font-accent text-sm sm:text-base md:text-lg tracking-[0.25em] uppercase text-chrome-light/95 font-semibold">
              Where Technology Meets Destiny
            </p>
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-doom-glow/60" />
          </div>

          {/* Narrative description */}
          <p className="overview-reveal mt-3 font-body text-xs sm:text-sm md:text-base text-text-muted/80 max-w-xl mx-auto leading-relaxed">
            Two days. Seven battlegrounds. One stage where minds collide,
            machines awaken, and ideas become reality.
          </p>

          {/* Action CTAs */}
          <div className="overview-reveal mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={handleEntryPass}
              className="doom-btn-primary"
              aria-label={hasPass ? 'View My Entry Pass' : 'Claim Entry Pass'}
            >
              <span className="doom-btn-primary-inner !px-7">
                {hasPass ? 'View My Pass' : 'Claim Entry Pass'}
              </span>
            </button>

            <button
              onClick={handleExploreEvents}
              className="doom-btn-ghost"
              aria-label="Explore Events"
            >
              <span>Explore Events</span>
              <ArrowRight size={14} className="ghost-arrow text-doom-glow" />
            </button>
          </div>

          {/* Key Metric Stats Cards */}
          <div className="overview-reveal mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="p-4 bg-white/[0.03] border border-white/[0.08] hover:border-doom-glow/30 transition-all duration-300 text-center backdrop-blur-sm group"
              >
                <span className="block font-mono text-[9px] tracking-[0.2em] uppercase text-text-muted/60 group-hover:text-doom-glow/70 transition-colors">
                  {stat.label}
                </span>
                <span className="block font-display text-base sm:text-lg md:text-xl font-bold text-text-primary mt-1 tracking-wide">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 02 — ABOUT / INTRODUCTION
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={aboutRef}
        id="about"
        className="relative py-24 sm:py-32 md:py-40 px-4 sm:px-6 md:px-8"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <div className="reveal-up mb-6 flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-doom-glow">
              [ 01 // About ]
            </span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-doom-glow/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left — Large typography */}
            <div className="space-y-6">
              <h2 className="reveal-up font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold uppercase tracking-wide leading-[1.05] text-text-primary">
                Engineered
                <br />
                <span className="text-doom-glow">For Supremacy</span>
              </h2>

              <p className="reveal-up font-body text-sm sm:text-base text-text-muted leading-relaxed max-w-lg">
                VECTORS 26–27 is our flagship annual inter-college symposium.
                Two intensive days of algorithmic battles, metal combat,
                hardware trials, and creative showdowns designed to push student
                engineering to its limits.
              </p>

              <p className="reveal-up font-body text-sm sm:text-base text-text-muted leading-relaxed max-w-lg">
                From robotics and coding to hackathons and futuristic
                challenges, every battle demands skill, strategy, and
                innovation. The arena is set. The challenge awaits.
              </p>
            </div>

            {/* Right — Key facts */}
            <div className="reveal-up space-y-5 lg:pt-8">
              {[
                { icon: Calendar, label: 'When', value: 'March 15–16, 2026' },
                { icon: MapPin, label: 'Where', value: 'Campus Main Complex' },
                { icon: Users, label: 'Scale', value: '1,500+ participants nationwide' },
                { icon: Trophy, label: 'Stakes', value: '₹1,50,000+ in prizes and trophies' },
              ].map((fact, i) => {
                const Icon = fact.icon
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/[0.06] hover:border-doom-glow/20 transition-colors duration-500 group"
                  >
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-doom-glow/5 border border-doom-glow/15 text-doom-glow/70 group-hover:text-doom-glow group-hover:border-doom-glow/40 transition-colors">
                      <Icon size={18} />
                    </div>
                    <div>
                      <span className="block font-mono text-[9px] tracking-[0.2em] uppercase text-text-muted/50">
                        {fact.label}
                      </span>
                      <span className="block font-display text-sm sm:text-base font-bold text-text-primary tracking-wide mt-0.5">
                        {fact.value}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 03 — EVENTS & SCHEDULE
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={eventsRef}
        id="events"
        className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-8 border-t border-white/[0.06]"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-doom-glow block mb-2">
                [ 02 // Event Arsenal ]
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-text-primary">
                Two Days. The Ultimate Arena.
              </h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 font-mono text-[11px] text-doom-glow hover:text-white uppercase tracking-widest font-bold transition-colors shrink-0 py-2 px-4 bg-doom-glow/[0.08] border border-doom-glow/25 hover:bg-doom-glow/15"
            >
              <span>All Events</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Day 1 & Day 2 schedule cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
            {/* Day 1 */}
            <div className="event-card p-5 sm:p-6 bg-doom-bg2/60 border border-white/[0.06]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                <span className="font-display text-base sm:text-lg font-bold text-text-primary uppercase tracking-wider">
                  Day 01 — March 15, 2026
                </span>
                <span className="hidden sm:inline font-mono text-[9px] text-doom-glow/70 px-2 py-0.5 bg-doom-glow/[0.08] border border-doom-glow/20">
                  09:00 — 18:00
                </span>
              </div>
              <ul className="space-y-2.5">
                {eventsData
                  .filter((e) => e.date.includes('March 15'))
                  .slice(0, 5)
                  .map((e) => (
                    <li
                      key={e.id}
                      className="flex items-start gap-2.5 font-mono text-xs text-text-muted/70"
                    >
                      <span className="text-doom-glow/80 font-bold shrink-0 w-10">
                        {e.date.split('//')[1]?.trim().substring(0, 5) || '—'}
                      </span>
                      <span className="text-text-muted">{e.name}</span>
                      <span className="ml-auto text-[9px] text-text-muted/40 shrink-0 hidden sm:inline">
                        {e.category}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Day 2 */}
            <div className="event-card p-5 sm:p-6 bg-doom-bg2/60 border border-white/[0.06]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                <span className="font-display text-base sm:text-lg font-bold text-text-primary uppercase tracking-wider">
                  Day 02 — March 16, 2026
                </span>
                <span className="hidden sm:inline font-mono text-[9px] text-doom-glow/70 px-2 py-0.5 bg-doom-glow/[0.08] border border-doom-glow/20">
                  09:00 — 22:00
                </span>
              </div>
              <ul className="space-y-2.5">
                {eventsData
                  .filter((e) => e.date.includes('March 16'))
                  .slice(0, 5)
                  .map((e) => (
                    <li
                      key={e.id}
                      className="flex items-start gap-2.5 font-mono text-xs text-text-muted/70"
                    >
                      <span className="text-doom-glow/80 font-bold shrink-0 w-10">
                        {e.date.split('//')[1]?.trim().substring(0, 5) || '—'}
                      </span>
                      <span className="text-text-muted">{e.name}</span>
                      <span className="ml-auto text-[9px] text-text-muted/40 shrink-0 hidden sm:inline">
                        {e.category}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Featured events grid */}
          <div className="mb-6">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted/50 block mb-5">
              Featured Events
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...featuredTechnical.slice(0, 2), ...featuredNonTechnical.slice(0, 2)].map(
              (event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="event-card group p-4 bg-white/[0.02] border border-white/[0.06] hover:border-doom-glow/25 transition-all duration-500 block"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`font-mono text-[8px] tracking-[0.15em] uppercase px-1.5 py-0.5 border ${
                        event.category === 'Technical'
                          ? 'text-doom-glow/80 bg-doom-glow/[0.06] border-doom-glow/20'
                          : 'text-amber/80 bg-amber/[0.06] border-amber/20'
                      }`}
                    >
                      {event.category}
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-bold text-text-primary group-hover:text-doom-glow transition-colors duration-300 tracking-wide">
                    {event.name}
                  </h3>

                  <p className="mt-1.5 font-body text-[11px] text-text-muted/60 leading-relaxed line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between font-mono text-[9px] text-text-muted/40">
                    <span>{event.teamSize}</span>
                    <ChevronRight
                      size={10}
                      className="text-doom-glow/0 group-hover:text-doom-glow transition-colors duration-300"
                    />
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 06 — CTA
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className="relative py-28 sm:py-36 md:py-44 px-4 sm:px-6 overflow-hidden"
      >
        {/* Atmospheric gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(30,255,160,0.04) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="cta-reveal font-mono text-[10px] tracking-[0.3em] uppercase text-doom-glow/60 block mb-5">
            [ The Call ]
          </span>

          <h2 className="cta-reveal font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider leading-[1.05] text-text-primary">
            Ready to Enter
            <br />
            <span className="text-doom-glow drop-shadow-[0_0_40px_rgba(30,255,160,0.2)]">
              The Vector?
            </span>
          </h2>

          <p className="cta-reveal mt-5 font-body text-sm sm:text-base text-text-muted/70 max-w-md mx-auto leading-relaxed">
            Secure your position. Claim your entry pass. The convergence begins
            March 15, 2026.
          </p>

          <div className="cta-reveal mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={handleEntryPass}
              className="doom-btn-primary"
              aria-label={hasPass ? 'View My Entry Pass' : 'Claim Entry Pass'}
            >
              <span className="doom-btn-primary-inner !px-8">
                {hasPass ? 'View My Pass' : 'Claim Your Entry Pass'}
              </span>
            </button>

            <button
              onClick={handleExploreEvents}
              className="doom-btn-ghost"
              aria-label="Explore Event Vaults"
            >
              <span>Explore Event Vaults</span>
              <ArrowRight size={14} className="ghost-arrow text-doom-glow" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 07 — FOOTER
          ═══════════════════════════════════════════════════════ */}
      <footer className="relative py-12 sm:py-16 px-4 sm:px-6 md:px-8 border-t border-white/[0.06] bg-doom-bg2/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {/* Branding */}
            <div className="space-y-3">
              <span className="font-display text-lg font-bold tracking-[0.1em] uppercase text-text-primary block">
                VECTORS
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted/50 block">
                Technical Festival 2026
              </span>
              <p className="font-body text-xs text-text-muted/40 leading-relaxed max-w-xs">
                March 15–16, 2026 • Campus Main Complex
              </p>
            </div>

            {/* Navigation */}
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted/40 block mb-4">
                Navigate
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Festival', to: '/festival' },
                  { label: 'Events', to: '/events' },
                  { label: 'Schedule', to: '/schedule' },
                  { label: 'Announcements', to: '/announcements' },
                  { label: 'FAQ', to: '/faq' },
                  { label: 'Dashboard', to: '/dashboard' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="font-mono text-[11px] tracking-wider text-text-muted/50 hover:text-doom-glow transition-colors duration-300 uppercase py-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted/40 block mb-4">
                Quick Actions
              </span>
              <div className="space-y-2">
                <button
                  onClick={handleEntryPass}
                  className="w-full text-left font-mono text-[11px] tracking-wider text-doom-glow/70 hover:text-doom-glow transition-colors uppercase py-1 flex items-center gap-2"
                >
                  <Zap size={10} />
                  <span>{hasPass ? 'View Entry Pass' : 'Claim Entry Pass'}</span>
                </button>
                <Link
                  to="/events"
                  className="font-mono text-[11px] tracking-wider text-text-muted/50 hover:text-doom-glow transition-colors uppercase py-1 flex items-center gap-2"
                >
                  <ChevronRight size={10} />
                  <span>Browse All Events</span>
                </Link>
                <Link
                  to="/login"
                  className="font-mono text-[11px] tracking-wider text-text-muted/50 hover:text-doom-glow transition-colors uppercase py-1 flex items-center gap-2"
                >
                  <ChevronRight size={10} />
                  <span>Sign In / Register</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span className="font-mono text-[10px] text-text-muted/30 tracking-wider">
              © 2026 VECTORS Committee. All rights reserved.
            </span>
            <span className="font-mono text-[9px] text-text-muted/20 tracking-wider uppercase">
              Avengers: Doomsday Edition
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
