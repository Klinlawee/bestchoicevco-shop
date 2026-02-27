'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import productsData from '@/data/products.json'

// Lazy load the video player component
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  loading: () => (
    <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden shadow-xl bg-gray-200 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#2c6e49] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  ),
  ssr: false
})

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<any[]>([])

  useEffect(() => {
    setBestSellers(productsData.products.slice(0, 3))
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="text-white max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Pure Virgin Coconut Oil
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Cold-pressed, organic, and perfect for hair, skin, and cooking
            </p>
            <Link
              href="/shop"
              className="bg-[#ffd700] text-gray-900 px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-yellow-400 transition inline-block"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Our Best Sellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {bestSellers.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center hover:shadow-xl transition group">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain group-hover:scale-105 transition duration-300"
                      sizes="(max-width: 640px) 128px, 160px"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#2c6e49] rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                      {product.size}
                    </div>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-[#2c6e49] font-bold text-lg sm:text-xl mb-4">
                  GHS {product.price.toFixed(2)}
                </p>
                <Link 
                  href={`/product/${product.id}`}
                  className="inline-block bg-[#2c6e49] text-white px-6 py-2 rounded-lg text-sm sm:text-base hover:bg-green-800 transition"
                >
                  View Product
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Process - Lazy Loaded Video */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Manufacturing Process</h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Watch how we produce our premium virgin coconut oil using traditional cold-press methods,
                ensuring maximum nutrients and purity.
              </p>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                From fresh coconuts to your doorstep, we maintain the highest quality standards at every step.
              </p>
              <Link href="/about" className="text-[#2c6e49] font-semibold hover:underline inline-block">
                Learn More →
              </Link>
            </div>
            <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden shadow-xl">
              <VideoPlayer 
                src="/videos/manu_video.mp4"
                poster="/images/products/500ml_1.webp"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-8 text-sm sm:text-base">
              Have questions about our products or want to place a bulk order? Contact us today!
            </p>
            <Link
              href="/contact"
              className="bg-[#2c6e49] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-800 transition inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
