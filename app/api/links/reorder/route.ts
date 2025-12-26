import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const reorderSchema = z.object({
  links: z.array(z.object({
    id: z.string(),
    position: z.number(),
  }))
})

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { links } = reorderSchema.parse(body)

    // Verify all links belong to the user
    const userLinks = await db.link.findMany({
      where: {
        userId: session.user.id,
        id: { in: links.map(l => l.id) }
      }
    })

    if (userLinks.length !== links.length) {
      return NextResponse.json({ error: 'Invalid links' }, { status: 400 })
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering links:', error)
    return NextResponse.json(
      { error: 'Failed to reorder links' },
      { status: 500 }
    )
  }
}