import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, ShieldCheck, QrCode, ArrowRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

/**
 * Entry Registration — Multi-step form flow.
 * Step 1: Identity (Name)
 * Step 2: Contact (Email, Phone)
 * Step 3: Affiliation (College)
 * Step 4: Success & QR Pass generation
 */
export default function EntryRegistration() {
  const navigate = useNavigate()
  const { user, getToken, hasPass, userPass, setPassData } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    college: '',
  })
  const [registrationId, setRegistrationId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: prev.email || user.email || '',
      }))
    }
  }, [user])

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      
      setRegistrationId(data.registrationId)
      
      const newPass = {
        registrationId: data.registrationId,
        name: formData.name,
        college: formData.college,
        email: formData.email,
        status: 'VERIFIED'
      }

      // Authoritative state update in AuthContext + localStorage
      setPassData(newPass)
      
      setStep(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClasses =
    'w-full bg-doom-bg border border-white/[0.12] text-text-primary px-4 py-3.5 font-mono text-sm focus:outline-none focus:border-doom-glow focus:ring-1 focus:ring-doom-glow transition-all duration-300'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 relative z-10">
      <div className="w-full max-w-md">

        {/* Back Link to Home */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-doom-glow transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} />
            <span>Return to Home</span>
          </Link>

          <span className="font-mono text-[10px] text-doom-glow tracking-widest uppercase px-2 py-0.5 bg-doom-glow/10 border border-doom-glow/30">
            ENTRY PASS PROTOCOL
          </span>
        </div>

        {/* If user already has a pass, show active notice */}
        {hasPass && step !== 4 && (
          <div className="mb-8 p-5 bg-doom-bg2 border border-doom-glow/40 doom-btn-clipped space-y-3">
            <div className="flex items-center gap-2 text-doom-glow">
              <ShieldCheck size={18} />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">Pass Already Active</span>
            </div>
            <p className="font-body text-xs text-text-muted">
              You already possess a verified Entry Pass [{userPass?.registrationId}]. Events are fully unlocked.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/events"
                className="doom-btn-primary !p-[1px] flex-1 text-center"
              >
                <span className="doom-btn-primary-inner !py-2 !text-xs">
                  Enter Events →
                </span>
              </Link>
              <Link
                to="/my-pass"
                className="doom-btn-ghost !py-2 !px-3 !text-xs"
              >
                View Pass
              </Link>
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="p-6 sm:p-8 bg-doom-bg2 border border-white/[0.08] doom-btn-clipped shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s <= step ? 'w-8 bg-doom-glow shadow-[0_0_8px_rgba(30,255,160,0.6)]' : 'w-4 bg-white/15'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Identity */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-5"
            >
              <div className="text-center space-y-1">
                <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-text-primary">
                  AGENT IDENTITY
                </h2>
                <p className="font-mono text-xs text-text-muted">Step 01 // Legal / Official Name</p>
              </div>

              <div>
                <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted block mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Victor Von Doom"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={inputClasses}
                  id="input-name"
                  autoFocus
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.name.trim()}
                className="doom-btn-primary w-full mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
                id="btn-next-step-1"
              >
                <span className="doom-btn-primary-inner py-3 text-xs tracking-wider">
                  Proceed to Contact →
                </span>
              </button>
            </motion.div>
          )}

          {/* Step 2: Contact */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-5"
            >
              <div className="text-center space-y-1">
                <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-text-primary">
                  CONTACT TELEMETRY
                </h2>
                <p className="font-mono text-xs text-text-muted">Step 02 // Communications & Pass Delivery</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="agent@institution.edu"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={inputClasses}
                    id="input-email"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted block mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className={inputClasses}
                    id="input-phone"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="doom-btn-ghost flex-1 py-3 text-xs"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.email.trim() || !formData.phone.trim()}
                  className="doom-btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  id="btn-next-step-2"
                >
                  <span className="doom-btn-primary-inner py-3 text-xs">
                    Next →
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Affiliation */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-5"
            >
              <div className="text-center space-y-1">
                <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-text-primary">
                  INSTITUTION AFFILIATION
                </h2>
                <p className="font-mono text-xs text-text-muted">Step 03 // College / University</p>
              </div>

              <div>
                <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted block mb-1.5">
                  College / Institution Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Latverian Institute of Technology"
                  value={formData.college}
                  onChange={(e) => updateField('college', e.target.value)}
                  className={inputClasses}
                  id="input-college"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-doom-crimson/20 border border-doom-crimson text-doom-crimson text-xs font-mono">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="doom-btn-ghost flex-1 py-3 text-xs"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.college.trim() || loading}
                  className="doom-btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  id="btn-generate-pass"
                >
                  <span className="doom-btn-primary-inner py-3 text-xs">
                    {loading ? 'Issuing Pass...' : 'Generate Pass →'}
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success & Unlock */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-doom-glow/20 border border-doom-glow/50 flex items-center justify-center text-doom-glow shadow-[0_0_20px_rgba(30,255,160,0.4)]">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-1">
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-text-primary">
                  PASS GENERATED
                </h2>
                <p className="font-mono text-xs text-doom-glow tracking-widest uppercase">
                  SECURITY CLEARANCE LEVEL // UNLOCKED
                </p>
              </div>

              <div className="p-3 bg-doom-bg border border-doom-glow/40 w-full font-mono text-sm text-doom-glow font-bold break-all shadow-[inset_0_0_15px_rgba(30,255,160,0.1)]">
                {registrationId}
              </div>

              <p className="font-body text-xs sm:text-sm text-text-muted leading-relaxed">
                Your digital entry pass has been successfully verified. Event vaults are now fully accessible.
              </p>

              <div className="w-full space-y-3 pt-2">
                {/* Primary Action: Enter Events */}
                <Link
                  to="/events"
                  className="doom-btn-primary w-full text-center"
                  id="btn-enter-events"
                >
                  <span className="doom-btn-primary-inner py-3.5 text-xs tracking-widest flex items-center justify-center gap-2">
                    <span>ENTER EVENT VAULTS</span>
                    <ArrowRight size={14} />
                  </span>
                </Link>

                {/* Secondary Action: View QR Pass */}
                <Link
                  to="/my-pass"
                  className="doom-btn-ghost w-full text-center flex items-center justify-center gap-2"
                  id="btn-view-pass"
                >
                  <QrCode size={14} />
                  <span>View Digital Pass & QR</span>
                </Link>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}
