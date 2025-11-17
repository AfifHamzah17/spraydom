// src/components/ProductCard.jsx
import React from 'react'

export default function ProductCard({ product }) {
  const waUrl = `https://wa.me/${product.wa_number}?text=${encodeURIComponent(product.wa_message)}`
  
  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-800/70 hover:shadow-xl border border-gray-700">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-bold">{product.name}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-gray-400">Available</span>
          </div>
          
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.545a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.545.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Order
          </a>
        </div>
      </div>
    </div>
  )
}