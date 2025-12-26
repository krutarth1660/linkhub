import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session.user.id

    // Verify user can access this data
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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

    // Get clicks by day for the last 30 days
    const clicksByDay = await db.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as clicks
      FROM "Click"
      WHERE user_id = ${userId}
        AND created_at >= ${monthAgo}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    ` as { date: Date; clicks: bigint }[]

    // Get device breakdown
    const clicksByDevice = await db.click.groupBy({
      by: ['device'],
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
      _count: true
    })

    const analytics = {
      totalClicks,
      totalLinks,
      clicksToday,
      clicksThisWeek,
      clicksThisMonth,
      topLinks,
      clicksByDay: clicksByDay.map(item => ({
        date: item.date.toISOString().split('T')[0],
        clicks: Number(item.clicks)
      })),
      clicksByDevice: clicksByDevice.map(item => ({
        device: item.device || 'Unknown',
        clicks: item._count
      })),
      clicksByBrowser: clicksByBrowser.map(item => ({
        browser: item.browser || 'Unknown',
        clicks: item._count
      }))
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}