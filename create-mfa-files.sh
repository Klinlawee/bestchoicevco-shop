#!/bin/bash

# Create auth directory if it doesn't exist
mkdir -p src/components/auth

# Create complete EnrollMFA.tsx
cat > src/components/auth/EnrollMFA.tsx << 'CONTENT'
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function EnrollMFA({ onEnrolled, onCancelled }: { 
  onEnrolled: () => void, 
  onCancelled: () => void 
}) {
  const [factorId, setFactorId] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [error, setError] = useState('')
  const [challengeId, setChallengeId] = useState('')
  const supabase = createClient()

  const onEnrollClicked = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      })
      if (error) throw error
      setFactorId(data.id)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const onSendOTPClicked = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.challenge({ factorId })
      if (error) throw error
      setChallengeId(data.id)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const onVerifyClicked = async () => {
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verifyCode,
      })
      if (error) throw error
      onEnrolled()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
      
      {!factorId ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Set Up Two-Factor Authentication</h3>
          <p className="text-gray-600 mb-6">
            Protect your account by adding an extra layer of security.
          </p>
          <button 
            onClick={onEnrollClicked} 
            className="bg-[#2c6e49] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Set up Authenticator
          </button>
        </div>
      ) : !challengeId ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
          <p className="text-gray-600 mb-4">
            Scan this QR code with Google Authenticator or Authy, then click "Send Code"
          </p>
          <button 
            onClick={onSendOTPClicked} 
            className="bg-[#2c6e49] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Send Code
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-4">Verify Code</h3>
          <p className="text-gray-600 mb-4">
            Enter the 6-digit code from your authenticator app
          </p>
          <input
            type="text"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="border border-gray-300 p-2 w-full mb-4 rounded-lg"
            maxLength={6}
          />
          <button 
            onClick={onVerifyClicked} 
            className="bg-[#2c6e49] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full"
          >
            Verify
          </button>
        </div>
      )}
      <button onClick={onCancelled} className="mt-4 text-gray-600 hover:text-gray-800 transition w-full text-center">
        Cancel
      </button>
    </div>
  )
}
CONTENT

# Create complete profile page
cat > src/app/profile/page.tsx << 'CONTENT'
'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { 
        router.push('/login') 
      } else { 
        setUser(user) 
        const { data: mfaData } = await supabase.auth.mfa.listFactors()
        setMfaEnrolled(mfaData?.factors?.some(f => f.status === 'verified') || false)
      }
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
              {user.email_confirmed_at ? <span className="text-green-600">✓ Verified</span> : 
               <span className="text-yellow-600">Pending verification</span>}
            </p>
          </div>
          
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Two-Factor Authentication</label>
            <p className="text-sm mb-3">
              {mfaEnrolled ? (
                <span className="text-green-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  ✓ Enabled
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

          <div className="pt-4 flex space-x-4">
            <Link href="/orders" className="bg-[#2c6e49] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition">
              View Orders
            </Link>
            <Link href="/wishlist" className="bg-[#2c6e49] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition">
              Wishlist
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
CONTENT

# Create complete login page
cat > src/app/login/page.tsx << 'CONTENT'
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMFA, setShowMFA] = useState(false)
  const [mfaCode, setMfaCode] = useState('')
  const [mfaFactorId, setMfaFactorId] = useState('')
  const [mfaChallengeId, setMfaChallengeId] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password')
      }
      
      const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      
      if (!mfaError && mfaData.nextLevel === 'aal2' && mfaData.nextLevel !== mfaData.currentLevel) {
        const { data: factors } = await supabase.auth.mfa.listFactors()
        const verifiedFactor = factors?.factors?.find(f => f.status === 'verified')
        
        if (verifiedFactor) {
          const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
            factorId: verifiedFactor.id
          })
          
          if (!challengeError) {
            setMfaFactorId(verifiedFactor.id)
            setMfaChallengeId(challenge.id)
            setShowMFA(true)
            setLoading(false)
            return
          }
        }
      }
      
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleMFAVerify = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: mfaChallengeId,
        code: mfaCode,
      })
      
      if (error) throw error
      
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Invalid verification code')
      setLoading(false)
    }
  }

  if (showMFA) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg">{error}</div>}
            <input
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full px-3 py-2 border text-center text-2xl tracking-widest rounded-lg mb-4"
            />
            <button
              onClick={handleMFAVerify}
              disabled={loading || mfaCode.length !== 6}
              className="w-full bg-[#2c6e49] text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/">
            <div className="relative h-16 w-16">
              <Image src="/images/logo.png" alt="BestChoiceVCO" fill className="object-contain" />
            </div>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or <Link href="/signup" className="text-[#2c6e49] hover:underline">create an account</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg">{error}</div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2c6e49] text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
CONTENT

echo "✅ All MFA files created successfully!"
