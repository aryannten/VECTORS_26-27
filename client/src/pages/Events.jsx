import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * Events — The Event Vault Browser.
 * Phase 9.3: Migrated to Framer Motion.
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

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
}

export default function Events() {
  return (
    <div className="min-h-screen px-6 pt-24 pb-12 bg-transparent relative z-10">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="font-display text-4xl md:text-5xl tracking-widest text-center mb-16 text-bone drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]"
      >
        Event Vaults
      </motion.h1>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto space-y-8"
      >
        {mockEvents.map((event) => (
          <motion.div variants={itemVariants} key={event.id}>
            <Link
              to={`/events/${event.id}`}
              className="block relative glass-panel p-6 md:p-8 hover:border-emerald/40 transition-all duration-500 group overflow-hidden"
              id={`event-${event.id}`}
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald/0 via-emerald/10 to-emerald/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-full group-hover:translate-x-full ease-in-out" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="flex-1">
                  <span className="font-mono text-xs text-brass uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-brass rounded-full animate-pulse" />
                    {event.category}
                  </span>
                  <h3 className="font-display text-3xl tracking-wider mt-2 text-bone group-hover:text-emerald transition-colors duration-300 drop-shadow-md">
                    {event.name}
                  </h3>
                  <p className="font-mono text-steel text-sm mt-3 leading-relaxed max-w-xl">{event.description}</p>
                </div>
                
                <div className="md:text-right font-mono text-sm shrink-0 flex flex-row md:flex-col gap-6 md:gap-1 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-brass-dim/20 w-full md:w-auto">
                  <div>
                    <span className="text-steel/50 text-xs block md:hidden mb-1 uppercase">Fee</span>
                    <p className="text-brass font-bold">{event.fee}</p>
                  </div>
                  <div>
                    <span className="text-steel/50 text-xs block md:hidden mb-1 uppercase">Date</span>
                    <p className="text-steel">{event.date}</p>
                  </div>
                </div>
              </div>

              {/* Open Vault CTA */}
              <div className="relative z-10 mt-6 pt-4 border-t border-brass-dim/20 flex items-center justify-between">
                <span className="font-mono text-xs text-steel/70 tracking-widest uppercase">Tap to open vault</span>
                <span className="text-emerald group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300">→</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
