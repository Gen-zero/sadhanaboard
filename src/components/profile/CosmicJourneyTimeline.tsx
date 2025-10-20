import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar, Trophy } from 'lucide-react';
import { format } from 'date-fns';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  xp: number;
}

interface CosmicJourneyTimelineProps {
  achievements: Achievement[];
  className?: string;
}

const CosmicJourneyTimeline = ({ achievements, className = '' }: CosmicJourneyTimelineProps) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  return (
    <Card className={`backdrop-blur-sm bg-background/70 border border-primary/20 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            My Cosmic Journey
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-primary/50" />
            <p>Begin your spiritual journey to unlock achievements</p>
          </div>
        ) : (
          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className="relative pl-8 border-l-2 border-primary/30">
                {/* Timeline dot */}
                <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-background"></div>
                
                {/* Achievement content */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-primary">{achievement.title}</h3>
                    <Badge variant="secondary" className="bg-primary/20 text-primary-foreground border-primary/30">
                      <Star className="h-3 w-3 mr-1" />
                      {achievement.xp} XP
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-primary/70">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(achievement.date), 'MMM dd, yyyy')}
                    </span>
                    <Badge variant="outline" className="text-primary/70 border-primary/30">
                      {achievement.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CosmicJourneyTimeline;
