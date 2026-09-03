import { Link } from 'react-router-dom'

/**
 * 404 — Not Found page.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-6xl text-crimson tracking-widest">404</h1>
      <p className="font-mono text-steel mt-4">This vault does not exist.</p>
      <Link
        to="/"
        className="mt-8 py-3 px-8 font-display tracking-widest uppercase border border-brass text-brass hover:bg-brass hover:text-charcoal transition-colors duration-300"
      >
        Return Home
      </Link>
    </div>
  )
}
