'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  MagnifyingGlassIcon, 
  ShoppingCartIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon, 
  HeartIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase/client'
import { useWishlist } from '@/context/WishlistContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error' | 'info'} | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const { wishlistCount } = useWishlist()
  const hasChecked = useRef(false)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    
    try {
      const cart = localStorage.getItem('cart')
      if (cart) {
        const cartItems = JSON.parse(cart)
        setCartCount(cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0))
      }
    } catch (e) { console.error('Error loading cart:', e) }

    const checkSession = async () => {
      if (hasChecked.current) return
      hasChecked.current = true
      
      setIsLoading(true)
      try {
        console.log('🔍 Checking session...')
        console.log('📦 All cookies:', document.cookie)
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Session error:', error)
        }
        
        if (session?.user) {
          console.log('✅ User session found:', session.user.email)
          console.log('✅ User metadata:', session.user.user_metadata)
          setUser(session.user)
          showToast('Successfully logged in! Welcome back!', 'success')
        } else {
          console.log('❌ No user session')
          setUser(null)
        }
      } catch (err) {
        console.error('❌ Session check error:', err)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔍 Auth event:', event)
      console.log('🔍 Session user:', session?.user?.email || 'null')
      
      if (event === 'SIGNED_IN') {
        console.log('✅ User signed in:', session?.user?.email)
        setUser(session?.user)
        showToast('Successfully logged in! Welcome back!', 'success')
        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out')
        setUser(null)
        showToast('You have been logged out. See you again!', 'info')
        router.refresh()
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed')
        setUser(session?.user)
      } else if (event === 'USER_UPDATED') {
        console.log('📝 User updated')
        setUser(session?.user)
      }
      
      setUserMenuOpen(false)
      setIsOpen(false)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setUserMenuOpen(false)
      setIsOpen(false)
      showToast('Successfully logged out!', 'info')
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      showToast('Error logging out. Please try again.', 'error')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ]

  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse hidden sm:block"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {toast && (
        <div 
          className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in-down flex items-center space-x-2 ${
            toast.type === 'success' ? 'bg-green-500' : 
            toast.type === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
          } text-white`}
        >
          {toast.type === 'success' && <CheckBadgeIcon className="w-6 h-6" />}
          {toast.type === 'error' && <XMarkIcon className="w-6 h-6" />}
          {toast.type === 'info' && <ArrowLeftOnRectangleIcon className="w-6 h-6" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <nav className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="container-custom">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 transition-transform group-hover:scale-110">
                <Image src="/images/logo.png" alt="BestChoiceVCO Logo" fill className="object-contain" priority />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-[#2c6e49] hidden sm:block">BestChoiceVCO</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-base lg:text-lg text-gray-700 hover:text-[#2c6e49] transition font-medium">
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3 lg:space-x-5">
              <div className="relative">
                <button className="p-2 hover:text-[#2c6e49]" onClick={() => setShowSearch(!showSearch)}>
                  <MagnifyingGlassIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
                {showSearch && (
                  <form onSubmit={handleSearch} className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg p-3 z-50">
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c6e49] text-sm" autoFocus />
                  </form>
                )}
              </div>

              <Link href="/wishlist" className="p-2 hover:text-[#2c6e49] relative">
                <HeartIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="p-2 hover:text-[#2c6e49] relative">
                <ShoppingCartIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ffd700] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 p-2 hover:text-[#2c6e49] transition relative group border border-green-500 rounded-lg"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <div className="relative">
                      <UserIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                    </div>
                    <span className="text-sm hidden lg:block font-medium">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Account'}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full hidden lg:inline-block">
                      Logged In
                    </span>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 border z-50">
                      <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
                        <div className="flex items-center space-x-2">
                          <CheckBadgeIcon className="w-5 h-5 text-green-600" />
                          <p className="text-sm font-medium text-gray-900">Signed In</p>
                        </div>
                        <p className="text-sm font-semibold text-green-700 mt-1">{user.user_metadata?.full_name || 'User'}</p>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                      </div>
                      
                      <div className="py-1">
                        <Link href="/profile" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                          <UserIcon className="w-4 h-4 text-gray-500" />
                          <span>Profile</span>
                        </Link>
                        <Link href="/orders" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                          <ShoppingCartIcon className="w-4 h-4 text-gray-500" />
                          <span>Orders</span>
                        </Link>
                        <Link href="/wishlist" className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                          <div className="flex items-center space-x-3">
                            <HeartIcon className="w-4 h-4 text-gray-500" />
                            <span>Wishlist</span>
                          </div>
                          {wishlistCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{wishlistCount}</span>
                          )}
                        </Link>
                      </div>
                      
                      <div className="border-t my-1"></div>
                      
                      <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium">
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login" className="flex items-center space-x-2 p-2 hover:text-[#2c6e49] transition group relative">
                    <div className="relative">
                      <UserIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></span>
                    </div>
                    <span className="text-sm hidden lg:block text-gray-500">Not signed in</span>
                  </Link>
                  <Link href="/signup" className="hidden lg:block bg-[#2c6e49] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>

          {isOpen && (
            <div className="md:hidden py-4 border-t bg-white">
              <form onSubmit={handleSearch} className="mb-4 px-2">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..." className="flex-1 px-3 py-2 text-sm focus:outline-none" />
                  <button type="submit" className="bg-[#2c6e49] text-white px-3 py-2">
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} 
                  className="block py-3 px-2 text-base text-gray-700 hover:text-[#2c6e49] hover:bg-gray-50 font-medium border-b border-gray-100" 
                  onClick={() => setIsOpen(false)}>
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <div className="mt-4 pt-4 border-t-2 border-green-200 bg-green-50 rounded-lg mx-2 p-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckBadgeIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Logged In</span>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 mb-3 border border-green-200">
                    <p className="text-sm font-semibold text-gray-900">{user.user_metadata?.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Link href="/profile" className="flex items-center space-x-2 py-2 px-3 bg-white rounded-lg border border-gray-200 hover:border-[#2c6e49] transition" onClick={() => setIsOpen(false)}>
                      <UserIcon className="w-5 h-5 text-[#2c6e49]" />
                      <span className="text-sm font-medium text-gray-700">Profile</span>
                    </Link>
                    
                    <Link href="/orders" className="flex items-center space-x-2 py-2 px-3 bg-white rounded-lg border border-gray-200 hover:border-[#2c6e49] transition" onClick={() => setIsOpen(false)}>
                      <ShoppingCartIcon className="w-5 h-5 text-[#2c6e49]" />
                      <span className="text-sm font-medium text-gray-700">Orders</span>
                    </Link>
                    
                    <Link href="/wishlist" className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-200 hover:border-[#2c6e49] transition" onClick={() => setIsOpen(false)}>
                      <div className="flex items-center space-x-2">
                        <HeartIcon className="w-5 h-5 text-[#2c6e49]" />
                        <span className="text-sm font-medium text-gray-700">Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{wishlistCount}</span>
                      )}
                    </Link>
                  </div>
                  
                  <button onClick={handleLogout} className="mt-4 w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:from-red-600 hover:to-red-700 transition-all">
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t-2 border-gray-200 bg-gray-50 rounded-lg mx-2 p-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-500">Not Logged In</span>
                  </div>
                  
                  <div className="flex flex-col space-y-3">
                    <Link href="/login" className="w-full bg-[#2c6e49] text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-green-700 transition" onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/signup" className="w-full border border-[#2c6e49] text-[#2c6e49] py-3 px-4 rounded-lg font-medium text-center hover:bg-[#2c6e49] hover:text-white transition" onClick={() => setIsOpen(false)}>
                      Create Account
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 px-2">
                <Link href="/cart" className="flex items-center justify-between py-2 hover:text-[#2c6e49] transition" onClick={() => setIsOpen(false)}>
                  <span className="text-base font-medium text-gray-700">Shopping Cart</span>
                  {cartCount > 0 && (
                    <span className="bg-[#ffd700] text-gray-900 text-sm px-3 py-1 rounded-full font-bold">
                      {cartCount} {cartCount === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
