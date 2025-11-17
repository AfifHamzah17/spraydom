import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaPlay, FaClock, FaVolumeUp } from 'react-icons/fa';

export default function VideoDetail() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const response = await apiService.getVideo(id);
        if (response.success) {
          setVideo(response.result.video);
          
          // Fetch related videos (same category)
          const videosResponse = await apiService.getVideos();
          const related = videosResponse.result.videos
            .filter(v => v.id !== id && v.category === response.result.video.category)
            .slice(0, 4);
          setRelatedVideos(related);
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-400">Video not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button 
          onClick={() => navigate('/sleeptube')}
          className="flex items-center text-green-500 hover:text-green-400 mb-4"
        >
          <FaArrowLeft className="mr-1" /> Back to Sleeptube
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            {/* Video Player */}
            <div className="relative mb-6">
              <video
                className="w-full rounded-lg"
                controls
                poster={video.thumbnail}
              >
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            
            {/* Video Info */}
            <h1 className="text-3xl font-bold mb-4 text-white">{video.title}</h1>
            
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
              <p className="text-gray-300 mb-4">{video.description}</p>
            </div>
          </div>
        </div>
        
        {/* Related Videos */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Video Terkait</h2>
          <div className="space-y-4">
            {relatedVideos.map((relatedVideo) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}