import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

/**
 * Login — Identity Checkpoint.
 * 
 * Supports email/password login, Google sign-in, and self-service password reset.
 */
export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, userRole, login, loginWithGoogle, resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Password reset state
  const [showReset, setShowReset] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(null)
  const [resetError, setResetError] = useState(null)

  // Redirect if already logged in
  if (user && !loading) {
    if (userRole === 'security') return <Navigate to="/security" replace />
    if (userRole === 'admin') return <Navigate to="/admin" replace />
    const from = (location.state?.from?.pathname && location.state.from.pathname !== '/events') 
      ? location.state.from.pathname 
      : '/'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const backendUser = await login(email, password)
      if (backendUser?.role === 'security') {
        navigate('/security', { replace: true })
      } else if (backendUser?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        const from = (location.state?.from?.pathname && location.state.from.pathname !== '/events') 
          ? location.state.from.pathname 
          : '/'
        navigate(from, { replace: true })
      }
    } catch (err) {
      const code = err.code
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('Invalid email or password.')
      } else if (code === 'auth/wrong-password') {
        setError('Incorrect password.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Try again later or reset password below.')
      } else {
        setError(err.message || 'Authentication failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const backendUser = await loginWithGoogle()
      if (backendUser?.role === 'security') {
        navigate('/security', { replace: true })
      } else if (backendUser?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        const from = (location.state?.from?.pathname && location.state.from.pathname !== '/events') 
          ? location.state.from.pathname 
          : '/'
        navigate(from, { replace: true })
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setLoading(false)
        return
      }
      setError(err.message || 'Google sign-in failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setResetError('Please enter your email address.')
      return
    }

    setResetLoading(true)
    setResetError(null)
    setResetSuccess(null)

    try {
      await resetPassword(email)
      setResetSuccess(`Password reset email sent to ${email}. Check your inbox and spam folder.`)
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setResetError('No account found with this email address.')
      } else if (err.code === 'auth/invalid-email') {
        setResetError('Please enter a valid email address.')
      } else {
        setResetError(err.message || 'Failed to send password reset email.')
      }
    } finally {
      setResetLoading(false)
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
      {/* Interior Architecture Lines */}
      <div className="absolute top-0 left-[12%] w-px h-full bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      <div className="absolute top-0 right-[12%] w-px h-full bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />

      {/* Overhead Brass Light */}
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

          {/* Terminal Header */}
          <div className="mb-8 text-center">
            <p className="font-mono text-[10px] tracking-[0.3em] text-brass-dim uppercase mb-3">
              {showReset ? 'Account Recovery' : 'System Access'}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl tracking-[0.1em] text-bone uppercase">
              {showReset ? 'Reset Password' : 'Identity Checkpoint'}
            </h1>
          </div>

          {/* The Terminal Panel */}
          <motion.div {...seq.form}
            className="w-full p-5 sm:p-8"
            style={{
              background: 'linear-gradient(180deg, #141311 0%, #0f0e0c 100%)',
              border: '1px solid rgba(184,156,73,0.12)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 8px 40px rgba(0,0,0,0.6)'
            }}
          >
            {showReset ? (
              /* Password Reset View */
              <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
                <p className="font-mono text-xs text-steel/70 leading-relaxed">
                  Enter the email address registered with your account. We'll send you a link to reset your password.
                </p>

                {/* Email Input */}
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.15em] text-steel/60 uppercase mb-2">
                    Email Address
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

                {/* Success message */}
                {resetSuccess && (
                  <div className="p-3 border border-emerald/30 bg-emerald/10 text-emerald font-mono text-xs flex items-start gap-2">
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                    <span>{resetSuccess}</span>
                  </div>
                )}

                {/* Error message */}
                {resetError && (
                  <p className="font-mono text-xs text-crimson">{resetError}</p>
                )}

                {/* Send button */}
                <button
                  type="submit"
                  disabled={resetLoading || !email}
                  className="w-full py-3.5 text-center font-mono text-xs tracking-[0.2em] uppercase text-charcoal bg-emerald hover:bg-emerald-dim disabled:opacity-30 disabled:cursor-not-allowed transition-colors mt-1"
                >
                  {resetLoading ? 'Sending Link...' : 'Send Reset Link'}
                </button>

                {/* Back to sign in */}
                <button
                  type="button"
                  onClick={() => { setShowReset(false); setResetError(null); setResetSuccess(null) }}
                  className="w-full py-2 text-center font-mono text-xs tracking-wider text-steel/70 hover:text-bone transition-colors flex items-center justify-center gap-1.5 uppercase mt-1"
                >
                  <ArrowLeft size={13} /> Back to Sign In
                </button>
              </form>
            ) : (
              /* Normal Sign In Form */
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
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

                {/* Password with Forgot password button */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-mono text-[10px] tracking-[0.15em] text-steel/60 uppercase">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setShowReset(true); setError(null); setResetError(null); setResetSuccess(null) }}
                      className="font-mono text-[10px] tracking-wider text-brass-dim hover:text-brass transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full bg-charcoal border border-white/[0.06] text-bone font-mono text-sm px-4 py-3 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
                    placeholder="Enter your password"
                  />
                </div>

                {/* Error state */}
                {error && (
                  <p className="font-mono text-xs text-crimson">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full py-3.5 text-center font-mono text-xs tracking-[0.2em] uppercase text-charcoal bg-emerald hover:bg-emerald-dim disabled:opacity-30 disabled:cursor-not-allowed transition-colors mt-1"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-white/[0.04]" />
                  <span className="font-mono text-[9px] tracking-widest text-steel/40 uppercase">or</span>
                  <div className="flex-1 h-px bg-white/[0.04]" />
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3.5 text-center font-mono text-xs tracking-[0.15em] uppercase text-steel border border-white/[0.06] hover:border-white/[0.12] hover:text-bone transition-all bg-white/[0.01] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue with Google
                </button>
              </form>
            )}
          </motion.div>

          {/* Below the terminal — Create Account + Back */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <Link
              to="/signup"
              className="font-mono text-xs tracking-wider text-steel hover:text-bone transition-colors"
            >
              No account? <span className="text-brass-dim">Create account</span>
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
