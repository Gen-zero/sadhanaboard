import { useQuery } from '@tanstack/react-query';
import { bookApi } from '@/services/bookApi';
import type { BookProgress } from '@/types/books';

interface UseReadingProgressOptions {
  batchSize?: number;
  delayMs?: number;
}

interface UseReadingProgressReturn {
  progressMap: Record<string, BookProgress | null>;
  isLoading: boolean;
  getProgress: (bookId: string) => BookProgress | null;
}

export function useReadingProgress(
  bookIds: string[], 
  options: UseReadingProgressOptions = { batchSize: 10, delayMs: 50 }
): UseReadingProgressReturn {
  const sortedKey = [...bookIds].sort().join(',');
  const queryKey = ['reading-progress', sortedKey];
  
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const progressMap: Record<string, BookProgress | null> = {};
      
      // Process bookIds in chunks to limit concurrent requests
      const batchSize = options.batchSize || 10;
      const delayMs = options.delayMs || 50;
      
      for (let i = 0; i < bookIds.length; i += batchSize) {
        const chunk = bookIds.slice(i, i + batchSize);
        
        // Use Promise.allSettled to handle failures gracefully
        const promises = chunk.map(async (id) => {
          try {
            const res = await bookApi.getProgress(Number(id));
            return { id, progress: res.data || null };
          } catch (e) {
            // Return null for failed requests
            return { id, progress: null };
          }
        });
        
        const results = await Promise.allSettled(promises);
        
        // Add results to progressMap and ensure all keys exist
        bookIds.forEach(id => {
          progressMap[id] = null; // Initialize all keys with null
        });
              
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const { id, progress } = result.value;
            progressMap[id] = progress;
          }
        });
        
        // Add delay between chunks if not the last chunk
        if (i + batchSize < bookIds.length && delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
      
      return progressMap;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: bookIds.length > 0,
  });

  const getProgress = (bookId: string) => {
    return query.data?.[bookId] || null;
  };

  return {
    progressMap: query.data || {},
    isLoading: query.isLoading,
    getProgress,
  };
}