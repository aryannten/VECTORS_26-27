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
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { label: 'Date', value: event.date },
            { label: 'Venue', value: event.venue },
            { label: 'Fee', value: event.fee },
            { label: 'Team Size', value: event.teamSize },
          ].map((item) => (
            <div key={item.label} className="border border-brass-dim/20 bg-iron/20 p-4">
              <span className="font-mono text-xs text-steel uppercase">{item.label}</span>
              <p className="font-mono text-bone mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div className="mb-8">
          <h2 className="font-display text-xl tracking-widest mb-4">Rules</h2>
          <ul className="space-y-2">
            {event.rules.map((rule, i) => (
              <li key={i} className="font-mono text-sm text-steel flex gap-3">
                <span className="text-emerald shrink-0">{String(i + 1).padStart(2, '0')}</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Sticky Registration CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-charcoal/95 backdrop-blur-sm border-t border-brass-dim/20">
          <a
            href={event.googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-2xl mx-auto py-4 text-center font-display text-lg tracking-widest uppercase bg-emerald text-charcoal hover:bg-emerald-dim transition-colors duration-300"
            id="btn-register-participate"
          >
            Register to Participate
          </a>
        </div>
      </div>
    </div>
  )
}
