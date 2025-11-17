import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  FaArrowLeft, FaSave, FaUpload, FaTimes, FaEye, 
  FaBold, FaItalic, FaUnderline, FaLink, FaQuoteLeft,
  FaListUl, FaListOl, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify,
  FaFileAlt
} from 'react-icons/fa';

export default function AddDreamlog() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const textareaRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: user?.nama || '',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min read',
    image: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  
  // Formatting state
  const [currentFormatting, setCurrentFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    fontSize: 16,
    fontFamily: 'sans-serif',
    textAlign: 'left'
  });

  // Update apiService token when component mounts or token changes
  useEffect(() => {
    if (token) {
      apiService.setToken(token);
      console.log('Token set in apiService:', token.substring(0, 10) + '...');
    }
  }, [token]);

  // Check if user is admin
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    try {
      setUploading(true);
      toast.loading('Uploading image...', { id: 'upload' });
      
      apiService.setToken(token);
      
      const imageUrl = await apiService.uploadImage(imageFile, 'dreamlogs');
      
      toast.success('Image uploaded successfully', { id: 'upload' });
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.author) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      let imageUrl = formData.image;
      
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          throw new Error('Failed to upload image');
        }
      }
      
      const dreamlogData = {
        ...formData,
        image: imageUrl
      };
      
      toast.loading('Creating article...', { id: 'create' });
      await apiService.createDreamlog(dreamlogData);
      toast.success('Article created successfully!', { id: 'create' });
      
      navigate('/dreamlog');
    } catch (error) {
      console.error('Error creating dreamlog:', error);
      toast.error(error.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  // Text formatting functions
  const insertFormatting = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const newText = before + selectedText + after;
    
    // Update content
    const newContent = formData.content.substring(0, start) + newText + formData.content.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const insertBold = () => {
    insertFormatting('**', '**');
  };

  const insertItalic = () => {
    insertFormatting('*', '*');
  };

  const insertUnderline = () => {
    insertFormatting('<u>', '</u>');
  };

  const insertHeader = (level) => {
    insertFormatting('#'.repeat(level) + ' ');
  };

  const insertBlockquote = () => {
    insertFormatting('> ');
  };

  const insertUnorderedList = () => {
    insertFormatting('- ');
  };

  const insertOrderedList = () => {
    insertFormatting('1. ');
  };

  const insertLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    if (selectedText) {
      setLinkText(selectedText);
    }
    
    setShowLinkModal(true);
  };

  const handleLinkSubmit = () => {
    if (linkText && linkUrl) {
      insertFormatting(`[${linkText}](${linkUrl})`);
      setLinkText('');
      setLinkUrl('');
      setShowLinkModal(false);
    }
  };

  const insertTextAlign = (alignment) => {
    insertFormatting(`<div style="text-align: ${alignment}">`, '</div>');
  };

  const insertFontSize = (size) => {
    insertFormatting(`<span style="font-size: ${size}px">`, '</span>');
  };

  const insertFontFamily = (family) => {
    insertFormatting(`<span style="font-family: ${family}">`, '</span>');
  };

  const insertSampleText = () => {
    const sampleText = `# Header 1
## Header 2
### Header 3

**Teks Tebal (Bold)**

*Teks Miring (Italic)*

<u>Teks Bergaris Bawah (Underline)</u>

<span style="font-family: serif">Teks dengan Font Serif</span>

<span style="font-size: 20px">Teks dengan Ukuran 20px</span>

<div style="text-align: left">Teks Rata Kiri</div>

<div style="text-align: center">Teks Rata Tengah</div>

<div style="text-align: right">Teks Rata Kanan</div>

<div style="text-align: justify">Teks Rata Kiri-Kanan (Justify). Ini adalah contoh teks yang lebih panjang untuk menunjukkan bagaimana teks rata kiri-kanan terlihat. Teks ini akan membentuk blok yang rata di kedua sisi.</div>

- Item 1 dari Bullet List
- Item 2 dari Bullet List
- Item 3 dari Bullet List

1. Item 1 dari Numbered List
2. Item 2 dari Numbered List
3. Item 3 dari Numbered List

> Ini adalah kutipan (blockquote). Kutipan ini digunakan untuk menyoroti teks penting atau kutipan dari sumber lain.

[Link ke Google](https://www.google.com)

[Link ke Wikipedia](https://www.wikipedia.org)

Kode inline: \`console.log("Hello World");\`

Kode blok:
\`\`\`
function helloWorld() {
  console.log("Hello, World!");
}
\`\`\`

Ini adalah paragraf normal untuk menunjukkan bagaimana teks biasa terlihat.

Ini adalah paragraf lain dengan **teks tebal di tengah** dan *teks miring* juga.`;

    setFormData(prev => ({ ...prev, content: sampleText }));
    
    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  // Simple markdown-like formatting for preview
  const formatContent = (content) => {
    return content
      .split('\n')
      .map(line => {
        // Headers
        if (line.startsWith('# ')) return `<h1 class="text-2xl font-bold mb-4 mt-6">${line.substring(2)}</h1>`;
        if (line.startsWith('## ')) return `<h2 class="text-xl font-bold mb-3 mt-5">${line.substring(3)}</h2>`;
        if (line.startsWith('### ')) return `<h3 class="text-lg font-bold mb-2 mt-4">${line.substring(4)}</h3>`;
        
        // Bold
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Underline
        line = line.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
        
        // Links
        line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-green-400 hover:text-green-300 underline">$1</a>');
        
        // Blockquotes
        if (line.startsWith('> ')) return `<blockquote class="border-l-4 border-gray-500 pl-4 italic mb-4 text-gray-300">${line.substring(2)}</blockquote>`;
        
        // Lists
        if (line.startsWith('- ')) return `<li class="mb-1">${line.substring(2)}</li>`;
        if (line.startsWith('1. ')) return `<li class="mb-1">${line.substring(3)}</li>`;
        
        // Text alignment
        line = line.replace(/<div style="text-align: (left|center|right|justify)">(.*?)<\/div>/g, 
          (match, align, text) => `<div class="text-${align} mb-4">${text}</div>`);
        
        // Font size
        line = line.replace(/<span style="font-size: (\d+)px">(.*?)<\/span>/g, 
          (match, size, text) => `<span style="font-size: ${size}px" class="inline-block">${text}</span>`);
        
        // Font family
        line = line.replace(/<span style="font-family: ([^"]+)">(.*?)<\/span>/g, 
          (match, family, text) => `<span style="font-family: ${family}" class="inline-block">${text}</span>`);
        
        // Regular paragraph
        return line ? `<p class="mb-4 text-gray-300">${line}</p>` : '';
      })
      .join('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/dreamlog')}
              className="flex items-center text-green-500 hover:text-green-400 mr-4"
            >
              <FaArrowLeft className="mr-2" /> Back to Articles
            </button>
            <h1 className="text-3xl font-bold">Add New Article</h1>
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
                  placeholder="Article title"
                />
              </div>
              
              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white transition-all duration-200"
                  placeholder="Author name"
                />
              </div>
              
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white transition-all duration-200"
                />
              </div>
              
              {/* Read Time */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white transition-all duration-200"
                  placeholder="e.g., 5 min read"
                />
              </div>
              
              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Featured Image
                </label>
                
                {imagePreview ? (
                  <div className="relative mb-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center mb-4">
                    <div className="flex flex-col items-center justify-center">
                      <FaUpload className="text-gray-400 text-3xl mb-2" />
                      <p className="text-gray-400 mb-2">Upload an image for your article</p>
                      <label className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Content Editor */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              
              {showPreview ? (
                <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-6 min-h-[400px]">
                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatContent(formData.content) }}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Formatting Toolbar */}
                  <div className="bg-gray-900/50 rounded-lg p-3 flex flex-wrap gap-2">
                    {/* Font Controls */}
                    <div className="flex items-center gap-2 mr-4">
                      <select 
                        value={currentFormatting.fontFamily}
                        onChange={(e) => {
                          setCurrentFormatting(prev => ({ ...prev, fontFamily: e.target.value }));
                          insertFontFamily(e.target.value);
                        }}
                        className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
                      >
                        <option value="sans-serif">Sans</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Mono</option>
                      </select>
                      
                      <select 
                        value={currentFormatting.fontSize}
                        onChange={(e) => {
                          setCurrentFormatting(prev => ({ ...prev, fontSize: parseInt(e.target.value) }));
                          insertFontSize(parseInt(e.target.value));
                        }}
                        className="bg-gray-800 text-white px-2 py-1 rounded text-sm"
                      >
                        <option value="12">12px</option>
                        <option value="14">14px</option>
                        <option value="16">16px</option>
                        <option value="18">18px</option>
                        <option value="20">20px</option>
                        <option value="24">24px</option>
                      </select>
                    </div>
                    
                    <div className="h-6 w-px bg-gray-600"></div>
                    
                    {/* Text Formatting */}
                    <button 
                      type="button"
                      onClick={insertBold}
                      className="p-2 rounded hover:bg-gray-700 transition-colors"
                      title="Bold"
                    >
                      <FaBold />
                    </button>
                    
                    <button 
                      type="button"
                      onClick={insertItalic}
                      className="p-2 rounded hover:bg-gray-700 transition-colors"
                      title="Italic"
                    >
                      <FaItalic />
                    </button>
                    
                    <button 
                      type="button"
                      onClick={insertUnderline}
                      className="p-2 rounded hover:bg-gray-700 transition-colors"
                      title="Underline"
                    >
                      <FaUnderline />
                    </button>
                    
                    <div className="h-6 w-px bg-gray-600"></div>
                    
                    {/* Headers */}
                    <button 
                      type="button"
                      onClick={() => insertHeader(1)}
                      className="p-2 rounded hover:bg-gray-700 transition-colors text-sm"
                      title="Header 1"
                    >
                      H1
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => insertHeader(2)}
                      className="p-2 rounded hover:bg-gray-700 transition-colors text-sm"
                      title="Header 2"
                    >
                      H2
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => insertHeader(3)}
                      className="p-2 rounded hover:bg-gray-700 transition-colors text-sm"
                      title="Header 3"
                    >
                      H3
                    </button>
                    
                    <div className="h-6 w-px bg-gray-600"></div>
                    
                    {/* Text Alignment */}
                    <button 
                      type="button"
                      onClick={() => insertTextAlign('left')}
                      className="p-2 rounded hover:bg-gray-700 transition-colors"
                      title="Align Left"
                    >
                      <FaAlignLeft />
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => insertTextAlign('center')}
                      className="p-2 rounded hover:bg-gray-700 transition-colors"
                      title="Align Center"
                    >
                      <FaAlignCenter />
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => insertTextAlign('right')}
                      className="p-2 rounded hover:bg-gray-700 transition-colors"
                      title="Align Right"
                    >
                      <FaAlignRight />
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => insertTextAlign('justify')}
                      className="p-2 rounded hover:bg-gray-700 transition-colors"
                      title="Justify"
                    >
                      <FaAlignJustify />
                    </button>
                    
                    <div className="h-6 w-px bg-gray-600"></div>
                    
                    {/* Lists */}
                    <button 
                      type="button"
                      onClick={insertUnorderedList}
                      className="p-2 rounded hover:bg-gray-700 transition-colors"
                      title="Bullet List"
                    >
                      <FaListUl />
                    </button>
                    
                    <button 
                      type="button"
                      onClick={insertOrderedList}
                      className="p-2 rounded hover:bg-gray-700 transition-colors"
                      title="Numbered List"
                    >
                      <FaListOl />
                    </button>
                    
                    <div className="h-6 w-px bg-gray-600"></div>
                    
                    {/* Other Elements */}
                    <button 
                      type="button"
                      onClick={insertLink}
                      className="p-2 rounded hover:bg-gray-700 transition-colors"
                      title="Insert Link"
                    >
                      <FaLink />
                    </button>
                    
                    <button 
                      type="button"
                      onClick={insertBlockquote}
                      className="p-2 rounded hover:bg-gray-700 transition-colors"
                      title="Blockquote"
                    >
                      <FaQuoteLeft />
                    </button>
                    
                    <div className="h-6 w-px bg-gray-600"></div>
                    
                    {/* Sample Text */}
                    <button 
                      type="button"
                      onClick={insertSampleText}
                      className="p-2 rounded hover:bg-gray-700 transition-colors text-sm"
                      title="Insert Sample Text"
                    >
                      <FaFileAlt />
                    </button>
                  </div>
                  
                  {/* Textarea */}
                  <textarea
                    ref={textareaRef}
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={15}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white transition-all duration-200 font-mono"
                    placeholder="Write your article content here..."
                  />
                  
                  <div className="text-sm text-gray-400 p-4 bg-gray-900/50 rounded-lg">
                    <p className="font-medium mb-2">Formatting Tips:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Select text and click formatting buttons</li>
                      <li>Use <code className="bg-gray-800 px-1 rounded">#</code> for headings</li>
                      <li>Use <code className="bg-gray-800 px-1 rounded">**text**</code> for <strong>bold</strong></li>
                      <li>Use <code className="bg-gray-800 px-1 rounded">*text*</code> for <em>italic</em></li>
                      <li>Use <code className="bg-gray-800 px-1 rounded">[text](url)</code> for links</li>
                      <li>Use <code className="bg-gray-800 px-1 rounded">-</code> or <code className="bg-gray-800 px-1 rounded">1.</code> for lists</li>
                      <li>Click the Sample button to insert test text with all formatting</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex items-center bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Publish Article
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Insert Link</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Link Text</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
                placeholder="Enter link text"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
                placeholder="https://example.com"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLinkSubmit}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}