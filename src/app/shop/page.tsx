import ProductCard from '@/components/product/ProductCard'
import productsData from '@/data/products.json'

export default function ShopPage() {
  const products = productsData.products
  
  return (
    <div className="container-custom py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">All Products</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
