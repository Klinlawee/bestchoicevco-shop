'use client'

import { useState, useEffect } from 'react'
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
  ArrowRightOnRectangleIcon 
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
  const router = useRouter()
  const supabase = createClient()
  const { wishlistCount } = useWishlist()

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

    const getUser = async () => {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      console.log('🔍 Navbar - Current user:', user)
      console.log('🔍 Navbar - User email:', user?.email)
      console.log('🔍 Navbar - User metadata:', user?.user_metadata)
      setUser(user)
      setIsLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔍 Navbar - Auth state changed:', session?.user)
      console.log('🔍 Navbar - Session user email:', session?.user?.email)
      setUser(session?.user ?? null)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    console.log('🔍 Logging out...')
    await supabase.auth.signOut()
    setUser(null)
    setUserMenuOpen(false)
    setIsOpen(false)
    router.push('/')
    router.refresh()
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
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 transition-transform group-hover:scale-110">
              <Image src="/images/logo.png" alt="BestChoiceVCO Logo" fill className="object-contain" priority />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-[#2c6e49] hidden sm:block">BestChoiceVCO</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-base lg:text-lg text-gray-700 hover:text-[#2c6e49] transition font-medium">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Icons */}
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
            
            {/* Desktop User Menu - WITH DEBUG INFO */}
            {user ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 p-2 hover:text-[#2c6e49] transition border-2 border-green-500 rounded-lg" 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <UserIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                  <span className="text-sm hidden lg:block">{user.user_metadata?.full_name || user.email || 'Account'}</span>
                  <span className="ml-1 text-xs bg-green-500 text-white px-1 rounded">✓</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 border z-50">
                    <div className="px-4 py-3 bg-green-50 border-b border-green-100">
                      <p className="text-sm font-medium text-gray-900">Logged in as:</p>
                      <p className="text-sm font-semibold text-green-700">{user.user_metadata?.full_name || 'User'}</p>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    </div>
                    
                    <Link href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}>
                      <UserIcon className="w-4 h-4 inline mr-2" />
                      Profile
                    </Link>
                    
                    <Link href="/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}>
                      <ShoppingCartIcon className="w-4 h-4 inline mr-2" />
                      Orders
                    </Link>
                    
                    <Link href="/wishlist" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}>
                      <HeartIcon className="w-4 h-4 inline mr-2" />
                      Wishlist
                      {wishlistCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    
                    <div className="border-t my-1"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-2 border-red-500 rounded-lg p-1">
                <Link href="/login" className="p-2 hover:text-[#2c6e49]">
                  <UserIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                </Link>
                <span className="text-xs text-red-500 font-bold">NOT LOGGED IN</span>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
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
            
            {/* Mobile User Section - WITH DEBUG */}
            {user ? (
              <div className="mt-4 pt-4 border-t-2 border-green-500 bg-green-50 rounded-lg mx-2 p-3">
                <div className="bg-white rounded-lg p-3 mb-3 border border-green-200">
                  <p className="text-xs text-green-600 font-bold mb-1">✓ LOGGED IN</p>
                  <p className="text-sm font-semibold text-gray-900">{user.user_metadata?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                
                <div className="space-y-2">
                  <Link href="/profile" 
                    className="flex items-center space-x-2 py-2 px-3 bg-white rounded-lg border border-gray-200 hover:border-[#2c6e49] transition"
                    onClick={() => setIsOpen(false)}>
                    <UserIcon className="w-5 h-5 text-[#2c6e49]" />
                    <span className="text-sm font-medium text-gray-700">Profile</span>
                  </Link>
                  
                  <Link href="/orders" 
                    className="flex items-center space-x-2 py-2 px-3 bg-white rounded-lg border border-gray-200 hover:border-[#2c6e49] transition"
                    onClick={() => setIsOpen(false)}>
                    <ShoppingCartIcon className="w-5 h-5 text-[#2c6e49]" />
                    <span className="text-sm font-medium text-gray-700">Orders</span>
                  </Link>
                  
                  <Link href="/wishlist" 
                    className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-200 hover:border-[#2c6e49] transition"
                    onClick={() => setIsOpen(false)}>
                    <div className="flex items-center space-x-2">
                      <HeartIcon className="w-5 h-5 text-[#2c6e49]" />
                      <span className="text-sm font-medium text-gray-700">Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="mt-4 w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-4 rounded-lg font-bold text-base shadow-lg hover:from-red-600 hover:to-red-700 transition-all"
                >
                  <ArrowRightOnRectangleIcon className="w-6 h-6" />
                  <span>SIGN OUT</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t-2 border-red-500 bg-red-50 rounded-lg mx-2 p-3">
                <p className="text-xs text-red-600 font-bold mb-2 text-center">⚠️ NOT LOGGED IN</p>
                <div className="flex flex-col space-y-3">
                  <Link href="/login" 
                    className="w-full bg-[#2c6e49] text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-green-700 transition"
                    onClick={() => setIsOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/signup" 
                    className="w-full border border-[#2c6e49] text-[#2c6e49] py-3 px-4 rounded-lg font-medium text-center hover:bg-[#2c6e49] hover:text-white transition"
                    onClick={() => setIsOpen(false)}>
                    Create Account
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 px-2">
              <Link href="/cart" 
                className="flex items-center justify-between py-2 hover:text-[#2c6e49] transition"
                onClick={() => setIsOpen(false)}>
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
  )
}
