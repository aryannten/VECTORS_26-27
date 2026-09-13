import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Users, Ticket, Calendar, Shield, Check, ArrowRight, Clock, AlertCircle } from 'lucide-react'

/**
 * Admin Dashboard — Overview with key metrics, account onboarding telemetry,
 * and operational shortcuts.
 */
export default function Admin() {
  const { getToken } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }

      const statsRes = await fetch('/api/admin/stats', { headers })
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data.stats || data)
      } else {
        setError('Failed to load dashboard statistics.')
      }
    } catch (err) {
      setError('Failed to connect to admin API.')
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

  const statCards = stats ? [
    { label: 'Accounts Created', value: stats.totalUsers ?? 0, icon: Users, color: 'text-emerald', to: '/admin/users' },
    { label: 'QR Passes Minted', value: stats.totalRegistrations ?? 0, icon: Ticket, color: 'text-brass', to: '/admin/registrations' },
    { label: 'Gate Checked In', value: `${stats.checkedInCount ?? 0} / ${stats.totalRegistrations ?? 0}`, icon: Check, color: 'text-bone', to: '/admin/registrations' },
    { label: 'Total Events', value: stats.totalEvents ?? 0, icon: Calendar, color: 'text-steel', to: '/admin/events' },
    { label: 'Security Staff', value: stats.securityUsers ?? 0, icon: Shield, color: 'text-brass-dim', to: '/admin/users' },
  ] : []

  const totalUsers = stats?.totalUsers || 0
  const totalPasses = stats?.totalRegistrations || 0
  const pendingPasses = Math.max(0, totalUsers - totalPasses)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-widest text-bone uppercase">Command Center</h1>
          <p className="font-mono text-xs text-steel mt-1">Platform Telemetry & Operational Overview</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="px-3.5 py-2 border border-emerald/40 bg-emerald/10 text-emerald hover:bg-emerald/20 font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <Users size={14} />
            <span>View All Accounts ({totalUsers})</span>
          </Link>
          <Link
            to="/admin/registrations"
            className="px-3.5 py-2 border border-brass/40 bg-brass/10 text-brass hover:bg-brass/20 font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <Ticket size={14} />
            <span>View QR Passes ({totalPasses})</span>
          </Link>
        </div>
      </div>

      {error && (
        <p className="font-mono text-xs text-crimson">{error}</p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="p-3.5 sm:p-4 border border-white/[0.06] bg-iron/20 hover:border-white/[0.15] hover:bg-iron/30 transition-all block group"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="font-mono text-[10px] tracking-wider text-steel/60 uppercase truncate">{card.label}</span>
              <card.icon size={14} className={`${card.color} shrink-0 group-hover:scale-110 transition-transform`} />
            </div>
            <p className={`font-mono text-xl sm:text-2xl ${card.color} truncate font-bold`}>{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Account Onboarding Telemetry Funnel */}
      <div className="border border-white/[0.08] bg-iron/20 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-display text-base sm:text-lg tracking-wider text-bone uppercase flex items-center gap-2">
              <Users size={18} className="text-emerald" />
              <span>Attendee Onboarding Pipeline</span>
            </h2>
            <p className="font-mono text-xs text-steel mt-0.5">
              Tracks users who created an account vs attendees who completed entry pass registration to get their QR badge.
            </p>
          </div>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-emerald hover:text-emerald-dim transition-colors"
          >
            <span>Open User Directory</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 border border-white/[0.06] bg-charcoal/60">
            <span className="font-mono text-[10px] tracking-wider uppercase text-steel block">Total Accounts Created</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-2xl font-bold text-bone">{totalUsers}</span>
              <span className="font-mono text-[10px] text-steel/60">Signed-up Operatives</span>
            </div>
          </div>

          <div className="p-3.5 border border-emerald/30 bg-emerald/5">
            <span className="font-mono text-[10px] tracking-wider uppercase text-emerald block">QR Passes Claimed</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-2xl font-bold text-emerald">{totalPasses}</span>
              <span className="font-mono text-[10px] text-emerald/70">
                {totalUsers > 0 ? `${Math.round((totalPasses / totalUsers) * 100)}% conversion` : '0%'}
              </span>
            </div>
          </div>

          <div className="p-3.5 border border-brass/30 bg-brass/5">
            <span className="font-mono text-[10px] tracking-wider uppercase text-brass block">No QR Pass Yet</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-2xl font-bold text-brass">{pendingPasses}</span>
              <span className="font-mono text-[10px] text-brass/70">Account created only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent User Signups Preview */}
      {stats?.recentUsers && stats.recentUsers.length > 0 && (
        <div className="border border-white/[0.06] bg-iron/20 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base tracking-wider text-bone uppercase flex items-center gap-2">
                <Clock size={16} className="text-brass" />
                <span>Recent Account Registrations</span>
              </h2>
              <p className="font-mono text-xs text-steel mt-0.5">
                Latest attendees who created an account on the festival platform
              </p>
            </div>
            <Link
              to="/admin/users"
              className="font-mono text-xs text-brass hover:underline uppercase tracking-wider flex items-center gap-1"
            >
              <span>View All Accounts ({totalUsers})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="py-3 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center font-mono text-xs text-emerald uppercase font-bold">
                    {user.displayName?.[0] || user.email?.[0] || '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-bone font-bold">{user.displayName || 'Unnamed Account'}</span>
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 border border-white/10 text-steel/70">
                        {user.role}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-steel block">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {user.hasPass ? (
                    <span className="font-mono text-[10px] uppercase font-bold px-2 py-1 bg-emerald/10 border border-emerald/30 text-emerald flex items-center gap-1">
                      <Check size={11} />
                      <span>Pass: {user.passId}</span>
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase font-bold px-2 py-1 bg-brass/10 border border-brass/30 text-brass flex items-center gap-1">
                      <AlertCircle size={11} />
                      <span>No QR Pass Yet</span>
                    </span>
                  )}
                  <span className="font-mono text-[10px] text-steel/50">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gate Security Management Guide */}
      <div className="border border-brass-dim/20 bg-iron/20 p-4 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-brass shrink-0" />
            <h2 className="font-display text-base sm:text-lg tracking-wider text-bone uppercase">Gate Security Personnel</h2>
          </div>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-emerald hover:text-emerald-dim transition-colors"
          >
            Manage User Roles <ArrowRight size={13} />
          </Link>
        </div>
        <p className="font-mono text-xs text-steel/70 leading-relaxed mb-4">
          Gate security officers log in with their predefined email through the standard login page.
          To give someone security clearance, specify their email in <code className="text-emerald text-[11px] bg-charcoal px-1.5 py-0.5 border border-white/[0.06]">SECURITY_EMAILS</code> or find them in the <Link to="/admin/users" className="text-brass underline">User Accounts list</Link> and switch their role to <span className="text-brass font-bold">Security</span>. They will be directed automatically to the QR scanner at <code className="text-brass-dim text-[11px]">/security</code> upon login.
        </p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-steel/50 font-mono text-[11px]">
          <span>Active security staff: <strong className="text-bone">{stats?.securityUsers ?? 0}</strong></span>
          <span className="hidden sm:inline">•</span>
          <span>Scanner route: <code className="text-brass-dim break-all">/security</code></span>
        </div>
      </div>
    </div>
  )
}
