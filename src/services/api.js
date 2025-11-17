// src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  clearToken() {
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Public endpoints that don't need a token
    const publicEndpoints = ['/auth/login', '/auth/register', '/contact'];
    const isPublicEndpoint = publicEndpoints.some(pubEndpoint => endpoint.startsWith(pubEndpoint));

    // Get the token from localStorage for every request
    const currentToken = localStorage.getItem('token');
    
    // If it's a protected endpoint and there's no token, stop immediately.
    if (!isPublicEndpoint && !currentToken) {
      console.error(`[API Error] No token found in localStorage for protected endpoint: ${endpoint}`);
      const error = new Error('Authentication token not found. Please log in again.');
      error.code = 'NO_TOKEN';
      throw error;
    }

    // Create the config object for the fetch request
    const config = {
      method: options.method || 'GET',
      headers: {}, // Start with a clean headers object
    };

    // If there's a token, add the Authorization header
    if (currentToken) {
      config.headers['Authorization'] = `Bearer ${currentToken}`;
    }

    // If the body is FormData, let the browser set the Content-Type header.
    // Otherwise, default to JSON.
    if (options.body) {
      config.body = options.body;
      if (!(options.body instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    
    // DEBUGGING: This will show you EXACTLY what is being sent to the server.
    console.log(`[API Request] ${config.method} ${url}`, config);

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (error.code === 'NO_TOKEN') {
        throw error;
      }
      console.error('API request failed:', error);
      throw error;
    }
  }

  // --- AUTH METHODS ---
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.result.token) {
      this.setToken(response.result.token);
      return response.result;
    }
    
    throw new Error(response.message || 'Login failed');
  }

  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success) {
      return response.result;
    }
    
    throw new Error(response.message || 'Registration failed');
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // --- DREAMLOG METHODS ---
  async getDreamlogs() {
    return this.request('/dreamlogs');
  }

  async getDreamlog(id) {
    return this.request(`/dreamlogs/${id}`);
  }

  async createDreamlog(dreamlogData) {
    const response = await this.request('/dreamlogs', {
      method: 'POST',
      body: JSON.stringify(dreamlogData),
    });
    
    if (response.success) {
      return response.result.dreamlog;
    }
    
    throw new Error(response.message || 'Failed to create dreamlog');
  }

  async updateDreamlog(id, dreamlogData) {
    const response = await this.request(`/dreamlogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dreamlogData),
    });
    
    if (response.success) {
      return response.result.dreamlog;
    }
    
    throw new Error(response.message || 'Failed to update dreamlog');
  }

  async deleteDreamlog(id) {
    return this.request(`/dreamlogs/${id}`, {
      method: 'DELETE',
    });
  }

  // --- UPLOAD METHOD ---
  async uploadImage(file, folder = 'dreamlogs') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const response = await this.request('/upload/image', {
      method: 'POST',
      body: formData,
    });
    
    if (response.success) {
      return response.result.url;
    }
    
    throw new Error(response.message || 'Image upload failed');
  }

// src/services/api.js (add these methods if not already present)

// --- PRODUCT METHODS ---
async getProducts() {
  return this.request('/products');
}

async getProduct(id) {
  return this.request(`/products/${id}`);
}

async createProduct(productData) {
  // Check if productData is FormData
  if (productData instanceof FormData) {
    const response = await this.request('/products', {
      method: 'POST',
      body: productData, // Don't stringify FormData
    });
    
    if (response.success) {
      return response.result.product;
    }
    
    throw new Error(response.message || 'Failed to create product');
  } else {
    // Handle regular JSON data
    const response = await this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    
    if (response.success) {
      return response.result.product;
    }
    
    throw new Error(response.message || 'Failed to create product');
  }
}

async updateProduct(id, productData) {
  // Check if productData is FormData
  if (productData instanceof FormData) {
    const response = await this.request(`/products/${id}`, {
      method: 'PUT',
      body: productData, // Don't stringify FormData
    });
    
    if (response.success) {
      return response.result.product;
    }
    
    throw new Error(response.message || 'Failed to update product');
  } else {
    // Handle regular JSON data
    const response = await this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    
    if (response.success) {
      return response.result.product;
    }
    
    throw new Error(response.message || 'Failed to update product');
  }
}

async deleteProduct(id) {
  return this.request(`/products/${id}`, {
    method: 'DELETE',
  });
}
// --- AUDIO METHODS ---
async getAudios() {
  return this.request('/audios');
}

async getAudio(id) {
  return this.request(`/audios/${id}`);
}

async createAudio(audioData) {
  // Check if audioData is FormData
  if (audioData instanceof FormData) {
    const response = await this.request('/audios', {
      method: 'POST',
      body: audioData, // Don't stringify FormData
    });
    
    if (response.success) {
      return response.result.audio;
    }
    
    throw new Error(response.message || 'Failed to create audio');
  } else {
    // Handle regular JSON data
    const response = await this.request('/audios', {
      method: 'POST',
      body: JSON.stringify(audioData),
    });
    
    if (response.success) {
      return response.result.audio;
    }
    
    throw new Error(response.message || 'Failed to create audio');
  }
}

async updateAudio(id, audioData) {
  // Check if audioData is FormData
  if (audioData instanceof FormData) {
    const response = await this.request(`/audios/${id}`, {
      method: 'PUT',
      body: audioData, // Don't stringify FormData
    });
    
    if (response.success) {
      return response.result.audio;
    }
    
    throw new Error(response.message || 'Failed to update audio');
  } else {
    // Handle regular JSON data
    const response = await this.request(`/audios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(audioData),
    });
    
    if (response.success) {
      return response.result.audio;
    }
    
    throw new Error(response.message || 'Failed to update audio');
  }
}

