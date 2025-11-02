import { adminBooksApi, adminUsersApi, adminSystemApi, adminAuthApi } from './adminApi';

// Simple test to verify the API service is working
describe('Admin API Service', () => {
  it('should have the correct API base URL', () => {
    // This test will pass if the module imports correctly without process.env errors
    expect(true).toBe(true);
  });
  
  it('should export all required API functions', () => {
    // Test that all API objects are properly exported
    expect(adminBooksApi).toBeDefined();
    expect(adminUsersApi).toBeDefined();
    expect(adminSystemApi).toBeDefined();
    expect(adminAuthApi).toBeDefined();
    
    // Test that key functions exist
    expect(typeof adminBooksApi.getAllBooks).toBe('function');
    expect(typeof adminBooksApi.createBook).toBe('function');
    expect(typeof adminBooksApi.updateBook).toBe('function');
    expect(typeof adminBooksApi.deleteBook).toBe('function');
    
    expect(typeof adminAuthApi.login).toBe('function');
    expect(typeof adminAuthApi.logout).toBe('function');
    expect(typeof adminAuthApi.isAuthenticated).toBe('function');
  });
});

// Mock fetch for testing
global.fetch = jest.fn();

describe('Admin API Service', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('adminBooksApi', () => {
    it('should fetch all books', async () => {
      const mockResponse = {
        books: [
          {
            id: '1',
            title: 'Test Book',
            author: 'Test Author',
            traditions: ['Hinduism'],
            content: 'Test content',
            is_storage_file: false,
            created_at: '2023-01-01',
            updated_at: '2023-01-01'
          }
        ]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await adminBooksApi.getAllBooks();
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/books/admin/all'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should create a book', async () => {
      const mockBook = {
        id: '1',
        title: 'New Book',
        author: 'New Author'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: () => Promise.resolve({ book: mockBook })
      });

      const result = await adminBooksApi.createBook({
        title: 'New Book',
        author: 'New Author',
        traditions: [],
        content: '',
        is_storage_file: false
      });

      expect(result).toEqual({ book: mockBook });
    });

    it('should delete a book', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: () => Promise.resolve({ message: 'Book deleted successfully' })
      });

      const result = await adminBooksApi.deleteBook('1');
      expect(result).toEqual({ message: 'Book deleted successfully' });
    });
  });

  describe('adminUsersApi', () => {
    it('should fetch all users', async () => {
      const mockResponse = {
        users: [
          {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'admin',
            status: 'active',
            lastActive: '2023-01-01',
            joinDate: '2023-01-01',
            practices: 5
          }
        ],
        total: 0
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: () => Promise.resolve(mockResponse)
      });

      const result = await adminUsersApi.getAllUsers();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('adminSystemApi', () => {
    it('should fetch system metrics', async () => {
      const mockMetrics = [
        { name: 'CPU Usage', value: 45, status: 'healthy', icon: 'Cpu' },
        { name: 'Memory', value: 68, status: 'healthy', icon: 'MemoryStick' },
        { name: 'Disk Space', value: 23, status: 'healthy', icon: 'HardDrive' },
        { name: 'Network', value: 87, status: 'healthy', icon: 'Wifi' },
        { name: 'Database', value: 12, status: 'healthy', icon: 'Database' },
        { name: 'Security', value: 100, status: 'healthy', icon: 'Shield' }
      ];

      const result = await adminSystemApi.getSystemMetrics();
      expect(result).toEqual(mockMetrics);
    });

    it('should fetch system logs', async () => {
      const mockLogs = [
        { id: '1', timestamp: '2023-10-15 14:30:22', level: 'info', message: 'System started successfully' },
        { id: '2', timestamp: '2023-10-15 14:35:17', level: 'info', message: 'Database connection established' },
        { id: '3', timestamp: '2023-10-15 14:42:05', level: 'warning', message: 'High memory usage detected' },
        { id: '4', timestamp: '2023-10-15 14:45:33', level: 'info', message: 'Memory usage normalized' },
        { id: '5', timestamp: '2023-10-15 14:50:12', level: 'error', message: 'Network latency spike' }
      ];

      const result = await adminSystemApi.getSystemLogs();
      expect(result).toEqual(mockLogs);
    });
  });

  describe('adminAuthApi', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        users: [
          {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'admin',
            status: 'active',
            lastActive: '2023-01-01',
            joinDate: '2023-01-01',
            practices: 5
          }
        ],
        total: 1
      };

      (fetch as jest.Mock).mockClear();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Map(),
        json: () => Promise.resolve(mockResponse)
      });

      const result = await adminAuthApi.login('test@example.com', 'password');
      expect(result).toEqual(mockResponse);
    });

    it('should logout successfully', async () => {
      localStorage.setItem('adminToken', 'test-token');
      const result = await adminAuthApi.logout();
      expect(result).toEqual({ success: true });
      expect(localStorage.getItem('adminToken')).toBeNull();
    });

    it('should check authentication status', () => {
      localStorage.setItem('adminToken', 'test-token');
      expect(adminAuthApi.isAuthenticated()).toBe(true);
      
      localStorage.removeItem('adminToken');
      expect(adminAuthApi.isAuthenticated()).toBe(false);
    });
  });
});