'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import productsData from '@/data/products.json'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      const results = productsData.products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        (product.keywords && product.keywords.some(keyword => 
          keyword.toLowerCase().includes(query.toLowerCase())
        ))
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
    setLoading(false)
  }, [query])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2c6e49] border-r-transparent"></div>
        <p className="mt-4 text-gray-600">Searching...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Search Results for "{query}"</h1>
      <p className="text-gray-600 mb-8">
        Found {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'}
      </p>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {searchResults.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
              <div className="relative h-48 sm:h-56 md:h-64 bg-gray-100">
                {product.images && product.images[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill
                    className="object-contain p-4 group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#2c6e49] rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                      {product.size}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h2 className="text-sm sm:text-base font-semibold mb-1 line-clamp-2">{product.name}</h2>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg sm:text-xl font-bold text-[#2c6e49]">GHS {product.price.toFixed(2)}</span>
                  <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.size}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No products found matching your search.</p>
          <Link href="/shop" className="inline-block bg-[#2c6e49] text-white px-6 py-2 rounded-lg hover:bg-green-800 transition">
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="container-custom py-8 sm:py-12">
      <Suspense fallback={
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2c6e49] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading search...</p>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  )
}
