import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  Search,
  Shield,
  User as UserIcon,
  KeyRound,
  Copy,
  Check,
  X,
  UserPlus,
  Trash2,
  Edit2,
  AlertTriangle,
  Download,
  RefreshCw,
  Ticket,
  Users,
  Phone,
  PhoneOff,
} from 'lucide-react'

/**
 * AdminUsers — Full User Management Console.
 * Allows Admin to see all created user accounts, their QR pass claim status,
 * change roles, reset passwords, export CSV, and delete accounts.
 */
export default function AdminUsers() {
  const { getToken, user: currentAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState({ total: 0, withPass: 0, withoutPass: 0 })
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [passFilter, setPassFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [resettingId, setResettingId] = useState(null)

  // Modals & Panels
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)
  const [generatedLink, setGeneratedLink] = useState(null)
  const [copiedLink, setCopiedLink] = useState(false)

  // Forms
  const [newFormData, setNewFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
  })
  const [editFormData, setEditFormData] = useState({
    displayName: '',
    phone: '',
    role: 'user',
    password: '',
  })
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    fetchUsers(search, roleFilter, passFilter)
  }, [roleFilter, passFilter])

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const fetchUsers = async (searchTerm = search, role = roleFilter, passStatus = passFilter, isManual = false) => {
    if (isManual) setRefreshing(true)
    else setLoading(true)
    try {
      const token = await getToken()
      const query = new URLSearchParams()
      if (searchTerm) query.set('search', searchTerm)
      if (role) query.set('role', role)
      if (passStatus) query.set('passStatus', passStatus)

      const res = await fetch(`/api/admin/users?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
        if (data.meta) setMeta(data.meta)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
      notify('Failed to load users.', 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchUsers(search, roleFilter, passFilter)
  }

  const handleExportCsv = async () => {
    setExporting(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/users/export', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `vectors_user_accounts_${Date.now()}.csv`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        notify('User accounts exported to CSV successfully.')
      } else {
        notify('Failed to export CSV.', 'error')
      }
    } catch (err) {
      console.error('Export error:', err)
      notify('Error downloading CSV.', 'error')
    } finally {
      setExporting(false)
    }
  }

  // --- Add User ---
  const handleCreateUser = async (e) => {
    e.preventDefault()
    setModalLoading(true)
    setModalError(null)

    try {
      const token = await getToken()
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newFormData),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create user.')
      }

      setUsers([data.user, ...users])
      setShowAddModal(false)
      setNewFormData({ displayName: '', email: '', phone: '', password: '', role: 'user' })
      notify(`User ${data.user.email} created successfully!`)
    } catch (err) {
      setModalError(err.message)
    } finally {
      setModalLoading(false)
    }
  }

  // --- Edit User ---
  const handleOpenEdit = (user) => {
    setEditingUser(user)
    setEditFormData({
      displayName: user.displayName || '',
      phone: user.phone || user.pass?.phone || '',
      role: user.role || 'user',
      password: '',
    })
    setModalError(null)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingUser) return
    setModalLoading(true)
    setModalError(null)

    try {
      const token = await getToken()
      const payload = {
        displayName: editFormData.displayName,
        phone: editFormData.phone,
        role: editFormData.role,
      }
      if (editFormData.password) {
        payload.password = editFormData.password
      }

      const res = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update user.')
      }

      setUsers(users.map(u => u._id === editingUser._id ? data.user : u))
      setEditingUser(null)
      notify(`User ${data.user.email} updated successfully!`)
    } catch (err) {
      setModalError(err.message)
    } finally {
      setModalLoading(false)
    }
  }

  // --- Delete User ---
  const handleConfirmDelete = async () => {
    if (!deletingUser) return
    setDeletingId(deletingUser._id)

    try {
      const token = await getToken()
      const res = await fetch(`/api/admin/users/${deletingUser._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete user.')
      }

      setUsers(users.filter(u => u._id !== deletingUser._id))
      setDeletingUser(null)
      notify(`User ${deletingUser.email} has been removed.`)
    } catch (err) {
      alert(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  // --- Quick Role Update ---
  const updateRole = async (userId, newRole) => {
    setUpdatingId(userId)
    try {
      const token = await getToken()
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      })
      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u))
        notify('User role updated.')
      }
    } catch (err) {
      console.error('Failed to update role:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  // --- Password Reset Link ---
  const handleResetUserPassword = async (userId, userEmail) => {
    setResettingId(userId)
    setGeneratedLink(null)
    setCopiedLink(false)
    try {
      const token = await getToken()
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setGeneratedLink({ email: userEmail, link: data.resetLink })
      } else {
        const err = await res.json()
        alert('Failed: ' + (err.message || 'Could not generate reset link'))
      }
    } catch (err) {
      console.error('Password reset error:', err)
      alert('Error requesting password reset link.')
    } finally {
      setResettingId(null)
    }
  }

  const copyResetLink = () => {
    if (generatedLink?.link) {
      navigator.clipboard.writeText(generatedLink.link)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  const roleBadge = (role) => {
    const styles = {
      admin: 'text-emerald bg-emerald/10 border-emerald/20',
      security: 'text-brass bg-brass/10 border-brass/20',
      user: 'text-steel bg-white/[0.03] border-white/[0.06]',
    }
    const icons = {
      admin: <Shield size={10} />,
      security: <Shield size={10} />,
      user: <UserIcon size={10} />,
    }
    return (
      <span className={`inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase px-2 py-1 border ${styles[role]}`}>
        {icons[role]} {role}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-widest text-bone uppercase">User Accounts & Identifiers</h1>
          <p className="font-mono text-xs text-steel mt-1">
            Directory of all accounts created on the platform with pass claim telemetry ({meta.total || users.length} total)
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Refresh / Sync Button */}
          <button
            onClick={() => fetchUsers(search, roleFilter, passFilter, true)}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 px-3 py-2 border border-white/[0.08] hover:border-emerald/40 bg-charcoal text-steel hover:text-bone font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh and sync accounts"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-emerald' : ''} />
            <span>Sync</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            disabled={exporting || users.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 border border-white/[0.08] hover:border-brass/40 bg-charcoal text-steel hover:text-brass font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
            title="Export all accounts to CSV"
          >
            <Download size={13} className={exporting ? 'animate-bounce text-brass' : ''} />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          {/* Add User Button */}
          <button
            onClick={() => { setShowAddModal(true); setModalError(null) }}
            className="px-4 py-2 bg-emerald text-charcoal font-mono text-xs tracking-wider uppercase flex items-center gap-2 hover:bg-emerald-dim transition-colors font-bold cursor-pointer"
          >
            <UserPlus size={14} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Account Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 border border-white/[0.06] bg-iron/20 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] tracking-wider uppercase text-steel/70 block">Total Accounts Created</span>
            <p className="font-mono text-2xl font-bold text-bone mt-0.5">{meta.total || users.length}</p>
          </div>
          <Users size={20} className="text-emerald/80" />
        </div>

        <div className="p-3.5 border border-emerald/20 bg-emerald/5 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] tracking-wider uppercase text-emerald/80 block">QR Passes Claimed</span>
            <p className="font-mono text-2xl font-bold text-emerald mt-0.5">{meta.withPass}</p>
          </div>
          <Ticket size={20} className="text-emerald" />
        </div>

        <div className="p-3.5 border border-brass/20 bg-brass/5 flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] tracking-wider uppercase text-brass/80 block">Pending QR Pass</span>
            <p className="font-mono text-2xl font-bold text-brass mt-0.5">{meta.withoutPass}</p>
          </div>
          <AlertTriangle size={20} className="text-brass" />
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-3 border border-emerald/40 bg-emerald/10 text-emerald font-mono text-xs flex items-center justify-between">
          <span>{notification.msg}</span>
          <button onClick={() => setNotification(null)}><X size={13} /></button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 bg-iron/20 p-3.5 border border-white/[0.06]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Pass Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 lg:pb-0 scrollbar-none">
            <span className="font-mono text-[10px] text-steel/60 uppercase tracking-wider mr-1.5 shrink-0">Pass Status:</span>
            {[
              { label: `All Accounts (${meta.total || users.length})`, value: '' },
              { label: `QR Claimed (${meta.withPass})`, value: 'has_pass' },
              { label: `No Pass Yet (${meta.withoutPass})`, value: 'no_pass' },
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => setPassFilter(tab.value)}
                className={`px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors shrink-0 ${
                  passFilter === tab.value
                    ? 'bg-emerald text-charcoal font-bold'
                    : 'text-steel hover:text-bone hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-initial">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email or name..."
                className="bg-charcoal border border-white/[0.06] text-bone font-mono text-xs pl-9 pr-4 py-1.5 w-full lg:w-60 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 font-mono text-xs tracking-wider uppercase border border-white/[0.1] text-steel hover:text-bone transition-colors shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1 border-t border-white/[0.04] pt-2.5 overflow-x-auto max-w-full scrollbar-none">
          <span className="font-mono text-[10px] text-steel/60 uppercase tracking-wider mr-1.5 shrink-0">Role Filter:</span>
          {[
            { label: 'All Roles', value: '' },
            { label: 'Users', value: 'user' },
            { label: 'Security', value: 'security' },
            { label: 'Admins', value: 'admin' },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setRoleFilter(tab.value)}
              className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors shrink-0 ${
                roleFilter === tab.value
                  ? 'bg-brass text-charcoal font-bold'
                  : 'text-steel/80 hover:text-bone hover:bg-white/[0.04]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Password Reset Link Card */}
      {generatedLink && (
        <div className="p-4 border border-brass-dim/30 bg-iron/30 flex flex-col gap-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brass font-mono text-xs">
              <KeyRound size={15} />
              <span className="font-bold truncate">Password Reset Link for {generatedLink.email}</span>
            </div>
            <button
              onClick={() => setGeneratedLink(null)}
              className="text-steel/60 hover:text-bone transition-colors shrink-0 ml-2"
            >
              <X size={14} />
            </button>
          </div>
          <p className="font-mono text-[11px] text-steel/70">
            Share this link with the user to let them set a new password.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-1">
            <input
              type="text"
              readOnly
              value={generatedLink.link}
              className="flex-1 min-w-0 bg-charcoal border border-white/[0.08] text-bone font-mono text-xs px-3 py-2 select-all focus:outline-none"
            />
            <button
              onClick={copyResetLink}
              className="px-3 py-2 bg-emerald text-charcoal font-mono text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 hover:bg-emerald-dim transition-colors shrink-0"
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="border border-white/[0.06] overflow-x-auto w-full max-w-full min-w-0">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-white/[0.06] bg-iron/30">
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Account User</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Email & Contact</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Role</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">QR Entry Pass</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3">Last Active</th>
              <th className="font-mono text-[10px] tracking-wider text-steel/60 uppercase px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="w-6 h-6 border-2 border-brass-dim border-t-emerald rounded-full animate-spin mx-auto" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 font-mono text-sm text-steel">
                  No user accounts found matching current filters.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isCurrentAdmin = currentAdmin?.email?.toLowerCase() === u.email?.toLowerCase()
                const phoneNum = u.phone || u.pass?.phone

                return (
                  <tr key={u._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald/10 border border-emerald/20 flex items-center justify-center font-mono text-xs text-emerald uppercase font-bold shrink-0">
                          {u.displayName?.[0] || u.email?.[0] || '?'}
                        </div>
                        <div>
                          <span className="font-mono text-xs text-bone font-bold block">{u.displayName || 'Unnamed User'}</span>
                          <span className="font-mono text-[9px] text-steel/50">
                            Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                          </span>
                          {isCurrentAdmin && (
                            <span className="font-mono text-[9px] text-brass uppercase tracking-wider ml-1 font-bold">(You)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs px-4 py-3">
                      <span className="text-steel block select-all">{u.email}</span>
                      {phoneNum ? (
                        <a
                          href={`tel:${phoneNum}`}
                          className="text-emerald hover:underline text-[11px] inline-flex items-center gap-1 mt-1 font-bold tracking-wider"
                          title="Call Attendee"
                        >
                          <Phone size={10} className="text-emerald shrink-0" />
                          <span>{phoneNum}</span>
                        </a>
                      ) : (
                        <span className="text-steel/40 text-[10px] block mt-1 italic flex items-center gap-1">
                          <PhoneOff size={10} className="text-steel/30 shrink-0" />
                          <span>No number (No QR pass)</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{roleBadge(u.role)}</td>
                    <td className="px-4 py-3">
                      {u.hasPass ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 border border-emerald/30 bg-emerald/10 text-emerald font-bold">
                            <Check size={10} />
                            <span>{u.pass?.registrationId || 'CLAIMED'}</span>
                          </span>
                          {u.pass?.college && (
                            <span className="font-mono text-[10px] text-steel/60 block truncate max-w-[170px]" title={u.pass.college}>
                              {u.pass.college}
                            </span>
                          )}
                          {(u.pass?.day1CheckedIn || u.pass?.day2CheckedIn) && (
                            <span className="font-mono text-[9px] text-brass uppercase font-semibold block">
                              Check-in: {u.pass.day1CheckedIn ? 'Day 1 ✓' : ''}{u.pass.day1CheckedIn && u.pass.day2CheckedIn ? ' | ' : ''}{u.pass.day2CheckedIn ? 'Day 2 ✓' : ''}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 border border-brass/30 bg-brass/10 text-brass font-bold">
                            <AlertTriangle size={10} />
                            <span>NO PASS YET</span>
                          </span>
                          <span className="font-mono text-[9px] text-steel/50 block">Account created only</span>
                        </div>
                      )}
                    </td>
                    <td className="font-mono text-[10px] text-steel/50 px-4 py-3">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Inline Role Selector */}
                        <select
                          value={u.role}
                          onChange={(e) => updateRole(u._id, e.target.value)}
                          disabled={updatingId === u._id || isCurrentAdmin}
                          className="bg-charcoal border border-white/[0.06] text-bone font-mono text-[10px] px-2 py-1.5 focus:outline-none focus:border-brass-dim/40 transition-colors uppercase tracking-wider disabled:opacity-30 cursor-pointer"
                        >
                          <option value="user">User</option>
                          <option value="security">Security</option>
                          <option value="admin">Admin</option>
                        </select>

                        {/* Edit User Button */}
                        <button
                          onClick={() => handleOpenEdit(u)}
                          title="Edit User Details"
                          className="p-1.5 border border-white/[0.06] bg-charcoal hover:border-brass-dim/40 text-steel hover:text-bone transition-colors cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>

                        {/* Reset Password Button */}
                        <button
                          onClick={() => handleResetUserPassword(u._id, u.email)}
                          disabled={resettingId === u._id}
                          title="Generate Password Reset Link"
                          className="p-1.5 border border-white/[0.06] bg-charcoal hover:border-brass-dim/40 text-steel hover:text-brass transition-colors disabled:opacity-30 cursor-pointer"
                        >
                          <KeyRound size={13} className={resettingId === u._id ? 'animate-spin' : ''} />
                        </button>

                        {/* Delete User Button */}
                        <button
                          onClick={() => setDeletingUser(u)}
                          disabled={isCurrentAdmin || deletingId === u._id}
                          title={isCurrentAdmin ? "Cannot delete yourself" : "Delete User"}
                          className="p-1.5 border border-white/[0.06] bg-charcoal hover:border-crimson/40 text-steel hover:text-crimson transition-colors disabled:opacity-20 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ============================================================ */}
      {/* ADD USER MODAL */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-charcoal border border-brass-dim/30 p-4 sm:p-6 shadow-2xl my-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-brass">
                <UserPlus size={18} />
                <h2 className="font-display text-lg tracking-wider text-bone uppercase">Create New User</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-steel/60 hover:text-bone transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 border border-crimson/40 bg-crimson/10 text-crimson font-mono text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newFormData.displayName}
                  onChange={(e) => setNewFormData({ ...newFormData, displayName: e.target.value })}
                  placeholder="Officer / Participant Name"
                  className="w-full bg-iron/40 border border-white/[0.08] text-bone font-mono text-sm px-3.5 py-2.5 focus:outline-none focus:border-brass-dim/50"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newFormData.email}
                  onChange={(e) => setNewFormData({ ...newFormData, email: e.target.value })}
                  placeholder="user@vectors.dev"
                  className="w-full bg-iron/40 border border-white/[0.08] text-bone font-mono text-sm px-3.5 py-2.5 focus:outline-none focus:border-brass-dim/50"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1.5">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={newFormData.phone}
                  onChange={(e) => setNewFormData({ ...newFormData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full bg-iron/40 border border-white/[0.08] text-bone font-mono text-sm px-3.5 py-2.5 focus:outline-none focus:border-brass-dim/50"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1.5">
                  Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newFormData.password}
                  onChange={(e) => setNewFormData({ ...newFormData, password: e.target.value })}
                  placeholder="Choose password"
                  className="w-full bg-iron/40 border border-white/[0.08] text-bone font-mono text-sm px-3.5 py-2.5 focus:outline-none focus:border-brass-dim/50"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1.5">
                  System Role
                </label>
                <select
                  value={newFormData.role}
                  onChange={(e) => setNewFormData({ ...newFormData, role: e.target.value })}
                  className="w-full bg-iron/40 border border-white/[0.08] text-bone font-mono text-sm px-3.5 py-2.5 focus:outline-none focus:border-brass-dim/50 uppercase cursor-pointer"
                >
                  <option value="user" className="bg-charcoal">User (Normal Attendee)</option>
                  <option value="security" className="bg-charcoal">Security (Gate Scanner Access)</option>
                  <option value="admin" className="bg-charcoal">Admin (Full Dashboard Access)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-white/[0.08] text-steel font-mono text-xs tracking-wider uppercase hover:text-bone transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 py-2.5 bg-emerald text-charcoal font-mono text-xs tracking-wider uppercase hover:bg-emerald-dim transition-colors disabled:opacity-40"
                >
                  {modalLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* EDIT USER MODAL */}
      {/* ============================================================ */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-charcoal border border-brass-dim/30 p-4 sm:p-6 shadow-2xl my-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-brass">
                <Edit2 size={18} />
                <h2 className="font-display text-lg tracking-wider text-bone uppercase">Edit User</h2>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-steel/60 hover:text-bone transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="font-mono text-xs text-steel/60 mb-4 truncate">
              Editing <strong className="text-bone">{editingUser.email}</strong>
            </p>

            {modalError && (
              <div className="mb-4 p-3 border border-crimson/40 bg-crimson/10 text-crimson font-mono text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editFormData.displayName}
                  onChange={(e) => setEditFormData({ ...editFormData, displayName: e.target.value })}
                  className="w-full bg-iron/40 border border-white/[0.08] text-bone font-mono text-sm px-3.5 py-2.5 focus:outline-none focus:border-brass-dim/50"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1.5">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full bg-iron/40 border border-white/[0.08] text-bone font-mono text-sm px-3.5 py-2.5 focus:outline-none focus:border-brass-dim/50"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1.5">
                  Role
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full bg-iron/40 border border-white/[0.08] text-bone font-mono text-sm px-3.5 py-2.5 focus:outline-none focus:border-brass-dim/50 uppercase cursor-pointer"
                >
                  <option value="user" className="bg-charcoal">User</option>
                  <option value="security" className="bg-charcoal">Security</option>
                  <option value="admin" className="bg-charcoal">Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-wider uppercase text-steel/60 mb-1.5">
                  Set New Password (Optional)
                </label>
                <input
                  type="password"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  placeholder="Leave empty to keep current password"
                  className="w-full bg-iron/40 border border-white/[0.08] text-bone font-mono text-sm px-3.5 py-2.5 focus:outline-none focus:border-brass-dim/50"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 border border-white/[0.08] text-steel font-mono text-xs tracking-wider uppercase hover:text-bone transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 py-2.5 bg-emerald text-charcoal font-mono text-xs tracking-wider uppercase hover:bg-emerald-dim transition-colors disabled:opacity-40"
                >
                  {modalLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ============================================================ */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-sm bg-charcoal border border-crimson/40 p-4 sm:p-6 shadow-2xl my-auto">
            <div className="flex items-center gap-3 text-crimson mb-3">
              <AlertTriangle size={24} />
              <h2 className="font-display text-lg tracking-wider uppercase">Delete User?</h2>
            </div>
            <p className="font-mono text-xs text-steel/80 leading-relaxed mb-6">
              Are you sure you want to permanently delete{' '}
              <strong className="text-bone break-all">{deletingUser.email}</strong>?
              This will remove their profile, authentication record, and access permanently.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingUser(null)}
                className="flex-1 py-2.5 border border-white/[0.08] text-steel font-mono text-xs tracking-wider uppercase hover:text-bone transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingId === deletingUser._id}
                className="flex-1 py-2.5 bg-crimson text-bone font-mono text-xs tracking-wider uppercase hover:bg-crimson/80 transition-colors disabled:opacity-40"
              >
                {deletingId === deletingUser._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
