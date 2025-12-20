import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DailyStatus {
  date: Date;
  completed: boolean;
}

interface DailySadhanaChecklistProps {
  className?: string;
}

const DailySadhanaChecklist = ({ className = '' }: DailySadhanaChecklistProps) => {
  const [dailyStatus, setDailyStatus] = useState<DailyStatus[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  // Initialize with last 7 days
  useEffect(() => {
    const statuses: DailyStatus[] = [];
    const today = new Date();
    
    // Generate daily status for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      statuses.push({
        date: date,
        completed: Math.random() > 0.5 // Random completion for demo
      });
    }
    
    setDailyStatus(statuses);
    calculateStreaks(statuses);
  }, []);

  // Calculate current and longest streaks
  const calculateStreaks = (statuses: DailyStatus[]) => {
    let current = 0;
    let longest = 0;
    let tempStreak = 0;
    
    // Sort statuses by date to ensure proper order
    const sortedStatuses = [...statuses].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Calculate streaks from the end (most recent)
    for (let i = sortedStatuses.length - 1; i >= 0; i--) {
      const status = sortedStatuses[i];
      
      if (status.completed) {
        tempStreak++;
        current = tempStreak; // Update current streak
        longest = Math.max(longest, tempStreak);
      } else {
        // Break the streak
        tempStreak = 0;
        if (i !== sortedStatuses.length - 1) { // Don't break for the last item if it's today
          current = 0; // Reset current streak
        }
      }
    }
    
    setCurrentStreak(current);
    setLongestStreak(longest);
  };

  // Toggle completion status for a specific date
  const toggleCompletion = (index: number) => {
    const updatedStatuses = [...dailyStatus];
    updatedStatuses[index] = {
      ...updatedStatuses[index],
      completed: !updatedStatuses[index].completed
    };
    
    setDailyStatus(updatedStatuses);
    calculateStreaks(updatedStatuses);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Daily Sadhana Checklist</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Streak Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-medium">Current Streak:</span>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
                  {currentStreak} days
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Longest:</span>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  {longestStreak} days
                </Badge>
              </div>
            </div>
          </div>

          {/* Daily Checklist */}
          <div className="space-y-3">
            {dailyStatus.map((status, index) => {
              const isCompleted = status.completed;
              const isCurrentDay = isToday(status.date);
              
              return (
                <motion.div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`
                        h-8 w-8 p-0 rounded-full border-2
                        ${isCompleted 
                          ? 'bg-green-500/20 border-green-500 text-green-300' 
                          : isCurrentDay
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                            : 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                        }
                      `}
                      onClick={() => toggleCompletion(index)}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <Check className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <span className="text-xs font-medium">
                          {status.date.getDate()}
                        </span>
                      )}
                    </Button>
                    <div>
                      <div className="font-medium text-sm">
                        {formatDate(status.date)}
                      </div>
                      {isCurrentDay && (
                        <div className="text-xs text-muted-foreground">
                          Today
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
                      Completed
                    </Badge>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySadhanaChecklist;