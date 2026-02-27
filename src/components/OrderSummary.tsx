'use client'

interface OrderSummaryProps {
  cart: any[]
  cartTotal: number
}

export default function OrderSummary({ cart, cartTotal }: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-sm border-b pb-2">
            <span>{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
            <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-3 space-y-2">
        <div className="flex justify-between"><span>Subtotal</span><span>GHS {cartTotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Delivery</span><span className="text-green-600">Free</span></div>
        <div className="border-t pt-2 font-bold flex justify-between text-lg"><span>Total</span><span>GHS {cartTotal.toFixed(2)}</span></div>
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          You'll be redirected to Paystack's secure payment page.
        </p>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">Secured by Paystack. Your payment information is encrypted.</p>
    </div>
  )
}
