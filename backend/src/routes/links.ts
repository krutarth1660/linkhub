import { Router } from 'express'
import { db } from '../lib/db'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { linkSchema, reorderLinksSchema } from '../lib/validations'

const router = Router()

// Get user links
router.get('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const links = await db.link.findMany({
      where: { userId: req.user!.userId },
      orderBy: { position: 'asc' },
      include: {
        _count: {
          select: { clicks: true }
        }
      }
    })

    res.json({
      success: true,
      data: { links }
    })
  } catch (error) {
    next(error)
  }
})

// Create new link
router.post('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const validatedData = linkSchema.parse(req.body)

    // Get the next position
    const lastLink = await db.link.findFirst({
      where: { userId: req.user!.userId },
      orderBy: { position: 'desc' },
    })

    const position = (lastLink?.position || 0) + 1

    const link = await db.link.create({
      data: {
        ...validatedData,
        userId: req.user!.userId,
        position,
        scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : null,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
      },
      include: {
        _count: {
          select: { clicks: true }
        }
      }
    })

    res.status(201).json({
      success: true,
      data: { link }
    })
  } catch (error) {
    next(error)
  }
})

// Update link
router.put('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params
    const validatedData = linkSchema.parse(req.body)

    // Verify ownership
    const existingLink = await db.link.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    })

    if (!existingLink) {
      return res.status(404).json({ error: 'Link not found' })
    }

    const link = await db.link.update({
      where: { id },
      data: {
        ...validatedData,
        scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : null,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
      },
      include: {
        _count: {
          select: { clicks: true }
        }
      }
    })

    res.json({
      success: true,
      data: { link }
    })
  } catch (error) {
    next(error)
  }
})

// Delete link
router.delete('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params

    // Verify ownership
    const existingLink = await db.link.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    })

    if (!existingLink) {
      return res.status(404).json({ error: 'Link not found' })
    }

    await db.link.delete({
      where: { id },
    })

    res.json({
      success: true,
      message: 'Link deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

// Reorder links
router.put('/reorder', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { links } = reorderLinksSchema.parse(req.body)

    // Verify all links belong to the user
    const userLinks = await db.link.findMany({
      where: {
        userId: req.user!.userId,
        id: { in: links.map(l => l.id) }
      }
    })

    if (userLinks.length !== links.length) {
      return res.status(400).json({ error: 'Invalid links' })
    }

    // Update positions in a transaction
    await db.$transaction(
      links.map(link =>
        db.link.update({
          where: { id: link.id },
          data: { position: link.position }
        })
      )
    )

    res.json({
      success: true,
      message: 'Links reordered successfully'
    })
  } catch (error) {
    next(error)
  }
})

export { router as linkRoutes }