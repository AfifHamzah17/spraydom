// src/pages/InsomniaCheck.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function InsomniaCheck() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPart, setCurrentPart] = useState(1); // Track which part is showing
  const navigate = useNavigate();

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // All 10 questions
  const allQuestions = [
    // Part 1 questions (original 5)
    {
      id: 1,
      text: "How often do you have trouble falling asleep at night?",
      options: [
        { value: 0, label: "Never" },
        { value: 1, label: "Rarely (once a week)" },
        { value: 2, label: "Sometimes (2-3 times a week)" },
        { value: 3, label: "Often (4 or more times a week)" }
      ]
    },
    {
      id: 2,
      text: "How often do you wake up during the night?",
      options: [
        { value: 0, label: "Never" },
        { value: 1, label: "Rarely (once a week)" },
        { value: 2, label: "Sometimes (2-3 times a week)" },
        { value: 3, label: "Often (4 or more times a week)" }
      ]
    },
    {
      id: 3,
      text: "How often do you wake up earlier than desired?",
      options: [
        { value: 0, label: "Never" },
        { value: 1, label: "Rarely (once a week)" },
        { value: 2, label: "Sometimes (2-3 times a week)" },
        { value: 3, label: "Often (4 or more times a week)" }
      ]
    },
    {
      id: 4,
      text: "How often do you feel unrefreshed upon waking?",
      options: [
        { value: 0, label: "Never" },
        { value: 1, label: "Rarely (once a week)" },
        { value: 2, label: "Sometimes (2-3 times a week)" },
        { value: 3, label: "Often (4 or more times a week)" }
      ]
    },
    {
      id: 5,
      text: "How often do your sleep problems affect your daily activities?",
      options: [
        { value: 0, label: "Never" },
        { value: 1, label: "Rarely (once a week)" },
        { value: 2, label: "Sometimes (2-3 times a week)" },
        { value: 3, label: "Often (4 or more times a week)" }
      ]
    },
    // Part 2 questions (new 5)
    {
      id: 6,
      text: "How often do you have difficulty staying asleep for long enough (less than 6 hours)?",
      options: [
        { value: 0, label: "Never" },
        { value: 1, label: "Rarely (once a week)" },
        { value: 2, label: "Sometimes (2–3 times a week)" },
        { value: 3, label: "Often (4 or more times a week)" }
      ]
    },
    {
      id: 7,
      text: "How often do you feel anxious or worried at night when trying to sleep?",
      options: [
        { value: 0, label: "Never" },
        { value: 1, label: "Rarely (once a week)" },
        { value: 2, label: "Sometimes (2–3 times a week)" },
        { value: 3, label: "Often (4 or more times a week)" }
      ]
    },
    {
      id: 8,
      text: "How often do you feel your mind is too active or racing thoughts prevent you from falling asleep?",
      options: [
        { value: 0, label: "Never" },
        { value: 1, label: "Rarely (once a week)" },
        { value: 2, label: "Sometimes (2–3 times a week)" },
        { value: 3, label: "Often (4 or more times a week)" }
      ]
    },
    {
      id: 9,
      text: "How often do you take more than 30 minutes to fall asleep?",
      options: [
        { value: 0, label: "Never" },
        { value: 1, label: "Rarely (once a week)" },
        { value: 2, label: "Sometimes (2–3 times a week)" },
        { value: 3, label: "Often (4 or more times a week)" }
      ]
    },
    {
      id: 10,
      text: "How often do you have trouble concentrating, remembering things, or focusing due to poor sleep?",
      options: [
        { value: 0, label: "Never" },
        { value: 1, label: "Rarely (once a week)" },
        { value: 2, label: "Sometimes (2–3 times a week)" },
        { value: 3, label: "Often (4 or more times a week)" }
      ]
    }
  ];

  // Split questions into 2 parts
  const part1Questions = allQuestions.slice(0, 5);
  const part2Questions = allQuestions.slice(5, 10);
  const currentQuestions = currentPart === 1 ? part1Questions : part2Questions;

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    scrollToTop(); // Scroll to top before changing part
    setCurrentPart(2);
  };

  const handleBack = () => {
    scrollToTop(); // Scroll to top before changing part
    setCurrentPart(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    scrollToTop(); // Scroll to top before showing results
    // Calculate score
    let totalScore = 0;
    Object.values(answers).forEach(value => {
      totalScore += parseInt(value);
    });
    
    setScore(totalScore);
    setShowResult(true);
  };

  const handleReset = () => {
    scrollToTop(); // Scroll to top when resetting
    setAnswers({});
    setShowResult(false);
    setScore(0);
    setCurrentPart(1);
  };

  const getInsomniaLevel = () => {
    const percentage = (score / 30) * 100;
    if (percentage < 20) return { 
      level: "No Insomnia", 
      color: "text-green-400", 
      bgColor: "bg-green-500",
      description: "Congratulations! You don't show signs of insomnia. Keep maintaining healthy sleep patterns."
    };
    if (percentage < 40) return { 
      level: "Mild Insomnia", 
      color: "text-yellow-400", 
      bgColor: "bg-yellow-500",
      description: "You show signs of mild insomnia. Try implementing better sleep habits."
    };
    if (percentage < 60) return { 
      level: "Moderate Insomnia", 
      color: "text-orange-400", 
      bgColor: "bg-orange-500",
      description: "You may be experiencing moderate insomnia. It's recommended to consult with a healthcare professional."
    };
    return { 
      level: "Severe Insomnia", 
      color: "text-red-400", 
      bgColor: "bg-red-500",
      description: "You show signs of severe insomnia. It's highly recommended to consult a doctor immediately."
    };
  };

  const insomniaLevel = getInsomniaLevel();
  const percentage = (score / 30) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button 
          onClick={() => {
            scrollToTop();
            navigate('/');
          }}
          className="flex items-center text-green-500 hover:text-green-400 mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>
        
        <h1 className="text-4xl font-bold mb-2">Insomnia Check</h1>
        <p className="text-xl text-gray-300">
          Discover your insomnia level with this comprehensive test
        </p>
      </div>

      {!showResult ? (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-xl">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`h-2 w-32 rounded-full ${currentPart === 1 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
              <div className={`h-2 w-32 rounded-full ${currentPart === 2 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Part {currentPart} of 2
            </h2>
          </div>

          <form onSubmit={currentPart === 2 ? handleSubmit : (e) => e.preventDefault()}>
            <div className="space-y-8">
              {currentQuestions.map((question) => (
                <motion.div 
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800/30 p-6 rounded-xl border border-gray-700"
                >
                  <h3 className="text-lg font-semibold mb-4">{question.text}</h3>
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          id={`q${question.id}_opt${option.value}`}
                          name={`question_${question.id}`}
                          value={option.value}
                          checked={answers[question.id] === String(option.value)}
                          onChange={() => handleAnswerChange(question.id, String(option.value))}
                          className="h-5 w-5 text-green-500 focus:ring-green-500 focus:ring-2 border-gray-600"
                        />
                        <label 
                          htmlFor={`q${question.id}_opt${option.value}`}
                          className="ml-3 block text-gray-300 cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-10 flex justify-center gap-4">
              {currentPart === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={Object.keys(answers).filter(id => id <= 5).length !== 5}
                  className={`px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                    Object.keys(answers).filter(id => id <= 5).length === 5
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              ) : (
                <>
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-bold transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back
                  </motion.button>
                  <button
                    type="submit"
                    disabled={Object.keys(answers).length !== allQuestions.length}
                    className={`px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                      Object.keys(answers).length === allQuestions.length
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Submit
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Insomnia Test Results</h2>
            <p className="text-gray-300">Based on your answers, here are your results:</p>
          </div>
          
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-64 h-64 mb-6">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>
              
              {/* Progress circle */}
              <motion.div
                className="absolute inset-0 rounded-full border-8 border-transparent"
                style={{
                  borderTopColor: insomniaLevel.bgColor,
                  borderRightColor: insomniaLevel.bgColor,
                  borderBottomColor: insomniaLevel.bgColor,
                  borderLeftColor: "transparent",
                  transform: "rotate(-45deg)",
                  filter: "drop-shadow(0 0 6px rgba(72, 187, 120, 0.5))"
                }}
                initial={{ rotate: -45 }}
                animate={{ rotate: -45 + (360 * percentage / 100) }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-0"
                style={{
                  background: `radial-gradient(circle, ${insomniaLevel.bgColor} 0%, transparent 70%)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1, duration: 1 }}
              />
              
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className={`text-4xl font-bold ${insomniaLevel.color}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {Math.round(percentage)}%
                </motion.span>
                <motion.span
                  className="text-gray-300 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  {insomniaLevel.level}
                </motion.span>
              </div>
              
              {/* Animated stars for decoration */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-yellow-400"
                  style={{
                    top: `${50 + 40 * Math.cos((i * 72) * Math.PI / 180)}%`,
                    left: `${50 + 40 * Math.sin((i * 72) * Math.PI / 180)}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0.7, 1], 
                    scale: [0, 1.5, 1, 1.2] 
                  }}
                  transition={{ 
                    delay: 1.5 + i * 0.2, 
                    duration: 1, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </div>
            
            <motion.div
              className={`text-2xl font-bold ${insomniaLevel.color} mb-6`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              {insomniaLevel.level}
            </motion.div>
            
            <motion.div
              className="text-gray-300 text-center max-w-2xl bg-gray-800/50 p-6 rounded-xl border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              <p>{insomniaLevel.description}</p>
              
              {/* Recommendation based on level */}
              <div className="mt-4 text-left">
                <h3 className="font-bold text-lg mb-2">Recommendations:</h3>
                {percentage < 20 && (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Maintain regular sleep patterns</li>
                    <li>Avoid caffeine before bedtime</li>
                    <li>Create a comfortable sleep environment</li>
                  </ul>
                )}
                {percentage >= 20 && percentage < 40 && (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Limit screen time before bed</li>
                    <li>Try relaxation techniques before sleep</li>
                    <li>Avoid heavy meals before bedtime</li>
                  </ul>
                )}
                {percentage >= 40 && percentage < 60 && (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Consider cognitive behavioral therapy</li>
                    <li>Limit daytime napping</li>
                    <li>Consult with a healthcare professional</li>
                  </ul>
                )}
                {percentage >= 60 && (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Consult a sleep specialist immediately</li>
                    <li>Consider medical treatment</li>
                    <li>Avoid self-medication without supervision</li>
                  </ul>
                )}
              </div>
            </motion.div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <motion.button
              onClick={handleReset}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retake Test
            </motion.button>
            
            <motion.button
              onClick={() => {
                scrollToTop();
                navigate('/');
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-full font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Home
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}