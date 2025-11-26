// src/components/ProductCard.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp, FaEye, FaShoppingCart, FaStar, FaHeart, FaTag, FaTruck, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa'
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductCard({ product, isAdmin = false, onDelete }) {
  const [isSaved, setIsSaved] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const waUrl = `https://wa.me/${product.wa_number}?text=${encodeURIComponent(product.wa_message || `Hello, I'm interested in product ${product.name}`)}`
  
  // Check if product is in favorites
  const favorited = isFavorite(product.id);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price || 0);
  }

  const toggleSaveProduct = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (favorited) {
      removeFromFavorites(product.id);
      toast.success('Removed from favorites');
    } else {
      addToFavorites(product);
      toast.success('Added to favorites');
    }
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toast.success(`${product.name} added to cart!`);
  }
  
  const handleEdit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Navigate to edit page
    window.location.href = `/products/edit/${product.id}`;
  }

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Show the modal instead of window.confirm
    setShowDeleteModal(true);
  }

  const confirmDelete = () => {
    setShowDeleteModal(false);
    // Call the parent component's delete function if provided
    if (onDelete) {
      onDelete(product);
    } else {
      // Fallback if no parent function is provided
      console.log(`Deleting product ${product.id}`);
      toast.success('Product deleted successfully!');
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false);
  }

  return (
    <>
      <div className="bg-gray-800/50 rounded-xl overflow-hidden transition-all duration-300 hover:bg-gray-800/70 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 border border-gray-700 flex flex-col h-full">
        {/* Product Image Section */}
        <div className="relative">
          <Link to={`/products/${product.id}`}>
            <img 
              src={product.image || 'https://via.placeholder.com/400x300.png?text=No+Image'} // Placeholder image if none available
              alt={product.name} 
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            
            {/* Badge for new products or discounts */}
            {product.isNew && (
              <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                NEW
              </div>
            )}
            
            {product.discount > 0 && (
              <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{product.discount}%
              </div>
            )}
            
            {/* Save Product Button */}
            <button
              onClick={toggleSaveProduct}
              className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Save product"
            >
              <FaHeart className={favorited ? "text-red-500" : ""} />
            </button>
            
            {/* Product Name in Bottom Overlay */}
            <div className="absolute bottom-3 left-3 right-12">
              <h3 className="text-lg font-bold text-white line-clamp-1">{product.name}</h3>
            </div>
          </Link>
        </div>
        
        {/* Product Details Section */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Product Category */}
          {product.category && (
            <div className="flex items-center mb-2">
              <FaTag className="text-gray-400 mr-1 text-xs" />
              <span className="text-xs text-gray-400">{product.category}</span>
            </div>
          )}
          
          {/* Product Rating */}
          {product.rating && (
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(product.rating) ? "" : "text-gray-600"} />
                ))}
              </div>
              <span className="text-xs text-gray-400 ml-2">({product.reviews || 0} reviews)</span>
            </div>
          )}
          
          {/* Product Description */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">{product.description || 'No description available for this product.'}</p>
          
          {/* Price and Availability Status */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                {product.discount > 0 ? (
                  <>
                    <span className="text-xl font-bold text-green-400">{formatPrice(product.price * (1 - product.discount/100))}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">{formatPrice(product.price)}</span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-green-400">{formatPrice(product.price)}</span>
                )}
              </div>
              
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs text-gray-400">Available</span>
              </div>
            </div>
            
            {/* Shipping Info */}
            {product.freeShipping && (
              <div className="flex items-center text-xs text-gray-400">
                <FaTruck className="mr-1" />
                <span>Free Shipping</span>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {/* Detail and Cart buttons for all users */}
            <Link
              to={`/products/${product.id}`}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center text-xs sm:text-sm min-w-0"
            >
              <FaEye className="mr-1 flex-shrink-0" />
              <span className="truncate">View</span>
            </Link>
            
            {/* Order via WhatsApp Button */}
            {/* <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center text-xs sm:text-sm min-w-0"
            >
              <FaWhatsapp className="mr-1 flex-shrink-0" />
              <span className="truncate">Order</span>
            </a> */}

            {/* Edit and Delete buttons only for Admin */}
            {isAdmin && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center text-xs sm:text-sm min-w-0"
                >
                  <FaEdit className="mr-1 flex-shrink-0" />
                  <span className="truncate"></span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center text-xs sm:text-sm min-w-0"
                >
                  <FaTrash className="mr-1 flex-shrink-0" />
                  <span className="truncate"></span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - Using AnimatePresence for proper animations */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={cancelDelete}
            ></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative bg-gray-800 rounded-xl p-6 max-w-md mx-4 border border-gray-700 shadow-xl z-[10000]"
            >
              <div className="flex flex-col items-center">
                <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Confirm Delete</h3>
                <p className="text-gray-300 text-center mb-6">
                  Are you sure you want to delete the product "{product.name}"?
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Yes, Delete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}