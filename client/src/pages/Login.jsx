import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * Login — Identity Checkpoint.
 * 
 * This is NOT the same environment as the Home page.
 * The user has moved deeper inside the Monolith. The space is tighter,
 * more compressed. The lighting shifts from the emerald Astrolabe glow
 * to warm brass—a practical overhead light illuminating the terminal.
 * 
 * Composition:
 *   Dark compressed architecture → Overhead brass light → Terminal panel → Form
 * 
 * Usability is primary. The form must be immediately obvious:
 *   Email, Password, Sign In, Google Sign In, Create Account, Back.
 */
export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // TODO: Firebase auth integration
      console.log('Login attempt:', email)
      await new Promise(r => setTimeout(r, 1000))
      navigate('/my-pass')
    } catch (err) {
      setError(err.message || 'Authentication failed')
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
        /* Different environment: darker, tighter, interior space.
           The base color shifts toward bronze/iron to distinguish from Home. */
        background: 'linear-gradient(180deg, #0d0c0a 0%, #0a0a0a 40%, #0e0d0b 100%)'
      }}
    >

      {/* === INTERIOR ARCHITECTURE ===
          Tighter vertical lines suggest the walls are closer.
          The space feels compressed compared to Home's open monolith. */}
      <div className="absolute top-0 left-[12%] w-px h-full bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      <div className="absolute top-0 right-[12%] w-px h-full bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />

      {/* Overhead brass light — practical illumination source.
          A warm, narrow pool of light falls onto the terminal area. */}
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

      {/* === CONTENT === */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-8">

        {/* Terminal Header — system identification */}
        <motion.div {...seq.panel} className="w-full max-w-sm">

          {/* Access label */}
          <div className="mb-8 text-center">
            <p className="font-mono text-[10px] tracking-[0.3em] text-brass-dim uppercase mb-3">
              System Access
            </p>
            <h1 className="font-display text-2xl sm:text-3xl tracking-[0.1em] text-bone uppercase">
              Identity Checkpoint
            </h1>
          </div>

          {/* === THE TERMINAL PANEL ===
              A recessed panel with physical edges. Not a glass card.
              The brass border catches the overhead light. */}
          <motion.div {...seq.form}
            className="w-full p-6 sm:p-8"
            style={{
              background: 'linear-gradient(180deg, #141311 0%, #0f0e0c 100%)',
              border: '1px solid rgba(184,156,73,0.12)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 8px 40px rgba(0,0,0,0.6)'
            }}
          >
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

              {/* Password */}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.15em] text-steel/60 uppercase mb-2">
                  Access Key
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-charcoal border border-white/[0.06] text-bone font-mono text-sm px-4 py-3 focus:outline-none focus:border-brass-dim/40 transition-colors placeholder:text-steel/30"
                  placeholder="••••••••"
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
                className="w-full py-3.5 text-center font-mono text-xs tracking-[0.15em] uppercase text-steel border border-white/[0.06] hover:border-white/[0.12] hover:text-bone transition-all bg-white/[0.01]"
              >
                Continue with Google
              </button>
            </form>
          </motion.div>

          {/* Below the terminal — Create Account + Back */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <Link
              to="/entry-registration"
              className="font-mono text-xs tracking-wider text-steel hover:text-bone transition-colors"
            >
              No account? <span className="text-brass-dim">Create credential</span>
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
