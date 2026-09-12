import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Users, 
  DollarSign, 
  Trophy, 
  ShieldCheck, 
  UserCheck, 
  HelpCircle, 
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  X,
  AlertTriangle
} from 'lucide-react'
import { getEventById } from '../data/events'
import { useAuth } from '../contexts/AuthContext'
import EntryPassGate from '../components/EntryPassGate'

/** Single Google Form for ALL event registrations */
const REGISTRATION_FORM_URL = 'https://docs.google.com/forms/d/1TMafhheUgchGQZHPmEdVHght-KB_Nn_SN1pKOSkLXXI/viewform'

/**
 * EventDetail — Individual Event Vault & Specifications
 * Features:
 * - Live capacity tracking & registration status
 * - Structured venue specifications (Building, Floor, Room, Directions)
 * - External Google Form registration
 * - Permanent "Are You Registered?" verification flow
 * - Event-specific FAQ accordion
 * - Sector coordinator contact cards
 */
export default function EventDetail() {
  const { user, hasPass, passLoading, checkPassStatus, getToken, userPass } = useAuth()
  const navigate = useNavigate()
  const { eventId } = useParams()
  
  const [verificationError, setVerificationError] = useState(null)
  const [eventData, setEventData] = useState(() => getEventById(eventId || ''))
  const [openFaq, setOpenFaq] = useState(null)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registrationRecord, setRegistrationRecord] = useState(null)
  const [checkingReg, setCheckingReg] = useState(true)

  const eventSlug = (eventData?.slug || eventData?.id || eventId || '').toLowerCase()

  // Fetch live event data from API with local fallback
  useEffect(() => {
    if (!eventId) return

    fetch(`/api/events/${eventId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setEventData(prev => ({ ...prev, ...data }))
      })
      .catch(() => {})
  }, [eventId])

  // Check if current user is already registered for this event
  useEffect(() => {
    let isMounted = true
    const checkUserRegistration = async () => {
      if (!user || !eventSlug) {
        setCheckingReg(false)
        return
      }

      try {
        const token = await getToken()
        const res = await fetch(`/api/events/${eventSlug}/my-registration`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok && isMounted) {
          const data = await res.json()
          if (data.isRegistered) {
            setIsRegistered(true)
            setRegistrationRecord(data.registration)
          }
        }
      } catch (err) {
        console.warn('[EventDetail] My registration check failed:', err.message)
      } finally {
        if (isMounted) setCheckingReg(false)
      }
    }

    checkUserRegistration()
    return () => { isMounted = false }
  }, [user, eventSlug])

  // Gate: If pass status is loading, render clearance scanner
  if (passLoading) {
    return <EntryPassGate user={user} loading={true} />
  }

  // Gate: If user does not possess an active Entry Pass, block access strictly
  if (!hasPass) {
    return (
      <EntryPassGate
        user={user}
        loading={false}
        error={verificationError}
        onRetry={async () => {
          setVerificationError(null)
          try {
            await checkPassStatus(user)
          } catch (err) {
            setVerificationError(err.message || 'Verification failed.')
          }
        }}
      />
    )
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="text-center p-8 bg-doom-bg2 border border-white/[0.08] max-w-md w-full doom-btn-clipped">
          <h2 className="font-display text-2xl sm:text-3xl text-doom-crimson-bright font-bold uppercase tracking-wider">
            VAULT NOT FOUND
          </h2>
          <p className="font-mono text-xs text-text-muted mt-2">
            The requested protocol [ID: {eventId}] does not exist in the active archives.
          </p>
          <Link
            to="/events"
            className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-doom-glow uppercase tracking-widest hover:underline"
          >
            <ArrowLeft size={14} />
            Return to Event Vaults
          </Link>
        </div>
      </div>
    )
  }

  const categoryQuery = eventData.category?.toLowerCase() || 'technical'
  const isClosed = !eventData.registrationOpen || eventData.status === 'closed'

  const handleConfirmGoogleFormRegistration = async () => {
    setVerifying(true)
    setVerifyError(null)

    try {
      const token = await getToken()
      if (!token) throw new Error('You must be signed in to confirm registration.')

      const res = await fetch(`/api/events/${eventSlug}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userPass?.name || user?.displayName || '',
          phone: userPass?.phone || '',
          college: userPass?.college || '',
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Registration verification failed.')
      }

      setIsRegistered(true)
      setRegistrationRecord(data.registration)
      setShowVerifyModal(false)
    } catch (err) {
      setVerifyError(err.message || 'Failed to verify registration.')
    } finally {
      setVerifying(false)
    }
  }

  const renderRegisterButtons = () => {
    if (isRegistered) {
      const isPending = registrationRecord?.status === 'pending_verification'
      return (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="doom-btn-primary w-full sm:w-auto text-center cursor-pointer"
          >
            <span className="doom-btn-primary-inner flex items-center justify-center gap-2 py-3 px-6 text-xs tracking-widest uppercase font-bold">
              <CheckCircle2 size={14} />
              <span>VIEW IN DASHBOARD</span>
            </span>
          </button>
          {isPending ? (
            <span className="font-mono text-xs text-amber-400 flex items-center gap-1 font-bold">
              ⏳ Pending Admin Verification ({registrationRecord?.registrationId || 'PENDING'})
            </span>
          ) : (
            <span className="font-mono text-xs text-doom-glow flex items-center gap-1 font-bold">
              ✓ Registration Confirmed ({registrationRecord?.registrationId || 'ACTIVE'})
            </span>
          )}
        </div>
      )
    }

    if (isClosed) {
      return (
        <div className="px-5 py-3 bg-white/[0.04] border border-white/[0.08] text-steel font-mono text-xs uppercase tracking-wider">
          🔒 Registrations for this event are currently locked.
        </div>
      )
    }

    const formUrl = eventData.googleFormUrl && eventData.googleFormUrl !== '#' 
      ? eventData.googleFormUrl 
      : REGISTRATION_FORM_URL

    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <a
          href={formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="doom-btn-primary text-center cursor-pointer"
          id="btn-register-google-form"
        >
          <span className="doom-btn-primary-inner flex items-center justify-center gap-2 py-3 px-6 text-xs tracking-widest uppercase font-bold">
            <span>REGISTER VIA GOOGLE FORM</span>
            <ExternalLink size={14} />
          </span>
        </a>

        <button
          onClick={() => {
            if (!user) {
              navigate('/login')
              return
            }
            setShowVerifyModal(true)
          }}
          className="px-5 py-3 border border-doom-glow/40 hover:border-doom-glow bg-doom-glow/10 hover:bg-doom-glow/20 text-doom-glow font-mono text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          id="btn-ask-registered"
        >
          <ShieldCheck size={14} />
          <span>ARE YOU REGISTERED?</span>
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-16 relative z-10">
      <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Breadcrumb Navigation & Top Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-text-muted flex-wrap">
            <Link to="/" className="hover:text-doom-glow transition-colors">Home</Link>
            <span className="text-white/30">/</span>
            <Link to="/events" className="hover:text-doom-glow transition-colors">Events</Link>
            <span className="text-white/30">/</span>
            <Link to={`/events?category=${categoryQuery}`} className="hover:text-doom-glow transition-colors">
              {eventData.category}
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-doom-glow font-bold truncate max-w-[180px] sm:max-w-xs">{eventData.name}</span>
          </nav>

          <Link
            to={`/events?category=${categoryQuery}`}
            className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-doom-glow transition-colors uppercase tracking-widest py-1 px-2.5 bg-white/[0.03] border border-white/[0.06] hover:border-doom-glow/30 self-start sm:self-auto"
          >
            <ArrowLeft size={13} />
            <span>Back to {eventData.category}</span>
          </Link>
        </div>

        {/* Event Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Category Badge */}
            <span className="font-mono text-xs tracking-widest text-doom-glow px-3 py-1 bg-doom-glow/10 border border-doom-glow/40 uppercase font-bold">
              {eventData.category} Event
            </span>

            {isRegistered && (
              <span className="font-mono text-xs text-doom-glow px-3 py-1 bg-doom-glow/15 border border-doom-glow/50 font-bold uppercase flex items-center gap-1">
                <CheckCircle2 size={13} /> Registered
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide text-text-primary drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            {eventData.name}
          </h1>

          <p className="font-body text-sm sm:text-base text-text-primary/90 leading-relaxed pt-1">
            {eventData.description}
          </p>

          <div className="pt-2">
            {renderRegisterButtons()}
          </div>
        </div>

        {/* Prize Pool Banner (if applicable) */}
        {(eventData.prizePool || eventData.firstPrize) && (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-doom-glow/10 via-doom-bg2 to-doom-bg2 border border-doom-glow/40 doom-btn-clipped flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-doom-glow/20 border border-doom-glow/50 flex items-center justify-center text-doom-glow shrink-0">
                <Trophy size={20} />
              </div>
              <div>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest block">CHAMPIONSHIP REWARDS</span>
                <p className="font-display text-lg sm:text-xl font-bold text-doom-glow">
                  {eventData.prizePool || 'Cash Prizes & Certificates'}
                </p>
              </div>
            </div>

            {(eventData.firstPrize || eventData.secondPrize) && (
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {eventData.firstPrize && (
                  <div className="px-3.5 py-2 bg-doom-glow/10 border border-doom-glow/40 text-center font-mono">
                    <span className="text-[10px] text-doom-glow uppercase block font-bold tracking-widest">1ST PRIZE</span>
                    <span className="text-sm sm:text-base font-bold text-text-primary">{eventData.firstPrize}</span>
                  </div>
                )}
                {eventData.secondPrize && (
                  <div className="px-3.5 py-2 bg-white/[0.04] border border-white/[0.1] text-center font-mono">
                    <span className="text-[10px] text-text-muted uppercase block font-bold tracking-widest">2ND PRIZE</span>
                    <span className="text-sm sm:text-base font-bold text-text-primary">{eventData.secondPrize}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Specifications Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: 'Registration Fee', value: eventData.fee, icon: DollarSign },
            { label: 'Team Structure', value: eventData.teamSize, icon: Users },
            { label: 'Event Category', value: eventData.category, icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="p-4 bg-doom-bg2 border border-white/[0.08] doom-btn-clipped space-y-1.5"
              >
                <div className="flex items-center gap-2 text-text-muted font-mono text-xs">
                  <Icon size={14} className="text-doom-glow" />
                  <span className="uppercase tracking-wider">{item.label}</span>
                </div>
                <p className="font-mono text-sm sm:text-base font-bold text-text-primary">
                  {item.value}
                </p>
              </div>
            )
          })}
        </div>

        {/* Arena Rules & Protocols */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-doom-glow" />
            <h2 className="font-display text-lg sm:text-xl font-bold tracking-wider uppercase text-text-primary">
              ARENA PROTOCOLS & RULES
            </h2>
          </div>

          <div className="space-y-2.5">
            {eventData.rules.map((rule, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-doom-bg2 border border-white/[0.06] flex items-start gap-3 doom-btn-clipped"
              >
                <span className="w-5 h-5 rounded-full bg-doom-glow/10 border border-doom-glow/30 flex items-center justify-center font-mono text-[10px] text-doom-glow font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="font-body text-xs sm:text-sm text-text-primary/90 leading-relaxed">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Event Coordinators */}
        {eventData.coordinators && eventData.coordinators.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-doom-glow" />
              <h2 className="font-display text-lg sm:text-xl font-bold tracking-wider uppercase text-text-primary">
                SECTOR COORDINATORS
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {eventData.coordinators.map((c, i) => (
                <div key={i} className="p-3.5 bg-doom-bg2 border border-white/[0.06] font-mono text-xs flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-primary font-bold">{c.name}</span>
                      {c.role && (
                        <span className="text-[10px] text-doom-glow uppercase px-1.5 py-0.5 bg-doom-glow/10 border border-doom-glow/30 font-bold">
                          {c.role}
                        </span>
                      )}
                    </div>
                    <span className="text-text-muted mt-0.5 block">{c.contact}</span>
                  </div>
                  {c.contact && (
                    <a
                      href={`tel:${c.contact.replace(/[^0-9+]/g, '')}`}
                      className="px-3 py-1 bg-white/[0.04] hover:bg-doom-glow/20 border border-white/10 hover:border-doom-glow text-doom-glow text-[11px] font-bold tracking-wider uppercase transition-colors shrink-0"
                    >
                      Call
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event-Specific FAQ */}
        {eventData.faq && eventData.faq.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-doom-glow" />
              <h2 className="font-display text-lg sm:text-xl font-bold tracking-wider uppercase text-text-primary">
                EVENT FAQ
              </h2>
            </div>

            <div className="space-y-2">
              {eventData.faq.map((item, idx) => (
                <div key={idx} className="bg-doom-bg2 border border-white/[0.06] doom-btn-clipped">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-3.5 text-left flex items-center justify-between text-xs font-mono font-bold text-text-primary hover:text-doom-glow transition-colors cursor-pointer"
                  >
                    <span>{item.question}</span>
                    <ChevronDown size={14} className={openFaq === idx ? 'rotate-180 text-doom-glow' : ''} />
                  </button>
                  {openFaq === idx && (
                    <p className="px-3.5 pb-3.5 text-xs text-text-muted font-body leading-relaxed border-t border-white/[0.04] pt-2">
                      {item.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Arena Registration Protocol Section */}
        <div className="p-6 sm:p-8 bg-doom-bg2 border border-doom-glow/40 doom-btn-clipped shadow-[0_0_30px_rgba(30,255,160,0.1)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="font-mono text-[10px] text-doom-glow uppercase tracking-widest font-bold block">
              OFFICIAL REGISTRATION GATE
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-text-primary">
              {eventData.name}
            </h3>
            <p className="font-mono text-xs text-text-muted">
              Registration Fee: <strong className="text-text-primary">{eventData.fee}</strong> &bull; Team Format: <strong className="text-text-primary">{eventData.teamSize}</strong>
            </p>
          </div>

          <div className="w-full sm:w-auto shrink-0">
            {renderRegisterButtons()}
          </div>
        </div>

      </div>

      {/* Registration Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-doom-bg2 border border-doom-glow/40 max-w-lg w-full p-6 sm:p-7 space-y-5 doom-btn-clipped shadow-[0_0_50px_rgba(30,255,160,0.18)] relative">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2 font-mono text-xs text-doom-glow uppercase tracking-wider font-bold">
                <ShieldCheck size={16} />
                <span>REGISTRATION VERIFICATION</span>
              </div>
              <button
                onClick={() => {
                  setShowVerifyModal(false)
                  setVerifyError(null)
                }}
                className="text-text-muted hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest block">
                  {eventData.category} Event
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-text-primary mt-0.5">
                  {eventData.name}
                </h3>
              </div>

              {!hasPass ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertTriangle size={14} />
                    <span>ENTRY PASS REQUIRED</span>
                  </p>
                  <p className="text-amber-300/80">
                    You need an active digital Entry Pass before verifying your event registration. Please claim your Entry Pass first.
                  </p>
                  <div className="pt-1">
                    <Link
                      to="/entry-registration"
                      className="inline-block py-2 px-4 bg-amber-400 text-black font-bold uppercase tracking-wider text-[11px]"
                    >
                      Claim Entry Pass &rarr;
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-body text-xs sm:text-sm text-text-primary/90 leading-relaxed">
                    Have you filled and submitted the official Google Form for <strong>{eventData.name}</strong>?
                  </p>

                  <div className="p-3.5 bg-white/[0.03] border border-white/[0.08] font-mono text-xs space-y-1.5">
                    <div className="text-text-muted">
                      Participant: <strong className="text-text-primary">{userPass?.name || user?.displayName || user?.email}</strong>
                    </div>
                    <div className="text-text-muted">
                      College: <strong className="text-text-primary">{userPass?.college || 'Affiliated College'}</strong>
                    </div>
                    <div className="text-text-muted">
                      Pass ID: <strong className="text-doom-glow">{userPass?.registrationId || 'ACTIVE PASS'}</strong>
                    </div>
                  </div>
                </>
              )}

              {verifyError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs">
                  {verifyError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setShowVerifyModal(false)
                  setVerifyError(null)
                }}
                disabled={verifying}
                className="py-2.5 px-4 bg-white/[0.04] border border-white/[0.1] hover:border-white/20 text-text-muted hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                No, Not Yet
              </button>

              {hasPass && (
                <button
                  type="button"
                  onClick={handleConfirmGoogleFormRegistration}
                  disabled={verifying}
                  className="doom-btn-primary cursor-pointer disabled:opacity-50"
                  id="btn-confirm-yes-registered"
                >
                  <span className="doom-btn-primary-inner flex items-center gap-2 py-2.5 px-5 text-xs font-bold uppercase tracking-wider font-mono">
                    {verifying ? (
                      <span>VERIFYING...</span>
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        <span>YES, I HAVE REGISTERED</span>
                      </>
                    )}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
