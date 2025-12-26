import { z } from 'zod'

export const linkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  url: z.string().url('Invalid URL format'),
  description: z.string().max(200, 'Description too long').optional(),
  platform: z.enum(['github', 'youtube', 'twitter', 'linkedin', 'instagram', 'tiktok', 'website', 'other']),
  scheduledAt: z.date().optional(),
  expiresAt: z.date().optional(),
})

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  bio: z.string().max(160, 'Bio too long').optional(),
  theme: z.enum(['default', 'dark', 'minimal', 'colorful']),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
})

export const platformValidators = {
  github: (url: string) => url.includes('github.com'),
  youtube: (url: string) => url.includes('youtube.com') || url.includes('youtu.be'),
  twitter: (url: string) => url.includes('twitter.com') || url.includes('x.com'),
  linkedin: (url: string) => url.includes('linkedin.com'),
  instagram: (url: string) => url.includes('instagram.com'),
  tiktok: (url: string) => url.includes('tiktok.com'),
  website: () => true,
  other: () => true,
}

export type LinkFormData = z.infer<typeof linkSchema>
export type ProfileFormData = z.infer<typeof profileSchema>