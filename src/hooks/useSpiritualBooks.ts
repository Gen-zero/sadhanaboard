
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface SpiritualBook {
  id: number;
  title: string;
  author: string;
  description: string;
  tradition: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  pages?: number;
  isbn?: string;
  publisher?: string;
  publication_year?: number;
  language: string;
  tags: string[];
  cover_url?: string;
  created_at: string;
  updated_at: string;
}

export const useSpiritualBooks = (filters?: Record<string, unknown>) => {
  const query = useQuery({
    queryKey: ['spiritual-books', filters],
    queryFn: async (): Promise<{ books: SpiritualBook[]; total: number; limit: number; offset: number }> => {
      const data = await api.getBooks(filters || {});
      return {
        books: data.books || [],
        total: data.total || 0,
        limit: data.limit || (filters && filters.limit as number) || 20,
        offset: data.offset || (filters && filters.offset as number) || 0
      };
    },
  });

  return {
    books: query.data ? query.data.books : [],
    total: query.data ? query.data.total : 0,
    limit: query.data ? query.data.limit : (filters && filters.limit as number) || 20,
    offset: query.data ? query.data.offset : (filters && filters.offset as number) || 0,
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
