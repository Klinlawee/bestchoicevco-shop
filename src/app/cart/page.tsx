'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TrashIcon } from '@heroicons/react/24/outline'

interface CartItem {
  id: string; name: string; price: number; size: string; quantity: number; images?: string[]
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)

  useEffect(() => { loadCart() }, [])

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const items = JSON.parse(savedCart)
      setCart(items)
      setCartTotal(items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0))
    }
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) { removeItem(id); return }
    const updatedCart = cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCartTotal(updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0))
  }

  const removeItem = (id: string) => {
    const updatedCart = cart.filter(item => item.id !== id)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    setCartTotal(updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0))
  }

  if (cart.length === 0) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added any products yet.</p>
        <Link href="/shop" className="bg-[#2c6e49] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
              <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                {item.images && item.images[0] ? (
                  <Image src={item.images[0]} alt={item.name} fill className="object-contain p-2" sizes="96px" />
                ) : (
                  <div className="w-16 h-16 bg-[#2c6e49] rounded-full flex items-center justify-center text-white font-bold">
                    {item.size}
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-[#2c6e49] font-bold">GHS {item.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{item.size}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 border rounded hover:bg-gray-100">-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border rounded hover:bg-gray-100">+</button>
                  <button onClick={() => removeItem(item.id)} className="ml-4 text-red-500 hover:text-red-700">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">GHS {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>GHS {cartTotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">Free</span></div>
              <div className="border-t pt-2 font-bold flex justify-between"><span>Total</span><span>GHS {cartTotal.toFixed(2)}</span></div>
            </div>
            <Link href="/checkout" className="block w-full bg-[#2c6e49] text-white text-center py-3 rounded-lg font-semibold hover:bg-green-800 transition">
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="block text-center mt-4 text-gray-600 hover:text-[#2c6e49]">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
