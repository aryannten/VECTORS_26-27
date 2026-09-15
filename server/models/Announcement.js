const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Announcement content is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['general', 'schedule', 'urgent', 'registration'],
      default: 'general',
    },
    relatedEventSlug: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: String,
      default: 'VECTORS Organizing Committee',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Performance compound indexes for public broadcasts and category filtering
announcementSchema.index({ isPublished: 1, isPinned: -1, publishedAt: -1 })
announcementSchema.index({ category: 1 })

module.exports = mongoose.model('Announcement', announcementSchema)
