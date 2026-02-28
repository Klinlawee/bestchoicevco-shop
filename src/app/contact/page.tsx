'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      // Replace with your actual form submission endpoint
      await fetch('https://formsubmit.co/ajax/bestchoicevirgincoconutoil@gmail.com', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions about our products? Want to place a bulk order? We'd love to hear from you.
          </p>
          <div className="space-y-4">
            <div><h3 className="font-semibold">📍 Address</h3><p className="text-gray-600">Accra, Ghana</p></div>
            <div><h3 className="font-semibold">📞 Phone</h3><p className="text-gray-600">+233 XX XXX XXXX</p></div>
            <div><h3 className="font-semibold">✉️ Email</h3><p className="text-gray-600">info@bestchoicevco.com</p></div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" id="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c6e49]" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" id="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c6e49]" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c6e49]" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea id="message" required rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c6e49]" />
            </div>
            <button type="submit" disabled={status === 'sending'}
              className="w-full bg-[#2c6e49] text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50">
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'success' && <div className="bg-green-100 text-green-700 p-3 rounded-lg">Message sent successfully!</div>}
            {status === 'error' && <div className="bg-red-100 text-red-700 p-3 rounded-lg">Failed to send message. Please try again.</div>}
          </form>
        </div>
      </div>
    </div>
  )
}
