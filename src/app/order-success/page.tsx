'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    // Get order details from localStorage and send email
    const sendConfirmationEmail = async () => {
      if (!reference || emailSent) return

      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      if (cart.length > 0 && user.email) {
        try {
          await fetch('/api/order-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderDetails: cart,
              customerEmail: user.email,
              customerName: user.name || user.email,
              orderTotal: cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toFixed(2),
              reference: reference
            })
          })
          setEmailSent(true)
        } catch (error) {
          console.error('Failed to send confirmation email:', error)
        }
      }
    }

    sendConfirmationEmail()
  }, [reference, emailSent])

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg text-gray-600 mb-6">Thank you for your order. Your payment reference is:</p>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <p className="font-mono text-lg">{reference || 'N/A'}</p>
      </div>
      
      {emailSent && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
          <p className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Confirmation email sent to your inbox!
          </p>
        </div>
      )}
      
      <p className="text-gray-600 mb-8">
        We've sent a confirmation email with your order details. You'll receive a notification when your order is ready for delivery.
      </p>
      
      <div className="space-x-4">
        <Link href="/shop" className="inline-block bg-[#2c6e49] text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
          Continue Shopping
        </Link>
        <Link href="/" className="inline-block border-2 border-[#2c6e49] text-[#2c6e49] px-8 py-3 rounded-lg font-semibold hover:bg-[#2c6e49] hover:text-white transition">
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="container-custom py-12 min-h-screen flex items-center justify-center">
      <Suspense fallback={
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2c6e49] border-r-transparent"></div>
          <p className="mt-4">Loading...</p>
        </div>
      }>
        <OrderSuccessContent />
      </Suspense>
    </div>
  )
}
