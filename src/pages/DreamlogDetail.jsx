import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

// Komponen kustom untuk styling tanpa className
const components = {
  h1: ({ node, ...props }) => (
    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem', marginTop: '1.5rem', color: 'white' }} {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.75rem', marginTop: '1.25rem', color: 'white' }} {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '1rem', color: 'white' }} {...props} />
  ),
  p: ({ node, ...props }) => (
    <p style={{ marginBottom: '1rem', color: '#d1d5db', lineHeight: '1.625' }} {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', color: '#d1d5db' }} {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', marginBottom: '1rem', color: '#d1d5db' }} {...props} />
  ),
  li: ({ node, ...props }) => (
    <li style={{ marginBottom: '0.25rem' }} {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote style={{ 
      borderLeft: '4px solid #10b981', 
      paddingLeft: '1rem', 
      fontStyle: 'italic', 
      marginBottom: '1rem', 
      color: '#d1d5db',
      backgroundColor: 'rgba(31, 41, 55, 0.5)',
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      borderRadius: '0 0.375rem 0.375rem 0'
    }} {...props} />
  ),
  a: ({ node, ...props }) => (
    <a style={{ color: '#34d399', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer" {...props} />
  ),
  strong: ({ node, ...props }) => (
    <strong style={{ fontWeight: 'bold', color: 'white' }} {...props} />
  ),
  em: ({ node, ...props }) => (
    <em style={{ fontStyle: 'italic', color: '#e5e7eb' }} {...props} />
  ),
  u: ({ node, ...props }) => (
    <u style={{ textDecoration: 'underline', textDecorationColor: '#10b981' }} {...props} />
  ),
  code: ({ node, inline, ...props }) => 
    inline 
      ? <code style={{ backgroundColor: '#374151', padding: '0.125rem 0.25rem', borderRadius: '0.25rem', fontSize: '0.875rem', color: '#34d399' }} {...props} />
      : <code style={{ 
          display: 'block', 
          backgroundColor: '#1f2937', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1rem', 
          overflowX: 'auto', 
          fontSize: '0.875rem',
          color: '#34d399'
        }} {...props} />,
  pre: ({ node, ...props }) => (
    <pre style={{ marginBottom: '1rem', overflowX: 'auto', backgroundColor: '#1f2937', borderRadius: '0.5rem', padding: '1rem' }} {...props} />
  ),
  table: ({ node, ...props }) => (
    <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
      <table style={{ minWidth: '100%', borderCollapse: 'collapse', border: '1px solid #4b5563' }} {...props} />
    </div>
  ),
  th: ({ node, ...props }) => (
    <th style={{ 
      border: '1px solid #4b5563', 
      padding: '0.5rem 1rem', 
      backgroundColor: '#374151', 
      textAlign: 'left', 
      fontWeight: 'bold',
      color: 'white'
    }} {...props} />
  ),
  td: ({ node, ...props }) => (
    <td style={{ border: '1px solid #4b5563', padding: '0.5rem 1rem' }} {...props} />
  ),
  hr: ({ node, ...props }) => (
    <hr style={{ margin: '1.5rem 0', border: '0', borderTop: '1px solid #4b5563' }} {...props} />
  ),
  // Komponen untuk menangani HTML span dan div
  span: ({ node, ...props }) => (
    <span {...props} />
  ),
  div: ({ node, ...props }) => (
    <div {...props} />
  ),
};

export default function DreamlogDetail() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDreamlog(id);
        if (response.success) {
          setArticle(response.result.dreamlog);
        } else {
          toast.error(response.message || 'Failed to fetch article');
          navigate('/dreamlog');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to fetch article');
        navigate('/dreamlog');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-400">Article not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button 
          onClick={() => navigate('/dreamlog')}
          className="flex items-center text-green-500 hover:text-green-400 mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Articles
        </button>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold mb-4 text-white">{article.title}</h1>
        
        <div className="flex flex-wrap items-center text-gray-400 mb-6">
          <span className="flex items-center mr-4 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            {article.author}
          </span>
          <span className="flex items-center mr-4 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {article.date}
          </span>
          <span className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {article.readTime}
          </span>
        </div>
        
        {article.image && article.image !== "" && (
          <div className="mb-8">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
        )}
        
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkRehype]}
            rehypePlugins={[rehypeRaw]}
            components={components}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}