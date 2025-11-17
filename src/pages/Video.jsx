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