'use client'

import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'
import { ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <>
      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(255,255,255,0.08)_0%,_transparent_40%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            No credit card required
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Start Building Your Website Today
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who are building stunning websites with AI. From idea to live site in seconds.
          </p>
          <SignInButton mode="modal" forceRedirectUrl="/workspace">
            <Link href="/workspace">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-2xl shadow-black/20 gap-2 text-lg px-10 py-7 rounded-xl font-semibold"
              >
                Try for Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </SignInButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/logo.svg" alt="logo" width={28} height={28} className="brightness-200" />
                <span className="font-bold text-lg text-white">AI Website Builder</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                The fastest way to build beautiful, responsive websites. Powered by advanced AI technology.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#showcase" className="hover:text-white transition-colors">Showcase</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs">
              &copy; {new Date().getFullYear()} AI Website Builder. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Twitter</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">GitHub</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
