import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Search, ChevronLeft, ChevronRight, Download, Filter, Users, Calendar, AlertCircle } from 'lucide-react'
import { eventsData } from '../../data/events'

/**
 * AdminEventRegistrations — Paginated table of event-specific registrations with CSV export.
 */
export default function AdminEventRegistrations() {
  const { getToken } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [selectedEvent, setSelectedEvent] = useState('')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchRegistrations(1, search, selectedEvent)
  }, [selectedEvent])

  const fetchRegistrations = async (page = 1, searchTerm = '', eventSlug = '') => {
    setLoading(true)
    try {
      const token = await getToken()
      const params = new URLSearchParams({
        page,
        limit: 15,
        search: searchTerm,
        eventSlug,
      })
      const res = await fetch(`/api/admin/event-registrations?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setRegistrations(data.registrations || [])
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 })
      }
    } catch (err) {
      console.error('Failed to fetch event registrations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRegistrations(1, search, selectedEvent)
  }

  const handleExportCsv = async () => {
    setExporting(true)
    try {
      const token = await getToken()
      const params = new URLSearchParams()
      if (selectedEvent) params.append('eventSlug', selectedEvent)

      const res = await fetch(`/api/admin/event-registrations/export?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `vectors_event_registrations_${selectedEvent || 'all'}_${Date.now()}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        alert('Failed to generate export file.')
      }
    } catch (err) {
      console.error('Export error:', err)
      alert('Error exporting registrations.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-widest text-bone uppercase">Event Registrations</h1>
          <p className="font-mono text-xs text-steel mt-1">{pagination.total} total event submissions</p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCsv}
          disabled={exporting || pagination.total === 0}
          className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal border border-white/10 hover:border-emerald/50 text-bone hover:text-emerald font-mono text-xs uppercase tracking-wider rounded transition-colors disabled:opacity-40"
        >
          <Download size={14} className={exporting ? 'animate-bounce text-emerald' : ''} />
          <span>{exporting ? 'Generating...' : 'Export CSV'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Event Selector */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-steel/60" />
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="bg-charcoal border border-white/10 rounded px-3 py-2 text-xs font-mono text-bone focus:outline-none focus:border-emerald/50 cursor-pointer"
          >
            <option value="">All Events</option>
            {eventsData.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="w-full sm:w-auto flex gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel/40" />
            <input
              type="text"
              placeholder="Search user, email, team..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-charcoal border border-white/10 rounded font-mono text-xs text-bone placeholder:text-steel/30 focus:outline-none focus:border-emerald/50"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-white/5 border border-white/10 hover:border-white/20 text-steel hover:text-bone font-mono text-xs rounded transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Registrations Table */}
      <div className="border border-white/10 rounded-lg overflow-hidden bg-charcoal/40 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-steel uppercase">Event & ID</th>
                <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-steel uppercase">Participant</th>
                <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-steel uppercase">Contact</th>
                <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-steel uppercase">Team Details</th>
                <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-steel uppercase">Status</th>
                <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-steel uppercase">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-steel font-mono text-xs">
                    Loading registrations...
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-steel font-mono text-xs">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-display text-xs text-bone tracking-wider font-semibold">
                        {reg.eventName}
                      </div>
                      <div className="font-mono text-[10px] text-emerald tracking-wider mt-0.5">
                        {reg.registrationId}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-xs text-bone font-medium">{reg.userName}</div>
                      <div className="font-mono text-[10px] text-steel">{reg.userCollege || 'N/A'}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-mono text-xs text-steel">{reg.userEmail}</div>
                      <div className="font-mono text-[10px] text-steel/60">{reg.userPhone || '—'}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      {reg.teamName ? (
                        <div>
                          <span className="font-mono text-xs text-amber-400 font-medium">
                            {reg.teamName}
                          </span>
                          {reg.teamMembers && reg.teamMembers.length > 0 && (
                            <span className="block font-mono text-[10px] text-steel mt-0.5">
                              +{reg.teamMembers.length} member(s)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-steel/40">Solo Entry</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-emerald/10 text-emerald border border-emerald/20">
                        {reg.status || 'confirmed'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[11px] text-steel whitespace-nowrap">
                      {new Date(reg.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between font-mono text-xs text-steel">
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchRegistrations(pagination.page - 1, search, selectedEvent)}
                className="p-1.5 rounded hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchRegistrations(pagination.page + 1, search, selectedEvent)}
                className="p-1.5 rounded hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
