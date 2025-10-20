
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface SpiritualBook {
  id: string;
  user_id: string;
  title: string;
  author: string;
  traditions: string[];
  content: string;
  description?: string;
  year?: number;
  language?: string;
  page_count?: number;
  cover_url?: string;
  created_at: string;
  updated_at: string;
}

export const useSpiritualBooks = (filters?: Record<string, any>) => {
  const query = useQuery({
    queryKey: ['spiritual-books', filters],
    queryFn: async (): Promise<{ books: SpiritualBook[]; total: number; limit: number; offset: number }> => {
      const data = await api.getBooks(filters || {});
      return {
        books: data.books || [],
        total: data.total || 0,
        limit: data.limit || (filters && filters.limit) || 20,
        offset: data.offset || (filters && filters.offset) || 0
      };
    },
  });

  return {
    books: query.data ? query.data.books : [],
    total: query.data ? query.data.total : 0,
    limit: query.data ? query.data.limit : (filters && filters.limit) || 20,
    offset: query.data ? query.data.offset : (filters && filters.offset) || 0,
    isLoading: query.isLoading,
    error: query.error,
    refreshBooks: query.refetch
  };
};

// Hook to get unique traditions from all books
export const useBookTraditions = () => {
  return useQuery({
    queryKey: ['book-traditions'],
    queryFn: async (): Promise<string[]> => {
      const data = await api.getBookTraditions();
      return data.traditions || [];
    },
  });
};
