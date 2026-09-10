import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Highlights', href: '#highlights' },
  { label: 'Events', href: '#events' },
]

/**
 * LandingNav — Floating sticky navigation for the landing page.
 * Transparent at top, glass-panel on scroll.
 * Active section highlighting via IntersectionObserver.
 */
export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const observerRef = useRef(null)

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
            ? 'bg-[rgba(5,6,6,0.82)] backdrop-blur-xl shadow-[0_1px_0_0_rgba(30,255,160,0.15),0_4px_30px_rgba(0,0,0,0.5)]'
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

            {/* Desktop Links */}
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

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:inline-flex doom-btn-primary text-[11px]"
              >
                <span className="doom-btn-primary-inner !py-2 !px-5">
                  Register
                </span>
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-text-muted hover:text-doom-glow transition-colors"
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
          className="fixed inset-0 z-40 bg-[rgba(5,6,6,0.96)] backdrop-blur-2xl flex flex-col items-center justify-center gap-6 md:hidden"
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

          <div className="mt-6 w-48">
            <Link
              to="/login"
              className="doom-btn-primary w-full"
              onClick={() => setMobileOpen(false)}
            >
              <span className="doom-btn-primary-inner w-full">Register</span>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
