import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Cpu, 
  Gamepad2,
  AlertTriangle
} from 'lucide-react'
import { cn } from '../lib/utils'

/**
 * EntryPassGate — Cinematic Clearance Enforcement Barrier
 * 
 * Displayed whenever a user attempts to access /events or /events/:eventId
 * without a verified Entry Pass.
 * 
 * Visual Language:
 * - Doomsday Protocol aesthetic (Gunmetal, Steel, Doom Emerald glow)
 * - Telemetry readouts and encrypted sector status cards
 * - Real-time re-scan capability
 * - Clear, unambiguous return to Home
 */
export default function EntryPassGate({
  user,
  loading = false,
  error = null,
  onRetry,
}) {
  const [retrying, setRetrying] = useState(false)

  const handleRetry = async () => {
    if (!onRetry) return
    setRetrying(true)
    try {
      await onRetry()
    } finally {
      setRetrying(false)
    }
  }

  // ==========================================
  // STATE 1: VERIFICATION LOADING / SCANNER
  // ==========================================
  if (loading || retrying) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 sm:p-10 doom-btn-clipped bg-doom-bg2 border border-doom-glow/40 shadow-[0_0_50px_rgba(30,255,160,0.15)] text-center space-y-6 relative overflow-hidden"
        >
          {/* Animated scanning beam */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-doom-glow to-transparent shadow-[0_0_15px_#1EFFA0]"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Scanner Icon */}
          <div className="w-16 h-16 mx-auto rounded-sm bg-doom-glow/10 border border-doom-glow/50 flex items-center justify-center text-doom-glow shadow-[0_0_20px_rgba(30,255,160,0.2)]">
            <RotateCw size={28} className="animate-spin text-doom-glow" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[10px] sm:text-xs text-doom-glow tracking-[0.25em] uppercase font-bold block">
              SYS // SCANNING CLEARANCE ARCHIVES
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-text-primary">
              VERIFYING ENTRY PASS...
            </h2>
            <p className="font-mono text-xs text-text-muted">
              Querying central access mainframe for <span className="text-chrome-light font-bold">{user?.email || 'authenticated operative'}</span>
            </p>
          </div>

          {/* Progress Indeterminate bar */}
          <div className="w-full h-1 bg-white/[0.08] overflow-hidden relative">
            <motion.div
              className="h-full bg-doom-glow shadow-[0_0_10px_#1EFFA0]"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '50%' }}
            />
          </div>

          <p className="font-mono text-[10px] text-text-muted/70 tracking-widest uppercase">
            DOOMSDAY SECURITY PROTOCOL // CLEARANCE CHECK
          </p>
        </motion.div>
      </div>
    )
  }

  // ==========================================
  // STATE 2: VERIFICATION ERROR
  // ==========================================
  if (error) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 sm:p-10 doom-btn-clipped bg-doom-bg2 border border-doom-crimson/50 text-center space-y-6 shadow-[0_0_40px_rgba(194,24,7,0.15)]"
        >
          <div className="w-16 h-16 mx-auto rounded-sm bg-doom-crimson/10 border border-doom-crimson/40 flex items-center justify-center text-doom-crimson-bright">
            <AlertTriangle size={32} />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[10px] sm:text-xs text-doom-crimson-bright tracking-[0.25em] uppercase font-bold block">
              SYS // CLEARANCE ANOMALY
            </span>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-text-primary">
              VERIFICATION FAILED
            </h2>
            <p className="font-mono text-xs text-text-muted">
              {error || 'Unable to establish secure communication with the clearance verification registry.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {onRetry && (
              <button
                onClick={handleRetry}
                className="w-full py-3 px-5 doom-btn-clipped bg-doom-glow text-doom-bg font-mono text-xs uppercase tracking-widest font-bold hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(30,255,160,0.3)]"
              >
                <RotateCw size={14} />
                <span>Retry Clearance Scan</span>
              </button>
            )}
            <Link
              to="/"
              className="w-full py-3 px-5 doom-btn-clipped bg-white/[0.04] border border-white/[0.1] text-text-muted hover:text-white font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>Return Home</span>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // ==========================================
  // STATE 3: ENTRY PASS MANDATORY GATE
  // ==========================================
  return (
    <div className="min-h-[82vh] flex flex-col items-center justify-center px-4 sm:px-6 relative z-10 py-12">
      <div className="w-full max-w-2xl space-y-8">

        {/* Back Link to Home */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-doom-glow transition-colors uppercase tracking-widest group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home</span>
          </Link>

          <span className="font-mono text-[10px] text-doom-crimson-bright tracking-widest uppercase px-2.5 py-1 bg-doom-crimson/10 border border-doom-crimson/30 font-bold">
            CLEARANCE LEVEL // RESTRICTED
          </span>
        </div>

        {/* Main Vault Barrier Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative p-[1.5px] doom-btn-clipped bg-gradient-to-b from-doom-glow/40 via-white/10 to-doom-crimson/30 shadow-[0_15px_50px_rgba(0,0,0,0.85)]"
        >
          <div className="p-6 sm:p-10 md:p-12 doom-btn-clipped bg-doom-bg2 space-y-8 relative overflow-hidden">
            
            {/* Background Radial Ambiance */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-doom-glow/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-doom-crimson/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header Telemetry */}
            <div className="text-center space-y-4 relative z-10">
              <div className="w-16 h-16 mx-auto rounded-sm bg-white/[0.04] border border-white/[0.15] flex items-center justify-center text-doom-glow relative group">
                <div className="absolute inset-0 bg-doom-glow/10 blur-md rounded-full" />
                <Lock size={30} className="relative z-10 text-doom-glow" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-doom-bg border border-doom-crimson/40">
                  <span className="w-2 h-2 rounded-full bg-doom-crimson-bright animate-ping" />
                  <span className="font-mono text-[10px] sm:text-xs text-doom-crimson-bright tracking-[0.2em] uppercase font-bold">
                    SECURITY ACCESS GATEWAY // RESTRICTED
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-text-primary drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
                  ENTRY PASS REQUIRED
                </h1>

                <p className="font-accent text-xs sm:text-sm tracking-[0.2em] text-chrome-light uppercase">
                  — EVENT VAULTS ARE ENCRYPTED UNDER DOOMSDAY PROTOCOL —
                </p>

                <p className="font-body text-sm sm:text-base text-text-muted max-w-lg mx-auto leading-relaxed pt-2">
                  Access to competition sectors—including <strong className="text-text-primary">Technical Protocols</strong> and <strong className="text-text-primary">Non-Technical Protocols</strong>—is strictly gated. You must obtain a verified Digital Entry Pass before accessing event briefs, team registrations, and arena schedules.
                </p>
              </div>
            </div>

            {/* Sector Lock Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              
              {/* Technical Sector Card (Locked) */}
              <div className="p-4 sm:p-5 bg-doom-bg border border-white/[0.08] doom-btn-clipped space-y-3 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-chrome-light">
                    <Cpu size={16} />
                    <span className="font-mono text-xs font-bold tracking-wider">SECTOR // 01</span>
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-doom-crimson-bright px-2 py-0.5 bg-doom-crimson/10 border border-doom-crimson/30 uppercase font-bold">
                    LOCKED
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-text-primary tracking-wide">
                    TECHNICAL PROTOCOLS
                  </h3>
                  <p className="font-mono text-[11px] text-text-muted mt-1">
                    Hackathons, combat robotics, coding sprints, AI challenges.
                  </p>
                </div>
              </div>

              {/* Non-Technical Sector Card (Locked) */}
              <div className="p-4 sm:p-5 bg-doom-bg border border-white/[0.08] doom-btn-clipped space-y-3 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-chrome-light">
                    <Gamepad2 size={16} />
                    <span className="font-mono text-xs font-bold tracking-wider">SECTOR // 02</span>
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-doom-crimson-bright px-2 py-0.5 bg-doom-crimson/10 border border-doom-crimson/30 uppercase font-bold">
                    LOCKED
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-text-primary tracking-wide">
                    NON-TECHNICAL PROTOCOLS
                  </h3>
                  <p className="font-mono text-[11px] text-text-muted mt-1">
                    Esports tournaments, strategy challenges, stage performances.
                  </p>
                </div>
              </div>

            </div>

            {/* Operative Telemetry Strip */}
            <div className="p-4 bg-white/[0.02] border border-white/[0.06] font-mono text-xs space-y-2 relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-2 text-[11px]">
                <span className="text-text-muted">OPERATIVE IDENTITY:</span>
                <span className="text-chrome-light font-bold truncate max-w-[240px]">
                  {user?.displayName || user?.email || 'AUTHENTICATED USER'}
                </span>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2 text-[11px]">
                <span className="text-text-muted">ENTRY CLEARANCE:</span>
                <span className="text-doom-crimson-bright font-bold">
                  UNVERIFIED // PASS REGISTRATION REQUIRED
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2 relative z-10">
              
              {/* Primary CTA */}
              <Link
                to="/entry-registration"
                className="w-full py-4 px-6 doom-btn-clipped bg-doom-glow hover:bg-white text-doom-bg font-mono text-sm uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(30,255,160,0.35)] group"
                id="claim-entry-pass-btn"
              >
                <span>CLAIM YOUR ENTRY PASS</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>

              {/* Auxiliary Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {onRetry && (
                  <button
                    onClick={handleRetry}
                    className="py-3 px-4 doom-btn-clipped bg-white/[0.04] border border-white/[0.1] hover:border-doom-glow/40 text-chrome-light hover:text-doom-glow font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCw size={13} />
                    <span>Re-Check Clearance</span>
                  </button>
                )}

                <Link
                  to="/"
                  className="py-3 px-4 doom-btn-clipped bg-white/[0.04] border border-white/[0.1] hover:border-white/30 text-text-muted hover:text-white font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-center"
                >
                  <ArrowLeft size={13} />
                  <span>Return to Home</span>
                </Link>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </div>
  )
}
