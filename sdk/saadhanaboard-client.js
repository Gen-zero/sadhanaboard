/**
 * SaadhanaBoard API Client SDK
 * 
 * A simple JavaScript client for interacting with the SaadhanaBoard API.
 */

class SaadhanaBoardClient {
  /**
   * Create a new SaadhanaBoardClient
   * @param {Object} options - Client configuration
   * @param {string} options.baseURL - Base URL for the API (e.g., 'http://localhost:3004/api')
   * @param {string} [options.token] - JWT token for authentication
   */
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'http://localhost:3004/api';
    this.token = options.token || null;
    
    // Initialize API modules
    this.auth = new AuthAPI(this);
    this.profile = new ProfileAPI(this);
    this.analytics = new AnalyticsAPI(this);
  }
  
  /**
   * Set the JWT token for authentication
   * @param {string} token - JWT token
   */
  setToken(token) {
    this.token = token;
  }
  
  /**
   * Make an HTTP request to the API
   * @param {string} endpoint - API endpoint (e.g., '/auth/login')
   * @param {Object} options - Request options
   * @param {string} [options.method='GET'] - HTTP method
   * @param {Object} [options.data] - Request body data
   * @param {Object} [options.params] - Query parameters
   * @returns {Promise<Object>} Response data
   */
  async request(endpoint, options = {}) {
    const url = new URL(this.baseURL + endpoint);
    
    // Add query parameters
    if (options.params) {
      Object.keys(options.params).forEach(key => {
        url.searchParams.append(key, options.params[key]);
      });
    }
    
    // Configure fetch options
    const fetchOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    // Add authorization header if token is set
    if (this.token) {
      fetchOptions.headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    // Add request body for non-GET requests
    if (options.data && fetchOptions.method !== 'GET') {
      fetchOptions.body = JSON.stringify(options.data);
    }
    
    try {
      const response = await fetch(url, fetchOptions);
      
      // Handle empty responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${data.error || data}`);
      }
      
      return data;
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

/**
 * Authentication API module
 */
class AuthAPI {
  constructor(client) {
    this.client = client;
  }
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @param {string} userData.displayName - User's display name
   * @returns {Promise<Object>} Registration response
   */
  async register(userData) {
    return this.client.request('/auth/register', {
      method: 'POST',
      data: userData
    });
  }
  
  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   * @returns {Promise<Object>} Login response
   */
  async login(credentials) {
    return this.client.request('/auth/login', {
      method: 'POST',
      data: credentials
    });
  }
  
  /**
   * Join the waitlist
   * @param {Object} waitlistData - Waitlist data
   * @param {string} waitlistData.name - User's name
   * @param {string} waitlistData.email - User's email
   * @param {string} [waitlistData.reason] - Reason for joining
   * @returns {Promise<Object>} Waitlist response
   */
  async joinWaitlist(waitlistData) {
    return this.client.request('/auth/waitlist', {
      method: 'POST',
      data: waitlistData
    });
  }
  
  /**
   * Get current user
   * @returns {Promise<Object>} Current user data
   */
  async getCurrentUser() {
    return this.client.request('/auth/me');
  }
}

/**
 * Profile API module
 */
class ProfileAPI {
  constructor(client) {
    this.client = client;
  }
  
  /**
   * Get user profile
   * @returns {Promise<Object>} User profile
   */
  async get() {
    return this.client.request('/profile');
  }
  
  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile
   */
  async update(profileData) {
    return this.client.request('/profile', {
      method: 'PUT',
      data: profileData
    });
  }
  
  /**
   * Follow a user
   * @param {string} userId - ID of user to follow
   * @returns {Promise<Object>} Follow response
   */
  async follow(userId) {
    return this.client.request(`/profile/${userId}/follow`, {
      method: 'POST'
    });
  }
  
  /**
   * Unfollow a user
   * @param {string} userId - ID of user to unfollow
   * @returns {Promise<Object>} Unfollow response
   */
  async unfollow(userId) {
    return this.client.request(`/profile/${userId}/unfollow`, {
      method: 'POST'
    });
  }
  
  /**
   * Get followers of a user
   * @param {string} userId - ID of user
   * @param {Object} [options] - Pagination options
   * @param {number} [options.limit=50] - Number of followers to return
   * @param {number} [options.offset=0] - Offset for pagination
   * @returns {Promise<Object>} Followers data
   */
  async getFollowers(userId, options = {}) {
    return this.client.request(`/profile/${userId}/followers`, {
      params: options
    });
  }
  
  /**
   * Get users that a user is following
   * @param {string} userId - ID of user
   * @param {Object} [options] - Pagination options
   * @param {number} [options.limit=50] - Number of following to return
   * @param {number} [options.offset=0] - Offset for pagination
   * @returns {Promise<Object>} Following data
   */
  async getFollowing(userId, options = {}) {
    return this.client.request(`/profile/${userId}/following`, {
      params: options
    });
  }
  
  /**
   * Get follow statistics for a user
   * @param {string} userId - ID of user
   * @returns {Promise<Object>} Follow statistics
   */
  async getFollowStats(userId) {
    return this.client.request(`/profile/${userId}/follow-stats`);
  }
  
  /**
   * Check if current user is following another user
   * @param {string} userId - ID of user to check
   * @returns {Promise<Object>} Follow status
   */
  async isFollowing(userId) {
    return this.client.request(`/profile/${userId}/is-following`);
  }
}

/**
 * Analytics API module
 */
class AnalyticsAPI {
  constructor(client) {
    this.client = client;
  }
  
  /**
   * Get practice trends analytics
   * @param {Object} [options] - Analytics options
   * @param {string} [options.timeframe='30d'] - Timeframe for analytics
   * @param {string} [options.granularity='daily'] - Granularity of data
   * @returns {Promise<Object>} Practice trends data
   */
  async getPracticeTrends(options = {}) {
    return this.client.request('/profile/analytics/practice-trends', {
      params: options
    });
  }
  
  /**
   * Get completion rates analytics
   * @param {Object} [options] - Analytics options
   * @param {string} [options.groupBy='category'] - Group by category or other criteria
   * @param {string} [options.timeframe='30d'] - Timeframe for analytics
   * @returns {Promise<Object>} Completion rates data
   */
  async getCompletionRates(options = {}) {
    return this.client.request('/profile/analytics/completion-rates', {
      params: options
    });
  }
  
  /**
   * Get streak analytics
   * @returns {Promise<Object>} Streak analytics data
   */
  async getStreaks() {
    return this.client.request('/profile/analytics/streaks');
  }
  
  /**
   * Get comparative analytics
   * @param {Object} [options] - Analytics options
   * @param {string} [options.timeframe='30d'] - Timeframe for analytics
   * @returns {Promise<Object>} Comparative analytics data
   */
  async getComparative(options = {}) {
    return this.client.request('/profile/analytics/comparative', {
      params: options
    });
  }
  
  /**
   * Get detailed progress report
   * @param {Object} dateRange - Date range for report
   * @param {string} dateRange.start - Start date (YYYY-MM-DD)
   * @param {string} dateRange.end - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Detailed progress report
   */
  async getDetailedReport(dateRange) {
    return this.client.request('/profile/analytics/detailed-report', {
      params: dateRange
    });
  }
  
  /**
   * Get practice heatmap
   * @param {Object} [options] - Heatmap options
   * @param {number} [options.year] - Year for heatmap data
   * @returns {Promise<Object>} Practice heatmap data
   */
  async getHeatmap(options = {}) {
    return this.client.request('/profile/analytics/heatmap', {
      params: options
    });
  }
  
  /**
   * Get category insights
   * @returns {Promise<Object>} Category insights data
   */
  async getCategoryInsights() {
    return this.client.request('/profile/analytics/category-insights');
  }
  
  /**
   * Export analytics as CSV
   * @param {Object} [options] - Export options
   * @param {string} [options.type='detailed'] - Type of export
   * @param {string} [options.start] - Start date (required for detailed export)
   * @param {string} [options.end] - End date (required for detailed export)
   * @returns {Promise<Blob>} CSV file blob
   */
  async exportCSV(options = {}) {
    // This would require special handling for binary responses
    throw new Error('CSV export not implemented in this client');
  }
  
  /**
   * Export analytics as PDF
   * @param {Object} [options] - Export options
   * @param {string} [options.type='detailed'] - Type of export
   * @param {string} [options.start] - Start date (required for detailed export)
   * @param {string} [options.end] - End date (required for detailed export)
   * @returns {Promise<Blob>} PDF file blob
   */
  async exportPDF(options = {}) {
    // This would require special handling for binary responses
    throw new Error('PDF export not implemented in this client');
  }
}

// Export for Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SaadhanaBoardClient;
} else if (typeof window !== 'undefined') {
  window.SaadhanaBoardClient = SaadhanaBoardClient;
}