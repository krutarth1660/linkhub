import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { DashboardHeader } from '@/components/dashboard/header'
import { LinkManager } from '@/components/dashboard/link-manager'
import { ProfilePreview } from '@/components/dashboard/profile-preview'
import { AnalyticsOverview } from '@/components/dashboard/analytics-overview'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
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
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AnalyticsOverview userId={user.id} />
            <LinkManager user={user} />
          </div>
          
          <div className="lg:col-span-1">
            <ProfilePreview user={user} />
          </div>
        </div>
      </main>
    </div>
  )
}