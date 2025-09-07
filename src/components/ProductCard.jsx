// FILE: src/components/ProductCard.jsx
import React from 'react'


export default function ProductCard({ product }) {
const wa = `https://wa.me/62812XXXXXXXXX?text=Saya%20ingin%20memesan%20${encodeURIComponent(product.name)}`
return (
<div className="bg-white rounded-xl overflow-hidden shadow">
<img src={product.img} alt={product.name} className="w-full h-44 object-cover" />
<div className="p-3">
<div className="font-semibold">{product.name}</div>
<div className="text-sm text-gray-500">{product.price}</div>
<div className="mt-3 flex gap-2">
<a className="btn btn-outline btn-sm flex-1" href="#">Detail</a>
<a className="btn btn-primary btn-sm" href={wa} target="_blank" rel="noreferrer">Order</a>
</div>
</div>
</div>
)
}