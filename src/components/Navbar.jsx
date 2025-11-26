// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-900/90 backdrop-blur-sm py-2 shadow-lg' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src="/image/spraydom.png" alt="Spraydom" className="h-12 w-auto" />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
               {/* test */}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
               
            <Link
              to="/insomnia-check"
              className="px-5 py-4 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
            >
              Insomnia Check
            </Link>
{/*            <Link
              to="/sleeptube"
              className="px-5 py-4 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
            >
              Video
            </Link>
            <Link
              to="/mini-games"
              className="px-5 py-4 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
            >
              Games
            </Link>
            <Link
              to="/audio"
              className="px-5 py-4 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
            >
              Audio
            </Link>
            <Link
              to="/products"
              className="px-5 py-4 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
            >
              Products
            </Link>
            <Link
              to="/dreamlog"
              className="px-5 py-4 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
            >
              Dreamlog
            </Link>
            <Link
              to="/"
              className="px-5 py-4 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
            >
              Home
            </Link> */}
              {isAuthenticated ? (
                <div className="relative ml-3">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-300">
                      Welcome, {user?.nama || user?.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-sm text-gray-300 hover:text-white"
                    >
                      <FaSignOutAlt className="mr-1" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">

                </div>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 focus:outline-none"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
                <div className="px-3 py-2 text-sm text-gray-300">
                  Welcome to spraydom, Admin {user?.nama ? user?.nama : user?.email}
                </div>
            ) : null}
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/dreamlog"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              onClick={toggleMenu}
            >
              Dreamlog
            </Link>
            <Link
              to="/product"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              onClick={toggleMenu}
            >
              Products
            </Link>
            <Link
              to="/audio"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              onClick={toggleMenu}
            >
              Audio
            </Link>
            <Link
              to="/daily-routine"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              onClick={toggleMenu}
            >
              Routine
            </Link>
            <Link
              to="/mini-games"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              onClick={toggleMenu}
            >
              Games
            </Link>
            <Link
              to="/video"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              onClick={toggleMenu}
            >
              Video
            </Link>
            <Link
              to="/insomnia-check"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              onClick={toggleMenu}
            >
              Insomnia Check
            </Link>
            
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    handleLogout()
                    toggleMenu()
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                >
                  <FaSignOutAlt className="inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}