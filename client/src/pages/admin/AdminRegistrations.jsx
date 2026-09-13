import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Ticket,
  Users,
} from 'lucide-react'

/**
 * AdminRegistrations — Paginated table of all entry registrations with search,
 * CSV export, attendee details editing, status toggles, and deletion.
 * Endpoints: 
 * - GET /api/admin/registrations
 * - PUT /api/admin/registrations/:id
 * - DELETE /api/admin/registrations/:id
 * - GET /api/admin/registrations/export
 */
export default function AdminRegistrations() {
  const { getToken } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Notification state
  const [notification, setNotification] = useState(null)

  // Edit Modal state
  const [editingReg, setEditingReg] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    college: '',
    phone: '',
    checkedIn: false,
    day1CheckedIn: false,
    day2CheckedIn: false,
  })
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState(null)

  // Delete Modal state
  const [deletingReg, setDeletingReg] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 4000)
  }

  useEffect(() => {
    fetchRegistrations(1, search)
  }, [])

  const fetchRegistrations = async (page = 1, searchTerm = '', isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const token = await getToken()
      const params = new URLSearchParams({ page, limit: 15, search: searchTerm })
      const res = await fetch(`/api/admin/registrations?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setRegistrations(data.registrations || [])
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 })
      }
    } catch (err) {
      console.error('Failed to fetch registrations:', err)
      notify('Failed to load registrations.', 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRegistrations(1, search)
  }

  const goToPage = (page) => {
    fetchRegistrations(page, search)
  }

  const handleExportCsv = async () => {
    setExporting(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/registrations/export', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `vectors_entry_passes_${Date.now()}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        notify('Failed to generate export file.', 'error')
      }
    } catch (err) {
      console.error('Export error:', err)
      notify('Error exporting registrations.', 'error')
    } finally {
      setExporting(false)
    }
  }

  const openEditModal = (reg) => {
    setEditingReg(reg)
    setEditFormData({
      name: reg.name || '',
      email: reg.email || '',
      college: reg.college || '',
      phone: reg.phone || '',
      checkedIn: Boolean(reg.checkedIn || reg.day1CheckedIn || reg.day2CheckedIn),
      day1CheckedIn: Boolean(reg.day1CheckedIn || reg.checkedIn),
      day2CheckedIn: Boolean(reg.day2CheckedIn),
    })
    setEditError(null)
  }

  // 1-Click Day 1 / Day 2 check-in toggle from the attendee table
  const handleToggleDayCheckIn = async (reg, day) => {
    try {
      const token = await getToken()
      const regId = reg._id || reg.registrationId
      const targetField = day === 1 ? 'day1CheckedIn' : 'day2CheckedIn'
      const currentValue = Boolean(day === 1 ? (reg.day1CheckedIn || reg.checkedIn) : reg.day2CheckedIn)
      const newValue = !currentValue

      const res = await fetch(`/api/admin/registrations/${regId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [targetField]: newValue }),
      })
      const data = await res.json()
      if (res.ok && data.registration) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r._id === reg._id || r.registrationId === reg.registrationId
              ? data.registration
              : r
          )
        )
        notify(`Day ${day} marked as ${newValue ? 'CHECKED IN' : 'PENDING'} for ${reg.name}.`)
      } else {
        notify(data?.message || 'Failed to update check-in status.', 'error')
      }
    } catch (err) {
      console.error('Quick check-in error:', err)
      notify('Network error updating check-in.', 'error')
    }
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingReg) return
    setEditSaving(true)
    setEditError(null)

    try {
      const token = await getToken()
      const regId = editingReg._id || editingReg.registrationId
      const res = await fetch(`/api/admin/registrations/${regId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      })

      const contentType = res.headers.get('content-type') || ''
      let data = null
      if (contentType.includes('application/json')) {
        data = await res.json()
      }

      if (!res.ok) {
        const errorMsg = data?.message || (await res.text().catch(() => '')) || `Request failed with status ${res.status}`
        throw new Error(errorMsg)
      }

      setRegistrations((prev) =>
        prev.map((r) =>
          r._id === editingReg._id || r.registrationId === editingReg.registrationId
            ? data.registration
            : r
        )
      )
      setEditingReg(null)
      notify(`Pass ${data.registration.registrationId} updated successfully.`)
    } catch (err) {
      console.error('Update error:', err)
      setEditError(err.message || 'Error updating registration.')
    } finally {
      setEditSaving(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingReg) return
    setDeleteLoading(true)

    try {
      const token = await getToken()
      const regId = deletingReg._id || deletingReg.registrationId
      const res = await fetch(`/api/admin/registrations/${regId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      const contentType = res.headers.get('content-type') || ''
      let data = null
      if (contentType.includes('application/json')) {
        data = await res.json()
      }

      if (!res.ok) {
        const errorMsg = data?.message || (await res.text().catch(() => '')) || `Request failed with status ${res.status}`
        throw new Error(errorMsg)
      }

      setRegistrations((prev) =>
        prev.filter(
          (r) => r._id !== deletingReg._id && r.registrationId !== deletingReg.registrationId
        )
      )
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }))
      notify(data?.message || `Pass ${deletingReg.registrationId} deleted successfully.`)
      setDeletingReg(null)
    } catch (err) {
      console.error('Delete error:', err)
      notify(err.message || 'Error deleting registration.', 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-widest text-bone uppercase">Entry Passes & Registrations</h1>
          <p className="font-mono text-xs text-steel mt-1">{pagination.total} total registered attendees</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => fetchRegistrations(pagination.page, search, true)}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 px-3 py-2 border border-white/[0.08] hover:border-emerald/40 bg-charcoal text-steel hover:text-bone font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-emerald' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={exporting || pagination.total === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-emerald/40 bg-emerald/15 hover:bg-emerald/25 text-emerald font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download size={14} className={exporting ? 'animate-bounce' : ''} />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Contextual Link: Entry Passes vs All Accounts */}
      <div className="flex items-center justify-between p-3.5 bg-iron/20 border border-white/[0.06] text-xs font-mono flex-wrap gap-2">
        <div className="flex items-center gap-2 text-steel">
          <Ticket size={14} className="text-emerald shrink-0" />
          <span>Showing <strong>{pagination.total}</strong> attendees who completed entry pass registration to claim a gate QR code.</span>
        </div>
        <Link
          to="/admin/users"
          className="text-brass hover:text-white font-bold inline-flex items-center gap-1.5 transition-colors uppercase tracking-wider text-[11px]"
        >
          <Users size={12} />
          <span>View All Created Accounts ({pagination.total}+) &rarr;</span>
        </Link>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3 border font-mono text-xs flex items-center justify-between transition-all ${
            notification.type === 'error'
              ? 'border-crimson/40 bg-crimson/10 text-crimson'
              : 'border-emerald/40 bg-emerald/10 text-emerald'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? <AlertTriangle size={14} /> : <Check size={14} />}
            <span>{notification.msg}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="opacity-70 hover:opacity-100 transition-opacity p-0.5"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, pass ID, college..."
            className="w-full bg-charcoal border border-white/[0.06] text-bone font-mono text-xs pl-9 pr-4 py-2.5 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 font-mono text-xs tracking-wider uppercase bg-emerald text-charcoal hover:bg-emerald-dim transition-colors shrink-0 font-bold cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="w-full max-w-full min-w-0 border border-white/[0.06] overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-white/[0.06] bg-iron/30">
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">ID</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Name</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Email</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">College</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Phone</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3 text-center">Day 1 Check-In</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3 text-center">Day 2 Check-In</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Date</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-12">
                  <div className="w-6 h-6 border-2 border-brass-dim border-t-emerald rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : registrations.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 font-mono text-sm text-steel">
                  No registrations found.
                </td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="font-mono text-xs text-emerald px-4 py-3 whitespace-nowrap font-bold">
                    {reg.registrationId}
                  </td>
                  <td className="font-mono text-xs text-bone px-4 py-3 whitespace-nowrap">{reg.name}</td>
                  <td className="font-mono text-xs text-steel px-4 py-3 whitespace-nowrap">{reg.email}</td>
                  <td className="font-mono text-xs text-steel px-4 py-3 whitespace-nowrap">{reg.college}</td>
                  <td className="font-mono text-xs text-steel px-4 py-3 whitespace-nowrap">{reg.phone}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    {Boolean(reg.day1CheckedIn || reg.checkedIn) ? (
                      <button
                        onClick={() => handleToggleDayCheckIn(reg, 1)}
                        className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase text-emerald bg-emerald/15 border border-emerald/40 px-2.5 py-1 hover:bg-crimson/10 hover:border-crimson/40 hover:text-crimson transition-colors cursor-pointer"
                        title="Click to toggle/undo Day 1 Check-In"
                      >
                        ✓ Day 1 In
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleDayCheckIn(reg, 1)}
                        className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase text-steel hover:text-emerald bg-white/[0.03] hover:bg-emerald/10 border border-white/[0.08] hover:border-emerald/40 px-2.5 py-1 transition-colors cursor-pointer"
                        title="Click to Check In for Day 1"
                      >
                        + Check In D1
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    {Boolean(reg.day2CheckedIn) ? (
                      <button
                        onClick={() => handleToggleDayCheckIn(reg, 2)}
                        className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase text-emerald bg-emerald/15 border border-emerald/40 px-2.5 py-1 hover:bg-crimson/10 hover:border-crimson/40 hover:text-crimson transition-colors cursor-pointer"
                        title="Click to toggle/undo Day 2 Check-In"
                      >
                        ✓ Day 2 In
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleDayCheckIn(reg, 2)}
                        className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase text-steel hover:text-emerald bg-white/[0.03] hover:bg-emerald/10 border border-white/[0.08] hover:border-emerald/40 px-2.5 py-1 transition-colors cursor-pointer"
                        title="Click to Check In for Day 2"
                      >
                        + Check In D2
                      </button>
                    )}
                  </td>
                  <td className="font-mono text-[10px] text-steel/50 px-4 py-3 whitespace-nowrap">
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(reg)}
                        className="p-1.5 border border-white/[0.08] hover:border-emerald/40 bg-iron/30 hover:bg-emerald/10 text-steel hover:text-emerald transition-colors cursor-pointer"
                        title="Edit Attendee Details"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeletingReg(reg)}
                        className="p-1.5 border border-white/[0.08] hover:border-crimson/40 bg-iron/30 hover:bg-crimson/10 text-steel hover:text-crimson transition-colors cursor-pointer"
                        title="Delete Pass"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between font-mono text-xs text-steel">
          <p className="text-[11px] text-steel/50">
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

      {/* ============================================================ */}
      {/* EDIT REGISTRATION MODAL */}
      {/* ============================================================ */}
      {editingReg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-charcoal border border-emerald/40 p-5 sm:p-6 shadow-2xl my-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-emerald">
                <Edit2 size={18} />
                <h2 className="font-display text-lg tracking-wider text-bone uppercase">Edit Attendee Pass</h2>
              </div>
              <button
                onClick={() => setEditingReg(null)}
                className="text-steel/60 hover:text-bone transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-black/40 border border-white/[0.06] mb-4">
              <span className="font-mono text-[11px] text-steel/70 uppercase tracking-wider">Pass ID (Immutable)</span>
              <span className="font-mono text-xs text-emerald font-bold tracking-wider">{editingReg.registrationId}</span>
            </div>

            {editError && (
              <div className="mb-4 p-3 border border-crimson/40 bg-crimson/10 text-crimson font-mono text-xs flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  placeholder="Attendee Full Name"
                  className="w-full bg-iron/40 border border-white/[0.08] text-bone font-mono text-xs px-3 py-2.5 focus:outline-none focus:border-emerald/60 transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  placeholder="student@college.edu"
                  className="w-full bg-iron/40 border border-white/[0.08] text-bone font-mono text-xs px-3 py-2.5 focus:outline-none focus:border-emerald/60 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1">
                    College / Institution
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.college}
                    onChange={(e) => setEditFormData({ ...editFormData, college: e.target.value })}
                    placeholder="College Name"
                    className="w-full bg-iron/40 border border-white/[0.08] text-bone font-mono text-xs px-3 py-2.5 focus:outline-none focus:border-emerald/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full bg-iron/40 border border-white/[0.08] text-bone font-mono text-xs px-3 py-2.5 focus:outline-none focus:border-emerald/60 transition-colors"
                  />
                </div>
              </div>

              {/* Day 1 & Day 2 Check-In Status Toggles */}
              <div className="space-y-2 pt-2">
                <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1">
                  Gate Attendance Status
                </label>
                
                {/* Day 1 Toggle */}
                <div
                  onClick={() => setEditFormData({ ...editFormData, day1CheckedIn: !editFormData.day1CheckedIn })}
                  className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                    editFormData.day1CheckedIn
                      ? 'border-emerald/40 bg-emerald/10'
                      : 'border-white/[0.08] bg-iron/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                        editFormData.day1CheckedIn
                          ? 'border-emerald bg-emerald text-charcoal'
                          : 'border-steel/40 bg-transparent'
                      }`}
                    >
                      {editFormData.day1CheckedIn && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="font-mono text-xs text-bone">
                      Day 1: {editFormData.day1CheckedIn ? 'Checked In' : 'Pending'}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-steel/60 uppercase">
                    {editFormData.day1CheckedIn ? 'Mark Pending' : 'Mark Checked In'}
                  </span>
                </div>

                {/* Day 2 Toggle */}
                <div
                  onClick={() => setEditFormData({ ...editFormData, day2CheckedIn: !editFormData.day2CheckedIn })}
                  className={`flex items-center justify-between p-3 border cursor-pointer transition-colors ${
                    editFormData.day2CheckedIn
                      ? 'border-emerald/40 bg-emerald/10'
                      : 'border-white/[0.08] bg-iron/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                        editFormData.day2CheckedIn
                          ? 'border-emerald bg-emerald text-charcoal'
                          : 'border-steel/40 bg-transparent'
                      }`}
                    >
                      {editFormData.day2CheckedIn && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="font-mono text-xs text-bone">
                      Day 2: {editFormData.day2CheckedIn ? 'Checked In' : 'Pending'}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-steel/60 uppercase">
                    {editFormData.day2CheckedIn ? 'Mark Pending' : 'Mark Checked In'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingReg(null)}
                  className="flex-1 py-2.5 border border-white/[0.08] text-steel font-mono text-xs tracking-wider uppercase hover:text-bone hover:border-white/20 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="flex-1 py-2.5 bg-emerald text-charcoal font-mono text-xs tracking-wider uppercase font-bold hover:bg-emerald-dim transition-colors disabled:opacity-40 cursor-pointer"
                >
                  {editSaving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ============================================================ */}
      {deletingReg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-sm bg-charcoal border border-crimson/40 p-5 sm:p-6 shadow-2xl my-auto">
            <div className="flex items-center gap-3 text-crimson mb-3">
              <AlertTriangle size={22} />
              <h2 className="font-display text-lg tracking-wider uppercase">Delete Entry Pass?</h2>
            </div>
            <p className="font-mono text-xs text-steel/80 leading-relaxed mb-4">
              Are you sure you want to permanently delete entry pass{' '}
              <strong className="text-emerald font-bold">{deletingReg.registrationId}</strong> issued to{' '}
              <strong className="text-bone">{deletingReg.name}</strong> ({deletingReg.email})?
            </p>
            <div className="p-2.5 bg-crimson/10 border border-crimson/20 mb-5 font-mono text-[11px] text-crimson leading-snug">
              Warning: This action will permanently invalidate their QR pass and delete the attendee registration record.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingReg(null)}
                className="flex-1 py-2.5 border border-white/[0.08] text-steel font-mono text-xs tracking-wider uppercase hover:text-bone hover:border-white/20 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 bg-crimson text-bone font-mono text-xs tracking-wider uppercase font-bold hover:bg-crimson/80 transition-colors disabled:opacity-40 cursor-pointer"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Pass'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
