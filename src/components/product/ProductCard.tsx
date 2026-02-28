'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types/product'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div 
        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden z-10">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#2c6e49] transform rotate-45 translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500" />
        </div>

        {/* Image Container */}
        <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 image-shimmer" />
          )}
          
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-contain p-6 transition-all duration-700 ${
                isHovered ? 'scale-110 rotate-2' : 'scale-100 rotate-0'
              }`}
              loading="lazy"
              quality={85}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#2c6e49] rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl transform group-hover:scale-110 transition-transform duration-500">
                {product.size}
              </div>
            </div>
          )}

          {/* Animated border on hover */}
          <div className={`absolute inset-0 border-2 border-[#2c6e49] rounded-2xl opacity-0 transition-all duration-500 ${
            isHovered ? 'opacity-100 scale-95' : 'opacity-0 scale-90'
          }`} />
        </div>

        {/* Product Info */}
        <div className="p-5 flex-grow flex flex-col bg-white relative">
          {/* Background pattern on hover */}
          <div className={`absolute inset-0 bg-[#2c6e49]/5 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          
          <div className="relative z-10">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
              {product.name.split(' ').map((word, i) => (
                <span 
                  key={i} 
                  className={`inline-block transition-all duration-300 ${
                    isHovered ? 'hover:scale-110 hover:text-[#2c6e49]' : ''
                  }`}
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  {word}{' '}
                </span>
              ))}
            </h3>
            
            <p className={`text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 transition-all duration-500 ${
              isHovered ? 'translate-x-1' : 'translate-x-0'
            }`}>
              {product.description}
            </p>
            
            <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-gray-500">GHS</span>
                <span className={`text-xl sm:text-2xl font-bold text-[#2c6e49] transition-all duration-500 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}>
                  {product.price.toFixed(2)}
                </span>
              </div>
              <span className={`text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full transition-all duration-500 ${
                isHovered ? 'bg-[#2c6e49] text-white shadow-lg' : ''
              }`}>
                {product.size}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom highlight on hover */}
        <div className={`h-1 bg-[#2c6e49] transition-all duration-500 ${
          isHovered ? 'w-full' : 'w-0'
        }`} />
      </div>
    </Link>
  )
}
