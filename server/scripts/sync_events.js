/**
 * Script to synchronize all official brochure events into MongoDB Atlas
 * Run with: node scripts/sync_events.js
 */
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const mongoose = require('mongoose')
const Event = require('../models/Event')
const connectDB = require('../config/db')
const officialEvents = require('../data/officialEvents')

async function syncAllEvents() {
  console.log('Connecting to MongoDB Atlas...')
  await connectDB()

  console.log(`Starting sync for ${officialEvents.length} official brochure events...`)

  // Upsert all official events
  for (const evt of officialEvents) {
    const query = evt.aliases && evt.aliases.length > 0 
      ? { $or: [{ slug: evt.slug }, { slug: { $in: evt.aliases } }] }
      : { slug: evt.slug }

    await Event.findOneAndUpdate(
      query,
      { $set: evt },
      { upsert: true, returnDocument: 'after' }
    )
    console.log(`✓ Upserted [${evt.category.toUpperCase()}] ${evt.name} (${evt.slug}) | Fee: ${evt.fee} | Prizes: ${evt.prizePool}`)
  }

  // Deactivate any legacy placeholder events that are not in the official brochure
  const activeSlugs = officialEvents.map(e => e.slug)
  const deactivated = await Event.updateMany(
    { slug: { $nin: activeSlugs } },
    { $set: { isActive: false, status: 'closed', registrationOpen: false } }
  )
  if (deactivated.modifiedCount > 0) {
    console.log(`✓ Deactivated ${deactivated.modifiedCount} legacy/placeholder events not in official brochure.`)
  }

  const total = await Event.countDocuments({ isActive: true })
  console.log(`\nSynchronization complete! Active official events in MongoDB Atlas: ${total}`)
  await mongoose.disconnect()
  process.exit(0)
}

syncAllEvents().catch((err) => {
  console.error('Failed to sync events:', err)
  process.exit(1)
})
