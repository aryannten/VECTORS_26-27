import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, User, LogOut, Shield, LayoutDashboard } from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth } from '../contexts/AuthContext'

/**
 * Navbar — Structural navigation.
 * Functional first: auth-aware, contextual back, real routing.
 * Shows/hides nav items based on auth state and role.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userRole, logout, loading } = useAuth()

  // Top-level pages don't show a back button
  const topLevelPaths = ['/', '/events', '/login', '/signup']
  const isTopLevel = topLevelPaths.includes(location.pathname)

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const menuVariants = {
    closed: {
      clipPath: 'inset(0 0 100% 0)',
      transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
    },
    open: {
      clipPath: 'inset(0 0 0% 0)',
      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] }
    }
  }

  const itemVariants = {
    closed: { opacity: 0, y: 8 },
    open: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + i * 0.06, duration: 0.4, ease: 'easeOut' }
    })
  }

  // Build nav items based on auth state
  const navItems = [
    { to: '/', label: 'Home', index: '01', always: true },
  ]

  // Only show these if logged in
  if (user) {
    navItems.push({ to: '/events', label: 'Events', index: '02', always: false })
    navItems.push({ to: '/entry-registration', label: 'Entry Pass', index: '03', always: false })
  }

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
    navigate('/')
  }

  // User initial for avatar
  const userInitial = user?.displayName?.[0] || user?.email?.[0] || '?'

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 md:px-6 bg-charcoal/90 backdrop-blur-sm border-b border-white/[0.04]">

        {/* Left: Back or Brand */}
        <div className="flex items-center gap-3">
          {!isTopLevel && (
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center text-steel hover:text-bone transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
            </button>
          )}
          <Link to="/" className="font-display text-sm tracking-[0.2em] text-bone uppercase">
            VECTORS
          </Link>
        </div>

        {/* Right: Auth + Menu Toggle */}
        <div className="flex items-center gap-2">
          {!loading && (
            <>
              {user ? (
                /* Logged in — show avatar initial */
                <div className="flex items-center gap-2">
                  {/* Admin dashboard link */}
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
                  {/* Security scanner link */}
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
                  {/* User avatar */}
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

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 flex items-center justify-center text-steel hover:text-bone transition-colors relative z-[60]"
            aria-label="Menu"
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span className={cn("block h-px bg-current transition-all duration-300 origin-center", isOpen && "rotate-45 translate-y-[3px]")} />
              <span className={cn("block h-px bg-current transition-all duration-300 origin-center", isOpen && "-rotate-45 -translate-y-[3px]")} />
            </div>
          </button>
        </div>
      </header>

      {/* Full-screen menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 bg-charcoal flex flex-col justify-end pb-24 px-6 md:px-12"
          >
            <nav className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.div key={item.to} custom={i} variants={itemVariants}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-baseline gap-4 py-3 group transition-colors",
                      location.pathname === item.to ? "text-bone" : "text-steel hover:text-bone"
                    )}
                  >
                    <span className="font-mono text-[10px] tracking-widest text-brass-dim w-6">{item.index}</span>
                    <span className="font-display text-3xl md:text-5xl tracking-wide uppercase">{item.label}</span>
                  </Link>
                </motion.div>
              ))}

              {/* Auth section, separated */}
              <motion.div custom={navItems.length} variants={itemVariants} className="mt-8 pt-6 border-t border-white/[0.06]">
                {user ? (
                  <div className="flex flex-col gap-4">
                    {/* User info */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald/20 border border-emerald/30 flex items-center justify-center text-emerald font-mono text-sm uppercase">
                        {userInitial}
                      </div>
                      <div>
                        <p className="font-mono text-sm text-bone">{user.displayName || user.email}</p>
                        <p className="font-mono text-[10px] text-steel/50 uppercase tracking-wider">{userRole}</p>
                      </div>
                    </div>
                    {/* Admin link in menu */}
                    {userRole === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 text-brass hover:text-brass-dim transition-colors font-mono text-sm tracking-wider"
                      >
                        <LayoutDashboard size={15} strokeWidth={1.5} />
                        Admin Dashboard
                      </Link>
                    )}
                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 text-steel hover:text-crimson transition-colors font-mono text-sm tracking-wider"
                    >
                      <LogOut size={15} strokeWidth={1.5} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      className="flex items-center gap-3 text-steel hover:text-bone transition-colors font-mono text-sm tracking-wider"
                    >
                      <User size={15} strokeWidth={1.5} />
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center gap-3 text-brass-dim hover:text-brass transition-colors font-mono text-sm tracking-wider"
                    >
                      <User size={15} strokeWidth={1.5} />
                      Create Account
                    </Link>
                  </div>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
