import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';
import { useSpiritualBooks } from '@/hooks/useSpiritualBooks';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { SpiritualBook } from '@/types/books';
import { formatRelativeTime } from '@/lib/date/relativeTime';
import { formatMinutes } from '@/lib/utils/format';

interface ContinueReadingSectionProps {
  onSelectBook: (bookId: string) => void;
}

const ContinueReadingSection = ({ onSelectBook }: ContinueReadingSectionProps) => {
  const [bookIds, setBookIds] = useState<string[]>([]);
  const { books, isLoading: booksLoading } = useSpiritualBooks({ limit: 20 }); // Reduced from 100 to 20
  const { progressMap, isLoading: progressLoading } = useReadingProgress(bookIds);
  const [filteredBooks, setFilteredBooks] = useState<SpiritualBook[]>([]);

  // Get all book IDs
  useEffect(() => {
    if (books.length > 0) {
      const ids = books.map(book => book.id);
      setBookIds(ids);
    }
  }, [books]);

  // Filter books with active reading progress (0 < percent < 100)
  useEffect(() => {
    if (books.length > 0 && Object.keys(progressMap).length > 0) {
      const inProgressBooks = books.filter(book => {
        const progress = progressMap[book.id];
        return progress && progress.percent && progress.percent > 0 && progress.percent < 100;
      });

      // Sort by last_seen_at (most recent first)
      const sortedBooks = [...inProgressBooks].sort((a, b) => {
        const progressA = progressMap[a.id];
        const progressB = progressMap[b.id];
        
        if (!progressA?.last_seen_at) return 1;
        if (!progressB?.last_seen_at) return -1;
        
        return new Date(progressB.last_seen_at).getTime() - new Date(progressA.last_seen_at).getTime();
      });

      // Limit to top 6 books
      setFilteredBooks(sortedBooks.slice(0, 6));
    }
  }, [books, progressMap]);

  const isLoading = booksLoading || progressLoading;

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
          Continue Reading
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="min-w-[280px] animate-pulse border border-purple-500/20 bg-gradient-to-b from-purple-600/10 via-purple-500/5 to-purple-400/10">
              <CardContent className="p-4">
                <div className="h-4 bg-purple-500/20 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-purple-500/10 rounded w-full mb-2"></div>
                <div className="h-3 bg-purple-500/10 rounded w-5/6 mb-4"></div>
                <div className="h-8 bg-purple-500/20 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Don't show section if no books with progress
  if (filteredBooks.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 flex items-center">
        <TrendingUp className="h-6 w-6 mr-2" />
        Continue Reading
      </h2>
      <div className="flex space-x-5 overflow-x-auto pb-4">
        {filteredBooks.map((book) => {
          const progress = progressMap[book.id];
          const percent = Math.max(0, Math.min(100, progress?.percent || 0));
          
          return (
            <Card 
              key={book.id} 
              className="min-w-[280px] flex-shrink-0 border border-purple-500/20 bg-gradient-to-b from-purple-600/10 via-purple-500/5 to-purple-400/10 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 rounded-xl"
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg line-clamp-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
                    {book.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                  by {book.author}
                </p>
                
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>
                      {percent > 0 ? `${Math.round(percent)}% complete` : ''}
                      {percent > 0 && progress?.time_spent_minutes && progress.time_spent_minutes > 0 && (
                        <span className="mx-1">•</span>
                      )}
                      {progress?.time_spent_minutes && progress.time_spent_minutes > 0 && (
                        <span>{formatMinutes(progress.time_spent_minutes)} read</span>
                      )}
                    </span>
                    {progress?.last_seen_at && (
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatRelativeTime(progress.last_seen_at)}
                      </span>
                    )}
                  </div>
                  {percent > 0 && (
                    <div className="h-2 w-full rounded-full bg-purple-500/20 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {book.traditions && book.traditions.slice(0, 2).map((tradition) => (
                    <Badge key={tradition} variant="outline" className="text-xs bg-purple-500/15 border-purple-500/30">
                      {tradition}
                    </Badge>
                  ))}
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-purple-500/30 to-fuchsia-500/30 border border-purple-500/30 hover:from-purple-500/40 hover:to-fuchsia-500/40 transition-all duration-300"
                  onClick={() => onSelectBook(book.id)}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Continue Reading
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ContinueReadingSection;