import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Flame, 
  BookText, 
  Compass,
  Sparkles,
  Heart,
  Leaf,
  Mountain,
  Star,
  Crown,
  Zap,
  Shield,
  Sword,
  Moon,
  Sun,
  Waves,
  TreePine,
  Gem
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useDefaultThemeStyles } from '@/hooks/useDefaultThemeStyles';
import type { StoreSadhana } from '@/types/store';

type Category = 'sadhanas' | 'texts' | 'journeys';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface DataItem {
  id: number;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  duration: number;
  deity?: string;
  benefits: string[];
  practices: string[];
  genre: {
    name: string;
    icon: React.ReactNode;
  };
}

const DATA = (): DataItem[] => [
  // Sadhanas
  {
    id: 1,
    title: "Dawn Awakening Sadhana",
    description: "Begin each day with purpose through this transformative morning practice that connects you with the rising sun's energy.",
    category: 'sadhanas',
    difficulty: 'Beginner',
    duration: 21,
    deity: "Surya (Sun God)",
    benefits: ["Increased energy", "Mental clarity", "Spiritual awakening"],
    practices: ["Sun salutations", "Breath of fire", "Gratitude meditation"],
    genre: {
      name: "Solar",
      icon: <Sun className="h-5 w-5 text-amber-500" />
    }
  },
  {
    id: 2,
    title: "Lunar Intuitive Sadhana",
    description: "Harness the moon's mystical energy to deepen your intuition and connect with your inner wisdom during the night hours.",
    category: 'sadhanas',
    difficulty: 'Intermediate',
    duration: 40,
    deity: "Chandra (Moon God)",
    benefits: ["Enhanced intuition", "Emotional balance", "Dream work"],
    practices: ["Moon gazing", "Intuitive journaling", "Lunar cycle tracking"],
    genre: {
      name: "Lunar",
      icon: <Moon className="h-5 w-5 text-indigo-400" />
    }
  },
  {
    id: 3,
    title: "Divine Feminine Awakening",
    description: "Awaken the sacred feminine energy within through practices dedicated to the goddess in her many forms.",
    category: 'sadhanas',
    difficulty: 'Advanced',
    duration: 108,
    deity: "Devi (Divine Mother)",
    benefits: ["Sacred feminine empowerment", "Creative awakening", "Inner strength"],
    practices: ["Goddess mantras", "Sacred dance", "Tantric breathing"],
    genre: {
      name: "Divine Feminine",
      icon: <Crown className="h-5 w-5 text-pink-500" />
    }
  },
  {
    id: 4,
    title: "Warrior's Path Sadhana",
    description: "Cultivate inner strength and courage through disciplined practices that forge your spiritual warrior spirit.",
    category: 'sadhanas',
    difficulty: 'Intermediate',
    duration: 40,
    deity: "Durga",
    benefits: ["Inner strength", "Courage", "Discipline"],
    practices: ["Strength training", "Warrior affirmations", "Fire ceremonies"],
    genre: {
      name: "Warrior",
      icon: <Sword className="h-5 w-5 text-red-500" />
    }
  },
  {
    id: 5,
    title: "Heart Opening Sadhana",
    description: "Open your heart to unconditional love through practices that dissolve barriers and foster deep compassion.",
    category: 'sadhanas',
    difficulty: 'Beginner',
    duration: 21,
    deity: "Ananda (Bliss)",
    benefits: ["Unconditional love", "Compassion", "Heart healing"],
    practices: ["Loving-kindness meditation", "Heart-opening yoga", "Devotional singing"],
    genre: {
      name: "Heart-Centered",
      icon: <Heart className="h-5 w-5 text-rose-500" />
    }
  },
  
  // Holy Texts
  {
    id: 6,
    title: "Bhagavad Gita Study Path",
    description: "A comprehensive 40-day journey through the sacred teachings of the Bhagavad Gita with daily reflections.",
    category: 'texts',
    difficulty: 'Intermediate',
    duration: 40,
    deity: "Krishna",
    benefits: ["Spiritual wisdom", "Life guidance", "Philosophical understanding"],
    practices: ["Daily chapter study", "Reflection journaling", "Discussion groups"],
    genre: {
      name: "Wisdom",
      icon: <Gem className="h-5 w-5 text-yellow-500" />
    }
  },
  {
    id: 7,
    title: "Divine Comedy Pilgrimage",
    description: "Navigate the spiritual journey from darkness to light through Dante's masterpiece with guided meditations.",
    category: 'texts',
    difficulty: 'Advanced',
    duration: 90,
    deity: "Divine Love",
    benefits: ["Spiritual transformation", "Literary appreciation", "Mystical insight"],
    practices: ["Canticle reading", "Visualization exercises", "Contemplative prayer"],
    genre: {
      name: "Mystical Literature",
      icon: <Star className="h-5 w-5 text-purple-500" />
    }
  },
  
  // Guided Journeys
  {
    id: 8,
    title: "Himalayan Spiritual Trek",
    description: "Embark on a virtual pilgrimage through the sacred peaks of the Himalayas with guided meditations and teachings.",
    category: 'journeys',
    difficulty: 'Intermediate',
    duration: 21,
    deity: "Shiva",
    benefits: ["Mountain energy", "Spiritual elevation", "Inner peace"],
    practices: ["Mountain meditation", "Breath work", "Sacred geography study"],
    genre: {
      name: "Pilgrimage",
      icon: <Mountain className="h-5 w-5 text-blue-400" />
    }
  },
  {
    id: 9,
    title: "Amazon Rainforest Connection",
    description: "Connect with the ancient wisdom of the rainforest through shamanic practices and plant spirit medicine.",
    category: 'journeys',
    difficulty: 'Advanced',
    duration: 40,
    deity: "Pachamama (Mother Earth)",
    benefits: ["Earth connection", "Plant spirit communication", "Ecological awareness"],
    practices: ["Forest bathing", "Plant meditation", "Drum journeying"],
    genre: {
      name: "Earth-Based",
      icon: <TreePine className="h-5 w-5 text-green-600" />
    }
  }
];

