/**
 * useAuthToken Hook
 * Secure token storage and retrieval for authentication
 */

import React, { useCallback, useEffect, useState } from 'react';

/**
 * Token storage using sessionStorage + memory cache
 * sessionStorage: Cleared when browser tab closes (secure)
 * Memory cache: Faster access, lost on page refresh
 */
class SecureTokenStorage {
  private tokenKey: string;
  private refreshTokenKey: string;
  private tokenTypeKey: string;
  private expiresInKey: string;
  private memoryCache: {
    accessToken: string | null;
    refreshToken: string | null;
    tokenType: string | null;
    expiresAt: Date | null;
  };

  constructor() {
    this.tokenKey = 'sadhanaboard:auth:token';
    this.refreshTokenKey = 'sadhanaboard:auth:refresh';
    this.tokenTypeKey = 'sadhanaboard:auth:type';
    this.expiresInKey = 'sadhanaboard:auth:expires';
    this.memoryCache = {
      accessToken: null,
      refreshToken: null,
      tokenType: null,
      expiresAt: null,
    };
    this.initFromStorage();
  }

  /**
   * Initialize cache from sessionStorage
   */
  initFromStorage() {
    try {
      const token = sessionStorage.getItem(this.tokenKey);
      const refreshToken = sessionStorage.getItem(this.refreshTokenKey);
      const tokenType = sessionStorage.getItem(this.tokenTypeKey);
      const expiresIn = sessionStorage.getItem(this.expiresInKey);

      if (token) {
        this.memoryCache.accessToken = token;
        this.memoryCache.refreshToken = refreshToken;
        this.memoryCache.tokenType = tokenType || 'Bearer';
        if (expiresIn) {
          this.memoryCache.expiresAt = new Date(parseInt(expiresIn));
        }
      }
    } catch (error) {
      console.warn('Failed to initialize token storage:', error);
    }
  }

