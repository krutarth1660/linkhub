import { Router } from 'express'
import { db } from '../lib/db'

const router = Router()

// Get public profile by username
router.get('/profile/:username', async (req, res, next) => {
  try {
    const { username } = req.params

    const user = await db.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        theme: true,
        image: true,
        links: {
          where: { 
            isActive: true,
            OR: [
              { scheduledAt: null },
              { scheduledAt: { lte: new Date() } }
            ],
            AND: [
              {
                OR: [
                  { expiresAt: null },
                  { expiresAt: { gt: new Date() } }
                ]
              }
            ]
          },
          orderBy: { position: 'asc' },
          select: {
            id: true,
            title: true,
            url: true,
            description: true,
            platform: true,
            position: true,
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    res.json({
      success: true,
      data: { user }
    })
  } catch (error) {
    next(error)
  }
})

// Check if username is available
router.get('/username/:username/available', async (req, res, next) => {
  try {
    const { username } = req.params

    const existingUser = await db.user.findUnique({
      where: { username },
      select: { id: true }
    })

    res.json({
      success: true,
      data: { available: !existingUser }
    })
  } catch (error) {
    next(error)
  }
})

export { router as publicRoutes }