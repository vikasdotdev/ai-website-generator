'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Messages } from '../[projectId]/page'
import { Button } from '@/components/ui/button'
import {
  ArrowUp,
  LayoutDashboard,
  Globe,
  Key,
  User,
  ShoppingCart,
  BarChart3,
} from 'lucide-react'

type Props = {
  messages: Messages[]
  onSend: (msg: string) => void
  loading: boolean
}

const TEMPLATE_PROMPTS = [
  {
    label: 'Dashboard',
    prompt:
      'Create a modern SaaS analytics dashboard with a sidebar navigation, top header with user profile, 4 KPI stat cards (revenue, users, orders, growth), a line chart for monthly revenue, a bar chart for weekly users, and a recent transactions table.',
    icon: LayoutDashboard,
    color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
  },
  {
    label: 'Landing Page',
    prompt:
      'Create a modern SaaS landing page with a hero section (gradient heading, subtitle, two CTA buttons), a features section with 6 icon cards, a how-it-works 3-step section, a pricing section with Free and Pro plans, testimonial cards, and a footer.',
    icon: Globe,
    color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
  },
  {
    label: 'Signup Form',
    prompt:
      'Create a modern signup/registration page with a split layout: left side with a brand message and illustration background, right side with a signup form containing name, email, password, confirm password fields, a terms checkbox, a "Sign Up" button, Google & GitHub social login buttons, and a login link.',
    icon: Key,
    color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
  },
  {
    label: 'Portfolio',
    prompt:
      'Create a personal portfolio website for a frontend developer with a hero section (name, tagline, profile picture, download CV button), an about section, a skills section with progress bars, a projects gallery with 6 project cards (image, title, description, live demo button), and a contact form.',
    icon: User,
    color: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
  },
  {
    label: 'E-Commerce',
    prompt:
      'Create a modern e-commerce product listing page with a top navigation bar (logo, search bar, cart icon), a hero banner, a category filter sidebar, a grid of 8 product cards (image, name, price, rating stars, add to cart button), and pagination.',
    icon: ShoppingCart,
    color: 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100',
  },
  {
    label: 'Admin Panel',
    prompt:
      'Create an admin panel with a dark sidebar navigation (Dashboard, Users, Products, Orders, Settings links), a top bar with search and notifications, 4 summary cards, a data table showing recent users with name, email, role columns, and action buttons (edit, delete).',
    icon: BarChart3,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100',
  },
]

const ChatSection = ({ messages, onSend, loading }: Props) => {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input)
    setInput('')
  }

  return (
    <div className="w-96 shadow h-[91vh] p-4 flex flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-5">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg text-gray-800">
                What would you like to build?
              </h3>
              <p className="text-sm text-gray-500">
                Describe your idea or pick a template below
              </p>
            </div>

            {/* Template Prompt Grid */}
            <div className="grid grid-cols-2 gap-2 w-full">
              {TEMPLATE_PROMPTS.map((template, index) => (
                <button
                  key={index}
                  onClick={() => onSend(template.prompt)}
                  disabled={loading}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs font-medium transition-all duration-200 ${template.color} disabled:opacity-50`}
                >
                  <template.icon className="h-4 w-4 shrink-0" />
                  {template.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-3 rounded-xl max-w-[85%] text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
            <span className="text-sm text-gray-600">Generating website...</span>
          </div>
        )}
      </div>

      <div className="p-3 border-t flex items-center gap-2">
        <textarea
          value={input}
          placeholder="Describe your website idea..."
          className="flex-1 resize-none border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          rows={1}
          onChange={e => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl"
          size="icon"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default ChatSection
