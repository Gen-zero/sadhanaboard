import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Filter, StoreIcon, ShoppingCart, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import LibraryHeader from './LibraryHeader';
import SearchBar from './SearchBar';
import AdvancedFilters from './AdvancedFilters';
import FilterChips from './FilterChips';
import LibraryLoading from './LibraryLoading';
import BookShelf from './BookShelf';
import BookViewer from './BookViewer';
import RecommendedRow from './RecommendedRow';
import RecentlyAddedSection from './RecentlyAddedSection';
import ContinueReadingSection from './ContinueReadingSection';
import FoundationsCategory from './FoundationsCategory';
import BookRequestDialog from './BookRequestDialog';
import FoundationSadhanaViewer from './FoundationSadhanaViewer';
import SadhanaStore from './store/SadhanaStore';
import { useSpiritualBooks, useBookTraditions } from '@/hooks/useSpiritualBooks';
import { useReadingProgress } from '@/hooks/useReadingProgress';

import { api } from '@/services/api';
import type { BookFilters } from '@/types/books';
import type { StoreSadhana } from '@/types/store';
import type { BookSuggestion } from '@/types/books';
import { useIsMobile } from '@/hooks/use-mobile';
import { loadLastFilters, saveLastFilters } from '@/lib/filterStorage';

const LibraryContainer = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<BookFilters>({ limit: 40, offset: 0 });
  const { books, isLoading, total = 0, limit = 40, offset = 0, refreshBooks } = useSpiritualBooks(filters as Record<string, unknown>);
  const bookIdsForProgress = books.map(book => book.id);
  const { progressMap } = useReadingProgress(bookIdsForProgress, { batchSize: 10, delayMs: 50 }); // Add batching options
  const { data: traditions = [], isLoading: traditionsLoading } = useBookTraditions();
  // Languages and year range loaded from API endpoints
  const { data: languages = [], isLoading: languagesLoading } = useQuery({ queryKey: ['book-languages'], queryFn: async () => { const r = await api.getLanguages(); return r.languages || []; } });
  const { data: yearRange = { min: null as number | null, max: null as number | null }, isLoading: yearRangeLoading } = useQuery({ queryKey: ['book-year-range'], queryFn: async () => { const r = await api.getYearRange(); return { min: r.min, max: r.max }; } });
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedFoundationSadhana, setSelectedFoundationSadhana] = useState<StoreSadhana | null>(null);
  // Search is managed via filters.search; no local searchQuery duplication
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("books");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false); // New state for desktop filters
  const isMobile = useIsMobile();
  
  const DEFAULT_LIMIT = 40;

  // Load last used filters on mount
  useEffect(() => {
    const lastFilters = loadLastFilters();
    if (lastFilters) {
      // Merge with defaults to ensure limit and offset are set
      setFilters({
        limit: DEFAULT_LIMIT,
        offset: 0,
        ...lastFilters
      });
    }
  }, []);

  // Save filters to localStorage when they change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveLastFilters(filters);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFiltersChange = (next: Partial<BookFilters>) => {
    setFilters(prev => {
      const isOnlyOffset = Object.keys(next).length === 1 && 'offset' in next;
      const isPresetChangeOnly = Object.keys(next).length === 1 && 'preset' in next;

      let merged = { ...prev, ...next } as BookFilters;
      if (!isOnlyOffset && !isPresetChangeOnly && prev.preset) {
        const { preset, ...rest } = merged;
        merged = rest;
      }
      return 'offset' in next ? merged : { ...merged, offset: 0 };
    });
  };

  const hasActiveFilters = Boolean(
    (filters.search && filters.search.length > 0) ||
    (filters.traditions && filters.traditions.length > 0) ||
    filters.language ||
    filters.minYear ||
    filters.maxYear ||
    (filters.fileType && filters.fileType !== 'all') ||
    (filters.preset) // Include preset in active filters check
  );

  // Calculate filter count for mobile badge
  const filterCount = useMemo(() => {
    let count = 0;
    if (filters.search && filters.search.length > 0) count++;
    if (filters.traditions && filters.traditions.length > 0) count += filters.traditions.length;
    if (filters.language) count++;
    if (filters.minYear || filters.maxYear) count++;
    if (filters.fileType && filters.fileType !== 'all') count++;
    if (filters.preset) count++; // Count preset as one filter
    return count;
  }, [filters]);

  const clearAllFilters = () => {
    setFilters({ limit: DEFAULT_LIMIT, offset: 0 });
    saveLastFilters({ limit: DEFAULT_LIMIT, offset: 0 });
  };

  // Page helpers
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasNextPage = offset + limit < total;
  const hasPrevPage = offset > 0;

  const nextPage = () => {
    if (hasNextPage) {
      const newOffset = offset + limit;
      handleFiltersChange({ offset: newOffset });
    }
  };

  const prevPage = () => {
    if (hasPrevPage) {
      const newOffset = Math.max(0, offset - limit);
      handleFiltersChange({ offset: newOffset });
    }
  };

  const filteredBooks = books || [];
  
  const handleSelectBook = (bookId: string) => {
    setSelectedBook(bookId);
    toast({
      title: "Opening spiritual text",
      description: "Manifesting wisdom from the cosmic library...",
      duration: 2000,
    });
  };
  
  const handleCloseBook = () => {
    setSelectedBook(null);
  };

  const toggleView = () => {
    setView(view === "grid" ? "list" : "grid");
  };

  const handleFoundationsSadhanaSelect = (sadhana: StoreSadhana) => {
    setSelectedFoundationSadhana(sadhana);
  };

  const handleCloseFoundationSadhana = () => {
    setSelectedFoundationSadhana(null);
  };

  const handleStartFoundationSadhana = (sadhana: StoreSadhana) => {
    // In a real implementation, this would create the sadhana in the user's account
    toast({
      title: "Sadhana Started",
      description: `You've successfully started "${sadhana.title}". It will appear in your Sadhana Board.`,
    });
    
    // Close the viewer after starting
    setSelectedFoundationSadhana(null);
    
    // Navigate to the sadhana page
    window.location.href = '/sadhana';
  };

  return (
    <div className="flex flex-col gap-4 px-3 md:px-0">
      <LibraryHeader 
        view={view}
        isLoading={isLoading}
        toggleView={toggleView}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="books" className="flex items-center gap-2 text-sm md:text-base">
            <BookOpen className="h-4 w-4" />
            Sacred Books
          </TabsTrigger>
          <TabsTrigger value="store" className="flex items-center gap-2 text-sm md:text-base">
            <StoreIcon className="h-4 w-4" />
            Sadhana Store
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="books" className="space-y-4">
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <SearchBar
                value={filters.search || ''}
                onChange={(e) => handleFiltersChange({ search: e.target.value })}
                placeholder="Search by title, author or tradition..."
                onSelectSuggestion={(sugg: BookSuggestion) => {
                  if (sugg.title) handleFiltersChange({ search: sugg.title });
                  if (sugg.tradition) handleFiltersChange({ traditions: Array.from(new Set([...(filters.traditions || []), sugg.tradition])) });
                  // open the book optionally
                  if (sugg.id) setSelectedBook(sugg.id);
                }}
              />
              
              {/* Filter Button for both mobile and desktop */}
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => isMobile ? setIsMobileFiltersOpen(true) : setIsDesktopFiltersOpen(!isDesktopFiltersOpen)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {filterCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {filterCount}
                  </Badge>
                )}
              </Button>
              
              {/* Mobile Filter Sheet */}
              {isMobile && (
                <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                  <SheetContent side="bottom" className="h-[80vh]">
                    <SheetHeader>
                      <SheetTitle>Filter Books</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4 overflow-y-auto h-[calc(80vh-100px)]">
                      <AdvancedFilters
                        filters={filters}
                        onFiltersChange={(next: Partial<BookFilters>) => handleFiltersChange(next)}
                        languages={languages}
                        yearRange={yearRange}
                        traditions={traditions}
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={() => setIsMobileFiltersOpen(false)}>Apply Filters</Button>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>

            {/* Desktop Filter Panel - Collapsible */}
            {!isMobile && isDesktopFiltersOpen && (
              <div className="border border-primary/10 rounded-lg bg-background/70 p-4">
                <AdvancedFilters
                  filters={filters}
                  onFiltersChange={(next: Partial<BookFilters>) => handleFiltersChange(next)}
                  languages={languages}
                  yearRange={yearRange}
                  traditions={traditions}
                />
              </div>
            )}

            <FilterChips
              filters={filters}
              onRemoveFilter={(key, value) => {
                // handle domain-level remove semantics
                if (key === 'search') handleFiltersChange({ search: undefined });
                else if (key === 'language') handleFiltersChange({ language: undefined });
                else if (key === 'fileType') handleFiltersChange({ fileType: 'all' });
                else if (key === 'minYear' || key === 'maxYear') handleFiltersChange({ minYear: undefined, maxYear: undefined });
                else if (key === 'sort') handleFiltersChange({ sortBy: undefined, sortOrder: undefined });
                else if (key === 'preset') handleFiltersChange({ preset: undefined }); // Handle preset removal
                else if (key === 'tradition' && typeof value === 'string') {
                  const newTrad = (filters.traditions || []).filter(t => t !== value);
                  handleFiltersChange({ traditions: newTrad });
                }
              }}
              onClearAll={clearAllFilters}
            />
          </div>
          
          <div className="mb-4 p-3 md:p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Search className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-lg">Request a Sacred Text</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Can't find the book you're looking for? Request it from our admins and we'll add it to the library.
                  </p>
                </div>
              </div>
              <BookRequestDialog />
            </div>
          </div>
          
          {isLoading ? (
            <LibraryLoading />
          ) : selectedBook ? (
            <BookViewer bookId={selectedBook} onClose={handleCloseBook} />
          ) : selectedFoundationSadhana ? (
            <FoundationSadhanaViewer 
              sadhana={selectedFoundationSadhana} 
              onClose={handleCloseFoundationSadhana}
              onStart={handleStartFoundationSadhana}
            />
          ) : (
            <>
              <ContinueReadingSection onSelectBook={handleSelectBook} />
              <BookShelf 
                books={filteredBooks} 
                onSelectBook={handleSelectBook} 
                view={view}
                onClearFilters={clearAllFilters}
                hasActiveFilters={hasActiveFilters}
                progressMap={progressMap}
              />
              {/* Pagination controls */}
              {total > 0 && (
                <div className="flex flex-col md:flex-row items-center justify-between mt-6 p-4 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                  <div className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-0">
                    <span className="hidden md:inline">Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} books</span>
                    <span className="md:hidden">{currentPage} / {totalPages}</span>
                    <span className="ml-2 hidden md:inline">• Page {currentPage} of {totalPages}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size={isMobile ? "default" : "sm"} onClick={prevPage} disabled={!hasPrevPage} aria-label="Previous page">
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Previous</span>
                    </Button>
                    <Button variant="outline" size={isMobile ? "default" : "sm"} onClick={nextPage} disabled={!hasNextPage} aria-label="Next page">
                      <span className="hidden sm:inline mr-1">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              <RecommendedRow />
              <RecentlyAddedSection onSelectBook={handleSelectBook} />
              <FoundationsCategory onSadhanaSelect={handleFoundationsSadhanaSelect} />
            </>
          )}
        </TabsContent>
        
        <TabsContent value="store">
          <div className="mb-4 p-3 md:p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <StoreIcon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium text-lg">Expand Your Spiritual Journey</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Visit our full store for premium themes, 3D yantras, merchandise, and workshops
                  </p>
                </div>
              </div>
              <Link to="/store">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-sm md:text-base">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Visit Full Store
                </Button>
              </Link>
            </div>
          </div>
          <SadhanaStore />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LibraryContainer;