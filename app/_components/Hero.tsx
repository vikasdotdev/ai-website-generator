'use client'

import { Button } from '@/components/ui/button'
import { SignInButton, useUser } from '@clerk/nextjs'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
  const { isSignedIn } = useUser()

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-400/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_transparent_0%,_white_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Powered by Advanced AI
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Build Websites{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                with AI
              </span>{' '}
              in Seconds
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Generate, edit, and export full websites using AI — no coding required.
              From idea to live website in under 60 seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <SignInButton mode="modal" forceRedirectUrl="/workspace">
                <Link href="/workspace">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 gap-2 text-base px-8 py-6 rounded-xl"
                  >
                    Get Started Free <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </SignInButton>
              <a href="#showcase">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 text-base px-8 py-6 rounded-xl border-gray-300 hover:bg-gray-50"
                >
                  <Play className="h-4 w-4" /> View Demo
                </Button>
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'].map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">2,500+</span> websites built this month
              </div>
            </div>
          </div>

          {/* Right Side — Mock Editor Preview */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Glow behind */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-2xl scale-105" />

              {/* Editor Window */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Title Bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="inline-block px-8 py-1 bg-white rounded-md text-xs text-gray-400 border border-gray-200">
                      ai-website-builder.app
                    </div>
                  </div>
                </div>

                {/* Mock Editor Content */}
                <div className="flex h-72">
                  {/* Left sidebar mock */}
                  <div className="w-16 bg-gray-50 border-r border-gray-100 p-2 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-full aspect-square rounded-lg ${i === 0 ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-200'}`} />
                    ))}
                  </div>

                  {/* Main preview area */}
                  <div className="flex-1 p-4 space-y-3">
                    <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-3/4" />
                    <div className="h-2 bg-gray-200 rounded-full w-full" />
                    <div className="h-2 bg-gray-200 rounded-full w-5/6" />
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="aspect-video rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200" />
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <div className="h-8 px-4 rounded-lg bg-blue-500 w-24" />
                      <div className="h-8 px-4 rounded-lg bg-gray-200 w-20" />
                    </div>
                  </div>

                  {/* Right panel mock */}
                  <div className="w-36 bg-gray-50 border-l border-gray-100 p-3 space-y-2">
                    <div className="h-2 bg-gray-300 rounded w-full" />
                    <div className="h-6 bg-white border border-gray-200 rounded" />
                    <div className="h-2 bg-gray-300 rounded w-3/4 mt-3" />
                    <div className="h-6 bg-white border border-gray-200 rounded" />
                    <div className="h-2 bg-gray-300 rounded w-1/2 mt-3" />
                    <div className="flex gap-1">
                      <div className="h-6 w-6 rounded bg-blue-500" />
                      <div className="h-6 w-6 rounded bg-red-400" />
                      <div className="h-6 w-6 rounded bg-green-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Website Generated!</div>
                  <div className="text-xs text-gray-500">in 12 seconds</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
