import { useParams, Link } from 'react-router-dom'

/**
 * Event Detail — Individual event page with rules, details, and Google Form CTA.
 * Phase 7: Functional scaffold with mock data.
 */
const mockEventData = {
  hackathon: {
    name: 'Hackathon',
    category: 'Technical',
    fee: 'Free',
    date: 'TBD',
    venue: 'Main Auditorium',
    teamSize: '2–4 members',
    description: 'Build, break, and innovate in a 24-hour sprint. Bring your laptop, your ideas, and your determination.',
    rules: [
      'Teams of 2–4 members.',
      'All code must be written during the event.',
      'Pre-built libraries and frameworks are allowed.',
      'Judging criteria: Innovation, Execution, Presentation.',
    ],
    googleFormUrl: '#', // Admin will configure this
  },
  'robo-wars': {
    name: 'Robo Wars',
    category: 'Technical',
    fee: '₹500',
    date: 'TBD',
    venue: 'Arena Block B',
    teamSize: '3–5 members',
    description: 'Engineer your machine. Destroy the competition. The last bot standing wins.',
    rules: [
      'Weight limit: 25kg.',
      'No flammable weapons.',
      'Radio-controlled only.',
      'Round duration: 3 minutes.',
    ],
    googleFormUrl: '#',
  },
  'gaming-arena': {
    name: 'Gaming Arena',
    category: 'Non-Technical',
    fee: '₹200',
    date: 'TBD',
    venue: 'Lab Complex',
    teamSize: 'Solo / Duo',
    description: 'Compete in high-stakes esports tournaments across multiple titles.',
    rules: [
      'Bring your own peripherals.',
      'PCs will be provided.',
      'No cheating software.',
      'Best of 3 elimination rounds.',
    ],
    googleFormUrl: '#',
  },
  'cultural-night': {
    name: 'Cultural Night',
    category: 'Non-Technical',
    fee: 'Free',
    date: 'TBD',
    venue: 'Open Air Theatre',
    teamSize: 'Solo / Group',
    description: 'Music, dance, and performance under the stars. Showcase your talent.',
    rules: [
      'Performance duration: 5–10 minutes.',
      'No offensive content.',
      'Sound equipment provided.',
      'Registration required.',
    ],
    googleFormUrl: '#',
  },
}

export default function EventDetail() {
  const { eventId } = useParams()
  const event = mockEventData[eventId]

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-3xl text-crimson">Vault Not Found</h2>
          <Link to="/events" className="font-mono text-brass mt-4 inline-block hover:text-emerald">
            ← Return to Vaults
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 pt-24 pb-32">
      <div className="max-w-2xl mx-auto">
        {/* Back Link */}
        <Link to="/events" className="font-mono text-brass text-sm hover:text-emerald transition-colors duration-300">
          ← All Events
        </Link>

        {/* Event Header */}
        <div className="mt-6 mb-8">
          <span className="font-mono text-xs text-brass uppercase tracking-widest">
            {event.category}
          </span>
          <h1 className="font-display text-4xl md:text-5xl tracking-widest mt-2">{event.name}</h1>
          <p className="font-mono text-steel mt-4 leading-relaxed">{event.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12 relative z-10">
          {[
            { label: 'Date', value: event.date },
            { label: 'Venue', value: event.venue },
            { label: 'Fee', value: event.fee },
            { label: 'Team Size', value: event.teamSize },
          ].map((item) => (
            <div key={item.label} className="glass-panel p-4 md:p-6 border-brass-dim/20 hover:border-emerald/30 transition-colors duration-500">
              <span className="font-mono text-[10px] md:text-xs text-emerald tracking-widest uppercase block mb-1">{item.label}</span>
              <p className="font-mono text-bone text-sm md:text-base drop-shadow-md">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div className="mb-24 relative z-10">
          <h2 className="font-display text-2xl tracking-widest mb-6 text-brass drop-shadow-[0_0_10px_rgba(212,175,55,0.2)]">Rules of Engagement</h2>
          <ul className="space-y-4">
            {event.rules.map((rule, i) => (
              <li key={i} className="font-mono text-sm md:text-base text-steel flex gap-4 bg-iron/10 p-4 border-l-2 border-emerald/50">
                <span className="text-emerald shrink-0 font-bold drop-shadow-[0_0_5px_rgba(0,255,102,0.5)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="leading-relaxed text-bone/90">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sticky Registration CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-charcoal/80 backdrop-blur-xl border-t border-brass-dim/20 z-50">
          <a
            href={event.googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-2xl mx-auto py-4 text-center font-display text-sm tracking-[0.15em] uppercase text-emerald border border-emerald/40 transition-all duration-300 hover:text-charcoal hover:bg-emerald hover:shadow-[0_0_40px_rgba(0,255,102,0.6)]"
            style={{ background: 'rgba(0,255,102,0.06)', backdropFilter: 'blur(12px)', boxShadow: '0 0 15px rgba(0,255,102,0.08), inset 0 0 15px rgba(0,255,102,0.05)' }}
            id="btn-register-participate"
          >
            Register to Participate
          </a>
        </div>
      </div>
    </div>
  )
}
