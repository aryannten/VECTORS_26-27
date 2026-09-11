import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Check, 
  X, 
  RefreshCw, 
  Sliders,
  Search
} from 'lucide-react'

/**
 * AdminEvents — Real-time event status and registration command console.
 * Enables live event reconfiguration via backend PUT /api/admin/events/:id.
 */
export default function AdminEvents() {
  const { getToken } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [search, setSearch] = useState('')

  // Edit form state
  const [formData, setFormData] = useState({
    registrationOpen: true,
    status: 'open',
    prizePool: '',
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async (isManual = false) => {
    if (isManual) setRefreshing(true)
    else setLoading(true)

    try {
      const token = await getToken()
      const res = await fetch('/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setEvents(Array.isArray(data) ? data : (data.events || []))
      }
    } catch (err) {
      console.error('[AdminEvents] Fetch error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const openConfigModal = (event) => {
    setEditingEvent(event)
    setFormData({
      registrationOpen: event.registrationOpen ?? true,
      status: event.status || 'open',
      prizePool: event.prizePool || '',
    })
  }

  const closeConfigModal = () => {
    setEditingEvent(null)
    setSaving(false)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!editingEvent) return
    setSaving(true)

    try {
      const token = await getToken()
      const payload = {
        registrationOpen: Boolean(formData.registrationOpen),
        status: formData.status,
        prizePool: formData.prizePool.trim(),
      }

      const res = await fetch(`/api/admin/events/${editingEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Failed to update event configuration.')
      }

      setStatusMessage({ type: 'success', text: `Configuration for ${editingEvent.name} updated successfully.` })
      closeConfigModal()
      fetchEvents(true)
      setTimeout(() => setStatusMessage(null), 4000)
    } catch (err) {
      console.error('[AdminEvents] Update error:', err)
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update event.' })
    } finally {
      setSaving(false)
    }
  }

  // Filter events by title, category, branch, fee, or keyword
  const filteredEvents = events.filter((event) => {
    if (!search.trim()) return true
    const q = search.toLowerCase().trim()
    return (
      event.name?.toLowerCase().includes(q) ||
      event.category?.toLowerCase().includes(q) ||
      event.slug?.toLowerCase().includes(q) ||
      event.branch?.toLowerCase().includes(q) ||
      event.description?.toLowerCase().includes(q) ||
      event.fee?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-widest text-bone uppercase">Events Control Console</h1>
          <p className="font-mono text-xs text-steel mt-1">
            {search ? `${filteredEvents.length} of ${events.length}` : events.length} active arena protocols &bull; Registration & status management
          </p>
        </div>

        <button
          onClick={() => fetchEvents(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-1.5 px-3 py-2 border border-white/[0.08] hover:border-emerald/40 bg-charcoal text-steel hover:text-bone font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin text-emerald' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events by title, category, branch, fee, or keyword..."
          className="w-full bg-charcoal border border-white/[0.06] text-bone font-mono text-xs pl-10 pr-9 py-2.5 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-steel/50 hover:text-bone p-1 transition-colors cursor-pointer"
            title="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Status Notice */}
      {statusMessage && (
        <div className={`p-3 font-mono text-xs border flex items-center justify-between gap-3 ${
          statusMessage.type === 'success' 
            ? 'bg-emerald/15 border-emerald/40 text-emerald' 
            : 'bg-red-500/15 border-red-500/40 text-red-400'
        }`}>
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="opacity-70 hover:opacity-100 p-0.5">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-brass-dim border-t-emerald rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <p className="font-mono text-sm text-steel text-center py-16 border border-white/[0.06] bg-iron/20">
          No events currently registered in database.
        </p>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 border border-white/[0.06] bg-iron/20 font-mono text-xs text-steel space-y-2">
          <p>No arena protocols found matching "{search}"</p>
          <button
            onClick={() => setSearch('')}
            className="text-emerald hover:underline uppercase tracking-wider text-[11px] cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((event) => {
            const regCount = event.registrationCount ?? 0

            return (
              <div
                key={event._id}
                className="border border-white/[0.06] bg-iron/20 p-5 hover:border-white/[0.12] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-[10px] tracking-wider text-brass uppercase">
                        {event.category} // Open to All
                      </span>
                      <h3 className="font-display text-lg tracking-wider text-bone mt-0.5">
                        {event.name}
                      </h3>
                    </div>

                    <span className={`inline-flex items-center font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 shrink-0 border ${
                      event.registrationOpen
                        ? 'text-emerald bg-emerald/10 border-emerald/30'
                        : 'text-steel bg-white/[0.03] border-white/[0.08]'
                    }`}>
                      {event.registrationOpen ? 'REG OPEN' : 'REG LOCKED'}
                    </span>
                  </div>

                  <p className="font-mono text-xs text-steel/70 mt-2 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-3 font-mono text-xs text-steel/80 space-y-1">
                    {event.prizePool && (
                      <p className="text-emerald text-[11px]">🏆 {event.prizePool}</p>
                    )}
                    <p className="text-[11px] text-steel/60">Total Registrations: <strong className="text-bone">{regCount}</strong></p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                  <span className="font-mono text-xs text-brass font-bold">
                    Fee: {event.fee}
                  </span>

                  <button
                    onClick={() => openConfigModal(event)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald/15 hover:bg-emerald/25 border border-emerald/40 text-emerald font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Sliders size={13} />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit / Configuration Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-charcoal border border-emerald/40 max-w-xl w-full p-6 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="font-mono text-[10px] text-emerald uppercase tracking-wider block">
                  Reconfigure Protocol
                </span>
                <h3 className="font-display text-lg tracking-wider text-bone uppercase">
                  {editingEvent.name}
                </h3>
              </div>
              <button onClick={closeConfigModal} className="text-steel hover:text-bone transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 font-mono text-xs">
              {/* Status */}
              <div>
                <label className="text-steel/70 uppercase block text-[10px] mb-1">
                  Status Flag
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-black/50 border border-white/[0.08] text-bone px-3 py-2 focus:outline-none focus:border-emerald/50"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Registration Open Toggle */}
              <div className="flex items-center justify-between p-3 bg-iron/40 border border-white/[0.06]">
                <div>
                  <span className="text-bone block font-bold">Allow Public Registrations</span>
                  <span className="text-steel/60 text-[10px] block">
                    When disabled, portal locks new signups immediately
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.registrationOpen}
                  onChange={(e) => setFormData({ ...formData, registrationOpen: e.target.checked })}
                  className="w-5 h-5 accent-emerald cursor-pointer"
                />
              </div>

              {/* Prize Pool */}
              <div>
                <label className="text-steel/70 uppercase block text-[10px] mb-1">
                  Prize Pool Spec
                </label>
                <input
                  type="text"
                  value={formData.prizePool}
                  onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                  placeholder="e.g. 1st: ₹2,000 | 2nd: ₹1,500"
                  className="w-full bg-black/50 border border-white/[0.08] text-bone px-3 py-2 focus:outline-none focus:border-emerald/50"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={closeConfigModal}
                  disabled={saving}
                  className="px-4 py-2 border border-white/[0.08] hover:border-white/[0.2] text-steel hover:text-bone uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald hover:bg-emerald-dim text-charcoal font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Commit Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
