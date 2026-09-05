import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  Download, 
  ArrowRight, 
  Bell, 
  RefreshCw 
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

/**
 * Dashboard — Personal participant command center
 * Displays:
 * 1. Digital Entry Pass Credential with QR
 * 2. Registered Events Matrix with Cancel option
 * 3. Personal Festival Timeline Agenda
 * 4. Recent Announcements
 */
export default function Dashboard() {
  const { user, getToken } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)
  const [actionMessage, setActionMessage] = useState(null)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')

      const res = await fetch('/api/user/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) {
        throw new Error('Failed to load dashboard data.')
      }

      const resData = await res.json()
      setData(resData)
    } catch (err) {
      setError(err.message || 'Failed to connect to dashboard archives.')
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm('Are you sure you want to cancel your registration for this event? Your slot will be released.')) {
      return
    }

    setCancellingId(registrationId)
    setActionMessage(null)

    try {
      const token = await getToken()
      const res = await fetch(`/api/user/registrations/${registrationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      const resData = await res.json()
      if (!res.ok) throw new Error(resData.message || 'Failed to cancel registration.')

      setActionMessage({ type: 'success', text: 'Registration cancelled and capacity slot released.' })
      fetchDashboard()
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to cancel registration.' })
    } finally {
      setCancellingId(null)
    }
  }

  const downloadIcs = (reg) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VECTORS 26-27//Festival Event//EN',
      'BEGIN:VEVENT',
      `SUMMARY:VECTORS 26-27: ${reg.eventName}`,
      `DESCRIPTION:Registration ID: ${reg.registrationId}. Venue: ${reg.venue}`,
      `LOCATION:${reg.venue}`,
      'DTSTART:20260315T033000Z',
      'DTEND:20260316T123000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', `${reg.eventSlug}-registration.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
        <div className="p-8 doom-btn-clipped bg-doom-bg2 border border-doom-glow/40 text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-doom-glow border-t-transparent animate-spin" />
          <p className="font-mono text-xs text-doom-glow uppercase tracking-widest">
            RETRIEVING PERSONAL TELEMETRY ARCHIVES...
          </p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
        <div className="p-8 doom-btn-clipped bg-doom-bg2 border border-doom-crimson text-center space-y-4 max-w-md">
          <AlertTriangle size={32} className="mx-auto text-doom-crimson-bright" />
          <h2 className="font-display text-xl text-text-primary uppercase font-bold">TELEMETRY LINK OFFLINE</h2>
          <p className="font-mono text-xs text-text-muted">{error}</p>
          <button
            onClick={fetchDashboard}
            className="py-2.5 px-5 bg-doom-glow text-doom-bg font-mono text-xs uppercase tracking-wider font-bold hover:bg-white cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  const { entryPass, registeredEvents, announcements } = data

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-20 relative z-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <span className="font-mono text-xs text-doom-glow uppercase tracking-widest">PERSONAL COMMAND PORTAL</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide text-text-primary">
              {user.displayName || user.email}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/events"
              className="py-2 px-4 bg-doom-glow text-doom-bg font-mono text-xs uppercase tracking-wider font-bold hover:bg-white transition-colors flex items-center gap-1.5"
            >
              <span>Explore Vaults</span>
              <ArrowRight size={13} />
            </Link>
            <button
              onClick={fetchDashboard}
              className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] text-text-muted hover:text-white transition-colors cursor-pointer"
              title="Refresh Dashboard"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className={`p-3 font-mono text-xs border ${
            actionMessage.type === 'success' 
              ? 'bg-doom-glow/10 border-doom-glow text-doom-glow' 
              : 'bg-doom-crimson/20 border-doom-crimson text-doom-crimson-bright'
          }`}>
            {actionMessage.text}
          </div>
        )}

        {/* Top Grid: Entry Pass Credential + Quick Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 1. Digital Entry Pass Card */}
          <div className="p-6 bg-doom-bg2 border border-doom-glow/40 doom-btn-clipped relative overflow-hidden flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-doom-glow uppercase tracking-widest px-2 py-0.5 bg-doom-glow/10 border border-doom-glow/30 font-bold flex items-center gap-1">
                  <Ticket size={11} />
                  <span>GATE ENTRY PASS</span>
                </span>
                {entryPass ? (
                  <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 border ${
                    entryPass.checkedIn 
                      ? 'bg-doom-glow/20 border-doom-glow text-doom-glow' 
                      : 'bg-white/[0.04] border-white/[0.1] text-chrome-light'
                  }`}>
                    {entryPass.checkedIn ? 'CHECKED IN' : 'ACTIVE / VERIFIED'}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-doom-crimson-bright uppercase font-bold">
                    NOT GENERATED
                  </span>
                )}
              </div>

              {entryPass ? (
                <>
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-text-muted uppercase">Pass Identifier</span>
                    <p className="font-mono text-xl font-bold text-text-primary tracking-wider">{entryPass.registrationId}</p>
                  </div>
                  <div className="space-y-0.5 font-mono text-xs text-text-muted">
                    <p><strong className="text-text-primary">Name:</strong> {entryPass.name}</p>
                    <p><strong className="text-text-primary">College:</strong> {entryPass.college}</p>
                  </div>

                  {/* QR Preview */}
                  <div className="pt-2 flex items-center justify-center">
                    <div className="p-2.5 bg-white rounded-sm shadow-[0_0_15px_rgba(30,255,160,0.2)]">
                      <QRCodeSVG
                        value={entryPass.registrationId}
                        size={100}
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <p className="font-mono text-xs text-text-muted">
                    You do not possess an active entry pass. You must claim your pass to access events and gate check-in.
                  </p>
                  <Link
                    to="/entry-registration"
                    className="inline-block py-2.5 px-4 bg-doom-glow text-doom-bg font-mono text-xs uppercase tracking-wider font-bold"
                  >
                    Claim Entry Pass Now &rarr;
                  </Link>
                </div>
              )}
            </div>

            {entryPass && (
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <Link
                  to="/my-pass"
                  className="font-mono text-xs text-doom-glow hover:underline uppercase tracking-wider font-bold"
                >
                  Open Full Pass View &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* 2. Registered Events Counter & Status */}
          <div className="p-6 bg-doom-bg2 border border-white/[0.08] doom-btn-clipped flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="font-mono text-[10px] text-chrome-light uppercase tracking-widest px-2 py-0.5 bg-white/[0.04] border border-white/[0.08]">
                PARTICIPATION STATUS
              </span>
              <div className="space-y-1">
                <p className="font-display text-4xl font-bold text-text-primary">
                  {registeredEvents.length}
                </p>
                <p className="font-mono text-xs text-text-muted uppercase tracking-wider">
                  Active Event Registrations
                </p>
              </div>
              <p className="font-body text-xs text-text-muted leading-relaxed">
                Review your registered arenas below. Make sure you are present at the designated sector venue 15 minutes prior to start time.
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 font-mono text-xs text-doom-glow hover:underline uppercase tracking-wider"
              >
                <span>Register for more events</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* 3. Live Announcements Feed */}
          <div className="p-6 bg-doom-bg2 border border-white/[0.08] doom-btn-clipped flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-doom-glow uppercase tracking-widest px-2 py-0.5 bg-doom-glow/10 border border-doom-glow/30 flex items-center gap-1 font-bold">
                  <Bell size={11} />
                  <span>OFFICIAL ALERTS</span>
                </span>
                <Link to="/announcements" className="font-mono text-[10px] text-text-muted hover:text-white uppercase">
                  All &rarr;
                </Link>
              </div>

              <div className="space-y-2.5">
                {announcements.length === 0 ? (
                  <p className="font-mono text-xs text-text-muted py-4">No new alerts at this time.</p>
                ) : (
                  announcements.map(item => (
                    <div key={item._id} className="p-2.5 bg-doom-bg border border-white/[0.04] space-y-1">
                      <p className="font-display text-xs font-bold text-text-primary truncate">{item.title}</p>
                      <p className="font-body text-[11px] text-text-muted line-clamp-1">{item.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06]">
              <Link
                to="/announcements"
                className="font-mono text-xs text-text-muted hover:text-doom-glow uppercase tracking-wider transition-colors"
              >
                View Notice Board &rarr;
              </Link>
            </div>
          </div>

        </div>

        {/* Section: My Registered Events */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <span className="font-mono text-xs text-doom-glow uppercase tracking-widest">DISCIPLINE ROSTER</span>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-text-primary">
                MY REGISTERED EVENTS ({registeredEvents.length})
              </h2>
            </div>
            <Link
              to="/events"
              className="font-mono text-xs text-doom-glow hover:underline uppercase tracking-wider"
            >
              + Join Another Event
            </Link>
          </div>

          {registeredEvents.length === 0 ? (
            <div className="py-12 px-6 text-center bg-doom-bg2 border border-white/[0.08] doom-btn-clipped space-y-3">
              <Calendar size={28} className="mx-auto text-text-muted" />
              <h3 className="font-display text-lg font-bold uppercase text-text-primary">No Event Registrations Found</h3>
              <p className="font-mono text-xs text-text-muted max-w-md mx-auto">
                You haven't signed up for any competitive events or hackathons yet. Unlock your discipline now.
              </p>
              <Link
                to="/events"
                className="inline-block py-2.5 px-5 bg-doom-glow text-doom-bg font-mono text-xs uppercase tracking-wider font-bold hover:bg-white transition-colors"
              >
                Explore Event Vaults &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {registeredEvents.map((reg) => (
                <div
                  key={reg.registrationId}
                  className="p-6 bg-doom-bg2 border border-white/[0.08] doom-btn-clipped space-y-4 relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-doom-glow px-2 py-0.5 bg-doom-glow/10 border border-doom-glow/30 uppercase font-bold">
                        {reg.eventCategory} Event
                      </span>
                      <span className="font-mono text-xs text-text-muted">
                        ID: <strong className="text-text-primary">{reg.registrationId}</strong>
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold uppercase text-text-primary">
                      {reg.eventName}
                    </h3>

                    <div className="grid grid-cols-2 gap-2 font-mono text-xs text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-doom-glow shrink-0" />
                        <span className="truncate">{reg.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-doom-glow shrink-0" />
                        <span className="truncate">{reg.startTime}</span>
                      </div>
                      <div className="col-span-2 flex items-center gap-1.5">
                        <MapPin size={12} className="text-doom-glow shrink-0" />
                        <span className="truncate">{reg.venue}</span>
                      </div>
                    </div>

                    {reg.teamMembers && reg.teamMembers.length > 0 && (
                      <div className="p-3 bg-doom-bg border border-white/[0.04] space-y-1 font-mono text-[11px]">
                        <span className="text-text-muted block">
                          Team: <strong className="text-doom-glow">{reg.teamName || 'Registered Squad'}</strong> ({1 + reg.teamMembers.length} members)
                        </span>
                        <p className="text-text-muted/70 truncate">
                          Members: {reg.teamMembers.map(m => m.name).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadIcs(reg)}
                        className="p-1.5 bg-white/[0.04] border border-white/[0.08] hover:border-doom-glow/40 text-text-muted hover:text-white transition-colors cursor-pointer"
                        title="Add to Calendar"
                      >
                        <Download size={13} />
                      </button>

                      <Link
                        to={`/events/${reg.eventSlug}`}
                        className="font-mono text-xs text-text-muted hover:text-doom-glow uppercase tracking-wider"
                      >
                        Event Vault &rarr;
                      </Link>
                    </div>

                    <button
                      disabled={cancellingId === reg.registrationId}
                      onClick={() => handleCancelRegistration(reg.registrationId)}
                      className="font-mono text-xs text-doom-crimson-bright hover:underline uppercase tracking-wider flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                      <span>{cancellingId === reg.registrationId ? 'Cancelling...' : 'Cancel'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
