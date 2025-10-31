const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const USE_CREDENTIALS = (import.meta.env.VITE_API_USE_CREDENTIALS === 'true');

class ApiError extends Error {
  constructor(message, { status = 500, code = 'api_error', details = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...(USE_CREDENTIALS ? { credentials: 'include' } : {}),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      const text = await response.text().catch(() => '');
      let payload = null;
      try { 
        payload = text ? JSON.parse(text) : null; 
      } catch (e) { 
        payload = { raw: text }; 
      }

      if (!response.ok) {
        const message = (payload && (payload.error || payload.message)) || `HTTP error: ${response.status}`;
        const details = payload && (payload.details || payload);
        const err = new ApiError(message, { status: response.status, details, code: payload && payload.code });
        // include server-provided error in console for debugging
        console.error('API error response:', { url, status: response.status, payload });
        throw err;
      }

      return payload;
    } catch (error) {
      // normalize errors
      if (error instanceof ApiError) throw error;
      const msg = error && error.message ? error.message : 'Network error';
      console.error(`API request failed: ${msg}`, { url, options });
      throw new ApiError(msg, { status: 0, details: error });
    }
  }

  // Convenience methods for different HTTP verbs
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data = null, options = {}) {
    const config = {
      method: 'POST',
      ...options,
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    return this.request(endpoint, config);
  }

  async put(endpoint, data = null, options = {}) {
    const config = {
      method: 'PUT',
      ...options,
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    return this.request(endpoint, config);
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  // Auth methods
  async register(email, password, displayName) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
    
    if (data && data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data && data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async getCurrentUser() {
    return await this.request('/auth/me');
  }

  async logout() {
    this.clearToken();
  }

  // Profile methods
  async getProfile() {
    return await this.request('/profile');
  }

  async updateProfile(profileData) {
    return await this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Settings methods
  async getUserSettings() {
    return await this.request('/settings');
  }

  async updateUserSettings(settings) {
    return await this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    });
  }

  // Book methods
  // Accepts either (filtersObject) or legacy (searchTerm, selectedSubjects)
  async getBooks(filtersOrSearch, selectedSubjects) {
    const params = new URLSearchParams();

    if (filtersOrSearch && typeof filtersOrSearch === 'object' && !Array.isArray(filtersOrSearch)) {
      const filters = filtersOrSearch;
      if (filters.search) params.append('search', filters.search);
      if (filters.traditions && Array.isArray(filters.traditions) && filters.traditions.length > 0) params.append('traditions', JSON.stringify(filters.traditions));
      if (filters.language) params.append('language', filters.language);
      if (filters.minYear !== undefined) params.append('minYear', String(filters.minYear));
      if (filters.maxYear !== undefined) params.append('maxYear', String(filters.maxYear));
      if (filters.fileType) params.append('fileType', filters.fileType);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      if (filters.limit !== undefined) params.append('limit', String(filters.limit));
      if (filters.offset !== undefined) params.append('offset', String(filters.offset));
    } else {
      // legacy signature: (searchTerm, selectedSubjects)
      const searchTerm = filtersOrSearch;
      if (searchTerm) params.append('search', searchTerm);
      if (selectedSubjects && selectedSubjects.length > 0) {
        params.append('traditions', JSON.stringify(selectedSubjects));
      }
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/books${queryString}`);
  }

  async getBookSuggestions(q, limit = 10) {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (limit) params.append('limit', String(limit));
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/books/suggestions${queryString}`);
  }

  async getLanguages() {
    return await this.request('/books/languages');
  }

  async getYearRange() {
    return await this.request('/books/year-range');
  }

  async getBookTraditions() {
    return await this.request('/books/traditions');
  }

  async getBookById(id) {
    return await this.request(`/books/${id}`);
  }

  async createBook(bookData, file = null) {
    // If file is provided, use FormData for multipart upload
    if (file) {
      const formData = new FormData();
      formData.append('bookFile', file);
      formData.append('bookData', JSON.stringify(bookData));
      
      const url = `${API_BASE_URL}/books`;
      
      const config = {
        method: 'POST',
        body: formData,
        ...(USE_CREDENTIALS ? { credentials: 'include' } : {}),
        headers: {
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        },
      };

      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`API request failed: ${error.message}`);
        throw error;
      }
    } else {
      // Regular JSON request for text-based books
      return await this.request('/books', {
        method: 'POST',
        body: JSON.stringify(bookData),
      });
    }
  }

  // Sadhana methods
  async getUserSadhanas() {
    return await this.request('/sadhanas');
  }

  async createSadhana(sadhanaData) {
    return await this.request('/sadhanas', {
      method: 'POST',
      body: JSON.stringify(sadhanaData),
    });
  }

  async updateSadhana(id, sadhanaData) {
    return await this.request(`/sadhanas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sadhanaData),
    });
  }

  async deleteSadhana(id) {
    return await this.request(`/sadhanas/${id}`, {
      method: 'DELETE',
    });
  }

  async getSadhanaProgress(sadhanaId) {
    return await this.request(`/sadhanas/${sadhanaId}/progress`);
  }

  async upsertSadhanaProgress(sadhanaId, progressData) {
    return await this.request(`/sadhanas/${sadhanaId}/progress`, {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  // Sadhana sharing / community methods
  async shareSadhana(sadhanaId, privacyLevel = 'public') {
    return await this.request(`/sadhanas/${sadhanaId}/share`, {
      method: 'POST',
      body: JSON.stringify({ privacyLevel }),
    });
  }

  async unshareSadhana(sadhanaId) {
    return await this.request(`/sadhanas/${sadhanaId}/share`, {
      method: 'DELETE',
    });
  }

  async updateSharePrivacy(sadhanaId, privacyLevel) {
    return await this.request(`/sadhanas/${sadhanaId}/share/privacy`, {
      method: 'PUT',
      body: JSON.stringify({ privacyLevel }),
    });
  }

  async getCommunityFeed(filters = {}, pagination = { limit: 20, offset: 0 }) {
    const params = new URLSearchParams();
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.searchQuery) params.append('searchQuery', filters.searchQuery);
    params.append('limit', String(pagination.limit || 20));
    params.append('offset', String(pagination.offset || 0));
    const qs = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/sadhanas/community/feed${qs}`);
  }

  async getSharedSadhanaDetails(sadhanaId) {
    return await this.request(`/sadhanas/shared/${sadhanaId}`);
  }

  async likeSadhana(sadhanaId) {
    return await this.request(`/sadhanas/${sadhanaId}/likes`, { method: 'POST' });
  }

  async unlikeSadhana(sadhanaId) {
    return await this.request(`/sadhanas/${sadhanaId}/likes`, { method: 'DELETE' });
  }

  async getSadhanaComments(sadhanaId, pagination = { limit: 50, offset: 0 }) {
    const params = new URLSearchParams();
    params.append('limit', String(pagination.limit || 50));
    params.append('offset', String(pagination.offset || 0));
    const qs = params.toString() ? `?${params.toString()}` : '';
    return await this.request(`/sadhanas/${sadhanaId}/comments${qs}`);
  }

  async createSadhanaComment(sadhanaId, content, parentCommentId = null) {
    return await this.request(`/sadhanas/${sadhanaId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentCommentId }),
    });
  }

  async updateSadhanaComment(sadhanaId, commentId, content) {
    return await this.request(`/sadhanas/${sadhanaId}/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteSadhanaComment(sadhanaId, commentId) {
    return await this.request(`/sadhanas/${sadhanaId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  }
}

const apiService = new ApiService();

export { apiService as api, ApiError };
export default apiService;