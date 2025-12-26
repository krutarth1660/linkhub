import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, userAgent, referrer } = body

    // Get IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Store page view in Redis for real-time analytics
    const pageViewKey = `pageview:${userId}:${Date.now()}`
    await redis.setex(pageViewKey, 86400, JSON.stringify({
      userId,
      userAgent,
      referrer,
      ip,
      timestamp: new Date().toISOString(),
    }))

    // Increment daily page view counter
    const today = new Date().toISOString().split('T')[0]
    const dailyKey = `pageviews:${userId}:${today}`
    await redis.incr(dailyKey)
    await redis.expire(dailyKey, 86400 * 30) // Keep for 30 days

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking page view:', error)
    return NextResponse.json(
      { error: 'Failed to track page view' },
      { status: 500 }
    )
  }
}