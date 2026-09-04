import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * AdminRegistrations — Paginated table of all entry registrations with search.
 */
export default function AdminRegistrations() {
  const { getToken } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRegistrations(1, search)
  }, [])

  const fetchRegistrations = async (page = 1, searchTerm = '') => {
    setLoading(true)
    try {
      const token = await getToken()
      const params = new URLSearchParams({ page, limit: 15, search: searchTerm })
      const res = await fetch(`/api/admin/registrations?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setRegistrations(data.registrations)
        setPagination(data.pagination)
      }
    } catch (err) {
      console.error('Failed to fetch registrations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRegistrations(1, search)
  }

  const goToPage = (page) => {
    fetchRegistrations(page, search)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-widest text-bone uppercase">Registrations</h1>
          <p className="font-mono text-xs text-steel mt-1">{pagination.total} total entries</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, college..."
              className="bg-charcoal border border-white/[0.06] text-bone font-mono text-xs pl-9 pr-4 py-2.5 w-64 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 font-mono text-xs tracking-wider uppercase bg-emerald text-charcoal hover:bg-emerald-dim transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="border border-white/[0.06] overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.06] bg-iron/30">
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">ID</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Name</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Email</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">College</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Phone</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Status</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="w-6 h-6 border-2 border-brass-dim border-t-emerald rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : registrations.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 font-mono text-sm text-steel">
                  No registrations found.
                </td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="font-mono text-xs text-emerald px-4 py-3 whitespace-nowrap">{reg.registrationId}</td>
                  <td className="font-mono text-xs text-bone px-4 py-3 whitespace-nowrap">{reg.name}</td>
                  <td className="font-mono text-xs text-steel px-4 py-3 whitespace-nowrap">{reg.email}</td>
                  <td className="font-mono text-xs text-steel px-4 py-3 whitespace-nowrap">{reg.college}</td>
                  <td className="font-mono text-xs text-steel px-4 py-3 whitespace-nowrap">{reg.phone}</td>
                  <td className="px-4 py-3">
                    {reg.checkedIn ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase text-emerald bg-emerald/10 border border-emerald/20 px-2 py-1">
                        ✓ Checked In
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase text-steel bg-white/[0.03] border border-white/[0.06] px-2 py-1">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="font-mono text-[10px] text-steel/50 px-4 py-3 whitespace-nowrap">
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] text-steel/50">
            Page {pagination.page} of {pagination.pages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 border border-white/[0.06] text-steel hover:text-bone disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-2 border border-white/[0.06] text-steel hover:text-bone disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
