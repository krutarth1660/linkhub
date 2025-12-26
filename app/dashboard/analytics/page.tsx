import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { DashboardHeader } from '@/components/dashboard/header'
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard'

export default async function AnalyticsPage() {
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Detailed insights into your link performance and audience engagement
          </p>
        </div>
        
        <AnalyticsDashboard userId={user.id} />
      </main>
    </div>
  )
}