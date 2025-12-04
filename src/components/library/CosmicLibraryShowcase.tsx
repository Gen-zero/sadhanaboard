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
  Gem
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useDefaultThemeStyles } from '@/hooks/useDefaultThemeStyles';
import type { StoreSadhana } from '@/types/store';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';

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
    title: "Surya Arghya Sadhana",
    description: "Offer dawn arghya to Surya with Gayatri japa and Surya Namaskar, aligning prana with the rising light (as taught in sandhya vandanam).",
    category: 'sadhanas',
    difficulty: 'Beginner',
    duration: 21,
    deity: "Surya",
    benefits: ["Ojas and vitality", "Clarity of buddhi", "Steady daily rhythm"],
    practices: ["Surya Namaskar", "Gayatri japa (108)", "Arghya at sunrise"],
    genre: {
      name: "Solar",
      icon: <Sun className="h-5 w-5 text-amber-500" />
    }
  },
  {
    id: 2,
    title: "Chandra Manas Dhyana",
    description: "Cooling night practice drawing on soma; steady the mind with Chandra bija japa, trataka on moonlight, and nadi shuddhi.",
    category: 'sadhanas',
    difficulty: 'Intermediate',
    duration: 30,
    deity: "Chandra",
    benefits: ["Emotional equanimity", "Restful sleep", "Refined intuition"],
    practices: ["Chandra bija japa (Shaam)", "Trataka on the moon", "Anulom-vilom (11 cycles)"],
    genre: {
      name: "Lunar",
      icon: <Moon className="h-5 w-5 text-indigo-400" />
    }
  },
  {
    id: 3,
    title: "Sri Devi Upasana",
    description: "Tripura Sundari-centered worship with Lalita Sahasranama parayana, kumkum archana, and quiet meditation on Sri Chakra.",
    category: 'sadhanas',
    difficulty: 'Advanced',
    duration: 108,
    deity: "Mahadevi (Tripura Sundari)",
    benefits: ["Deep bhakti", "Inner radiance (tejas)", "Steady shakti flow"],
    practices: ["Lalita Sahasranama", "Kumkum archana", "Sri Chakra dhyana"],
    genre: {
      name: "Sri Vidya",
      icon: <Crown className="h-5 w-5 text-pink-500" />
    }
  },
  {
    id: 4,
    title: "Navarna Durga Sadhana",
    description: "Invoke Maa Durga through the Navarna mantra with kavacha recitation and agni upasana to build shakti and protection.",
    category: 'sadhanas',
    difficulty: 'Intermediate',
    duration: 40,
    deity: "Durga",
    benefits: ["Inner courage", "Energetic protection", "Disciplined tapas"],
    practices: ["Om Aim Hreem Kleem Chamundaye Viche japa", "Durga Kavacham", "Weekly homa offering"],
    genre: {
      name: "Shakti",
      icon: <Sword className="h-5 w-5 text-red-500" />
    }
  },
  {
    id: 5,
    title: "Anahata Bhakti Sadhana",
    description: "Soft devotional current rooted in Ram-bhakti and Hanuman seva; daily kirtan, stotra chanting, and seva journaling.",
    category: 'sadhanas',
    difficulty: 'Beginner',
    duration: 21,
    deity: "Sri Rama & Hanuman",
    benefits: ["Loving devotion", "Humility", "Serviceful living"],
    practices: ["Hanuman Chalisa", "Rama nama japa", "Evening kirtan & seva notes"],
    genre: {
      name: "Bhakti",
      icon: <Heart className="h-5 w-5 text-rose-500" />
    }
  },
  
  // Holy Texts
  {
    id: 6,
    title: "Bhagavad Gita Adhyayana",
    description: "Structured 18-chapter parayana with daily shloka chanting, brief bhashya notes (Shankara), and nishkama karma contemplation.",
    category: 'texts',
    difficulty: 'Intermediate',
    duration: 40,
    deity: "Krishna",
    benefits: ["Dharma clarity", "Steady viveka", "Devotional insight"],
    practices: ["Daily shloka chanting", "Svadhyaya journal", "Gita dhyana shloka"],
    genre: {
      name: "Wisdom",
      icon: <Gem className="h-5 w-5 text-yellow-500" />
    }
  },
  {
    id: 7,
    title: "Yoga Sutra Svadhyaya",
    description: "Patanjali's sutras chanted in Sanskrit with focus on abhyasa–vairagya, Ishvara pranidhana, and eight-limbed integration.",
    category: 'texts',
    difficulty: 'Advanced',
    duration: 56,
    deity: "Maharishi Patanjali",
    benefits: ["Steady mind (sthira chitta)", "Clear discernment", "Rooted sadhana map"],
    practices: ["Sutra chanting", "Abhyasa-vairagya notes", "Pranayama & dharana log"],
    genre: {
      name: "Raja Yoga",
      icon: <Star className="h-5 w-5 text-purple-500" />
    }
  },
  
  // Guided Journeys
  {
    id: 8,
    title: "Kedar-Badri Yatra (Virtual)",
    description: "Guided visualization of the Himalayas with stotras to Kedarnath and Badrinath; pair breath with mantras at each sacred stop.",
    category: 'journeys',
    difficulty: 'Intermediate',
    duration: 21,
    deity: "Shiva",
    benefits: ["Pilgrimage bhava", "Reverence for sacred geography", "Inner stillness"],
    practices: ["Shiva Panchakshari japa", "Himalayan visualization", "Tirtha stotra listening"],
    genre: {
      name: "Pilgrimage",
      icon: <Mountain className="h-5 w-5 text-blue-400" />
    }
  },
  {
    id: 9,
    title: "Kashi Panchakroshi Parikrama",
    description: "Walk (virtually) the 25-kos route around Kashi with Ganga stuti, Vishwanath manasa darshan, and nightly deepa dana sankalpa.",
    category: 'journeys',
    difficulty: 'Advanced',
    duration: 40,
    deity: "Shiva (Vishwanath)",
    benefits: ["Tirtha samskara", "Bhakti refinement", "Sense of sanctity"],
    practices: ["Ganga aarti chanting", "Manasa parikrama mapping", "Nightly dipa dana note"],
    genre: {
      name: "Tirtha",
      icon: <Waves className="h-5 w-5 text-green-600" />
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

  const { ref: sectionRef, isVisible } = useScrollTrigger({ threshold: 0.2 });

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-labelledby="cosmic-library-title"
      className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-lg ${isDefaultTheme ? defaultThemeClasses.borderedContainer : 'bg-background/70 border border-primary/20'}`}
    >
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

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-rise-in ${isVisible ? 'visible' : ''}`}>
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
