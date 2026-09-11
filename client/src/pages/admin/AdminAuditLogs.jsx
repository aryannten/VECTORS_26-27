import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  ShieldAlert, 
  Activity, 
  FileText, 
  Clock, 
  User, 
  Filter,
  Eye,
  X
} from 'lucide-react'

/**
 * AdminAuditLogs — Comprehensive system audit log viewer.
 * Monitors all administrative mutations (events, announcements, user roles).
 * Endpoint: GET /api/admin/audit-logs
 */
export default function AdminAuditLogs() {
  const { getToken } = useAuth()
  const [logs, setLogs] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL')
  const [activeDetailLog, setActiveDetailLog] = useState(null)

  const fetchAuditLogs = async (page = 1, isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const token = await getToken()
      const params = new URLSearchParams({ page, limit: 20 })
      const res = await fetch(`/api/admin/audit-logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs || [])
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 })
      }
    } catch (err) {
      console.error('[AdminAuditLogs] Fetch error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAuditLogs(1)
  }, [])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchAuditLogs(newPage)
    }
  }

  // Filter logs locally by search term and action type
  const filteredLogs = logs.filter((log) => {
    const matchAction =
      selectedActionFilter === 'ALL' ||
      log.action?.toUpperCase().includes(selectedActionFilter)

    const searchLower = search.toLowerCase()
    const matchSearch =
      !search ||
      log.action?.toLowerCase().includes(searchLower) ||
      log.performedBy?.toLowerCase().includes(searchLower) ||
      log.targetType?.toLowerCase().includes(searchLower) ||
      log.targetId?.toLowerCase().includes(searchLower)

    return matchAction && matchSearch
  })

  const getActionBadge = (action = '') => {
    if (action.includes('CREATED')) {
      return 'bg-emerald/15 text-emerald border-emerald/30'
    }
    if (action.includes('UPDATED')) {
      return 'bg-amber-400/15 text-amber-400 border-amber-400/30'
    }
    if (action.includes('DELETED')) {
      return 'bg-red-500/15 text-red-400 border-red-500/30'
    }
    return 'bg-steel/15 text-steel border-steel/30'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-emerald" />
            <h1 className="font-display text-2xl tracking-widest text-bone uppercase">Security & Audit Logs</h1>
          </div>
          <p className="font-mono text-xs text-steel mt-1">
            {pagination.total} historical immutable action entries recorded
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchAuditLogs(pagination.page, true)}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 px-3 py-2 border border-white/[0.08] hover:border-emerald/40 bg-charcoal text-steel hover:text-bone font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
            title="Refresh logs"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-emerald' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-iron/30 border border-white/[0.06] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by admin email, action, target..."
            className="w-full bg-charcoal border border-white/[0.06] text-bone font-mono text-xs pl-9 pr-4 py-2 focus:outline-none focus:border-emerald/40 transition-colors placeholder:text-steel/30"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] text-steel uppercase tracking-wider flex items-center gap-1">
            <Filter size={12} /> Action:
          </span>
          {['ALL', 'CREATED', 'UPDATED', 'DELETED'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedActionFilter(cat)}
              className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                selectedActionFilter === cat
                  ? 'bg-emerald text-charcoal font-bold'
                  : 'bg-charcoal border border-white/[0.06] text-steel hover:text-bone'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="w-full border border-white/[0.06] overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-white/[0.06] bg-iron/40">
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Timestamp</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Action</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Performed By</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Target</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-16">
                  <div className="w-7 h-7 border-2 border-brass-dim border-t-emerald rounded-full animate-spin mx-auto" />
                  <span className="font-mono text-xs text-steel/60 block mt-3 uppercase tracking-widest">
                    Loading security audit telemetry...
                  </span>
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 font-mono text-sm text-steel">
                  No audit log entries matching criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log._id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="font-mono text-xs text-steel px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-steel/50" />
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-block px-2 py-0.5 font-mono text-[10px] font-bold border uppercase tracking-wider ${getActionBadge(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="font-mono text-xs text-bone px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-emerald/70" />
                      <span>{log.performedBy}</span>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-steel px-4 py-3 whitespace-nowrap">
                    <span className="text-text-muted">{log.targetType}: </span>
                    <span className="text-bone">{log.targetId ? String(log.targetId).slice(0, 10) + '...' : 'N/A'}</span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => setActiveDetailLog(log)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/[0.04] hover:bg-emerald/15 border border-white/[0.08] hover:border-emerald/30 text-steel hover:text-emerald font-mono text-[11px] tracking-wider uppercase transition-colors"
                    >
                      <Eye size={12} />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between font-mono text-xs text-steel pt-2">
          <span>
            Page {pagination.page} of {pagination.pages} ({pagination.total} records)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 border border-white/[0.08] hover:border-emerald/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-2 border border-white/[0.08] hover:border-emerald/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {activeDetailLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-charcoal border border-emerald/40 max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-emerald" />
                <h3 className="font-display text-lg tracking-wider text-bone uppercase">Audit Record Payload</h3>
              </div>
              <button
                onClick={() => setActiveDetailLog(null)}
                className="text-steel hover:text-bone transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2 bg-iron/40 p-3 border border-white/[0.04]">
                <div>
                  <span className="text-steel/60 uppercase block text-[10px]">Action</span>
                  <span className="text-emerald font-bold">{activeDetailLog.action}</span>
                </div>
                <div>
                  <span className="text-steel/60 uppercase block text-[10px]">Target Entity</span>
                  <span className="text-bone">{activeDetailLog.targetType}</span>
                </div>
                <div>
                  <span className="text-steel/60 uppercase block text-[10px]">Performed By</span>
                  <span className="text-bone truncate block">{activeDetailLog.performedBy}</span>
                </div>
                <div>
                  <span className="text-steel/60 uppercase block text-[10px]">Recorded At</span>
                  <span className="text-steel block">{new Date(activeDetailLog.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="text-steel/60 uppercase block text-[10px] mb-1.5">JSON Payload Snapshot</span>
                <pre className="p-3 bg-black/60 border border-white/[0.06] text-emerald font-mono text-[11px] overflow-x-auto max-h-56 rounded-none">
                  {JSON.stringify(activeDetailLog.details || {}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveDetailLog(null)}
                className="px-4 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] font-mono text-xs text-bone uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
