'use client'

import { User, Link } from '@prisma/client'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface PublicProfileProps {
  user: User & {
    links: Link[]
  }
}

export function PublicProfile({ user }: PublicProfileProps) {
  const getThemeStyles = (theme: string) => {
    const themes = {
      default: {
        background: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
        card: 'bg-white/80 backdrop-blur-sm',
        text: 'text-gray-900',
        accent: 'bg-blue-600 hover:bg-blue-700',
        border: 'border-gray-200/50',
      },
      dark: {
        background: 'bg-gradient-to-br from-gray-900 via-black to-gray-800',
        card: 'bg-gray-800/80 backdrop-blur-sm',
        text: 'text-white',
        accent: 'bg-purple-600 hover:bg-purple-700',
        border: 'border-gray-700/50',
      },
      minimal: {
        background: 'bg-gray-50',
        card: 'bg-white',
        text: 'text-gray-900',
        accent: 'bg-gray-900 hover:bg-gray-800',
        border: 'border-gray-200',
      },
      colorful: {
        background: 'bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 animate-gradient',
        card: 'bg-white/90 backdrop-blur-sm',
        text: 'text-gray-900',
        accent: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700',
        border: 'border-white/50',
      },
    }
    return themes[theme as keyof typeof themes] || themes.default
  }

  const themeStyles = getThemeStyles(user.theme)

  const handleLinkClick = async (link: Link) => {
    // Track click
    try {
      await fetch('/api/clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkId: link.id,
          userId: user.id,
        }),
      })
    } catch (error) {
      console.error('Failed to track click:', error)
    }

    // Open link
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      github: '🐙',
      youtube: '📺',
      twitter: '🐦',
      linkedin: '💼',
      instagram: '📷',
      tiktok: '🎵',
      website: '🌐',
      other: '🔗',
    }
    return icons[platform] || '🔗'
  }

  return (
    <div className={`min-h-screen ${themeStyles.background}`}>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-2xl ${themeStyles.card} ${themeStyles.text}`}>
                {user.name?.charAt(0) || '?'}
              </div>
            )}
          </div>

          {/* Name & Bio */}
          <h1 className={`text-2xl font-bold mb-2 ${themeStyles.text}`}>
            {user.name || user.username}
          </h1>
          {user.bio && (
            <p className={`text-sm mb-6 ${themeStyles.text} opacity-80 max-w-xs mx-auto`}>
              {user.bio}
            </p>
          )}
        </motion.div>

        {/* Links */}
        <div className="space-y-4">
          {user.links.map((link, index) => (
            <motion.button
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLinkClick(link)}
              className={`w-full ${themeStyles.card} ${themeStyles.border} rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border`}
            >
              <div className="flex items-center">
                <div className="text-2xl mr-4">
                  {getPlatformIcon(link.platform)}
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-semibold ${themeStyles.text}`}>
                    {link.title}
                  </div>
                  {link.description && (
                    <div className={`text-sm ${themeStyles.text} opacity-70 mt-1`}>
                      {link.description}
                    </div>
                  )}
                </div>
                <ExternalLink className={`h-5 w-5 ${themeStyles.text} opacity-50`} />
              </div>
            </motion.button>
          ))}

          {user.links.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${themeStyles.card} rounded-xl p-8 text-center ${themeStyles.border} border`}
            >
              <div className="text-4xl mb-4">🔗</div>
              <p className={`${themeStyles.text} opacity-60`}>
                No links available yet
              </p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 pt-8 border-t border-gray-200/30"
        >
          <p className={`text-xs ${themeStyles.text} opacity-40`}>
            Powered by{' '}
            <a
              href="/"
              className="hover:opacity-60 transition-opacity"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkHub
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}