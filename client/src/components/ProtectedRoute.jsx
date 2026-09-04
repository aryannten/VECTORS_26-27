import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * ProtectedRoute — Wraps routes that require authentication and/or specific roles.
 *
 * Props:
 *   children      — The component to render if authorized
 *   allowedRoles  — Optional array of roles that can access this route
 *                   e.g., ['admin'] or ['security', 'admin']
 *                   If omitted, any authenticated user can access
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, userRole, loading } = useAuth()
  const location = useLocation()

  // Show nothing while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-brass-dim border-t-emerald rounded-full animate-spin" />
          <p className="font-mono text-xs text-steel tracking-widest uppercase">
            Verifying credentials...
          </p>
        </div>
      </div>
    )
  }

  // Not logged in → redirect to login, preserving the intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Logged in but wrong role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-charcoal px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-crimson/20 flex items-center justify-center mb-6">
          <span className="text-crimson text-3xl">✕</span>
        </div>
        <h2 className="font-display text-2xl tracking-widest text-bone mb-2">Access Denied</h2>
        <p className="font-mono text-sm text-steel mb-8">
          You do not have permission to access this area.
        </p>
        <a
          href="/"
          className="py-3 px-8 font-display tracking-widest uppercase bg-emerald text-charcoal hover:bg-emerald-dim transition-colors duration-300 text-sm"
        >
          Return Home
        </a>
      </div>
    )
  }

  return children
}
