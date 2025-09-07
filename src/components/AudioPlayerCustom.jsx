// FILE: src/components/AudioPlayerCustom.jsx
// FILE: src/components/AudioPlayerCustom.jsx
import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function AudioPlayerCustom({ src, header, onPlay }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-800/70 transition-colors cursor-pointer" onClick={onPlay}>
      <div className="flex items-center">
        <div className="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2A1 1 0 009.555 7.168z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <div className="font-semibold">{header}</div>
          <div className="text-sm text-gray-400">Click to play</div>
        </div>
      </div>
    </div>
  );
}