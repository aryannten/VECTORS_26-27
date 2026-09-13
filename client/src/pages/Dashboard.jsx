import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { 
  Ticket, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw 
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

/**
 * Dashboard — Personal participant command center
 * Displays:
 * 1. Digital Entry Pass Credential with QR
 * 2. Registered Events Matrix with Verified Status
 */
export default function Dashboard() {
  const { user, getToken } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
        const errorBody = await res.json().catch(() => ({}))
        throw new Error(errorBody.message || 'Failed to load dashboard data.')
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

  const { entryPass, registeredEvents } = data

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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

                  {/* 2-Day Attendance Status Chips */}
                  <div className="grid grid-cols-2 gap-2 w-full font-mono text-[10px] pt-1">
                    <div className={`p-1.5 rounded border text-center font-bold uppercase ${
                      Boolean(entryPass.day1CheckedIn || entryPass.checkedIn)
                        ? 'bg-doom-glow/15 border-doom-glow/40 text-doom-glow'
                        : 'bg-white/[0.03] border-white/10 text-text-muted'
                    }`}>
                      DAY 1: {Boolean(entryPass.day1CheckedIn || entryPass.checkedIn) ? 'CHECKED IN ✓' : 'PENDING'}
                    </div>
                    <div className={`p-1.5 rounded border text-center font-bold uppercase ${
                      Boolean(entryPass.day2CheckedIn)
                        ? 'bg-doom-glow/15 border-doom-glow/40 text-doom-glow'
                        : 'bg-white/[0.03] border-white/10 text-text-muted'
                    }`}>
                      DAY 2: {Boolean(entryPass.day2CheckedIn) ? 'CHECKED IN ✓' : 'PENDING'}
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
                <button
                  onClick={fetchDashboard}
                  className="font-mono text-[11px] text-text-muted hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  title="Refresh Pass Status"
                >
                  <RefreshCw size={11} />
                  <span>Sync</span>
                </button>
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
                Review your registered arenas below.
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
              <Ticket size={28} className="mx-auto text-text-muted" />
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

                    <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
                      <span className="text-doom-glow font-bold">REGISTRATION:</span>
                      <span className="text-white font-bold">{reg.status || 'CONFIRMED'}</span>
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
                    <Link
                      to={`/events/${reg.eventSlug}`}
                      className="font-mono text-xs text-text-muted hover:text-doom-glow uppercase tracking-wider"
                    >
                      Event Vault &rarr;
                    </Link>

                    <span className="font-mono text-[10px] text-doom-glow uppercase tracking-widest px-2.5 py-1 bg-doom-glow/10 border border-doom-glow/30 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>PERMANENT ENTRY</span>
                    </span>
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
