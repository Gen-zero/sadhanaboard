import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { useDailySadhanaRefresh } from '../hooks/useDailySadhanaRefresh';
import MobileDashboard from '../components/mobile/MobileDashboard';
import ProfileCard from '../components/ProfileCard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import type { Task } from '../types/task';
import { 
  RefreshCw, 
  Target, 
  Flame, 
  Calendar, 
  CheckCircle, 
  BookOpen, 
  TrendingUp, 
  Zap, 
  Star, 
  Clock, 
  Award,
  AlarmClock,
  RotateCw,
  CheckSquare,
  PieChart,
  Lightbulb
} from 'lucide-react';
import { inspirationalQuotes } from '../data/inspirationalQuotes';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { manualRefresh } = useDailySadhanaRefresh();
  const [isMobile, setIsMobile] = useState(false);
  
  // All state hooks moved to the top to comply with React Hooks rules
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [dailyIntention, setDailyIntention] = useState("");
  const [goalProgress, setGoalProgress] = useState(0);
  const [totalDays, setTotalDays] = useState(40);
  const [currentDay, setCurrentDay] = useState(15);
  const [streak, setStreak] = useState(7); // Current streak
  const [level, setLevel] = useState(3); // User level

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Use mobile dashboard for mobile devices
  if (isMobile) {
    return <MobileDashboard />;
  }
  
  // Function to load tasks from localStorage
  const loadTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Fetch tasks from localStorage
    const savedTasks = localStorage.getItem('saadhanaTasks');
    let taskList: Task[] = [];
    
    if (savedTasks) {
      try {
        taskList = JSON.parse(savedTasks);
        setTasks(taskList);
        
        // Calculate today's progress - filter for today's date
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
        
        // Get urgent tasks (upcoming or due today)
        const urgent = taskList.filter(task => {
          // For daily tasks that are not completed and due today
          if (task.category === 'daily' && !task.completed) {
            if (!task.dueDate || task.dueDate === todayStr) {
              return true;
            }
          }
          
          // For goal-oriented tasks with due dates
          if (task.category === 'goal' && task.dueDate && !task.completed) {
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            
            // Due today or within the next 3 days
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            
            return diffDays <= 3;
          }
          
          return false;
        });
        
        // Sort by priority and due date
        urgent.sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          const aPriority = priorityOrder[a.priority];
          const bPriority = priorityOrder[b.priority];
          
          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }
          
          // If same priority, sort by due date
          if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          
          return 0;
        });
        
        setUrgentTasks(urgent.slice(0, 5)); // Get top 5 urgent tasks
      } catch (e) {
        // parsing failed, fall back to empty tasks
      }
    }
  };

  // Initialize tasks from localStorage
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    loadTasks();
    
    // Listen for sadhana task refresh events
    const handleTasksRefreshed = () => {
      loadTasks();
    };
    
    window.addEventListener('sadhana-tasks-refreshed', handleTasksRefreshed);
    
    // Get or set daily intention
    const today = new Date();
    const savedIntention = localStorage.getItem('dailyIntention');
    const lastIntentionDate = localStorage.getItem('lastIntentionDate');
    
    // Check if we need a new intention (new day)
    const todayStr = today.toDateString();
    
    if (!savedIntention || !lastIntentionDate || lastIntentionDate !== todayStr) {
      // Set new random intention
      const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
      const newIntention = inspirationalQuotes[randomIndex];
      
      setDailyIntention(newIntention);
      localStorage.setItem('dailyIntention', newIntention);
      localStorage.setItem('lastIntentionDate', todayStr);
    } else {
      setDailyIntention(savedIntention);
    }
    
    // Get or initialize spiritual practice progress
    const savedProgress = localStorage.getItem('spiritualPracticeProgress');
    
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setCurrentDay(progress.currentDay);
        setTotalDays(progress.totalDays);
        setGoalProgress(Math.floor((progress.currentDay / progress.totalDays) * 100));
      } catch (e) {
        // parsing failed, fall back to default progress
        localStorage.setItem('spiritualPracticeProgress', JSON.stringify({
          currentDay: 15,
          totalDays: 40
        }));
      }
    } else {
      // Initialize progress data
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

  // Manual refresh function for sadhana tasks
  const handleRefreshSadhanaTasks = () => {
    manualRefresh();
    toast({
      title: "Tasks Refreshed",
      description: "Your daily sadhana practices have been refreshed."
    });
  };

  // Complete task handler
  const completeTask = (taskId: number) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    
    setTasks(updatedTasks);
    localStorage.setItem('saadhanaTasks', JSON.stringify(updatedTasks));
    
    // Update urgent tasks list
    setUrgentTasks(prev => prev.filter(task => task.id !== taskId));
    
    // Recalculate progress if it's a daily task
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
  };

  // Format time for display
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

  // Format date for display
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

  // Get deadline display
  const getDeadline = (task: Task) => {
    if (task.category === 'daily') {
      return `Today, ${formatTime(task.time)}`;
    } else {
      return formatDate(task.dueDate);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      {/* Profile Card */}
      <ProfileCard />
      
      {/* Enhanced Welcome Section with Cosmic Effects */}
      <div className="relative overflow-hidden rounded-xl backdrop-blur-md bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 border border-primary/20 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full filter blur-[80px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary rounded-full filter blur-[80px] opacity-20"></div>
        
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome Back, Seeker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Continue your spiritual journey with purpose and intention. Your cosmic path awaits.
          </p>
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Current Streak</span>
              </div>
              <div className="text-2xl font-bold mt-1">{streak} days</div>
            </div>
            
            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium">Spiritual Level</span>
              </div>
              <div className="text-2xl font-bold mt-1">Level {level}</div>
            </div>
            
            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">Goal Progress</span>
              </div>
              <div className="text-2xl font-bold mt-1">{Math.floor((currentDay / totalDays) * 100)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Task Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <AlarmClock className="h-5 w-5 text-primary" />
            <span>Tasks Requiring Attention</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleRefreshSadhanaTasks}
              className="flex items-center gap-1 text-xs bg-transparent border border-input hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3"
            >
              <RotateCw className="h-3 w-3" />
              Refresh Sadhana
            </Button>
            <Button 
              onClick={() => navigate('/tasks')}
              className="h-8 rounded-md px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              View All Tasks
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {urgentTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckSquare className="h-12 w-12 text-primary/30 mb-2" />
              <p className="text-muted-foreground">All caught up! No urgent tasks.</p>
              <Button 
                onClick={() => navigate('/tasks')}
                className="mt-2 h-8 rounded-md px-3 font-normal text-primary underline-offset-4 hover:underline bg-transparent border-none"
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
                        task.priority === 'high' ? 'text-destructive' : 
                        task.priority === 'medium' ? 'text-accent' : 
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
                    <Button 
                      onClick={() => completeTask(task.id)}
                      className="h-8 rounded-md px-3 bg-transparent hover:bg-accent hover:text-accent-foreground"
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Progress and Focus Section */}
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
              
              {/* Progress Bar */}
              <div className="w-full mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{dailyProgress}%</span>
                </div>
                <Progress value={dailyProgress} className="h-2" />
              </div>
            </div>
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
                <p className="text-muted-foreground mt-1 italic">
                  "{dailyIntention}"
                </p>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Goal Progress
                </h3>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;