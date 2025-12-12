import React, { useState, useMemo } from 'react';
import {
  Flame,
  BookText,
  Compass,
  Sparkles,
  Heart,
  Mountain,
  Star,
  Crown,
  Sun,
  Moon,
  Waves,
  Gem,
  Sword,
  ArrowRight,
  Hexagon
} from 'lucide-react';
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
    description: "Offer dawn arghya to Surya with Gayatri japa and Surya Namaskar, aligning prana with the rising light.",
    category: 'sadhanas',
    difficulty: 'Beginner',
    duration: 21,
    deity: "Surya",
    benefits: ["Ojas and vitality", "Clarity of buddhi", "Steady daily rhythm"],
    practices: ["Surya Namaskar", "Gayatri japa (108)", "Arghya at sunrise"],
    genre: { name: "Solar", icon: <Sun className="h-5 w-5" /> }
  },
  {
    id: 2,
    title: "Chandra Manas Dhyana",
    description: "Cooling night practice drawing on soma; steady the mind with Chandra bija japa and trataka on moonlight.",
    category: 'sadhanas',
    difficulty: 'Intermediate',
    duration: 30,
    deity: "Chandra",
    benefits: ["Emotional equanimity", "Restful sleep", "Refined intuition"],
    practices: ["Chandra bija japa", "Trataka on moon", "Anulom-vilom"],
    genre: { name: "Lunar", icon: <Moon className="h-5 w-5" /> }
  },
  {
    id: 3,
    title: "Sri Devi Upasana",
    description: "Tripura Sundari-centered worship with Lalita Sahasranama parayana and meditation on Sri Chakra.",
    category: 'sadhanas',
    difficulty: 'Advanced',
    duration: 108,
    deity: "Mahadevi",
    benefits: ["Deep bhakti", "Inner radiance", "Steady shakti flow"],
    practices: ["Lalita Sahasranama", "Kumkum archana", "Sri Chakra dhyana"],
    genre: { name: "Sri Vidya", icon: <Crown className="h-5 w-5" /> }
  },
  {
    id: 4,
    title: "Navarna Durga Sadhana",
    description: "Invoke Maa Durga through the Navarna mantra with kavacha recitation and agni upasana.",
    category: 'sadhanas',
    difficulty: 'Intermediate',
    duration: 40,
    deity: "Durga",
    benefits: ["Inner courage", "Energetic protection", "Disciplined tapas"],
    practices: ["Navarna mantra japa", "Durga Kavacham", "Weekly homa"],
    genre: { name: "Shakti", icon: <Sword className="h-5 w-5" /> }
  },
  {
    id: 5,
    title: "Anahata Bhakti Sadhana",
    description: "Soft devotional current rooted in Ram-bhakti and Hanuman seva; daily kirtan and seva journaling.",
    category: 'sadhanas',
    difficulty: 'Beginner',
    duration: 21,
    deity: "Sri Rama",
    benefits: ["Loving devotion", "Humility", "Serviceful living"],
    practices: ["Hanuman Chalisa", "Rama nama japa", "Evening kirtan"],
    genre: { name: "Bhakti", icon: <Heart className="h-5 w-5" /> }
  },
  // Holy Texts
  {
    id: 6,
    title: "Bhagavad Gita Adhyayana",
    description: "Structured 18-chapter parayana with daily shloka chanting and nishkama karma contemplation.",
    category: 'texts',
    difficulty: 'Intermediate',
    duration: 40,
    deity: "Krishna",
    benefits: ["Dharma clarity", "Steady viveka", "Devotional insight"],
    practices: ["Daily shloka chanting", "Svadhyaya journal", "Gita dhyana"],
    genre: { name: "Wisdom", icon: <Gem className="h-5 w-5" /> }
  },
  {
    id: 7,
    title: "Yoga Sutra Svadhyaya",
    description: "Patanjali's sutras chanted in Sanskrit with focus on abhyasa–vairagya and eight-limbed integration.",
    category: 'texts',
    difficulty: 'Advanced',
    duration: 56,
    deity: "Patanjali",
    benefits: ["Steady mind", "Clear discernment", "Rooted sadhana map"],
    practices: ["Sutra chanting", "Abhyasa notes", "Pranayama log"],
    genre: { name: "Raja Yoga", icon: <Star className="h-5 w-5" /> }
  },
  // Guided Journeys
  {
    id: 8,
    title: "Kedar-Badri Yatra",
    description: "Guided visualization of the Himalayas with stotras to Kedarnath and Badrinath.",
    category: 'journeys',
    difficulty: 'Intermediate',
    duration: 21,
    deity: "Shiva",
    benefits: ["Pilgrimage bhava", "Reverence", "Inner stillness"],
    practices: ["Shiva Panchakshari", "Himalayan visualization", "Tirtha stotra"],
    genre: { name: "Pilgrimage", icon: <Mountain className="h-5 w-5" /> }
  },
  {
    id: 9,
    title: "Kashi Panchakroshi",
    description: "Walk (virtually) the 25-kos route around Kashi with Ganga stuti and Vishwanath darshan.",
    category: 'journeys',
    difficulty: 'Advanced',
    duration: 40,
    deity: "Vishwanath",
    benefits: ["Tirtha samskara", "Bhakti refinement", "Sense of sanctity"],
    practices: ["Ganga aarti chanting", "Manasa parikrama", "Nightly dipa dana"],
    genre: { name: "Tirtha", icon: <Waves className="h-5 w-5" /> }
  }
];

