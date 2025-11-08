import React from 'react';
import { StoreSadhana } from '@/types/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Sparkles } from 'lucide-react';

interface FoundationsCategoryProps {
  onSadhanaSelect: (sadhana: StoreSadhana) => void;
}

const FoundationsCategory = ({ onSadhanaSelect }: FoundationsCategoryProps) => {
  // Define beginner-friendly sadhanas with secular language
  const foundationsSadhanas: StoreSadhana[] = [
    {
      id: 'mindful-walking',
      title: 'Mindful Walking Practice',
      description: 'A gentle introduction to mindfulness through conscious walking',
      genre: {
        id: 'meditation',
        name: 'Meditation & Mindfulness',
        description: 'Practices for inner peace and awareness',
        icon: '🧘‍♂️',
        color: 'bg-blue-500',
        unlockLevel: 1
      },
      difficulty: 'beginner',
      duration: 7,
      price: 0,
      unlockLevel: 1,
      isUnlocked: true,
      isPremium: false,
      practices: ['Walking meditation', 'Breath awareness', 'Body scanning'],
      benefits: ['Stress reduction', 'Improved focus', 'Mind-body connection'],
      tags: ['mindfulness', 'beginner', 'movement'],
      rating: 4.8,
      completedBy: 1247
    },
    {
      id: 'gratitude-journaling',
      title: 'Gratitude Journaling',
      description: 'Cultivate appreciation and positive thinking through daily reflection',
      genre: {
        id: 'meditation',
        name: 'Meditation & Mindfulness',
        description: 'Practices for inner peace and awareness',
        icon: '🧘‍♂️',
        color: 'bg-blue-500',
        unlockLevel: 1
      },
      difficulty: 'beginner',
      duration: 14,
      price: 0,
      unlockLevel: 1,
      isUnlocked: true,
      isPremium: false,
      practices: ['Daily gratitude listing', 'Reflection prompts', 'Positive affirmations'],
      benefits: ['Increased happiness', 'Better perspective', 'Emotional resilience'],
      tags: ['gratitude', 'journaling', 'beginner'],
      rating: 4.7,
      completedBy: 982
    },
    {
      id: 'breathing-basics',
      title: 'Breathing Awareness',
      description: 'Master the fundamentals of breath-focused meditation',
      genre: {
        id: 'meditation',
        name: 'Meditation & Mindfulness',
        description: 'Practices for inner peace and awareness',
        icon: '🧘‍♂️',
        color: 'bg-blue-500',
        unlockLevel: 1
      },
      difficulty: 'beginner',
      duration: 7,
      price: 0,
      unlockLevel: 1,
      isUnlocked: true,
      isPremium: false,
      practices: ['Basic breath counting', 'Diaphragmatic breathing', 'Breath observation'],
      benefits: ['Calmer mind', 'Reduced anxiety', 'Better sleep'],
      tags: ['breathing', 'meditation', 'beginner'],
      rating: 4.9,
      completedBy: 1534
    },
    {
      id: 'body-awareness',
      title: 'Body Awareness Practice',
      description: 'Develop mindfulness through systematic body scanning',
      genre: {
        id: 'meditation',
        name: 'Meditation & Mindfulness',
        description: 'Practices for inner peace and awareness',
        icon: '🧘‍♂️',
        color: 'bg-blue-500',
        unlockLevel: 1
      },
      difficulty: 'beginner',
      duration: 10,
      price: 0,
      unlockLevel: 1,
      isUnlocked: true,
      isPremium: false,
      practices: ['Progressive muscle relaxation', 'Body scanning', 'Tension release'],
      benefits: ['Physical relaxation', 'Stress relief', 'Body-mind connection'],
      tags: ['body-scan', 'relaxation', 'beginner'],
      rating: 4.6,
      completedBy: 876
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6" />
          Foundations for Your Journey
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Start with these beginner-friendly practices designed to introduce you to mindfulness 
          and spiritual growth using accessible, secular language.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {foundationsSadhanas.map((sadhana) => (
          <Card 
            key={sadhana.id} 
            className="group relative overflow-hidden border border-primary/20 bg-gradient-to-b from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 rounded-xl"
          >
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
                  {sadhana.title}
                </CardTitle>
                {sadhana.isPremium && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-xs">
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {sadhana.description}
              </p>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{sadhana.duration} days</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{sadhana.completedBy} completed</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                    {sadhana.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                    Free
                  </Badge>
                </div>
                
                <Button
                  onClick={() => onSadhanaSelect(sadhana)}
                  className="w-full mt-4 bg-gradient-to-r from-primary/30 to-secondary/30 border border-primary/30 hover:from-primary/40 hover:to-secondary/40 transition-all duration-300"
                  size="sm"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FoundationsCategory;