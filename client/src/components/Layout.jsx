import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

/**
 * Layout — Structural shell only.
 * Each page owns its own visual environment.
 * Layout provides navigation and footer, nothing else.
 */
export default function Layout() {
  return (
    <div className="min-h-screen relative flex flex-col">
      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-brass-dim/10 py-6 px-6 text-center text-slate text-xs font-mono bg-charcoal">
        <p>&copy; 2026 VECTORS. All rights reserved.</p>
      </footer>
    </div>
  )
}
