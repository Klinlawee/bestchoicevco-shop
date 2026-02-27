import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 sm:h-56 md:h-64 bg-gray-100 overflow-hidden">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              quality={85}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#2c6e49] rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                {product.size}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-xl sm:text-2xl font-bold text-[#2c6e49]">
              GHS {product.price.toFixed(2)}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.size}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