async deleteAudio(id) {
  return this.request(`/audios/${id}`, {
    method: 'DELETE',
  });
}
// --- VIDEO METHODS ---
async getVideos() {
  return this.request('/videos');
}

async getVideo(id) {
  return this.request(`/videos/${id}`);
}

async createVideo(videoData) {
  // Check if videoData is FormData
  if (videoData instanceof FormData) {
    const response = await this.request('/videos', {
      method: 'POST',
      body: videoData, // Don't stringify FormData
    });
    
    if (response.success) {
      return response.result.video;
    }
    
    throw new Error(response.message || 'Failed to create video');
  } else {
    // Handle regular JSON data
    const response = await this.request('/videos', {
      method: 'POST',
      body: JSON.stringify(videoData),
    });
    
    if (response.success) {
      return response.result.video;
    }
    
    throw new Error(response.message || 'Failed to create video');
  }
}

async updateVideo(id, videoData) {
  // Check if videoData is FormData
  if (videoData instanceof FormData) {
    const response = await this.request(`/videos/${id}`, {
      method: 'PUT',
      body: videoData, // Don't stringify FormData
    });
    
    if (response.success) {
      return response.result.video;
    }
    
    throw new Error(response.message || 'Failed to update video');
  } else {
    // Handle regular JSON data
    const response = await this.request(`/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(videoData),
    });
    
    if (response.success) {
      return response.result.video;
    }
    
    throw new Error(response.message || 'Failed to update video');
  }
}

async deleteVideo(id) {
  return this.request(`/videos/${id}`, {
    method: 'DELETE',
  });
}


  // --- USER METHODS ---
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, userData) {
    const response = await this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    
    if (response.success) {
      return response.result.user;
    }
    
    throw new Error(response.message || 'Failed to update user');
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // --- CONTACT METHODS ---
  async createContact(contactData) {
    const response = await this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
    
    if (response.success) {
      return response.result.contact;
    }
    
    throw new Error(response.message || 'Failed to submit contact form');
  }

  async getContacts() {
    return this.request('/contact');
  }

  async deleteContact(id) {
    return this.request(`/contact/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create a singleton instance
const apiService = new ApiService();

// Export both the class and the instance
export { ApiService };
export default apiService;