import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, Clock, Target } from "lucide-react";
import { useSpiritualPoints } from "@/hooks/useSpiritualPoints";
import { useToast } from "@/hooks/use-toast";

interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  estimatedTime: string;
  category: string;
  completed: boolean;
}

const DAILY_QUESTS: Quest[] = [
  {
    id: "meditation-10min",
    title: "10-Minute Meditation",
    description: "Complete a 10-minute mindfulness meditation session",
    points: 15,
    estimatedTime: "10 min",
    category: "Meditation",
    completed: false
  },
  {
    id: "chanting",
    title: "Sacred Chanting",
    description: "Chant your favorite mantra 108 times",
    points: 20,
    estimatedTime: "15 min",
    category: "Mantra",
    completed: false
  },
  {
    id: "gratitude",
    title: "Gratitude Practice",
    description: "Write down 3 things you're grateful for today",
    points: 10,
    estimatedTime: "5 min",
    category: "Reflection",
    completed: false
  },
  {
    id: "breathwork",
    title: "Breath Awareness",
    description: "Practice 5 minutes of conscious breathing",
    points: 12,
    estimatedTime: "5 min",
    category: "Pranayama",
    completed: false
  },
  {
    id: "scripture",
    title: "Scripture Study",
    description: "Read a passage from your favorite spiritual text",
    points: 18,
    estimatedTime: "15 min",
    category: "Study",
    completed: false
  }
];

const DailyQuest = () => {
  const { pointsState, addPoints, claimDailyQuest } = useSpiritualPoints();
  const { toast } = useToast();
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Select a random quest each day
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we need to select a new quest for today
    const storedQuest = localStorage.getItem(`daily-quest-${today}`);
    
    if (storedQuest) {
      const parsedQuest = JSON.parse(storedQuest);
      setCurrentQuest(parsedQuest);
      setIsCompleted(parsedQuest.completed);
    } else {
      // Select a random quest
      const randomIndex = Math.floor(Math.random() * DAILY_QUESTS.length);
      const quest = { ...DAILY_QUESTS[randomIndex] };
      
      // Save to localStorage
      localStorage.setItem(`daily-quest-${today}`, JSON.stringify(quest));
      setCurrentQuest(quest);
      setIsCompleted(false);
    }
  }, []);

  const handleCompleteQuest = () => {
    if (!currentQuest || isCompleted) return;
    
    // Mark as completed
    const updatedQuest = { ...currentQuest, completed: true };
    setCurrentQuest(updatedQuest);
    setIsCompleted(true);
    
    // Save to localStorage
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`daily-quest-${today}`, JSON.stringify(updatedQuest));
    
    // Add points
    addPoints(currentQuest.points, "daily-quest");
    
    // Show toast notification
    toast({
      title: "Quest Completed!",
      description: `You earned ${currentQuest.points} Spiritual Points!`,
    });
    
    // Mark as claimed for today
    claimDailyQuest();
  };

  if (!currentQuest) {
    return (
      <Card className="border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-2 text-muted-foreground">Loading today's quest...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-yellow-500" />
            Daily Quest
          </CardTitle>
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
            +{currentQuest.points} SP
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={`mt-1 flex-shrink-0 ${isCompleted ? 'text-green-500' : 'text-muted-foreground'}`}>
            {isCompleted ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <Target className="h-6 w-6" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{currentQuest.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{currentQuest.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {currentQuest.estimatedTime}
              </div>
              <Badge variant="outline" className="text-xs">
                {currentQuest.category}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
            onClick={handleCompleteQuest}
            disabled={isCompleted}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Quest Completed!
              </>
            ) : (
              <>
                <Star className="h-4 w-4 mr-2" />
                Complete Quest (+{currentQuest.points} SP)
              </>
            )}
          </Button>
        </div>
        
        <div className="pt-2 text-center text-sm text-muted-foreground">
          <p>Total Spiritual Points: <span className="font-semibold text-yellow-500">{pointsState.totalPoints}</span></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyQuest;