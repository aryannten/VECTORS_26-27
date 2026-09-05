import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Trophy, 
  ShieldCheck, 
  UserCheck, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  Compass 
} from 'lucide-react'
import { getEventById } from '../data/events'
import { useAuth } from '../contexts/AuthContext'
import EntryPassGate from '../components/EntryPassGate'
import EventRegistrationModal from '../components/EventRegistrationModal'

/**
 * EventDetail — Individual Event Vault & Specifications
 * Features:
 * - Live capacity tracking & registration status
 * - Structured venue specifications (Building, Floor, Room, Directions)
 * - In-app 4-step registration modal integration
 * - Event-specific FAQ accordion
 * - Sector coordinator contact cards
 */
export default function EventDetail() {
  const { user, hasPass, passLoading, checkPassStatus, getToken } = useAuth()
  const navigate = useNavigate()
  const { eventId } = useParams()
  
  const [verificationError, setVerificationError] = useState(null)
  const [eventData, setEventData] = useState(() => getEventById(eventId || ''))
  const [isRegistered, setIsRegistered] = useState(false)
  const [registrationRecord, setRegistrationRecord] = useState(null)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  // Fetch live event data and user's registration status
  useEffect(() => {
    if (!eventId) return

    // 1. Fetch live event metadata from API with local fallback
    fetch(`/api/events/${eventId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setEventData(prev => ({ ...prev, ...data }))
      })
      .catch(() => {})

    // 2. Check if authenticated user is already registered for this event
    if (user) {
      getToken().then(token => {
        if (!token) return
        fetch(`/api/events/${eventId}/my-registration`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data?.isRegistered) {
              setIsRegistered(true)
              setRegistrationRecord(data.registration)
            }
          })
          .catch(() => {})
      })
    }
  }, [eventId, user, getToken])

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
  const isFull = eventData.status === 'full'
  const isClosed = eventData.status === 'closed' || eventData.status === 'completed' || !eventData.registrationOpen

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-36 relative z-10">
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

            {/* Branch Alignment Badge */}
            <span className="font-mono text-xs tracking-wider text-chrome-light px-3 py-1 bg-white/[0.04] border border-white/[0.1] uppercase">
              Branch: <strong className="text-text-primary font-bold">{eventData.branch}</strong>
            </span>

            {/* Registration Status Badge */}
            {isRegistered ? (
              <span className="font-mono text-xs tracking-wider text-doom-glow px-3 py-1 bg-doom-glow/20 border border-doom-glow uppercase font-bold flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>You are Registered</span>
              </span>
            ) : isFull ? (
              <span className="font-mono text-xs tracking-wider text-doom-crimson-bright px-3 py-1 bg-doom-crimson/20 border border-doom-crimson uppercase font-bold">
                Capacity Full
              </span>
            ) : isClosed ? (
              <span className="font-mono text-xs tracking-wider text-text-muted px-3 py-1 bg-white/[0.04] border border-white/[0.1] uppercase font-bold">
                Registration Closed
              </span>
            ) : (
              <span className="font-mono text-xs tracking-wider text-doom-glow px-3 py-1 bg-doom-glow/10 border border-doom-glow/40 uppercase font-bold animate-pulse">
                Registration Open
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide text-text-primary drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            {eventData.name}
          </h1>

          <p className="font-body text-sm sm:text-base text-text-primary/90 leading-relaxed pt-1">
            {eventData.description}
          </p>

          {isRegistered && registrationRecord && (
            <div className="p-4 bg-doom-glow/10 border border-doom-glow/40 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-doom-glow">
                <CheckCircle2 size={16} />
                <span>
                  Confirmed Entry: <strong>{registrationRecord.registrationId}</strong>
                  {registrationRecord.teamName && ` (Team: ${registrationRecord.teamName})`}
                </span>
              </div>
              <Link
                to="/dashboard"
                className="text-text-primary hover:text-doom-glow underline underline-offset-4 uppercase tracking-wider text-[11px]"
              >
                Manage in Dashboard →
              </Link>
            </div>
          )}
        </div>

        {/* Specifications Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Date & Time', value: `${eventData.date} // ${eventData.startTime || '09:00 IST'}`, icon: Calendar },
            { label: 'Venue Location', value: eventData.venue, icon: MapPin },
            { label: 'Registration Fee', value: eventData.fee, icon: DollarSign },
            { label: 'Team Structure', value: eventData.teamSize, icon: Users },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="p-4 bg-doom-bg2 border border-white/[0.08] doom-btn-clipped space-y-1.5"
              >
                <div className="flex items-center gap-1.5 text-doom-glow font-mono text-[10px] uppercase tracking-wider">
                  <Icon size={12} />
                  <span>{item.label}</span>
                </div>
                <p className="font-mono text-xs sm:text-sm text-text-primary font-bold break-words">
                  {item.value}
                </p>
              </div>
            )
          })}
        </div>

        {/* Structured Venue Details */}
        {eventData.venueDetails && (
          <div className="p-4 sm:p-5 bg-doom-bg2 border border-white/[0.08] doom-btn-clipped space-y-3">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-doom-glow" />
              <h2 className="font-display text-base font-bold uppercase tracking-wider text-text-primary">
                VENUE & DIRECTIONS
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-text-muted">
              <div>
                <span className="text-[10px] text-text-muted/60 uppercase block">Building</span>
                <span className="text-text-primary font-bold">{eventData.venueDetails.building || 'Campus Tech Block'}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted/60 uppercase block">Floor & Sector</span>
                <span className="text-text-primary font-bold">{eventData.venueDetails.floor || 'Ground Level'}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted/60 uppercase block">Room / Hall</span>
                <span className="text-text-primary font-bold">{eventData.venueDetails.room || eventData.venue}</span>
              </div>
            </div>
            {eventData.venueDetails.directions && (
              <p className="font-mono text-xs text-text-muted border-t border-white/[0.04] pt-2">
                <strong>Directions:</strong> {eventData.venueDetails.directions}
              </p>
            )}
          </div>
        )}

        {/* Prize Pool Banner (if applicable) */}
        {eventData.prizePool && (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-doom-glow/10 via-doom-bg2 to-doom-bg2 border border-doom-glow/40 doom-btn-clipped flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-doom-glow/20 border border-doom-glow/50 flex items-center justify-center text-doom-glow shrink-0">
                <Trophy size={20} />
              </div>
              <div>
                <span className="font-mono text-[10px] tracking-widest text-doom-glow uppercase font-bold block">
                  PRIZE POOL & REWARDS
                </span>
                <p className="font-display text-lg sm:text-xl font-bold text-text-primary tracking-wide">
                  {eventData.prizePool}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Rules of Engagement */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-doom-glow" />
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-wider uppercase text-text-primary">
              RULES OF ENGAGEMENT
            </h2>
          </div>

          <div className="space-y-3">
            {eventData.rules && eventData.rules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3.5 sm:p-4 bg-doom-bg2 border-l-2 border-doom-glow border-y border-r border-white/[0.04]"
              >
                <span className="font-mono text-xs font-bold text-doom-glow tracking-wider shrink-0 mt-0.5">
                  [{String(idx + 1).padStart(2, '0')}]
                </span>
                <p className="font-body text-xs sm:text-sm text-text-muted leading-relaxed">
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
                <div key={i} className="p-3.5 bg-doom-bg2 border border-white/[0.06] font-mono text-xs">
                  <span className="text-text-primary font-bold block">{c.name}</span>
                  <span className="text-doom-glow/90 mt-0.5 block">{c.contact}</span>
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

      </div>

      {/* Floating / Sticky Registration CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-5 bg-doom-bg/95 backdrop-blur-xl border-t border-doom-glow/30 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
          <div className="min-w-0 hidden sm:block">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider block truncate">
              {eventData.category} // {eventData.branch}
            </span>
            <span className="font-display text-sm font-bold text-text-primary truncate block">
              {eventData.name}
            </span>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3 justify-end">
            {eventData.googleFormUrl && eventData.googleFormUrl.startsWith('http') ? (
              <a
                href={eventData.googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="doom-btn-primary w-full sm:w-auto sm:min-w-[260px] text-center inline-block"
                id="btn-register-google-form"
              >
                <span className="doom-btn-primary-inner flex items-center justify-center gap-2 py-3.5 text-xs tracking-widest uppercase">
                  <span>OPEN REGISTRATION FORM ↗</span>
                </span>
              </a>
            ) : isRegistered ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="doom-btn-primary w-full sm:w-auto sm:min-w-[260px] text-center"
              >
                <span className="doom-btn-primary-inner flex items-center justify-center gap-2 py-3.5 text-xs tracking-widest">
                  <CheckCircle2 size={14} />
                  <span>VIEW IN DASHBOARD</span>
                </span>
              </button>
            ) : (
              <button
                disabled={isClosed || isFull}
                onClick={() => {
                  if (eventData.googleFormUrl && eventData.googleFormUrl !== '#') {
                    window.open(eventData.googleFormUrl, '_blank', 'noopener,noreferrer')
                  } else {
                    // Fallback to in-app registration modal or coming-soon alert
                    setShowRegisterModal(true)
                  }
                }}
                className="doom-btn-primary w-full sm:w-auto sm:min-w-[260px] text-center disabled:opacity-50 disabled:pointer-events-none"
                id="btn-register-participate"
              >
                <span className="doom-btn-primary-inner flex items-center justify-center gap-2 py-3.5 text-xs tracking-widest">
                  <span>
                    {isFull 
                      ? 'EVENT FULL' 
                      : isClosed 
                      ? 'REGISTRATION CLOSED' 
                      : 'REGISTER VIA FORM / PORTAL'}
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* In-App Registration Modal */}
      <EventRegistrationModal
        event={eventData}
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={(reg) => {
          setIsRegistered(true)
          setRegistrationRecord(reg)
        }}
      />
    </div>
  )
}
