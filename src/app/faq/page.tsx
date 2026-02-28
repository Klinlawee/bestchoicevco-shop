'use client'

import { useState } from 'react'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    { question: "What is Virgin Coconut Oil (VCO)?", 
      answer: "Virgin Coconut Oil (VCO) is a natural oil extracted from fresh, mature coconuts without the use of chemicals or high heat. At BestChoiceVCO, our oil is cold-pressed to preserve its nutrients, natural aroma, and health benefits. It is suitable for cooking, skincare, haircare, and industrial use."},
    { question: "Is BestChoiceVCO 100% Natural?", 
      answer: "Yes. BestChoiceVCO is 100% pure, natural, and unrefined. Our oil contains no additives, preservatives, or artificial ingredients. It is produced under hygienic conditions to maintain high quality and safety standards." },
    { question: "How should I store the coconut oil?", 
      answer: "Store in a cool, dry place away from direct sunlight. Below 25°C, it will be solid; above that, it becomes liquid - this is natural." },
    { question: "What can I use the oil for?", 
      answer: "Our virgin coconut oil can be used for cooking, frying, baking, skincare, haircare, massage therapy, soap production, cosmetics manufacturing, and other industrial applications. It is suitable for both household and commercial use.." }
    { question: "Do you offer bulk purchase?", 
      answer: "Yes, we offer bulk supply including large containers and 55-gallon industrial drums. We work with wholesalers, retailers, cosmetic manufacturers, and food processors across Ghana. Please contact us directly for wholesale pricing." },
    { question: "Do you deliver outside Accra", 
      answer: "Yes, we deliver nationwide across Ghana including Kumasi, Tema, Takoradi, Cape Coast, Tamale,other regions, and outside Ghana. Delivery timelines vary depending on location and order size." },
    { question: "What is your policy on Return", 
      answer: "Returns are only accepted for damaged or incorrect products reported within 48 hours of delivery. Due to hygiene and safety standards, opened or used products cannot be returned." },
      { question: "How long does delivery take?", 
      answer: "Retail orders are usually delivered within 1–3 business days in Accra and 2–5 business days outside Accra. Bulk orders may require additional processing time." }   
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
