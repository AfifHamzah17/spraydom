// FILE: src/components/SpotifyPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import 'react-h5-audio-player/lib/styles.css';

export default function SpotifyPlayer({ currentTrack, isPlaying, setIsPlaying, onNext, onPrevious }) {
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  
  // Debug log when current track changes
  useEffect(() => {
    if (currentTrack) {
    //   console.log("Current track changed:", currentTrack);
    //   console.log("Audio source:", currentTrack.src);
    }
  }, [currentTrack]);
  
  // Set volume when it changes
  useEffect(() => {
    if (audioRef.current) {
    //   console.log("Setting volume to:", volume);
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // console.log("Playing audio");
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        // console.log("Pausing audio");
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);
  
  // Handle progress bar change
  const handleProgress = (e) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    
    if (audioRef.current && duration > 0) {
      const newTime = (newProgress / 100) * duration;
    //   console.log("Seeking to:", newTime);
      audioRef.current.currentTime = newTime;
    }
  };
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // If no track is selected, don't render the player
  if (!currentTrack) {
    // console.log("No current track, player not rendered");
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4 pb-25 z-50">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Left section - Track info */}
        <div className="flex items-center w-80">
          <img 
            src={currentTrack.image} 
            alt={currentTrack.title} 
            className="w-14 h-14 rounded-md mr-4"
          />
          <div>
            <div className="text-white font-medium">{currentTrack.title}</div>
            <div className="text-gray-400 text-sm">{currentTrack.artist}</div>
          </div>
        </div>

        {/* Middle section - Player controls */}
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center space-x-4 mb-2">
            <button 
              onClick={onPrevious}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
              </svg>
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white rounded-full p-1 hover:scale-105"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2A1 1 0 009.555 7.168z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button 
              onClick={onNext}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
              </svg>
            </button>
          </div>
          
          <div className="w-full flex items-center space-x-2">
            <span className="text-xs text-gray-400 w-10">
              {formatTime(currentTime)}
            </span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={progress}
              onChange={handleProgress}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right section - Volume */}
        <div className="flex items-center justify-end w-48">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Hidden audio element for actual playback */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onPlay={() => {
        //   console.log("Audio play event triggered");
          setIsPlaying(true);
        }}
        onPause={() => {
        //   console.log("Audio pause event triggered");
          setIsPlaying(false);
        }}
        onEnded={() => {
        //   console.log("Audio ended event triggered");
          onNext();
        }}
        onLoadedMetadata={() => {
        //   console.log("Audio metadata loaded");
          if (audioRef.current) {
            // console.log("Audio duration:", audioRef.current.duration);
            setDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            setCurrentTime(currentTime);
            
            if (duration > 0) {
              const newProgress = (currentTime / duration) * 100;
              setProgress(newProgress);
            }
          }
        }}
        onError={(e) => {
        //   console.error("Audio error:", e);
        //   console.error("Audio error code:", audioRef.current?.error?.code);
        //   console.error("Audio error message:", audioRef.current?.error?.message);
        }}
      />
    </div>
  );
}