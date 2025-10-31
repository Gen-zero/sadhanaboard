import { useState } from 'react';
// @ts-expect-error - framer-motion types issue
import { motion } from 'framer-motion';
import { Badge as BadgeType } from '@/types/badges';
import { 
  Flame, 
  Award, 
  Star, 
  Zap, 
  Heart, 
  BookOpen, 
  Users, 
  Sparkles,
  EyeOff,
  Lock,
  Hand,
  Skull,
  Footprints,
  Calendar,
  Target,
  Mountain,
  Crown,
  Sun,
  Moon,
  Leaf,
  Compass,
  Clock,
  TrendingUp,
  Shield,
  Sword,
  Gem,
  Lightbulb,
  Music,
  MessageCircle,
  Share2,
  Gift,
  Trophy,
  Medal,
  Flag,
  Infinity as InfinityIcon,
  Eye,
  Cloud,
  Wind,
  Droplets,
  Map,
  Navigation,
  Anchor,
  Feather,
  Palette,
  Camera,
  Video,
  Mic,
  Play,
  Pause,
  Volume2,
  Radio,
  Wifi,
  Bluetooth,
  Battery,
  Power,
  Zap as Lightning,
  Thermometer,
  Waves,
  Sunset,
  Sunrise,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudOff,
  Cloudy,
  Tornado,
  Umbrella,
  Snowflake,
  Wind as WindIcon,
  Waves as WavesIcon,
  Sunset as SunsetIcon,
  Sunrise as SunriseIcon,
  Dumbbell,
  HeartHandshake,
  Sprout
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BadgeGalleryProps {
  allBadges: BadgeType[];
  earnedBadges: string[];
}

// Hinglish translations for badge names
const badgeHinglishTranslations: Record<string, string> = {
  // Consistency & Devotion Badges
  'Nitya Sādhaka': 'Nitya Sādhaka (Regular Practitioner)',
  'Ananya Bhakta': 'Ananya Bhakta (Devoted Worshipper)',
  'Sankalpa Shakti': 'Sankalpa Shakti (Power of Intention)',
  'Aparājita': 'Aparājita (Unconquerable)',
  'Ekāgratā': 'Ekāgratā (Single-pointed Focus)',
  
  // Discipline & Tapasya Badges
  'Kālī’s Flame': 'Kālī\'s Flame (Intensity)',
  'Tapasvī': 'Tapasvī (Austere Practitioner)',
  'Mouna Ratna': 'Mouna Ratna (Silence Jewel)',
  'Agni Vratī': 'Agni Vratī (Fire Vow)',
  
  // Bhakti & Emotional Depth Badges
  'Viraha Jñānī': 'Viraha Jñānī (Knowledge of Separation)',
  'Prem Bhakta': 'Prem Bhakta (Loving Devotee)',
  'Rasa Sāgara': 'Rasa Sāgara (Ocean of Emotion)',
  'Śaraṇāgata': 'Śaraṇāgata (Surrendered)',
  
  // Knowledge & Wisdom Badges
  'Śāstra Vidyārthī': 'Śāstra Vidyārthī (Scripture Student)',
  'Mantra Master': 'Mantra Master (Chanting Expert)',
  'Jnana Jyoti': 'Jnana Jyoti (Light of Knowledge)',
  'Sādhana Scholar': 'Sādhana Scholar (Practice Scholar)',
  
  // Community & Service Badges
  'Seva Dhārī': 'Seva Dhārī (Service Holder)',
  'Anukampā': 'Anukampā (Compassion)',
  'Satsangī': 'Satsangī (Good Company)',
  'Guru Bhakta': 'Guru Bhakta (Devotee of Guru)',
  
  // Divine Realization & Milestone Badges
  'Antarjyoti': 'Antarjyoti (Inner Light)',
  'Mahā Siddha': 'Mahā Siddha (Great Accomplished)',
  'Kālī Anugraha': 'Kālī Anugraha (Kālī\'s Blessing)',
  'Mokṣa Margī': 'Mokṣa Margī (Path to Liberation)',
  
  // Hidden / Mystery Badges
  'Śūnya Dṛṣṭi': 'Śūnya Dṛṣṭi (Vision of Emptiness)',
  'Kālī\'s Whisper': 'Kālī\'s Whisper (Divine Communication)',
  'Gupta Bhakta': 'Gupta Bhakta (Secret Devotee)',
  'Ananta Loop': 'Ananta Loop (Infinite Cycle)',
  
  // Existing badges
  'First Steps': 'First Steps (Beginner)',
  'Dedicated Practitioner': 'Dedicated Practitioner (Committed)',
  'Spiritual Journey': 'Spiritual Journey (Path)',
  'Devoted Seeker': 'Devoted Seeker (Dedicated)',
  'Spiritual Master': 'Spiritual Master (Advanced)',
  'Week of Discipline': 'Week of Discipline (7 Days)',
  'Month of Dedication': 'Month of Dedication (30 Days)',
  'Centurion of Spirit': 'Centurion of Spirit (100 Days)',
  'Awakening': 'Awakening (Level 5)',
  'Illumination': 'Illumination (Level 10)',
  'Transcendence': 'Transcendence (Level 20)',
  'Meditation Master': 'Meditation Master (5 Sessions)',
  'Yoga Practitioner': 'Yoga Practitioner (5 Sessions)',
  'Mantra Devotee': 'Mantra Devotee (5 Sessions)',
  'Study Scholar': 'Study Scholar (5 Sessions)',
  'Devotion Follower': 'Devotion Follower (5 Sessions)'
};

const getBadgeIcon = (iconName: string) => {
  switch (iconName) {
    // Consistency & Devotion Badges
    case ' diyā': return <Flame className="h-6 w-6 text-orange-400" />;
    case ' silver-aura': return <Star className="h-6 w-6 text-gray-300" />;
    case ' trishul': return <Zap className="h-6 w-6 text-red-500" />;
    case ' radiant-crown': return <Crown className="h-6 w-6 text-yellow-400" />;
    case ' rising-sun': return <Sunrise className="h-6 w-6 text-orange-300" />;
    case ' red-black-flame': return <Flame className="h-6 w-6 text-red-600" />;
    case ' glowing-rudraksha': return <Gem className="h-6 w-6 text-amber-500" />;
    case ' blue-lotus': return <Sparkles className="h-6 w-6 text-blue-400" />;
    case ' burning-altar': return <Flame className="h-6 w-6 text-orange-600" />;
    case ' teardrop-gem': return <Gem className="h-6 w-6 text-primary" />;
    case ' heart-light': return <Heart className="h-6 w-6 text-pink-400" />;
    case ' flowing-water': return <WavesIcon className="h-6 w-6 text-blue-300" />;
    case ' open-palm': return <Hand className="h-6 w-6 text-amber-400" />;
    case ' open-grantha': return <BookOpen className="h-6 w-6 text-yellow-500" />;
    case ' glowing-akṣara': return <Sparkles className="h-6 w-6 text-indigo-400" />;
    case ' lamp-circles': return <Sparkles className="h-6 w-6 text-yellow-300" />;
    case ' pen-script': return <BookOpen className="h-6 w-6 text-emerald-400" />;
    case ' joined-hands': return <Users className="h-6 w-6 text-pink-300" />;
    case ' glowing-heart': return <Heart className="h-6 w-6 text-red-300" />;
    case ' circle-devotees': return <Users className="h-6 w-6 text-primary" />;
    case ' flame-feet': return <Footprints className="h-6 w-6 text-orange-500" />;
    case ' inner-light': return <Sparkles className="h-6 w-6 text-yellow-200" />;
    case ' yantra-bloom': return <Sparkles className="h-6 w-6 text-primary" />;
    case ' skull-garland': return <Skull className="h-6 w-6 text-red-700" />;
    case ' expanding-mandala': return <InfinityIcon className="h-6 w-6 text-white" />;
    case ' void-glow': return <EyeOff className="h-6 w-6 text-gray-500" />;
    case ' dark-fractal': return <Lock className="h-6 w-6 text-primary/80" />;
    case ' hidden-moon': return <Moon className="h-6 w-6 text-blue-200" />;
    case ' ouroboros': return <InfinityIcon className="h-6 w-6 text-green-600" />;
    
    // Existing badges
    case '👣': return <Footprints className="h-6 w-6 text-purple-400" />;
    case '🧘': return <Leaf className="h-6 w-6 text-green-400" />;
    case '🕉️': return <Compass className="h-6 w-6 text-indigo-400" />;
    case '🔥': return <Flame className="h-6 w-6 text-orange-500" />;
    case '🌟': return <Star className="h-6 w-6 text-yellow-400" />;
    case '📅': return <Calendar className="h-6 w-6 text-blue-400" />;
    case '🌙': return <Moon className="h-6 w-6 text-indigo-300" />;
    case '💯': return <Trophy className="h-6 w-6 text-red-400" />;
    case '⭐': return <Star className="h-6 w-6 text-yellow-300" />;
    case '✨': return <Sparkles className="h-6 w-6 text-pink-300" />;
    case '🔮': return <Gem className="h-6 w-6 text-primary" />;
    case '🧘‍♂️': return <Leaf className="h-6 w-6 text-green-500" />;
    case '🧘‍♀️': return <Leaf className="h-6 w-6 text-teal-400" />;
    case '📿': return <Music className="h-6 w-6 text-amber-500" />;
    case '📚': return <BookOpen className="h-6 w-6 text-blue-500" />;
    case '❤️': return <Heart className="h-6 w-6 text-red-400" />;
    
    default: return <Award className="h-6 w-6 text-purple-400" />;
  }
};

const getTierColor = (tier: number | undefined) => {
  switch (tier) {
    case 1: return 'from-gray-300 to-gray-500'; // Silver
    case 2: return 'from-yellow-300 to-yellow-500'; // Gold
    case 3: return 'from-red-600 to-yellow-600'; // Red-Gold
    case 4: return 'from-black to-yellow-700'; // Black-Gold glow
    default: return 'from-purple-500 to-fuchsia-500';
  }
};

const getTierName = (tier: number | undefined) => {
  switch (tier) {
    case 1: return 'Initiate';
    case 2: return 'Adept';
    case 3: return 'Master';
    case 4: return 'Divine';
    default: return '';
  }
};

const BadgeGallery: React.FC<BadgeGalleryProps> = ({ allBadges, earnedBadges }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Define the new categories
  const categories = ['yoga', 'discipline', 'bhakti'];
  
  // Group badges by the new categories
  const badgesByCategory: Record<string, BadgeType[]> = {};
  categories.forEach(category => {
    badgesByCategory[category] = allBadges.filter(badge => badge.category === category);
  });
  
  return (
    <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-purple-300" />
          Badge Collection
        </CardTitle>
        <CardDescription>Earn badges on your spiritual journey</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge 
            // @ts-expect-error - variant prop type issue
            variant={activeCategory === null ? "default" : "secondary"} 
            className="cursor-pointer hover:bg-purple-500/30"
            onClick={() => setActiveCategory(null)}
          >
            All Badges
          </Badge>
          <Badge 
            // @ts-expect-error - variant prop type issue
            variant={activeCategory === 'yoga' ? "default" : "secondary"} 
            className="cursor-pointer hover:bg-purple-500/30 capitalize"
            onClick={() => setActiveCategory('yoga')}
          >
            <Sprout className="h-4 w-4 mr-1 inline" />
            Yoga
          </Badge>
          <Badge 
            // @ts-expect-error - variant prop type issue
            variant={activeCategory === 'discipline' ? "default" : "secondary"} 
            className="cursor-pointer hover:bg-purple-500/30 capitalize"
            onClick={() => setActiveCategory('discipline')}
          >
            <Dumbbell className="h-4 w-4 mr-1 inline" />
            Discipline
          </Badge>
          <Badge 
            // @ts-expect-error - variant prop type issue
            variant={activeCategory === 'bhakti' ? "default" : "secondary"} 
            className="cursor-pointer hover:bg-purple-500/30 capitalize"
            onClick={() => setActiveCategory('bhakti')}
          >
            <HeartHandshake className="h-4 w-4 mr-1 inline" />
            Bhakti & Mantra Japa
          </Badge>
        </div>
        
        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allBadges
            .filter(badge => activeCategory === null || badge.category === activeCategory)
            .map((badge, index) => {
              const isEarned = earnedBadges.includes(badge.id);
              const tierColor = getTierColor(badge.tier);
              // Always show Hinglish translations now that the button is removed
              const displayName = badgeHinglishTranslations[badge.title] 
                ? badgeHinglishTranslations[badge.title] 
                : badge.title;
              
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -10, scale: 1.05, zIndex: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                    isEarned 
                      ? `bg-gradient-to-br ${tierColor} border-purple-500/50` 
                      : 'bg-gray-800/50 border-gray-700/50'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tierColor} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl`}></div>
                  <div className="relative z-10">
                    <motion.div 
                      className={`p-3 rounded-full mb-3 shadow-lg flex items-center justify-center ${
                        isEarned 
                          ? 'bg-white/20' 
                          : 'bg-gray-700/50'
                      }`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {getBadgeIcon(badge.icon)}
                    </motion.div>
                    <h3 className={`font-semibold text-sm text-center transition-colors duration-300 ${
                      isEarned 
                        ? 'text-white group-hover:text-yellow-100' 
                        : 'text-gray-400'
                    }`}>
                      {displayName}
                      {badge.tier && (
                        <span className="block text-xs mt-1">
                          {getTierName(badge.tier)}
                        </span>
                      )}
                    </h3>
                    <p className={`text-xs text-center mt-1 transition-colors duration-300 ${
                      isEarned 
                        ? 'text-gray-200 group-hover:text-white' 
                        : 'text-gray-500'
                    }`}>
                      {badge.description}
                    </p>
                    {isEarned ? (
                      <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30">
                        Earned
                      </Badge>
                    ) : (
                      <Badge className="mt-2 bg-gray-700/50 text-gray-400 border-gray-600/30">
                        Locked
                      </Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
        </div>
        
        {/* Progress Summary */}
        <div className="mt-8 pt-6 border-t border-purple-500/20">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Collection Progress</h3>
            {/* @ts-expect-error - variant prop type issue */}
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {earnedBadges.length} / {allBadges.length} Badges
            </Badge>
          </div>
          <div className="mt-2 w-full bg-gray-800 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-2.5 rounded-full" 
              style={{ width: `${(earnedBadges.length / allBadges.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeGallery;