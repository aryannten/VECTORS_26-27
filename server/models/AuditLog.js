const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    performedBy: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    targetType: {
      type: String,
      enum: ['Event', 'User', 'Registration', 'EntryRegistration', 'EventRegistration', 'Announcement', 'SiteConfig'],
      required: true,
    },
    targetId: {
      type: String,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

// Performance indexes for sorted pagination and filtering
auditLogSchema.index({ createdAt: -1 })
auditLogSchema.index({ performedBy: 1 })
auditLogSchema.index({ targetType: 1 })

module.exports = mongoose.model('AuditLog', auditLogSchema)
