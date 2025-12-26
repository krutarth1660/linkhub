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

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching detailed analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}