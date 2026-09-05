import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, User, LogOut, Shield, LayoutDashboard } from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth } from '../contexts/AuthContext'

/**
 * Navbar — Doomsday Protocol Navigation Bar
 * 
 * Features:
 * - Sticky dark glass panel: rgba(10,12,14,0.75) + 12px blur
 * - 1px radioactive emerald glow seam along the bottom
 * - Minimal cracked "V" monogram + VECTORS 26 badge
 * - Desktop nav links with center-expanding emerald underline on hover
 * - Outlined ring avatar with active emerald glow for logged-in user
 * - Armor-plated clipped CTA button
 * - Mobile slide-down dark panel with emerald seam border
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userRole, logout, loading } = useAuth()

  // Top-level pages don't show a back button
  const topLevelPaths = ['/', '/events', '/login', '/signup']
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
      transition: { delay: 0.15 + i * 0.05, duration: 0.35, ease: 'easeOut' }
    })
  }

  // Navigation Links
  const navItems = [
    { to: '/', label: 'Home', index: '01' },
    { to: '/events', label: 'Events', index: '02' },
    { to: user ? '/entry-registration' : '/login', label: 'Entry Pass', index: '03' },
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
              className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-doom-glow transition-colors shrink-0 mr-1"
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
                  <stop offset="50%" stopColor="#C7CCD1" />
                  <stop offset="100%" stopColor="#5C6270" />
                </linearGradient>
                <filter id="monogramGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Base V letterform */}
              <path
                d="M3 4 L12 21 L21 4 L16.5 4 L12 14.5 L7.5 4 Z"
                fill="url(#navVChrome)"
              />

              {/* Soft emerald energy bleeding through crack */}
              <path
                d="M4 11 L10 13 L13 10"
                stroke="#1EFFA0"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#monogramGlow)"
                opacity="0.85"
              />

              {/* Crimson fracture split */}
              <path
                d="M4 11 L10 13 L13 10"
                stroke="#C21807"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Wordmark */}
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-base sm:text-lg tracking-[0.2em] text-chrome-light group-hover:text-white transition-colors">
                VECTORS
              </span>
              <span className="font-mono text-[9px] font-bold text-doom-glow tracking-widest px-1 py-0.2 bg-doom-glow/10 border border-doom-glow/30">
                26
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-3" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn('doom-nav-link', isActive && 'active')}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: Auth, CTA & Mobile Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
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
                      <span>Admin</span>
                    </Link>
                  )}

                  {/* Security scanner link */}
                  {userRole === 'security' && (
                    <Link
                      to="/security"
                      className="hidden sm:flex items-center gap-1 text-xs font-mono tracking-wider text-chrome-light hover:text-doom-glow transition-colors px-2 py-1"
                      aria-label="Security Scanner"
                    >
                      <Shield size={13} strokeWidth={1.5} />
                      <span>Scanner</span>
                    </Link>
                  )}

                  {/* Clear Armor CTA: Entry Pass or My Pass */}
                  <Link
                    to="/entry-registration"
                    className="doom-btn-primary !p-[1px] hidden sm:inline-flex"
                  >
                    <span className="doom-btn-primary-inner !py-1.5 !px-3.5 !text-[11px] !tracking-wider">
                      Passes
                    </span>
                  </Link>

                  {/* Restyled Avatar: outlined ring with active emerald glow */}
                  <div
                    className="w-7 h-7 rounded-full border border-doom-glow/50 bg-doom-bg2 flex items-center justify-center text-doom-glow font-mono text-xs uppercase shadow-[0_0_12px_rgba(30,255,160,0.35)]"
                    title={user.displayName || user.email}
                  >
                    {userInitial}
                  </div>
                </div>
              ) : (
                /* Logged Out State — Clear Armor CTA */
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex text-xs font-mono tracking-wider text-text-muted hover:text-white transition-colors px-2 py-1"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/entry-registration"
                    className="doom-btn-primary !p-[1px]"
                  >
                    <span className="doom-btn-primary-inner !py-1.5 !px-3 sm:!px-4 !text-[11px] !tracking-wider">
                      Get Pass
                    </span>
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-text-muted hover:text-doom-glow transition-colors relative z-[60]"
            aria-label="Toggle Menu"
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span className={cn('block h-px bg-current transition-all duration-300 origin-center', isOpen && 'rotate-45 translate-y-[3px] bg-doom-glow')} />
              <span className={cn('block h-px bg-current transition-all duration-300 origin-center', isOpen && '-rotate-45 -translate-y-[3px] bg-doom-glow')} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 bg-doom-bg/98 backdrop-blur-xl flex flex-col justify-between pt-24 pb-12 px-6 sm:px-10 border-b border-doom-glow/30 shadow-[0_10px_35px_rgba(0,0,0,0.9)] md:hidden"
          >
            {/* Top Seam Glow inside mobile menu */}
            <div className="absolute top-16 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-doom-glow/40 to-transparent shadow-[0_0_10px_rgba(30,255,160,0.5)]" />

            {/* Nav links */}
            <nav className="flex flex-col gap-2">
              {navItems.map((item, i) => {
                const isActive = location.pathname === item.to
                return (
                  <motion.div key={item.to} custom={i} variants={itemVariants}>
                    <Link
                      to={item.to}
                      className={cn(
                        'flex items-center gap-4 py-3.5 border-b border-white/[0.04] transition-colors',
                        isActive ? 'text-doom-glow border-doom-glow/30' : 'text-text-muted hover:text-text-primary'
                      )}
                    >
                      <span className="font-mono text-xs tracking-widest text-doom-glow/70">{item.index}</span>
                      <span className="font-display font-bold text-2xl tracking-wider uppercase">{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Bottom Auth & Actions */}
            <div className="pt-6 border-t border-white/[0.08] flex flex-col gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border border-doom-glow/50 bg-doom-bg2 flex items-center justify-center text-doom-glow font-mono text-sm uppercase shadow-[0_0_12px_rgba(30,255,160,0.35)] shrink-0">
                      {userInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-text-primary truncate">{user.displayName || user.email}</p>
                      <p className="font-mono text-[10px] text-doom-glow uppercase tracking-wider">{userRole}</p>
                    </div>
                  </div>

                  {userRole === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2.5 text-chrome-light hover:text-doom-glow transition-colors font-mono text-xs tracking-wider py-1"
                    >
                      <LayoutDashboard size={14} />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 text-text-muted hover:text-doom-crimson-bright transition-colors font-mono text-xs tracking-wider py-1 text-left"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/entry-registration"
                    className="doom-btn-primary w-full text-center"
                  >
                    <span className="doom-btn-primary-inner w-full py-3 text-xs">
                      Get Entry Pass
                    </span>
                  </Link>
                  <Link
                    to="/login"
                    className="text-center font-mono text-xs tracking-widest uppercase text-text-muted hover:text-white py-2"
                  >
                    Sign In to Account
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
