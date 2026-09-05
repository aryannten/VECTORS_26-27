import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, ChevronDown, Search, ArrowRight, ShieldCheck, Ticket, Users, MapPin, Mail, MessageSquare } from 'lucide-react'
import { cn } from '../lib/utils'

const FAQ_DATA = [
  {
    category: 'Entry Pass & Verification',
    icon: Ticket,
    questions: [
      {
        q: 'What is the VECTORS 26 Entry Pass, and is it mandatory?',
        a: 'Yes. The VECTORS Entry Pass is your unified festival credential (`VEC-XXXXXXXX`). It provides physical campus access, verified credentials for checkpoint security, and unlocks eligibility to register for individual technical challenges and arena tournaments.',
      },
      {
        q: 'How do I claim my Entry Pass?',
        a: 'Create a free account or log in with Google, navigate to "Get Entry Pass", fill in your basic academic details (college, branch, year, phone), and your pass will be instantly generated with an encrypted QR code and unique Pass ID.',
      },
      {
        q: 'Can I access events without an Entry Pass?',
        a: 'No. All event registrations require a verified Entry Pass. If you attempt to register for an event without one, you will be automatically directed to claim your pass first.',
      },
      {
        q: 'What happens at campus entry on the festival days?',
        a: 'Present your digital Entry Pass on your smartphone (from the "My Pass" or "Dashboard" tab) at the main gate security checkpoint. Security officers will scan your QR code using the digital scanner to confirm your check-in.',
      },
    ],
  },
  {
    category: 'Event Registration & Teams',
    icon: Users,
    questions: [
      {
        q: 'Are branch restrictions enforced on events?',
        a: 'Most events are Open to All eligible students regardless of engineering branch or academic department. Branch suggestions in event listings indicate alignment, but do not disqualify participants.',
      },
      {
        q: 'How does team formation work for events like Hackathon or Robo Wars?',
        a: 'During the event registration modal, select "Team Registration", provide a team name, and specify your teammates\' names, emails, and phone numbers. Each member must also hold a valid VECTORS account and pass.',
      },
      {
        q: 'Can I cancel or change an event registration?',
        a: 'Yes. You can manage and cancel your event registrations directly from your User Dashboard (`/dashboard`). Cancelling an event frees up the reserved slot for other participants on the waitlist.',
      },
      {
        q: 'What does "Capacity Reached" or "Registration Closed" mean?',
        a: 'To guarantee quality and safety, each venue and event has an atomic capacity limit. Once maximum capacity is reached, the system closes registration. Check announcements if additional slots are released.',
      },
    ],
  },
  {
    category: 'Venue, Logistics & Schedule',
    icon: MapPin,
    questions: [
      {
        q: 'When and where is VECTORS 26 being hosted?',
        a: 'VECTORS 26 takes place on March 15 and March 16, 2026 across the campus engineering complex, computing labs, hardware centers, and open-air amphitheatres.',
      },
      {
        q: 'Will accommodation or food be arranged for outstation participants?',
        a: 'Outstation participants registered for multi-day events or the 24-hour Doomsday Hackathon will receive dormitory access pass credentials upon physical verification at the help desk.',
      },
      {
        q: 'Where do I find the latest venue and schedule updates?',
        a: 'Visit the live Festival Schedule (`/schedule`) or check Official Announcements (`/announcements`) for real-time room assignments and alerts.',
      },
    ],
  },
  {
    category: 'Code of Conduct & Safety',
    icon: ShieldCheck,
    questions: [
      {
        q: 'What rules govern code, models, and hardware during competitions?',
        a: 'All submitted software, models, and prototypes must be authored during the competition window. Plagiarism, pre-built proprietary software, or unsportsmanlike combat tactics lead to immediate team disqualification.',
      },
      {
        q: 'What hardware/tools should I bring with me?',
        a: 'Participants in software events should bring their personal laptops and chargers. Hardware, soldering stations, and combat test arenas are provided on site by the respective event lab coordinators.',
      },
      {
        q: 'Who do I contact in case of an issue during the event?',
        a: 'Each event page lists designated student coordinators with direct mobile numbers. You can also visit the Central Control Desk located at the main foyer.',
      },
    ],
  },
]

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState({}) // { [key]: boolean }
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredCategories = useMemo(() => {
    return FAQ_DATA.map((catGroup) => {
      const filteredQuestions = catGroup.questions.filter((item) => {
        const qMatch = item.q.toLowerCase().includes(searchQuery.toLowerCase())
        const aMatch = item.a.toLowerCase().includes(searchQuery.toLowerCase())
        return qMatch || aMatch
      })

      return {
        ...catGroup,
        questions: filteredQuestions,
      }
    }).filter((catGroup) => {
      const matchCat =
        selectedCategory === 'ALL' || catGroup.category === selectedCategory
      return matchCat && catGroup.questions.length > 0
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 border-b border-white/[0.08] pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald/10 border border-emerald/20 text-emerald font-mono text-xs uppercase tracking-widest">
          <HelpCircle size={13} />
          <span>Festival Knowledge Base // FAQ</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-wider text-bone">
          Frequently Asked <span className="text-emerald">Questions</span>
        </h1>
        <p className="text-steel text-sm sm:text-base max-w-xl mx-auto">
          Everything you need to know about entry pass credentials, event participation rules, team registrations, and festival protocol.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel/50" />
          <input
            type="text"
            placeholder="Search questions by keyword, entry pass, hackathon, rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-charcoal/80 border border-white/10 rounded-xl text-bone text-xs sm:text-sm font-mono placeholder:text-steel/40 focus:outline-none focus:border-emerald/50 transition-colors backdrop-blur-md"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 justify-center">
          {['ALL', ...FAQ_DATA.map((c) => c.category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3.5 py-1.5 rounded-lg font-mono text-xs tracking-wider uppercase transition-all border',
                selectedCategory === cat
                  ? 'bg-emerald text-doom-bg font-bold border-emerald shadow-md shadow-emerald/20'
                  : 'bg-charcoal/80 text-steel border-white/5 hover:border-white/20 hover:text-bone'
              )}
            >
              {cat === 'ALL' ? 'All Questions' : cat.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion Groups */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-charcoal/40 border border-white/5 rounded-2xl">
            <HelpCircle size={36} className="mx-auto text-steel/40 mb-3" />
            <h3 className="font-display text-lg text-bone uppercase tracking-wider">No Answers Found</h3>
            <p className="font-mono text-xs text-steel mt-1 max-w-sm mx-auto">
              We couldn't find questions matching &quot;{searchQuery}&quot;. Reach out to support or check announcements.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('ALL')
              }}
              className="mt-4 px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-bone font-mono text-xs transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          filteredCategories.map((group, groupIdx) => {
            const Icon = group.icon
            return (
              <div key={group.category} className="space-y-3">
                <div className="flex items-center gap-2 font-display text-sm sm:text-base text-bone uppercase tracking-wider px-1">
                  <Icon size={16} className="text-emerald" />
                  <span>{group.category}</span>
                </div>

                <div className="space-y-2">
                  {group.questions.map((item, qIdx) => {
                    const itemKey = `${groupIdx}-${qIdx}`
                    const isOpen = openItems[itemKey] !== undefined ? openItems[itemKey] : (groupIdx === 0 && qIdx === 0)

                    return (
                      <div
                        key={qIdx}
                        className="rounded-xl border border-white/[0.07] bg-charcoal/70 hover:bg-charcoal/90 transition-all overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(itemKey)}
                          className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                        >
                          <span className="font-display text-sm sm:text-base tracking-wide text-bone font-medium">
                            {item.q}
                          </span>
                          <ChevronDown
                            size={16}
                            className={cn(
                              'text-steel shrink-0 transition-transform duration-200',
                              isOpen && 'rotate-180 text-emerald'
                            )}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-1 text-steel text-xs sm:text-sm leading-relaxed border-t border-white/[0.04] font-sans">
                            {item.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Support & Contact Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-charcoal via-charcoal to-emerald/10 border border-white/[0.08] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="font-display text-xl font-bold uppercase tracking-wider text-bone">
            Still Have Inquiries?
          </h3>
          <p className="text-steel text-xs sm:text-sm max-w-md">
            Our student organizing committee and technical leads are available around the clock to assist you with registration or logistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/events"
            className="px-4 py-2.5 rounded-lg bg-emerald hover:bg-emerald/90 text-doom-bg font-mono text-xs uppercase tracking-wider font-bold transition-colors inline-flex items-center gap-2"
          >
            <span>Explore Events</span>
            <ArrowRight size={13} />
          </Link>
          <Link
            to="/announcements"
            className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-bone font-mono text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
          >
            <span>Live Alerts</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