// Theme configuration
const theme = {
  bg: '#1a1a1a',
  cardBg: '#0f0f0f',
  accent: '#DC143C',
  accentLight: '#FF6B6B',
  gold: '#FFD700',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  patternColor: '#3A0000',
  glow: 'rgba(220, 20, 60, 0.3)'
};

// Sacred Circuit Pattern Component
const SacredCircuitPattern = ({ color }: { color: string }) => (
  <svg width="100%" height="100%">
    <defs>
      <pattern id="sacred-circuit-library" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M20 0 L20 40 M0 20 L40 20" stroke={color} strokeWidth="0.5" opacity="0.3" />
        <circle cx="20" cy="20" r="1" fill={color} opacity="0.5" />
        <rect x="18" y="18" width="4" height="4" fill="none" stroke={color} strokeWidth="0.5" transform="rotate(45 20 20)" opacity="0.3" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#sacred-circuit-library)" />
  </svg>
);

// Corner Bracket Component
const CornerBracket = ({ position, color }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right', color: string }) => {
  const style: React.CSSProperties = {
    borderColor: color,
    width: '16px',
    height: '16px',
    position: 'absolute',
    zIndex: 20,
    transition: 'all 0.3s ease',
    opacity: 0.6,
  };

  const props = {
    'top-left': { top: '6px', left: '6px', borderTopWidth: '2px', borderLeftWidth: '2px' },
    'top-right': { top: '6px', right: '6px', borderTopWidth: '2px', borderRightWidth: '2px' },
    'bottom-left': { bottom: '6px', left: '6px', borderBottomWidth: '2px', borderLeftWidth: '2px' },
    'bottom-right': { bottom: '6px', right: '6px', borderBottomWidth: '2px', borderRightWidth: '2px' },
  };

  return <div style={{ ...style, ...props[position] }} className="group-hover:opacity-100 group-hover:w-5 group-hover:h-5" />;
};

// Library Card Component
const LibraryCard = ({ item }: { item: DataItem }) => {
  const [isHovered, setIsHovered] = useState(false);

  const difficultyColors: Record<Difficulty, string> = {
    Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    Intermediate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: theme.cardBg,
        boxShadow: isHovered ? `0 20px 50px -10px ${theme.glow}` : '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Circuit Pattern Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-soft-light">
        <SacredCircuitPattern color={theme.patternColor} />
      </div>

      {/* Dashed Border Frame */}
      <div
        className="absolute inset-2 border-[1px] border-dashed pointer-events-none rounded-lg z-20 transition-opacity duration-300"
        style={{ borderColor: theme.accent, opacity: isHovered ? 0.4 : 0.2 }}
      />

      {/* Corner Brackets */}
      <CornerBracket position="top-left" color={theme.accent} />
      <CornerBracket position="top-right" color={theme.accent} />
      <CornerBracket position="bottom-left" color={theme.accent} />
      <CornerBracket position="bottom-right" color={theme.accent} />

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div
            className="p-2.5 rounded-lg border transition-all duration-300"
            style={{
              borderColor: theme.accent,
              backgroundColor: isHovered ? `${theme.accent}20` : 'transparent',
              color: isHovered ? theme.gold : theme.accent
            }}
          >
            {item.genre.icon}
          </div>
          <div className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider border ${difficultyColors[item.difficulty]}`}>
            {item.difficulty}
          </div>
        </div>

        {/* Genre Label */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: theme.accent }}>
            {item.genre.name}
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: theme.accent, opacity: 0.3 }} />
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-lg mb-2" style={{ color: theme.text }}>
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm mb-4 line-clamp-2" style={{ color: theme.textMuted }}>
          {item.description}
        </p>

        {/* Tech Divider */}
        <div className="w-full h-px relative mb-4" style={{ backgroundColor: theme.accent, opacity: 0.2 }}>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2" style={{ backgroundColor: theme.cardBg }}>
            <Hexagon size={10} fill={theme.accent} stroke="none" className="animate-spin-slow" />
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="px-2 py-1 rounded text-[10px] font-mono border"
            style={{ borderColor: `${theme.gold}40`, color: theme.gold }}
          >
            {item.duration} DAYS
          </span>
          {item.deity && (
            <span
              className="px-2 py-1 rounded text-[10px] font-mono border"
              style={{ borderColor: `${theme.accent}40`, color: theme.accentLight }}
            >
              {item.deity}
            </span>
          )}
        </div>

        {/* Benefits */}
        <div className="mb-4">
          <h4 className="text-[9px] font-mono uppercase tracking-wider mb-2" style={{ color: theme.accent }}>
            Key_Benefits
          </h4>
          <div className="flex flex-wrap gap-1">
            {item.benefits.slice(0, 3).map((benefit, index) => (
              <span
                key={index}
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${theme.accent}15`, color: theme.textMuted }}
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          className="w-full relative group/btn overflow-hidden rounded py-3 px-4 font-mono font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${theme.accent}, #8B0000)`,
            color: theme.text,
            boxShadow: isHovered ? `0 0 20px ${theme.glow}` : 'none'
          }}
        >
          <Sparkles className="h-4 w-4" />
          <span>EXPLORE_{item.category.toUpperCase().slice(0, -1)}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </button>

        {/* Footer Status */}
        <div className="flex justify-between items-center mt-3 text-[9px] font-mono uppercase tracking-wider" style={{ color: theme.accent, opacity: 0.6 }}>
          <span>Sys_Ready</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.gold }} />
            Active
          </span>
        </div>
      </div>
    </div>
  );
};

