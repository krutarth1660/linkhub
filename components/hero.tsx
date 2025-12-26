'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Link as LinkIcon, BarChart3, Smartphone } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your links, your brand,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                your analytics
              </span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Create a beautiful, customizable link-in-bio page with powerful analytics. 
              Track clicks, understand your audience, and grow your online presence.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signin"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex items-center gap-2"
              >
                Get started for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                href="#features"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 flow-root sm:mt-24"
        >
          <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
                <LinkIcon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900">Link Management</h3>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Organize and customize your links with drag-and-drop reordering
                </p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
                <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Track clicks, devices, and user behavior with detailed insights
                </p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
                <Smartphone className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="font-semibold text-gray-900">Mobile Optimized</h3>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Beautiful, responsive design that works perfectly on all devices
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}