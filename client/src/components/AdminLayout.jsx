import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LayoutDashboard, Users, Ticket, Calendar, LogOut, Shield, ArrowLeft } from 'lucide-react'
import { cn } from '../lib/utils'

/**
 * AdminLayout — Dashboard shell with sidebar navigation.
 * More functional, less cinematic than the main site.
 */
export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/registrations', label: 'Registrations', icon: Ticket },
    { to: '/admin/events', label: 'Events', icon: Calendar },
    { to: '/admin/users', label: 'Users', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-charcoal text-bone flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/[0.04] bg-iron/30 flex flex-col fixed inset-y-0 left-0 z-40">
        {/* Brand */}
        <div className="p-4 border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-emerald" />
            <span className="font-display text-sm tracking-[0.15em] text-bone uppercase">VECTORS</span>
          </div>
          <p className="font-mono text-[9px] tracking-wider text-brass-dim mt-1 uppercase">Admin Console</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1">
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
            <div className="w-6 h-6 rounded-full bg-emerald/20 border border-emerald/30 flex items-center justify-center text-emerald font-mono text-[10px] uppercase">
              {user?.displayName?.[0] || user?.email?.[0] || '?'}
            </div>
            <p className="font-mono text-[10px] text-steel truncate">{user?.email}</p>
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
      <main className="flex-1 ml-56 p-6 md:p-8 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
