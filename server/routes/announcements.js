const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Announcement = require('../models/Announcement')
const AuditLog = require('../models/AuditLog')
const { verifyFirebaseToken, requireRole } = require('../middleware/auth')

const DEFAULT_ANNOUNCEMENTS = [
  {
    _id: 'default-announcement-1',
    title: 'VECTORS 26–27 Digital Passes Now Live',
    content: 'All participants must claim their digital Entry Pass before accessing event vaults and team registrations. Gate QR scanning will be enforced at main entrance points.',
    category: 'urgent',
    isPinned: true,
    isPublished: true,
    publishedAt: new Date('2026-03-01'),
    author: 'Chief Coordinator',
  },
  {
    _id: 'default-announcement-2',
    title: 'Doomsday Hackathon Problem Statements',
    content: 'Problem statements for the 24-Hour Hackathon will be officially unveiled during the opening ceremony in Computing Hub Lab 401. Ensure your team of 2–4 is fully registered in advance.',
    category: 'registration',
    relatedEventSlug: 'hackathon',
    isPinned: false,
    isPublished: true,
    publishedAt: new Date('2026-03-02'),
    author: 'Tech Department',
  },
  {
    _id: 'default-announcement-3',
    title: 'Robo Wars Arena Safety Weigh-In',
    content: 'Combat bot weigh-ins and failsafe testing start at 09:30 IST on March 16. Late entries will not be permitted into the tournament bracket.',
    category: 'schedule',
    relatedEventSlug: 'robo-wars',
    isPinned: false,
    isPublished: true,
    publishedAt: new Date('2026-03-03'),
    author: 'Robotics Guild',
  },
]

/**
 * GET /api/announcements
 * Public list of published announcements.
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query
    const filter = { isPublished: true }
    if (category && category !== 'all') {
      filter.category = category
    }

    const announcements = await Announcement.find(filter)
      .sort({ isPinned: -1, publishedAt: -1 })
      .limit(50)

    if (announcements && announcements.length > 0) {
      return res.status(200).json(announcements)
    }

    // Fallback if collection is newly created or empty
    const filteredFallback = category && category !== 'all'
      ? DEFAULT_ANNOUNCEMENTS.filter((a) => a.category === category)
      : DEFAULT_ANNOUNCEMENTS
    res.status(200).json(filteredFallback)
  } catch (error) {
    console.error('[Announcements] Fetch error:', error.message)
    res.status(200).json(DEFAULT_ANNOUNCEMENTS)
  }
})

/**
 * GET /api/announcements/admin
 * Admin list of all announcements (including unpublished drafts).
 */
router.get('/admin', verifyFirebaseToken, requireRole('admin'), async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 })
    res.status(200).json(announcements)
  } catch (error) {
    console.error('[Announcements] Admin fetch error:', error.message)
    res.status(500).json({ message: 'Failed to fetch announcements.' })
  }
})

/**
 * POST /api/announcements
 * Admin creates a new announcement.
 */
router.post('/', verifyFirebaseToken, requireRole('admin'), async (req, res) => {
  try {
    const { title, content, category, relatedEventSlug, isPinned } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' })
    }

    if (typeof title !== 'string' || typeof content !== 'string') {
      return res.status(400).json({ message: 'Title and content must be strings.' })
    }

    const cleanTitle = title.trim().slice(0, 200)
    const cleanContent = content.trim().slice(0, 5000)

    if (!cleanTitle || !cleanContent) {
      return res.status(400).json({ message: 'Title and content cannot be empty.' })
    }

    const validCategories = ['general', 'schedule', 'urgent', 'registration']
    const resolvedCategory = (category && validCategories.includes(category)) ? category : 'general'

    const announcement = await Announcement.create({
      title: cleanTitle,
      content: cleanContent,
      category: resolvedCategory,
      relatedEventSlug: relatedEventSlug ? String(relatedEventSlug).toLowerCase().trim().slice(0, 100) : null,
      isPinned: Boolean(isPinned),
      author: req.user.displayName || req.user.email,
    })

    // Audit log
    await AuditLog.create({
      action: 'ANNOUNCEMENT_CREATED',
      performedBy: req.user.email,
      targetType: 'Announcement',
      targetId: announcement._id.toString(),
      details: { title: announcement.title },
    }).catch(err => console.error('[AuditLog] Error:', err.message))

    res.status(201).json(announcement)
  } catch (error) {
    console.error('[Announcements] Create error:', error.message)
    res.status(500).json({ message: 'Failed to create announcement.' })
  }
})

/**
 * PUT /api/announcements/:id
 * Admin updates an existing announcement.
 */
router.put('/:id', verifyFirebaseToken, requireRole('admin'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid announcement ID format.' })
    }

    const { title, content, category, relatedEventSlug, isPinned, isPublished } = req.body
    const announcement = await Announcement.findById(req.params.id)

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found.' })
    }

    const validCategories = ['general', 'schedule', 'urgent', 'registration']

    if (title !== undefined) {
      if (typeof title !== 'string') return res.status(400).json({ message: 'Title must be a string.' })
      announcement.title = title.trim().slice(0, 200)
    }
    if (content !== undefined) {
      if (typeof content !== 'string') return res.status(400).json({ message: 'Content must be a string.' })
      announcement.content = content.trim().slice(0, 5000)
    }
    if (category !== undefined) {
      if (validCategories.includes(category)) announcement.category = category
    }
    if (relatedEventSlug !== undefined) announcement.relatedEventSlug = relatedEventSlug ? String(relatedEventSlug).toLowerCase().trim().slice(0, 100) : null
    if (isPinned !== undefined) announcement.isPinned = Boolean(isPinned)
    if (isPublished !== undefined) announcement.isPublished = Boolean(isPublished)

    await announcement.save()

    // Audit log
    await AuditLog.create({
      action: 'ANNOUNCEMENT_UPDATED',
      performedBy: req.user.email,
      targetType: 'Announcement',
      targetId: announcement._id.toString(),
      details: { title: announcement.title, isPublished: announcement.isPublished },
    }).catch(err => console.error('[AuditLog] Error:', err.message))

    res.status(200).json(announcement)
  } catch (error) {
    console.error('[Announcements] Update error:', error.message)
    res.status(500).json({ message: 'Failed to update announcement.' })
  }
})

/**
 * DELETE /api/announcements/:id
 * Admin deletes an announcement.
 */
router.delete('/:id', verifyFirebaseToken, requireRole('admin'), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid announcement ID format.' })
    }

    const announcement = await Announcement.findByIdAndDelete(req.params.id)
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found.' })
    }

    // Audit log
    await AuditLog.create({
      action: 'ANNOUNCEMENT_DELETED',
      performedBy: req.user.email,
      targetType: 'Announcement',
      targetId: req.params.id,
      details: { title: announcement.title },
    }).catch(err => console.error('[AuditLog] Error:', err.message))

    res.status(200).json({ message: 'Announcement deleted successfully.' })
  } catch (error) {
    console.error('[Announcements] Delete error:', error.message)
    res.status(500).json({ message: 'Failed to delete announcement.' })
  }
})

module.exports = router
