import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-custom py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Link href="/" className="bg-[#2c6e49] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
        Go Home
      </Link>
    </div>
  )
}
