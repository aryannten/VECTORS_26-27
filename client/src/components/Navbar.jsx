import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, LogOut, Shield, LayoutDashboard, User } from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth } from '../contexts/AuthContext'

/**
 * Navbar — VECTORS 26–27 Navigation Bar
 * Features:
 * - Sticky dark glass panel: rgba(10,12,14,0.75) + 14px blur
 * - 1px accent glow seam along the bottom
 * - Minimal cracked "V" monogram + VECTORS badge
 * - Desktop nav links with center-expanding emerald underline on hover
 * - Full route coverage: Home, Events, Schedule, My Pass, Dashboard, Alerts, FAQ
 * - Outlined ring avatar with active glow for logged-in user
 * - Mobile slide-down dark panel with touch-friendly navigation
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userRole, logout, loading, hasPass } = useAuth()

  // Top-level pages don't show a back button
  const topLevelPaths = ['/', '/events', '/login', '/signup', '/schedule', '/announcements', '/faq', '/dashboard']
  const isTopLevel = topLevelPaths.includes(location.pathname)

  // Lock body scroll when mobile menu is open
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
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
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

  // Navigation items based on auth state
  const navItems = user
    ? [
        { to: '/', label: 'Home', index: '01' },
        { to: '/events', label: 'Events', index: '02' },
        { to: '/schedule', label: 'Schedule', index: '03' },
        { to: hasPass ? '/my-pass' : '/entry-registration', label: hasPass ? 'My Pass' : 'Entry Pass', index: '04' },
        { to: '/dashboard', label: 'Dashboard', index: '05' },
        { to: '/announcements', label: 'Alerts', index: '06' },
        { to: '/faq', label: 'FAQ', index: '07' },
      ]
    : [
        { to: '/', label: 'Home', index: '01' },
        { to: '/schedule', label: 'Schedule', index: '02' },
        { to: '/announcements', label: 'Alerts', index: '03' },
        { to: '/faq', label: 'FAQ', index: '04' },
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
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 md:px-8 doom-navbar">

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

          <Link to="/" className="flex items-center gap-2.5 group select-none">
            {/* Minimal Cracked "V" Monogram */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="shrink-0 overflow-visible transition-transform duration-300 group-hover:scale-105"
            >
              <defs>
                <linearGradient id="navVChrome" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#8A909B" />
                  <stop offset="100%" stopColor="#5C6270" />
                </linearGradient>
              </defs>
              <polygon
                points="2,2 8,2 12,18 16,2 22,2 14.5,22 9.5,22"
                fill="url(#navVChrome)"
                stroke="#171A1E"
                strokeWidth="0.5"
              />
              {/* Crimson hairline fissure */}
              <line x1="8" y1="2" x2="12" y2="13" stroke="#C21807" strokeWidth="0.75" />
              <line x1="12" y1="13" x2="10.5" y2="22" stroke="#C21807" strokeWidth="0.5" />
            </svg>

            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-base sm:text-lg tracking-[0.2em] text-chrome-light group-hover:text-white transition-colors">
                VECTORS
              </span>
              <span className="font-mono text-[9px] font-bold text-doom-glow tracking-widest px-1 py-0.2 bg-doom-glow/10 border border-doom-glow/30">
                26–27
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
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
                  <Link
                    to={hasPass ? "/my-pass" : "/entry-registration"}
                    className="doom-btn-primary !p-[1px] hidden sm:inline-flex"
                  >
                    <span className="doom-btn-primary-inner !py-1.5 !px-3 !text-[10px] !tracking-wider">
                      {hasPass ? 'My Pass' : 'Get Pass'}
                    </span>
                  </Link>

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
                  <Link
                    to="/login"
                    className="font-mono text-xs tracking-wider uppercase text-text-muted hover:text-doom-glow transition-colors px-2 py-1"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className="doom-btn-primary !p-[1px]"
                  >
                    <span className="doom-btn-primary-inner !py-1.5 !px-3.5 !text-[11px] !tracking-wider">
                      Join Portal
                    </span>
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 flex lg:hidden flex-col items-center justify-center gap-1.5 text-text-muted hover:text-doom-glow transition-colors cursor-pointer"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <span className={cn('w-5 h-0.5 bg-current transition-all duration-300', isOpen && 'rotate-45 translate-y-2')} />
            <span className={cn('w-5 h-0.5 bg-current transition-all duration-300', isOpen && 'opacity-0')} />
            <span className={cn('w-5 h-0.5 bg-current transition-all duration-300', isOpen && '-rotate-45 -translate-y-2')} />
          </button>
        </div>
      </header>

      {/* Mobile Slide-Down Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-nav"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 bg-doom-bg/98 backdrop-blur-xl flex flex-col justify-between pt-20 pb-8 px-6 sm:px-10 border-b border-doom-glow/30 shadow-[0_10px_35px_rgba(0,0,0,0.9)] lg:hidden overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">VECTORS Command Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="font-mono text-xs text-doom-glow hover:underline uppercase tracking-wider"
                >
                  ✕ Close
                </button>
              </div>

              {/* Navigation Links */}
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
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="doom-btn-primary w-full text-center"
                  >
                    <span className="doom-btn-primary-inner w-full py-2.5 text-xs">
                      Sign In to Account
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
