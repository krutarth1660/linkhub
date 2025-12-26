import { Router } from 'express'
import { db } from '../lib/db'
import { authenticateToken, AuthRequest, optionalAuth } from '../middleware/auth'
import { parseUserAgent, getLocationFromIP } from '../lib/utils'

const router = Router()

// Track click
router.post('/clicks', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const { linkId, userId } = req.body

    if (!linkId || !userId) {
      return res.status(400).json({ error: 'linkId and userId are required' })
    }

    // Get user agent and IP
    const userAgent = req.headers['user-agent'] || ''
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
               req.headers['x-real-ip'] as string || 
               req.socket.remoteAddress || 
               '127.0.0.1'

    // Parse user agent
    const { browser, os, device } = parseUserAgent(userAgent)

    // Get location from IP
    const geo = getLocationFromIP(ip)

    // Create click record
    const click = await db.click.create({
      data: {
        linkId,
        userId,
        userAgent,
        ipAddress: ip,
        browser,
        os,
        device,
        deviceType: device,
        country: geo?.country || null,
        city: geo?.city || null,
        referrer: req.headers['referer'] as string || null,
      },
    })

    // Increment link click count
    await db.link.update({
      where: { id: linkId },
      data: { clickCount: { increment: 1 } }
    })

    res.json({
      success: true,
      data: { clickId: click.id }
    })
  } catch (error) {
    next(error)
  }
})

// Get analytics overview
router.get('/overview', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.userId

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get total clicks
    const totalClicks = await db.click.count({
      where: { userId }
    })

    // Get total active links
    const totalLinks = await db.link.count({
      where: { userId, isActive: true }
    })

    // Get clicks today
    const clicksToday = await db.click.count({
      where: {
        userId,
        createdAt: { gte: today }
      }
    })

    // Get clicks this week
    const clicksThisWeek = await db.click.count({
      where: {
        userId,
        createdAt: { gte: weekAgo }
      }
    })

    // Get clicks this month
    const clicksThisMonth = await db.click.count({
      where: {
        userId,
        createdAt: { gte: monthAgo }
      }
    })

    // Get top performing links
    const topLinks = await db.link.findMany({
      where: { userId, isActive: true },
      include: {
        _count: {
          select: { clicks: true }
        }
      },
      orderBy: {
        clicks: {
          _count: 'desc'
        }
      },
      take: 5
    })

    const analytics = {
      totalClicks,
      totalLinks,
      clicksToday,
      clicksThisWeek,
      clicksThisMonth,
      topLinks,
    }

    res.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    next(error)
  }
})

// Get detailed analytics
router.get('/detailed', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.userId

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Get total clicks
    const totalClicks = await db.click.count({
      where: { userId }
    })

    // Get total active links
    const totalLinks = await db.link.count({
      where: { userId, isActive: true }
    })

    // Get clicks this month
    const clicksThisMonth = await db.click.count({
      where: {
        userId,
        createdAt: { gte: monthAgo }
      }
    })

    // Get clicks last month for growth calculation
    const clicksLastMonth = await db.click.count({
      where: {
        userId,
        createdAt: { 
          gte: lastMonth,
          lt: monthAgo
        }
      }
    })

    // Calculate growth
    const monthlyGrowth = clicksLastMonth > 0 
      ? Math.round(((clicksThisMonth - clicksLastMonth) / clicksLastMonth) * 100)
      : 0

    // Get unique visitors (approximate by unique IP addresses)
    const uniqueVisitors = await db.click.groupBy({
      by: ['ipAddress'],
      where: {
        userId,
        createdAt: { gte: monthAgo }
      },
      _count: true
    })

    // Get top performing links
    const topLinks = await db.link.findMany({
      where: { userId, isActive: true },
      include: {
        _count: {
          select: { clicks: true }
        }
      },
      orderBy: {
        clicks: {
          _count: 'desc'
        }
      },
      take: 10
    })

    // Get clicks by day for the last 30 days
    const clicksByDay = await db.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*)::int as clicks
      FROM "clicks"
      WHERE "userId" = ${userId}
        AND "createdAt" >= ${monthAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    ` as { date: Date; clicks: number }[]

    // Fill in missing days with 0 clicks
    const filledClicksByDay = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      const existingData = clicksByDay.find(item => 
        item.date.toISOString().split('T')[0] === dateStr
      )
      filledClicksByDay.push({
        date: dateStr,
        clicks: existingData?.clicks || 0
      })
    }

    // Get device breakdown
    const clicksByDevice = await db.click.groupBy({
      by: ['deviceType'],
      where: {
        userId,
        createdAt: { gte: monthAgo }
      },
      _count: true
    })

    // Get browser breakdown
    const clicksByBrowser = await db.click.groupBy({
      by: ['browser'],
      where: {
        userId,
        createdAt: { gte: monthAgo }
      },
      _count: true,
      orderBy: {
        _count: {
          browser: 'desc'
        }
      },
      take: 5
    })

    // Get country breakdown
    const clicksByCountry = await db.click.groupBy({
      by: ['country'],
      where: {
        userId,
        createdAt: { gte: monthAgo },
        country: { not: null }
      },
      _count: true,
      orderBy: {
        _count: {
          country: 'desc'
        }
      },
      take: 10
    })

    const analytics = {
      totalClicks,
      totalLinks,
      clicksThisMonth,
      monthlyGrowth,
      uniqueVisitors: uniqueVisitors.length,
      topLinks,
      clicksByDay: filledClicksByDay,
      clicksByDevice: clicksByDevice.map(item => ({
        device: item.deviceType || 'Unknown',
        clicks: item._count
      })),
      clicksByBrowser: clicksByBrowser.map(item => ({
        browser: item.browser || 'Unknown',
        clicks: item._count
      })),
      clicksByCountry: clicksByCountry.map(item => ({
        country: item.country || 'Unknown',
        clicks: item._count
      }))
    }

    res.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    next(error)
  }
})

export { router as analyticsRoutes }