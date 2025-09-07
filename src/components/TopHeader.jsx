// FILE: src/components/TopHeader.jsx
import React from 'react'
import { FiSun } from 'react-icons/fi'


export default function TopHeader() {
return (
<header className="sticky top-0 z-40 bg-white/75 backdrop-blur-md border-b border-gray-100">
<div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white font-bold">SD</div>
<div>
<div className="font-semibold">Spraydom</div>
<div className="text-xs text-gray-500">Aromatherapy & Sleep Companion</div>
</div>
</div>
<div className="flex items-center gap-3">
<button className="btn btn-ghost btn-sm">Login</button>
<button className="btn btn-outline btn-sm flex items-center gap-2"><FiSun /> Theme</button>
</div>
</div>
</header>
)
}