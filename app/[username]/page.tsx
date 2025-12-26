import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { PublicProfile } from '@/components/public-profile'
import { ClickTracker } from '@/components/click-tracker'

interface ProfilePageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const user = await db.user.findUnique({
    where: { username: params.username },
    select: {
      name: true,
      bio: true,
      image: true,
      username: true,
    }
  })

  if (!user) {
    return {
      title: 'Profile Not Found - LinkHub',
    }
  }

  return {
    title: `${user.name || user.username} - LinkHub`,
    description: user.bio || `Check out ${user.name || user.username}'s links`,
    openGraph: {
      title: `${user.name || user.username} - LinkHub`,
      description: user.bio || `Check out ${user.name || user.username}'s links`,
      images: user.image ? [{ url: user.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${user.name || user.username} - LinkHub`,
      description: user.bio || `Check out ${user.name || user.username}'s links`,
      images: user.image ? [user.image] : [],
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await db.user.findUnique({
    where: { username: params.username },
    include: {
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
        orderBy: { position: 'asc' }
      }
    }
  })

  if (!user) {
    notFound()
  }

  return (
    <>
      <PublicProfile user={user} />
      <ClickTracker userId={user.id} />
    </>
  )
}