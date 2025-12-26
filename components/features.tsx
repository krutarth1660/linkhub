'use client'

import { motion } from 'framer-motion'
import { 
  Palette, 
  BarChart3, 
  Globe, 
  QrCode, 
  Calendar, 
  Shield,
  Zap,
  Users
} from 'lucide-react'

const features = [
  {
    name: 'Custom Themes',
    description: 'Choose from multiple themes or create your own with custom colors and layouts.',
    icon: Palette,
    color: 'text-pink-600',
  },
  {
    name: 'Advanced Analytics',
    description: 'Track clicks, user devices, locations, and get insights into your audience.',
    icon: BarChart3,
    color: 'text-blue-600',
  },
  {
    name: 'Custom Domains',
    description: 'Use your own domain or get a free subdomain like username.linkhub.com.',
    icon: Globe,
    color: 'text-green-600',
  },
  {
    name: 'QR Codes',
    description: 'Generate QR codes for your profile to share offline and track scans.',
    icon: QrCode,
    color: 'text-purple-600',
  },
  {
    name: 'Scheduled Links',
    description: 'Schedule links to activate or deactivate at specific times.',
    icon: Calendar,
    color: 'text-orange-600',
  },
  {
    name: 'Secure & Fast',
    description: 'Built with security in mind and optimized for lightning-fast loading.',
    icon: Shield,
    color: 'text-red-600',
  },
  {
    name: 'Real-time Updates',
    description: 'See your analytics update in real-time as users interact with your links.',
    icon: Zap,
    color: 'text-yellow-600',
  },
  {
    name: 'Multi-tenant',
    description: 'Perfect for agencies managing multiple clients or personal brand building.',
    icon: Users,
    color: 'text-indigo-600',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful features for modern creators
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            LinkHub provides all the tools you need to create, manage, and analyze your link-in-bio page.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className={`h-5 w-5 flex-none ${feature.color}`} />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}