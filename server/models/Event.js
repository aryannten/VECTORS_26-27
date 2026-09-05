const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
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
      default: 'TBD',
    },
    venue: {
      type: String,
      default: 'TBD',
    },
    teamSize: {
      type: String,
      default: 'Individual',
    },
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
