'use client'

import { useWishlist } from '@/context/WishlistContext'
import Link from 'next/link'
import Image from 'next/image'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()

  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingIndex = cart.findIndex((item: any) => item.id === product.id)
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    alert(`${product.name} added to cart!`)
  }

  if (wishlist.length === 0) {
    return (
      <div className="container-custom py-12 text-center">
        <HeartSolid className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-600 mb-8">Save your favorite items here!</p>
        <Link href="/shop" className="bg-[#2c6e49] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlist.length})</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group relative">
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
              aria-label="Remove from wishlist"
            >
              <HeartSolid className="w-5 h-5 text-red-500" />
            </button>
            
            <Link href={`/product/${product.id}`}>
              <div className="relative h-48 sm:h-56 bg-gray-100">
                {product.images && product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-[#2c6e49] rounded-full flex items-center justify-center text-white font-bold">
                      {product.size}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-[#2c6e49] font-bold text-xl mb-3">
                  GHS {product.price.toFixed(2)}
                </p>
                
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    addToCart(product)
                  }}
                  className="w-full bg-[#2c6e49] text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
