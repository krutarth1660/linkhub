'use client'

import { useState } from 'react'
import { User, Link } from '@prisma/client'
import { Smartphone, Copy, QrCode, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { copyToClipboard } from '@/lib/utils'
import QRCodeGenerator from 'qrcode'

interface ProfilePreviewProps {
  user: User & {
    links: Link[]
  }
}

export function ProfilePreview({ user }: ProfilePreviewProps) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [qrCode, setQrCode] = useState<string>('')

  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${user.username}`

  const handleCopyProfile = async () => {
    const success = await copyToClipboard(profileUrl)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const generateQRCode = async () => {
    try {
      const qr = await QRCodeGenerator.toDataURL(profileUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCode(qr)
      setShowQR(true)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const getThemeStyles = (theme: string) => {
    const themes = {
      default: {
        background: 'bg-gradient-to-br from-blue-50 to-purple-50',
        card: 'bg-white',
        text: 'text-gray-900',
        accent: 'bg-blue-600',
      },
      dark: {
        background: 'bg-gradient-to-br from-gray-900 to-black',
        card: 'bg-gray-800',
        text: 'text-white',
        accent: 'bg-purple-600',
      },
      minimal: {
        background: 'bg-gray-50',
        card: 'bg-white',
        text: 'text-gray-900',
        accent: 'bg-gray-900',
      },
      colorful: {
        background: 'bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100',
        card: 'bg-white/80 backdrop-blur-sm',
        text: 'text-gray-900',
        accent: 'bg-gradient-to-r from-pink-500 to-purple-600',
      },
    }
    return themes[theme as keyof typeof themes] || themes.default
  }

  const themeStyles = getThemeStyles(user.theme)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Smartphone className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={generateQRCode}
              className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
              title="Generate QR Code"
            >
              <QrCode className="h-4 w-4" />
            </button>
            <button
              onClick={handleCopyProfile}
              className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
              title="Copy Profile URL"
            >
              <Copy className="h-4 w-4" />
            </button>
            <a
              href={`/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
              title="Open Profile"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-green-600"
          >
            Profile URL copied to clipboard!
          </motion.div>
        )}
      </div>

      <div className="p-6">
        {/* Mobile Mockup */}
        <div className="mx-auto max-w-sm">
          <div className="relative">
            {/* Phone Frame */}
            <div className="bg-gray-900 rounded-[2.5rem] p-2">
              <div className="bg-black rounded-[2rem] p-1">
                <div className={`rounded-[1.75rem] min-h-[600px] overflow-hidden ${themeStyles.background}`}>
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 py-2 text-xs text-gray-600">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 bg-gray-600 rounded-sm"></div>
                      <div className="w-6 h-2 bg-gray-600 rounded-sm"></div>
                    </div>
                  </div>

                  {/* Profile Content */}
                  <div className="px-6 py-8 text-center">
                    {/* Avatar */}
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-300 overflow-hidden">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || 'Profile'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl text-gray-600">
                          {user.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>

                    {/* Name & Bio */}
                    <h1 className={`text-xl font-bold mb-2 ${themeStyles.text}`}>
                      {user.name || 'Your Name'}
                    </h1>
                    {user.bio && (
                      <p className={`text-sm mb-6 ${themeStyles.text} opacity-80`}>
                        {user.bio}
                      </p>
                    )}

                    {/* Links */}
                    <div className="space-y-3">
                      {user.links.filter(link => link.isActive).map((link) => (
                        <motion.div
                          key={link.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`${themeStyles.card} rounded-lg p-4 shadow-sm border border-gray-200/50 cursor-pointer transition-all hover:shadow-md`}
                        >
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
                            <div className="flex-1 text-left">
                              <div className={`font-medium ${themeStyles.text}`}>
                                {link.title}
                              </div>
                              {link.description && (
                                <div className={`text-xs ${themeStyles.text} opacity-60 mt-1`}>
                                  {link.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {user.links.filter(link => link.isActive).length === 0 && (
                        <div className={`${themeStyles.card} rounded-lg p-8 text-center`}>
                          <div className="text-4xl mb-2">🔗</div>
                          <p className={`text-sm ${themeStyles.text} opacity-60`}>
                            No active links yet
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-4 border-t border-gray-200/50">
                      <p className={`text-xs ${themeStyles.text} opacity-40`}>
                        Powered by LinkHub
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile QR Code
              </h3>
              {qrCode && (
                <img
                  src={qrCode}
                  alt="Profile QR Code"
                  className="mx-auto mb-4"
                />
              )}
              <p className="text-sm text-gray-600 mb-4">
                Scan to visit your profile
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}