// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  FaArrowLeft, 
  FaShoppingCart, 
  FaTag, 
  FaBox, 
  FaStar, 
  FaHeart, 
  FaShare, 
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaCheck,
  FaMinus,
  FaPlus,
  FaWhatsapp
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useAuth();

  // Helper function to format price in Indonesian Rupiah
  const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(numPrice);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProduct(id);
        if (response.success) {
          setProduct(response.result.product);
          // Check if product is in favorites
          setIsSaved(isFavorite(response.result.product.id));
        } else {
          toast.error(response.message || 'Failed to fetch product');
          navigate('/products');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to fetch product');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, isFavorite]);

  const handleOrder = () => {
    // Create a more detailed WhatsApp message with product info and quantity
    const message = `Hello, I would like to order:\n\n📦 *Product:* ${product.name}\n🔢 *Quantity:* ${quantity} ${quantity > 1 ? 'units' : 'unit'}\n💰 *Price per unit:* ${formatPrice(product.price)}\n💳 *Total Price:* ${formatPrice((parseFloat(product.price) || 0) * quantity)}\n\nPlease let me know the availability and payment method. Thank you!`;
    
    const waUrl = `https://wa.me/${product.wa_number || '628123456789'}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleToggleSave = () => {
    if (isSaved) {
      removeFromFavorites(product.id);
      toast.success('Removed from favorites');
    } else {
      addToFavorites(product);
      toast.success('Added to favorites');
    }
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-400">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare product images (main image + additional images if available)
  const productImages = [product.image, ...(product.additionalImages || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        {/* <div className="mb-6 flex items-center text-sm">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-white">{product.name}</span>
        </div> */}

        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/products')}
            className="flex items-center text-green-500 hover:text-green-400 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Products
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700">
              <motion.img 
                src={productImages[selectedImage] || 'https://via.placeholder.com/600x600.png?text=No+Image'} 
                alt={product.name} 
                className="w-full h-96 object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                key={selectedImage}
              />
              
              {/* Product Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    NEW
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                )}
              </div>
              
              {/* Save and Share Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleToggleSave}
                  className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Save product"
                >
                  <FaHeart className={isSaved ? "text-red-500" : ""} />
                </button>
                <button
                  onClick={handleShare}
                  className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  aria-label="Share product"
                >
                  <FaShare />
                </button>
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-green-500' : 'border-gray-700'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Rating and Reviews */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(product.rating || 5) ? "" : "text-gray-600"} />
                  ))}
                </div>
                <span className="text-gray-400 mr-2">{product.rating || 5}.0</span>
                {/* <span className="text-gray-400">({product.reviews || 0} reviews)</span> */}
              </div>
            </div>
            
            {/* Price Section */}
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center mb-2">
                {product.discount > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-green-400">
                      {formatPrice((parseFloat(product.price) || 0) * (1 - product.discount/100))}
                    </span>
                    <span className="ml-3 text-xl text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-green-400">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              {/* Availability */}
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-300">In Stock</span>
              </div>
            </div>
            
            {/* Category */}
            {product.category && (
              <div className="flex items-center text-gray-400">
                <FaTag className="mr-2" />
                <span>{product.category}</span>
              </div>
            )}
            
            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Key Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Quantity:</span>
              <div className="flex items-center bg-gray-800/50 rounded-lg border border-gray-700">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOrder}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              >
                <FaWhatsapp className="mr-2" />
                Order via WhatsApp
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleSave}
                className={`flex-1 ${isSaved ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-700 hover:bg-gray-600'} text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center`}
              >
                <FaHeart className="mr-2" />
                {isSaved ? 'Remove from Favorites' : 'Save for Later'}
              </motion.button>
            </div>
            
            {/* Product Benefits */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center text-gray-300">
                <FaTruck className="text-green-500 mr-2" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaShieldAlt className="text-green-500 mr-2" />
                <span className="text-sm">1 Year Warranty</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaUndo className="text-green-500 mr-2" />
                <span className="text-sm">30-Day Returns</span>
              </div>
            </div> */}
          </div>
        </div>
        
        {/* Extended Product Description Section */}
        <div className="mt-12 bg-gray-800/50 rounded-xl border border-gray-700 p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Product Description</h2>
          <div className="prose prose-invert max-w-none">
            {product.description ? (
              <div className="text-gray-300 leading-relaxed space-y-4">
                {/* Split description into paragraphs for better readability */}
                {product.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No description available for this product.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}