import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlarmClock, CheckSquare, BookOpen, Lightbulb, Calendar, PieChart, RotateCw, TrendingUp, Target, Award, Plus, ArrowRight, Home, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useDailySadhanaRefresh } from '@/hooks/useDailySadhanaRefresh';
import { useTouchGestures, TouchGestureArea } from '@/hooks/useTouchGestures';
import { useIsMobile } from '@/hooks/use-mobile';
import PullToRefresh from './PullToRefresh';
import ProfileCard from '../ProfileCard';
import { 
  AndroidButton,
  AndroidCard,
  AndroidAppBar,
  AndroidBottomNav,
  AndroidListItem,
  FloatingActionButton,
  AndroidLinearProgress
} from './AndroidMobileComponents';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  category: 'daily' | 'goal';
  dueDate?: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
}

// Inspirational quotes for daily intention
const inspirationalQuotes = [
  "I will approach each moment with mindfulness and compassion.",
  "Today I choose peace over worry and faith over fear.",
  "I am on a path of spiritual growth and awareness.",
  "I embrace the divine guidance available to me today.",
  "My actions today create ripples of positive energy in the universe.",
  "I will practice gratitude for all experiences today.",
  "I am a vessel for divine love and wisdom.",
  "Today I seek harmony in all my interactions.",
  "I am connected to the eternal source of all creation.",
  "I honor my journey and trust the unfolding of my spiritual path."
];

const MobileDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { manualRefresh } = useDailySadhanaRefresh();
  const isMobile = useIsMobile();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [dailyIntention, setDailyIntention] = useState("");
  const [goalProgress, setGoalProgress] = useState(0);
  const [totalDays, setTotalDays] = useState(40);
  const [currentDay, setCurrentDay] = useState(15);
  const [streak, setStreak] = useState(7);
  const [level, setLevel] = useState(3);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  // Load tasks from localStorage
  const loadTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const savedTasks = localStorage.getItem('saadhanaTasks');
    let taskList: Task[] = [];
    
    if (savedTasks) {
      try {
        taskList = JSON.parse(savedTasks);
        setTasks(taskList);
        
        const todayStr = today.toISOString().split('T')[0];
        const todayTasks = taskList.filter(task => 
          task.category === 'daily' && 
          (!task.dueDate || task.dueDate === todayStr)
        );
        const completedTodayTasks = todayTasks.filter(task => task.completed);
        
        setCompletedCount(completedTodayTasks.length);
        setTotalCount(todayTasks.length);
        
        if (todayTasks.length > 0) {
          setDailyProgress(Math.floor((completedTodayTasks.length / todayTasks.length) * 100));
        }
        
        const urgent = taskList.filter(task => {
          if (task.category === 'daily' && !task.completed) {
            if (!task.dueDate || task.dueDate === todayStr) {
              return true;
            }
          }
          
          if (task.category === 'goal' && task.dueDate && !task.completed) {
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            
            return diffDays <= 3;
          }
          
          return false;
        });
        
        urgent.sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          const aPriority = priorityOrder[a.priority];
          const bPriority = priorityOrder[b.priority];
          
          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }
          
          if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          
          return 0;
        });
        
        setUrgentTasks(urgent.slice(0, 3)); // Only show top 3 on mobile
      } catch (e) {
        // parsing failed
      }
    }
  };

  useEffect(() => {
    loadTasks();
    
    const handleTasksRefreshed = () => {
      loadTasks();
    };
    
    window.addEventListener('sadhana-tasks-refreshed', handleTasksRefreshed);
    
    const today = new Date();
    const savedIntention = localStorage.getItem('dailyIntention');
    const lastIntentionDate = localStorage.getItem('lastIntentionDate');
    
    const todayStr = today.toDateString();
    
    if (!savedIntention || !lastIntentionDate || lastIntentionDate !== todayStr) {
      const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
      const newIntention = inspirationalQuotes[randomIndex];
      
      setDailyIntention(newIntention);
      localStorage.setItem('dailyIntention', newIntention);
      localStorage.setItem('lastIntentionDate', todayStr);
    } else {
      setDailyIntention(savedIntention);
    }
    
    const savedProgress = localStorage.getItem('spiritualPracticeProgress');
    
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setCurrentDay(progress.currentDay);
        setTotalDays(progress.totalDays);
        setGoalProgress(Math.floor((progress.currentDay / progress.totalDays) * 100));
      } catch (e) {
        localStorage.setItem('spiritualPracticeProgress', JSON.stringify({
          currentDay: 15,
          totalDays: 40
        }));
      }
    } else {
      localStorage.setItem('spiritualPracticeProgress', JSON.stringify({
        currentDay: 15,
        totalDays: 40
      }));
      
      setGoalProgress(Math.floor((15 / 40) * 100));
    }
    
    return () => {
      window.removeEventListener('sadhana-tasks-refreshed', handleTasksRefreshed);
    };
  }, []);

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate refresh
    manualRefresh();
    loadTasks();
    toast({
      title: "Refreshed",
      description: "Your dashboard has been updated."
    });
  };

  // Complete task handler with haptic feedback
  const completeTask = (taskId: number) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Haptic feedback
    }
    
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    
    setTasks(updatedTasks);
    localStorage.setItem('saadhanaTasks', JSON.stringify(updatedTasks));
    
    setUrgentTasks(prev => prev.filter(task => task.id !== taskId));
    
    const completedTask = tasks.find(task => task.id === taskId);
    if (completedTask && completedTask.category === 'daily') {
      const newCompletedCount = completedCount + 1;
      setCompletedCount(newCompletedCount);
      setDailyProgress(Math.floor((newCompletedCount / totalCount) * 100));
    }
    
    toast({
      title: "Task Completed! ✨",
      description: "Your spiritual journey progresses."
    });
  };

  // Touch gesture handlers for task cards
  const handleTaskSwipe = (taskId: number, direction: 'left' | 'right') => {
    if (direction === 'right') {
      completeTask(taskId);
    } else if (direction === 'left') {
      // Navigate to task details or edit
      navigate(`/sadhana/${taskId}`);
    }
  };

  // Navigation between urgent tasks with swipe
  const handleTaskNavigation = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentTaskIndex < urgentTasks.length - 1) {
      setCurrentTaskIndex(prev => prev + 1);
    } else if (direction === 'right' && currentTaskIndex > 0) {
      setCurrentTaskIndex(prev => prev - 1);
    }
  };

  if (!isMobile) {
    return null; // This component is only for mobile
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6 pt-16"> {/* Top spacing */}
        {/* Android App Bar */}
        <AndroidAppBar 
          title="SadhanaBoard" 
          onMenuClick={() => navigate('/settings')}
          onSearchClick={() => console.log('Search clicked')}
        />
        
        {/* Mobile Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProfileCard />
        </motion.div>

        {/* Welcome Section - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mobile-card mobile-card-interactive p-4 bg-gradient-to-br from-purple-500/10 via-fuchsia-500/5 to-purple-500/10"
        >
          <div className="space-y-4">
            <div>
              <h1 className="mobile-heading-scale font-bold">Welcome Back, Seeker</h1>
              <p className="mobile-text-scale text-muted-foreground">
                Continue your spiritual journey with purpose
              </p>
            </div>
            
            {/* Quick Stats - Mobile Grid */}
            <div className="mobile-grid-2 mobile-gap-small">
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-xs font-medium">Streak</span>
                </div>
                <div className="text-lg font-bold">{streak} days</div>
              </div>
              
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Award className="h-4 w-4 text-fuchsia-500" />
                  <span className="text-xs font-medium">Level</span>
                </div>
                <div className="text-lg font-bold">Level {level}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Today's Progress - Mobile Circular Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="mobile-card">
            <CardHeader className="pb-2">
              <CardTitle className="mobile-subheading-scale flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-6">
                {/* Circular Progress */}
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      className="text-secondary stroke-current" 
                      strokeWidth="8" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent"
                    />
                    <circle 
                      className="text-primary stroke-current" 
                      strokeWidth="8" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * dailyProgress) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold">{completedCount}/{totalCount}</div>
                    </div>
                  </div>
                </div>
                
                {/* Progress Details */}
                <div className="space-y-2 flex-1">
                  <div className="text-sm font-medium">Tasks Completed</div>
                  <Progress value={dailyProgress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {dailyProgress}% complete
                  </div>
                  {dailyProgress === 100 && (
                    <div className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full inline-block">
                      All done! 🎉
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Urgent Tasks - Mobile Swipeable Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="mobile-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="mobile-subheading-scale flex items-center gap-2">
                  <AlarmClock className="h-5 w-5 text-primary" />
                  Urgent Tasks
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="p-1"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {urgentTasks.length === 0 ? (
                <div className="text-center py-6">
                  <CheckSquare className="h-12 w-12 text-primary/30 mx-auto mb-2" />
                  <p className="mobile-text-scale text-muted-foreground">All caught up!</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="mt-2" 
                    onClick={() => navigate('/sadhana')}
                  >
                    Add New Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="wait">
                    {urgentTasks.slice(currentTaskIndex, currentTaskIndex + 1).map((task, index) => (
                      <motion.div
                        key={`${task.id}-${currentTaskIndex}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TouchGestureArea
                          gestureOptions={{
                            onSwipeRight: () => handleTaskSwipe(task.id, 'right'),
                            onSwipeLeft: () => handleTaskSwipe(task.id, 'left'),
                            threshold: 50
                          }}
                          className="mobile-card mobile-card-interactive p-4 bg-secondary/30"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              task.priority === 'high' ? 'bg-red-500' : 
                              task.priority === 'medium' ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <h3 className="mobile-text-scale font-medium truncate">{task.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                {task.category === 'daily' ? 'Daily Ritual' : 'Goal Oriented'}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => completeTask(task.id)}
                              className="touch-target-small"
                            >
                              ✓
                            </Button>
                          </div>
                          
                          {/* Swipe indicators */}
                          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>← Swipe for details</span>
                            <span>Swipe to complete →</span>
                          </div>
                        </TouchGestureArea>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Task navigation dots */}
                  {urgentTasks.length > 1 && (
                    <div className="flex justify-center space-x-2 mt-4">
                      {urgentTasks.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            index === currentTaskIndex 
                              ? 'bg-primary w-4' 
                              : 'bg-muted-foreground/30'
                          }`}
                          onClick={() => setCurrentTaskIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-3 touch-target-medium"
                    onClick={() => navigate('/sadhana')}
                  >
                    View All Tasks
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Intention - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="mobile-card">
            <CardHeader className="pb-2">
              <CardTitle className="mobile-subheading-scale flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Today's Intention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="mobile-text-scale italic text-center text-muted-foreground border-l-4 border-primary/20 pl-4">
                "{dailyIntention}"
              </blockquote>
            </CardContent>
          </Card>
        </motion.div>

        {/* Goal Progress - Mobile Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="mobile-card">
            <CardHeader className="pb-2">
              <CardTitle className="mobile-subheading-scale flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Spiritual Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Day {currentDay}</span>
                  <span>Day {totalDays}</span>
                </div>
                <Progress value={goalProgress} className="h-3" />
                <p className="mobile-text-scale text-muted-foreground mt-2 text-center">
                  {currentDay} days into your {totalDays}-day devotional practice
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions - Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mobile-grid-2 mobile-gap-medium"
        >
          <Button
            variant="outline"
            className="mobile-button touch-target-large flex-col h-20"
            onClick={() => navigate('/sadhana')}
          >
            <Plus className="h-5 w-5 mb-1" />
            <span className="text-xs">Add Sadhana</span>
          </Button>
          
          <Button
            variant="outline"
            className="mobile-button touch-target-large flex-col h-20"
            onClick={() => navigate('/library')}
          >
            <BookOpen className="h-5 w-5 mb-1" />
            <span className="text-xs">Library</span>
          </Button>
        </motion.div>
        
        {/* Android Floating Action Button */}
        <FloatingActionButton 
          icon={<Plus size={24} />}
          onClick={() => navigate('/sadhana/new')}
        />
      </div>
    </PullToRefresh>
  );
};

export default MobileDashboard;