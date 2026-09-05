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
      enum: ['Event', 'User', 'Registration', 'Announcement', 'SiteConfig'],
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

module.exports = mongoose.model('AuditLog', auditLogSchema)
