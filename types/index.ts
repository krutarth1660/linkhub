import { User, Link, Click } from '@prisma/client'

export type UserWithLinks = User & {
  links: Link[]
}

export type LinkWithClicks = Link & {
  clicks: Click[]
  _count: {
    clicks: number
  }
}

export type AnalyticsData = {
  totalClicks: number
  totalLinks: number
  clicksToday: number
  clicksThisWeek: number
  clicksThisMonth: number
  topLinks: LinkWithClicks[]
  clicksByDay: { date: string; clicks: number }[]
  clicksByDevice: { device: string; clicks: number }[]
  clicksByBrowser: { browser: string; clicks: number }[]
  clicksByCountry: { country: string; clicks: number }[]
}

export type Theme = 'default' | 'dark' | 'minimal' | 'colorful'

export type Platform = 'github' | 'youtube' | 'twitter' | 'linkedin' | 'instagram' | 'tiktok' | 'website' | 'other'

export interface PlatformConfig {
  name: string
  icon: string
  color: string
  validator: (url: string) => boolean
}

export interface ThemeConfig {
  name: string
  background: string
  card: string
  text: string
  accent: string
}