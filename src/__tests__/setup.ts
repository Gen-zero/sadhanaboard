/**
 * Test Setup and Configuration
 * Global test configuration for all test suites
 */

import '@testing-library/jest-dom';
import { QueryClient } from '@tanstack/react-query';

/**
 * Mock fetch globally
 */
global.fetch = jest.fn();

/**
 * Reset fetch before each test
 */
beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
});

/**
 * Create a fresh QueryClient for each test
 */
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

/**
 * Mock localStorage
 */
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

/**
 * Mock BroadcastChannel
 */
class MockBroadcastChannel {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage(message: any) {
    // Mock implementation
  }

  addEventListener(event: string, listener: any) {
    if (event === 'message') {
      this.onmessage = listener;
    }
  }

  removeEventListener(event: string, listener: any) {
    if (event === 'message') {
      this.onmessage = null;
    }
  }

  close() {
    // Mock implementation
  }
}

Object.defineProperty(window, 'BroadcastChannel', {
  value: MockBroadcastChannel,
});

/**
 * Mock Socket.io
 */
export const createMockSocket = () => {
  const listeners: Map<string, Array<(data?: any) => void>> = new Map();

  return {
    id: 'mock-socket-id',
    on: jest.fn((event: string, callback: (data?: any) => void) => {
      if (!listeners.has(event)) {
        listeners.set(event, []);
      }
      listeners.get(event)!.push(callback);
    }),
    off: jest.fn((event: string, callback?: (data?: any) => void) => {
      if (callback) {
        const cbs = listeners.get(event) || [];
        const index = cbs.indexOf(callback);
        if (index > -1) {
          cbs.splice(index, 1);
        }
      } else {
        listeners.delete(event);
      }
    }),
    emit: jest.fn((event: string, data: any) => {
      const callbacks = listeners.get(event) || [];
      callbacks.forEach(cb => cb(data));
    }),
    disconnect: jest.fn(),
    connect: jest.fn(),
    listeners,
  };
};

/**
 * Mock auth context
 */
export const createMockAuthContext = () => ({
  user: { id: 'test-user', email: 'test@example.com', display_name: 'Test User' },
  isLoading: false,
  isOnboardingComplete: true,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
  checkOnboardingStatus: jest.fn(),
  refreshOnboardingStatus: jest.fn(),
});

/**
 * Sleep utility for async tests
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API responses
 */
export const mockApiResponses = {
  books: [
    {
      id: 'book-1',
      title: 'The Bhagavad Gita',
      author: 'Vyasa',
      traditions: ['Hinduism'],
      language: 'English',
      year: 2020,
    },
  ],
  sadhanas: [
    {
      _id: 'sadhana-1',
      title: 'Morning Meditation',
      type: 'Meditation',
      status: 'active',
      duration: 30,
      frequency: 'daily',
    },
  ],
  profile: {
    _id: 'profile-1',
    user_id: 'test-user',
    onboarding_completed: true,
  },
  communityFeed: {
    feed: [
      {
        id: 'post-1',
        content: 'Great sadhana today!',
        likeCount: 5,
        userLiked: false,
      },
    ],
  },
  analytics: {
    userProgress: {
      totalSadhanas: 10,
      completedSadhanas: 7,
      averageSessionMinutes: 25,
    },
  },
};
