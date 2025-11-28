// src/components/BottomNav.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { HiHome, HiOutlineMusicNote, HiOutlinePuzzle, HiOutlinePhotograph, HiOutlineDocumentText } from 'react-icons/hi'
import { MdOndemandVideo } from "react-icons/md";
import { GrArticle } from "react-icons/gr";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 flex items-center justify-center pointer-events-auto">
      <div className="max-w-5xl w-full mx-4 bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-xl px-4 py-2 flex items-center justify-between border border-gray-800">
        <NavLink 
          to="/audio" 
          className={({ isActive }) => `
            flex-1 text-center p-2 rounded-xl transition-all duration-200
            ${isActive 
              ? 'text-green-500 bg-gray-800' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }
          `}
        >
          <div className="flex flex-col items-center">
            <HiOutlineMusicNote className="w-6 h-6" />
            <span className="text-xs mt-1">Sleephonia</span>
          </div>
        </NavLink>

        <NavLink 
          to="/sleeptube" 
          className={({ isActive }) => `
            flex-1 text-center p-2 rounded-xl transition-all duration-200
            ${isActive 
              ? 'text-green-500 bg-gray-800' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }
          `}
        >
          <div className="flex flex-col items-center">
            <MdOndemandVideo className="w-6 h-6" />
            <span className="text-xs mt-1">Sleeptube</span>
          </div>
        </NavLink>

        <NavLink 
          to="/" 
          className={({ isActive }) => `
            -mt-6 bg-green-600 text-white rounded-full p-4 shadow-xl transition-all duration-200
            ${isActive 
              ? 'scale-110 shadow-green-500/50 shadow-2xl' 
              : 'hover:bg-green-500'
            }
          `}
        >
          <div className="flex flex-col items-center">
            <HiHome className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </div>
        </NavLink>

        <NavLink 
          to="/mini-games" 
          className={({ isActive }) => `
            flex-1 text-center p-2 rounded-xl transition-all duration-200
            ${isActive 
              ? 'text-green-500 bg-gray-800' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }
          `}
        >
          <div className="flex flex-col items-center">
            <HiOutlinePuzzle className="w-6 h-6" />
            <span className="text-xs mt-1">Napveture</span>
          </div>
        </NavLink>

        <NavLink 
          to="/dreamlog" 
          className={({ isActive }) => `
            flex-1 text-center p-2 rounded-xl transition-all duration-200
            ${isActive 
              ? 'text-green-500 bg-gray-800' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }
          `}
        >
          <div className="flex flex-col items-center">
            <GrArticle className="w-6 h-6" />
            <span className="text-xs mt-1">Dreamlog</span>
          </div>
        </NavLink>
      </div>
    </nav>
  )
}