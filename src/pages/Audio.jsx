// FILE: src/pages/Audio.jsx
import React, { useState, useEffect } from 'react';
import SpotifyPlayer from '../components/SpotifyPlayer';
import audiosData from '../data/audios.json'; // Import JSON directly

// Mapping kategori ke gambar
const categoryImages = {
  'All': '/images/all-categories.jpg',
  'Local Music': '/images/musik-lokal.jpg',
  'Nature': '/image/ps.png',
  'Folklore': '/images/stories.jpg',
  'ASMR': '/images/sleep.jpg',
  'Sleep Early': '/images/wellness.jpg'
};

export default function Audio() {
  const [audios, setAudios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  // Load audio data from imported JSON
  useEffect(() => {
    // console.log("Loading audio data...");
    if (audiosData && audiosData.length > 0) {
    //   console.log("Audio data loaded:", audiosData);
      setAudios(audiosData);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(audiosData.map(audio => audio.category))];
    //   console.log("Categories:", uniqueCategories);
      setCategories(uniqueCategories);
    } else {
    //   console.error("No audio data found");
    }
  }, []);
  
  // Filter audios based on selected category
  const filteredAudios = selectedCategory === 'All' 
    ? audios 
    : audios.filter(audio => audio.category === selectedCategory);
  
  // Handle play/pause
  const handlePlayPause = (track, index) => {
    // console.log("Play/pause clicked for track:", track.title);
    
    if (currentTrack && currentTrack.id === track.id) {
    //   console.log("Toggling play/pause for current track");
      setIsPlaying(!isPlaying);
    } else {
    //   console.log("Setting new track:", track.title);
      setCurrentTrack(track);
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };
  
  // Handle next track
  const handleNext = () => {
    // console.log("Next track clicked");
    const nextIndex = (currentTrackIndex + 1) % filteredAudios.length;
    // console.log("Next track index:", nextIndex);
    setCurrentTrack(filteredAudios[nextIndex]);
    setCurrentTrackIndex(nextIndex);
  };
  
  // Handle previous track
  const handlePrevious = () => {
    // console.log("Previous track clicked");
    const prevIndex = (currentTrackIndex - 1 + filteredAudios.length) % filteredAudios.length;
    // console.log("Previous track index:", prevIndex);
    setCurrentTrack(filteredAudios[prevIndex]);
    setCurrentTrackIndex(prevIndex);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-4">Audio</h1>
          <p className="text-gray-400">Explore our collection of relaxing sounds, music, and stories</p>
        </div>
        
        {/* Category Cards */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <div className="flex space-x-8 overflow-x-auto pb-4">
            {categories.map((category) => (
              <div
                key={category}
                onClick={() => {
                //   console.log("Category selected:", category);
                  setSelectedCategory(category);
                }}
                className={`flex-shrink-0 w-60 h-32 rounded-xl overflow-visible cursor-pointer transition-all duration-300 relative ${
                  selectedCategory === category
                    ? 'transform scale-105 ring-2 ring-green-500'
                    : ''
                }`}
              >
                {/* Background Image with overflow effect */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${categoryImages[category] || '/images/default-category.jpg'})` }}
                  ></div>
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 ${
                    selectedCategory === category 
                      ? 'bg-green-900/70' 
                      : 'bg-gray-900/70 hover:bg-gray-800/80'
                  }`}></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-4">
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <div className="text-sm text-gray-300">
                    {category === 'All' 
                      ? `${audios.length} tracks` 
                      : `${audios.filter(a => a.category === category).length} tracks`}
                  </div>
                </div>
                
                {/* Icon overlay at the bottom right - with overflow effect */}
                <div className="absolute -right-2 bottom-2 z-20">
                  <div className="relative">
                    {/* Background circle for the icon */}
                    <div className={`absolute inset-0 rounded-full ${
                      selectedCategory === category 
                        ? 'bg-green-600' 
                        : 'bg-gray-700'
                    }`}></div>
                    
                    {/* Music icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white p-1.5 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                </div>
                
                {/* Image that overflows on the right side */}
                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-0">
                  <img 
                    src={categoryImages[category] || '/images/default-category.jpg'} 
                    alt={category}
                    className="h-24 w-24 rounded-full object-cover opacity-30"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Track List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {selectedCategory === 'All' ? 'All Tracks' : selectedCategory}
          </h2>
          <div className="space-y-2">
            {filteredAudios.map((audio, index) => (
              <div
                key={audio.id}
                onClick={() => handlePlayPause(audio, index)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  currentTrack && currentTrack.id === audio.id
                    ? 'bg-gray-800'
                    : 'hover:bg-gray-800/50'
                }`}
              >
                <div className="w-12 h-12 rounded-md overflow-hidden mr-4">
                  <img 
                    src={audio.image} 
                    alt={audio.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{audio.title}</div>
                  <div className="text-sm text-gray-400">{audio.artist}</div>
                </div>
                <div className="text-sm text-gray-400">{audio.duration}</div>
                <div className="ml-4">
                  {currentTrack && currentTrack.id === audio.id && isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2A1 1 0 009.555 7.168z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Spotify-like Player */}
      <SpotifyPlayer 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}