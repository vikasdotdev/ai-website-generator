import { Star } from 'lucide-react'
import React from 'react'

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Freelance Designer',
    feedback:
      'This tool is unbelievable. I built a complete portfolio site for my client in under 5 minutes. The visual editor makes it feel like using Figma — but it writes real code.',
    avatar: 'P',
    color: 'bg-purple-500',
  },
  {
    name: 'Rahul Mehta',
    role: 'Startup Founder',
    feedback:
      'We used this to prototype our SaaS landing page before our funding pitch. The AI understood exactly what we needed and the export code was clean enough to ship.',
    avatar: 'R',
    color: 'bg-blue-500',
  },
  {
    name: 'Ananya Rao',
    role: 'Computer Science Student',
    feedback:
      'As a CS student, I used this for my final year project demo. The responsive preview and one-click export made my presentation stand out. My professor was genuinely impressed.',
    avatar: 'A',
    color: 'bg-green-500',
  },
]

const Testimonials = () => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-semibold uppercase tracking-wider mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Loved by{' '}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Builders
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            See what people are saying about building with AI.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Feedback */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                &ldquo;{t.feedback}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
