'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative w-48 h-48 animate-spin-slow">
        <Image
          src="/images/logo.png"
          alt="BestChoiceVCO Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}
