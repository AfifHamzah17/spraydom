// FILE: src/components/BottomNav.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { HiHome, HiOutlineMusicNote, HiOutlinePuzzle, HiOutlinePhotograph } from 'react-icons/hi'


export default function BottomNav() {
return (
<nav className="fixed bottom-4 left-0 right-0 z-50 flex items-center justify-center pointer-events-auto">
<div className="max-w-3xl w-full mx-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg px-4 py-2 flex items-center justify-between">
<NavLink to="/audio" className={({ isActive }) => `flex-1 text-center p-2 ${isActive ? 'text-primary' : 'text-gray-600'}`}>
<div className="flex flex-col items-center">
<HiOutlineMusicNote className="w-6 h-6" />
<span className="text-xs mt-1">Audio</span>
</div>
</NavLink>


<NavLink to="/" className={({ isActive }) => `-mt-6 bg-primary text-black rounded-full p-4 shadow-xl ${isActive ? 'scale-105' : ''}`}>
<div className="flex flex-col items-center">
<HiHome className="w-6 h-6" />
<span className="text-xs mt-1">Home</span>
</div>
</NavLink>


<NavLink to="/mini-games" className={({ isActive }) => `flex-1 text-center p-2 ${isActive ? 'text-primary' : 'text-gray-600'}`}>
<div className="flex flex-col items-center">
<HiOutlinePuzzle className="w-6 h-6" />
<span className="text-xs mt-1">Sleepy</span>
</div>
</NavLink>
</div>
</nav>
)
}
