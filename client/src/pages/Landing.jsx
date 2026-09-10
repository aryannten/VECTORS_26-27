import { useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowRight,
  ArrowDown,
  Cpu,
  Flame,
  Gamepad2,
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
const PILLARS = [
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

const STATS = [
  { label: 'Festival Dates', value: 'March 15–16' },
  { label: 'Prize Pool', value: '₹1,50,000+' },
  { label: 'Active Arenas', value: '7 Sectors' },
  { label: 'Participants', value: '1,500+ Expected' },
]

/* ─── component ────────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate()
  const { user, hasPass } = useAuth()

  const heroRef = useRef(null)
  const heroContentRef = useRef(null)
  const aboutRef = useRef(null)
  const experienceRef = useRef(null)
  const experienceTriggerRef = useRef(null)
  const highlightsRef = useRef(null)
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
      // Hero content parallax & fade
      if (heroContentRef.current) {
        gsap.to(heroContentRef.current, {
          y: -80,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '40% top',
            scrub: true,
          },
        })
      }

      // About section reveals
      if (aboutRef.current) {
        const aboutElements = aboutRef.current.querySelectorAll('.reveal-up')
        gsap.fromTo(
          aboutElements,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: aboutRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Highlights stagger
      if (highlightsRef.current) {
        const cards = highlightsRef.current.querySelectorAll('.highlight-card')
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: highlightsRef.current,
              start: 'top 70%',
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
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
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
          SECTION 01 — HERO  (scroll-driven image sequence)
          ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[250vh]" id="hero">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Canvas background */}
          <ScrollCanvas
            startFrame={1}
            endFrame={30}
            scrubDuration={0.3}
            triggerRef={heroRef}
            className="absolute inset-0"
          />

          {/* Dark overlay for text legibility */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                'linear-gradient(to bottom, rgba(5,6,6,0.25) 0%, rgba(5,6,6,0.45) 40%, rgba(5,6,6,0.7) 75%, #050606 100%)',
            }}
          />

          {/* Cinematic vignette */}
          <div
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 80% 70% at 50% 45%, transparent 30%, rgba(5,6,6,0.6) 100%)',
            }}
          />

          {/* Hero content */}
          <div
            ref={heroContentRef}
            className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6"
          >
            {/* Overline */}
            <div className="mb-5 overflow-hidden">
              <span className="block font-mono text-[10px] sm:text-xs tracking-[0.35em] uppercase text-doom-glow/80">
                Technical Festival 2026 — Avengers: Doomsday
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.9] tracking-[0.05em] uppercase text-center">
              <span className="block text-text-primary drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
                VECTORS
              </span>
            </h1>

            {/* Decorative line */}
            <div className="mt-4 mb-5 w-24 sm:w-32 h-[1px] bg-gradient-to-r from-transparent via-doom-glow/60 to-transparent" />

            {/* Tagline */}
            <p className="font-accent text-sm sm:text-base md:text-lg tracking-[0.2em] uppercase text-chrome-light/90 text-center max-w-lg">
              Where Technology Meets Destiny
            </p>

            {/* Sub-copy */}
            <p className="mt-4 font-body text-xs sm:text-sm text-text-muted/80 text-center max-w-md leading-relaxed">
              Two days. Seven battlegrounds. One stage where minds collide,
              machines awaken, and ideas become reality.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <button
                onClick={handleEntryPass}
                className="doom-btn-primary"
                aria-label={hasPass ? 'View My Entry Pass' : 'Claim Entry Pass'}
              >
                <span className="doom-btn-primary-inner">
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

            {/* Stats bar */}
            <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
              {STATS.map((stat, i) => (
                <div
                  key={i}
                  className="px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] text-center backdrop-blur-sm"
                >
                  <span className="block font-mono text-[9px] tracking-[0.2em] uppercase text-text-muted/60">
                    {stat.label}
                  </span>
                  <span className="block font-display text-sm sm:text-base font-bold text-text-primary mt-0.5">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
              <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-text-muted/40">
                Scroll
              </span>
              <ArrowDown size={14} className="text-text-muted/30" />
            </div>
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
                {
                  icon: Calendar,
                  label: 'When',
                  value: 'March 15–16, 2026',
                },
                {
                  icon: MapPin,
                  label: 'Where',
                  value: 'Campus Main Complex',
                },
                {
                  icon: Users,
                  label: 'Scale',
                  value: '1,500+ participants across 7 sectors',
                },
                {
                  icon: Trophy,
                  label: 'Stakes',
                  value: '₹1,50,000+ in prizes and trophies',
                },
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
          SECTION 03 — VISUAL / EXPERIENCE (sticky scroll sequence)
          ═══════════════════════════════════════════════════════ */}
      <section ref={experienceTriggerRef} id="experience" className="relative h-[350vh]">
        <div ref={experienceRef} className="sticky top-0 h-screen overflow-hidden">
          {/* Canvas with frames 20–50 */}
          <ScrollCanvas
            startFrame={15}
            endFrame={50}
            scrubDuration={0.4}
            triggerRef={experienceTriggerRef}
            className="absolute inset-0"
          />

          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                'linear-gradient(135deg, rgba(5,6,6,0.75) 0%, rgba(5,6,6,0.4) 50%, rgba(5,6,6,0.75) 100%)',
            }}
          />

          {/* Section label and atmospheric text */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 text-center">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-doom-glow/60 mb-4">
              [ 02 // The Experience ]
            </span>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider leading-[1.05]">
              <span className="block text-text-primary/90 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
                The Arena
              </span>
              <span className="block text-doom-glow/80 mt-1 drop-shadow-[0_0_30px_rgba(30,255,160,0.2)]">
                Awaits
              </span>
            </h2>

            <div className="mt-5 w-16 h-[1px] bg-gradient-to-r from-transparent via-doom-glow/50 to-transparent" />

            <p className="mt-5 font-accent text-xs sm:text-sm tracking-[0.2em] uppercase text-chrome-light/60 max-w-md">
              Scroll to witness the convergence of technology, competition, and destiny
            </p>

            {/* Scroll progress indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <div className="w-[1px] h-12 bg-gradient-to-b from-doom-glow/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 04 — HIGHLIGHTS / FEATURES
          ═══════════════════════════════════════════════════════ */}
      <section
        ref={highlightsRef}
        id="highlights"
        className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-8"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="mb-14 text-center">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-doom-glow block mb-3">
              [ 03 // Core Sectors ]
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-text-primary">
              Four Pillars of Battle
            </h2>
            <p className="mt-3 font-body text-sm text-text-muted/70 max-w-lg mx-auto">
              Every sector tests a different dimension of engineering excellence.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PILLARS.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div
                  key={i}
                  className="highlight-card group relative p-6 bg-doom-bg2/80 border border-white/[0.06] hover:border-doom-glow/30 transition-all duration-500 flex flex-col justify-between"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-doom-glow/0 group-hover:via-doom-glow/40 to-transparent transition-all duration-700" />

                  <div className="space-y-4">
                    <div className="w-11 h-11 flex items-center justify-center bg-white/[0.03] border border-white/[0.1] text-doom-glow/60 group-hover:text-doom-glow group-hover:bg-doom-glow/[0.06] group-hover:border-doom-glow/30 transition-all duration-500">
                      <Icon size={20} />
                    </div>

                    <span className="block font-mono text-[9px] tracking-[0.15em] uppercase text-text-muted/50">
                      {pillar.tag}
                    </span>

                    <h3 className="font-display text-base sm:text-lg font-bold text-text-primary tracking-wide group-hover:text-doom-glow transition-colors duration-500">
                      {pillar.title}
                    </h3>

                    <p className="font-body text-xs text-text-muted/70 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="font-mono text-[10px] text-text-muted/40 tracking-wider">
                      SECTOR 0{i + 1}
                    </span>
                    <ChevronRight
                      size={12}
                      className="text-doom-glow/30 group-hover:text-doom-glow group-hover:translate-x-1 transition-all duration-300"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 05 — EVENTS & SCHEDULE
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
                [ 04 // Event Arsenal ]
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-text-primary">
                Two Days. Seven Battlegrounds.
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
