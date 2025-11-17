import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaSave, FaUpload, FaTimes, FaEye, FaCheck, FaSpinner } from 'react-icons/fa';

export default function AddVideo() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 0,
    category: 'sleep-music'
  });

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const videoUploadRef = useRef(null);
  const thumbnailUploadRef = useRef(null);

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

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));

      // Auto-fill duration from video file
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        setFormData(prev => ({
          ...prev,
          duration: Math.floor(video.duration)
        }));
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
    setFormData(prev => ({
      ...prev,
      duration: 0
    }));
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview('');
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.title || !videoFile || !thumbnailFile) {
    toast.error('Please fill in all required fields and upload both video and thumbnail');
    return;
  }

  setLoading(true);

  try {
    const formDataToSend = new FormData();
    
    // Add form fields
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('duration', formData.duration);
    formDataToSend.append('category', formData.category);
    
    // Add files
    formDataToSend.append('video', videoFile);
    formDataToSend.append('thumbnail', thumbnailFile);
    
    // Add folder info
    formDataToSend.append('folder', 'videos');

    // Debug: Log the FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }

    toast.loading('Creating video...', { id: 'create' });
    
    const response = await apiService.createVideo(formDataToSend);
    toast.success('Video created successfully!', { id: 'create' });

    navigate('/sleeptube');
  } catch (error) {
    console.error('Error creating video:', error);
    toast.error(error.message || 'Failed to create video');
  } finally {
    setLoading(false);
  }
};

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/sleeptube')}
              className="flex items-center text-green-500 hover:text-green-400 mr-4"
            >
              <FaArrowLeft className="mr-2" />Back to Videos
            </button>
            <h1 className="text-3xl font-bold">Add New Video</h1>
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
                  placeholder="Video title"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white transition-all duration-200"
                  placeholder="Video description"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white transition-all duration-200"
                >
                  <option value="sleep-music">Musik Tidur</option>
                  <option value="meditation">Meditasi</option>
                  <option value="nature-sounds">Suara Alam</option>
                  <option value="white-noise">White Noise</option>
                  <option value="guided-meditation">Meditasi Terpandu</option>
                  <option value="breathing">Pernapasan</option>
                  <option value="asmr">ASMR</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white transition-all duration-200"
                  placeholder="Video duration in seconds"
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Video <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  {videoPreview ? (
                    <div className="relative">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <FaTimes />
                      </button>
                      {videoFile && (
                        <div className="text-sm text-gray-400">
                          {videoFile.name} ({formatFileSize(videoFile.size)})
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
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                        id="video-upload"
                      />
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded inline-block"
                      >
                        Select Video
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Thumbnail <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <FaTimes />
                      </button>
                      {thumbnailFile && (
                        <div className="text-sm text-gray-400">
                          {thumbnailFile.name} ({formatFileSize(thumbnailFile.size)})
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <FaUpload className="mx-auto text-3xl text-gray-500 mb-2" />
                      <p className="text-sm text-gray-400 mb-2">
                        Click to upload or drag and drop
                        <br />
                        Recommended: 1280x720px
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="cursor-pointer bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded inline-block"
                      >
                        Select Thumbnail
                      </label>
                    </div>
                  )}
                </div>
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
                    Save Video
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
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="Video thumbnail"
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                  <p className="text-gray-400">No thumbnail</p>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {formData.title || 'Video Title'}
                </h3>
                <p className="text-gray-400 mb-3">
                  {formData.description || 'Video description will appear here...'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                    {formData.category === 'sleep-music' && 'Musik Tidur'}
                    {formData.category === 'meditation' && 'Meditasi'}
                    {formData.category === 'nature-sounds' && 'Suara Alam'}
                    {formData.category === 'white-noise' && 'White Noise'}
                    {formData.category === 'guided-meditation' && 'Meditasi Terpandu'}
                    {formData.category === 'breathing' && 'Pernapasan'}
                    {formData.category === 'asmr' && 'ASMR'}
                  </span>
                  <span className="text-sm text-gray-400">
                    {formData.duration > 0 && `${Math.floor(formData.duration / 60)}:${(formData.duration % 60).toString().padStart(2, '0')}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}