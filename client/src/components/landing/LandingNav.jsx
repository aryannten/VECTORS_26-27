import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Menu, X, LogOut, LayoutDashboard, Shield, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const NAV_LINKS = [
  { label: 'Prologue', href: '#prologue' },
  { label: 'Overview', href: '#overview' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
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

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
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
            {/* Wordmark */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="flex items-center gap-2.5 group"
            >
              <div className="relative">
                <span className="font-display text-lg md:text-xl font-bold tracking-[0.15em] text-text-primary uppercase group-hover:text-doom-glow transition-colors duration-300">
                  VECTORS
                </span>
                <span className="absolute -bottom-0.5 left-0 w-full h-[1.5px] bg-gradient-to-r from-doom-glow via-doom-glow/50 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </div>
              <span className="hidden sm:inline font-mono text-[9px] tracking-[0.25em] text-text-muted/50 uppercase mt-0.5">
                2026
              </span>
            </a>

            {/* Desktop Section Links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={cn(
                    'relative px-3 py-2 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors duration-300 cursor-pointer',
                    activeSection === link.href.replace('#', '')
                      ? 'text-doom-glow'
                      : 'text-text-muted hover:text-text-primary'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[1.5px] bg-doom-glow shadow-[0_0_8px_rgba(30,255,160,0.6)] transition-all duration-300',
                      activeSection === link.href.replace('#', '')
                        ? 'w-[60%]'
                        : 'w-0'
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
                      <Link
                        to={hasPass ? '/my-pass' : '/entry-registration'}
                        className="doom-btn-primary text-[11px] hidden sm:inline-flex"
                      >
                        <span className="doom-btn-primary-inner !py-1.5 !px-3.5 !text-[10px] !tracking-wider">
                          {hasPass ? 'My Pass' : 'Get Pass'}
                        </span>
                      </Link>

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
                      <Link
                        to="/login"
                        className="hidden sm:inline-flex doom-btn-primary text-[11px]"
                      >
                        <span className="doom-btn-primary-inner !py-1.5 !px-4">
                          Sign In / Register
                        </span>
                      </Link>
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
              <Link
                to={hasPass ? '/my-pass' : '/entry-registration'}
                onClick={() => setMobileOpen(false)}
                className="doom-btn-primary w-full text-center"
              >
                <span className="doom-btn-primary-inner w-full !py-2">
                  {hasPass ? 'My Pass' : 'Claim Pass'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="font-mono text-xs tracking-wider uppercase text-doom-crimson-bright hover:underline mt-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="w-48">
              <Link
                to="/login"
                className="doom-btn-primary w-full text-center"
                onClick={() => setMobileOpen(false)}
              >
                <span className="doom-btn-primary-inner w-full !py-2">
                  Sign In / Register
                </span>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  )
}
