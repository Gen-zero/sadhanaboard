import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Wand2, Star, Sparkles } from 'lucide-react';
import { sendMessageToClaude } from '@/services/claudeAIService';

interface SpiritualGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  category: string;
  createdAt: string;
}

interface GuidingConstellationProps {
  goals: SpiritualGoal[];
  className?: string;
}

const GuidingConstellation = ({ goals, className = '' }: GuidingConstellationProps) => {
  const [selectedGoal, setSelectedGoal] = useState<SpiritualGoal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guidance, setGuidance] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Load API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('claude_api_key') || '';
    setApiKey(savedApiKey);
  }, []);

  const handleStarClick = (goal: SpiritualGoal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleAskForGuidance = async () => {
    if (!selectedGoal || !apiKey) return;
    
    setIsLoading(true);
    setGuidance('');
    
    try {
      const messages = [
        {
          role: 'user' as const,
          content: `As a spiritual guide, provide guidance for this goal: "${selectedGoal.title}". 
          The user has made ${selectedGoal.progress}% progress. 
          Based on the Spiritual Library content, suggest specific practices, resources, or techniques 
          that could help them advance. Keep the response concise and actionable.`
        }
      ];
      
      const response = await sendMessageToClaude(messages, apiKey);
      setGuidance(response);
    } catch (error) {
      console.error('Error getting guidance:', error);
      setGuidance('Unable to get guidance at the moment. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Position stars in a constellation pattern
  const getStarPosition = (index: number): { top: string; left: string } => {
    const positions = [
      { top: '20%', left: '30%' },
      { top: '40%', left: '70%' },
      { top: '60%', left: '20%' },
      { top: '30%', left: '80%' },
      { top: '70%', left: '60%' },
      { top: '50%', left: '40%' },
      { top: '25%', left: '50%' },
      { top: '65%', left: '75%' }
    ];
    
    return positions[index % positions.length];
  };

  return (
    <Card className={`backdrop-blur-sm bg-background/70 border border-primary/20 relative overflow-hidden ${className}`}>
      {/* Celestial background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-primary/20 to-secondary/30">
        {/* Animated stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: Math.random() * 0.8 + 0.2,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2 relative z-10">
          <Sparkles className="h-5 w-5 text-primary" />
          My Guiding Constellation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <p className="text-sm text-muted-foreground mb-6">
          Each star represents a spiritual goal. The brightness reflects your progress.
        </p>
        
        <div className="relative h-64 rounded-lg border border-primary/20 bg-black/20 backdrop-blur-sm">
          {goals.map((goal, index) => {
            const position = getStarPosition(index);
            const brightness = 0.3 + (goal.progress / 100) * 0.7;
            
            return (
              <motion.div
                key={goal.id}
                className="absolute cursor-pointer"
                style={{
                  top: position.top,
                  left: position.left,
                  filter: `brightness(${brightness})`
                }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleStarClick(goal)}
              >
                <div className="relative">
                  <Star 
                    className="text-yellow-300 drop-shadow-lg" 
                    fill="currentColor"
                    size={20 + (goal.progress / 100) * 10}
                  />
                  {goal.progress > 70 && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </motion.div>
            );
          })}
          
          {/* Connection lines */}
          {goals.length > 1 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {goals.map((goal, index) => {
                if (index === 0) return null;
                const prevPos = getStarPosition(index - 1);
                const currentPos = getStarPosition(index);
                
                return (
                  <line
                    key={`${goal.id}-line`}
                    x1={prevPos.left}
                    y1={prevPos.top}
                    x2={currentPos.left}
                    y2={currentPos.top}
                    stroke="hsl(var(--primary) / 0.3)"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
          )}
        </div>
      </CardContent>

      {/* Goal Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              {selectedGoal?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedGoal && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20">
                <p className="text-muted-foreground">{selectedGoal.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{selectedGoal.progress}%</span>
                </div>
                <Progress value={selectedGoal.progress} className="h-2" />
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedGoal.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  Started: {new Date(selectedGoal.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {guidance ? (
                <div className="p-4 rounded-lg bg-background/50 border border-primary/20">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Wand2 className="h-4 w-4 text-primary" />
                    Spiritual Guidance
                  </h4>
                  <p className="text-sm">{guidance}</p>
                </div>
              ) : (
                <Button 
                  onClick={handleAskForGuidance} 
                  disabled={isLoading || !apiKey}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Seeking Wisdom...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Ask for Guidance
                    </>
                  )}
                </Button>
              )}
              
              {!apiKey && (
                <p className="text-xs text-muted-foreground text-center">
                  Add your Claude API key in Settings to enable guidance
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default GuidingConstellation;