  /**
   * Store tokens
   */
  setTokens(tokens) {
    try {
      const { accessToken, refreshToken, tokenType = 'Bearer', expiresIn } = tokens;

      // Calculate expiration
      const expiresAt = expiresIn
        ? new Date(Date.now() + expiresIn * 1000)
        : null;

      // Store in sessionStorage (survives page refresh, cleared on tab close)
      sessionStorage.setItem(this.tokenKey, accessToken);
      if (refreshToken) {
        sessionStorage.setItem(this.refreshTokenKey, refreshToken);
      }
      sessionStorage.setItem(this.tokenTypeKey, tokenType);
      if (expiresAt) {
        sessionStorage.setItem(this.expiresInKey, expiresAt.getTime().toString());
      }

      // Update memory cache
      this.memoryCache.accessToken = accessToken;
      this.memoryCache.refreshToken = refreshToken;
      this.memoryCache.tokenType = tokenType;
      this.memoryCache.expiresAt = expiresAt;
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  /**
   * Get access token
   */
  getAccessToken() {
    return this.memoryCache.accessToken;
  }

  /**
   * Get refresh token
   */
  getRefreshToken() {
    return this.memoryCache.refreshToken;
  }

  /**
   * Get token type (e.g., 'Bearer')
   */
  getTokenType() {
    return this.memoryCache.tokenType || 'Bearer';
  }

  /**
   * Get authorization header value
   */
  getAuthHeader() {
    const token = this.getAccessToken();
    if (!token) return null;
    return `${this.getTokenType()} ${token}`;
  }

  /**
   * Check if token exists
   */
  hasToken() {
    return !!this.getAccessToken();
  }

  /**
   * Check if token is expired
   */
  isTokenExpired() {
    if (!this.memoryCache.expiresAt) return false;
    return new Date() >= this.memoryCache.expiresAt;
  }

  /**
   * Get time until expiration (milliseconds)
   */
  getTimeUntilExpiry() {
    if (!this.memoryCache.expiresAt) return null;
    const msUntilExpiry = this.memoryCache.expiresAt.getTime() - Date.now();
    return Math.max(0, msUntilExpiry);
  }

  /**
   * Clear all tokens
   */
  clearTokens() {
    try {
      sessionStorage.removeItem(this.tokenKey);
      sessionStorage.removeItem(this.refreshTokenKey);
      sessionStorage.removeItem(this.tokenTypeKey);
      sessionStorage.removeItem(this.expiresInKey);

      this.memoryCache = {
        accessToken: null,
        refreshToken: null,
        tokenType: null,
        expiresAt: null,
      };
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Decode JWT without verification (for debugging)
   */
  decodeToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch {
      return null;
    }
  }

  /**
   * Get token metadata
   */
  getTokenMetadata() {
    const token = this.getAccessToken();
    if (!token) return null;

    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    return {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role,
      issuedAt: new Date(decoded.iat * 1000),
      expiresAt: this.memoryCache.expiresAt,
      expiresIn: this.getTimeUntilExpiry(),
      isExpired: this.isTokenExpired(),
    };
  }
}

// Singleton instance
let storageInstance = null;

function getTokenStorage() {
  if (!storageInstance) {
    storageInstance = new SecureTokenStorage();
  }
  return storageInstance;
}

/**
 * Hook: useAuthToken
 * Provides token management with auto-refresh support
 */
export function useAuthToken() {
  const storage = getTokenStorage();
  const [token, setToken] = useState(storage.getAccessToken());
  const [isExpired, setIsExpired] = useState(storage.isTokenExpired());
  const [metadata, setMetadata] = useState(storage.getTokenMetadata());

  /**
   * Store tokens
   */
  const storeTokens = useCallback((tokens) => {
    storage.setTokens(tokens);
    setToken(storage.getAccessToken());
    setIsExpired(storage.isTokenExpired());
    setMetadata(storage.getTokenMetadata());
  }, []);

  /**
   * Clear tokens (logout)
   */
  const clearTokens = useCallback(() => {
    storage.clearTokens();
    setToken(null);
    setIsExpired(true);
    setMetadata(null);
  }, []);

  /**
   * Get authorization header
   */
  const getAuthHeader = useCallback(() => {
    return storage.getAuthHeader();
  }, []);

  /**
   * Check if token needs refresh
   */
  const needsRefresh = useCallback(() => {
    const timeUntilExpiry = storage.getTimeUntilExpiry();
    if (!timeUntilExpiry) return false;
    // Refresh if less than 2 minutes until expiry
    return timeUntilExpiry < 2 * 60 * 1000;
  }, []);

  /**
   * Setup auto-refresh timer
   */
  useEffect(() => {
    if (!token || isExpired) return;

    const timeUntilExpiry = storage.getTimeUntilExpiry();
    if (!timeUntilExpiry) return;

    // Refresh 2 minutes before expiry
    const refreshTime = Math.max(0, timeUntilExpiry - 2 * 60 * 1000);

    const timer = setTimeout(() => {
      setIsExpired(true);
      // Trigger refresh through context or callback
      window.dispatchEvent(new CustomEvent('token:expiring-soon'));
    }, refreshTime);

    return () => clearTimeout(timer);
  }, [token, isExpired]);

  return {
    token,
    isExpired,
    metadata,
    hasToken: storage.hasToken(),
    storeTokens,
    clearTokens,
    getAuthHeader,
    needsRefresh,
    getTimeUntilExpiry: () => storage.getTimeUntilExpiry(),
  };
}

/**
 * Hook: useTokenRefresh
 * Handles automatic token refresh with proper cleanup
 */
export function useTokenRefresh() {
  const { token, getAuthHeader, storeTokens, clearTokens, needsRefresh } = useAuthToken();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const isMountedRef = React.useRef(true);

  // Track component mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Abort any pending refresh requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refreshToken = useCallback(async (refreshTokenValue) => {
    if (isRefreshing) return;
    if (!isMountedRef.current) return; // Don't start refresh if component is unmounting

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    if (isMountedRef.current) {
      setIsRefreshing(true);
      setRefreshError(null);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getAuthHeader(),
          },
          body: JSON.stringify({
            refreshToken: refreshTokenValue,
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        storeTokens(data);
      }

      return data;
    } catch (error) {
      // Only update state if component is still mounted and error is not abort
      if (isMountedRef.current && error instanceof Error && error.name !== 'AbortError') {
        setRefreshError(error.message);
        clearTokens();
      }
      throw error;
    } finally {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setIsRefreshing(false);
      }
    }
  }, [isRefreshing, getAuthHeader, storeTokens, clearTokens]);

  return {
    refreshToken,
    isRefreshing,
    refreshError,
    needsRefresh,
  };
}

/**
 * Hook: useTokenInfo
 * Get current token information
 */
export function useTokenInfo() {
  const storage = getTokenStorage();
  const [info, setInfo] = useState(storage.getTokenMetadata());

  useEffect(() => {
    const updateInfo = () => {
      setInfo(storage.getTokenMetadata());
    };

    // Update on token changes
    window.addEventListener('storage', updateInfo);
    return () => window.removeEventListener('storage', updateInfo);
  }, []);

  return info;
}

/**
 * Export storage instance for direct use
 */
export const tokenStorage = getTokenStorage();
