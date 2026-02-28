'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/product/ProductCard'
import productsData from '@/data/products.json'

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setProducts(productsData.products)
    // Trigger entrance animation
    setIsVisible(true)
  }, [])

  return (
    <div className="container-custom py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 animate-fade-in">
        All Products
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`transition-all duration-700 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
