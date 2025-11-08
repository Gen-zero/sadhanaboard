import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, Calendar } from 'lucide-react';
import { useSpiritualBooks } from '@/hooks/useSpiritualBooks';
import { SpiritualBook } from '@/types/books';
import { formatRelativeTime } from '@/lib/date/relativeTime';

interface RecentlyAddedSectionProps {
  onSelectBook: (bookId: string) => void;
}

const RecentlyAddedSection = ({ onSelectBook }: RecentlyAddedSectionProps) => {
  const { books, isLoading } = useSpiritualBooks({ 
    sortBy: 'created_at', 
    sortOrder: 'desc', 
    limit: 6 
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary flex items-center">
          <Sparkles className="h-6 w-6 mr-2" />
          Recently Added
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="min-w-[280px] animate-pulse border border-primary/20 bg-gradient-to-b from-primary/10 via-primary/5 to-primary/10">
              <CardContent className="p-4">
                <div className="h-4 bg-primary/20 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-primary/10 rounded w-full mb-2"></div>
                <div className="h-3 bg-primary/10 rounded w-5/6 mb-4"></div>
                <div className="h-8 bg-primary/20 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Don't show section if no books
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary flex items-center">
        <Sparkles className="h-6 w-6 mr-2" />
        Recently Added
      </h2>
      <div className="flex space-x-5 overflow-x-auto pb-4">
        {books.map((book) => (
          <Card 
            key={book.id} 
            className="min-w-[280px] flex-shrink-0 border border-primary/20 bg-gradient-to-b from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 rounded-xl"
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg line-clamp-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
                  {book.title}
                </h3>
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  NEW
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                by {book.author}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {book.traditions && book.traditions.slice(0, 1).map((tradition) => (
                  <Badge key={tradition} variant="outline" className="text-xs bg-primary/15 border-primary/30">
                    {tradition}
                  </Badge>
                ))}
                {book.created_at && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    Added {formatRelativeTime(book.created_at)}
                  </div>
                )}
              </div>
              
              <Button 
                size="sm" 
                className="w-full bg-gradient-to-r from-primary/30 to-secondary/30 border border-primary/30 hover:from-primary/40 hover:to-secondary/40 transition-all duration-300"
                onClick={() => onSelectBook(book.id)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Read Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentlyAddedSection;