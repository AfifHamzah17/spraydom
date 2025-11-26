// src/pages/Video.jsx
import React, { useState, useEffect } from 'react';
import VideoPlayerCustom from "../components/VideoPlayerCustom";
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

export default function Video() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await apiService.getVideos();
        if (response.success) {
          const videosData = response.result.videos;
          setVideos(videosData);
          if (videosData.length > 0) {
            setSelectedVideo(videosData[0]);
          }
        } else {
          toast.error(response.message || 'Failed to fetch videos');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Videos</h1>
      
      {videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No videos available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {selectedVideo && (
              <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700">
                <VideoPlayerCustom src={selectedVideo.url} />
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                  <p className="text-gray-300">{selectedVideo.description}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Video List</h2>
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoSelect(video)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedVideo && selectedVideo.id === video.id
                    ? 'bg-gray-800'
                    : 'hover:bg-gray-800/50'
                }`}
              >
                <div className="w-24 h-16 rounded-md overflow-hidden mr-4">
                  <img 
                    src={video.thumbnail || 'https://via.placeholder.com/96x64'} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{video.title}</div>
                  <div className="text-sm text-gray-400">{video.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// // src/pages/ProductDetail.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { 
//   FaArrowLeft, 
//   FaShoppingCart, 
//   FaTag, 
//   FaBox, 
//   FaStar, 
//   FaHeart, 
//   FaShare, 
//   FaTruck,
//   FaShieldAlt,
//   FaUndo,
//   FaCheck,
//   FaMinus,
//   FaPlus
// } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import apiService from '../services/api';
// import { useAuth } from '../context/AuthContext';

// export default function ProductDetail() {
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [isSaved, setIsSaved] = useState(false);
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addToFavorites, removeFromFavorites, isFavorite } = useAuth();

//   // Helper function to format price in Indonesian Rupiah
//   const formatPrice = (price) => {
//     const numPrice = parseFloat(price) || 0;
//     return new Intl.NumberFormat('id-ID', {
//       style: 'currency',
//       currency: 'IDR',
//       minimumFractionDigits: 0
//     }).format(numPrice);
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const response = await apiService.getProduct(id);
//         if (response.success) {
//           setProduct(response.result.product);
//           // Check if product is in favorites
//           setIsSaved(isFavorite(response.result.product.id));
//         } else {
//           toast.error(response.message || 'Failed to fetch product');
//           navigate('/products');
//         }
//       } catch (error) {
//         toast.error(error.message || 'Failed to fetch product');
//         navigate('/products');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id, navigate, isFavorite]);

//   const handleAddToCart = () => {
//     toast.success(`${product.name} added to cart!`);
//   };

//   const handleToggleSave = () => {
//     if (isSaved) {
//       removeFromFavorites(product.id);
//       toast.success('Removed from favorites');
//     } else {
//       addToFavorites(product);
//       toast.success('Added to favorites');
//     }
//     setIsSaved(!isSaved);
//   };

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: product.name,
//         text: product.description,
//         url: window.location.href
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       toast.success('Product link copied to clipboard!');
//     }
//   };

//   const handleQuantityChange = (action) => {
//     if (action === 'increase') {
//       setQuantity(prev => prev + 1);
//     } else if (action === 'decrease' && quantity > 1) {
//       setQuantity(prev => prev - 1);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="text-center py-12">
//             <p className="text-gray-400">Product not found</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Prepare product images (main image + additional images if available)
//   const productImages = [product.image, ...(product.additionalImages || [])].filter(Boolean);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Breadcrumb Navigation */}
//         <div className="mb-6 flex items-center text-sm">
//           <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
//           <span className="mx-2 text-gray-500">/</span>
//           <Link to="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link>
//           <span className="mx-2 text-gray-500">/</span>
//           <span className="text-white">{product.name}</span>
//         </div>

//         {/* Back Button */}
//         <div className="mb-8">
//           <button 
//             onClick={() => navigate('/products')}
//             className="flex items-center text-green-500 hover:text-green-400 transition-colors"
//           >
//             <FaArrowLeft className="mr-2" />
//             Back to Products
//           </button>
//         </div>
        
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Product Images */}
//           <div className="space-y-4">
//             <div className="relative overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700">
//               <motion.img 
//                 src={productImages[selectedImage] || 'https://via.placeholder.com/600x600.png?text=No+Image'} 
//                 alt={product.name} 
//                 className="w-full h-96 object-cover"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 key={selectedImage}
//               />
              
//               {/* Product Badges */}
//               <div className="absolute top-4 left-4 flex flex-col gap-2">
//                 {product.isNew && (
//                   <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
//                     BARU
//                   </span>
//                 )}
//                 {product.discount > 0 && (
//                   <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
//                     -{product.discount}%
//                   </span>
//                 )}
//               </div>
              
//               {/* Save and Share Buttons */}
//               <div className="absolute top-4 right-4 flex gap-2">
//                 <button
//                   onClick={handleToggleSave}
//                   className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
//                   aria-label="Save product"
//                 >
//                   <FaHeart className={isSaved ? "text-red-500" : ""} />
//                 </button>
//                 <button
//                   onClick={handleShare}
//                   className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
//                   aria-label="Share product"
//                 >
//                   <FaShare />
//                 </button>
//               </div>
//             </div>
            
//             {/* Thumbnail Gallery */}
//             {productImages.length > 1 && (
//               <div className="flex gap-2 overflow-x-auto">
//                 {productImages.map((image, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(index)}
//                     className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
//                       selectedImage === index ? 'border-green-500' : 'border-gray-700'
//                     }`}
//                   >
//                     <img 
//                       src={image} 
//                       alt={`${product.name} ${index + 1}`} 
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
          
//           {/* Product Details */}
//           <div className="space-y-6">
//             {/* Product Title and Rating */}
//             <div>
//               <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
//               {/* Rating and Reviews */}
//               <div className="flex items-center mb-4">
//                 <div className="flex text-yellow-400 mr-2">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar key={i} className={i < Math.floor(product.rating || 0) ? "" : "text-gray-600"} />
//                   ))}
//                 </div>
//                 <span className="text-gray-400 mr-2">{product.rating || 0}.0</span>
//                 <span className="text-gray-400">({product.reviews || 0} reviews)</span>
//               </div>
//             </div>
            
//             {/* Price Section */}
//             <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
//               <div className="flex items-center mb-2">
//                 {product.discount > 0 ? (
//                   <>
//                     <span className="text-3xl font-bold text-green-400">
//                       {formatPrice((parseFloat(product.price) || 0) * (1 - product.discount/100))}
//                     </span>
//                     <span className="ml-3 text-xl text-gray-500 line-through">
//                       {formatPrice(product.price)}
//                     </span>
//                   </>
//                 ) : (
//                   <span className="text-3xl font-bold text-green-400">
//                     {formatPrice(product.price)}
//                   </span>
//                 )}
//               </div>
              
//               {/* Availability */}
//               <div className="flex items-center">
//                 <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
//                 <span className="text-sm text-gray-300">Tersedia</span>
//               </div>
//             </div>
            
//             {/* Category */}
//             {product.category && (
//               <div className="flex items-center text-gray-400">
//                 <FaTag className="mr-2" />
//                 <span>{product.category}</span>
//               </div>
//             )}
            
//             {/* Description */}
//             <div>
//               <h2 className="text-xl font-semibold mb-3">Deskripsi</h2>
//               <p className="text-gray-300 leading-relaxed">
//                 {product.description || 'Tidak ada deskripsi untuk produk ini.'}
//               </p>
//             </div>
            
//             {/* Features */}
//             {product.features && product.features.length > 0 && (
//               <div>
//                 <h2 className="text-xl font-semibold mb-3">Fitur Utama</h2>
//                 <ul className="space-y-2">
//                   {product.features.map((feature, index) => (
//                     <li key={index} className="flex items-start">
//                       <FaCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
//                       <span className="text-gray-300">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
            
//             {/* Quantity Selector */}
//             <div className="flex items-center space-x-4">
//               <span className="text-gray-300">Jumlah:</span>
//               <div className="flex items-center bg-gray-800/50 rounded-lg border border-gray-700">
//                 <button
//                   onClick={() => handleQuantityChange('decrease')}
//                   className="p-2 text-gray-400 hover:text-white transition-colors"
//                   disabled={quantity <= 1}
//                 >
//                   <FaMinus />
//                 </button>
//                 <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
//                 <button
//                   onClick={() => handleQuantityChange('increase')}
//                   className="p-2 text-gray-400 hover:text-white transition-colors"
//                 >
//                   <FaPlus />
//                 </button>
//               </div>
//             </div>
            
//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 pt-4">
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleAddToCart}
//                 className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
//               >
//                 <FaShoppingCart className="mr-2" />
//                 Tambah ke Keranjang
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleToggleSave}
//                 className={`flex-1 ${isSaved ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-700 hover:bg-gray-600'} text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center`}
//               >
//                 <FaHeart className="mr-2" />
//                 {isSaved ? 'Hapus dari Favorit' : 'Simpan untuk Nanti'}
//               </motion.button>
//             </div>
            
//             {/* Product Benefits */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
//               <div className="flex items-center text-gray-300">
//                 <FaTruck className="text-green-500 mr-2" />
//                 <span className="text-sm">Gratis Ongkir</span>
//               </div>
//               <div className="flex items-center text-gray-300">
//                 <FaShieldAlt className="text-green-500 mr-2" />
//                 <span className="text-sm">Garansi 1 Tahun</span>
//               </div>
//               <div className="flex items-center text-gray-300">
//                 <FaUndo className="text-green-500 mr-2" />
//                 <span className="text-sm">Pengembalian 30 Hari</span>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Additional Information Tabs */}
//         <div className="mt-12 bg-gray-800/50 rounded-xl border border-gray-700">
//           {/* Tab Headers */}
//           <div className="border-b border-gray-700">
//             <div className="flex space-x-8 px-6">
//               <button className="py-4 border-b-2 border-green-500 text-green-500 font-medium">
//                 Spesifikasi
//               </button>
//               <button className="py-4 text-gray-400 hover:text-white transition-colors">
//                 Ulasan
//               </button>
//               <button className="py-4 text-gray-400 hover:text-white transition-colors">
//                 Pengiriman & Pengembalian
//               </button>
//             </div>
//           </div>
          
//           {/* Tab Content */}
//           <div className="p-6">
//             {product.specifications && Object.keys(product.specifications).length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {Object.entries(product.specifications).map(([key, value]) => (
//                   <div key={key} className="flex justify-between py-3 border-b border-gray-700">
//                     <span className="text-gray-400">{key}:</span>
//                     <span className="text-gray-300">{value}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-400 text-center py-8">Tidak ada spesifikasi untuk produk ini.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// } 