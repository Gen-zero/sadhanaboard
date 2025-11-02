import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Flame,
  Target,
  BookOpen,
  Clock,
  Award,
  Plus,
  TrendingUp,
  Star,
  ChevronRight,
  Coins,
  ShoppingCart,
  Check
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileData } from "@/hooks/useProfileData";
import { useSadhanaData } from "@/hooks/useSadhanaData";
import { useSaadhanas } from "@/hooks/useSaadhanas";
import { useUserProgression } from "@/hooks/useUserProgression";
import { useAuth } from '@/lib/auth-context';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import PracticeTrendsChart from '@/components/analytics/PracticeTrendsChart';
import DailyQuest from "@/components/DailyQuest";
import MoodCheckin from "@/components/MoodCheckin";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { profile, stats, currentPractice } = useProfileData();
  const { sadhanaState, sadhanaData, daysCompleted, daysRemaining, progress } = useSadhanaData();
  const { groupedSaadhanas } = useSaadhanas();
  const { progression } = useUserProgression();
  const { user } = useAuth();
  const { practiceTrends, fetchPracticeTrends, loading: analyticsLoading, error: analyticsError } = useUserAnalytics(user?.id || '');

  // Fetch a short-range practice trend for the dashboard preview (last 14 days)
  useEffect(() => {
    if (!user?.id) return;
    fetchPracticeTrends('14d').catch(() => {});
  }, [user?.id, fetchPracticeTrends]);

  // Get today's date in a readable format
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  // Use real user data for stats
  const userStats = {
    streak: stats.completedSadhanas, // Using completed sadhanas as streak for now
    todayProgress: groupedSaadhanas.today.filter(s => s.completed).length > 0 ? 
      Math.round((groupedSaadhanas.today.filter(s => s.completed).length / groupedSaadhanas.today.length) * 100) : 0,
    weeklyGoal: stats.successRate,
    totalHours: stats.totalPracticeDays * 2 // Estimating 2 hours per day
  };

  // Use real user data for today's sadhana
  const todaySadhana = groupedSaadhanas.today;

  // Weekly progress data (mocked for now)
  const weeklyProgress = [
    { day: "Mon", progress: 100 },
    { day: "Tue", progress: 100 },
    { day: "Wed", progress: 100 },
    { day: "Thu", progress: 75 },
    { day: "Fri", progress: 0 },
    { day: "Sat", progress: 0 },
    { day: "Sun", progress: 0 },
  ];

  // Use real user data for achievements
  const achievements = [
    { id: 1, name: "First Sadhana Completed", icon: Award, date: "2023-12-15" },
    { id: 2, name: "5-Day Streak", icon: Star, date: "2024-01-30" },
    { id: 3, name: "Meditation Master", icon: TrendingUp, date: "2024-03-22" },
  ];

  // Function to handle card hover effects with enhanced animations
  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.classList.add('scale-[1.02]', 'shadow-xl', 'z-10');
    e.currentTarget.classList.remove('shadow-lg');
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('scale-[1.02]', 'shadow-xl', 'z-10');
    e.currentTarget.classList.add('shadow-lg');
  };

  const handleBuySP = () => {
    navigate("/store");
  };

  return (
    <Layout>
      <div className="space-y-6 bg-transparent mobile-container">
        {/* Welcome Section with Enhanced Cosmic Effects */}
        <div 
          className="backdrop-blur-sm bg-background/30 p-6 rounded-lg border border-purple-500/20 transition-all duration-300 hover:shadow-lg cosmic-glow relative overflow-hidden mobile-card-compact"
          onMouseEnter={handleCardHover}
          onMouseLeave={handleCardLeave}
        >
          {/* Cosmic particle effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-purple-500/30 animate-pulse"
                style={{
                  width: `${Math.random() * 8 + 2}px`,
                  height: `${Math.random() * 8 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  opacity: Math.random() * 0.5 + 0.3
                }}
              ></div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold cosmic-text animate-fadeIn truncate">Welcome back, {profile.name}</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base truncate">{today}</p>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 animate-pulse flex-shrink-0" />
              <span className="font-bold text-lg sm:text-xl cosmic-pulse">{userStats.streak} day streak</span>
            </div>
          </div>
          
          {/* Enhanced Mood Check-in */}
          <div className="mt-6 relative z-10">
            <MoodCheckin />
          </div>
        </div>

        {/* SP Balance Card */}
        <Card 
          className="border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 transition-all duration-300 hover:shadow-lg cursor-pointer relative overflow-hidden card-hover-effect mobile-card-compact"
          onMouseEnter={handleCardHover}
          onMouseLeave={handleCardLeave}
          onClick={handleBuySP}
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 animate-gradient-shift"></div>
          
          <CardHeader>
            <CardTitle className="flex items-center justify-between relative z-10 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500 yantra-rotate flex-shrink-0" />
                Spiritual Points
              </div>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shimmer-effect button-hover-effect"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuySP();
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                <span className="hidden xs:inline">Buy More</span>
                <span className="xs:hidden">Buy</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold text-amber-300 cosmic-pulse">{progression.spiritualPoints}</p>
                <p className="text-muted-foreground text-sm sm:text-base">Available to spend</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-sm text-muted-foreground">Level {progression.level}</p>
                <p className="text-sm text-muted-foreground">Unlock premium content</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Practice Section */}
        {sadhanaState.hasStarted && sadhanaData && (
          <Card 
            className="border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 transition-all duration-300 hover:shadow-lg relative overflow-hidden card-hover-effect mobile-card-compact"
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            {/* 3D floating effect container */}
            <div className="absolute inset-0 float-3d"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 yantra-rotate flex-shrink-0" />
                Current Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-xl font-semibold truncate">{sadhanaData.deity} Sadhana</h3>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 cosmic-pulse px-3 py-1 text-base flex-shrink-0">
                  Day {daysCompleted} of {sadhanaData.durationDays}
                </Badge>
              </div>
              <p className="text-muted-foreground">{sadhanaData.purpose}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3 cosmic-progress" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  onClick={() => navigate("/sadhana")}
                  className="interactive shimmer-effect button-hover-effect"
                >
                  View Practice
                </Button>
                {daysRemaining === 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate("/sadhana")}
                    className="shimmer cosmic-button button-hover-effect"
                  >
                    Complete Practice
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Quest */}
        <DailyQuest />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            className="transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1 relative overflow-hidden card-3d card-hover-effect mobile-card-compact"
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5"></div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Today's Progress</p>
                  <p className="text-2xl font-bold truncate">{userStats.todayProgress}%</p>
                </div>
                <Target className="h-8 w-8 text-purple-500 cosmic-pulse flex-shrink-0" />
              </div>
              <Progress value={userStats.todayProgress} className="mt-2 cosmic-progress" />
            </CardContent>
          </Card>
          
          <Card 
            className="transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1 relative overflow-hidden card-3d card-hover-effect mobile-card-compact"
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Weekly Goal</p>
                  <p className="text-2xl font-bold truncate">{userStats.weeklyGoal}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500 cosmic-pulse flex-shrink-0" />
              </div>
              <Progress value={userStats.weeklyGoal} className="mt-2 cosmic-progress" />
            </CardContent>
          </Card>
          
          <Card 
            className="transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1 relative overflow-hidden card-3d card-hover-effect mobile-card-compact"
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold truncate">{userStats.totalHours}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500 cosmic-pulse flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1 relative overflow-hidden card-3d card-hover-effect mobile-card-compact"
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5"></div>
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold truncate">{userStats.streak} days</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500 cosmic-pulse animate-pulse flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Sadhana with Enhanced Visual Hierarchy */}
          <div className="lg:col-span-2 space-y-6">
            <Card 
              className="transition-all duration-300 hover:shadow-lg relative overflow-hidden card-hover-effect mobile-card-compact"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
              <CardHeader className="flex flex-row items-center justify-between relative z-10 flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  Today's Sadhana
                </CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => navigate("/saadhanas")}
                  className="interactive shimmer-effect button-hover-effect"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span className="hidden xs:inline">Add</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                {todaySadhana.length > 0 ? (
                  <div className="space-y-3">
                    {todaySadhana.map((sadhana) => (
                      <div 
                        key={sadhana.id} 
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] relative overflow-hidden ${
                          sadhana.completed 
                            ? "bg-green-500/10 border-green-500/30" 
                            : "bg-muted/20 border-muted hover:border-purple-500/30"
                        } card-hover-effect`}
                        onClick={() => navigate(`/saadhanas/${sadhana.id}`)}
                        onMouseEnter={(e) => {
                          e.currentTarget.classList.add('scale-[1.01]', 'shadow-lg');
                          e.currentTarget.classList.remove('hover:shadow-lg');
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.classList.remove('scale-[1.01]', 'shadow-lg');
                          e.currentTarget.classList.add('hover:shadow-lg');
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(`/saadhanas/${sadhana.id}`);
                          }
                        }}
                      >
                        {/* Inner glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative z-10 flex-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <p className="font-medium truncate">{sadhana.title}</p>
                            {sadhana.completed && (
                              <Badge variant="default" className="bg-green-500 cosmic-pulse animate-pulse ml-2 flex-shrink-0">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{sadhana.time || "Any time"}</span>
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {sadhana.category}
                            </Badge>
                            {sadhana.priority === 'high' && (
                              <Badge variant="destructive" className="text-xs">
                                High Priority
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 relative z-10">
                          {!sadhana.completed ? (
                            <Button size="sm" variant="outline" className="floating hover:scale-105 transition-transform button-hover-effect">
                              Start
                            </Button>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                              <Check className="h-4 w-4 text-green-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground backdrop-blur-sm bg-background/10 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5"></div>
                    <BookOpen className="h-12 w-12 mx-auto mb-3 text-purple-500/20 relative z-10" />
                    <p className="mb-2 relative z-10">No practices scheduled for today</p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/saadhanas")}
                      className="interactive relative z-10 button-hover-effect"
                    >
                      Add a practice
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Progress with Enhanced Cosmic Styling */}
            <Card 
              className="transition-all duration-300 hover:shadow-lg relative overflow-hidden card-hover-effect mobile-card-compact"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-end justify-between h-32">
                  {weeklyProgress.map((day, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center gap-2 group"
                      onMouseEnter={(e) => {
                        const bar = e.currentTarget.querySelector('.progress-bar') as HTMLElement;
                        if (bar) {
                          bar.classList.add('glow-primary');
                        }
                      }}
                      onMouseLeave={(e) => {
                        const bar = e.currentTarget.querySelector('.progress-bar') as HTMLElement;
                        if (bar) {
                          bar.classList.remove('glow-primary');
                        }
                      }}
                    >
                      <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{day.day}</div>
                      <div 
                        className="w-6 sm:w-8 bg-gradient-to-t from-purple-500 to-fuchsia-500 rounded-t-sm transition-all duration-300 progress-bar cosmic-progress relative overflow-hidden"
                        style={{ height: `${day.progress}%` }}
                      >
                        {/* Animated particles inside the progress bar */}
                        <div className="absolute inset-0 animate-pulse">
                          {[...Array(3)].map((_, i) => (
                            <div 
                              key={i}
                              className="absolute rounded-full bg-white/30"
                              style={{
                                width: '4px',
                                height: '4px',
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.5}s`
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs font-medium group-hover:font-bold transition-all">{day.progress}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements with Enhanced 3D Effects */}
          <div className="space-y-6">
            <Card 
              className="transition-all duration-300 hover:shadow-lg relative overflow-hidden card-hover-effect mobile-card-compact"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div 
                      key={achievement.id} 
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-300 cursor-pointer floating transform hover:scale-[1.02] hover:shadow-lg relative overflow-hidden card-3d card-hover-effect group"
                      onClick={() => navigate("/profile")}
                      onMouseEnter={(e) => {
                        e.currentTarget.classList.add('bg-muted/30', 'scale-[1.02]', 'shadow-lg');
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.classList.remove('bg-muted/30', 'scale-[1.02]', 'shadow-lg');
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate("/profile");
                        }
                      }}
                    >
                      {/* 3D effect container */}
                      <div className="absolute inset-0 float-3d"></div>
                      
                      {/* Enhanced icon container with glow and 3D effect */}
                      <div className="p-2 rounded-full bg-purple-500/20 cosmic-glow transition-all duration-300 hover:scale-110 relative z-10 transform group-hover:rotate-12 flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-purple-500" />
                      </div>
                      
                      {/* Achievement content with enhanced styling */}
                      <div className="flex-1 min-w-0 relative z-10">
                        <p className="font-medium group-hover:text-purple-300 transition-colors truncate">{achievement.name}</p>
                        <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors truncate">{achievement.date}</p>
                      </div>
                      
                      {/* Animated chevron with hover effect */}
                      <ChevronRight className="h-4 w-4 text-muted-foreground relative z-10 transform group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Actions with Enhanced Button Styling */}
            <Card 
              className="transition-all duration-300 hover:shadow-lg relative overflow-hidden card-hover-effect mobile-card-compact"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                <Button 
                  className="w-full justify-start interactive hover:scale-105 transition-transform shimmer-effect button-hover-effect group" 
                  variant="outline"
                  onClick={() => navigate("/sadhana")}
                >
                  <BookOpen className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform flex-shrink-0" />
                  <span className="group-hover:text-purple-300 transition-colors truncate">Start New Sadhana</span>
                </Button>
                <Button 
                  className="w-full justify-start interactive hover:scale-105 transition-transform shimmer-effect button-hover-effect group" 
                  variant="outline"
                  onClick={() => navigate("/library")}
                >
                  <BookOpen className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform flex-shrink-0" />
                  <span className="group-hover:text-purple-300 transition-colors truncate">Browse Library</span>
                </Button>
                <Button 
                  className="w-full justify-start interactive hover:scale-105 transition-transform shimmer-effect button-hover-effect group" 
                  variant="outline"
                  onClick={() => navigate("/settings")}
                >
                  <Target className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform flex-shrink-0" />
                  <span className="group-hover:text-purple-300 transition-colors truncate">Set Daily Goals</span>
                </Button>
                <Button 
                  className="w-full justify-start interactive hover:scale-105 transition-transform shimmer-effect button-hover-effect group" 
                  variant="outline"
                  onClick={() => navigate("/store")}
                >
                  <ShoppingCart className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform flex-shrink-0" />
                  <span className="group-hover:text-purple-300 transition-colors truncate">Buy Spiritual Points</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analytics Preview Card */}
        <Card className="mobile-card-compact">
          <CardHeader>
            <CardTitle>Your Recent Practice (Preview)</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="text-center text-sm text-muted-foreground py-6">Loading analytics...</div>
            ) : analyticsError ? (
              <div className="text-center text-sm text-destructive py-6">Unable to load analytics</div>
            ) : (
              <PracticeTrendsChart data={Array.isArray(practiceTrends) ? practiceTrends.slice(-14) : []} />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;