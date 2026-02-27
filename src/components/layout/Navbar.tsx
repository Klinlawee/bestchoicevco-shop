'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    
    // Load cart count
    try {
      const cart = localStorage.getItem('cart')
      if (cart) {
        const cartItems = JSON.parse(cart)
        setCartCount(cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0))
      }
    } catch (e) { console.error('Error loading cart:', e) }

    // Get user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    await supabase.auth.signOut()
    setUser(null)
    setUserMenuOpen(false)
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

          {/* Icons and Search */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-5">
            {/* Search */}
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

            <Link href="/cart" className="p-2 hover:text-[#2c6e49] relative">
              <ShoppingCartIcon className="w-5 h-5 lg:w-6 lg:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ffd700] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button className="p-2 hover:text-[#2c6e49] flex items-center" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  <UserIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                  <span className="ml-1 text-sm hidden lg:block">{user.user_metadata?.full_name || 'Account'}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>
                      Orders
                    </Link>
                    <div className="border-t my-1"></div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="p-2 hover:text-[#2c6e49]">
                <UserIcon className="w-5 h-5 lg:w-6 lg:h-6" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..." className="flex-1 px-3 py-2 text-sm focus:outline-none" />
                <button type="submit" className="bg-[#2c6e49] text-white px-3 py-2">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
            </form>

            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="block py-3 text-base text-gray-700 hover:text-[#2c6e49] font-medium" onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <Link href="/cart" className="p-2 relative">
                <ShoppingCartIcon className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ffd700] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="p-2"><UserIcon className="w-6 h-6" /></Link>
                  <button onClick={handleLogout} className="text-sm text-red-600 font-medium">Sign Out</button>
                </div>
              ) : (
                <Link href="/login" className="p-2"><UserIcon className="w-6 h-6" /></Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
