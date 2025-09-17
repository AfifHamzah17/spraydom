// src/pages/InsomniaCheck.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function InsomniaCheck() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const questions = [
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
    }
  ];

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate score
    let totalScore = 0;
    Object.values(answers).forEach(value => {
      totalScore += parseInt(value);
    });
    
    setScore(totalScore);
    setShowResult(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
    setScore(0);
  };

  const getInsomniaLevel = () => {
    const percentage = (score / 15) * 100;
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
  const percentage = (score / 15) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
        
        <h1 className="text-4xl font-bold mb-2">Insomnia Check</h1>
        <p className="text-xl text-gray-300">
          Discover your insomnia level with this simple test
        </p>
      </div>

      {!showResult ? (
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-xl">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {questions.map((question) => (
                <div key={question.id} className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
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
                </div>
              ))}
            </div>
            
            <div className="mt-10 flex justify-center">
              <button
                type="submit"
                disabled={Object.keys(answers).length !== questions.length}
                className={`px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                  Object.keys(answers).length === questions.length
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                Check Results
              </button>
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
              onClick={() => navigate('/')}
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