const CosmicLibraryShowcase: React.FC = () => {
  const [active, setActive] = useState<Category>('sadhanas');
  const [hovered, setHovered] = useState<number | null>(null);
  const items = useMemo(() => DATA(), []);
  const { settings } = useSettings();
  const { isDefaultTheme, defaultThemeClasses } = useDefaultThemeStyles();
  
  // Check if default theme is active (kept for backward compatibility)
  const isDefaultThemeCheck = settings?.appearance?.colorScheme === 'default';

  const filtered = items.filter(i => i.category === active);

  const difficultyColors: Record<Difficulty, string> = {
    Beginner: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700',
    Intermediate: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700',
    Advanced: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700'
  };

  const categoryIcons = {
    sadhanas: <Flame className="h-5 w-5" />,
    texts: <BookText className="h-5 w-5" />,
    journeys: <Compass className="h-5 w-5" />
  };

  const categoryLabels = {
    sadhanas: 'Sacred Practices',
    texts: 'Holy Texts',
    journeys: 'Guided Journeys'
  };

  return (
    <section aria-labelledby="cosmic-library-title" className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-lg ${isDefaultTheme ? defaultThemeClasses.borderedContainer : 'bg-background/70 border border-primary/20'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 id="cosmic-library-title" className={`text-3xl font-bold mb-2 ${isDefaultTheme ? defaultThemeClasses.primaryText : 'text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary'}`}>
            Cosmic Library
          </h2>
          <p className={`text-lg ${isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-muted-foreground'}`}>
            Explore curated spiritual practices, sacred texts, and transformative journeys
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className={`inline-flex p-1 rounded-lg ${isDefaultTheme ? 'bg-white/10' : 'bg-secondary/30'}`}>
            {(['sadhanas', 'texts', 'journeys'] as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => setActive(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  active === category 
                    ? `${isDefaultTheme ? 'bg-white/20 text-[hsl(var(--accent))]' : 'bg-primary text-primary-foreground'} shadow-sm` 
                    : `${isDefaultTheme ? 'text-[hsl(var(--accent))] hover:text-white' : 'text-muted-foreground hover:text-foreground'} hover:bg-secondary/20`
                }`}
              >
                {categoryIcons[category]}
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card 
              key={item.id}
              className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                isDefaultTheme 
                  ? `${defaultThemeClasses.borderedContainer} hover:shadow-lg hover:shadow-[hsl(var(--accent))]/20` 
                  : 'border-primary/20 hover:shadow-lg hover:shadow-primary/20'
              }`}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${isDefaultTheme ? 'from-[hsl(var(--accent))]/10 to-[hsl(var(--accent))]/5' : 'from-primary/5 to-secondary/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
              
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${isDefaultTheme ? 'bg-[hsl(var(--accent))]/20' : 'bg-primary/10'} text-primary`}>
                    {item.genre.icon}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={difficultyColors[item.difficulty]}
                  >
                    {item.difficulty}
                  </Badge>
                </div>

                <h3 className={`font-bold text-lg mb-2 ${isDefaultTheme ? defaultThemeClasses.primaryText : 'text-foreground'}`}>
                  {item.title}
                </h3>
                
                <p className={`text-sm mb-4 line-clamp-2 ${isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-muted-foreground'}`}>
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge 
                    variant="outline" 
                    className={`${isDefaultTheme ? 'border-white/30 text-[hsl(var(--accent))]' : 'border-primary/30 text-primary'}`}
                  >
                    {item.duration} days
                  </Badge>
                  {item.deity && (
                    <Badge 
                      variant="outline" 
                      className={`${isDefaultTheme ? 'border-white/30 text-[hsl(var(--accent))]' : 'border-secondary/30 text-secondary-foreground'}`}
                    >
                      {item.deity}
                    </Badge>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className={`text-xs font-semibold mb-2 uppercase tracking-wider ${isDefaultTheme ? defaultThemeClasses.accentText : 'text-primary'}`}>
                    Key Benefits
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {item.benefits.slice(0, 3).map((benefit, index) => (
                      <span 
                        key={index} 
                        className={`text-xs px-2 py-1 rounded-full ${isDefaultTheme ? 'bg-white/10 text-[hsl(var(--accent))]' : 'bg-secondary/30 text-secondary-foreground'}`}
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <Button 
                  size="sm" 
                  className={`w-full group ${isDefaultTheme ? defaultThemeClasses.primaryButton : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
                >
                  <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                  Explore {item.category === 'sadhanas' ? 'Practice' : item.category === 'texts' ? 'Text' : 'Journey'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CosmicLibraryShowcase;