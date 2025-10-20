
export interface SpiritualBook {
  id: string;
  user_id?: string;
  title: string;
  author: string;
  traditions?: string[];
  content?: string | null;
  storage_url?: string | null;
  is_storage_file?: boolean;
  file_size?: number | null;
  description?: string | null;
  year?: number | null;
  language?: string | null;
  page_count?: number | null;
  cover_url?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  profilePicture?: string;
  preferences?: {
    favoriteBooks?: string[];
    readingHistory?: {
      bookId: string;
      lastReadPosition: number;
      lastReadDate: string;
    }[];
    theme?: 'light' | 'dark' | 'system';
  };
}

export interface BookFilters {
  search?: string;
  traditions?: string[];
  language?: string;
  minYear?: number | null;
  maxYear?: number | null;
  fileType?: 'all' | 'pdf' | 'text';
  sortBy?: 'created_at' | 'title' | 'author' | 'year' | 'language';
  sortOrder?: 'asc' | 'desc';
  showDeleted?: boolean;
  limit?: number;
  offset?: number;
  preset?: string; // tracks which preset is currently active
}

export interface BookSuggestion {
  id: string;
  title: string;
  author?: string;
  tradition?: string;
}

// Analytics types
export interface LibraryAnalyticsOverview {
  totalBooks: number;
  totalStorage: number; // bytes
  recentUploads: number;
  totalViews: number;
  totalDownloads: number;
}

export interface TrendDataPoint {
  date: string; // ISO date
  count: number;
}

export interface PopularBook {
  id: string;
  title: string;
  author?: string | null;
  views: number;
}

export interface TopDownload {
  id: string;
  title: string;
  author?: string | null;
  downloads: number;
}

export interface EngagementMetrics {
  viewsOverTime: TrendDataPoint[];
  downloadsOverTime: TrendDataPoint[];
  uniqueViewers: number;
  avgViewsPerBook: number;
}

export interface StorageBreakdown {
  byTradition: Array<{ tradition: string | null; size: number }>;
  byLanguage: Array<{ language: string | null; size: number }>;
  byYear: Array<{ year: number | null; size: number }>;
}

export interface LibraryAnalytics {
  overview: LibraryAnalyticsOverview;
  uploadTrends: TrendDataPoint[];
  popularBooks: PopularBook[];
  topDownloads: TopDownload[];
  engagement: EngagementMetrics;
  storageBreakdown: StorageBreakdown;
}

export interface BookAnalytics {
  totalViews: number;
  totalDownloads: number;
  uniqueViewers: number;
  firstViewed: string | null;
  lastViewed: string | null;
  viewTrend: TrendDataPoint[]; // daily counts
}

export interface AnalyticsExportFilters {
  startDate?: string;
  endDate?: string;
  bookIds?: string[];
  format?: 'csv' | 'json';
}

export interface AdminBooksResponse {
  books: SpiritualBook[];
  total: number;
}

// Bulk upload / batch edit types
export interface ProcessedFile {
  file: File;
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'processing' | 'ready' | 'error';
  error?: string;
}

export interface UploadResult {
  success: boolean;
  fileName: string;
  bookId?: string;
  error?: string;
}

export interface BulkOperationResponse {
  results: UploadResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

export interface BookMetadata {
  title: string;
  author: string;
  traditions: string[];
  description?: string;
  year?: number;
  language: string;
}

export interface CSVBookRow {
  filename: string;
  title: string;
  author: string;
  traditions?: string;
  description?: string;
  year?: string | number;
  language?: string;
}

export interface BatchUpdateRequest {
  id: string;
  bookData: Partial<SpiritualBook>;
}

export interface URLImportRequest {
  url: string;
  bookData: BookMetadata;
}

// Reading progress, bookmarks, annotations
export interface BookProgress {
  id: number;
  user_id: number;
  book_id: number;
  position?: string | null;
  page?: number | null;
  percent?: number | null;
  last_seen_at?: string | null;
  time_spent_minutes?: number | null;  // Added for time-spent tracking
}

export interface Bookmark {
  id: number;
  user_id: number;
  book_id: number;
  label?: string | null;
  page?: number | null;
  position?: any;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Annotation {
  id: number;
  user_id: number;
  book_id: number;
  page?: number | null;
  position?: any;
  content?: string | null;
  is_private?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Filter Preset Types
export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  icon?: string;
  filters: Partial<BookFilters>;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: BookFilters;
  createdAt: string;
  lastUsed?: string;
}


