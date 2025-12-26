'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { User } from '@prisma/client'
import { 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ExternalLink,
  Copy
} from 'lucide-react'
import Link from 'next/link'
import { copyToClipboard } from '@/lib/utils'

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${user.username}`

  const handleCopyProfile = async () => {
    const success = await copyToClipboard(profileUrl)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              LinkHub
            </Link>
            <div className="hidden sm:block ml-6">
              <span className="text-sm text-gray-500">Welcome back, </span>
              <span className="text-sm font-medium text-gray-900">{user.name}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleCopyProfile}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Profile'}
            </button>
            
            <Link
              href={`/${user.username}`}
              target="_blank"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Profile
            </Link>
            
            <Link
              href="/dashboard/analytics"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
            
            <Link
              href="/dashboard/settings"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
            
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <button
                onClick={handleCopyProfile}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Copied!' : 'Copy Profile'}
              </button>
              
              <Link
                href={`/${user.username}`}
                target="_blank"
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Profile
              </Link>
              
              <Link
                href="/dashboard/analytics"
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
              
              <Link
                href="/dashboard/settings"
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
              
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}