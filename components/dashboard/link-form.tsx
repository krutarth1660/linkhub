'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from '@prisma/client'
import { X, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { linkSchema, platformValidators, type LinkFormData } from '@/lib/validations'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface LinkFormProps {
  link?: Link | null
  onClose: () => void
  userId: string
}

export function LinkForm({ link, onClose, userId }: LinkFormProps) {
  const [showScheduling, setShowScheduling] = useState(false)
  const queryClient = useQueryClient()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LinkFormData>({
    defaultValues: link ? {
      title: link.title,
      url: link.url,
      description: link.description || '',
      platform: link.platform as any,
      scheduledAt: link.scheduledAt || undefined,
      expiresAt: link.expiresAt || undefined,
    } : {
      platform: 'website',
    }
  })

  const selectedPlatform = watch('platform')
  const selectedUrl = watch('url')

  const saveLinkMutation = useMutation({
    mutationFn: async (data: LinkFormData) => {
      const url = link ? `/api/links/${link.id}` : '/api/links'
      const method = link ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save link')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-links'] })
      onClose()
    },
  })

  const onSubmit = (data: LinkFormData) => {
    // Validate platform-specific URL
    if (selectedPlatform && selectedUrl) {
      const validator = platformValidators[selectedPlatform]
      if (validator && !validator(selectedUrl)) {
        return // Show error in UI
      }
    }
    
    saveLinkMutation.mutate(data)
  }

  const platforms = [
    { value: 'github', label: 'GitHub', icon: '🐙' },
    { value: 'youtube', label: 'YouTube', icon: '📺' },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { value: 'instagram', label: 'Instagram', icon: '📷' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'website', label: 'Website', icon: '🌐' },
    { value: 'other', label: 'Other', icon: '🔗' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {link ? 'Edit Link' : 'Add New Link'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <div className="grid grid-cols-4 gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => setValue('platform', platform.value as any)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    selectedPlatform === platform.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">{platform.icon}</div>
                  <div className="text-xs font-medium">{platform.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="My awesome link"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL *
            </label>
            <input
              {...register('url', { required: 'URL is required' })}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
            {errors.url && (
              <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
            )}
            {selectedPlatform && selectedUrl && !platformValidators[selectedPlatform]?.(selectedUrl) && (
              <p className="mt-1 text-sm text-orange-600">
                This URL doesn't match the selected platform
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional description for your link"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowScheduling(!showScheduling)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {showScheduling ? 'Hide' : 'Show'} scheduling options
            </button>
          </div>

          {showScheduling && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border-t border-gray-200 pt-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Schedule activation
                </label>
                <input
                  {...register('scheduledAt')}
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Expiration date
                </label>
                <input
                  {...register('expiresAt')}
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : link ? 'Update Link' : 'Add Link'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}