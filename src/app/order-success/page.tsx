'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')

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
