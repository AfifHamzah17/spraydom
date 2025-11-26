// src/pages/Sleeptube.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { FaPlus, FaArrowLeft, FaPlay, FaClock, FaFilter, FaSearch, FaSortAmountDown } from 'react-icons/fa';

export default function Sleeptube() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await apiService.getVideos();
        
        // Sort videos by createdAt (newest first)
        const sortedVideos = (response.result.videos || []).sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });
        
        setVideos(sortedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    navigate(`/sleeptube/${video.id}`);
  };

  const handleAddVideo = () => {
    navigate('/admin/video-create');
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
      return date.toLocaleDateString('en-US');
    }
  };

  // Filter and sort videos
  const filteredVideos = videos
    .filter(video => {
      const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        video.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // Sorting logic
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'duration-asc':
          return a.duration - b.duration;
        case 'duration-desc':
          return b.duration - a.duration;
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'date-desc':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Skeleton Loader Component for Video Card
  const VideoCardSkeleton = () => (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 animate-pulse">
      <div className="relative">
        <div className="bg-gray-700 h-40"></div>
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs w-12"></div>
      </div>
      <div className="p-4">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-full mb-3"></div>
        <div className="flex justify-between items-center">
          <div className="h-3 bg-gray-700 rounded w-24"></div>
          <div className="h-3 bg-gray-700 rounded w-16"></div>
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
          
          {/* Skeleton Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sleeptube</h1>
            <p className="text-gray-400">Short videos to improve your sleepiness and sleep quality</p>
          </div>
          
          {token && user?.role === 'admin' && (
            <button
              onClick={handleAddVideo}
              className="mt-4 md:mt-0 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-lg"
            >
              <FaPlus className="mr-2" />
              Add Video
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
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
              >
                <option value="all">All Categories</option>
                <option value="sleep-music">Sleep Music</option>
                <option value="meditation">Meditation</option>
                <option value="nature-sounds">Nature Sounds</option>
                <option value="white-noise">White Noise</option>
                <option value="guided-meditation">Guided Meditation</option>
                <option value="breathing">Breathing</option>
                <option value="asmr">ASMR</option>
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
                <option value="duration-asc">Duration (Short to Long)</option>
                <option value="duration-desc">Duration (Long to Short)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <motion.div
              key={video.id}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                  {formatDuration(video.duration)}
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-bold text-white mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{video.description}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span className="flex items-center">
                    <FaClock className="mr-1" />
                    {formatRelativeTime(video.createdAt)}
                  </span>
                  <div className="flex items-center text-green-400">
                    <FaPlay className="mr-1" />
                    Play
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No videos found in this category</p>
            {token && user?.role === 'admin' && (
              <button
                onClick={handleAddVideo}
                className="mt-4 flex items-center bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors mx-auto"
              >
                <FaPlus className="mr-2" />
                Add Your First Video
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}