import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Pin, Tag, Calendar, Search, RefreshCw, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { cn } from '../lib/utils'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const fetchAnnouncements = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const res = await fetch('/api/announcements')
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('[Announcements] Fetch error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const categories = ['ALL', 'GENERAL', 'SCHEDULE', 'ALERT', 'RULES', 'EMERGENCY']

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const matchCat =
        selectedCategory === 'ALL' ||
        item.category.toUpperCase() === selectedCategory

      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchCat && matchSearch
    })
  }, [announcements, selectedCategory, searchQuery])

  const pinnedItems = filteredAnnouncements.filter((a) => a.isPinned)
  const standardItems = filteredAnnouncements.filter((a) => !a.isPinned)

  const getCategoryBadgeClass = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'emergency':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'alert':
        return 'bg-amber-400/20 text-amber-400 border-amber-400/30'
      case 'schedule':
        return 'bg-blue-400/20 text-blue-400 border-blue-400/30'
      case 'rules':
        return 'bg-purple-400/20 text-purple-400 border-purple-400/30'
      default:
        return 'bg-emerald/10 text-emerald border-emerald/20'
    }
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald/10 border border-emerald/20 text-emerald font-mono text-xs uppercase tracking-widest mb-3">
            <Bell size={13} />
            <span>Official Dispatches // Live Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-wider text-bone">
            Official <span className="text-emerald">Announcements</span>
          </h1>
          <p className="mt-2 text-steel text-sm sm:text-base max-w-xl">
            Critical festival updates, schedule adjustments, rule clarifications, and room assignments issued by the VECTORS Command Council.
          </p>
        </div>

        <button
          onClick={() => fetchAnnouncements(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-charcoal border border-white/10 hover:border-emerald/50 text-bone font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
        >
          <RefreshCw size={13} className={cn(refreshing && 'animate-spin text-emerald')} />
          <span>{refreshing ? 'Syncing...' : 'Sync Feed'}</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel/50" />
          <input
            type="text"
            placeholder="Search announcements, key terms, or updates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-charcoal/80 border border-white/10 rounded-xl text-bone text-xs sm:text-sm font-mono placeholder:text-steel/40 focus:outline-none focus:border-emerald/50 transition-colors backdrop-blur-md"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-all border',
                selectedCategory === cat
                  ? 'bg-emerald text-doom-bg font-bold border-emerald shadow-md shadow-emerald/20'
                  : 'bg-charcoal/80 text-steel border-white/5 hover:border-white/20 hover:text-bone'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="space-y-4 py-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-xl bg-charcoal/40 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="text-center py-20 bg-charcoal/40 border border-white/5 rounded-2xl">
          <Bell size={36} className="mx-auto text-steel/40 mb-3" />
          <h3 className="font-display text-lg text-bone uppercase tracking-wider">No Announcements Found</h3>
          <p className="font-mono text-xs text-steel mt-1 max-w-sm mx-auto">
            There are currently no official announcements matching your search query or filter criteria.
          </p>
          {(searchQuery || selectedCategory !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('ALL')
              }}
              className="mt-4 px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-bone font-mono text-xs transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned Announcements */}
          {pinnedItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-amber-400 uppercase tracking-widest px-1">
                <Pin size={13} className="rotate-45" />
                <span>Pinned High-Priority Broadcasts</span>
              </div>

              {pinnedItems.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl p-6 bg-charcoal/90 border-2 border-amber-400/40 shadow-xl shadow-amber-400/5 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-transparent" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono text-[10px] uppercase font-bold tracking-wider">
                        <Pin size={10} className="rotate-45" />
                        Pinned
                      </span>
                      <span className={cn('px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider border', getCategoryBadgeClass(item.category))}>
                        {item.category}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] text-steel">
                      {new Date(item.publishedAt || item.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold uppercase tracking-wider text-bone mb-3 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-steel-light text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {item.content}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-steel">
                    <span>Issued by: <span className="text-bone">{item.author || 'Command Council'}</span></span>

                    {item.relatedEventSlug && (
                      <Link
                        to={`/events/${item.relatedEventSlug}`}
                        className="inline-flex items-center gap-1.5 text-emerald hover:text-white transition-colors"
                      >
                        <span>Related Event Protocol</span>
                        <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Standard Announcements */}
          {standardItems.length > 0 && (
            <div className="space-y-4">
              {pinnedItems.length > 0 && (
                <div className="flex items-center gap-2 font-mono text-xs text-steel uppercase tracking-widest px-1 pt-2">
                  <Bell size={13} />
                  <span>General Dispatches</span>
                </div>
              )}

              {standardItems.map((item) => (
                <div
                  key={item._id}
                  className="rounded-xl p-6 bg-charcoal/70 hover:bg-charcoal/90 border border-white/[0.07] hover:border-emerald/40 transition-all duration-200 shadow-lg relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span className={cn('w-fit px-2 py-0.5 rounded font-mono text-[10px] uppercase tracking-wider border', getCategoryBadgeClass(item.category))}>
                      {item.category}
                    </span>

                    <span className="font-mono text-[11px] text-steel">
                      {new Date(item.publishedAt || item.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-bone mb-2">
                    {item.title}
                  </h3>

                  <p className="text-steel text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {item.content}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-steel">
                    <span>Issued by: <span className="text-bone">{item.author || 'Command Council'}</span></span>

                    {item.relatedEventSlug && (
                      <Link
                        to={`/events/${item.relatedEventSlug}`}
                        className="inline-flex items-center gap-1.5 text-emerald hover:text-white transition-colors"
                      >
                        <span>Related Event Protocol</span>
                        <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
