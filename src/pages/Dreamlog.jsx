// src/pages/Dreamlog.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Sample articles data - ini nantinya akan diambil dari backend
const sampleArticles = [
  {
    id: 1,
    title: "Understanding the Science of Sleep",
    excerpt: "Learn about the different stages of sleep and how they affect your health and wellbeing",
    content: "Sleep is a complex biological process that involves multiple stages. Each stage plays a crucial role in maintaining physical health, cognitive function, and emotional wellbeing...",
    author: "Dr. Sarah Johnson",
    date: "May 15, 2023",
    readTime: "5 min read",
    image: "https://via.placeholder.com/300x200?text=Sleep+Science"
  },
  {
    id: 2,
    title: "Natural Remedies for Better Sleep",
    excerpt: "Discover natural herbs, supplements, and techniques that can help improve your sleep quality",
    content: "Many people struggle with sleep issues but prefer natural solutions over medication. This article explores evidence-based natural remedies that can help you fall asleep faster and enjoy deeper sleep...",
    author: "Michael Chen",
    date: "June 2, 2023",
    readTime: "7 min read",
    image: "https://via.placeholder.com/300x200?text=Natural+Remedies"
  },
  {
    id: 3,
    title: "Creating the Perfect Sleep Environment",
    excerpt: "Tips and tricks to transform your bedroom into a sanctuary for restful sleep",
    content: "Your sleep environment plays a crucial role in the quality of your rest. From lighting to temperature to noise levels, small changes can make a big difference in how well you sleep...",
    author: "Emma Rodriguez",
    date: "June 18, 2023",
    readTime: "4 min read",
    image: "https://via.placeholder.com/300x200?text=Sleep+Environment"
  },
  {
    id: 4,
    title: "The Connection Between Diet and Sleep",
    excerpt: "How what you eat and drink affects your sleep patterns and quality",
    content: "Research shows a strong bidirectional relationship between diet and sleep. Certain foods and beverages can either promote or interfere with quality sleep. Understanding this connection can help you make better dietary choices...",
    author: "Dr. James Wilson",
    date: "July 5, 2023",
    readTime: "6 min read",
    image: "https://via.placeholder.com/300x200?text=Diet+and+Sleep"
  }
];

export default function Dreamlog() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch articles
    setArticles(sampleArticles);
  }, []);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
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
        
        <h1 className="text-4xl font-bold mb-2">Dreamlog</h1>
        <p className="text-xl text-gray-300">
          Insights and articles about sleep, dreams, and insomnia
        </p>
      </div>

      {selectedArticle ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
        >
          <div className="mb-6">
            <button 
              onClick={handleBackToList}
              className="flex items-center text-green-500 hover:text-green-400 mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Articles
            </button>
            
            <h2 className="text-3xl font-bold mb-4">{selectedArticle.title}</h2>
            
            <div className="flex flex-wrap items-center text-gray-400 mb-6">
              <span className="flex items-center mr-4 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {selectedArticle.author}
              </span>
              <span className="flex items-center mr-4 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {selectedArticle.date}
              </span>
              <span className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {selectedArticle.readTime}
              </span>
            </div>
          </div>
          
          <div className="mb-8">
            <img 
              src={selectedArticle.image} 
              alt={selectedArticle.title} 
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-4">
              {selectedArticle.content}
            </p>
            
            <p className="text-gray-300 leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
            </p>
            
            <p className="text-gray-300 leading-relaxed">
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <motion.div 
              key={article.id}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 cursor-pointer"
              onClick={() => handleArticleClick(article)}
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                
                <div className="p-5 md:w-2/3">
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                  
                  <div className="flex justify-between items-center text-gray-400 text-sm">
                    <span>{article.readTime}</span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Read More
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}