import React from 'react';
import { StoreSadhana } from '@/types/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Star, Clock, Users, Lock, Crown, Sparkles } from 'lucide-react';

interface SadhanaCardProps {
  sadhana: StoreSadhana;
  userLevel: number;
  spiritualPoints: number;
  onPurchase: (sadhana: StoreSadhana) => void;
  onPreview: (sadhana: StoreSadhana) => void;
}

const SadhanaCard: React.FC<SadhanaCardProps> = ({
  sadhana,
  userLevel,
  spiritualPoints,
  onPurchase,
  onPreview
}) => {
  const isLocked = userLevel < sadhana.unlockLevel;
  const canAfford = spiritualPoints >= sadhana.price;
  const isOwned = sadhana.isUnlocked;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30';
    }
  };

  return (
    <TooltipProvider>
      <Card className={`group hover:shadow-lg transition-all duration-300 ${
        isLocked ? 'opacity-60' : 'hover:scale-[1.02]'
      } ${sadhana.isPremium ? 'border-yellow-500/30' : 'border-purple-500/20'} bg-gradient-to-b from-background/70 to-secondary/10`}>
        {sadhana.isPremium && (
          <div className="absolute top-2 right-2 z-10">
            <Crown className="h-5 w-5 text-yellow-500" />
          </div>
        )}
      
        <CardHeader className="relative bg-gradient-to-r from-purple-500/5 via-fuchsia-500/5 to-purple-500/5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className={`text-lg ${isLocked ? 'text-muted-foreground' : ''}`}>
                {sadhana.title}
                {isLocked && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Lock className="inline ml-2 h-4 w-4 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Requires Level {sadhana.unlockLevel}</p>
                      <p className="text-xs opacity-75">Complete more practices to level up!</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                {sadhana.description}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="text-2xl">{sadhana.genre.icon}</div>
            <Badge variant="secondary" className={getDifficultyColor(sadhana.difficulty)}>
              {sadhana.difficulty}
            </Badge>
            {sadhana.deity && (
              <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30">
                {sadhana.deity}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{sadhana.duration} days</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{sadhana.completedBy}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{sadhana.rating}</span>
              </div>
            </div>

            {/* Practices Preview */}
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Practices Include:
              </h4>
              <div className="flex flex-wrap gap-1">
                {sadhana.practices.slice(0, 3).map((practice, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30">
                    {practice}
                  </Badge>
                ))}
                {sadhana.practices.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30">
                    +{sadhana.practices.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-500/10">
              <div className="flex flex-col">
                {sadhana.price === 0 ? (
                  <span className="text-lg font-bold text-green-600">Free</span>
                ) : (
                  <span className="text-lg font-bold text-purple-600">
                    {sadhana.price} SP
                  </span>
                )}
                {isLocked && (
                  <span className="text-xs text-muted-foreground">
                    Requires Level {sadhana.unlockLevel}
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(sadhana)}
                  disabled={isLocked}
                  className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20"
                >
                  Preview
                </Button>
                
                {isOwned ? (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 transition-all duration-300">
                    Start Practice
                  </Button>
                ) : !canAfford && sadhana.price > 0 ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => onPurchase(sadhana)}
                        disabled={isLocked || (!canAfford && sadhana.price > 0)}
                        className={`${
                          sadhana.price === 0
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-purple-600 hover:bg-purple-700'
                        } transition-all duration-300`}
                      >
                        {sadhana.price === 0 ? 'Add Free' : 'Purchase'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Need {sadhana.price - spiritualPoints} more Spiritual Points</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => onPurchase(sadhana)}
                    disabled={isLocked || (!canAfford && sadhana.price > 0)}
                    className={`${
                      sadhana.price === 0
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                    } transition-all duration-300`}
                  >
                    {sadhana.price === 0 ? 'Add Free' : 'Purchase'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default SadhanaCard;