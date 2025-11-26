// src/pages/VideoDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaPlay, FaClock, FaVolumeUp } from 'react-icons/fa';
import CustomVideoPlayer from '../components/CustomVideoPlayer';

export default function VideoDetail() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const response = await apiService.getVideo(id);
        if (response.success) {
          setVideo(response.result.video);
        } else {
          toast.error(response.message || 'Failed to fetch video');
          navigate('/sleeptube');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to fetch video');
        navigate('/sleeptube');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, navigate]);

  // Fetch related videos after we have the current video
  useEffect(() => {
    if (!video) return; // Wait until we have video details
    
    const fetchRelatedVideos = async () => {
      try {
        setRelatedLoading(true);
        
        // Option 1: Use a dedicated related videos endpoint if available
        // const response = await apiService.getRelatedVideos(video.id, video.category);
        
        // Option 2: Use existing endpoint with parameters
        const response = await apiService.getVideos({
          category: video.category,
          limit: 8,
          exclude: id
        });
        
        if (response && response.result && response.result.videos) {
          // Sort by relevance (newest first)
          const sortedRelated = response.result.videos
            .filter(v => v.id !== id) // Double-check to exclude current video
            .sort((a, b) => {
              // Sort by creation date (newest first)
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .slice(0, 6); // Show up to 6 related videos
          
          setRelatedVideos(sortedRelated);
        }
      } catch (error) {
        console.error('Error fetching related videos:', error);
        toast.error('Failed to load related videos');
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelatedVideos();
  }, [video]);

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
      return 'just now';
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
      return date.toLocaleDateString('id-ID');
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

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-400">Video not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/sleeptube')}
            className="flex items-center text-green-500 hover:text-green-400"
          >
            <FaArrowLeft className="mr-2" />
            Back to Videos
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700">
              {/* Custom Video Player */}
              <CustomVideoPlayer video={video} />
              
              {/* Video Info */}
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4 text-white">{video.title}</h1>
                
                <div className="flex flex-wrap items-center text-gray-400 mb-6">
                  <span className="flex items-center mr-4 mb-2">
                    <FaClock className="mr-1" />
                    {formatDuration(video.duration)}
                  </span>
                  <span className="flex items-center mr-4 mb-2">
                    <FaVolumeUp className="mr-1" />
                    {video.category.replace('-', ' ')}
                  </span>
                  <span className="mb-2">
                    {formatRelativeTime(video.createdAt)}
                  </span>
                </div>
                
                {/* Description */}
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300">{video.description}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Videos */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Related Videos</h2>
            
            {relatedLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 animate-pulse">
                    <div className="flex">
                      <div className="w-32 h-20 bg-gray-700"></div>
                      <div className="p-3 flex-1">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                        <div className="flex justify-between">
                          <div className="h-3 bg-gray-700 rounded w-16"></div>
                          <div className="h-3 bg-gray-700 rounded w-12"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {relatedVideos.length > 0 ? (
                  relatedVideos.map((relatedVideo) => (
                    <div
                      key={relatedVideo.id}
                      className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 cursor-pointer hover:bg-gray-800/70 transition-colors"
                      onClick={() => navigate(`/sleeptube/${relatedVideo.id}`)}
                    >
                      <div className="flex">
                        <img
                          src={relatedVideo.thumbnail}
                          alt={relatedVideo.title}
                          className="w-32 h-20 object-cover"
                        />
                        <div className="p-3 flex-1">
                          <h3 className="font-medium text-white mb-1 line-clamp-2">{relatedVideo.title}</h3>
                          <div className="flex justify-between items-center text-xs text-gray-400">
                            <span>{formatDuration(relatedVideo.duration)}</span>
                            <span className="flex items-center text-green-400">
                              <FaPlay className="mr-1" />
                              Play
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No related videos found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}