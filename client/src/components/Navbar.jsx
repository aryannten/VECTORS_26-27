import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

/**
 * Navbar — The mechanical navigation toggle.
 * On mobile: a full-screen overlay menu.
 * On desktop: a minimal top bar.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Explore Events' },
    { to: '/my-pass', label: 'My Pass' },
    { to: '/entry-registration', label: 'Register' },
  ]

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-charcoal/80 backdrop-blur-sm border-b border-brass-dim/20">
        <Link to="/" className="font-display text-xl tracking-widest text-bone uppercase">
          Vectors '26
        </Link>

        {/* Mechanical Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-10 h-10 flex items-center justify-center text-brass hover:text-emerald transition-colors duration-300"
          aria-label="Toggle navigation"
          id="nav-toggle"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </header>

      {/* Full-Screen Overlay Menu */}
      <div
        className={`fixed inset-0 z-40 bg-charcoal/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 transition-all duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setIsOpen(false)}
            className={`font-display text-3xl md:text-4xl tracking-widest uppercase transition-colors duration-300 ${
              location.pathname === link.to
                ? 'text-emerald'
                : 'text-steel hover:text-brass'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  )
}
