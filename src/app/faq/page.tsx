'use client'

import { useState } from 'react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { question: "What makes your coconut oil different?", 
      answer: "Our coconut oil is cold-pressed from fresh, organic coconuts within 24 hours of harvesting. This ensures maximum nutrients and the authentic coconut aroma." },
    { question: "Is the oil refined or unrefined?", 
      answer: "Our oil is 100% unrefined virgin coconut oil. We don't use any chemicals or high heat in our process." },
    { question: "How should I store the coconut oil?", 
      answer: "Store in a cool, dry place away from direct sunlight. Below 25°C, it will be solid; above that, it becomes liquid - this is natural." },
    { question: "Can I cook with this oil?", 
      answer: "Absolutely! Our virgin coconut oil has a high smoke point and is perfect for cooking, baking, and frying." }
  ]

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition">
                <span className="font-semibold text-gray-800">{faq.question}</span>
                <span className="text-2xl">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
