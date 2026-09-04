import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

/**
 * Signup — Credential Forge.
 * 
 * Same architectural environment as Login (deep interior, brass light),
 * but the terminal panel is for creating a new identity.
 */
export default function Signup() {
  const navigate = useNavigate()
  const { user, signup, loginWithGoogle } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/events" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await signup(email, password, displayName)
      navigate('/events', { replace: true })
    } catch (err) {
      const code = err.code
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.')
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.')
      } else if (code === 'auth/invalid-email') {
        setError('Invalid email address.')
      } else {
        setError(err.message || 'Signup failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError(null)
    try {
      await loginWithGoogle()
      navigate('/events', { replace: true })
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setLoading(false)
        return
      }
      setError(err.message || 'Google sign-up failed.')
    } finally {
      setLoading(false)
    }
  }

  const seq = {
    panel:  { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } },
    form:   { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay: 0.6, ease: 'easeOut' } },
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(180deg, rgba(13,12,10,0.55) 0%, rgba(10,10,10,0.65) 40%, rgba(14,13,11,0.8) 100%)'
      }}
    >
      {/* Interior architecture lines */}
      <div className="absolute top-0 left-[12%] w-px h-full bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      <div className="absolute top-0 right-[12%] w-px h-full bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />

      {/* Overhead brass light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-brass/30" />
      <div className="absolute pointer-events-none"
        style={{
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '600px',
          background: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(184,156,73,0.06) 0%, transparent 70%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-8">
        <motion.div {...seq.panel} className="w-full max-w-sm">

          {/* Header */}
          <div className="mb-8 text-center">
            <p className="font-mono text-[10px] tracking-[0.3em] text-brass-dim uppercase mb-3">
              Registration
            </p>
            <h1 className="font-display text-2xl sm:text-3xl tracking-[0.1em] text-bone uppercase">
              Create Account
            </h1>
          </div>

          {/* Terminal Panel */}
          <motion.div {...seq.form}
            className="w-full p-5 sm:p-8"
            style={{
              background: 'linear-gradient(180deg, #141311 0%, #0f0e0c 100%)',
              border: '1px solid rgba(184,156,73,0.12)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 8px 40px rgba(0,0,0,0.6)'
            }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Display Name */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.15em] text-steel/60 uppercase mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full bg-charcoal border border-white/[0.06] text-bone font-mono text-sm px-4 py-3 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
                  placeholder="Aryan Yadav"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.15em] text-steel/60 uppercase mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-charcoal border border-white/[0.06] text-bone font-mono text-sm px-4 py-3 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
                  placeholder="operator@vectors.dev"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.15em] text-steel/60 uppercase mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full bg-charcoal border border-white/[0.06] text-bone font-mono text-sm px-4 py-3 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
                  placeholder="Choose password (min 6 characters)"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.15em] text-steel/60 uppercase mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full bg-charcoal border border-white/[0.06] text-bone font-mono text-sm px-4 py-3 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
                  placeholder="Re-enter your password"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="font-mono text-xs text-crimson">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password || !displayName}
                className="w-full py-3.5 text-center font-mono text-xs tracking-[0.2em] uppercase text-charcoal bg-emerald hover:bg-emerald-dim disabled:opacity-30 disabled:cursor-not-allowed transition-colors mt-1"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-white/[0.04]" />
                <span className="font-mono text-[9px] tracking-widest text-steel/40 uppercase">or</span>
                <div className="flex-1 h-px bg-white/[0.04]" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full py-3.5 text-center font-mono text-xs tracking-[0.15em] uppercase text-steel border border-white/[0.06] hover:border-white/[0.12] hover:text-bone transition-all bg-white/[0.01] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Continue with Google
              </button>
            </form>
          </motion.div>

          {/* Below terminal */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <Link
              to="/login"
              className="font-mono text-xs tracking-wider text-steel hover:text-bone transition-colors"
            >
              Already have an account? <span className="text-brass-dim">Sign in</span>
            </Link>
            <button
              onClick={() => navigate('/')}
              className="font-mono text-[10px] tracking-wider text-steel/40 hover:text-steel transition-colors"
            >
              ← Return to gateway
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
