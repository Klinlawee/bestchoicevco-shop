import Link from 'next/link'
import Image from 'next/image'

interface RelatedProductsProps {
  products: any[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
            <div className="relative h-48 bg-gray-100">
              {product.images && product.images[0] ? (
                <Image src={product.images[0]} alt={product.name} fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                  className="object-contain p-4 group-hover:scale-105 transition duration-300"
                  loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#2c6e49] rounded-full flex items-center justify-center text-white font-bold">{product.size}</div>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-[#2c6e49] font-bold">GHS {product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
