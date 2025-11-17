import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { FaPlus, FaArrowLeft, FaClock, FaArrowRight } from 'react-icons/fa';

export default function Dreamlog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDreamlogs();
        
        // Urutkan artikel berdasarkan createdAt (terbaru dulu)
        const sortedArticles = (response.result.dreamlogs || []).sort((a, b) => {
          // Konversi string tanggal ke objek Date untuk perbandingan
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          
          // Urutkan dari terbaru ke terlama
          return dateB - dateA;
        });
        
        setArticles(sortedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = (article) => {
    navigate(`/dreamlog/${article.id}`);
  };

  const handleAddArticle = () => {
    navigate('/admin/dreamlog-create');
  };

  // Fungsi untuk membersihkan Markdown dan membuat preview teks
  const getPlainTextFromMarkdown = (markdown) => {
    if (!markdown) return '';
    
    return markdown
      // Hapus header
      .replace(/^#{1,6}\s+/gm, '')
      // Hapus bold
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Hapus italic
      .replace(/\*(.*?)\*/g, '$1')
      // Hapus underline
      .replace(/<u>(.*?)<\/u>/g, '$1')
      // Hapus link
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Hapus blockquote
      .replace(/^>\s+/gm, '')
      // Hapus list
      .replace(/^[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      // Hapus HTML tags
      .replace(/<[^>]*>/g, '')
      // Hapus multiple spaces
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Fungsi untuk memformat waktu relatif (contoh: "2 jam yang lalu")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Baru saja';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} menit yang lalu`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} jam yang lalu`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} hari yang lalu`;
    } else {
      return formatDate(dateString);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-xl">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
      <h1 className="text-4xl font-bold text-center">Dreamlog</h1>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-green-500 hover:text-green-400 mr-4"
            >
              <FaArrowLeft className="mr-1" /> Back to Home
            </button>

          </div>
          
          {token && user?.role === 'admin' && (
            <button
              onClick={handleAddArticle}
              className="flex items-center bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FaPlus className="mr-2" />
              Add Article
            </button>
          )}
        </div>
        <p className="text-xl text-gray-300 mt-2">
          Insights and articles about sleep, dreams, and insomnia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => {
          // Ambil teks biasa dari Markdown untuk preview
          const plainText = getPlainTextFromMarkdown(article.content);
          const previewText = plainText.length > 100 
            ? `${plainText.substring(0, 100)}...` 
            : plainText;
            
          return (
            <motion.div 
              key={article.id}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 cursor-pointer h-full"
              onClick={() => handleArticleClick(article)}
            >
              <div className="md:flex h-full">
                {article.image && article.image !== "" && (
                  <div className="md:w-1/3">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                )}
                
                <div className={`p-5 ${article.image && article.image !== "" ? 'md:w-2/3' : 'md:w-full'} flex flex-col h-full`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">{article.title}</h3>
                    <span className="flex items-center text-gray-400 text-xs bg-gray-900/50 px-2 py-1 rounded-full">
                      <FaClock className="mr-1" />
                      {formatRelativeTime(article.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex-grow mb-4">
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {previewText}
                    </p>
                  </div>
                  
                  {/* Footer di bagian paling bawah */}
                  <div className="mt-auto pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">{article.readTime}</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center text-green-400 hover:text-green-300 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArticleClick(article);
                        }}
                      >
                        <span className="flex items-center px-3 py-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                          <span className="mr-1">Read More</span>
                          <FaArrowRight className="text-xs" />
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No articles found</p>
          {token && user?.role === 'admin' && (
            <button
              onClick={handleAddArticle}
              className="mt-4 flex items-center bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors mx-auto"
            >
              <FaPlus className="mr-2" />
              Create Your First Article
            </button>
          )}
        </div>
      )}
    </div>
  );
}