import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, ArrowRight, ShieldCheck, Download, ExternalLink } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

/**
 * My Pass — Displays the user's digital entry pass with QR code.
 * Styled with the Doomsday Protocol aesthetic:
 * - Gunmetal card with emerald border and clipped corners
 * - Authoritative sync with AuthContext and backend
 * - Action buttons to access Event Vaults or return Home
 */
export default function MyPass() {
  const { userPass, hasPass, passLoading } = useAuth()
  const [pass, setPass] = useState(null)

  useEffect(() => {
    if (userPass) {
      setPass(userPass)
      return
    }
    const savedPass = localStorage.getItem('vectorsPass')
    if (savedPass) {
      try {
        setPass(JSON.parse(savedPass))
      } catch (err) {
        console.error('Invalid pass in storage', err)
      }
    }
  }, [userPass])

  if (passLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
        <div className="p-8 doom-btn-clipped bg-doom-bg2 border border-doom-glow/40 text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-doom-glow border-t-transparent animate-spin" />
          <p className="font-mono text-xs text-doom-glow uppercase tracking-widest">
            RETRIEVING DIGITAL PASS ARCHIVES...
          </p>
        </div>
      </div>
    )
  }

  if (!pass && !hasPass) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative z-10">
        <div className="max-w-md w-full p-8 doom-btn-clipped bg-doom-bg2 border border-white/[0.08] space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-doom-crimson-bright tracking-widest uppercase font-bold">
              SYS // NO PASS RECORD FOUND
            </span>
            <h2 className="font-display text-2xl tracking-wider text-text-primary uppercase font-bold">
              NO ENTRY PASS DETECTED
            </h2>
            <p className="font-mono text-xs text-text-muted leading-relaxed">
              You haven't completed your VECTORS 2026 entry pass registration yet. You must complete the registration protocol to unlock the Event Vaults.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/entry-registration"
              className="py-3 px-6 doom-btn-clipped bg-doom-glow text-doom-bg font-mono text-xs uppercase tracking-widest font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(30,255,160,0.3)] flex items-center justify-center gap-2"
            >
              <span>CLAIM YOUR PASS NOW</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              to="/"
              className="py-3 px-6 doom-btn-clipped bg-white/[0.04] border border-white/[0.1] text-text-muted hover:text-white font-mono text-xs uppercase tracking-widest transition-all"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 relative z-10">
      <div className="w-full max-w-sm space-y-6">
        
        {/* Navigation row */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-doom-glow transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </Link>

          <Link
            to="/events"
            className="inline-flex items-center gap-2 font-mono text-xs text-doom-glow hover:underline uppercase tracking-widest font-bold"
          >
            <span>Enter Events</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Digital Pass Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-[1.5px] doom-btn-clipped bg-gradient-to-b from-doom-glow via-doom-glow/30 to-white/10 shadow-[0_15px_45px_rgba(0,0,0,0.8)]"
        >
          <div className="doom-btn-clipped bg-doom-bg2 p-6 sm:p-8 flex flex-col items-center gap-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-doom-glow/10 rounded-full blur-2xl pointer-events-none" />

            {/* Pass Header */}
            <div className="w-full text-center space-y-1 relative z-10 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center justify-center gap-2 text-doom-glow font-mono text-[10px] tracking-[0.25em] uppercase font-bold">
                <ShieldCheck size={14} />
                <span>OFFICIAL DIGITAL PASS</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl tracking-wider text-text-primary uppercase font-bold">
                VECTORS 2026
              </h2>
            </div>

            {/* High-Contrast QR Code */}
            <div className="bg-white p-3.5 border-2 border-doom-glow/60 doom-btn-clipped shadow-[0_0_25px_rgba(30,255,160,0.25)] relative z-10">
              <QRCodeSVG 
                value={pass.registrationId} 
                size={160}
                className="w-40 h-40"
                bgColor="#FFFFFF"
                fgColor="#0A0C0E"
                level="H"
              />
            </div>

            {/* Pass Telemetry Details */}
            <div className="w-full space-y-3 font-mono text-xs relative z-10 pt-2">
              <div className="flex justify-between items-center gap-3 border-b border-white/[0.06] pb-2">
                <span className="text-text-muted shrink-0 uppercase text-[11px]">Pass ID</span>
                <span className="text-doom-glow font-bold truncate max-w-[200px] text-right font-mono tracking-wider">
                  {pass.registrationId}
                </span>
              </div>
              <div className="flex justify-between items-center gap-3 border-b border-white/[0.06] pb-2">
                <span className="text-text-muted shrink-0 uppercase text-[11px]">Operative</span>
                <span className="text-text-primary font-semibold truncate max-w-[200px] text-right">
                  {pass.name}
                </span>
              </div>
              <div className="flex justify-between items-center gap-3 border-b border-white/[0.06] pb-2">
                <span className="text-text-muted shrink-0 uppercase text-[11px]">College</span>
                <span className="text-chrome-light truncate max-w-[200px] text-right">
                  {pass.college}
                </span>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="w-full py-2.5 text-center font-mono tracking-[0.2em] uppercase text-xs bg-doom-glow/10 text-doom-glow border border-doom-glow/40 font-bold relative z-10">
              STATUS: {pass.status || 'VERIFIED // ACTIVE'}
            </div>

            {/* Access Vaults Button */}
            <Link
              to="/events"
              className="w-full py-3 px-5 doom-btn-clipped bg-doom-glow hover:bg-white text-doom-bg font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(30,255,160,0.3)]"
            >
              <span>ACCESS EVENT VAULTS</span>
              <ArrowRight size={14} />
            </Link>

          </div>
        </motion.div>

      </div>
    </div>
  )
}
