import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

/**
 * AdminEvents — View and manage all events.
 */
export default function AdminEvents() {
  const { getToken } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const token = await getToken()
      // The events API is protected, need to fetch all events including inactive
      // For now we use the public route — admin can see all active events
      const res = await fetch('/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setEvents(await res.json())
      }
    } catch (err) {
      console.error('Failed to fetch events:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brass-dim border-t-emerald rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-widest text-bone uppercase">Events</h1>
        <p className="font-mono text-xs text-steel mt-1">{events.length} active events</p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.length === 0 ? (
          <p className="font-mono text-sm text-steel col-span-2 text-center py-12">
            No events found. Add events through MongoDB Atlas.
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="border border-white/[0.06] bg-iron/20 p-4 sm:p-5 hover:border-white/[0.1] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] tracking-wider text-brass uppercase">
                    {event.category}
                  </span>
                  <h3 className="font-display text-base sm:text-lg tracking-wider text-bone mt-1 truncate">{event.name}</h3>
                  <p className="font-mono text-xs text-steel/60 mt-2 line-clamp-2">{event.description}</p>
                </div>
                <span className={`inline-flex items-center font-mono text-[10px] tracking-wider uppercase px-2 py-1 shrink-0 ${
                  event.isActive 
                    ? 'text-emerald bg-emerald/10 border border-emerald/20' 
                    : 'text-steel bg-white/[0.03] border border-white/[0.06]'
                }`}>
                  {event.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04] grid grid-cols-3 gap-2 sm:gap-3">
                <div className="min-w-0">
                  <span className="font-mono text-[9px] text-steel/40 uppercase block">Fee</span>
                  <span className="font-mono text-xs text-brass truncate block">{event.fee}</span>
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[9px] text-steel/40 uppercase block">Date</span>
                  <span className="font-mono text-xs text-steel truncate block">{event.date}</span>
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[9px] text-steel/40 uppercase block">Team</span>
                  <span className="font-mono text-xs text-steel truncate block">{event.teamSize}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
