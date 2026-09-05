import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  Calendar, 
  MapPin, 
  Download, 
  ExternalLink, 
  AlertTriangle, 
  ShieldCheck 
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

/**
 * EventRegistrationModal — Intentional 4-step in-app registration workflow
 * Step 1: Participant Identity
 * Step 2: Team Members (if team size > 1)
 * Step 3: Review & Verification
 * Step 4: Confirmation & Calendar Export
 */
export default function EventRegistrationModal({ event, isOpen, onClose, onSuccess }) {
  const { user, getToken, userPass } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [confirmedData, setConfirmedData] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    name: user?.displayName || userPass?.name || '',
    email: user?.email || '',
    phone: userPass?.phone || '',
    college: userPass?.college || '',
    teamName: '',
    teamMembers: [],
    agreedToRules: false,
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.displayName || userPass?.name || '',
        email: user.email || '',
        college: prev.college || userPass?.college || '',
      }))
    }
  }, [user, userPass])

  if (!isOpen || !event) return null

  const isTeamEvent = event.maxTeamSize > 1

  const addTeamMember = () => {
    if (formData.teamMembers.length + 1 >= event.maxTeamSize) return
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', email: '', phone: '', college: prev.college }],
    }))
  }

  const removeTeamMember = (index) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }))
  }

  const updateTeamMember = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.teamMembers]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, teamMembers: updated }
    })
  }

  const handleStep1Next = (e) => {
    e.preventDefault()
    setError(null)
    if (!formData.name.trim() || !formData.phone.trim() || !formData.college.trim()) {
      setError('Please provide your name, contact phone, and college affiliation.')
      return
    }
    setStep(isTeamEvent ? 2 : 3)
  }

  const handleStep2Next = (e) => {
    e.preventDefault()
    setError(null)
    const totalMembers = 1 + formData.teamMembers.length
    if (totalMembers < event.minTeamSize) {
      setError(`This event requires a minimum of ${event.minTeamSize} team members. Add more members to proceed.`)
      return
    }
    for (let i = 0; i < formData.teamMembers.length; i++) {
      const m = formData.teamMembers[i]
      if (!m.name.trim() || !m.email.trim()) {
        setError(`Please fill in the name and email for Member #${i + 2}.`)
        return
      }
    }
    setStep(3)
  }

  const handleFinalSubmit = async () => {
    if (!formData.agreedToRules) {
      setError('You must confirm acceptance of event rules.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = await getToken()
      const res = await fetch(`/api/events/${event.slug}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          college: formData.college,
          teamName: formData.teamName,
          teamMembers: formData.teamMembers,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.')
      }

      setConfirmedData(data.registration)
      setStep(4)
      if (onSuccess) onSuccess(data.registration)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Generate .ics calendar download
  const downloadIcs = () => {
    if (!confirmedData) return
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VECTORS 26-27//Festival Event//EN',
      'BEGIN:VEVENT',
      `SUMMARY:VECTORS 26-27: ${event.name}`,
      `DESCRIPTION:Your registration ID: ${confirmedData.registrationId}. Venue: ${event.venue}`,
      `LOCATION:${event.venue}`,
      'DTSTART:20260315T033000Z',
      'DTEND:20260316T123000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', `${event.slug}-vectors-registration.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const inputClasses =
    'w-full bg-doom-bg border border-white/[0.12] text-text-primary px-3.5 py-2.5 font-mono text-xs focus:outline-none focus:border-doom-glow focus:ring-1 focus:ring-doom-glow transition-all'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-doom-bg2 border border-doom-glow/40 doom-btn-clipped p-6 sm:p-8 shadow-[0_15px_50px_rgba(0,0,0,0.9)] my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-text-muted hover:text-white cursor-pointer"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="border-b border-white/[0.08] pb-4 mb-6 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-doom-glow bg-doom-glow/10 px-2 py-0.5 border border-doom-glow/30 font-bold">
              {event.category} // STEP 0{step} OF 04
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wide text-text-primary">
            {step === 4 ? 'REGISTRATION CONFIRMED' : `REGISTER: ${event.name}`}
          </h2>
        </div>

        {error && (
          <div className="p-3 mb-5 bg-doom-crimson/20 border border-doom-crimson text-doom-crimson-bright font-mono text-xs flex items-center gap-2">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ====================================================
            STEP 1: PARTICIPANT IDENTITY
            ==================================================== */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4">
            <p className="font-mono text-xs text-text-muted">
              Confirm your primary participant details for official event scoring and certificates.
            </p>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Participant Name"
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
                Account Email (Fixed)
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className={`${inputClasses} opacity-60 cursor-not-allowed`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className={inputClasses}
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
                  College Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="Your College / University"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                type="submit"
                className="py-2.5 px-5 doom-btn-clipped bg-doom-glow text-doom-bg font-mono text-xs uppercase tracking-wider font-bold hover:bg-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isTeamEvent ? 'Team Details' : 'Review & Confirm'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </form>
        )}

        {/* ====================================================
            STEP 2: TEAM DETAILS (If team event)
            ==================================================== */}
        {step === 2 && (
          <form onSubmit={handleStep2Next} className="space-y-4">
            <div className="p-3 bg-white/[0.03] border border-white/[0.06] font-mono text-xs text-text-muted">
              Team Structure: <strong className="text-doom-glow">{event.minTeamSize} to {event.maxTeamSize} members</strong>. You count as Lead (Member 1).
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-text-muted uppercase tracking-wider block">
                Team Name (Optional)
              </label>
              <input
                type="text"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="e.g. CyberVanguards"
                className={inputClasses}
              />
            </div>

            {/* Additional Team Members */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-text-primary font-bold uppercase tracking-wider">
                  Additional Team Members ({formData.teamMembers.length})
                </span>
                {formData.teamMembers.length + 1 < event.maxTeamSize && (
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="font-mono text-[11px] text-doom-glow hover:underline uppercase tracking-wider cursor-pointer"
                  >
                    + Add Member
                  </button>
                )}
              </div>

              {formData.teamMembers.map((member, idx) => (
                <div key={idx} className="p-3 bg-doom-bg border border-white/[0.08] space-y-2 relative">
                  <div className="flex items-center justify-between pb-1 border-b border-white/[0.04]">
                    <span className="font-mono text-[10px] text-doom-glow font-bold">MEMBER 0{idx + 2}</span>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(idx)}
                      className="font-mono text-[10px] text-doom-crimson-bright hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Full Name *"
                      value={member.name}
                      onChange={(e) => updateTeamMember(idx, 'name', e.target.value)}
                      className={inputClasses}
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={member.email}
                      onChange={(e) => updateTeamMember(idx, 'email', e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="College (Leave blank if same)"
                    value={member.college}
                    onChange={(e) => updateTeamMember(idx, 'college', e.target.value)}
                    className={inputClasses}
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="font-mono text-xs text-text-muted hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 doom-btn-clipped bg-doom-glow text-doom-bg font-mono text-xs uppercase tracking-wider font-bold hover:bg-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Review</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </form>
        )}

        {/* ====================================================
            STEP 3: REVIEW & CONFIRM
            ==================================================== */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 bg-doom-bg border border-white/[0.08] space-y-2 font-mono text-xs">
              <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                <span className="text-text-muted">Event:</span>
                <strong className="text-text-primary">{event.name}</strong>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                <span className="text-text-muted">Date & Time:</span>
                <span className="text-doom-glow font-bold">{event.date}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                <span className="text-text-muted">Venue Location:</span>
                <span className="text-text-primary">{event.venue}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                <span className="text-text-muted">Lead Participant:</span>
                <span className="text-text-primary">{formData.name} ({formData.email})</span>
              </div>
              {isTeamEvent && (
                <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                  <span className="text-text-muted">Team Structure:</span>
                  <span className="text-text-primary">
                    {formData.teamName ? `[${formData.teamName}] ` : ''}
                    {1 + formData.teamMembers.length} Members
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-text-muted">Registration Fee:</span>
                <strong className="text-doom-glow">{event.fee}</strong>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer select-none pt-2">
              <input
                type="checkbox"
                checked={formData.agreedToRules}
                onChange={(e) => setFormData({ ...formData, agreedToRules: e.target.checked })}
                className="mt-0.5 accent-[#1EFFA0]"
              />
              <span className="font-mono text-[11px] text-text-muted leading-relaxed">
                I agree to the official event rules of engagement and verify that all participant details are accurate.
              </span>
            </label>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(isTeamEvent ? 2 : 1)}
                className="font-mono text-xs text-text-muted hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={loading || !formData.agreedToRules}
                onClick={handleFinalSubmit}
                className="py-2.5 px-6 doom-btn-clipped bg-doom-glow text-doom-bg font-mono text-xs uppercase tracking-wider font-bold hover:bg-white disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(30,255,160,0.3)]"
              >
                {loading ? (
                  <span>Reserving Slot...</span>
                ) : (
                  <>
                    <span>Confirm Registration</span>
                    <Check size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ====================================================
            STEP 4: SUCCESS CONFIRMATION & EXPORT
            ==================================================== */}
        {step === 4 && confirmedData && (
          <div className="space-y-5 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-doom-glow/20 border border-doom-glow flex items-center justify-center text-doom-glow">
              <Check size={24} />
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-doom-glow uppercase tracking-widest font-bold">
                PARTICIPATION CREDENTIAL ISSUED
              </span>
              <p className="font-mono text-lg font-bold text-text-primary tracking-wider">
                {confirmedData.registrationId}
              </p>
            </div>

            <div className="p-4 bg-doom-bg border border-white/[0.08] font-mono text-xs text-left space-y-1.5">
              <p><strong className="text-text-muted">Event:</strong> {confirmedData.eventName}</p>
              <p><strong className="text-text-muted">Date:</strong> {confirmedData.date}</p>
              <p><strong className="text-text-muted">Venue:</strong> {confirmedData.venue}</p>
              <p><strong className="text-text-muted">Status:</strong> <span className="text-doom-glow uppercase font-bold">{confirmedData.status}</span></p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={downloadIcs}
                className="py-2.5 px-4 bg-white/[0.06] border border-white/[0.12] hover:border-doom-glow/50 text-text-primary font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={13} className="text-doom-glow" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <button
                onClick={() => {
                  onClose()
                  navigate('/dashboard')
                }}
                className="py-2.5 px-4 bg-doom-glow text-doom-bg font-mono text-xs uppercase tracking-wider font-bold hover:bg-white transition-colors cursor-pointer"
              >
                View in Personal Dashboard &rarr;
              </button>

              <button
                onClick={onClose}
                className="font-mono text-xs text-text-muted hover:text-white uppercase tracking-wider py-1 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
