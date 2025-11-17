// src/pages/AddAudio.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaSave, FaUpload, FaTimes, FaEye, FaSpinner } from 'react-icons/fa';

export default function AddAudio() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    artist: '',
    duration: '',
    category: 'Local Music'
  });

  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (token) {
      apiService.setToken(token);
    }
  }, [token]);

  if (!token || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">You need to be an admin to access this page.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeAudio = () => {
    setAudioFile(null);
    setAudioPreview('');
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !audioFile || !imageFile) {
      toast.error('Please fill in all required fields and upload both audio and image');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add form fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('artist', formData.artist);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('category', formData.category);
      
      // Add files
      formDataToSend.append('audio', audioFile);
      formDataToSend.append('image', imageFile);
      
      // Add folder info
      formDataToSend.append('folder', 'audios');

      toast.loading('Creating audio...', { id: 'create' });
      
      const response = await apiService.createAudio(formDataToSend);
      toast.success('Audio created successfully!', { id: 'create' });

      navigate('/audio');
    } catch (error) {
      console.error('Error creating audio:', error);
      toast.error(error.message || 'Failed to create audio');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/audio')}
              className="flex items-center text-green-500 hover:text-green-400 mr-4"
            >
              <FaArrowLeft className="mr-2" />Back to Audio
            </button>
            <h1 className="text-3xl font-bold">Add New Audio</h1>
          </div>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FaEye className="mr-2" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>

        {/* Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white transition-all duration-200"
                  placeholder="Audio title"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white transition-all duration-200"
                  placeholder="Audio description"
                />
              </div>

              {/* Artist */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Artist
                </label>
                <input
                  type="text"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white transition-all duration-200"
                  placeholder="Artist name"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white transition-all duration-200"
                  placeholder="3:45"
                />
              </div>

              {/* Category */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white transition-all duration-200"
                >
                  <option value="Local Music">Local Music</option>
                  <option value="Nature">Nature</option>
                  <option value="Folklore">Folklore</option>
                  <option value="ASMR">ASMR</option>
                  <option value="Sleep Early">Sleep Early</option>
                </select>
              </div>
            </div>

            {/* Audio Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Audio File <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                {audioPreview ? (
                  <div className="relative">
                    <audio controls className="w-full mb-2">
                      <source src={audioPreview} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <button
                      type="button"
                      onClick={removeAudio}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <FaTimes />
                    </button>
                    {audioFile && (
                      <div className="text-sm text-gray-400">
                        {audioFile.name} ({formatFileSize(audioFile.size)})
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <FaUpload className="mx-auto text-3xl text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioChange}
                      className="hidden"
                      id="audio-upload"
                    />
                    <label
                      htmlFor="audio-upload"
                      className="cursor-pointer bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded inline-block"
                    >
                      Select Audio
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cover Image <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Audio cover"
                      className="w-full h-64 object-cover rounded mb-2"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <FaTimes />
                    </button>
                    {imageFile && (
                      <div className="text-sm text-gray-400">
                        {imageFile.name} ({formatFileSize(imageFile.size)})
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <FaUpload className="mx-auto text-3xl text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded inline-block"
                    >
                      Select Image
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Audio
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Preview</h2>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="flex">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Audio cover"
                    className="w-32 h-32 object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-700 flex items-center justify-center">
                    <p className="text-gray-400">No image</p>
                  </div>
                )}
                <div className="p-4 flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {formData.title || 'Audio Title'}
                  </h3>
                  <p className="text-gray-400 mb-3">
                    {formData.description || 'Audio description will appear here...'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      {formData.artist || 'Artist Name'}
                    </span>
                    <span className="text-sm text-gray-400">
                      {formData.duration || 'Duration'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {formData.category || 'Category'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}