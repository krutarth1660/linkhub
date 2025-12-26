'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, Users, MousePointer, Globe, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatNumber } from '@/lib/utils'

interface AnalyticsDashboardProps {
  userId: string
}

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics-detailed', userId],
    queryFn: async () => {
      const response = await fetch(`/api/analytics/detailed?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
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
      change: analytics?.clicksGrowth || 0,
    },
    {
      name: 'Active Links',
      value: analytics?.totalLinks || 0,
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'This Month',
      value: analytics?.clicksThisMonth || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: analytics?.monthlyGrowth || 0,
    },
    {
      name: 'Unique Visitors',
      value: analytics?.uniqueVisitors || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`rounded-md p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatNumber(stat.value)}
                  </p>
                  {stat.change !== undefined && (
                    <span className={`ml-2 text-sm ${
                      stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change >= 0 ? '+' : ''}{stat.change}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clicks Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clicks Over Time</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics?.clicksByDay?.slice(-14).map((day: any, index: number) => (
              <div key={day.date} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 rounded-t w-full transition-all hover:bg-blue-600"
                  style={{
                    height: `${Math.max((day.clicks / Math.max(...analytics.clicksByDay.map((d: any) => d.clicks))) * 200, 4)}px`
                  }}
                  title={`${day.date}: ${day.clicks} clicks`}
                />
                <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Links</h3>
          <div className="space-y-4">
            {analytics?.topLinks?.slice(0, 5).map((link: any, index: number) => (
              <div key={link.id} className="flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0">
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
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{link.title}</p>
                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                  </div>
                </div>
                <div className="ml-4 flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {formatNumber(link._count.clicks)}
                  </span>
                  <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(link._count.clicks / Math.max(...analytics.topLinks.map((l: any) => l._count.clicks))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
          <div className="space-y-4">
            {analytics?.clicksByDevice?.map((device: any, index: number) => {
              const percentage = (device.clicks / analytics.totalClicks) * 100
              return (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {device.device || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {formatNumber(device.clicks)} ({percentage.toFixed(1)}%)
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Geographic Data */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h3>
          <div className="space-y-4">
            {analytics?.clicksByCountry?.slice(0, 5).map((country: any, index: number) => {
              const percentage = (country.clicks / analytics.totalClicks) * 100
              return (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {country.country || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {formatNumber(country.clicks)} ({percentage.toFixed(1)}%)
                    </span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}