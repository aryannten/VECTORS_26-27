import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Cpu, 
  Gamepad2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  Layers, 
  Calendar, 
  MapPin, 
  Users, 
  Filter
} from 'lucide-react'
import { cn } from '../lib/utils'
import { eventsData } from '../data/events'

/**
 * Events — VECTORS 26 "Doomsday Protocol" Event Vaults
 * 
 * UX Flow:
 * 1. Initial State: Displays two prominent category cards:
 *    - Technical Events
 *    - Non-Technical Events
 * 2. Category Selected: Shows filtered event cards with a category switcher tab bar.
 * 3. Individual Event: Routes cleanly to /events/:eventId.
 */
export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')?.toLowerCase()

  // Selected category state ('technical' | 'non-technical' | null)
  const activeCategory = useMemo(() => {
    if (categoryParam === 'technical' || categoryParam === 'non-technical') {
      return categoryParam
    }
    return null
  }, [categoryParam])

  // Optional branch filter
  const [selectedBranch, setSelectedBranch] = useState('ALL')

  // Counts
  const techEvents = useMemo(() => eventsData.filter(e => e.category.toLowerCase() === 'technical'), [])
  const nonTechEvents = useMemo(() => eventsData.filter(e => e.category.toLowerCase() === 'non-technical'), [])

  // Filtered event list
  const currentEvents = useMemo(() => {
    if (!activeCategory) return []
    const list = activeCategory === 'technical' ? techEvents : nonTechEvents
    if (selectedBranch === 'ALL') return list
    return list.filter(e => e.branch.toLowerCase().includes(selectedBranch.toLowerCase()))
  }, [activeCategory, techEvents, nonTechEvents, selectedBranch])

  // Available branches for current category
  const availableBranches = useMemo(() => {
    if (!activeCategory) return []
    const list = activeCategory === 'technical' ? techEvents : nonTechEvents
    const branches = new Set(['ALL'])
    list.forEach(e => {
      e.branch.split('/').forEach(b => branches.add(b.trim()))
    })
    return Array.from(branches)
  }, [activeCategory, techEvents, nonTechEvents])

  // Category Switch Handler — push to history stack so browser back works naturally
  const handleSelectCategory = (cat) => {
    setSelectedBranch('ALL')
    setSearchParams({ category: cat }, { replace: false })
  }

  const handleClearCategory = () => {
    setSelectedBranch('ALL')
    setSearchParams({}, { replace: false })
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20 relative z-10">
      <div className="max-w-6xl mx-auto">

        {/* ====================================================
            SCENARIO 1: CATEGORY SELECTION GATEWAY (Initial View)
            ==================================================== */}
        <AnimatePresence mode="wait">
          {!activeCategory ? (
            <motion.div
              key="category-gate"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-10 sm:space-y-14"
            >
              {/* Contextual Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-text-muted">
                <Link to="/" className="hover:text-doom-glow transition-colors">Home</Link>
                <span className="text-white/30">/</span>
                <span className="text-doom-glow font-bold">Events</span>
              </nav>

              {/* Header */}
              <div className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-doom-bg2 border border-doom-glow/30">
                  <span className="w-2 h-2 rounded-full bg-doom-glow animate-pulse" />
                  <span className="font-mono text-[10px] sm:text-xs text-doom-glow tracking-[0.2em] uppercase">
                    SYS // SECTOR PROTOCOL DISCOVERY
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider text-text-primary drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
                  SELECT YOUR DISCIPLINE
                </h1>

                <p className="font-accent text-xs sm:text-sm tracking-[0.25em] text-chrome-light uppercase">
                  — TWO ARENAS. ONE DESTINY. —
                </p>

                <p className="font-body text-sm sm:text-base text-text-muted max-w-lg mx-auto leading-relaxed pt-1">
                  Choose your sector to access active event vaults, technical guidelines, and team registration portals.
                </p>
              </div>

              {/* Two Prominent Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                
                {/* 1. TECHNICAL EVENTS CARD */}
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectCategory('technical')}
                  className="relative p-[1.5px] doom-btn-clipped group cursor-pointer bg-gradient-to-b from-white/15 via-doom-glow/30 to-white/5 hover:from-doom-glow hover:via-doom-glow-muted hover:to-doom-glow transition-all duration-500 shadow-[0_10px_35px_rgba(0,0,0,0.7)]"
                >
                  <div className="h-full p-6 sm:p-8 md:p-10 doom-btn-clipped bg-doom-bg2 flex flex-col justify-between relative overflow-hidden">
                    {/* Background Radial Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-doom-glow/5 rounded-full blur-3xl pointer-events-none group-hover:bg-doom-glow/15 transition-all duration-500" />
                    
                    {/* Top Telemetry */}
                    <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-sm bg-doom-glow/10 border border-doom-glow/40 flex items-center justify-center text-doom-glow">
                          <Cpu size={18} />
                        </div>
                        <span className="font-mono text-xs text-doom-glow tracking-widest uppercase font-bold">
                          SECTOR // 01
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-text-muted tracking-wider px-2 py-0.5 bg-white/[0.03] border border-white/[0.06]">
                        {techEvents.length} ACTIVE PROTOCOLS
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="relative z-10 py-6 sm:py-8 space-y-4">
                      <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-wider text-text-primary group-hover:text-doom-glow transition-colors">
                        TECHNICAL EVENTS
                      </h2>
                      <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
                        Where algorithms clash and machines awaken. Dive into high-pressure 24-hour hackathons, kinetic combat robotics, hardware circuitry gauntlets, and competitive coding sprints.
                      </p>

                      {/* Disciplines Tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {['CSE', 'IT', 'AIML', 'EXTC', 'MECHANICAL', 'CIVIL'].map(tag => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] tracking-wider text-chrome-light px-2 py-1 bg-white/[0.04] border border-white/[0.08]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="relative z-10 pt-6 border-t border-white/[0.08] flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-widest text-text-muted group-hover:text-white transition-colors">
                        ENTER SECTOR 01
                      </span>
                      <div className="flex items-center gap-2 text-doom-glow font-mono text-xs tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                        <span>ACCESS VAULTS</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 2. NON-TECHNICAL EVENTS CARD */}
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectCategory('non-technical')}
                  className="relative p-[1.5px] doom-btn-clipped group cursor-pointer bg-gradient-to-b from-white/15 via-white/20 to-white/5 hover:from-doom-glow hover:via-doom-glow-muted hover:to-doom-glow transition-all duration-500 shadow-[0_10px_35px_rgba(0,0,0,0.7)]"
                >
                  <div className="h-full p-6 sm:p-8 md:p-10 doom-btn-clipped bg-doom-bg2 flex flex-col justify-between relative overflow-hidden">
                    {/* Background Radial Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-doom-glow/15 transition-all duration-500" />
                    
                    {/* Top Telemetry */}
                    <div className="relative z-10 flex items-center justify-between pb-6 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-sm bg-white/[0.06] border border-white/20 flex items-center justify-center text-chrome-light group-hover:text-doom-glow group-hover:border-doom-glow/40 transition-colors">
                          <Gamepad2 size={18} />
                        </div>
                        <span className="font-mono text-xs text-chrome-light group-hover:text-doom-glow tracking-widest uppercase font-bold transition-colors">
                          SECTOR // 02
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-text-muted tracking-wider px-2 py-0.5 bg-white/[0.03] border border-white/[0.06]">
                        {nonTechEvents.length} ACTIVE PROTOCOLS
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="relative z-10 py-6 sm:py-8 space-y-4">
                      <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-wider text-text-primary group-hover:text-doom-glow transition-colors">
                        NON-TECHNICAL EVENTS
                      </h2>
                      <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
                        Where strategy, reflexes, and raw stage presence take the spotlight. Compete in high-stakes esports tournaments, rapid-fire pop trivia gauntlets, and creative performance arenas.
                      </p>

                      {/* Disciplines Tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {['ESPORTS', 'BGMI / VALORANT', 'TRIVIA', 'STAGE ARTS', 'CASUAL GAMING'].map(tag => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] tracking-wider text-chrome-light px-2 py-1 bg-white/[0.04] border border-white/[0.08]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="relative z-10 pt-6 border-t border-white/[0.08] flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-widest text-text-muted group-hover:text-white transition-colors">
                        ENTER SECTOR 02
                      </span>
                      <div className="flex items-center gap-2 text-doom-glow font-mono text-xs tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                        <span>ACCESS VAULTS</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          ) : (
            /* ====================================================
               SCENARIO 2: CATEGORY EVENT LISTING WITH SWITCHER
               ==================================================== */
            <motion.div
              key="event-listing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8 sm:space-y-10"
            >
              {/* Top Navigation & Category Switcher Bar */}
              <div className="flex flex-col gap-5 border-b border-white/[0.08] pb-6">
                
                {/* Upper row: Breadcrumbs & Return button */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-text-muted">
                    <Link to="/" className="hover:text-doom-glow transition-colors">Home</Link>
                    <span className="text-white/30">/</span>
                    <button
                      onClick={handleClearCategory}
                      className="hover:text-doom-glow transition-colors cursor-pointer"
                    >
                      Events
                    </button>
                    <span className="text-white/30">/</span>
                    <span className="text-doom-glow font-bold uppercase">
                      {activeCategory === 'technical' ? 'Technical Events' : 'Non-Technical Events'}
                    </span>
                  </nav>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleClearCategory}
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-muted hover:text-doom-glow transition-colors cursor-pointer py-1.5 px-3 bg-white/[0.04] border border-white/[0.08] hover:border-doom-glow/30"
                    >
                      <ArrowLeft size={13} />
                      <span>Change Sector</span>
                    </button>

                    <span className="font-mono text-[11px] tracking-wider text-doom-glow bg-doom-glow/10 px-2.5 py-1 border border-doom-glow/30 hidden sm:inline-block">
                      {activeCategory === 'technical' ? 'SECTOR // 01' : 'SECTOR // 02'}
                    </span>
                  </div>
                </div>

                {/* Primary Category Switcher Tabs */}
                <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                  <div className="inline-flex p-1 bg-doom-bg2 border border-white/[0.08] doom-btn-clipped">
                    <button
                      onClick={() => handleSelectCategory('technical')}
                      className={cn(
                        'flex items-center gap-2.5 px-4 sm:px-6 py-2.5 font-mono text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer',
                        activeCategory === 'technical'
                          ? 'bg-doom-bg text-doom-glow border border-doom-glow/40 shadow-[0_0_15px_rgba(30,255,160,0.25)] font-bold'
                          : 'text-text-muted hover:text-white'
                      )}
                    >
                      <Cpu size={15} className={activeCategory === 'technical' ? 'text-doom-glow' : 'text-text-muted'} />
                      <span>Technical Events ({techEvents.length})</span>
                    </button>

                    <button
                      onClick={() => handleSelectCategory('non-technical')}
                      className={cn(
                        'flex items-center gap-2.5 px-4 sm:px-6 py-2.5 font-mono text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer',
                        activeCategory === 'non-technical'
                          ? 'bg-doom-bg text-doom-glow border border-doom-glow/40 shadow-[0_0_15px_rgba(30,255,160,0.25)] font-bold'
                          : 'text-text-muted hover:text-white'
                      )}
                    >
                      <Gamepad2 size={15} className={activeCategory === 'non-technical' ? 'text-doom-glow' : 'text-text-muted'} />
                      <span>Non-Technical Events ({nonTechEvents.length})</span>
                    </button>
                  </div>

                  {/* Branch filter pills */}
                  {availableBranches.length > 2 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider mr-1 flex items-center gap-1">
                        <Filter size={11} />
                        Branch:
                      </span>
                      {availableBranches.map(branch => (
                        <button
                          key={branch}
                          onClick={() => setSelectedBranch(branch)}
                          className={cn(
                            'font-mono text-[10px] sm:text-xs px-2.5 py-1 tracking-wider uppercase transition-colors cursor-pointer',
                            selectedBranch === branch
                              ? 'bg-doom-glow/15 text-doom-glow border border-doom-glow/40 font-bold'
                              : 'bg-white/[0.02] text-text-muted border border-white/[0.06] hover:text-white'
                          )}
                        >
                          {branch}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section Title */}
                <div className="pt-2">
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-wider text-text-primary">
                    {activeCategory === 'technical' ? 'Technical Protocols' : 'Non-Technical Protocols'}
                  </h2>
                  <p className="font-body text-xs sm:text-sm text-text-muted mt-1">
                    {activeCategory === 'technical'
                      ? 'Competitive engineering challenges, coding sprints, hardware design, and robotics.'
                      : 'Casual competitions, strategy gauntlets, stage performances, and esports tournaments.'}
                  </p>
                </div>
              </div>

              {/* Event Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentEvents.length === 0 ? (
                  <div className="col-span-full py-16 text-center border border-white/[0.06] bg-doom-bg2/40 p-8">
                    <p className="font-mono text-sm text-text-muted">No events matching the selected criteria.</p>
                    <button
                      onClick={() => setSelectedBranch('ALL')}
                      className="mt-4 font-mono text-xs text-doom-glow underline tracking-wider cursor-pointer"
                    >
                      Reset branch filter
                    </button>
                  </div>
                ) : (
                  currentEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link
                        to={`/events/${event.id}`}
                        className="block h-full relative doom-btn-clipped p-[1px] bg-gradient-to-b from-white/10 to-white/5 hover:from-doom-glow hover:to-doom-glow-muted transition-all duration-300 group"
                        id={`event-${event.id}`}
                      >
                        <div className="h-full p-6 sm:p-7 doom-btn-clipped bg-doom-bg2 flex flex-col justify-between relative overflow-hidden">
                          
                          {/* Top Badges: Category & Branch Alignment */}
                          <div>
                            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                              <span className="font-mono text-[10px] tracking-widest text-doom-glow px-2 py-0.5 bg-doom-glow/10 border border-doom-glow/30 uppercase font-bold">
                                {event.category}
                              </span>

                              {/* Branch Alignment Badge */}
                              <span className="font-mono text-[10px] tracking-wider text-chrome-light px-2 py-0.5 bg-white/[0.04] border border-white/[0.08] uppercase">
                                Branch: <strong className="text-text-primary font-semibold">{event.branch}</strong>
                              </span>
                            </div>

                            {/* Event Title */}
                            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-wide text-text-primary group-hover:text-doom-glow transition-colors">
                              {event.name}
                            </h3>

                            {/* Description */}
                            <p className="font-body text-xs sm:text-sm text-text-muted mt-3 leading-relaxed line-clamp-3">
                              {event.description}
                            </p>
                          </div>

                          {/* Telemetry metadata row */}
                          <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                              <div>
                                <span className="text-[10px] text-text-muted uppercase block">Fee</span>
                                <span className="text-chrome-light font-bold">{event.fee}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-text-muted uppercase block">Team</span>
                                <span className="text-chrome-light">{event.teamSize}</span>
                              </div>
                              <div className="col-span-2 sm:col-span-2">
                                <span className="text-[10px] text-text-muted uppercase block">Venue</span>
                                <span className="text-chrome-light truncate block">{event.venue}</span>
                              </div>
                            </div>

                            {/* Action Link */}
                            <div className="flex items-center justify-between pt-2">
                              <span className="font-mono text-[11px] tracking-widest text-text-muted uppercase group-hover:text-white transition-colors">
                                Access Event Vault
                              </span>
                              <span className="text-doom-glow text-sm font-bold group-hover:translate-x-1.5 transition-transform duration-200">
                                →
                              </span>
                            </div>
                          </div>

                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
