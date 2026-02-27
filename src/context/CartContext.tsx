'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { CartItem, Product } from '@/types/product'

const CartContext = createContext<any>(undefined)
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  useEffect(() => { const stored = localStorage.getItem('cart'); if (stored) setCart(JSON.parse(stored)) }, [])
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)) }, [cart])

  const addToCart = (product: Product, quantity: number) => setCart(prev => {
    const existing = prev.find(item => item.id === product.id)
    if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
    return [...prev, { ...product, quantity }]
  })
  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.id !== productId))
  const updateQuantity = (productId: string, quantity: number) => setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item).filter(item => item.quantity > 0))
  const clearCart = () => setCart([])
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>{children}</CartContext.Provider>
}
export const useCart = () => useContext(CartContext)
