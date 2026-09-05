import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Search, Filter, Users, Trophy, ExternalLink, Download, Sparkles, AlertCircle } from 'lucide-react'
import { eventsData } from '../data/events'
import { cn } from '../lib/utils'

export default function Schedule() {
  const [activeDay, setActiveDay] = useState('Day 1') // 'Day 1' | 'Day 2'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedBranch, setSelectedBranch] = useState('ALL')
  const [liveEvents, setLiveEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch live backend events to merge live status or capacity info
  useEffect(() => {
    let isMounted = true
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events')
        if (res.ok) {
          const data = await res.json()
          if (isMounted && Array.isArray(data)) {
            setLiveEvents(data)
          }
        }
      } catch (err) {
        console.warn('[Schedule] Backend events fetch fallback to local:', err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchEvents()
    return () => { isMounted = false }
  }, [])

  // Combine static master schedule with dynamic backend metadata (capacity, status)
  const masterSchedule = useMemo(() => {
    return eventsData.map((ev) => {
      const live = liveEvents.find((l) => l.slug === ev.id || l.name?.toLowerCase() === ev.name?.toLowerCase())
      
      // Parse day & time from date string: e.g. "March 15, 2026 // 09:00 IST"
      const isDay1 = ev.date.includes('March 15')
      const day = isDay1 ? 'Day 1' : 'Day 2'
      const timeMatch = ev.date.match(/(\d{2}:\d{2})\s*IST/)
      const time = timeMatch ? timeMatch[1] : '10:00'

      return {
        ...ev,
        day,
        time,
        liveStatus: live?.status || 'upcoming',
        liveCapacity: live?.capacity ?? 100,
        liveRegistered: live?.registrationCount ?? 0,
        registrationOpen: live?.registrationOpen ?? true,
      }
    }).sort((a, b) => a.time.localeCompare(b.time))
  }, [liveEvents])

  // Extract unique branches for filter
  const branchOptions = useMemo(() => {
    const branches = new Set(eventsData.map((e) => e.branch))
    return ['ALL', ...Array.from(branches)]
  }, [])

  // Filter items
  const filteredEvents = useMemo(() => {
    return masterSchedule.filter((ev) => {
      const matchDay = ev.day === activeDay
      const matchSearch =
        ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.venue.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCategory =
        selectedCategory === 'ALL' || ev.category.toUpperCase() === selectedCategory
      const matchBranch =
        selectedBranch === 'ALL' || ev.branch === selectedBranch

      return matchDay && matchSearch && matchCategory && matchBranch
    })
  }, [masterSchedule, activeDay, searchQuery, selectedCategory, selectedBranch])

  // Export Day Schedule to iCal / ICS
  const handleExportSchedule = () => {
    const calendarEvents = filteredEvents.map((ev) => {
      const dateStr = activeDay === 'Day 1' ? '20260315' : '20260316'
      const cleanTime = ev.time.replace(':', '') + '00'
      const startDateTime = `${dateStr}T${cleanTime}Z`
      return `BEGIN:VEVENT\nSUMMARY:VECTORS 26: ${ev.name}\nDESCRIPTION:${ev.description.replace(/\n/g, ' ')}\nLOCATION:${ev.venue}\nDTSTART:${startDateTime}\nSTATUS:CONFIRMED\nEND:VEVENT`
    }).join('\n')

    const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//VECTORS 26 Festival//Schedule//EN\nCALSCALE:GREGORIAN\n${calendarEvents}\nEND:VCALENDAR`
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `VECTORS_26_${activeDay.replace(' ', '_')}_Schedule.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald/10 border border-emerald/20 text-emerald font-mono text-xs uppercase tracking-widest mb-3">
            <Calendar size={13} />
            <span>Master Timeline // 2-Day Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-wider text-bone">
            Festival <span className="text-emerald">Schedule</span>
          </h1>
          <p className="mt-2 text-steel text-sm sm:text-base max-w-2xl">
            Synchronized itinerary for technical challenges, robotics combat, hackathon sprints, and cultural arena showdowns across campus.
          </p>
        </div>

        {/* Calendar Export */}
        <button
          onClick={handleExportSchedule}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-charcoal border border-white/10 hover:border-emerald/50 text-bone hover:text-emerald font-mono text-xs uppercase tracking-wider transition-colors shadow-lg"
          title="Export current view to iCalendar (.ics)"
        >
          <Download size={14} />
          <span>Export {activeDay} (.ics)</span>
        </button>
      </div>

      {/* Day Selector & Search Controls */}
      <div className="space-y-6">
        {/* Day Tabs */}
        <div className="flex items-center gap-3">
          {['Day 1', 'Day 2'].map((day) => {
            const isSelected = activeDay === day
            const dateLabel = day === 'Day 1' ? 'March 15, 2026' : 'March 16, 2026'
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={cn(
                  'flex-1 sm:flex-none px-6 py-3.5 rounded-lg font-mono text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 border flex flex-col items-start gap-1',
                  isSelected
                    ? 'bg-emerald text-doom-bg font-bold border-emerald shadow-lg shadow-emerald/20'
                    : 'bg-charcoal/70 text-steel border-white/10 hover:border-white/20 hover:text-bone'
                )}
              >
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{day}</span>
                </div>
                <span className={cn('text-[10px] tracking-normal', isSelected ? 'text-doom-bg/80' : 'text-steel/60')}>
                  {dateLabel}
                </span>
              </button>
            )
          })}
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-xl bg-charcoal/80 border border-white/[0.06] backdrop-blur-md flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel/50" />
            <input
              type="text"
              placeholder="Search by event title, venue, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-doom-bg/80 border border-white/10 rounded-lg text-bone text-xs sm:text-sm font-mono placeholder:text-steel/40 focus:outline-none focus:border-emerald/50 transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-steel uppercase tracking-wider hidden sm:inline-block mr-1">
              Category:
            </span>
            {['ALL', 'TECHNICAL', 'NON-TECHNICAL'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded text-[11px] font-mono tracking-wider transition-colors border',
                  selectedCategory === cat
                    ? 'bg-white/15 text-bone border-emerald/50'
                    : 'bg-doom-bg/50 text-steel border-white/5 hover:text-bone'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Branch Dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-steel uppercase tracking-wider hidden sm:inline-block">
              Branch:
            </span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-doom-bg/80 border border-white/10 text-bone text-xs font-mono rounded-lg px-3 py-2 focus:outline-none focus:border-emerald/50 cursor-pointer"
            >
              {branchOptions.map((b) => (
                <option key={b} value={b} className="bg-charcoal text-bone">
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative">
        {/* Vertical timeline spine */}
        <div className="hidden md:block absolute left-28 top-4 bottom-4 w-px bg-gradient-to-b from-emerald/40 via-white/10 to-transparent" />

        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-charcoal/40 border border-white/5 rounded-2xl">
            <AlertCircle size={36} className="mx-auto text-steel/40 mb-3" />
            <h3 className="font-display text-lg text-bone uppercase tracking-wider">No Events Found</h3>
            <p className="font-mono text-xs text-steel mt-1 max-w-sm mx-auto">
              No scheduled events match your current filter criteria for {activeDay}. Try resetting filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('ALL')
                setSelectedBranch('ALL')
              }}
              className="mt-4 px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-bone font-mono text-xs transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEvents.map((ev, index) => {
              const isTech = ev.category.toLowerCase() === 'technical'

              return (
                <div
                  key={ev.id}
                  className="relative flex flex-col md:flex-row items-start gap-4 md:gap-8 group"
                >
                  {/* Time Badge (Desktop Left) */}
                  <div className="md:w-28 shrink-0 md:text-right pt-2">
                    <span className="font-mono text-sm sm:text-base font-bold text-emerald group-hover:text-emerald-glow transition-colors tracking-widest block">
                      {ev.time} IST
                    </span>
                    <span className="font-mono text-[10px] text-steel/60 uppercase">
                      {activeDay}
                    </span>
                  </div>

                  {/* Timeline Dot (Desktop) */}
                  <div className="hidden md:flex absolute left-[111px] top-4 w-2.5 h-2.5 rounded-full bg-charcoal border-2 border-emerald group-hover:bg-emerald group-hover:scale-125 transition-all shadow-sm shadow-emerald/50 z-10" />

                  {/* Event Timeline Card */}
                  <div className="flex-1 w-full bg-charcoal/70 hover:bg-charcoal/90 border border-white/[0.07] hover:border-emerald/40 rounded-xl p-5 md:p-6 transition-all duration-300 shadow-lg relative overflow-hidden">
                    {/* Top subtle glow line */}
                    <div className={cn(
                      'absolute top-0 left-0 right-0 h-0.5 opacity-40 group-hover:opacity-100 transition-opacity',
                      isTech ? 'bg-gradient-to-r from-emerald via-emerald/60 to-transparent' : 'bg-gradient-to-r from-amber-400 via-amber-400/60 to-transparent'
                    )} />

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border',
                              isTech
                                ? 'bg-emerald/10 text-emerald border-emerald/20'
                                : 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                            )}
                          >
                            {ev.category}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-steel font-mono text-[10px] tracking-wider uppercase">
                            {ev.branch}
                          </span>
                          {ev.liveStatus === 'ongoing' && (
                            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-mono text-[10px] tracking-wider uppercase animate-pulse">
                              Live Now
                            </span>
                          )}
                        </div>

                        <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-bone group-hover:text-white transition-colors">
                          {ev.name}
                        </h3>
                      </div>

                      <div className="shrink-0 text-left sm:text-right">
                        <span className="font-mono text-xs font-semibold text-emerald">
                          {ev.fee === 'Free' ? 'FREE ENTRY' : ev.fee}
                        </span>
                        {ev.prizePool && (
                          <div className="font-mono text-[11px] text-amber-400/90 flex items-center sm:justify-end gap-1 mt-0.5">
                            <Trophy size={11} />
                            <span>{ev.prizePool}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-steel text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                      {ev.description}
                    </p>

                    {/* Metadata strip */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/[0.04]">
                      <div className="flex flex-wrap items-center gap-4 text-steel font-mono text-xs">
                        <span className="flex items-center gap-1.5 text-steel/80">
                          <MapPin size={13} className="text-emerald/70" />
                          <span>{ev.venue}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-steel/80">
                          <Users size={13} className="text-emerald/70" />
                          <span>{ev.teamSize}</span>
                        </span>
                      </div>

                      <Link
                        to={`/events/${ev.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider uppercase text-emerald hover:text-white transition-colors group/btn"
                      >
                        <span>Event Brief & Register</span>
                        <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
