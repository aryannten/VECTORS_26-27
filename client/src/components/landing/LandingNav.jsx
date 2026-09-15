import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Menu, X, LogOut, LayoutDashboard, Shield, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import DoomButton from '../ui/DoomButton'

/**
 * LandingNav — Floating sticky navigation for the landing page.
 * Responsive to authentication state (logged in vs guest).
 * Transparent at top, dark glass-panel on scroll.
 */
export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigate = useNavigate()
  const { user, userRole, logout, loading, hasPass } = useAuth()
  const userInitial = user?.displayName?.[0] || user?.email?.[0] || '?'

  const handleLogout = async () => {
    await logout()
    setMobileOpen(false)
    navigate('/')
  }

  // Scroll detection — navbar transitions to dark glass once scrolled past hero top
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navItems = [
    { to: '/', label: 'HOME' },
    { to: '/events', label: 'EVENTS' },
    { to: user ? (hasPass ? '/my-pass' : '/entry-registration') : '/entry-registration', label: user && hasPass ? 'MY PASS' : 'ENTRY PASS' },
    { to: '/dashboard', label: 'DASHBOARD' },
    { to: '/faq', label: 'FAQ' },
  ]

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[rgba(5,6,6,0.88)] backdrop-blur-xl shadow-[0_1px_0_0_rgba(30,255,160,0.15),0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        )}
        role="navigation"
        aria-label="Landing page navigation"
      >
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
            {/* Brand with Vector Logo */}
            <div className="flex items-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="flex items-center group select-none py-1"
                aria-label="VECTORS 2026-27 Home"
              >
                <img
                  src="/vector26-logo-new.webp"
                  alt="VECTORS 2026-27"
                  decoding="async"
                  className="h-11 sm:h-13 md:h-15 lg:h-16 w-auto max-w-45 sm:max-w-57.5 md:max-w-70 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(30,255,160,0.3)]"
                />
              </a>
            </div>

            {/* Center: Desktop Navigation Links (Accessible to All Users) */}
            <div className="hidden md:flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => {
                const isActive = item.to === '/'

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={(e) => {
                      if (item.to === '/') {
                        e.preventDefault()
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }
                    }}
                    className={cn(
                      'relative px-2.5 lg:px-3.5 py-2 font-mono text-[11px] tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer group/navitem hover:-translate-y-0.5',
                      isActive
                        ? 'text-doom-glow font-bold'
                        : 'text-text-muted hover:text-white'
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        'absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[1.5px] bg-doom-glow shadow-[0_0_8px_rgba(30,255,160,0.8)] transition-all duration-300',
                        isActive
                          ? 'w-[75%]'
                          : 'w-0 group-hover/navitem:w-[50%]'
                      )}
                    />
                  </Link>
                )
              })}
            </div>

            {/* Right: Auth State & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {!loading && (
                <>
                  {user ? (
                    /* ── Logged In State ── */
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Admin link */}
                      {userRole === 'admin' && (
                        <Link
                          to="/admin"
                          className="hidden sm:flex items-center gap-1 text-[11px] font-mono tracking-wider text-chrome-light hover:text-doom-glow transition-colors px-2 py-1"
                          aria-label="Admin Dashboard"
                        >
                          <LayoutDashboard size={13} strokeWidth={1.5} />
                          <span className="hidden xl:inline">Admin</span>
                        </Link>
                      )}

                      {/* Security Scanner */}
                      {(userRole === 'security' || userRole === 'admin') && (
                        <Link
                          to="/security"
                          className="hidden sm:flex items-center gap-1 text-[11px] font-mono tracking-wider text-chrome-light hover:text-doom-glow transition-colors px-2 py-1"
                          aria-label="Security Scanner"
                        >
                          <Shield size={13} strokeWidth={1.5} />
                          <span className="hidden xl:inline">Scanner</span>
                        </Link>
                      )}

                      {/* User Avatar Circle -> Dashboard */}
                      <Link
                        to="/dashboard"
                        className="relative group flex items-center justify-center"
                        aria-label="User Dashboard"
                        title="Dashboard"
                      >
                        <div className="w-8 h-8 rounded-full border border-doom-glow/50 bg-doom-bg2 flex items-center justify-center text-doom-glow font-mono text-xs uppercase shadow-[0_0_10px_rgba(30,255,160,0.3)] transition-all duration-300 group-hover:border-doom-glow group-hover:shadow-[0_0_16px_rgba(30,255,160,0.6)]">
                          {userInitial}
                        </div>
                      </Link>

                      {/* Sign Out Button */}
                      <button
                        onClick={handleLogout}
                        className="hidden sm:flex w-7 h-7 items-center justify-center text-text-muted hover:text-doom-crimson-bright transition-colors cursor-pointer"
                        aria-label="Sign Out"
                        title="Sign Out"
                      >
                        <LogOut size={15} strokeWidth={1.5} />
                      </button>
                    </div>
                  ) : (
                    /* ── Logged Out State ── */
                    <div className="flex items-center gap-2">
                      <DoomButton
                        to="/login"
                        size="sm"
                        variant="doom"
                        className="hidden sm:inline-flex"
                      >
                        ENTER THE PORTAL
                      </DoomButton>
                    </div>
                  )}
                </>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-text-muted hover:text-doom-glow transition-colors cursor-pointer"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(5,6,6,0.96)] backdrop-blur-2xl flex flex-col items-center justify-center gap-4 sm:gap-5 md:hidden px-6"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <div className="flex flex-col items-center gap-3.5 w-full max-w-xs">
            {navItems.map((item) => {
              const isActive = item.to === '/'
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    setMobileOpen(false)
                    if (item.to === '/') {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  }}
                  className={cn(
                    'font-display text-xl sm:text-2xl font-bold tracking-[0.12em] uppercase transition-colors duration-200',
                    isActive
                      ? 'text-doom-glow'
                      : 'text-text-primary hover:text-doom-glow'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}

            <div className="w-48 h-px bg-white/10 my-2" />

            {user ? (
              <button
                onClick={handleLogout}
                className="font-mono text-xs tracking-widest uppercase text-doom-crimson-bright hover:underline cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <div className="w-52">
                <DoomButton
                  to="/login"
                  size="md"
                  variant="doom"
                  className="w-full text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  ENTER THE PORTAL
                </DoomButton>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
