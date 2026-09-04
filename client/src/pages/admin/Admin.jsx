import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Users, Ticket, Calendar, Shield, Check, ArrowRight } from 'lucide-react'

/**
 * Admin Dashboard — Overview with key metrics and operational shortcuts.
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
        setStats(await statsRes.json())
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
    { label: 'Total Registrations', value: stats.totalRegistrations, icon: Ticket, color: 'text-emerald' },
    { label: 'Checked In', value: `${stats.checkedInCount} / ${stats.totalRegistrations}`, icon: Check, color: 'text-brass' },
    { label: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'text-bone' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-steel' },
    { label: 'Security Personnel', value: stats.securityUsers, icon: Shield, color: 'text-brass-dim' },
  ] : []

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl tracking-widest text-bone uppercase">Dashboard</h1>
        <p className="font-mono text-xs text-steel mt-1">VECTORS 2026 Command Center</p>
      </div>

      {error && (
        <p className="font-mono text-xs text-crimson">{error}</p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="p-3.5 sm:p-4 border border-white/[0.06] bg-iron/20 hover:border-white/[0.1] transition-colors"
          >
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <card.icon size={14} className={`${card.color} shrink-0`} />
              <span className="font-mono text-[10px] tracking-wider text-steel/60 uppercase truncate">{card.label}</span>
            </div>
            <p className={`font-mono text-xl sm:text-2xl ${card.color} truncate`}>{card.value}</p>
          </div>
        ))}
      </div>

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
          Gate security officers sign up or log in with their own email and password (no access keys needed).
          To give someone security clearance, find them in the <Link to="/admin/users" className="text-brass underline">Users list</Link> and switch their role to <span className="text-brass font-bold">Security</span>. They can then sign in at <code className="text-emerald text-[11px] bg-charcoal px-1.5 py-0.5 border border-white/[0.06] break-all">/security/login</code> to operate the QR scanner.
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
