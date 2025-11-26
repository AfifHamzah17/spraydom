// src/pages/Dreamlog.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { FaPlus, FaArrowLeft, FaClock, FaArrowRight, FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';

export default function Dreamlog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDreamlogs();
        
        // Sort articles by createdAt (newest first)
        const sortedArticles = (response.result.dreamlogs || []).sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
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

  // Filter and sort articles
  const getFilteredAndSortedArticles = () => {
    let filteredArticles = [...articles];
    
    // Filter by search term
    if (searchTerm) {
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (filterCategory !== 'all') {
      filteredArticles = filteredArticles.filter(article => 
        article.category === filterCategory
      );
    }
    
    // Sorting
    switch (sortBy) {
      case 'date-asc':
        filteredArticles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'date-desc':
        filteredArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'title-asc':
        filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        filteredArticles.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    return filteredArticles;
  };

  const handleArticleClick = (article) => {
    navigate(`/dreamlog/${article.id}`);
  };

  const handleAddArticle = () => {
    navigate('/admin/dreamlog-create');
  };

  // Function to clean Markdown and create text preview
  const getPlainTextFromMarkdown = (markdown) => {
    if (!markdown) return '';
    
    return markdown
      // Remove headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Remove italic
      .replace(/\*(.*?)\*/g, '$1')
      // Remove underline
      .replace(/<u>(.*?)<\/u>/g, '$1')
      // Remove links
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove blockquote
      .replace(/^>\s+/gm, '')
      // Remove lists
      .replace(/^[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove multiple spaces
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Function to format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hours ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} days ago`;
    } else {
      return formatDate(dateString);
    }
  };

  // Skeleton Loader Component for Article Cards
  const ArticleSkeleton = () => (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 animate-pulse">
      <div className="md:flex h-full">
        <div className="md:w-1/3">
          <div className="bg-gray-700 h-48 md:h-full"></div>
        </div>
        <div className="p-5 md:w-2/3 flex flex-col h-full">
          <div className="flex justify-between items-start mb-3">
            <div className="h-6 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </div>
          <div className="flex-grow mb-4">
            <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
          </div>
          <div className="mt-auto pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-gray-700 rounded w-16"></div>
              <div className="h-8 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Skeleton Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="h-10 bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-64 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-700 rounded w-36 mt-4 md:mt-0 animate-pulse"></div>
          </div>
          
          {/* Skeleton Search & Filter */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700 animate-pulse">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="h-10 bg-gray-700 rounded w-full"></div>
              <div className="h-10 bg-gray-700 rounded w-48"></div>
              <div className="h-10 bg-gray-700 rounded w-48"></div>
            </div>
          </div>
          
          {/* Skeleton Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredArticles = getFilteredAndSortedArticles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dreamlog</h1>
            <p className="text-gray-400">Find various interesting articles about sleep, dreams, and insomnia.</p>
          </div>
          
          {token && user?.role === 'admin' && (
            <button
              onClick={handleAddArticle}
              className="mt-4 md:mt-0 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-lg"
            >
              <FaPlus className="mr-2" />
              Add Article
            </button>
          )}
        </div>

        {/* Search, Filter, and Sort */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
              >
                <option value="all">All Categories</option>
                <option value="sleep">Sleep</option>
                <option value="dreams">Dreams</option>
                <option value="insomnia">Insomnia</option>
                <option value="health">Health</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <FaSortAmountDown className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
              >
                <option value="date-desc">Date (Newest)</option>
                <option value="date-asc">Date (Oldest)</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Article Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => {
            // Get plain text from Markdown for preview
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
                    
                    {/* Footer at the very bottom */}
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
        
        {filteredArticles.length === 0 && (
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
    </div>
  );
}