import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

/**
 * Layout — Structural shell.
 * Renders Navbar with top Liquid Morph Floating Menu, page outlet, and footer.
 */
export default function Layout() {
  return (
    <div className="min-h-screen relative flex flex-col w-full max-w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-grow relative w-full min-w-0 max-w-full">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-brass-dim/10 py-6 px-4 sm:px-6 text-center text-slate text-xs font-mono bg-charcoal">
        <p>&copy; 2026 VECTORS. All rights reserved.</p>
      </footer>
    </div>
  )
}
