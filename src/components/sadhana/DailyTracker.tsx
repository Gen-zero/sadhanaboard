import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calendar, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DailyTrackerProps {
  sadhanaId: number;
  startDate: Date;
  endDate: Date;
  onCompletionToggle?: (date: Date, completed: boolean) => void;
}

interface DailyStatus {
  date: Date;
  completed: boolean;
  streakContinued: boolean;
}

const DailyTracker = ({ 
  sadhanaId, 
  startDate, 
  endDate,
  onCompletionToggle 
}: DailyTrackerProps) => {
  const [dailyStatus, setDailyStatus] = useState<DailyStatus[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  // Initialize daily status for the sadhana period
  useEffect(() => {
    const statuses: DailyStatus[] = [];
    const currentDate = new Date(startDate);
    
    // Generate daily status for each day in the sadhana period
    while (currentDate <= endDate) {
      statuses.push({
        date: new Date(currentDate),
        completed: false,
        streakContinued: false
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setDailyStatus(statuses);
    
    // Load saved progress from localStorage
    loadSavedProgress(statuses);
  }, [sadhanaId, startDate, endDate]);

  // Load saved progress from localStorage
  const loadSavedProgress = (statuses: DailyStatus[]) => {
    const savedProgress = localStorage.getItem(`sadhana_daily_progress_${sadhanaId}`);
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        const updatedStatuses = statuses.map(status => {
          const savedStatus = parsedProgress.find((s: any) => 
            new Date(s.date).toDateString() === status.date.toDateString()
          );
          return savedStatus ? { ...status, ...savedStatus } : status;
        });
        setDailyStatus(updatedStatuses);
        calculateStreaks(updatedStatuses);
      } catch (e) {
        console.error('Failed to load saved progress', e);
      }
    }
  };

  // Save progress to localStorage
  const saveProgress = (statuses: DailyStatus[]) => {
    try {
      localStorage.setItem(
        `sadhana_daily_progress_${sadhanaId}`, 
        JSON.stringify(statuses)
      );
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  };

  // Calculate current and longest streaks
  const calculateStreaks = (statuses: DailyStatus[]) => {
    let current = 0;
    let longest = 0;
    let tempStreak = 0;
    
    // Sort statuses by date to ensure proper order
    const sortedStatuses = [...statuses].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Calculate streaks from the beginning
    for (let i = 0; i < sortedStatuses.length; i++) {
      const status = sortedStatuses[i];
      const statusDate = new Date(status.date);
      statusDate.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // For today or future dates, don't count in streak calculation yet
      if (statusDate > today) {
        continue;
      }
      
      // For today, update current streak but don't finalize it
      if (statusDate.getTime() === today.getTime()) {
        if (status.completed) {
          tempStreak++;
        }
        // Don't break streak for today yet
        continue;
      }
      
      // For past dates, check completion
      if (status.completed) {
        tempStreak++;
        current = tempStreak; // Update current streak
        longest = Math.max(longest, tempStreak);
      } else {
        // Break the streak if not completed and it's a past day
        tempStreak = 0;
        current = 0; // Reset current streak
      }
    }
    
    setCurrentStreak(current);
    setLongestStreak(longest);
  };

  // Toggle completion status for a specific date
  const toggleCompletion = (date: Date) => {
    const updatedStatuses = dailyStatus.map(status => {
      if (status.date.toDateString() === date.toDateString()) {
        const newStatus = { ...status, completed: !status.completed };
        onCompletionToggle?.(date, newStatus.completed);
        return newStatus;
      }
      return status;
    });
    
    setDailyStatus(updatedStatuses);
    saveProgress(updatedStatuses);
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

  // Check if date is in the past
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  return (
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

      {/* Daily Tracker Grid */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-500/30">
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {dailyStatus.map((status, index) => {
              const isCompleted = status.completed;
              const isCurrentDay = isToday(status.date);
              const isPast = isPastDate(status.date);
              
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className={`
                      relative h-12 w-12 p-0 rounded-full border-2
                      ${isCompleted 
                        ? 'bg-green-500/20 border-green-500 text-green-300' 
                        : isCurrentDay
                          ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                          : isPast && !isCompleted
                            ? 'border-red-500/50 bg-red-500/10 text-red-300/50'
                            : 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                      }
                      transition-all duration-300
                    `}
                    onClick={() => toggleCompletion(status.date)}
                    disabled={isPast && !isCurrentDay}
                  >
                    <AnimatePresence>
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <Check className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-xs font-medium"
                        >
                          {status.date.getDate()}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {/* Today indicator */}
                    {isCurrentDay && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-500 border-2 border-background"></div>
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
          
          {/* Date Labels */}
          <div className="grid grid-cols-7 gap-2 mt-2">
            {dailyStatus.slice(0, 7).map((status, index) => (
              <div key={index} className="text-center text-xs text-muted-foreground">
                {status.date.toLocaleDateString('en-US', { weekday: 'narrow' })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-cyan-500/20 border border-cyan-500"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-purple-500/10 border border-purple-500/30"></div>
          <span>Upcoming</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-red-500/10 border border-red-500/50"></div>
          <span>Missed</span>
        </div>
      </div>
    </div>
  );
};

export default DailyTracker;