const mongoose = require('mongoose')
const crypto = require('crypto')

const eventRegistrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      unique: true,
      required: true,
      default: () => `EVT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    },
    eventSlug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    eventCategory: {
      type: String,
      enum: ['Technical', 'Non-Technical'],
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userPhone: {
      type: String,
      required: true,
      trim: true,
    },
    userCollege: {
      type: String,
      required: true,
      trim: true,
    },
    teamName: {
      type: String,
      default: null,
      trim: true,
    },
    teamMembers: [
      {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String, default: '', trim: true },
        college: { type: String, default: '', trim: true },
      },
    ],
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'attended'],
      default: 'confirmed',
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    checkInTimestamp: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Prevent duplicate registrations for the same event by the same user email
eventRegistrationSchema.index({ eventSlug: 1, userEmail: 1 }, { unique: true })

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema)
