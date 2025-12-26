import { Router } from 'express'
import { db } from '../lib/db'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { profileSchema } from '../lib/validations'

const router = Router()

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        theme: true,
        image: true,
        createdAt: true,
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    next(error)
  }
})

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const validatedData = profileSchema.parse(req.body)

    // Check if username is already taken (excluding current user)
    if (validatedData.username) {
      const existingUser = await db.user.findFirst({
        where: {
          username: validatedData.username,
          id: { not: req.user!.userId }
        }
      })

      if (existingUser) {
        return res.status(400).json({ error: 'Username is already taken' })
      }
    }

    const updatedUser = await db.user.update({
      where: { id: req.user!.userId },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        theme: true,
        image: true,
        createdAt: true,
      }
    })

    res.json({
      success: true,
      data: { user: updatedUser }
    })
  } catch (error) {
    next(error)
  }
})

// Get user with links (for dashboard)
router.get('/dashboard', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        links: {
          orderBy: { position: 'asc' },
          include: {
            _count: {
              select: { clicks: true }
            }
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user as any

    res.json({
      success: true,
      data: { user: userWithoutPassword }
    })
  } catch (error) {
    next(error)
  }
})

export { router as userRoutes }