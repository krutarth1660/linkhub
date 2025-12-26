import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { linkSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = linkSchema.parse(body)

    // Get the next position
    const lastLink = await db.link.findFirst({
      where: { userId: session.user.id },
      orderBy: { position: 'desc' },
    })

    const position = (lastLink?.position || 0) + 1

    const link = await db.link.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        position,
      },
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const links = await db.link.findMany({
      where: { userId: session.user.id },
      orderBy: { position: 'asc' },
      include: {
        _count: {
          select: { clicks: true }
        }
      }
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    )
  }
}