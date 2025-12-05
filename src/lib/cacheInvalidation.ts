/**
 * Cache Invalidation Strategies
 * Centralized cache invalidation logic
 */

import { QueryClient } from '@tanstack/react-query';
import { getCacheManager } from './cacheManager';
import { bookKeys } from '@/hooks/useBooks';
import { sadhanaKeys } from '@/hooks/useSadhanas';
import { profileKeys } from '@/hooks/useProfile';
import { communityKeys } from '@/hooks/useCommunity';
import { analyticsKeys } from '@/hooks/useAnalytics';

/**
 * Cache invalidation manager
 */
export class CacheInvalidationManager {
  private queryClient: QueryClient;
  private cacheManager = getCacheManager();
  private userId: string | null = null;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Set current user ID for scoped invalidation
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Clear user ID (on logout)
   */
  clearUserId(): void {
    this.userId = null;
  }

  /**
   * Invalidate all book-related caches
   */
  invalidateBooks(): void {
    this.queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
    this.cacheManager.deletePattern('books:*', this.userId);
  }

  /**
   * Invalidate specific book cache
   */
  invalidateBook(bookId: string): void {
    this.queryClient.invalidateQueries({ queryKey: bookKeys.detail(bookId) });
    this.cacheManager.delete(`books:${bookId}`, this.userId);
  }

  /**
   * Invalidate book search caches
   */
  invalidateBookSearch(): void {
    this.queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
    this.cacheManager.deletePattern('books:search:*', this.userId);
  }

  /**
   * Invalidate all sadhana caches
   */
  invalidateSadhanas(): void {
    this.queryClient.invalidateQueries({ queryKey: sadhanaKeys.lists() });
    this.cacheManager.deletePattern('sadhanas:*', this.userId);
  }

  /**
   * Invalidate specific sadhana
   */
  invalidateSadhana(sadhanaId: string): void {
    this.queryClient.invalidateQueries({ queryKey: sadhanaKeys.detail(sadhanaId) });
    this.cacheManager.delete(`sadhanas:${sadhanaId}`, this.userId);
  }

  /**
   * Invalidate sadhana progress
   */
  invalidateSadhanaProgress(sadhanaId: string): void {
    this.queryClient.invalidateQueries({ queryKey: sadhanaKeys.progressDetail(sadhanaId) });
    this.cacheManager.delete(`sadhanas:progress:${sadhanaId}`, this.userId);
  }

  /**
   * Invalidate sadhana stats
   */
  invalidateSadhanaStats(): void {
    this.cacheManager.delete('sadhanas:stats', this.userId);
  }

  /**
   * Invalidate all profile-related caches
   */
  invalidateProfile(): void {
    this.queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
    this.cacheManager.delete('profile:detail', this.userId);
  }

  /**
   * Invalidate user settings
   */
  invalidateSettings(): void {
    this.queryClient.invalidateQueries({ queryKey: profileKeys.settings() });
    this.cacheManager.delete('profile:settings', this.userId);
  }

  /**
   * Invalidate all profile and settings
   */
  invalidateUserData(): void {
    this.invalidateProfile();
    this.invalidateSettings();
  }

  /**
   * Invalidate community feed
   */
  invalidateCommunityFeed(): void {
    this.queryClient.invalidateQueries({ queryKey: communityKeys.feed() });
    this.cacheManager.deletePattern('community:feed:*', this.userId);
  }

  /**
   * Invalidate specific post
   */
  invalidatePost(postId: string): void {
    this.queryClient.invalidateQueries({ queryKey: communityKeys.post(postId) });
    this.cacheManager.delete(`community:post:${postId}`, this.userId);
  }

  /**
   * Invalidate post comments
   */
  invalidatePostComments(postId: string): void {
    this.queryClient.invalidateQueries({ queryKey: communityKeys.commentsForPost(postId) });
    this.cacheManager.delete(`community:comments:${postId}`, this.userId);
  }

  /**
   * Invalidate community stats
   */
  invalidateCommunityStats(): void {
    this.cacheManager.delete('community:stats', this.userId);
  }

  /**
   * Invalidate all analytics caches
   */
  invalidateAnalytics(): void {
    this.queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    this.cacheManager.deletePattern('analytics:*', this.userId);
  }

  /**
   * Invalidate user progress analytics
   */
  invalidateUserProgress(): void {
    this.queryClient.invalidateQueries({ queryKey: analyticsKeys.userProgress() });
    this.cacheManager.delete('analytics:userProgress', this.userId);
  }

  /**
   * Invalidate practice trends
   */
  invalidatePracticeTrends(): void {
    this.queryClient.invalidateQueries({ queryKey: analyticsKeys.practiceTrends() });
    this.cacheManager.deletePattern('analytics:trends:*', this.userId);
  }

  /**
   * Invalidate completion rates
   */
  invalidateCompletionRates(): void {
    this.queryClient.invalidateQueries({ queryKey: analyticsKeys.completionRates() });
    this.cacheManager.deletePattern('analytics:completion:*', this.userId);
  }

  /**
   * Clear all caches for current user
   */
  clearUserCache(): void {
    if (this.userId) {
      this.cacheManager.clear(this.userId);
    }
    this.queryClient.clear();
  }

  /**
   * Clear all caches globally
   */
  clearAll(): void {
    this.cacheManager.clear();
    this.queryClient.clear();
  }

  /**
   * Handle real-time event - sadhana completed
   */
  onSadhanaCompleted(sadhanaId: string): void {
    this.invalidateSadhana(sadhanaId);
    this.invalidateSadhanaStats();
    this.invalidateUserProgress();
    this.invalidatePracticeTrends();
  }

  /**
   * Handle real-time event - sadhana progress updated
   */
  onSadhanaProgressUpdated(sadhanaId: string): void {
    this.invalidateSadhanaProgress(sadhanaId);
    this.invalidateUserProgress();
  }

  /**
   * Handle real-time event - new community post
   */
  onNewPost(): void {
    this.invalidateCommunityFeed();
    this.invalidateCommunityStats();
  }

  /**
   * Handle real-time event - post liked/unliked
   */
  onPostLiked(postId: string): void {
    this.invalidatePost(postId);
    this.invalidateCommunityStats();
    this.invalidateCommunityFeed();
  }

  /**
   * Handle real-time event - user profile updated
   */
  onProfileUpdated(): void {
    this.invalidateProfile();
  }

  /**
   * Handle real-time event - user activity
   */
  onUserActivity(): void {
    this.invalidateCommunityFeed();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cacheManager.getStats();
  }
}

/**
 * Create cache invalidation manager instance
 */
export const createCacheInvalidationManager = (queryClient: QueryClient) => {
  return new CacheInvalidationManager(queryClient);
};
