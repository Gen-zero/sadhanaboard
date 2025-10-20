import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSpiritualBooks } from '@/hooks/useSpiritualBooks';
import UnifiedViewer from './viewer/UnifiedViewer';
import BookViewerHeader from './viewer/BookViewerHeader';

interface BookViewerProps {
  bookId: string;
  onClose: () => void;
}

const BookViewer = ({ bookId, onClose }: BookViewerProps) => {
  const { books } = useSpiritualBooks();
  const book = books.find(b => b.id === bookId);
  const [fullscreen, setFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (fullscreen && viewerRef.current) {
      if (viewerRef.current.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      }
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [fullscreen]);
  
  if (!book) return null;
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <div 
      ref={viewerRef}
      className={`relative flex flex-col w-full h-full rounded-xl border border-purple-500/20 overflow-hidden bg-gradient-to-b from-background to-secondary/10 ${
        fullscreen ? 'fixed inset-0 z-50 bg-background p-6' : 'min-h-[600px]'
      }`}
    >
      <BookViewerHeader
        title={book.title}
        author={book.author}
        fullscreen={fullscreen}
        onToggleFullscreen={toggleFullscreen}
        onClose={onClose}
      />
      
      <div className="flex-1 overflow-hidden">
        <UnifiedViewer book={book} bookId={bookId} />
      </div>
    </div>
  );
};

export default BookViewer;