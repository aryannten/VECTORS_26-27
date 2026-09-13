import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, LogOut, Shield, LayoutDashboard, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import DoomButton from './ui/DoomButton'
import { cn } from '../lib/utils'

/**
 * Navbar — VECTORS 26–27 Navigation Bar
 * Responsive, auth-aware header with tactical doomsday styling.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userRole, logout, loading, hasPass } = useAuth()

  // Top-level pages don't show a back button
  const topLevelPaths = ['/', '/festival', '/events', '/login', '/signup', '/faq', '/dashboard']
  const isTopLevel = topLevelPaths.includes(location.pathname)

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] }
    }
  }

  const itemVariants = {
    closed: { opacity: 0, x: -12 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.15 + i * 0.04, duration: 0.35, ease: 'easeOut' }
    })
  }

  // Navigation items (accessible to all users, with auth-aware labeling)
  const navItems = [
    { to: '/', label: 'Home', index: '01' },
    { to: '/events', label: 'Events', index: '02' },
    { to: user ? (hasPass ? '/my-pass' : '/entry-registration') : '/entry-registration', label: user && hasPass ? 'My Pass' : 'Entry Pass', index: '03' },
    { to: '/dashboard', label: 'Dashboard', index: '04' },
    { to: '/faq', label: 'FAQ', index: '05' },
  ]

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
    navigate('/')
  }

  // User initial for avatar
  const userInitial = user?.displayName?.[0] || user?.email?.[0] || '?'

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-12 doom-navbar">

        {/* Left: Monogram & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!isTopLevel && (
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-doom-glow transition-colors shrink-0 mr-1 cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft size={16} strokeWidth={1.5} />
            </button>
          )}

          <Link to="/" className="flex items-center group select-none py-1" aria-label="VECTORS 2026-27 Home">
            <img
              src="/vector26-logo-new.png"
              alt="VECTORS 2026-27"
              className="h-11 sm:h-13 md:h-14 w-auto max-w-[190px] sm:max-w-[240px] md:max-w-[280px] object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(30,255,160,0.3)]"
            />
          </Link>
        </div>

        {/* Center: Desktop Nav Links (Visible from md: 768px upwards) */}
        <nav className="hidden md:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn('doom-nav-link !px-2.5 !text-[11px]', isActive && 'active')}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: Auth, CTA & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!loading && (
            <>
              {user ? (
                /* Logged In State */
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Admin dashboard link */}
                  {userRole === 'admin' && (
                    <Link
                      to="/admin"
                      className="hidden sm:flex items-center gap-1 text-xs font-mono tracking-wider text-chrome-light hover:text-doom-glow transition-colors px-2 py-1"
                      aria-label="Admin Dashboard"
                    >
                      <LayoutDashboard size={13} strokeWidth={1.5} />
                      <span className="hidden xl:inline">Admin</span>
                    </Link>
                  )}

                  {/* Security scanner link */}
                  {(userRole === 'security' || userRole === 'admin') && (
                    <Link
                      to="/security"
                      className="hidden sm:flex items-center gap-1 text-xs font-mono tracking-wider text-chrome-light hover:text-doom-glow transition-colors px-2 py-1"
                      aria-label="Security Scanner"
                    >
                      <Shield size={13} strokeWidth={1.5} />
                      <span className="hidden xl:inline">Scanner</span>
                    </Link>
                  )}

                  {/* Quick pass CTA */}
                  <DoomButton
                    to={hasPass ? "/my-pass" : "/entry-registration"}
                    size="sm"
                    className="hidden sm:inline-flex !py-1 !px-3 !text-[10px]"
                  >
                    {hasPass ? 'My Pass' : 'Get Pass'}
                  </DoomButton>

                  {/* Avatar ring shortcut to Dashboard */}
                  <Link
                    to="/dashboard"
                    className="relative group flex items-center justify-center"
                    aria-label="User Dashboard"
                  >
                    <div className="w-8 h-8 rounded-full border border-doom-glow/50 bg-doom-bg2 flex items-center justify-center text-doom-glow font-mono text-xs uppercase shadow-[0_0_10px_rgba(30,255,160,0.3)] transition-all duration-300 group-hover:border-doom-glow group-hover:shadow-[0_0_16px_rgba(30,255,160,0.6)]">
                      {userInitial}
                    </div>
                  </Link>

                  {/* Sign out shortcut */}
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex w-7 h-7 items-center justify-center text-text-muted hover:text-doom-crimson-bright transition-colors cursor-pointer"
                    aria-label="Sign Out"
                    title="Sign Out"
                  >
                    <LogOut size={14} strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                /* Logged Out State */
                <div className="flex items-center gap-2 sm:gap-3">
                  <DoomButton
                    to="/login"
                    size="sm"
                    className="!py-1.5 !px-3.5 !text-[11px] font-mono tracking-wider font-semibold uppercase"
                  >
                    ENTER THE PORTAL
                  </DoomButton>
                </div>
              )}
            </>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 flex md:hidden flex-col items-center justify-center gap-1.5 text-text-muted hover:text-doom-glow transition-colors cursor-pointer"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <span className={cn('w-5 h-0.5 bg-current transition-all duration-300', isOpen && 'rotate-45 translate-y-2')} />
            <span className={cn('w-5 h-0.5 bg-current transition-all duration-300', isOpen && 'opacity-0')} />
            <span className={cn('w-5 h-0.5 bg-current transition-all duration-300', isOpen && '-rotate-45 -translate-y-2')} />
          </button>
        </div>
      </header>

      {/* Mobile Slide-Down Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-x-0 top-16 bottom-0 z-40 bg-doom-bg/95 backdrop-blur-xl border-b border-doom-glow/20 px-6 py-8 flex flex-col justify-between overflow-y-auto md:hidden"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="font-mono text-xs uppercase tracking-widest text-text-muted">Navigation Protocols</span>
                <span className="font-mono text-xs text-doom-glow">ONLINE</span>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-1">
                {navItems.map((item, i) => {
                  const isActive = item.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.to)
                  return (
                    <motion.div key={item.to} custom={i} variants={itemVariants}>
                      <Link
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center justify-between py-2.5 border-b border-white/[0.04] transition-colors',
                          isActive ? 'text-doom-glow font-bold' : 'text-text-muted hover:text-text-primary'
                        )}
                      >
                        <span className="font-display text-lg sm:text-xl uppercase tracking-wider">{item.label}</span>
                        <span className="font-mono text-[10px] text-doom-glow/70">{item.index}</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/[0.08] flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 pb-2">
                    <div className="w-8 h-8 rounded-full border border-doom-glow bg-doom-bg2 flex items-center justify-center text-doom-glow font-mono text-xs uppercase">
                      {userInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-text-primary truncate">{user.displayName || user.email}</p>
                      <p className="font-mono text-[10px] text-doom-glow uppercase tracking-wider">{userRole || 'participant'}</p>
                    </div>
                  </div>

                  {userRole === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-chrome-light font-mono text-xs py-1"
                    >
                      <LayoutDashboard size={13} />
                      <span>Admin Command Center</span>
                    </Link>
                  )}

                  {(userRole === 'security' || userRole === 'admin') && (
                    <Link
                      to="/security"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-chrome-light font-mono text-xs py-1"
                    >
                      <Shield size={13} />
                      <span>Gate QR Scanner</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-text-muted hover:text-doom-crimson-bright font-mono text-xs py-1 text-left cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <DoomButton
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    size="md"
                    className="w-full text-center font-mono tracking-wider font-semibold uppercase !text-xs"
                  >
                    ENTER THE PORTAL
                  </DoomButton>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
