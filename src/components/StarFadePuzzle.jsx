import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
// Helper function for random number generation
const getRandom = (min, max) => Math.random() * (max - min) + min
export default function StarFadePuzzle() {
  const [stars, setStars] = useState([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [multiplier, setMultiplier] = useState(1)
  const [timeLeft, setTimeLeft] = useState(30)
  const [freezeTime, setFreezeTime] = useState(false)
  const [doubleScore, setDoubleScore] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true) // Audio state
  const [showDoubleScoreText, setShowDoubleScoreText] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const idRef = useRef(0)
  const intervalRef = useRef(null)
  const timerRef = useRef(null)
  const audioRef = useRef(null)
  const lastTimeRef = useRef(Date.now())
  const starsRef = useRef(stars) // Ref to track current stars
  const timeLeftRef = useRef(timeLeft) // Ref to track current timeLeft
  
  // Update refs when state changes
  useEffect(() => {
    starsRef.current = stars;
  }, [stars]);
  
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);
  
  // Initialize audio on component mount
  useEffect(() => {
    audioRef.current = new Audio('./8-bit-loop.mp3')
    audioRef.current.loop = true
    
    // Cleanup audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])
  
  // Start the game
  function startGame() {
    console.log('Game Started'); // For debugging to check if the button works
    setGameStarted(true) // Start game
    setGameOver(false)
    setTimeLeft(30) // Reset timer
    setScore(0) // Reset score
    setLevel(1) // Reset level
    setMultiplier(1) // Reset multiplier
    setStars([]) // Clear existing stars
    lastTimeRef.current = Date.now()
    
    // Start playing background music when game starts
    if (audioEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e))
    }
  }
  
  // Spawn stars at intervals
  useEffect(() => {
    if (!gameStarted || gameOver) return; // Do not spawn stars if game hasn't started or is over
    
    // Spawn stars at regular intervals
    function spawn() {
      // Use refs to get current values
      if (starsRef.current.length > 100 || timeLeftRef.current <= 0) return // Limit stars and stop if time's up
      const id = idRef.current++
      const starType = Math.random() < 0.85 ? 'basic' : 'gradient' // 15% chance of gradient star (rare)
      const x = getRandom(0, 100)
      const y = getRandom(0, 100)
      
      setStars((s) => [
        ...s,
        {
          id,
          x,
          y,
          type: starType,
          shiny: false, // Shiny effect removed for now
          // For gradient stars, add movement properties
          moveX: starType === 'gradient' ? getRandom(-1, 1) : 0,
          moveY: starType === 'gradient' ? getRandom(-1, 1) : 0,
        },
      ])
    }
    
    // Set up interval with current level
    intervalRef.current = setInterval(spawn, 900 - (level - 1) * 50) // Increase spawn speed with level
    
    // Cleanup on game end
    return () => {
      clearInterval(intervalRef.current) // Clear interval when game ends or component unmounts
    }
  }, [gameStarted, gameOver, level]) // Removed stars and timeLeft from dependencies
  
  // Update star positions for gradient stars
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const moveStars = () => {
      setStars(prevStars => 
        prevStars.map(star => {
          if (star.type === 'gradient') {
            // Update position with boundary checking
            let newX = star.x + star.moveX;
            let newY = star.y + star.moveY;
            
            // Bounce off edges
            if (newX <= 0 || newX >= 100) {
              newX = star.x - star.moveX; // Reverse direction
            }
            if (newY <= 0 || newY >= 100) {
              newY = star.y - star.moveY; // Reverse direction
            }
            
            return {
              ...star,
              x: newX,
              y: newY
            };
          }
          return star;
        })
      );
    };
    
    const moveInterval = setInterval(moveStars, 50); // Update positions every 50ms
    
    return () => clearInterval(moveInterval);
  }, [gameStarted, gameOver]);
  
  // Timer effect using requestAnimationFrame for better accuracy
  useEffect(() => {
    if (!gameStarted || gameOver || freezeTime) return;
    
    let animationFrameId;
    
    const updateTimer = () => {
      const now = Date.now();
      const delta = (now - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = now;
      
      setTimeLeft(prev => {
        const newTime = prev - delta;
        if (newTime <= 0) {
          setGameOver(true);
          // Pause music when game over
          if (audioRef.current) {
            audioRef.current.pause();
          }
          return 0;
        }
        return newTime;
      });
      
      animationFrameId = requestAnimationFrame(updateTimer);
    };
    
    animationFrameId = requestAnimationFrame(updateTimer);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, freezeTime]);
  
  // Power-up effects
  function applyPowerUp(type) {
    switch (type) {
      case 'doubleScore':
        setDoubleScore(true);
        setShowDoubleScoreText(true); // Show DOUBLE SCORE text
        setTimeout(() => setShowDoubleScoreText(false), 1000); // Hide after 1 second
        setTimeout(() => setDoubleScore(false), 5000); // Double score for 5 seconds
        break;
      case 'timeFreeze':
        setFreezeTime(true);
        setTimeout(() => setFreezeTime(false), 5000); // Freeze time for 5 seconds
        break;
      default:
        break;
    }
  }
  
  // Remove star and handle score
  function remove(id, starType) {
    setStars((s) => s.filter((st) => st.id !== id))
    if (starType === 'basic') {
      setScore((prevScore) => Math.floor(prevScore + (doubleScore ? multiplier : multiplier))) // Regular points
    } else if (starType === 'gradient') {
      setScore((prevScore) => Math.floor(prevScore + (doubleScore ? multiplier * 4 : multiplier * 2))) // Double points
    }
  }
  
  // Handle level up
  function handleLevelUp() {
    if (score >= level * 10) {
      setLevel((prevLevel) => prevLevel + 1)
      setMultiplier((prevMultiplier) => prevMultiplier * 1.2) // Increase score multiplier with level
    }
  }
  
  // Toggle audio
  function toggleAudio() {
    setAudioEnabled(!audioEnabled)
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e))
      }
    }
  }
  
  // Render Game
  return (
    <div className="relative w-full h-[60vh] bg-gradient-to-b from-slate-900 to-black rounded-xl overflow-hidden">
      {/* Game Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-slate-800 to-black opacity-30"></div>
      
      {/* Play Button */}
      {!gameStarted && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <button
            onClick={startGame}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-xl transition-colors"
          >
            Start Game
          </button>
        </div>
      )}
      
      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
          <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-2xl text-white mb-6">Final Score: {Math.floor(score)}</p>
          <button
            onClick={startGame}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-xl transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
      
      {/* Stars */}
      {stars.map((st) => (
        <motion.div
          key={st.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          style={{
            position: 'absolute',
            left: `${st.x}%`,
            top: `${st.y}%`,
            cursor: 'pointer',
          }}
          onClick={() => remove(st.id, st.type)}
          className="z-10"
        >
          {/* Gradient Star (rare, moving, double points) */}
          {st.type === 'gradient' ? (
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all hover:scale-110"
              >
                <defs>
                  <linearGradient id="gradientStar" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#ff00ff', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2l2.9 6.26L21 9.27l-5 3.86L17.8 21 12 17.77 6.2 21 8 13.13 3 9.27l6.1-1.01L12 2z"
                  fill="url(#gradientStar)"
                />
              </svg>
            </motion.div>
          ) : (
            <>
              {/* Basic Star (static, regular points) */}
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all hover:scale-110"
              >
                <path
                  d="M12 2l2.9 6.26L21 9.27l-5 3.86L17.8 21 12 17.77 6.2 21 8 13.13 3 9.27l6.1-1.01L12 2z"
                  fill="yellow"
                />
              </svg>
            </>
          )}
        </motion.div>
      ))}
      
      {/* Power-ups */}
      <div className="absolute top-4 left-4 text-white text-lg font-bold z-10">
        <div>Score: {Math.floor(score)}</div>
        <div>Level: {level}</div>
        <div>Time Left: {Math.ceil(timeLeft)}s</div>
        {freezeTime && <div className="text-blue-300">TIME FROZEN!</div>}
        {doubleScore && <div className="text-yellow-300">DOUBLE SCORE!</div>}
      </div>
      
      {/* Double Score Text */}
      {showDoubleScoreText && (
        <motion.div
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-white text-4xl font-bold z-30"
          animate={{ opacity: [1, 0], scale: [1, 1.5] }}
          transition={{ duration: 1 }}
        >
          DOUBLE SCORE!
        </motion.div>
      )}
      
      {/* Audio Toggle Button with Icons */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleAudio}
          className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-xl transition-colors"
        >
          {audioEnabled ? (
            // Unmute icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            // Mute icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Level Up */}
      {score >= level * 10 && handleLevelUp()}
    </div>
  )
}