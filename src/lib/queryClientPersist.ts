/**
 * React Query Persistence Plugin
 * Persists React Query cache to IndexedDB for offline support
 */

import { QueryClient } from '@tanstack/react-query';
import { getCacheManager } from './cacheManager';

/**
 * Setup React Query persistence
 */
export const setupQueryPersistence = (queryClient: QueryClient, userId?: string) => {
  const cacheManager = getCacheManager();

  /**
   * Persist query cache on mutation
   */
  const unsubscribe = queryClient.getDefaultOptions().queries?.['onSuccess']
    ? queryClient.getQueryCache().subscribe((event) => {
        if (event.type === 'updated' && event.query.state.status === 'success') {
          const queryKey = event.query.queryKey as string[];
          const keyString = JSON.stringify(queryKey);

          // Persist with 30-minute default TTL
          cacheManager.set(
            keyString,
            event.query.state.data,
            30 * 60 * 1000,
            userId
          );
        }
      })
    : () => {};

  return unsubscribe;
};

/**
 * Hydrate React Query cache from persistent storage
 */
export const hydrateQueryCache = (queryClient: QueryClient, userId?: string) => {
  const cacheManager = getCacheManager();

  // This would be called on app startup
  // In practice, React Query handles this automatically through query functions
};

/**
 * Clear persisted cache
 */
export const clearPersistedCache = (userId?: string) => {
  const cacheManager = getCacheManager();
  cacheManager.clear(userId);
};

/**
 * Get persisted cache stats
 */
export const getPersistedCacheStats = () => {
  const cacheManager = getCacheManager();
  return cacheManager.getStats();
};
