'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [pageState, setPageState] = useState<'verifying' | 'invalid' | 'ready'>('verifying')
  const router = useRouter()
  const supabase = createClient()
  const hasCompleted = useRef(false) // Track if we've already completed setup

  useEffect(() => {
    // If we've already completed, don't do anything
    if (hasCompleted.current) {
      return
    }

    const processResetToken = async () => {
      try {
        console.log('🔍 Processing reset password token...')
        
        // Check if we already have a valid session
        const { data: sessionData } = await supabase.auth.getSession()
        
        if (sessionData.session) {
          console.log('✅ Valid session found, showing reset form')
          setPageState('ready')
          hasCompleted.current = true // Mark as completed
          return
        }

        // If no session yet, check the URL hash
        const hash = window.location.hash
        console.log('📍 URL Hash:', hash || 'No hash found')
        
        if (!hash) {
          console.log('❌ No reset token found')
          setPageState('invalid')
          setError('No reset token found. Please request a new password reset link.')
          return
        }

        // Wait a moment for Supabase to process the hash
        setTimeout(async () => {
          const { data: checkData } = await supabase.auth.getSession()
          if (checkData.session) {
            console.log('✅ Session established after delay')
            setPageState('ready')
            hasCompleted.current = true
          } else {
            console.log('❌ Still no session')
            setPageState('invalid')
            setError('Invalid or expired reset link. Please request a new one.')
          }
        }, 1000)
        
      } catch (err) {
        console.error('❌ Error processing reset:', err)
        setPageState('invalid')
        setError('An error occurred. Please try again.')
      }
    }

    processResetToken()
  }, [supabase]) // No dependencies that change

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError('Please enter both passwords')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      console.log('📝 Updating password...')
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        console.error('❌ Password update error:', updateError)
        throw updateError
      }

      console.log('✅ Password updated successfully')
      setSuccess(true)
      
      // Sign out after password reset
      await supabase.auth.signOut()
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
      
    } catch (err: any) {
      console.error('❌ Error:', err)
      setError(err.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show verifying state
  if (pageState === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <div className="h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Verifying your reset link...</h3>
            <p className="mt-2 text-sm text-gray-500">Please wait a moment.</p>
          </div>
        </div>
      </div>
    )
  }

  // Show invalid/error state
  if (pageState === 'invalid') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Invalid Reset Link</h3>
            <p className="mt-2 text-sm text-gray-500">{error || 'The password reset link is invalid or has expired.'}</p>
            <div className="mt-6 space-y-3">
              <Link href="/forgot-password" className="block w-full bg-[#2c6e49] text-white py-2 px-4 rounded-md hover:bg-green-700 transition">
                Request New Reset Link
              </Link>
              <Link href="/login" className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show success state
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Password Reset Successful!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your password has been reset successfully. You'll be redirected to the login page in a few seconds.
            </p>
            <div className="mt-6">
              <Link href="/login" className="text-[#2c6e49] hover:text-green-700 font-medium">
                Go to Login Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show reset password form (ready state)
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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set New Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2c6e49] focus:border-[#2c6e49]"
                placeholder="••••••••"
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#2c6e49] focus:border-[#2c6e49]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2c6e49] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2c6e49] disabled:opacity-50"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </div>

            <div className="text-center text-sm">
              <Link href="/login" className="font-medium text-[#2c6e49] hover:text-green-700">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
