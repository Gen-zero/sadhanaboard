import React from "react";
import { Loader2, BookMarked } from "lucide-react";
import { Card } from "@/components/ui/card";

const LibraryLoading = () => {
  return (
    <div className="space-y-6">
      {/* Header loading */}
      <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-primary/20 p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
          <div>
            <div className="h-6 bg-primary/20 rounded w-36 mb-2"></div>
            <div className="h-4 bg-primary/10 rounded w-48"></div>
          </div>
        </div>
      </Card>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading books...</span>
      </div>
      
      {/* Content loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="relative overflow-hidden border border-primary/20 bg-gradient-to-b from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm rounded-xl">
            <div className="aspect-[2/3] w-full relative bg-gradient-to-b from-primary/20 via-primary/10 to-primary/20 flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.08)_0%,transparent_70%)]"></div>
              <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                <BookMarked className="h-6 w-6 text-primary opacity-60" />
              </div>
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
            </div>
            <div className="p-4">
              <div className="h-5 bg-primary/20 rounded w-4/5 mb-2"></div>
              <div className="h-4 bg-primary/10 rounded w-3/5 mb-3"></div>
              <div className="flex gap-2 mb-3">
                <div className="h-5 w-16 bg-primary/15 rounded-full"></div>
                <div className="h-5 w-16 bg-primary/15 rounded-full"></div>
              </div>
              <div className="h-9 bg-primary/20 rounded w-full mt-2"></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LibraryLoading;