import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Cpu, 
  Gamepad2, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Users, 
  Search, 
  Filter, 
  X, 
  RotateCcw, 
  CheckCircle2, 
  Clock 
} from 'lucide-react'
import { cn } from '../lib/utils'
import { eventsData } from '../data/events'
import { useAuth } from '../contexts/AuthContext'
import EntryPassGate from '../components/EntryPassGate'

/**
 * Events — VECTORS 26–27 Event Vaults & Discovery
 * Features:
 * - Real-time keyword search (name, rules, description)
 * - Multi-filter: Category, Department/Branch, Participation Mode (Solo/Team), and Status
 * - Reactive empty states with "Reset Filters"
 * - Live capacity status badges
 * - Strict Entry Pass gating
 */
export default function Events() {
  const { user, hasPass, passLoading, checkPassStatus } = useAuth()
  const [verificationError, setVerificationError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')?.toLowerCase()

  const [allEvents, setAllEvents] = useState(eventsData)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBranch, setSelectedBranch] = useState('ALL')
  const [selectedMode, setSelectedMode] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')

  // Fetch live events from API with fallback to static eventsData
  useEffect(() => {
    fetch('/api/events')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAllEvents(data)
        }
      })
      .catch(() => {})
  }, [])

  // Selected category state ('technical' | 'non-technical' | null)
  const activeCategory = useMemo(() => {
    if (categoryParam === 'technical' || categoryParam === 'non-technical') {
      return categoryParam
    }
    return null
  }, [categoryParam])

  // Split datasets
  const techEvents = useMemo(() => allEvents.filter(e => e.category?.toLowerCase() === 'technical'), [allEvents])
  const nonTechEvents = useMemo(() => allEvents.filter(e => e.category?.toLowerCase() === 'non-technical'), [allEvents])

  // Available branches
  const availableBranches = useMemo(() => {
    const list = activeCategory ? (activeCategory === 'technical' ? techEvents : nonTechEvents) : allEvents
    const branches = new Set(['ALL'])
    list.forEach(e => {
      if (e.branch) {
        e.branch.split('/').forEach(b => branches.add(b.trim()))
      }
    })
    return Array.from(branches)
  }, [activeCategory, techEvents, nonTechEvents, allEvents])

  // Comprehensive reactive filtering
  const currentEvents = useMemo(() => {
    let list = activeCategory
      ? (activeCategory === 'technical' ? techEvents : nonTechEvents)
      : allEvents

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(e => 
        e.name.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q)) ||
        (e.branch && e.branch.toLowerCase().includes(q)) ||
        (e.rules && e.rules.some(r => r.toLowerCase().includes(q)))
      )
    }

    // 2. Branch Filter
    if (selectedBranch !== 'ALL') {
      list = list.filter(e => e.branch && e.branch.toLowerCase().includes(selectedBranch.toLowerCase()))
    }

    // 3. Participation Mode
    if (selectedMode === 'Solo') {
      list = list.filter(e => e.teamSize?.toLowerCase().includes('solo') || e.maxTeamSize === 1)
    } else if (selectedMode === 'Team') {
      list = list.filter(e => !e.teamSize?.toLowerCase().includes('solo') || (e.maxTeamSize && e.maxTeamSize > 1))
    }

    // 4. Status
    if (selectedStatus === 'Open') {
      list = list.filter(e => e.status === 'open' || e.status === 'almost_full' || e.registrationOpen !== false)
    } else if (selectedStatus === 'Full') {
      list = list.filter(e => e.status === 'full')
    }

    return list
  }, [activeCategory, techEvents, nonTechEvents, allEvents, searchQuery, selectedBranch, selectedMode, selectedStatus])

  const handleSelectCategory = (cat) => {
    setSelectedBranch('ALL')
    setSearchParams({ category: cat }, { replace: false })
  }

  const handleClearCategory = () => {
    setSelectedBranch('ALL')
    setSearchParams({}, { replace: false })
  }

  const resetAllFilters = () => {
    setSearchQuery('')
    setSelectedBranch('ALL')
    setSelectedMode('ALL')
    setSelectedStatus('ALL')
  }

  const hasActiveFilters = searchQuery.trim() !== '' || selectedBranch !== 'ALL' || selectedMode !== 'ALL' || selectedStatus !== 'ALL'

  // Gate: If pass status is loading, render clearance scanner
  if (passLoading) {
    return <EntryPassGate user={user} loading={true} />
  }

  // Gate: If user does not possess an active Entry Pass, block access strictly
  if (!hasPass) {
    return (
      <EntryPassGate
        user={user}
        loading={false}
        error={verificationError}
        onRetry={async () => {
          setVerificationError(null)
          try {
            await checkPassStatus(user)
          } catch (err) {
            setVerificationError(err.message || 'Verification failed.')
          }
        }}
      />
    )
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
              {/* Contextual Navigation & Breadcrumb */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-muted hover:text-doom-glow transition-colors cursor-pointer py-1.5 px-3 bg-white/[0.04] border border-white/[0.08] hover:border-doom-glow/30"
                >
                  <ArrowLeft size={13} />
                  <span>Return to Home</span>
                </Link>

                <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-text-muted">
                  <Link to="/" className="hover:text-doom-glow transition-colors">Home</Link>
                  <span className="text-white/30">/</span>
                  <span className="text-doom-glow font-bold">Events</span>
                </nav>
              </div>

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
                    <div className="absolute top-0 right-0 w-64 h-64 bg-doom-glow/5 rounded-full blur-3xl pointer-events-none group-hover:bg-doom-glow/15 transition-all duration-500" />
                    
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

                    <div className="relative z-10 py-6 sm:py-8 space-y-4">
                      <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-wider text-text-primary group-hover:text-doom-glow transition-colors">
                        TECHNICAL EVENTS
                      </h2>
                      <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
                        Where algorithms clash and machines awaken. Dive into 24-hour hackathons, kinetic combat robotics, hardware circuitry gauntlets, and competitive coding sprints.
                      </p>

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
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-doom-glow/15 transition-all duration-500" />
                    
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

                    <div className="relative z-10 py-6 sm:py-8 space-y-4">
                      <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-wider text-text-primary group-hover:text-doom-glow transition-colors">
                        NON-TECHNICAL EVENTS
                      </h2>
                      <p className="font-body text-sm sm:text-base text-text-muted leading-relaxed">
                        Where strategy, reflexes, and raw stage presence take the spotlight. Compete in high-stakes esports tournaments, rapid-fire pop trivia gauntlets, and creative performance arenas.
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {['ESPORTS', 'VALORANT / BGMI', 'TRIVIA', 'STAGE ARTS', 'CASUAL GAMING'].map(tag => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] tracking-wider text-chrome-light px-2 py-1 bg-white/[0.04] border border-white/[0.08]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

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
               SCENARIO 2: CATEGORY EVENT LISTING WITH DISCOVERY BAR
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
                      <Cpu size={15} />
                      <span>Technical ({techEvents.length})</span>
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
                      <Gamepad2 size={15} />
                      <span>Non-Technical ({nonTechEvents.length})</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar & Multi-Filter Matrix */}
                <div className="space-y-4 pt-2">
                  {/* Search Input */}
                  <div className="relative w-full">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search protocols by name, discipline, keywords, or rules..."
                      className="w-full bg-doom-bg2 border border-white/[0.12] text-text-primary pl-11 pr-10 py-3 font-mono text-xs sm:text-sm focus:outline-none focus:border-doom-glow focus:ring-1 focus:ring-doom-glow transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white p-1"
                        aria-label="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Filter Controls Row */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                    {/* Branch Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted mr-1">Branch:</span>
                      {availableBranches.map((branch) => (
                        <button
                          key={branch}
                          onClick={() => setSelectedBranch(branch)}
                          className={cn(
                            'px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase transition-all duration-200 cursor-pointer',
                            selectedBranch === branch
                              ? 'bg-doom-glow text-doom-bg font-bold border border-doom-glow'
                              : 'bg-white/[0.04] text-text-muted border border-white/[0.08] hover:border-white/20'
                          )}
                        >
                          {branch}
                        </button>
                      ))}
                    </div>

                    {/* Mode & Reset */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Solo / Team Filter */}
                      <select
                        value={selectedMode}
                        onChange={(e) => setSelectedMode(e.target.value)}
                        className="bg-doom-bg2 border border-white/[0.12] text-text-primary font-mono text-xs px-2.5 py-1 focus:outline-none focus:border-doom-glow cursor-pointer"
                      >
                        <option value="ALL">All Modes</option>
                        <option value="Solo">Solo</option>
                        <option value="Team">Team</option>
                      </select>

                      {hasActiveFilters && (
                        <button
                          onClick={resetAllFilters}
                          className="inline-flex items-center gap-1.5 font-mono text-xs text-doom-crimson-bright hover:underline px-2 py-1 cursor-pointer"
                        >
                          <RotateCcw size={12} />
                          <span>Clear Filters</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Event Cards Grid or Empty State */}
              {currentEvents.length === 0 ? (
                <div className="py-16 px-6 text-center bg-doom-bg2 border border-white/[0.08] doom-btn-clipped max-w-md mx-auto space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-text-muted">
                    <Filter size={20} />
                  </div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-wider text-text-primary">
                    NO MATCHING PROTOCOLS
                  </h3>
                  <p className="font-mono text-xs text-text-muted leading-relaxed">
                    No events matched your current search and filter criteria. Try resetting your filters to discover all available sectors.
                  </p>
                  <button
                    onClick={resetAllFilters}
                    className="py-2.5 px-5 bg-doom-glow text-doom-bg font-mono text-xs uppercase tracking-wider font-bold hover:bg-white transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentEvents.map((evt) => (
                    <Link
                      key={evt.slug || evt.id}
                      to={`/events/${evt.slug || evt.id}`}
                      className="group p-6 bg-doom-bg2 border border-white/[0.08] doom-btn-clipped hover:border-doom-glow/50 transition-all flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-doom-glow uppercase tracking-widest px-2 py-0.5 bg-doom-glow/10 border border-doom-glow/30 font-bold">
                            {evt.branch || 'Open to All'}
                          </span>
                          <span className="font-mono text-[10px] text-text-muted uppercase">
                            {evt.teamSize || 'Individual'}
                          </span>
                        </div>

                        <h3 className="font-display text-xl font-bold uppercase tracking-wide text-text-primary group-hover:text-doom-glow transition-colors">
                          {evt.name}
                        </h3>

                        <p className="font-body text-xs text-text-muted line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                        <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-text-muted">
                          <div className="flex items-center gap-1.5 truncate">
                            <Calendar size={12} className="text-doom-glow shrink-0" />
                            <span className="truncate">{evt.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin size={12} className="text-doom-glow shrink-0" />
                            <span className="truncate">{evt.venue}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="font-mono text-xs text-text-primary font-bold">
                            {evt.fee}
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono text-xs text-doom-glow group-hover:translate-x-1 transition-transform">
                            <span>ACCESS VAULT</span>
                            <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
