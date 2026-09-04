import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import FloatingMenu from './ui/liquid-morph-floating-menu'
import { useAuth } from '../contexts/AuthContext'

/**
 * Layout — Structural shell.
 * Provides top navbar, floating morph navbar, and footer.
 */
export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, userRole } = useAuth()

  // On event detail page, there is a fixed bottom registration CTA, so hide the floating menu
  const isEventDetail = location.pathname.startsWith('/events/') && location.pathname !== '/events'

  // Dynamic menu items based on authentication state
  const menuItems = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Events', onClick: () => navigate('/events') },
    ...(user
      ? [
          { label: 'Pass', onClick: () => navigate('/my-pass') },
          userRole === 'admin'
            ? { label: 'Admin', onClick: () => navigate('/admin') }
            : userRole === 'security'
            ? { label: 'Scanner', onClick: () => navigate('/security') }
            : { label: 'Register', onClick: () => navigate('/entry-registration') },
        ]
      : [{ label: 'Sign In', onClick: () => navigate('/login') }]),
  ]

  return (
    <div className="min-h-screen relative flex flex-col w-full max-w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-grow relative w-full min-w-0 max-w-full">
        <Outlet />
      </main>

      {/* Liquid Morph Floating Navigation Menu */}
      {!isEventDetail && <FloatingMenu items={menuItems} />}

      <footer className="relative z-10 border-t border-brass-dim/10 py-6 px-4 sm:px-6 pb-24 sm:pb-28 text-center text-slate text-xs font-mono bg-charcoal">
        <p>&copy; 2026 VECTORS. All rights reserved.</p>
      </footer>
    </div>
  )
}
