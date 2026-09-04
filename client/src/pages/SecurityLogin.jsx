import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Shield, Scan, ArrowLeft, CheckCircle2 } from 'lucide-react'

/**
 * SecurityLogin — Gate Access Terminal.
 * 
 * Direct portal for gate security officers.
 * Officers sign in or create their account using their email and chosen password,
 * with password reset capability.
 */
export default function SecurityLogin() {
  const navigate = useNavigate()
  const { user, userRole, securityLogin, resetPassword } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isNewAccount, setIsNewAccount] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Password reset state
  const [showReset, setShowReset] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(null)
  const [resetError, setResetError] = useState(null)

  // Already logged in with security or admin role → go straight to scanner
  if (user && (userRole === 'security' || userRole === 'admin')) {
    return <Navigate to="/security" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await securityLogin(email, password, isNewAccount, displayName || 'Security Personnel')
      navigate('/security', { replace: true })
    } catch (err) {
      const code = err.code
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setError('Invalid email or password.')
      } else if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Toggle below to sign in.')
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.')
      } else {
        setError(err.message || 'Authentication failed.')
      }
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
        setResetError('No security account found with this email.')
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
    panel: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(8,8,8,0.55) 0%, rgba(10,10,10,0.65) 50%, rgba(12,11,9,0.8) 100%)'
      }}
    >
      <motion.div {...seq.panel} className="relative z-10 w-full max-w-sm">

        {/* Header — Tactical branding */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full border border-brass-dim/30 flex items-center justify-center bg-iron/30">
            <Shield size={24} className="text-brass" />
          </div>
          <h1 className="font-display text-xl tracking-[0.2em] text-bone uppercase">
            {showReset ? 'Account Recovery' : 'Security Terminal'}
          </h1>
          <p className="font-mono text-[10px] tracking-[0.2em] text-steel/50 uppercase mt-2">
            {showReset ? 'Password Reset' : 'VECTORS 2026 Gate Access'}
          </p>
        </div>

        {/* Login / Reset Form */}
        <div className="p-6"
          style={{
            background: 'linear-gradient(180deg, #111110 0%, #0d0d0c 100%)',
            border: '1px solid rgba(184,156,73,0.1)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.6)',
          }}
        >
          {showReset ? (
            /* Reset Password Form */
            <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
              <p className="font-mono text-xs text-steel/70 leading-relaxed">
                Enter your security email to receive a password reset link.
              </p>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.15em] text-steel/60 uppercase mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-charcoal border border-white/[0.06] text-bone font-mono text-sm px-4 py-3 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
                  placeholder="security@vectors.dev"
                />
              </div>

              {resetSuccess && (
                <div className="p-3 border border-emerald/30 bg-emerald/10 text-emerald font-mono text-xs flex items-start gap-2">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                  <span>{resetSuccess}</span>
                </div>
              )}

              {resetError && (
                <p className="font-mono text-xs text-crimson">{resetError}</p>
              )}

              <button
                type="submit"
                disabled={resetLoading || !email}
                className="w-full py-3.5 text-center font-mono text-xs tracking-[0.2em] uppercase text-charcoal bg-emerald hover:bg-emerald-dim disabled:opacity-30 disabled:cursor-not-allowed transition-colors mt-1"
              >
                {resetLoading ? 'Sending Link...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => { setShowReset(false); setResetError(null); setResetSuccess(null) }}
                className="w-full py-2 text-center font-mono text-xs tracking-wider text-steel/70 hover:text-bone transition-colors flex items-center justify-center gap-1.5 uppercase mt-1"
              >
                <ArrowLeft size={13} /> Back to Sign In
              </button>
            </form>
          ) : (
            /* Sign In / Register Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Name (if new account) */}
              {isNewAccount && (
                <div>
                  <label className="block font-mono text-[10px] tracking-[0.15em] text-steel/60 uppercase mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required={isNewAccount}
                    autoComplete="name"
                    className="w-full bg-charcoal border border-white/[0.06] text-bone font-mono text-sm px-4 py-3 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
                    placeholder="Officer Name"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.15em] text-steel/60 uppercase mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-charcoal border border-white/[0.06] text-bone font-mono text-sm px-4 py-3 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
                  placeholder="security@vectors.dev"
                />
              </div>

              {/* Password with Forgot password button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-mono text-[10px] tracking-[0.15em] text-steel/60 uppercase">
                    Password
                  </label>
                  {!isNewAccount && (
                    <button
                      type="button"
                      onClick={() => { setShowReset(true); setError(null); setResetError(null); setResetSuccess(null) }}
                      className="font-mono text-[10px] tracking-wider text-brass-dim hover:text-brass transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={isNewAccount ? 'new-password' : 'current-password'}
                  className="w-full bg-charcoal border border-white/[0.06] text-bone font-mono text-sm px-4 py-3 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
                  placeholder={isNewAccount ? 'Choose password (min 6 chars)' : 'Enter your password'}
                />
              </div>

              {/* Error */}
              {error && (
                <p className="font-mono text-xs text-crimson text-center leading-relaxed">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-3.5 text-center font-mono text-xs tracking-[0.2em] uppercase text-charcoal bg-emerald hover:bg-emerald-dim disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-1"
              >
                <Scan size={14} />
                {loading ? 'Authenticating...' : isNewAccount ? 'Register & Open Scanner' : 'Sign In & Open Scanner'}
              </button>

              {/* Toggle new/existing account */}
              <button
                type="button"
                onClick={() => { setIsNewAccount(!isNewAccount); setError(null) }}
                className="w-full py-2 text-center font-mono text-[10px] tracking-wider text-steel/60 hover:text-steel transition-colors uppercase"
              >
                {isNewAccount ? '← Already have an account? Sign in' : 'New officer? Register here →'}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center font-mono text-[9px] text-steel/40 mt-6 tracking-wider">
          Gate Access Terminal • Instant Scanner Verification
        </p>
      </motion.div>
    </div>
  )
}
