'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import WishlistButton from './WishlistButton'

interface Product {
  id: string; 
  name: string; 
  price: number; 
  currency: string; 
  size: string;
  description: string; 
  benefits: string[]; 
  images: string[]; 
  category: string;
  inStock: boolean;
  keywords?: string[]; // Add optional keywords to match the type
}

interface ProductDetailClientProps {
  product: Product
  policies: { return: string; refund: string; delivery: string }
}

export default function ProductDetailClient({ product, policies }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const router = useRouter()

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingIndex = cart.findIndex((item: any) => item.id === product.id)
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity
    } else {
      cart.push({ ...product, quantity })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  return (
    <div className="container-custom py-6 sm:py-8 md:py-12">
      {addedToCart && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-down">
          ✓ Added to cart!
        </div>
      )}

      <div className="text-sm breadcrumbs mb-6">
        <ul className="flex space-x-2 text-gray-500">
          <li><Link href="/" className="hover:text-[#2c6e49]">Home</Link></li>
          <li><span className="mx-2">/</span></li>
          <li><Link href="/shop" className="hover:text-[#2c6e49]">Shop</Link></li>
          <li><span className="mx-2">/</span></li>
          <li className="text-[#2c6e49] font-semibold">{product.name}</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        <div>
          <div className="bg-gray-100 rounded-lg p-4 sm:p-6 md:p-8 flex items-center justify-center mb-4 relative">
            <div className="absolute top-4 right-4 z-10">
              <WishlistButton product={product} />
            </div>
            <div className="relative w-full h-64 sm:h-80 md:h-96">
              {product.images && product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-[#2c6e49] rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl md:text-3xl">
                    {product.size}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-16 sm:h-20 bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-[#2c6e49]' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 768px) 20vw, 10vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
            <WishlistButton product={product} />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <p className="text-2xl sm:text-3xl font-bold text-[#2c6e49]">
              GHS {product.price.toFixed(2)}
            </p>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
              {product.size}
            </span>
          </div>

          <p className="text-gray-600 mb-6 text-sm sm:text-base">{product.description}</p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-base sm:text-lg">Key Benefits:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-center text-gray-600 text-sm sm:text-base">
                  <span className="text-[#2c6e49] mr-2">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            {product.inStock ? (
              <p className="text-green-600 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                In Stock
              </p>
            ) : (
              <p className="text-red-600 text-sm flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                Out of Stock
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2 text-sm sm:text-base">Quantity:</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 border rounded-lg hover:bg-gray-100 text-sm sm:text-base"
                disabled={!product.inStock}
              >
                -
              </button>
              <span className="w-12 sm:w-16 text-center text-sm sm:text-base">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 sm:w-10 sm:h-10 border rounded-lg hover:bg-gray-100 text-sm sm:text-base"
                disabled={!product.inStock}
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                product.inStock 
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className={`py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                product.inStock 
                  ? 'bg-[#2c6e49] text-white hover:bg-green-800' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Buy Now
            </button>
          </div>

          <div className="border-t pt-6">
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-2 text-xs sm:text-sm ${
                  activeTab === 'description' 
                    ? 'border-b-2 border-[#2c6e49] font-semibold text-[#2c6e49]' 
                    : 'text-gray-500'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('return')}
                className={`pb-2 text-xs sm:text-sm ${
                  activeTab === 'return' 
                    ? 'border-b-2 border-[#2c6e49] font-semibold text-[#2c6e49]' 
                    : 'text-gray-500'
                }`}
              >
                Return Policy
              </button>
              <button
                onClick={() => setActiveTab('refund')}
                className={`pb-2 text-xs sm:text-sm ${
                  activeTab === 'refund' 
                    ? 'border-b-2 border-[#2c6e49] font-semibold text-[#2c6e49]' 
                    : 'text-gray-500'
                }`}
              >
                Refund Policy
              </button>
              <button
                onClick={() => setActiveTab('delivery')}
                className={`pb-2 text-xs sm:text-sm ${
                  activeTab === 'delivery' 
                    ? 'border-b-2 border-[#2c6e49] font-semibold text-[#2c6e49]' 
                    : 'text-gray-500'
                }`}
              >
                Delivery
              </button>
            </div>
            <div className="text-gray-600 text-xs sm:text-sm">
              {activeTab === 'description' && (
                <div>
                  <p className="mb-2">{product.description}</p>
                  <p className="font-semibold mt-2">Perfect for:</p>
                  <ul className="list-disc list-inside">
                    {product.benefits.map((benefit: string, idx: number) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === 'return' && policies.return}
              {activeTab === 'refund' && policies.refund}
              {activeTab === 'delivery' && policies.delivery}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
