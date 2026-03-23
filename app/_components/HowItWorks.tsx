import { PenLine, Wand2, Download } from 'lucide-react'
import React from 'react'

const STEPS = [
  {
    step: '01',
    icon: PenLine,
    title: 'Describe Your Idea',
    description: 'Type a simple description of the website you want — a landing page, portfolio, dashboard, or anything else.',
    color: 'blue',
  },
  {
    step: '02',
    icon: Wand2,
    title: 'AI Generates Your Website',
    description: 'Our AI instantly creates a fully responsive, beautifully designed website with modern UI components.',
    color: 'indigo',
  },
  {
    step: '03',
    icon: Download,
    title: 'Customize & Export',
    description: 'Fine-tune every detail with our visual editor, then export the clean code or deploy it with one click.',
    color: 'purple',
  },
]

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', gradient: 'from-purple-500 to-purple-600' },
}

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4">
            How It Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Three Steps to Your{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Dream Website
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            From idea to live website in under 60 seconds. No coding, no hassle.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, index) => {
            const colors = COLOR_MAP[step.color]
            return (
              <div key={index} className="relative text-center group">
                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-gray-200 to-gray-100" />
                )}

                {/* Step Number */}
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br ${colors.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <step.icon className="h-10 w-10" />
                </div>

                {/* Step label */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-xs font-bold uppercase tracking-wider mb-3`}>
                  Step {step.step}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
