'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    checkUser()
  }, [router, supabase])

  // Mock orders - In production, fetch from database
  const orders = [
    { id: 'ORD-001', date: '2026-02-20', total: 350.00, status: 'Delivered', items: 3 },
    { id: 'ORD-002', date: '2026-02-18', total: 180.00, status: 'Processing', items: 2 }
  ]

  if (loading) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2c6e49] border-r-transparent"></div>
        <p className="mt-4">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items} items</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">GHS {order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link href="/shop" className="inline-block bg-[#2c6e49] text-white px-6 py-2 rounded-lg hover:bg-green-800 transition">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
