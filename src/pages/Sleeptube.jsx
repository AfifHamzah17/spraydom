import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { FaPlus, FaArrowLeft, FaPlay, FaClock, FaFilter } from 'react-icons/fa';

export default function Sleeptube() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await apiService.getVideos();
        
        // Urutkan video berdasarkan createdAt (terbaru dulu)
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
      return date.toLocaleDateString('id-ID');
    }
  };

  // Filter videos by category
  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-xl">Loading videos...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center text-green-500 hover:text-green-400 mr-4"
            >
              <FaArrowLeft className="mr-1" /> Back to Home
            </button>
            <h1 className="text-4xl font-bold">Sleeptube</h1>
          </div>
          
          {token && user?.role === 'admin' && (
            <button
              onClick={handleAddVideo}
              className="flex items-center bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FaPlus className="mr-2" />
              Add Video
            </button>
          )}
        </div>
        <p className="text-xl text-gray-300 mt-2">
          Video pendek untuk meningkatkan rasa kantuk dan kualitas tidur Anda
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <FaFilter className="text-gray-400" />
          <span className="text-gray-300">Kategori:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', name: 'Semua' },
            { id: 'sleep-music', name: 'Musik Tidur' },
            { id: 'meditation', name: 'Meditasi' },
            { id: 'nature-sounds', name: 'Suara Alam' },
            { id: 'white-noise', name: 'White Noise' },
            { id: 'guided-meditation', name: 'Meditasi Terpandu' },
            { id: 'breathing', name: 'Pernapasan' },
            { id: 'asmr', name: 'ASMR' }
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
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
          <p className="text-gray-400 text-lg">Tidak ada video dalam kategori ini</p>
          {token && user?.role === 'admin' && (
            <button
              onClick={handleAddVideo}
              className="mt-4 flex items-center bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors mx-auto"
            >
              <FaPlus className="mr-2" />
              Tambah Video Pertama
            </button>
          )}
        </div>
      )}
    </div>
  );
}