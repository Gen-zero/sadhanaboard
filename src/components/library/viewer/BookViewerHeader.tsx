import { Button } from '@/components/ui/button';
import { X, Maximize, Minimize } from 'lucide-react';

interface BookViewerHeaderProps {
  title: string;
  author: string;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

const BookViewerHeader = ({ 
  title, 
  author, 
  fullscreen, 
  onToggleFullscreen, 
  onClose 
}: BookViewerHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
          {title}
        </h2>
        <span className="text-sm text-muted-foreground">by {author}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline"
          size="icon"
          onClick={onToggleFullscreen}
          className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all duration-300"
        >
          {fullscreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </Button>
        <Button 
          variant="outline"
          size="icon"
          onClick={onClose}
          className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all duration-300"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default BookViewerHeader;