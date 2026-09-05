import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LayoutDashboard, Users, Ticket, Calendar, LogOut, Shield, ArrowLeft, Menu, X, Bell, ClipboardList } from 'lucide-react'
import { cn } from '../lib/utils'

/**
 * AdminLayout — Responsive dashboard shell with collapsible sidebar navigation for mobile.
 */
export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/registrations', label: 'Entry Passes', icon: Ticket },
    { to: '/admin/event-registrations', label: 'Event Signups', icon: ClipboardList },
    { to: '/admin/events', label: 'Events Control', icon: Calendar },
    { to: '/admin/announcements', label: 'Announcements', icon: Bell },
    { to: '/admin/users', label: 'User Roles', icon: Users },
  ]

  const userInitial = user?.displayName?.[0] || user?.email?.[0] || '?'

  return (
    <div className="min-h-screen bg-transparent text-bone flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-charcoal/90 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 flex items-center justify-center text-steel hover:text-bone transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-emerald shrink-0" />
            <span className="font-display text-xs sm:text-sm tracking-[0.15em] text-bone uppercase">VECTORS Admin</span>
          </div>
        </div>

        <div className="w-7 h-7 rounded-full bg-emerald/20 border border-emerald/30 flex items-center justify-center text-emerald font-mono text-xs uppercase shrink-0">
          {userInitial}
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Responsive Sidebar */}
      <aside
        className={cn(
          "w-64 md:w-56 shrink-0 border-r border-white/[0.06] bg-charcoal/95 md:bg-charcoal/85 backdrop-blur-md flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald" />
              <span className="font-display text-sm tracking-[0.15em] text-bone uppercase">VECTORS</span>
            </div>
            <p className="font-mono text-[9px] tracking-wider text-brass-dim mt-1 uppercase">Admin Console</p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-steel hover:text-bone transition-colors p-1"
            aria-label="Close Sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded font-mono text-xs tracking-wider transition-colors',
                isActive
                  ? 'bg-emerald/10 text-emerald border border-emerald/20'
                  : 'text-steel hover:text-bone hover:bg-white/[0.03]'
              )}
            >
              <link.icon size={14} strokeWidth={1.5} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/[0.04] space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald/20 border border-emerald/30 flex items-center justify-center text-emerald font-mono text-[10px] uppercase shrink-0">
              {userInitial}
            </div>
            <p className="font-mono text-[10px] text-steel truncate flex-1">{user?.email}</p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 w-full px-3 py-2 rounded font-mono text-[10px] tracking-wider text-steel hover:text-bone hover:bg-white/[0.03] transition-colors"
          >
            <ArrowLeft size={12} />
            Back to Site
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded font-mono text-[10px] tracking-wider text-steel hover:text-crimson hover:bg-crimson/5 transition-colors"
          >
            <LogOut size={12} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 ml-0 md:ml-56 p-4 sm:p-6 md:p-8 pt-18 md:pt-8 min-w-0 max-w-full overflow-x-hidden min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
