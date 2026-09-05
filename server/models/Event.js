const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Technical', 'Non-Technical'],
      required: true,
    },
    branch: {
      type: String,
      default: 'Open to All',
      trim: true,
    },
    isBranchExclusive: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    rules: {
      type: [String],
      default: [],
    },
    fee: {
      type: String,
      default: 'Free',
    },
    date: {
      type: String,
      default: 'March 15, 2026',
    },
    startTime: {
      type: String,
      default: '09:00 IST',
    },
    endTime: {
      type: String,
      default: '17:00 IST',
    },
    venue: {
      type: String,
      default: 'TBD',
    },
    venueDetails: {
      building: { type: String, default: 'Main Tech Block' },
      floor: { type: String, default: 'Ground Floor' },
      room: { type: String, default: 'Main Arena' },
      directions: { type: String, default: 'Follow directional signs from main college entrance.' },
    },
    teamSize: {
      type: String,
      default: 'Solo',
    },
    minTeamSize: {
      type: Number,
      default: 1,
    },
    maxTeamSize: {
      type: Number,
      default: 1,
    },
    capacity: {
      type: Number,
      default: 100, // 0 means unlimited
    },
    registrationCount: {
      type: Number,
      default: 0,
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    registrationDeadline: {
      type: String,
      default: 'March 14, 2026 // 23:59 IST',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'coming_soon', 'open', 'almost_full', 'full', 'closed', 'completed'],
      default: 'open',
    },
    prizePool: {
      type: String,
      default: 'Cash Prizes & Certificates',
    },
    eligibility: {
      type: String,
      default: 'Open to all enrolled undergraduate and diploma students with valid college ID.',
    },
    coordinators: [
      {
        name: { type: String, default: '' },
        contact: { type: String, default: '' },
      },
    ],
    faq: [
      {
        question: { type: String, default: '' },
        answer: { type: String, default: '' },
      },
    ],
    googleFormUrl: {
      type: String,
      default: '#',
    },
    imageUrl: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Event', eventSchema)
