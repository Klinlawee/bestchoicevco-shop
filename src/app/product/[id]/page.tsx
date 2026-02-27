import { notFound } from 'next/navigation'
import productsData from '@/data/products.json'
import ProductDetailClient from '@/components/product/ProductDetailClient'

export function generateStaticParams() {
  return productsData.products.map((product) => ({
    id: product.id,
  }))
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = productsData.products.find(p => p.id === params.id)
  
  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} policies={productsData.policies} />
}
