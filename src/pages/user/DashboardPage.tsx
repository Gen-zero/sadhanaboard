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
  ShoppingCart,
  Check,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
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
    fetchPracticeTrends('14d').catch(() => { });
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

  // Check if task is a chanting or meditation task
  const isChantingOrMeditationTask = (title: string): boolean => {
    const keywords = ['chant', 'meditate'];
    return keywords.some(keyword =>
      title.toLowerCase().includes(keyword)
    );
  };

  return (
    <Layout>
      <div className="space-y-6 bg-transparent mobile-container">
        {/* Welcome Section with Enhanced Cosmic Effects */}
        <div
          className="backdrop-blur-sm bg-background/30 p-6 rounded-lg border border-primary/20 transition-all duration-300 hover:shadow-lg cosmic-glow relative overflow-hidden mobile-card-compact"
          onMouseEnter={handleCardHover}
          onMouseLeave={handleCardLeave}
        >
          {/* Cosmic particle effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-primary/30 animate-pulse"
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
              <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-accent animate-pulse flex-shrink-0" />
              <span className="font-bold text-lg sm:text-xl cosmic-pulse">{userStats.streak} day streak</span>
            </div>
          </div>

          {/* Enhanced Mood Check-in */}
          {/* <div className="mt-6 relative z-10">
            <MoodCheckin />
          </div> */}
        </div>

        {/* Stats Overview - Moved to top as per user request */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="backdrop-blur-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-purple-500/20 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl cursor-pointer transform hover:-translate-y-1 relative overflow-hidden card-3d card-hover-effect mobile-card-compact group"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5"></div>
              <CardContent className="p-5 relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-purple-300 transition-colors">Today's Progress</p>
                  <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <Target className="h-5 w-5 text-purple-500 cosmic-pulse" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">{userStats.todayProgress}%</p>
                  <Progress value={userStats.todayProgress} className="mt-3 h-1.5 cosmic-progress" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="backdrop-blur-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-purple-500/20 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl cursor-pointer transform hover:-translate-y-1 relative overflow-hidden card-3d card-hover-effect mobile-card-compact group"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
              <CardContent className="p-5 relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-green-300 transition-colors">Weekly Goal</p>
                  <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <TrendingUp className="h-5 w-5 text-green-500 cosmic-pulse" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200">{userStats.weeklyGoal}%</p>
                  <Progress value={userStats.weeklyGoal} className="mt-3 h-1.5 cosmic-progress" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="backdrop-blur-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-purple-500/20 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl cursor-pointer transform hover:-translate-y-1 relative overflow-hidden card-3d card-hover-effect mobile-card-compact group"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
              <CardContent className="p-5 relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-blue-300 transition-colors">Total Hours</p>
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Clock className="h-5 w-5 text-blue-500 cosmic-pulse" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">{userStats.totalHours}</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="backdrop-blur-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-purple-500/20 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl cursor-pointer transform hover:-translate-y-1 relative overflow-hidden card-3d card-hover-effect mobile-card-compact group"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5"></div>
              <CardContent className="p-5 relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-orange-300 transition-colors">Current Streak</p>
                  <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                    <Flame className="h-5 w-5 text-orange-500 cosmic-pulse animate-pulse flex-shrink-0" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200">{userStats.streak} days</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Sadhana Section - Conditionally rendered based on sadhana active state */}
          {!sadhanaState.hasStarted ? (
            /* Start New Sadhana Prompt */
            <Card
              className="backdrop-blur-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-amber-500/20 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl relative overflow-hidden card-hover-effect mobile-card-compact group"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-red-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>

              <CardContent className="p-8 relative z-10 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
                <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/30 shadow-[0_0_15px_rgba(255,215,0,0.3)] animate-pulse">
                  <Target className="h-10 w-10 text-gold" />
                </div>

                <div className="space-y-2 max-w-md">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200" style={{ fontFamily: '"Chakra Petch", sans-serif' }}>
                    Begin Your Sacred Journey
                  </h3>
                  <p className="text-muted-foreground">
                    You are not currently observing a Sadhana. Set a powerful intention and start a 40-day transformative practice today.
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={() => navigate("/sadhana")}
                  className="interactive shimmer-effect button-hover-effect px-8 py-6 text-lg relative overflow-hidden group/btn"
                  style={{
                    background: 'linear-gradient(135deg, rgba(220, 20, 60, 0.2) 0%, rgba(139, 0, 0, 0.2) 100%)',
                    border: '1px solid rgba(255, 215, 0, 0.4)'
                  }}
                >
                  <div className="absolute inset-0 bg-amber-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2 text-gold font-bold tracking-wider">
                    <Flame className="w-5 h-5 fill-current" />
                    START SADHANA
                  </span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Existing Daily Sadhana List */
            <Card
              className="backdrop-blur-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-purple-500/20 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl relative overflow-hidden card-hover-effect mobile-card-compact"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5"></div>
              <CardHeader className="flex flex-row items-center justify-between relative z-10 flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gold flex-shrink-0" />
                  Daily Sadhana
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
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] relative overflow-hidden ${sadhana.completed
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
                              <Clock className="h-3 w-3 flex-shrink-0 text-gold" />
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
                            <Button
                              size="sm"
                              variant="outline"
                              className="floating hover:scale-105 transition-transform button-hover-effect bg-gold text-black hover:bg-yellow-500 font-bold"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isChantingOrMeditationTask(sadhana.title)) {
                                  navigate('/beads');
                                } else {
                                  navigate(`/saadhanas/${sadhana.id}`);
                                }
                              }}
                            >
                              Start
                            </Button>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                              <Check className="h-4 w-4 text-gold" />
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
          )}
        </div>

        {/* Weekly Progress & Recent Achievements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Progress Chart */}
          <Card
            className="backdrop-blur-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-purple-500/20 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl relative overflow-hidden card-hover-effect mobile-card-compact"
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gold flex-shrink-0" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-80 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#7c3aed" strokeOpacity={0.3} />
                  <XAxis dataKey="day" stroke="#c084fc" />
                  <YAxis stroke="#c084fc" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(124, 58, 237, 0.2)',
                      borderColor: '#7c3aed',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '0.75rem',
                      color: '#fff'
                    }}
                  />
                  <Bar
                    dataKey="progress"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  >
                    {weeklyProgress.map((entry, index) => (
                      <motion.rect
                        key={`rect-${index}`}
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" />
                      <stop offset="95%" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Achievements with Enhanced 3D Effects */}
          <Card
            className="backdrop-blur-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-purple-500/20 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl relative overflow-hidden card-hover-effect mobile-card-compact"
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-gold flex-shrink-0" />
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
                    <div className="p-2 rounded-full bg-gold/20 cosmic-glow transition-all duration-300 hover:scale-110 relative z-10 transform group-hover:rotate-12 flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-gold" />
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
        </div>

        {/* SP Balance Card - Moved to bottom as per user request */}
        {/* Spiritual Points card has been moved to the bottom of the dashboard */}

        {/* Current Practice Section - Removed as per user request */}


        {/* Daily Quest - Hidden as per user request */}
        {/* <DailyQuest /> */}

        {/* Stats Overview - Removed as it's been moved to top */}
        {/* Stats cards have been moved to the top of the dashboard as requested */}




      </div>
    </Layout>
  );
};

export default DashboardPage;