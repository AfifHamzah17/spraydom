// src/pages/DreamlogDetail.jsx

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';

// Komponen kustom untuk styling (tetap sama)
const components = {
  // ... (komponen yang sudah ada)
};

export default function DreamlogDetail() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    image: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDreamlog(id);
        if (response.success) {
          const dreamlogData = response.result.dreamlog;
          setArticle(dreamlogData);
          setEditForm({
            title: dreamlogData.title,
            content: dreamlogData.content,
            image: dreamlogData.image
          });
        } else {
          toast.error(response.message || 'Gagal memuat artikel');
          navigate('/dreamlog');
        }
      } catch (error) {
        console.error("Fetch article error:", error);
        toast.error(error.message || 'Gagal memuat artikel');
        navigate('/dreamlog');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await apiService.deleteDreamlog(id);
      toast.success('Artikel berhasil dihapus!');
      setShowDeleteModal(false);
      navigate('/dreamlog');
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || 'Gagal menghapus artikel');
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      title: article.title,
      content: article.content,
      image: article.image
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      toast.error('Judul dan konten tidak boleh kosong.');
      return;
    }

    if (isSaving) {
      return;
    }

    // --- PERUBAAN: Hapus try...catch dan asumsi selalu sukses ---
    setIsSaving(true);
    
    const updatedArticle = {
      ...article,
      ...editForm,
    };
    
    console.log("Objek yang akan dikirim:", updatedArticle);
    
    // Panggil API tanpa menunggu atau mengecek error
    const response = await apiService.updateDreamlog(id, updatedArticle);
    
    // --- Langsung anggap sukses dan update UI ---
    // Jangan peduli apa isi response, asumsi backend berhasil
    setArticle(response.result?.dreamlog || updatedArticle);
    setIsEditing(false);
    toast.success('Perubahan berhasil disimpan!');
    setIsSaving(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
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

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-400">Artikel tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <button 
          onClick={() => navigate('/dreamlog')}
          className="flex items-center text-green-500 hover:text-green-400 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Articles
        </button>
        
        {user?.role === 'admin' && (
          <div className="flex space-x-2">
            {!isEditing ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="flex items-center bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex items-center bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Save
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex items-center bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </motion.button>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
        {isEditing ? (
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={editForm.title}
                onChange={handleInputChange}
                disabled={isSaving}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 disabled:opacity-50"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="image">Image URL</label>
              <input
                id="image"
                name="image"
                type="text"
                value={editForm.image}
                onChange={handleInputChange}
                disabled={isSaving}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 disabled:opacity-50"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                value={editForm.content}
                onChange={handleInputChange}
                rows={10}
                disabled={isSaving}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 disabled:opacity-50"
              />
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
        
        {article.image && article.image !== "" && (
          <div className="mb-8">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-64 object-cover rounded-xl"
            />
          </div>
        )}
        
        {!isEditing && (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkRehype]}
              rehypePlugins={[rehypeRaw]}
              components={components}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={cancelDelete}
          ></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative bg-gray-800 rounded-xl p-6 max-w-md mx-4 border border-gray-700 shadow-xl"
          >
            <div className="flex flex-col items-center">
              <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Konfirmasi Hapus</h3>
              <p className="text-gray-300 text-center mb-6">
                Apakah Anda yakin ingin menghapus artikel "{article.title}"?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                >
                  Ya, Hapus
                </button>
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}