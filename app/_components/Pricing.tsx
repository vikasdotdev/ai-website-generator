'use client'

import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/nextjs'
import { Check, Zap } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out AI website generation',
    credits: '2 AI Credits',
    features: [
      'AI Website Generation',
      'Visual Editor',
      'Responsive Preview',
      'Code Export (HTML/CSS)',
      'Chat Refinement',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For professionals and teams who build frequently',
    credits: 'Unlimited Credits',
    features: [
      'Everything in Free',
      'Unlimited AI Generations',
      'Priority AI Model',
      'Template Library Access',
      'Custom Domain Deploy',
      'Priority Support',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
]

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold uppercase tracking-wider mb-4">
            Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple,{' '}
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Transparent
            </span>{' '}
            Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Start building for free. Upgrade when you need more power.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-blue-600 to-indigo-700 border-blue-500 text-white shadow-2xl shadow-blue-500/25 scale-105'
                  : 'bg-white border-gray-200 shadow-sm hover:shadow-lg'
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold uppercase shadow-lg">
                    <Zap className="h-3.5 w-3.5" /> Most Popular
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.highlighted ? 'text-blue-200' : 'text-gray-500'}`}>
                  {plan.period}
                </span>
              </div>

              {/* Credits badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 ${
                  plan.highlighted
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-50 text-blue-600'
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                {plan.credits}
              </div>

              {/* Features list */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check
                      className={`h-4 w-4 shrink-0 ${
                        plan.highlighted ? 'text-blue-200' : 'text-green-500'
                      }`}
                    />
                    <span className={`text-sm ${plan.highlighted ? 'text-blue-50' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <SignInButton mode="modal" forceRedirectUrl="/workspace">
                <Link href="/workspace">
                  <Button
                    className={`w-full py-6 text-base rounded-xl ${
                      plan.highlighted
                        ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </SignInButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
