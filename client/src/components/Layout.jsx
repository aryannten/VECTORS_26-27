import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

/**
 * Layout — Wraps all public-facing pages with the Navbar and footer.
 * The Security scanner route lives outside this layout.
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-charcoal text-bone">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-brass-dim/30 py-8 px-6 text-center text-steel text-sm font-mono">
        <p>&copy; 2026 VECTORS. All rights reserved.</p>
      </footer>
    </div>
  )
}
