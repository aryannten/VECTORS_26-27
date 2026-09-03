import { Link } from 'react-router-dom'

/**
 * Events — The Event Vault Browser.
 * Phase 7: Functional scaffold with mock data.
 * Phase 9: Full vault door animation and cinematic imagery.
 */
const mockEvents = [
  {
    id: 'hackathon',
    name: 'Hackathon',
    category: 'Technical',
    fee: 'Free',
    date: 'TBD',
    description: 'Build, break, and innovate in a 24-hour sprint.',
  },
  {
    id: 'robo-wars',
    name: 'Robo Wars',
    category: 'Technical',
    fee: '₹500',
    date: 'TBD',
    description: 'Engineer your machine. Destroy the competition.',
  },
  {
    id: 'gaming-arena',
    name: 'Gaming Arena',
    category: 'Non-Technical',
    fee: '₹200',
    date: 'TBD',
    description: 'Compete in high-stakes esports tournaments.',
  },
  {
    id: 'cultural-night',
    name: 'Cultural Night',
    category: 'Non-Technical',
    fee: 'Free',
    date: 'TBD',
    description: 'Music, dance, and performance under the stars.',
  },
]

export default function Events() {
  return (
    <div className="min-h-screen px-6 pt-24 pb-12">
      <h1 className="font-display text-4xl md:text-5xl tracking-widest text-center mb-12">
        Event Vaults
      </h1>

      {/* Event Grid — will become full-screen vertical vaults in Phase 9 */}
      <div className="max-w-4xl mx-auto space-y-6">
        {mockEvents.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="block border border-brass-dim/30 bg-iron/20 p-6 hover:border-emerald/50 hover:bg-iron/40 transition-all duration-300 group"
            id={`event-${event.id}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-brass uppercase tracking-widest">
                  {event.category}
                </span>
                <h3 className="font-display text-2xl tracking-wider mt-1 group-hover:text-emerald transition-colors duration-300">
                  {event.name}
                </h3>
                <p className="font-mono text-steel text-sm mt-2">{event.description}</p>
              </div>
              <div className="text-right font-mono text-sm shrink-0">
                <p className="text-brass">{event.fee}</p>
                <p className="text-steel mt-1">{event.date}</p>
              </div>
            </div>

            {/* Open Vault CTA */}
            <div className="mt-4 pt-4 border-t border-brass-dim/20 flex items-center justify-between">
              <span className="font-mono text-xs text-steel">Tap to open vault</span>
              <span className="text-emerald group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
