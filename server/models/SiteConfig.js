const mongoose = require('mongoose')

const siteConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      required: true,
      default: 'main',
    },
    securityAccessCode: {
      type: String,
      required: true,
      default: 'VECTORS-GATE-2026',
    },
  },
  {
    timestamps: true,
  }
)

/**
 * Get the singleton site config document.
 * Creates one with defaults if it doesn't exist.
 */
siteConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne({ key: 'main' })
  if (!config) {
    config = await this.create({
      key: 'main',
      securityAccessCode: process.env.SECURITY_ACCESS_CODE || 'VECTORS-GATE-2026',
    })
  }
  return config
}

module.exports = mongoose.model('SiteConfig', siteConfigSchema)
