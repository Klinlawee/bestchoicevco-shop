'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface CartItem {
  id: string; name: string; price: number; size: string; quantity: number
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', address: '', city: ''
  })
  const router = useRouter()

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const items = JSON.parse(savedCart)
      setCart(items)
      setCartTotal(items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0))
    }
  }, [])

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
    
    script.onerror = () => {
      alert('Failed to load payment gateway. Please try again.')
      setProcessing(false)
    }
    
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

  if (cart.length === 0) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/shop" className="text-[#2c6e49] hover:underline">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
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
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                  <span>{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                  <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>GHS {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-start">
                <span>Delivery</span>
                <span className="text-sm text-gray-600 text-right max-w-[180px]">
                  Our delivery team will contact you with the fee
                </span>
              </div>
              <div className="border-t pt-2 font-bold flex justify-between text-lg">
                <span>Total (excluding delivery)</span>
                <span>GHS {cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 flex items-center">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Delivery fee will be confirmed by our team after order placement</span>
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">Secured by Paystack. Your payment information is encrypted.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
