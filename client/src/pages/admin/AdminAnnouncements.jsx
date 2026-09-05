import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Bell, Plus, Pin, Trash2, Edit3, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { eventsData } from '../../data/events'
import { cn } from '../../lib/utils'

/**
 * AdminAnnouncements — Management dashboard to publish, pin, and moderate festival alerts.
 */
export default function AdminAnnouncements() {
  const { getToken } = useAuth()
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    relatedEventSlug: '',
    isPinned: false,
    isPublished: true,
  })

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/announcements/admin', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Failed to fetch announcements:', err)
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  const handleOpenCreate = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      content: '',
      category: 'general',
      relatedEventSlug: '',
      isPinned: false,
      isPublished: true,
    })
    setShowModal(true)
  }

  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category || 'general',
      relatedEventSlug: item.relatedEventSlug || '',
      isPinned: Boolean(item.isPinned),
      isPublished: Boolean(item.isPublished),
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) return

    setSubmitting(true)
    try {
      const token = await getToken()
      const url = editingItem
        ? `/api/announcements/${editingItem._id}`
        : '/api/announcements'
      const method = editingItem ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setShowModal(false)
        fetchAnnouncements()
      } else {
        const err = await res.json()
        alert(err.message || 'Operation failed')
      }
    } catch (err) {
      console.error('Submit error:', err)
      alert('Failed to save announcement.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this announcement?')) return

    try {
      const token = await getToken()
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setAnnouncements((prev) => prev.filter((a) => a._id !== id))
      } else {
        alert('Failed to delete announcement.')
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleTogglePin = async (item) => {
    try {
      const token = await getToken()
      const res = await fetch(`/api/announcements/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPinned: !item.isPinned }),
      })
      if (res.ok) {
        fetchAnnouncements()
      }
    } catch (err) {
      console.error('Toggle pin error:', err)
    }
  }

  const handleTogglePublish = async (item) => {
    try {
      const token = await getToken()
      const res = await fetch(`/api/announcements/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      })
      if (res.ok) {
        fetchAnnouncements()
      }
    } catch (err) {
      console.error('Toggle publish error:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-widest text-bone uppercase">Announcements</h1>
          <p className="font-mono text-xs text-steel mt-1">Broadcast real-time alerts and schedule shifts</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAnnouncements}
            className="p-2 rounded bg-charcoal border border-white/10 hover:border-white/20 text-steel hover:text-bone transition-colors"
            title="Refresh Feed"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald hover:bg-emerald/90 text-doom-bg font-mono text-xs uppercase tracking-wider font-bold rounded transition-colors"
          >
            <Plus size={14} />
            <span>New Dispatch</span>
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-steel font-mono text-xs">
            Loading alerts feed...
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-16 bg-charcoal/40 border border-white/5 rounded-xl">
            <Bell size={32} className="mx-auto text-steel/40 mb-2" />
            <p className="font-display text-base text-bone uppercase tracking-wider">No Announcements Published</p>
            <p className="font-mono text-xs text-steel mt-1">Create your first broadcast to notify all festival attendees.</p>
          </div>
        ) : (
          announcements.map((item) => (
            <div
              key={item._id}
              className={cn(
                'p-5 rounded-xl border transition-all flex flex-col md:flex-row md:items-start justify-between gap-4',
                item.isPinned
                  ? 'bg-charcoal/90 border-amber-400/40 shadow-lg shadow-amber-400/5'
                  : 'bg-charcoal/50 hover:bg-charcoal/80 border-white/[0.07]'
              )}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {item.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono text-[10px] uppercase font-bold tracking-wider">
                      <Pin size={10} className="rotate-45" />
                      Pinned
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-steel font-mono text-[10px] uppercase tracking-wider">
                    {item.category}
                  </span>
                  {!item.isPublished && (
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-mono text-[10px] uppercase tracking-wider">
                      Draft (Unpublished)
                    </span>
                  )}
                  {item.relatedEventSlug && (
                    <span className="font-mono text-[10px] text-emerald">
                      Linked: {item.relatedEventSlug}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-lg text-bone font-semibold tracking-wide">
                  {item.title}
                </h3>

                <p className="text-steel text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {item.content}
                </p>

                <div className="text-[11px] font-mono text-steel/60 pt-1">
                  Author: {item.author || 'Admin'} // {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-start pt-2 md:pt-0">
                <button
                  onClick={() => handleTogglePin(item)}
                  className={cn(
                    'p-2 rounded border transition-colors',
                    item.isPinned
                      ? 'bg-amber-400/20 text-amber-400 border-amber-400/30'
                      : 'bg-white/5 text-steel border-white/10 hover:text-bone'
                  )}
                  title={item.isPinned ? 'Unpin' : 'Pin to Top'}
                >
                  <Pin size={14} className="rotate-45" />
                </button>

                <button
                  onClick={() => handleTogglePublish(item)}
                  className={cn(
                    'p-2 rounded border transition-colors',
                    item.isPublished
                      ? 'bg-emerald/10 text-emerald border-emerald/20'
                      : 'bg-white/5 text-steel border-white/10 hover:text-bone'
                  )}
                  title={item.isPublished ? 'Unpublish' : 'Publish'}
                >
                  {item.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded bg-white/5 border border-white/10 hover:border-white/20 text-steel hover:text-bone transition-colors"
                  title="Edit"
                >
                  <Edit3 size={14} />
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded bg-red-500/10 border border-red-500/20 hover:border-red-500/40 text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-charcoal border border-white/15 rounded-xl shadow-2xl p-6 space-y-5">
            <h2 className="font-display text-xl uppercase tracking-wider text-bone">
              {editingItem ? 'Edit Announcement' : 'Create New Broadcast'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-steel mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Schedule Shift: Robo Wars Moved to 11:30"
                  className="w-full px-3 py-2 bg-doom-bg border border-white/10 rounded text-xs font-mono text-bone focus:outline-none focus:border-emerald/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-steel mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-doom-bg border border-white/10 rounded text-xs font-mono text-bone focus:outline-none focus:border-emerald/50 cursor-pointer"
                  >
                    <option value="general">General</option>
                    <option value="schedule">Schedule</option>
                    <option value="alert">Alert</option>
                    <option value="rules">Rules</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-steel mb-1">
                    Linked Event (Optional)
                  </label>
                  <select
                    value={formData.relatedEventSlug}
                    onChange={(e) => setFormData({ ...formData, relatedEventSlug: e.target.value })}
                    className="w-full px-3 py-2 bg-doom-bg border border-white/10 rounded text-xs font-mono text-bone focus:outline-none focus:border-emerald/50 cursor-pointer"
                  >
                    <option value="">None</option>
                    {eventsData.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-steel mb-1">
                  Content / Message Body
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter detailed dispatch or instructions..."
                  className="w-full px-3 py-2 bg-doom-bg border border-white/10 rounded text-xs font-sans text-bone focus:outline-none focus:border-emerald/50"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-steel">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="rounded bg-doom-bg border-white/10 text-emerald focus:ring-0"
                  />
                  <span>Pin to top</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-steel">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded bg-doom-bg border-white/10 text-emerald focus:ring-0"
                  />
                  <span>Publish immediately</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-steel font-mono text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded bg-emerald hover:bg-emerald/90 text-doom-bg font-mono text-xs uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Save Updates' : 'Broadcast Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
