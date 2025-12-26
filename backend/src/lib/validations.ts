import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const linkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  url: z.string().url('Invalid URL format'),
  description: z.string().max(200, 'Description too long').optional(),
  platform: z.enum(['github', 'youtube', 'twitter', 'linkedin', 'instagram', 'tiktok', 'website', 'other']),
  scheduledAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
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

export const reorderLinksSchema = z.object({
  links: z.array(z.object({
    id: z.string(),
    position: z.number(),
  }))
})

export type SignupData = z.infer<typeof signupSchema>
export type LoginData = z.infer<typeof loginSchema>
export type LinkData = z.infer<typeof linkSchema>
export type ProfileData = z.infer<typeof profileSchema>
export type ReorderLinksData = z.infer<typeof reorderLinksSchema>