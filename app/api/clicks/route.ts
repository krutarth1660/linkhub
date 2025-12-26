import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { parseUserAgent } from '@/lib/utils'
import geoip from 'geoip-lite'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { linkId, userId } = body

    // Get user agent and IP
    const userAgent = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'

    // Parse user agent
    const { browser, os, device } = parseUserAgent(userAgent)

    // Get location from IP
    const geo = geoip.lookup(ip !== '127.0.0.1' ? ip : null)

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
        referrer: request.headers.get('referer') || null,
      },
    })

    // Increment link click count
    await db.link.update({
      where: { id: linkId },
      data: { clickCount: { increment: 1 } }
    })

    return NextResponse.json({ success: true, clickId: click.id })
  } catch (error) {
    console.error('Error tracking click:', error)
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    )
  }
}