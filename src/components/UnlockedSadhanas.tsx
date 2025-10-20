import React from 'react';
import { StoreSadhana } from '@/types/store';
import { storeSadhanas } from '@/data/storeSadhanas';
import { useUserProgression } from '@/hooks/useUserProgression';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Star, Users, Crown } from 'lucide-react';
import { Sadhana } from '@/types/sadhana';

interface UnlockedSadhanasProps {
  onSelectSadhana: (sadhana: StoreSadhana) => void;
  selectedSadhanaId?: string | null;
}

const UnlockedSadhanas: React.FC<UnlockedSadhanasProps> = ({ onSelectSadhana, selectedSadhanaId }) => {
  const { progression } = useUserProgression();

  // Get all unlocked store sadhanas
  const unlockedSadhanas = storeSadhanas.filter(sadhana => 
    progression.unlockedStoreSadhanas.includes(sadhana.id)
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'advanced': return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  if (unlockedSadhanas.length === 0) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/20">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">No unlocked sadhanas yet.</p>
            <p className="text-xs mt-1">Visit the Sadhana Store to unlock spiritual practices!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="text-lg">🛍️</span>
          Your Unlocked Sadhanas
          <Badge variant="secondary" className="text-xs">
            {unlockedSadhanas.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40">
          <div className="space-y-2">
            {unlockedSadhanas.map((sadhana) => {
              const isSelected = selectedSadhanaId === sadhana.id;
              return (
                <div
                  key={sadhana.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer group ${
                    isSelected 
                      ? 'bg-purple-500/20 border border-purple-500/40' 
                      : 'bg-secondary/20 hover:bg-secondary/30'
                  }`}
                  onClick={() => onSelectSadhana(sadhana)}
                >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{sadhana.genre.icon}</span>
                    <h4 className="font-medium text-sm truncate">{sadhana.title}</h4>
                    {sadhana.isPremium && (
                      <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{sadhana.duration}d</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{sadhana.rating}</span>
                    </div>
                    <Badge variant="outline" className={`text-xs ${getDifficultyColor(sadhana.difficulty)}`}>
                      {sadhana.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  className={`ml-2 transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Use This'}
                </Button>
              </div>
            );
            })}
          </div>
        </ScrollArea>
        
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Click on any sadhana to use it as a template for your practice
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnlockedSadhanas;