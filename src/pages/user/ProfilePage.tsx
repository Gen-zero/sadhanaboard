import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
  User, 
  Edit, 
  Share2, 
  Flame, 
  Award, 
  TrendingUp, 
  Heart, 
  Users, 
  Zap,
  Star,
  Target,
  Calendar,
  Medal,
  Crown,
  Leaf,
  Moon,
  Sun,
  Sparkles,
  Compass,
  BookOpen,
  Clock,
  Activity,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, BarChart, Bar, AreaChart, Area, Label
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import BadgeGallery from '@/components/profile/BadgeGallery';
import { useBadges } from '@/hooks/useBadges';
import { useSettings } from '@/hooks/useSettings';
import { useUserProfile } from '@/hooks/useUserProfile';
import EditProfileModal from '@/components/EditProfileModal';

// Types for our profile data
interface Achievement {
  id: number;
  name: string;
  description: string;
  earned: string;
  icon: JSX.Element;
}

interface SadhanaData {
  day: string;
  duration: number;
}

interface DeityData {
  name: string;
  value: number;
}

interface EnergyBalance {
  sattva: number;
  rajas: number;
  tamas: number;
}

interface ChakraData {
  name: string;
  value: number;
  color: string;
}

interface WeeklyProgress {
  day: string;
  progress: number;
}

// Mock data for achievements (will be replaced with real data)
const mockAchievements: Achievement[] = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first sadhana",
    earned: "2024-01-15",
    icon: <Leaf className="h-6 w-6 text-green-500" />
  },
  {
    id: 2,
    name: "Week of Discipline",
    description: "Maintain a 7-day practice streak",
    earned: "2024-02-01",
    icon: <Flame className="h-6 w-6 text-orange-500" />
  },
  {
    id: 3,
    name: "Meditation Master",
    description: "Complete 5 meditation sadhanas",
    earned: "2024-02-10",
    icon: <Moon className="h-6 w-6 text-indigo-500" />
  },
  {
    id: 4,
    name: "Community Builder",
    description: "Share your practice with others",
    earned: "2024-02-20",
    icon: <Users className="h-6 w-6 text-purple-500" />
  },
  {
    id: 5,
    name: "Devotion Follower",
    description: "Complete 5 devotion sadhanas",
    earned: "2024-03-05",
    icon: <Heart className="h-6 w-6 text-pink-500" />
  },
  {
    id: 6,
    name: "Study Scholar",
    description: "Complete 5 study sadhanas",
    earned: "2024-03-15",
    icon: <BookOpen className="h-6 w-6 text-yellow-500" />
  }
];

// Mock data for charts (will be replaced with real data)
const mockSadhanaDurationData: SadhanaData[] = [
  { day: 'Mon', duration: 25 },
  { day: 'Tue', duration: 30 },
  { day: 'Wed', duration: 45 },
  { day: 'Thu', duration: 20 },
  { day: 'Fri', duration: 40 },
  { day: 'Sat', duration: 60 },
  { day: 'Sun', duration: 35 }
];

const mockDeityConnectionData: DeityData[] = [
  { name: 'Ganesha', value: 85 },
  { name: 'Shiva', value: 70 },
  { name: 'Durga', value: 60 },
  { name: 'Krishna', value: 45 },
  { name: 'Lakshmi', value: 30 }
];

const mockWeeklyProgress: WeeklyProgress[] = [
  { day: 'Mon', progress: 100 },
  { day: 'Tue', progress: 100 },
  { day: 'Wed', progress: 50 },
  { day: 'Thu', progress: 100 },
  { day: 'Fri', progress: 100 },
  { day: 'Sat', progress: 75 },
  { day: 'Sun', progress: 100 }
];

