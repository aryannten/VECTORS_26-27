const express = require('express')
const router = express.Router()
const Event = require('../models/Event')

/**
 * GET /api/events
 * Get all active events.
 */
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ category: 1, name: 1 })
    res.status(200).json(events)
  } catch (error) {
    console.error('[API] Events fetch error:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

/**
 * GET /api/events/:slug
 * Get a single event by slug.
 */
router.get('/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug, isActive: true })
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' })
    }
    res.status(200).json(event)
  } catch (error) {
    console.error('[API] Event fetch error:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
})

module.exports = router
