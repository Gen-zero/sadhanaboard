import { useState } from "react";
import { BookMarked, BookOpen, BookText, FileText, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SpiritualBook } from "@/types/books";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BookRequestDialog from './BookRequestDialog';
import { formatRelativeTime } from '@/lib/date/relativeTime';
import { formatMinutes } from '@/lib/utils/format';
import { Link } from "react-router-dom";

interface BookShelfProps {
  books: SpiritualBook[];
  onSelectBook: (id: string) => void;
  view: "grid" | "list";
  // optional pagination / filter helpers for empty state actions
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  progressMap?: Record<string, import("@/types/books").BookProgress | null>;
}

const BookShelf = ({ books, onSelectBook, view, onClearFilters, hasActiveFilters, progressMap = {} }: BookShelfProps) => {
  const isMobile = useIsMobile();
  
  if (books.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-xl border-2 border-primary/30 bg-gradient-to-b from-primary/8 via-primary/6 to-primary/8 backdrop-blur-sm">
        <div className="relative mb-6">
          <div className="absolute -inset-6 rounded-full bg-primary/10 blur-3xl opacity-60" />
          <BookOpen className="h-16 w-16 md:h-20 md:w-20 text-primary animate-pulse relative z-10" />
          <div className="absolute -right-8 -top-4 opacity-70">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <div className="absolute -left-8 -top-2 opacity-60">
            <svg width="24" height="24" className="text-primary"><circle cx="12" cy="12" r="6" fill="hsl(var(--primary) / 0.08)" /></svg>
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-semibold">No Sacred Texts Found</h3>
        <p className="text-xs md:text-sm text-muted-foreground mt-2 max-w-xl">
          {hasActiveFilters ? 'Try adjusting your filters or search terms to find more results.' : 'Your library is empty. Start by requesting books or browsing the store.'}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          {hasActiveFilters && (
            <Button 
              onClick={() => onClearFilters && onClearFilters()}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-md hover:scale-105 transition-all duration-200"
            >
              Clear All Filters
            </Button>
          )}
          <BookRequestDialog />
          <Link to="/store" className="px-4 py-2 border border-primary/30 rounded-md text-xs md:text-sm text-muted-foreground hover:bg-primary/10 transition-all">Browse Store</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-6">
      {view === "grid" ? (
        isMobile ? (
          // Mobile carousel view
          <Carousel
            opts={{
              align: "start",
              loop: false
            }}
            className="w-full"
          >
            <CarouselContent>
              {books.map((book) => (
                <CarouselItem key={book.id} className="basis-[85%] sm:basis-1/2 lg:basis-1/3">
                  <BookCard key={book.id} book={book} onSelect={onSelectBook} progress={progressMap[book.id]} isMobile={isMobile} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        ) : (
          // Desktop grid view
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onSelect={onSelectBook} progress={progressMap[book.id]} isMobile={isMobile} />
            ))}
          </div>
        )
      ) : (
        <ScrollArea className="h-[500px] rounded-xl border border-primary/20 bg-gradient-to-b from-background/70 to-secondary/10 backdrop-blur-sm">
          <div className="p-4">
            {books.map((book) => (
              <BookListItem key={book.id} book={book} onSelect={onSelectBook} progress={progressMap[book.id]} isMobile={isMobile} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

interface BookCardProps {
  book: SpiritualBook;
  onSelect: (id: string) => void;
  progress?: import("@/types/books").BookProgress | null;
  isMobile?: boolean;
}

const BookCard = ({ book, onSelect, progress, isMobile = false }: BookCardProps) => {
  const BookIcon = book.is_storage_file ? FileText : BookMarked;
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-b from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20"
    >
      {/* Book cover area with image fallback and loading state */}
      <div className="aspect-[2/3] w-full overflow-hidden rounded-t-xl bg-gradient-to-b from-primary/20 via-primary/10 to-primary/20 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary) / 0.1)_0%,transparent_70%)]"></div>

        {book.cover_url && !imageError ? (
          <img
            src={book.cover_url}
            alt={book.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <BookIcon className="h-12 w-12 md:h-16 md:w-16 text-primary opacity-80 group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}

        {/* loading shimmer */}
        {!imageLoaded && book.cover_url && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-primary/10 via-primary/8 to-primary/8" />
        )}

        {/* Glowing effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Progress indicator */}
        {progress && (progress.percent && progress.percent > 0 || (progress.time_spent_minutes && progress.time_spent_minutes > 0)) && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">
                {progress.percent && progress.percent > 0 ? `${Math.round(Math.max(0, Math.min(100, progress.percent || 0)))}% complete` : ''}
                {progress.percent && progress.percent > 0 && progress.time_spent_minutes && progress.time_spent_minutes > 0 && (
                  <span className="mx-1">•</span>
                )}
                {progress.time_spent_minutes && progress.time_spent_minutes > 0 && (
                  <span>{formatMinutes(progress.time_spent_minutes)} read</span>
                )}
              </span>
              {progress.last_seen_at && (
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatRelativeTime(progress.last_seen_at)}
                </span>
              )}
            </div>
            {progress.percent && progress.percent > 0 && (
              <Progress 
                value={Math.max(0, Math.min(100, progress.percent || 0))} 
                className="h-2 rounded-full" 
                style={{
                  background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))',
                }}
              />
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-semibold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">{book.title}</h3>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">{book.author}</p>
          
          <div className="flex flex-wrap gap-1.5 mt-3">
            {book.traditions && book.traditions.slice(0, 2).map((tradition) => (
              <Badge key={tradition} variant="outline" className="text-xs bg-primary/15 hover:bg-primary/25 border-primary/30 transition-colors duration-200">
                {tradition}
              </Badge>
            ))}
            {book.traditions && book.traditions.length > 2 && (
              <Badge variant="outline" className="text-xs bg-primary/15 border-primary/30 transition-colors duration-200">
                +{book.traditions.length - 2}
              </Badge>
            )}
          </div>
          
          {book.is_storage_file && (
            <div className="inline-flex items-center gap-2 text-xs text-primary mt-2 bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
              <FileText className="h-3 w-3" />
              <span>PDF from Storage</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            size={isMobile ? "default" : "sm"} 
            className="w-full bg-gradient-to-r from-primary/30 to-secondary/30 border border-primary/30 hover:from-primary/40 hover:to-secondary/40 hover:scale-105 transition-all duration-300"
            onClick={() => onSelect(book.id)}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            {progress && progress.percent && progress.percent > 0 && progress.percent < 100 ? 'Continue Reading' : book.is_storage_file ? 'Open PDF' : 'Read Now'}
          </Button>
        </div>
      </div>
      
      {/* Enhanced hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl"></div>
    </div>
  );
};

const BookListItem = ({ book, onSelect, progress, isMobile = false }: BookCardProps) => {
  const BookIcon = book.is_storage_file ? FileText : BookMarked;
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      className="group flex justify-between items-center p-4 my-2 rounded-lg hover:bg-primary/15 hover:scale-[1.01] transition-all duration-300 border border-transparent hover:border-primary/30 cursor-pointer"
      onClick={() => onSelect(book.id)}
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-gradient-to-br from-primary/30 to-primary/30 rounded-lg flex items-center justify-center relative overflow-hidden">
          {book.cover_url && !imageError ? (
            <img
              src={book.cover_url}
              alt={book.title}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <BookIcon className="h-6 w-6 text-primary" />
          )}

          {!imageLoaded && book.cover_url && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-primary/10 via-primary/8 to-primary/8" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div>
          <h3 className="text-base md:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">{book.title}</h3>
          <p className="text-xs md:text-sm text-muted-foreground font-medium">{book.author}</p>
          {book.is_storage_file && (
            <span className="text-xs text-primary">PDF from Storage</span>
          )}
          {/* Progress indicator for list view */}
          {((progress && progress.percent && progress.percent > 0) || (progress && progress.time_spent_minutes && progress.time_spent_minutes > 0)) && (
            <div className="mt-1 flex items-center gap-2">
              {progress.percent && progress.percent > 0 && (
                <>
                  <Progress 
                    value={Math.max(0, Math.min(100, progress.percent || 0))} 
                    className="h-1.5 w-20 rounded-full" 
                    style={{
                      background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))',
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{Math.round(Math.max(0, Math.min(100, progress.percent || 0)))}%</span>
                </>
              )}
              {progress.time_spent_minutes && progress.time_spent_minutes > 0 && (
                <span className="text-xs text-muted-foreground">
                  {progress.percent && progress.percent > 0 && (
                    <span className="mx-1">•</span>
                  )}
                  {formatMinutes(progress.time_spent_minutes)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="hidden md:flex gap-1">
          {book.traditions && book.traditions.slice(0, 1).map((tradition) => (
            <Badge key={tradition} variant="outline" className="text-xs bg-primary/15 hover:bg-primary/25 border-primary/30 transition-colors duration-200">
              {tradition}
            </Badge>
          ))}
        </div>
        <Button 
          variant="outline" 
          size={isMobile ? "default" : "sm"} 
          className="text-primary hover:text-primary-foreground bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 hover:from-primary/30 hover:to-secondary/30 hover:scale-110 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(book.id);
          }}
        >
          <BookOpen className="h-4 w-4" />
          <span className="sr-only">{progress && progress.percent && progress.percent > 0 && progress.percent < 100 ? 'Continue' : 'Read'}</span>
        </Button>
      </div>
    </div>
  );
};

export default BookShelf;