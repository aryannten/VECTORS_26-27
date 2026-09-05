import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, Users, DollarSign, Trophy, ShieldCheck, UserCheck, ExternalLink } from 'lucide-react'
import { getEventById } from '../data/events'

/**
 * EventDetail — Individual Event Vault & Specifications
 * 
 * Styled with the Doomsday Protocol aesthetic:
 * - Direct return link back to active category (/events?category=...)
 * - Category and Branch Alignment badges
 * - Rules of engagement telemetry list
 * - Armor-plated registration CTA
 */
export default function EventDetail() {
  const { eventId } = useParams()
  const event = getEventById(eventId || '')

  if (!event) {
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

  const categoryQuery = event.category.toLowerCase()

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 pb-36 relative z-10">
      <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Top Back Navigation (Preserves Category View) */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/[0.08] pb-4">
          <Link
            to={`/events?category=${categoryQuery}`}
            className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-doom-glow transition-colors uppercase tracking-widest py-1"
          >
            <ArrowLeft size={14} />
            <span>← Back to {event.category} Events</span>
          </Link>

          <span className="font-mono text-[11px] tracking-wider text-text-muted bg-white/[0.03] px-2.5 py-0.5 border border-white/[0.06]">
            SPEC // PROTOCOL-{event.id.toUpperCase()}
          </span>
        </div>

        {/* Event Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Category Badge */}
            <span className="font-mono text-xs tracking-widest text-doom-glow px-3 py-1 bg-doom-glow/10 border border-doom-glow/40 uppercase font-bold">
              {event.category} Event
            </span>

            {/* Branch Alignment Badge */}
            <span className="font-mono text-xs tracking-wider text-chrome-light px-3 py-1 bg-white/[0.04] border border-white/[0.1] uppercase">
              Branch Alignment: <strong className="text-text-primary font-bold">{event.branch}</strong>
            </span>

            {/* Participation note */}
            <span className="font-mono text-[10px] text-text-muted/80 tracking-wider">
              {event.isBranchExclusive ? '(Branch Restricted)' : '(Open to all branches)'}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide text-text-primary drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            {event.name}
          </h1>

          <p className="font-body text-sm sm:text-base text-text-primary/90 leading-relaxed pt-1">
            {event.description}
          </p>
        </div>

        {/* Specifications Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Date & Time', value: event.date, icon: Calendar },
            { label: 'Venue Location', value: event.venue, icon: MapPin },
            { label: 'Registration Fee', value: event.fee, icon: DollarSign },
            { label: 'Team Structure', value: event.teamSize, icon: Users },
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

        {/* Prize Pool Banner (if applicable) */}
        {event.prizePool && (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-doom-glow/10 via-doom-bg2 to-doom-bg2 border border-doom-glow/40 doom-btn-clipped flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-doom-glow/20 border border-doom-glow/50 flex items-center justify-center text-doom-glow shrink-0">
                <Trophy size={20} />
              </div>
              <div>
                <span className="font-mono text-[10px] tracking-widest text-doom-glow uppercase font-bold block">
                  PRIZE POOL & MERCHANDISE
                </span>
                <p className="font-display text-lg sm:text-xl font-bold text-text-primary tracking-wide">
                  {event.prizePool}
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
            {event.rules.map((rule, idx) => (
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
        {event.coordinators && event.coordinators.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-doom-glow" />
              <h2 className="font-display text-lg sm:text-xl font-bold tracking-wider uppercase text-text-primary">
                SECTOR COORDINATORS
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.coordinators.map((c, i) => (
                <div key={i} className="p-3.5 bg-doom-bg2 border border-white/[0.06] font-mono text-xs">
                  <span className="text-text-primary font-bold block">{c.name}</span>
                  <span className="text-doom-glow/90 mt-0.5 block">{c.contact}</span>
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
              {event.category} // {event.branch}
            </span>
            <span className="font-display text-sm font-bold text-text-primary truncate block">
              {event.name}
            </span>
          </div>

          <a
            href={event.googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="doom-btn-primary w-full sm:w-auto sm:min-w-[260px] text-center"
            id="btn-register-participate"
          >
            <span className="doom-btn-primary-inner flex items-center justify-center gap-2 py-3.5 text-xs tracking-widest">
              <span>REGISTER TO PARTICIPATE</span>
              <ExternalLink size={14} />
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
