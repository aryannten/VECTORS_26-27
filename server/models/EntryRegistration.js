const mongoose = require('mongoose')
const crypto = require('crypto')

const entryRegistrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      unique: true,
      required: true,
      default: () => `VEC-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    college: {
      type: String,
      required: [true, 'College is required'],
      trim: true,
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

module.exports = mongoose.model('EntryRegistration', entryRegistrationSchema)
