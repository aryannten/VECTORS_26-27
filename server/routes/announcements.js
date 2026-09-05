const express = require('express')
const router = express.Router()
const Announcement = require('../models/Announcement')
const AuditLog = require('../models/AuditLog')
const { verifyFirebaseToken, requireRole } = require('../middleware/auth')

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
    res.status(200).json(announcements)
  } catch (error) {
    console.error('[Announcements] Fetch error:', error.message)
    res.status(500).json({ message: 'Failed to fetch announcements.' })
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

    const announcement = await Announcement.create({
      title: title.trim(),
      content: content.trim(),
      category: category || 'general',
      relatedEventSlug: relatedEventSlug ? relatedEventSlug.toLowerCase().trim() : null,
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
    const { title, content, category, relatedEventSlug, isPinned, isPublished } = req.body
    const announcement = await Announcement.findById(req.params.id)

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found.' })
    }

    if (title !== undefined) announcement.title = title.trim()
    if (content !== undefined) announcement.content = content.trim()
    if (category !== undefined) announcement.category = category
    if (relatedEventSlug !== undefined) announcement.relatedEventSlug = relatedEventSlug ? relatedEventSlug.toLowerCase().trim() : null
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
