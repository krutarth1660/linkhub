'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, Users, MousePointer } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatNumber } from '@/lib/utils'

interface AnalyticsOverviewProps {
  userId: string
}

export function AnalyticsOverview({ userId }: AnalyticsOverviewProps) {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics-overview', userId],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/overview?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Clicks',
      value: analytics?.totalClicks || 0,
      icon: MousePointer,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Active Links',
      value: analytics?.totalLinks || 0,
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'This Week',
      value: analytics?.clicksThisWeek || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Today',
      value: analytics?.clicksToday || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Analytics Overview</h2>
            <p className="text-sm text-gray-500 mt-1">
              Track your link performance and engagement
            </p>
          </div>
          <a
            href="/dashboard/analytics"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View detailed analytics →
          </a>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center">
                <div className={`rounded-md p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatNumber(stat.value)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {analytics?.topLinks && analytics.topLinks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Top Performing Links</h3>
            <div className="space-y-3">
              {analytics.topLinks.slice(0, 3).map((link: any) => (
                <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-lg mr-3">
                      {link.platform === 'github' && '🐙'}
                      {link.platform === 'youtube' && '📺'}
                      {link.platform === 'twitter' && '🐦'}
                      {link.platform === 'linkedin' && '💼'}
                      {link.platform === 'instagram' && '📷'}
                      {link.platform === 'tiktok' && '🎵'}
                      {link.platform === 'website' && '🌐'}
                      {link.platform === 'other' && '🔗'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{link.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{link.url}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatNumber(link._count.clicks)} clicks
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}