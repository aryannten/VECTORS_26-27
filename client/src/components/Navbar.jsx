import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Shield, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import FloatingMenu from './ui/liquid-morph-floating-menu'

/**
 * Navbar — Structural top navigation with Liquid Morph Floating Menu.
 * Features brand on the left, liquid morph navbar at top-center, and auth status on the right.
 */
export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userRole, logout, loading } = useAuth()

  // Top-level pages don't show a back button
  const topLevelPaths = ['/', '/events', '/login', '/signup']
  const isTopLevel = topLevelPaths.includes(location.pathname)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Dynamic menu items for the Liquid Morph Navbar
  const floatingMenuItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Events', onClick: () => navigate('/events') },
    ...(user
      ? [
          { label: 'Pass', onClick: () => navigate('/my-pass') },
          userRole === 'admin'
            ? { label: 'Admin', onClick: () => navigate('/admin') }
            : userRole === 'security'
            ? { label: 'Scanner', onClick: () => navigate('/security') }
            : { label: 'Register', onClick: () => navigate('/entry-registration') },
          { label: 'Sign Out', onClick: handleLogout },
        ]
      : [{ label: 'Sign In', onClick: () => navigate('/login') }]),
  ]

  // User initial for avatar
  const userInitial = user?.displayName?.[0] || user?.email?.[0] || '?'

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 md:px-6 bg-charcoal/90 backdrop-blur-sm border-b border-white/[0.04]">
        {/* Left: Back or Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!isTopLevel && (
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-steel hover:text-bone transition-colors shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
            </button>
          )}
          <Link to="/" className="font-display text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] text-bone uppercase shrink-0">
            VECTORS
          </Link>
        </div>

        {/* Right: Auth Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {!loading && (
            <>
              {user ? (
                /* Logged in — show avatar initial + role shortcut */
                <div className="flex items-center gap-2">
                  {userRole === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1 text-xs font-mono tracking-wider text-brass-dim hover:text-brass transition-colors px-2 py-1.5"
                      aria-label="Admin Dashboard"
                    >
                      <LayoutDashboard size={13} strokeWidth={1.5} />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                  )}
                  {userRole === 'security' && (
                    <Link
                      to="/security"
                      className="flex items-center gap-1 text-xs font-mono tracking-wider text-brass-dim hover:text-brass transition-colors px-2 py-1.5"
                      aria-label="Security Scanner"
                    >
                      <Shield size={13} strokeWidth={1.5} />
                      <span className="hidden sm:inline">Scanner</span>
                    </Link>
                  )}
                  <div
                    className="w-7 h-7 rounded-full bg-emerald/20 border border-emerald/30 flex items-center justify-center text-emerald font-mono text-xs uppercase"
                    title={user.displayName || user.email}
                  >
                    {userInitial}
                  </div>
                </div>
              ) : (
                /* Logged out — show sign in */
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-xs font-mono tracking-wider text-steel hover:text-bone transition-colors px-3 py-1.5"
                  aria-label="Sign In"
                >
                  <User size={13} strokeWidth={1.5} />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </>
          )}
        </div>
      </header>

      {/* Liquid Morph Floating Navbar centered at the top */}
      <FloatingMenu items={floatingMenuItems} position="top" />
    </>
  )
}
