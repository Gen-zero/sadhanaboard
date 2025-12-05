import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

/**
 * Query key factory for books
 * Ensures consistent cache key structure
 */
export const bookKeys = {
  all: ['books'] as const,
  lists: () => [...bookKeys.all, 'list'] as const,
  list: (filters?: any) => [...bookKeys.lists(), { filters }] as const,
  details: () => [...bookKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookKeys.details(), id] as const,
  suggestions: () => [...bookKeys.all, 'suggestions'] as const,
  languages: () => [...bookKeys.all, 'languages'] as const,
  yearRange: () => [...bookKeys.all, 'yearRange'] as const,
  traditions: () => [...bookKeys.all, 'traditions'] as const,
};

/**
 * Hook: Fetch books with filtering and pagination
 */
export const useBooks = (filters?: {
  search?: string;
  traditions?: string[];
  language?: string;
  minYear?: number;
  maxYear?: number;
  fileType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: bookKeys.list(filters),
    queryFn: async () => {
      const response = await api.getBooks(filters || {});
      return response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
};

/**
 * Hook: Fetch single book by ID
 */
export const useBook = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: bookKeys.detail(id),
    queryFn: async () => {
      const response = await api.getBookById(id);
      return response;
    },
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
  });
};

/**
 * Hook: Fetch book suggestions
 */
export const useBookSuggestions = (query: string, limit: number = 10) => {
  return useQuery({
    queryKey: [...bookKeys.suggestions(), query, limit],
    queryFn: async () => {
      const response = await api.getBookSuggestions(query, limit);
      return response;
    },
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });
};

/**
 * Hook: Fetch available languages
 */
export const useLanguages = () => {
  return useQuery({
    queryKey: bookKeys.languages(),
    queryFn: async () => {
      const response = await api.getLanguages();
      return response;
    },
    staleTime: 1000 * 60 * 60, // 1 hour (rarely changes)
    gcTime: 1000 * 60 * 60 * 24, // 1 day
    retry: 1,
  });
};

/**
 * Hook: Fetch year range for books
 */
export const useYearRange = () => {
  return useQuery({
    queryKey: bookKeys.yearRange(),
    queryFn: async () => {
      const response = await api.getYearRange();
      return response;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 1 day
    retry: 1,
  });
};

/**
 * Hook: Fetch book traditions/categories
 */
export const useBookTraditions = () => {
  return useQuery({
    queryKey: bookKeys.traditions(),
    queryFn: async () => {
      const response = await api.getBookTraditions();
      return response;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 1 day
    retry: 1,
  });
};

/**
 * Hook: Create a new book
 */
export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      bookData: any;
      file?: File;
    }) => {
      const response = await api.createBook(data.bookData, data.file);
      return response;
    },
    onSuccess: (newBook) => {
      // Invalidate books list to refetch
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
      // Add to cache
      queryClient.setQueryData(bookKeys.detail(newBook.id), newBook);
    },
    onError: (error) => {
      console.error('Failed to create book:', error);
    },
  });
};

/**
 * Hook: Update book
 */
export const useUpdateBook = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookData: any) => {
      const response = await api.put(`/books/${id}`, bookData);
      return response;
    },
    onSuccess: (updatedBook) => {
      // Update cache
      queryClient.setQueryData(bookKeys.detail(id), updatedBook);
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update book:', error);
    },
  });
};

/**
 * Hook: Delete book
 */
export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/books/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: bookKeys.detail(deletedId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: bookKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete book:', error);
    },
  });
};

/**
 * Hook: Search books with debouncing
 */
export const useSearchBooks = (searchTerm: string, traditions?: string[]) => {
  return useBooks({
    search: searchTerm,
    traditions,
    limit: 20,
  });
};
