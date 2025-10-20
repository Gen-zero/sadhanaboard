import React from 'react';
import { StoreSadhana } from '@/types/store';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Clock, Users, Calendar, Target, Heart, Book, Sparkles } from 'lucide-react';

interface SadhanaPreviewProps {
  sadhana: StoreSadhana | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (sadhana: StoreSadhana) => void;
  userLevel: number;
  spiritualPoints: number;
}

const SadhanaPreview: React.FC<SadhanaPreviewProps> = ({
  sadhana,
  isOpen,
  onClose,
  onPurchase,
  userLevel,
  spiritualPoints
}) => {
  if (!sadhana) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-background to-secondary/10 border border-purple-500/20">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="text-4xl p-3 rounded-lg bg-purple-500/10">{sadhana.genre.icon}</div>
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
                {sadhana.title}
              </DialogTitle>
              <DialogDescription className="text-base">
                {sadhana.description}
              </DialogDescription>
              
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge variant="secondary" className={getDifficultyColor(sadhana.difficulty)}>
                  {sadhana.difficulty}
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
                  {sadhana.genre.name}
                </Badge>
                {sadhana.deity && (
                  <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
                    {sadhana.deity}
                  </Badge>
                )}
                {sadhana.tradition && (
                  <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30">
                    {sadhana.tradition}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">{sadhana.duration} Days</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">{sadhana.completedBy}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <div>
                <p className="text-sm font-medium">{sadhana.rating}/5</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
              <Target className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Level {sadhana.unlockLevel}</p>
                <p className="text-xs text-muted-foreground">Required</p>
              </div>
            </div>
          </div>

          <Separator className="bg-purple-500/20" />

          {/* Practices */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Daily Practices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sadhana.practices.map((practice, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm">{practice}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-purple-500/20" />

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-500" />
              Spiritual Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sadhana.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-purple-500/20" />

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Book className="h-5 w-5 text-purple-500" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {sadhana.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-purple-500/10 border border-purple-500/30">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Purchase Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="flex flex-col">
              {sadhana.price === 0 ? (
                <span className="text-2xl font-bold text-green-600">Free</span>
              ) : (
                <span className="text-2xl font-bold text-purple-600">
                  {sadhana.price} Spiritual Points
                </span>
              )}
              {isLocked && (
                <span className="text-sm text-muted-foreground">
                  Requires Level {sadhana.unlockLevel} (You are Level {userLevel})
                </span>
              )}
              {!canAfford && sadhana.price > 0 && !isLocked && (
                <span className="text-sm text-red-500">
                  Insufficient Spiritual Points (You have {spiritualPoints})
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              {isOwned ? (
                <Button size="lg" className="bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105">
                  Start Practice
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => onPurchase(sadhana)}
                  disabled={isLocked || (!canAfford && sadhana.price > 0)}
                  className={`${
                    sadhana.price === 0
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600'
                  } transition-all duration-300 hover:scale-105`}
                >
                  {sadhana.price === 0 ? 'Add to Library' : 'Purchase'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SadhanaPreview;