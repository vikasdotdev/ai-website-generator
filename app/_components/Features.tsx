import {
  Wand2,
  Paintbrush,
  Monitor,
  Code2,
  MessageSquare,
  LayoutTemplate,
} from 'lucide-react'
import React from 'react'

const FEATURES = [
  {
    icon: Wand2,
    title: 'AI Website Generation',
    description: 'Describe your idea in plain English and watch AI build a complete, responsive website for you instantly.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Paintbrush,
    title: 'Visual Editor',
    description: 'Click any element and customize colors, fonts, spacing, and effects — all without writing a single line of code.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Monitor,
    title: 'Responsive Preview',
    description: 'Toggle between desktop, tablet, and mobile views to see how your website looks on every screen size.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Code2,
    title: 'Export Code',
    description: 'Download production-ready HTML, CSS, and JavaScript code or copy it to your clipboard with one click.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat Refinement',
    description: 'Chat with AI to iteratively refine your design — ask for changes and see them applied in real-time.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: LayoutTemplate,
    title: 'Template Support',
    description: 'Start from professionally designed templates for portfolios, landing pages, dashboards, and more.',
    gradient: 'from-pink-500 to-rose-500',
  },
]

const Features = () => {
  return (
    <section id="features" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-4">
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Build Fast
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            A complete toolkit for creating stunning websites without any technical knowledge.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
