'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { EnrollMFA } from '@/components/auth/EnrollMFA'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showMFA, setShowMFA] = useState(false)
  const [mfaEnrolled, setMfaEnrolled] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const hasChecked = useRef(false) // Prevent double checking

  useEffect(() => {
    // Prevent multiple checks
    if (hasChecked.current) return
    hasChecked.current = true

    const getUser = async () => {
      try {
        console.log('🔍 Profile: Checking user...')
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('❌ Profile: Error getting user:', error)
          router.push('/login')
          return
        }
        
        if (!user) {
          console.log('❌ Profile: No user found')
          router.push('/login')
          return
        }
        
        console.log('✅ Profile: User found:', user.email)
        setUser(user)
        
        // Check MFA status
        const { data: mfaData } = await supabase.auth.mfa.listFactors()
        setMfaEnrolled(mfaData?.all?.some(f => f.status === 'verified') || false)
      } catch (err) {
        console.error('❌ Profile: Error:', err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router, supabase]) // No dependencies that change

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
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

  if (showMFA) {
    return (
      <div className="container-custom py-12">
        <EnrollMFA 
          onEnrolled={() => {
            setShowMFA(false)
            setMfaEnrolled(true)
          }}
          onCancelled={() => setShowMFA(false)}
        />
      </div>
    )
  }

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
              {user.email_confirmed_at ? (
                <span className="text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  ✓ Verified
                </span>
              ) : (
                <span className="text-yellow-600">Pending verification</span>
              )}
            </p>
          </div>
          
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Two-Factor Authentication (2FA)</label>
            <p className="text-sm mb-3">
              {mfaEnrolled ? (
                <span className="text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Enabled
                </span>
              ) : (
                <span className="text-gray-600">Not enabled</span>
              )}
            </p>
            {!mfaEnrolled && (
              <button
                onClick={() => setShowMFA(true)}
                className="bg-[#2c6e49] text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
              >
                Set up 2FA
              </button>
            )}
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <Link 
              href="/orders" 
              className="bg-[#2c6e49] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
            >
              View Orders
            </Link>
            <Link 
              href="/wishlist" 
              className="bg-[#2c6e49] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
            >
              Wishlist
            </Link>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
