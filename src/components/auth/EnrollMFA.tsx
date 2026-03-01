'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function EnrollMFA({ onEnrolled, onCancelled }: { 
  onEnrolled: () => void, 
  onCancelled: () => void 
}) {
  const [factorId, setFactorId] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [error, setError] = useState('')
  const [challengeId, setChallengeId] = useState('')

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
          {/* Note: You'll need to display the QR code - Supabase provides it in the enrollment data */}
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
