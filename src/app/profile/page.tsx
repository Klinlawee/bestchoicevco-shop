'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login') } else { setUser(user) }
      setLoading(false)
    }
    getUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2c6e49] border-r-transparent"></div>
        <p className="mt-4">Loading...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-16 w-16 bg-[#2c6e49] rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.user_metadata?.full_name || 'User'}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="border-t pt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email verified</label>
            <p className="text-sm">
              {user.email_confirmed_at ? <span className="text-green-600">✓ Verified</span> : 
               <span className="text-yellow-600">Pending verification</span>}
            </p>
          </div>
          <div className="pt-4 flex space-x-4">
            <Link href="/orders" className="bg-[#2c6e49] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition">
              View Orders
            </Link>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
