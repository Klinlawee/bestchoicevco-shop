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
