// src/pages/Sleeptube.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Sample video data - ini nantinya akan diambil dari backend
const sampleVideos = [
  {
    id: 1,
    title: "Relaxing Yawning Compilation",
    description: "A soothing collection of yawning videos to help induce sleepiness",
    thumbnail: "https://via.placeholder.com/300x200?text=Yawning+Video",
    duration: "10:45",
    views: "12.5K"
  },
  {
    id: 2,
    title: "Gentle Breathing Exercises",
    description: "Follow these breathing techniques to calm your mind before sleep",
    thumbnail: "https://via.placeholder.com/300x200?text=Breathing+Exercise",
    duration: "8:20",
    views: "8.7K"
  },
  {
    id: 3,
    title: "Rain Sounds for Deep Sleep",
    description: "Natural rain sounds to help you fall asleep faster",
    thumbnail: "https://via.placeholder.com/300x200?text=Rain+Sounds",
    duration: "30:00",
    views: "24.3K"
  },
  {
    id: 4,
    title: "ASMR Sleep Therapy",
    description: "Gentle sounds and whispers to promote deep relaxation",
    thumbnail: "https://via.placeholder.com/300x200?text=ASMR+Therapy",
    duration: "15:30",
    views: "18.9K"
  }
];

export default function Sleeptube() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch videos
    setVideos(sampleVideos);
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleClosePlayer = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-green-500 hover:text-green-400 mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>
        
        <h1 className="text-4xl font-bold mb-2">Sleeptube</h1>
        <p className="text-xl text-gray-300">
          Soothing videos to help you relax and fall asleep faster
        </p>
      </div>

      {selectedVideo ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
            <button 
              onClick={handleClosePlayer}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="aspect-w-16 aspect-h-9 bg-black rounded-xl mb-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white">Video Player</p>
              <p className="text-gray-400 text-sm mt-2">{selectedVideo.title}</p>
            </div>
          </div>
          
          <div className="flex justify-between text-gray-400 mb-4">
            <span>{selectedVideo.views} views</span>
            <span>{selectedVideo.duration}</span>
          </div>
          
          <p className="text-gray-300">{selectedVideo.description}</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <motion.div 
              key={video.id}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold">{video.title}</h3>
                </div>
                <div className="absolute top-4 right-4 bg-black/70 px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{video.description}</p>
                
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>{video.views} views</span>
                  <button className="text-green-500 hover:text-green-400">
                    Watch
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}