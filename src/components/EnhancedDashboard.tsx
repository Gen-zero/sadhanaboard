import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlarmClock, CheckSquare, BookOpen, Lightbulb, Calendar, PieChart, RotateCw, TrendingUp, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useDailySadhanaRefresh } from '@/hooks/useDailySadhanaRefresh';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLoadingState, LOADING_KEYS } from '@/hooks/useLoadingState';
import { 
  LoadingSpinner, 
  Skeleton, 
  CardSkeleton, 
  ListSkeleton,
  LoadingButton,
  LoadingOverlay
} from '@/components/loading/LoadingComponents';
import ProfileCard from './ProfileCard';
import MobileDashboard from './mobile/MobileDashboard';

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

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { manualRefresh } = useDailySadhanaRefresh();
  const isMobile = useIsMobile();
  const { isLoading, setLoading, withLoading } = useLoadingState();

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
  const [showMobileDashboard, setShowMobileDashboard] = useState(false);

  // Loading states for different sections
  const isDashboardLoading = isLoading(LOADING_KEYS.DASHBOARD_LOAD);
  const isTasksLoading = isLoading(LOADING_KEYS.TASKS_LOAD);
  const isStatsLoading = isLoading(LOADING_KEYS.STATS_LOAD);
  const isProfileLoading = isLoading(LOADING_KEYS.PROFILE_LOAD);

  // Check if we should show mobile dashboard
  useEffect(() => {
    setShowMobileDashboard(isMobile);
  }, [isMobile]);

  // Use mobile dashboard for mobile devices
  if (showMobileDashboard) {
    return <MobileDashboard />;
  }

  // Function to load tasks from localStorage with loading state
  const loadTasks = withLoading(LOADING_KEYS.TASKS_LOAD, async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
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
        
        setUrgentTasks(urgent.slice(0, 5));
      } catch (e) {
        throw new Error('Failed to load tasks');
      }
    }
  });

  // Load dashboard stats with loading state
  const loadStats = withLoading(LOADING_KEYS.STATS_LOAD, async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
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
  });

  // Initialize dashboard with comprehensive loading
  useEffect(() => {
    const initializeDashboard = withLoading(LOADING_KEYS.DASHBOARD_LOAD, async () => {
      // Load all dashboard data in parallel
      await Promise.all([
        loadTasks(),
        loadStats()
      ]);

      // Set daily intention
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
    });

    initializeDashboard();

    const handleTasksRefreshed = () => {
      loadTasks();
    };
    
    window.addEventListener('sadhana-tasks-refreshed', handleTasksRefreshed);
    
    return () => {
      window.removeEventListener('sadhana-tasks-refreshed', handleTasksRefreshed);
    };
  }, []);

  // Manual refresh function for sadhana tasks with loading
  const handleRefreshSadhanaTasks = withLoading(LOADING_KEYS.TASKS_LOAD, async () => {
    manualRefresh();
    await loadTasks();
    toast({
      title: "Tasks Refreshed",
      description: "Your daily sadhana practices have been refreshed."
    });
  });

  // Complete task handler with loading
  const completeTask = withLoading(LOADING_KEYS.SADHANA_COMPLETE, async (taskId: number) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
      title: "Task Completed",
      description: "Great job! Your spiritual journey progresses."
    });
  });

  // Helper functions (same as before)
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      
      return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
    } catch (e) {
      return timeString;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Today';
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueDate = new Date(dateString);
      dueDate.setHours(0, 0, 0, 0);
      
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Tomorrow';
      } else if (diffDays < 0) {
        return 'Overdue';
      } else {
        return dueDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (e) {
      return dateString;
    }
  };

  const getDeadline = (task: Task) => {
    if (task.category === 'daily') {
      return `Today, ${formatTime(task.time)}`;
    } else {
      return formatDate(task.dueDate);
    }
  };

  // Show loading overlay during initial dashboard load
  if (isDashboardLoading) {
    return (
      <LoadingOverlay
        isVisible={true}
        message="Loading your spiritual dashboard..."
        variant="spiritual"
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* Profile Card with loading state */}
      {isProfileLoading ? (
        <CardSkeleton />
      ) : (
        <ProfileCard />
      )}
      
      {/* Enhanced Welcome Section with loading states */}
      <div className="relative overflow-hidden rounded-xl backdrop-blur-md bg-gradient-to-br from-purple-500/10 via-fuchsia-500/5 to-purple-500/10 border border-purple-500/20 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full filter blur-[80px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-500 rounded-full filter blur-[80px] opacity-20"></div>
        
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome Back, Seeker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Continue your spiritual journey with purpose and intention. Your cosmic path awaits.
          </p>
          
          {/* Stats Row with loading states */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {isStatsLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton width="60%" height="1rem" />
                  </div>
                  <Skeleton width="40%" height="2rem" />
                </div>
              ))
            ) : (
              <>
                <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">Current Streak</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">{streak} days</div>
                </div>
                
                <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-fuchsia-500" />
                    <span className="text-sm font-medium">Spiritual Level</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">Level {level}</div>
                </div>
                
                <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm font-medium">Goal Progress</span>
                  </div>
                  <div className="text-2xl font-bold mt-1">{Math.floor((currentDay / totalDays) * 100)}%</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Task Section with loading states */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <AlarmClock className="h-5 w-5 text-primary" />
            <span>Tasks Requiring Attention</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <LoadingButton 
              loading={isTasksLoading}
              loadingText="Refreshing..."
              variant="ghost" 
              size="sm" 
              onClick={handleRefreshSadhanaTasks}
              className="flex items-center gap-1 text-xs"
              icon={<RotateCw className="h-3 w-3" />}
            >
              Refresh Sadhana
            </LoadingButton>
            <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>
              View All Tasks
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isTasksLoading ? (
            <ListSkeleton items={3} />
          ) : urgentTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckSquare className="h-12 w-12 text-primary/30 mb-2" />
              <p className="text-muted-foreground">All caught up! No urgent tasks.</p>
              <Button 
                variant="link" 
                size="sm" 
                className="mt-2" 
                onClick={() => navigate('/tasks')}
              >
                Add New Task
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {urgentTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover-lift"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <CheckSquare className={`h-5 w-5 ${
                        task.priority === 'high' ? 'text-red-500' : 
                        task.priority === 'medium' ? 'text-yellow-500' : 
                        'text-primary/70'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent text-accent-foreground">
                          {task.category === 'daily' ? 'Daily Ritual' : 'Goal Oriented'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{getDeadline(task)}</span>
                    <LoadingButton
                      loading={isLoading(LOADING_KEYS.SADHANA_COMPLETE)}
                      loadingText="Completing..."
                      variant="ghost" 
                      size="sm" 
                      onClick={() => completeTask(task.id)}
                    >
                      Complete
                    </LoadingButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Progress and Focus Section with loading states */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <span>Today's Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isTasksLoading ? (
              <div className="flex flex-col items-center justify-center h-48 space-y-4">
                <Skeleton variant="circular" width={128} height={128} />
                <div className="w-full space-y-2">
                  <Skeleton width="100%" height="0.5rem" />
                  <div className="flex justify-between">
                    <Skeleton width="30%" height="0.75rem" />
                    <Skeleton width="20%" height="0.75rem" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      className="text-secondary stroke-current" 
                      strokeWidth="10" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent"
                    />
                    <circle 
                      className="text-primary stroke-current" 
                      strokeWidth="10" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * dailyProgress) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold">
                        {completedCount}/{totalCount}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Daily Tasks Completed</p>
                {dailyProgress === 100 && (
                  <span className="mt-2 text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                    Congratulations! All tasks complete
                  </span>
                )}
                
                <div className="w-full mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{dailyProgress}%</span>
                  </div>
                  <Progress value={dailyProgress} className="h-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Spiritual Focus Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span>Spiritual Focus</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Today's Intention
                </h3>
                {dailyIntention ? (
                  <p className="text-muted-foreground mt-1 italic">
                    "{dailyIntention}"
                  </p>
                ) : (
                  <Skeleton lines={2} className="mt-1" />
                )}
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Goal Progress
                </h3>
                {isStatsLoading ? (
                  <div className="space-y-2 mt-1">
                    <Skeleton width="80%" height="1rem" />
                    <Skeleton width="100%" height="0.5rem" />
                    <div className="flex justify-between">
                      <Skeleton width="20%" height="0.75rem" />
                      <Skeleton width="20%" height="0.75rem" />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-muted-foreground mt-1">
                      {currentDay} days into your {totalDays}-day devotional practice
                    </p>
                    <div className="w-full mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Day 1</span>
                        <span>Day {totalDays}</span>
                      </div>
                      <Progress value={goalProgress} className="h-2" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedDashboard;