'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CheckoutFormProps {
  cart: any[]
  cartTotal: number
}

export default function CheckoutForm({ cart, cartTotal }: CheckoutFormProps) {
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', address: '', city: '' })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePaystackPayment = () => {
    setProcessing(true)
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => {
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: 'pk_live_3000a33ee1120ec8117bf39c9451e48f1befc7a4',
        email: formData.email,
        amount: Math.round(cartTotal * 100),
        currency: 'GHS',
        ref: 'VCO-' + Math.floor((Math.random() * 1000000000) + 1),
        metadata: {
          custom_fields: [
            { display_name: "Customer Name", variable_name: "customer_name", value: formData.fullName },
            { display_name: "Phone Number", variable_name: "phone_number", value: formData.phone },
            { display_name: "Delivery Address", variable_name: "delivery_address", value: `${formData.address}, ${formData.city}` }
          ]
        },
        callback: (response: any) => {
          localStorage.removeItem('cart')
          router.push('/order-success?reference=' + response.reference)
        },
        onClose: () => setProcessing(false)
      })
      handler.openIframe()
    }
    script.onerror = () => { alert('Failed to load payment gateway.'); setProcessing(false) }
    document.body.appendChild(script)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill in all fields')
      return
    }
    handlePaystackPayment()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input type="text" id="fullName" name="fullName" required value={formData.fullName} onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c6e49]" placeholder="John Doe" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c6e49]" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c6e49]" placeholder="+233 XX XXX XXXX" />
          </div>
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
          <input type="text" id="address" name="address" required value={formData.address} onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c6e49]" placeholder="Street address, landmark" />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input type="text" id="city" name="city" required value={formData.city} onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c6e49]" placeholder="Accra" />
        </div>
      </div>
      <div className="mt-6">
        <button type="submit" disabled={processing}
          className="w-full bg-[#2c6e49] text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50">
          {processing ? 'Processing...' : `Pay GHS ${cartTotal.toFixed(2)} with Paystack`}
        </button>
      </div>
    </form>
  )
}