const mockChakraBalance: ChakraData[] = [
  { name: 'Root', value: 75, color: '#ef4444' },
  { name: 'Sacral', value: 65, color: '#f97316' },
  { name: 'Solar', value: 80, color: '#eab308' },
  { name: 'Heart', value: 90, color: '#22c55e' },
  { name: 'Throat', value: 70, color: '#06b6d4' },
  { name: 'Third Eye', value: 60, color: '#8b5cf6' },
  { name: 'Crown', value: 55, color: '#ec4899' }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { allBadges, earnedBadges } = useBadges();
  const { settings } = useSettings();
  const { profile, isLoading, error, fetchProfile } = useUserProfile();

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Get current theme to adapt colors
  const currentTheme = settings?.appearance?.colorScheme || 'default';

  const handleCopyProfileLink = () => {
    if (profile) {
      navigator.clipboard.writeText(`${window.location.origin}/profile/${profile.display_name.toLowerCase().replace(/\s+/g, '-')}`);
      setCopied(true);
      toast({
        title: "Profile link copied!",
        description: "Share your spiritual journey with others.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getExperienceLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'advanced': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'master': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-fuchsia-900/20 to-pink-900/20 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-5 w-80" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl h-full">
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <Skeleton className="h-8 w-48 mt-4" />
                    <Skeleton className="h-5 w-32 mt-2" />
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-4 w-64 mt-4" />
                    <Skeleton className="h-4 w-56 mt-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl">
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl">
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Skeleton className="h-10 w-32 mx-auto mb-4" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-fuchsia-900/20 to-pink-900/20 p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-md w-full backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              Error Loading Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchProfile} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show profile data when loaded
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-fuchsia-900/20 to-pink-900/20 p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard')}
                className="p-1 -ml-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Spiritual Profile
              </h1>
            </div>
            <p className="text-muted-foreground mt-2">Your journey of divine transformation</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopyProfileLink} className="border-purple-500/20 hover:bg-purple-500/10">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Share Profile'}
            </Button>
            <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-300" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img 
                      src={profile?.avatar_url || "/lovable-uploads/sadhanaboard_logo.png"} 
                      alt={profile?.display_name || "User"} 
                      className="w-24 h-24 rounded-full border-4 border-purple-500/30 shadow-lg object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-background">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mt-4">{profile?.display_name || "Divine Seeker"}</h2>
                  <p className="text-purple-300">
                    {profile?.experience_level 
                      ? `${profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1)} Practitioner` 
                      : "Spiritual Seeker"}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {profile?.experience_level && (
                      <Badge className={getExperienceLevelColor(profile.experience_level)}>
                        {profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1)}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      Level {profile?.level || 1}
                    </Badge>
                    <Badge variant="secondary" className="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30">
                      {profile?.varna ? profile.varna.charAt(0).toUpperCase() + profile.varna.slice(1) : "Seeker"}
                    </Badge>
                  </div>
                  
                  <p className="text-center text-muted-foreground mt-4 text-sm">
                    {profile?.bio || "Walking the path of light, one breath at a time."}
                  </p>
                  
                  <div className="mt-6 w-full">
                    <h3 className="text-lg font-semibold text-center mb-3 text-purple-200">Badges Earned</h3>
                    <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2">
                      {earnedBadges.slice(0, 6).map((badge, index) => (
                        <div key={`${badge.id}-${index}`} className="flex flex-col items-center p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center mb-1">
                            <Award className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs text-center text-purple-200 truncate w-full">{badge.title}</span>
                        </div>
                      ))}
                      {earnedBadges.length === 0 && (
                        <div className="col-span-3 text-center text-muted-foreground text-sm py-4">
                          No badges earned yet. Complete sadhanas to earn badges!
                        </div>
                      )}
                    </div>
                    {earnedBadges.length > 6 && (
                      <div className="text-center text-xs text-purple-300 mt-2">
                        +{earnedBadges.length - 6} more badges
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats & Streak */}
          <motion.div variants={itemVariants} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stats Card */}
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-300" />
                  Spiritual Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Spiritual Points</span>
                    <span className="font-bold text-purple-300">{profile?.spiritual_points || 0} SP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Karma Balance</span>
                    <span className="font-bold text-green-300">{profile?.karma_balance || 0} KP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sankalpa Progress</span>
                    <span className="font-bold text-yellow-300">
                      {profile?.sankalpa_progress !== undefined && profile?.sankalpa_progress !== null 
                        ? Number(profile.sankalpa_progress).toFixed(1) 
                        : '0.0'}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Practice Streak</span>
                    <span className="font-bold text-orange-300">{profile?.daily_streak || 0} days</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-purple-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Spiritual Details</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {profile?.gotra && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Gotra: </span>
                        <span className="text-purple-300">{profile.gotra}</span>
                      </div>
                    )}
                    {profile?.sampradaya && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Sampradaya: </span>
                        <span className="text-purple-300">{profile.sampradaya}</span>
                      </div>
                    )}
                    {profile?.favorite_deity && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Deity: </span>
                        <span className="text-purple-300">{profile.favorite_deity}</span>
                      </div>
                    )}
                    {profile?.location && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Location: </span>
                        <span className="text-purple-300">{profile.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Streak Card */}
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-400" />
                  Practice Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <Flame className="h-5 w-5 text-orange-400" />
                    </motion.div>
                    <span className="text-2xl font-bold text-orange-300">{profile?.daily_streak || 0} days</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Keep the flame burning! Continue your daily practice to maintain your streak.
                  </p>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">This Week</span>
                    <span className="text-purple-300">7/7 days</span>
                  </div>
                  <div className="w-full bg-purple-900/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-300" />
                  Achievements
                </CardTitle>
                <CardDescription>Badges earned on your spiritual journey</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {mockAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.05, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all cursor-pointer relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      <div className="relative z-10">
                        <motion.div 
                          className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 mb-3 shadow-lg"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {achievement.icon}
                        </motion.div>
                        <h3 className="font-semibold text-sm text-center text-purple-100 group-hover:text-white transition-colors duration-300">{achievement.name}</h3>
                        <p className="text-xs text-purple-300 text-center mt-1 group-hover:text-purple-200 transition-colors duration-300">{achievement.earned}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Badge Gallery */}
        <motion.div variants={itemVariants}>
          <BadgeGallery allBadges={allBadges} earnedBadges={earnedBadges.map(b => b.id)} />
        </motion.div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Sadhana Duration Chart */}
          <motion.div variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl h-full overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-300" />
                  Sadhana Duration
                </CardTitle>
                <CardDescription>Minutes per day over the last week</CardDescription>
              </CardHeader>
              <CardContent className="p-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockSadhanaDurationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#7c3aed" strokeOpacity={0.3} />
                    <XAxis dataKey="day" stroke="#c084fc" />
                    <YAxis stroke="#c084fc" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(124, 58, 237, 0.2)', 
                        borderColor: '#7c3aed',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '0.75rem'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="duration" 
                      stroke="#a855f7" 
                      fill="url(#areaGradient)"
                      strokeWidth={2}
                      activeDot={{ r: 8, fill: '#c084fc' }}
                    />
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Progress Chart */}
          <motion.div variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl h-full overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-300" />
                  Weekly Progress
                </CardTitle>
                <CardDescription>Your sadhana consistency over the week</CardDescription>
              </CardHeader>
              <CardContent className="p-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockWeeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#7c3aed" strokeOpacity={0.3} />
                    <XAxis dataKey="day" stroke="#c084fc" />
                    <YAxis stroke="#c084fc" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(124, 58, 237, 0.2)', 
                        borderColor: '#7c3aed',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '0.75rem'
                      }} 
                    />
                    <Bar 
                      dataKey="progress" 
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                      activeBar={{ fill: 'url(#barGradient)', stroke: '#c084fc', strokeWidth: 2 }}
                    >
                      {mockWeeklyProgress.map((entry, index) => (
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
          </motion.div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Chakra Balance - Coming Soon */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-300" />
                  Chakra Balance
                </CardTitle>
                <CardDescription>Your energy center alignment</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex flex-col items-center justify-center h-64">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-purple-200 mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground text-sm">
                    Experience the full chakra visualization and balancing features in our upcoming update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Energy Level Section */}
          <motion.div variants={itemVariants}>
            <Card className={`backdrop-blur-xl rounded-2xl shadow-xl h-full ${
              currentTheme === 'tara' 
                ? 'bg-gradient-to-br from-blue-950/10 to-indigo-950/10 border border-blue-500/20' 
                : 'bg-gradient-to-br from-yellow-600/10 to-orange-500/10 border border-yellow-500/20'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className={`h-5 w-5 ${
                    currentTheme === 'tara' ? 'text-blue-300' : 'text-yellow-300'
                  }`} />
                  Energy Level
                </CardTitle>
                <CardDescription>Your current guna balance (Sattva, Rajas, Tamas)</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`text-center p-3 rounded-lg border ${
                      currentTheme === 'tara' 
                        ? 'bg-green-950/10 border-green-500/20' 
                        : 'bg-green-500/10 border-green-500/20'
                    }`}>
                      <div className={`text-xl font-bold ${
                        currentTheme === 'tara' ? 'text-green-300' : 'text-green-400'
                      }`}>{profile?.energy_balance?.sattva || 33}%</div>
                      <div className={`text-xs ${
                        currentTheme === 'tara' ? 'text-green-400' : 'text-green-300'
                      }`}>Sattva</div>
                    </div>
                    <div className={`text-center p-3 rounded-lg border ${
                      currentTheme === 'tara' 
                        ? 'bg-orange-950/10 border-orange-500/20' 
                        : 'bg-orange-500/10 border-orange-500/20'
                    }`}>
                      <div className={`text-xl font-bold ${
                        currentTheme === 'tara' ? 'text-orange-300' : 'text-orange-400'
                      }`}>{profile?.energy_balance?.rajas || 33}%</div>
                      <div className={`text-xs ${
                        currentTheme === 'tara' ? 'text-orange-400' : 'text-orange-300'
                      }`}>Rajas</div>
                    </div>
                    <div className={`text-center p-3 rounded-lg border ${
                      currentTheme === 'tara' 
                        ? 'bg-red-950/10 border-red-500/20' 
                        : 'bg-red-500/10 border-red-500/20'
                    }`}>
                      <div className={`text-xl font-bold ${
                        currentTheme === 'tara' ? 'text-red-300' : 'text-red-400'
                      }`}>{profile?.energy_balance?.tamas || 34}%</div>
                      <div className={`text-xs ${
                        currentTheme === 'tara' ? 'text-red-400' : 'text-red-300'
                      }`}>Tamas</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/energy-level')}
                    className={`w-full ${
                      currentTheme === 'tara' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                    }`}
                  >
                    View Detailed Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bio & Spiritual Details */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-purple-300" />
                  Spiritual Journey
                </CardTitle>
                <CardDescription>About your path and practices</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Compass className="h-4 w-4 text-purple-400" />
                      Spiritual Background
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <span className="text-sm text-muted-foreground">Varna</span>
                        <span className="text-sm font-medium">
                          {profile?.varna ? profile.varna.charAt(0).toUpperCase() + profile.varna.slice(1) : "Not specified"} 🙏
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <span className="text-sm text-muted-foreground">Gotra</span>
                        <span className="text-sm font-medium">
                          {profile?.gotra || "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <span className="text-sm text-muted-foreground">Sampradaya</span>
                        <span className="text-sm font-medium">
                          {profile?.sampradaya ? profile.sampradaya.charAt(0).toUpperCase() + profile.sampradaya.slice(1) : "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <span className="text-sm text-muted-foreground">Favorite Mantra</span>
                        <span className="text-sm font-medium text-purple-300">
                          {profile?.favorite_deity ? `Om ${profile.favorite_deity} Namaha` : "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-400" />
                      Deity Connections
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mockDeityConnectionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {mockDeityConnectionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'][index % 5]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(124, 58, 237, 0.2)', 
                              borderColor: '#7c3aed',
                              backdropFilter: 'blur(10px)',
                              borderRadius: '0.75rem'
                            }} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={isEditing} onClose={() => setIsEditing(false)} />
    </div>
  );
};

export default ProfilePage;