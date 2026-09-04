import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, User } from 'lucide-react'
import { cn } from '../lib/utils'

/**
 * Navbar — Structural navigation.
 * Functional first: Sign In always visible, contextual back, real routing.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Top-level pages don't show a back button
  const topLevelPaths = ['/', '/events', '/login']
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

  const navItems = [
    { to: '/', label: 'Home', index: '01' },
    { to: '/events', label: 'Events', index: '02' },
    { to: '/entry-registration', label: 'Entry Pass', index: '03' },
  ]

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
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-xs font-mono tracking-wider text-steel hover:text-bone transition-colors px-3 py-1.5"
            aria-label="Sign In"
          >
            <User size={13} strokeWidth={1.5} />
            <span className="hidden sm:inline">Sign In</span>
          </Link>

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
                <Link
                  to="/login"
                  className="flex items-center gap-3 text-steel hover:text-bone transition-colors font-mono text-sm tracking-wider"
                >
                  <User size={15} strokeWidth={1.5} />
                  Sign In
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
