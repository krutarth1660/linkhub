'use client'

import { useState } from 'react'
import { User, Link } from '@prisma/client'
import { Plus, GripVertical, Edit, Trash2, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LinkForm } from './link-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import toast from 'react-hot-toast'

interface LinkWithClicks extends Link {
  _count: {
    clicks: number
  }
}

interface LinkManagerProps {
  user: User & {
    links: LinkWithClicks[]
  }
}

interface SortableLinkItemProps {
  link: LinkWithClicks
  onEdit: (link: Link) => void
  onDelete: (linkId: string) => void
}

function SortableLinkItem({ link, onEdit, onDelete }: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      }`}
    >
      <div
        className="flex items-center cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="flex items-center ml-3 flex-1">
        <div className="text-2xl mr-3">
          {getPlatformIcon(link.platform)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {link.title}
            </h3>
            {!link.isActive && (
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                Inactive
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{link.url}</p>
          {link.description && (
            <p className="text-xs text-gray-400 truncate mt-1">
              {link.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 ml-4">
        <div className="text-sm text-gray-500">
          {link._count.clicks} clicks
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => window.open(link.url, '_blank')}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onEdit(link)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete(link.id)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function LinkManager({ user }: LinkManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [links, setLinks] = useState(user.links)
  const queryClient = useQueryClient()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const deleteLink = useMutation({
    mutationFn: async (linkId: string) => {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete link')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-links'] })
      toast.success('Link deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete link')
    },
  })

  const reorderLinks = useMutation({
    mutationFn: async (reorderedLinks: { id: string; position: number }[]) => {
      const response = await fetch('/api/links/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: reorderedLinks }),
      })
      if (!response.ok) throw new Error('Failed to reorder links')
      return response.json()
    },
    onError: () => {
      toast.error('Failed to reorder links')
      // Revert optimistic update
      setLinks(user.links)
    },
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id)
      const newIndex = links.findIndex((link) => link.id === over.id)

      const newLinks = arrayMove(links, oldIndex, newIndex)
      
      // Optimistic update
      setLinks(newLinks)

      // Update positions and send to server
      const reorderedLinks = newLinks.map((link, index) => ({
        id: link.id,
        position: index + 1,
      }))

      reorderLinks.mutate(reorderedLinks)
    }
  }

  const handleEdit = (link: Link) => {
    setEditingLink(link)
    setShowForm(true)
  }

  const handleDelete = async (linkId: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      deleteLink.mutate(linkId)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your Links</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and organize your links. Drag to reorder.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingLink(null)
              setShowForm(true)
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </button>
        </div>
      </div>

      <div className="p-6">
        {links.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
            <p className="text-gray-500 mb-6">
              Add your first link to get started with your profile
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Link
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={links.map(link => link.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                <AnimatePresence>
                  {links.map((link) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      layout
                    >
                      <SortableLinkItem
                        link={link}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {showForm && (
        <LinkForm
          link={editingLink}
          onClose={() => {
            setShowForm(false)
            setEditingLink(null)
          }}
          userId={user.id}
        />
      )}
    </div>
  )
}