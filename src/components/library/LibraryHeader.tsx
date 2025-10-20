import React from "react";
import { BookOpen, AlignCenter, Loader2, Grid, List, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface LibraryHeaderProps {
  view: "grid" | "list";
  isLoading: boolean;
  toggleView: () => void;
}

const LibraryHeader = ({
  view,
  isLoading,
  toggleView
}: LibraryHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center flex-wrap gap-4 pb-4 border-b border-purple-500/20">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20">
          <BookOpen className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Spiritual Library
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Sacred Texts & Practices
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size={isMobile ? "default" : "sm"}
          className="flex items-center gap-2 bg-background/70 border-purple-500/30 hover:bg-purple-500/10"
          onClick={toggleView}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : view === "grid" ? (
            <>
              <List className="h-4 w-4" />
              <span>List</span>
            </>
          ) : (
            <>
              <Grid className="h-4 w-4" />
              <span>Grid</span>
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size={isMobile ? "default" : "sm"}
          className="flex items-center gap-2 bg-background/70 border-purple-500/30 hover:bg-purple-500/10"
          onClick={() => navigate('/store')}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Store</span>
        </Button>
      </div>
    </div>
  );
};

export default LibraryHeader;