const CosmicLibraryShowcase: React.FC = () => {
  const [active, setActive] = useState<Category>('sadhanas');
  const items = useMemo(() => DATA(), []);
  const filtered = items.filter(i => i.category === active);
  const { ref: sectionRef, isVisible } = useScrollTrigger({ threshold: 0.2 });

  const categoryIcons = {
    sadhanas: <Flame className="h-4 w-4" />,
    texts: <BookText className="h-4 w-4" />,
    journeys: <Compass className="h-4 w-4" />
  };

  const categoryLabels = {
    sadhanas: 'Sacred Practices',
    texts: 'Holy Texts',
    journeys: 'Guided Journeys'
  };

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-labelledby="cosmic-library-title"
      className="relative overflow-hidden rounded-2xl p-6 md:p-8"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <SacredCircuitPattern color={theme.patternColor} />
      </div>

      {/* Outer Dashed Border */}
      <div
        className="absolute inset-3 border-[1px] border-dashed pointer-events-none rounded-xl"
        style={{ borderColor: theme.accent, opacity: 0.2 }}
      />

      {/* Corner Brackets for Section */}
      <CornerBracket position="top-left" color={theme.gold} />
      <CornerBracket position="top-right" color={theme.gold} />
      <CornerBracket position="bottom-left" color={theme.gold} />
      <CornerBracket position="bottom-right" color={theme.gold} />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: `${theme.accent}20`, border: `1px solid ${theme.accent}40` }}>
            <Sparkles className="w-4 h-4" style={{ color: theme.gold }} />
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: theme.gold }}>Sacred Repository</span>
          </div>
          <h2 id="cosmic-library-title" className="text-3xl md:text-4xl font-serif font-bold mb-3" style={{ color: theme.text }}>
            Cosmic Library
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: theme.textMuted }}>
            Explore curated spiritual practices, sacred texts, and transformative journeys
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div
            className="inline-flex p-1 rounded-lg"
            style={{ backgroundColor: 'rgba(30, 30, 35, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            {(['sadhanas', 'texts', 'journeys'] as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => setActive(category)}
                className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2"
                style={{
                  backgroundColor: active === category ? theme.accent : 'transparent',
                  color: active === category ? theme.text : theme.textMuted,
                  boxShadow: active === category ? `0 0 15px ${theme.glow}` : 'none'
                }}
              >
                {categoryIcons[category]}
                <span className="hidden sm:inline">{categoryLabels[category]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tech Divider */}
        <div className="w-full max-w-md mx-auto h-px relative mb-8" style={{ backgroundColor: theme.accent, opacity: 0.3 }}>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3" style={{ backgroundColor: theme.bg }}>
            <Hexagon size={14} fill={theme.gold} stroke="none" className="animate-spin-slow" />
          </div>
        </div>

        {/* Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-rise-in ${isVisible ? 'visible' : ''}`}>
          {filtered.map((item) => (
            <LibraryCard key={item.id} item={item} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center mt-8 text-[10px] font-mono uppercase tracking-wider" style={{ color: theme.accent, opacity: 0.5 }}>
          <span>System::Library_Module</span>
          <span className="mx-3 w-1 h-1 rounded-full" style={{ backgroundColor: theme.accent }} />
          <span>{filtered.length} Items_Available</span>
        </div>
      </div>
    </section>
  );
};

export default CosmicLibraryShowcase;
