import { Book, User, SystemMetric, SystemLog } from "@/types/admin";

// Base API configuration - Use relative path to work with Vite proxy
const API_BASE_URL = '/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Error handling helper
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  throw error;
};

// Books API
export const adminBooksApi = {
  // Get all books with filters
  getAllBooks: async (searchTerm: string = '', filters: any = {}) => {
    try {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        ...filters
      });
      
      const response = await fetch(`${API_BASE_URL}/books/admin/all?${queryParams}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  // Create a new book
  createBook: async (bookData: Partial<Book>, file?: File) => {
    try {
      const formData = new FormData();
      
      if (file) {
        formData.append('bookFile', file);
      }
      
      formData.append('bookData', JSON.stringify(bookData));
      
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          // Remove Content-Type to let browser set it with boundary for FormData
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  // Update a book
  updateBook: async (id: string, bookData: Partial<Book>, file?: File) => {
    try {
      const formData = new FormData();
      
      if (file) {
        formData.append('bookFile', file);
      }
      
      formData.append('bookData', JSON.stringify(bookData));
      
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          // Remove Content-Type to let browser set it with boundary for FormData
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  // Delete a book
  deleteBook: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  // Bulk delete books
  bulkDeleteBooks: async (bookIds: string[]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/admin/batch-delete`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ bookIds })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  }
};

// Users API
export const adminUsersApi = {
  // Get all users with filters
  getAllUsers: async (searchTerm: string = '', filters: any = {}) => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll return mock data
      return {
        users: [],
        total: 0
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  // Update user role/status
  updateUser: async (id: string, userData: Partial<User>) => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll return mock data
      return { success: true };
    } catch (error) {
      handleApiError(error);
    }
  },

  // Delete user
  deleteUser: async (id: string) => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll return mock data
      return { success: true };
    } catch (error) {
      handleApiError(error);
    }
  }
};

// System API
export const adminSystemApi = {
  // Get system metrics
  getSystemMetrics: async () => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll return mock data
      const metrics: SystemMetric[] = [
        { name: 'CPU Usage', value: 45, status: 'healthy', icon: 'Cpu' },
        { name: 'Memory', value: 68, status: 'healthy', icon: 'MemoryStick' },
        { name: 'Disk Space', value: 23, status: 'healthy', icon: 'HardDrive' },
        { name: 'Network', value: 87, status: 'healthy', icon: 'Wifi' },
        { name: 'Database', value: 12, status: 'healthy', icon: 'Database' },
        { name: 'Security', value: 100, status: 'healthy', icon: 'Shield' }
      ];
      
      return metrics;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get system logs
  getSystemLogs: async () => {
    try {
      // This would need to be implemented in the backend
      // For now, we'll return mock data
      const logs: SystemLog[] = [
        { id: '1', timestamp: '2023-10-15 14:30:22', level: 'info', message: 'System started successfully' },
        { id: '2', timestamp: '2023-10-15 14:35:17', level: 'info', message: 'Database connection established' },
        { id: '3', timestamp: '2023-10-15 14:42:05', level: 'warning', message: 'High memory usage detected' },
        { id: '4', timestamp: '2023-10-15 14:45:33', level: 'info', message: 'Memory usage normalized' },
        { id: '5', timestamp: '2023-10-15 14:50:12', level: 'error', message: 'Network latency spike' }
      ];
      
      return logs;
    } catch (error) {
      handleApiError(error);
    }
  }
};

// Auth API
export const adminAuthApi = {
  // Login
  login: async (username: string, password: string) => {
    try {
      console.log('Attempting login with:', { username, password });
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernameOrEmail: username, password })
      });
      
      console.log('Login response status:', response.status);
      console.log('Login response headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed with status:', response.status, 'Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('adminToken', data.token);
        console.log('Token stored in localStorage');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      handleApiError(error);
    }
  },

  // Logout
  logout: async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
      }
      return { success: true };
    } catch (error) {
      handleApiError(error);
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('adminToken');
  }
};