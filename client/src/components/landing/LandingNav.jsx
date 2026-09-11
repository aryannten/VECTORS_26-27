import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Menu, X, LogOut, LayoutDashboard, Shield, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import DoomButton from '../ui/DoomButton'

const NAV_LINKS = [
  { label: 'Arrival', href: '#hero' },
  { label: 'Destiny', href: '#destiny' },
  { label: 'Supremacy', href: '#supremacy' },
  { label: 'Protocols', href: '#events' },
  { label: 'Passes', href: '#passes' },
]

/**
 * LandingNav — Floating sticky navigation for the landing page.
 * Responsive to authentication state (logged in vs guest).
 * Transparent at top, dark glass-panel on scroll.
 * Active section highlighting via IntersectionObserver.
 */
export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const observerRef = useRef(null)

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

  // Intersection Observer for active section
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )

    // Delay to let DOM mount
    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 500)

    observerRef.current = observer

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const scrollToSection = useCallback((href) => {
    setMobileOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Brand with Vector Logo & Gemini Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="flex items-center gap-2 group select-none"
                aria-label="VECTORS 26 Home"
              >
                <img
                  src="/vector26-logo.svg"
                  alt="VECTORS 26"
                  className="h-9 sm:h-10 w-auto max-w-[145px] sm:max-w-[175px] object-contain transition-transform duration-300 group-hover:scale-105 mix-blend-screen"
                />
              </a>

              {/* Google Gemini AI Partner Badge */}
              <div className="hidden sm:flex items-center gap-1.5 pl-2.5 sm:pl-3 border-l border-white/10 py-0.5">
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0">
                  <path
                    d="M12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24Z"
                    fill="url(#gemini-nav-grad)"
                  />
                  <defs>
                    <linearGradient id="gemini-nav-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1EFFA0" />
                      <stop offset="0.5" stopColor="#38BDF8" />
                      <stop offset="1" stopColor="#A78BFA" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-text-muted/70 group-hover:text-doom-glow transition-colors font-semibold">
                  GEMINI
                </span>
              </div>
            </div>

            {/* Desktop Section Links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={cn(
                    'relative px-3 py-2 font-mono text-[11px] tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer group/navitem hover:-translate-y-0.5',
                    activeSection === link.href.replace('#', '')
                      ? 'text-doom-glow font-bold'
                      : 'text-text-muted hover:text-white'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[1.5px] bg-doom-glow shadow-[0_0_8px_rgba(30,255,160,0.8)] transition-all duration-300',
                      activeSection === link.href.replace('#', '')
                        ? 'w-[65%]'
                        : 'w-0 group-hover/navitem:w-[45%]'
                    )}
                  />
                </button>
              ))}
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

                      {/* Quick Pass CTA */}
                      <DoomButton
                        to={hasPass ? '/my-pass' : '/entry-registration'}
                        size="sm"
                        variant="doom"
                        className="hidden sm:inline-flex"
                      >
                        {hasPass ? 'My Pass' : 'Get Pass'}
                      </DoomButton>

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
          className="fixed inset-0 z-40 bg-[rgba(5,6,6,0.96)] backdrop-blur-2xl flex flex-col items-center justify-center gap-5 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className={cn(
                'font-display text-2xl font-bold tracking-[0.1em] uppercase transition-colors duration-300',
                activeSection === link.href.replace('#', '')
                  ? 'text-doom-glow'
                  : 'text-text-primary hover:text-doom-glow'
              )}
            >
              {link.label}
            </button>
          ))}

          <div className="w-48 h-[1px] bg-white/[0.1] my-2" />

          {user ? (
            <div className="flex flex-col items-center gap-3 w-48">
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="font-mono text-sm tracking-wider uppercase text-doom-glow hover:text-white"
              >
                Dashboard
              </Link>
              <DoomButton
                to={hasPass ? '/my-pass' : '/entry-registration'}
                size="md"
                variant="doom"
                className="w-full text-center"
                onClick={() => setMobileOpen(false)}
              >
                {hasPass ? 'My Pass' : 'Claim Pass'}
              </DoomButton>
              <button
                onClick={handleLogout}
                className="font-mono text-xs tracking-wider uppercase text-doom-crimson-bright hover:underline mt-2"
              >
                Sign Out
              </button>
            </div>
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
      )}
    </>
  )
}
