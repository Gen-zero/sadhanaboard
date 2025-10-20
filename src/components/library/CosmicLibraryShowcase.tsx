import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import '@/styles/animations.css';
import '@/styles/cosmic.css';
import { BookOpen, Flame, Sparkles, Heart, Target, Compass, Map, Mountain, Check, Star, ShoppingCart, Gem, BookText, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
type Category = 'sadhanas' | 'texts' | 'journeys';

type Item = {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  category: Category;
  icon: React.ReactNode;
  difficulty: Difficulty;
  duration: string;
  color: string; // gradient classes
  features: string[];
  popular?: boolean;
  isNew?: boolean;
  isLimited?: boolean;
  rating?: number;
  price?: number; // in spiritual points
};

const DATA = (): Item[] => [
  // Sacred Practices
  {
    id: 1,
    title: '21-Day Mindful Awakening',
    subtitle: 'Meditation Program',
    description: 'A gentle guided program to build a daily meditation habit and deepen awareness.',
    category: 'sadhanas',
    icon: <Flame size={28} />, difficulty: 'Beginner', duration: '21 days', color: 'from-amber-400 to-amber-600',
    features: ['Daily guided sessions', 'Breathwork', 'Reflection prompts'], popular: true, rating: 4.8, price: 50
  },
  {
    id: 2,
    title: 'Om Namah Shivaya Mantra',
    subtitle: 'Mantra Sadhana',
    description: 'A focused mantra practice aimed at inner transformation and grounding.',
    category: 'sadhanas',
    icon: <Sparkles size={28} />, difficulty: 'Intermediate', duration: '14 days', color: 'from-amber-500 to-yellow-500',
    features: ['Chant tracks', 'Meaning & technique', 'Progress tracker'], isNew: true, rating: 4.9, price: 75
  },
  {
    id: 3,
    title: 'Heart Rhythm Yoga',
    subtitle: 'Movement & Breath',
    description: 'A gentle flow that synchronizes breath with movement for emotional balance.',
    category: 'sadhanas',
    icon: <Heart size={28} />, difficulty: 'Beginner', duration: '60 min', color: 'from-amber-400 to-yellow-400',
    features: ['Sequenced flows', 'Audio guidance', 'Accessible for all'], rating: 4.7, price: 40
  },
  // Holy Texts
  {
    id: 4,
    title: 'Bhagavad Gita (Selected)',
    subtitle: 'Holy Text',
    description: 'Selected verses and commentary to support practical spiritual living.',
    category: 'texts',
    icon: <BookOpen size={28} />, difficulty: 'Advanced', duration: 'Variable', color: 'from-amber-400 to-yellow-400',
    features: ['Curated verses', 'Modern commentary', 'Audio recitation'], popular: true, rating: 4.9, price: 100
  },
  {
    id: 5,
    title: 'Upanishads (Intro)',
    subtitle: 'Holy Text',
    description: 'Foundational teachings exploring the nature of Self and reality.',
    category: 'texts',
    icon: <Map size={28} />, difficulty: 'Advanced', duration: 'Varies', color: 'from-amber-500 to-yellow-500',
    features: ['Key passages', 'Summaries', 'Guided reflections'], isNew: true, rating: 4.8, price: 80
  },
  {
    id: 6,
    title: 'Yoga Sutras — Essentials',
    subtitle: 'Holy Text',
    description: 'Pithy aphorisms and practical notes to support daily practice.',
    category: 'texts',
    icon: <ScrollIconPlaceholder />, difficulty: 'Intermediate', duration: 'Variable', color: 'from-amber-400 to-amber-600',
    features: ['Concise explanations', 'Practice tips', 'Audio highlights'], rating: 4.6, price: 60
  },
  // Guided Journeys
  {
    id: 7,
    title: '7-Day Chakra Journey',
    subtitle: 'Guided Journey',
    description: 'A deep somatic and meditative exploration of the chakra system across a week.',
    category: 'journeys',
    icon: <Compass size={28} />, difficulty: 'Intermediate', duration: '7 days', color: 'from-amber-500 to-yellow-500',
    features: ['Daily practices', 'Journaling prompts', 'Energy visualizations'], popular: true, rating: 4.9, price: 120
  },
  {
    id: 8,
    title: 'Pilgrimage — Inner Map',
    subtitle: 'Guided Journey',
    description: 'A multi-week guided journey combining study, practice and reflection.',
    category: 'journeys',
    icon: <Mountain size={28} />, difficulty: 'Advanced', duration: '21 days', color: 'from-amber-600 to-amber-800',
    features: ['Multi-week structure', 'Live sessions', 'Community support'], isLimited: true, rating: 5.0, price: 200
  },
  {
    id: 9,
    title: 'Compass: Daily Micro-Journeys',
    subtitle: 'Guided Journey',
    description: 'Short 10–15 minute guided sessions for busy days.',
    category: 'journeys',
    icon: <Target size={28} />, difficulty: 'Beginner', duration: '10–15 min', color: 'from-amber-400 to-yellow-400',
    features: ['Quick practices', 'On-demand', 'Energy resets'], rating: 4.5, price: 30
  }
];

function ScrollIconPlaceholder() {
  // Small inline placeholder for Scroll icon (lucase has Scroll but avoid extra import; keep accessible)
  return <Star size={28} />;
}

const rotations = ['-1', '1', '-2', '2', '-3', '3'];

const CosmicLibraryShowcase: React.FC = () => {
  const [active, setActive] = useState<Category>('sadhanas');
  const [hovered, setHovered] = useState<number | null>(null);
  const items = useMemo(() => DATA(), []);

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
    <section aria-labelledby="cosmic-library-title" className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-transparent to-transparent">
      {/* decorative background - subtle and muted to match page */}
      <div className="absolute inset-0 z-0 pointer-events-none -rotate-1 bg-gradient-to-br from-amber-50/10 via-yellow-50/6 to-amber-50/10 dark:from-black/20 dark:via-amber-900/10 dark:to-black/30" />
      <div className="absolute -top-8 -right-8 opacity-40 z-0">
        <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-amber-300/12 to-yellow-300/10 blur-3xl dark:from-amber-700/20 dark:to-yellow-700/6" />
      </div>

      <div className="relative z-10">
        <div className="mb-6 text-center">
          <p className="font-handwritten text-sm text-amber-700/90 rotate-[-2deg]">Explore Our Collection</p>
          <h2 id="cosmic-library-title" className="font-handwritten text-4xl md:text-5xl leading-tight font-bold -rotate-1">The Cosmic Library</h2>
          <div className="mt-2 w-24 h-2 bg-gradient-to-r from-amber-400 to-yellow-400 rounded rotate-[-2deg] blur-sm mx-auto" />
          <p className="mt-3 text-sm text-amber-100 max-w-2xl mx-auto">Sacred practices, timeless texts and guided journeys — curated for practice and reflection.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 items-center mb-6">
          {(Object.keys(categoryLabels) as Category[]).map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              aria-pressed={active === c}
              className={cn(
                'px-4 py-2 rounded-md border-2 transition-all duration-300 font-handwritten text-sm flex items-center gap-2',
                active === c 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-700 shadow-lg hover:shadow-xl' 
                  : 'bg-background/50 text-foreground border-amber-500/30 hover:bg-amber-500/10'
              )}
            >
              {categoryIcons[c]}
              {categoryLabels[c]}
            </button>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            {filtered.map((it, idx) => (
              <motion.article
                key={it.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
                onMouseEnter={() => setHovered(it.id)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  'relative rounded-xl p-5 border transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1',
                  'border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-br from-background/40 to-secondary/20 backdrop-blur-sm'
                )}
              >
                {/* Special badges */}
                <div className="absolute top-3 right-3 flex gap-1 z-10">
                  {it.popular && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs">
                      Popular
                    </Badge>
                  )}
                  {it.isNew && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs">
                      New
                    </Badge>
                  )}
                  {it.isLimited && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs">
                      Limited
                    </Badge>
                  )}
                </div>
                
                <header className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', it.color)} style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)' }}>
                      {it.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{it.title}</h3>
                      <p className="text-xs text-amber-100">{it.subtitle} • {it.duration}</p>
                    </div>
                  </div>
                </header>

                <p className="text-sm text-amber-100 mb-4 line-clamp-2">{it.description}</p>

                <ul className="grid grid-cols-1 gap-1 mb-4">
                  {it.features.slice(0, 2).map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs">
                      <Check className="h-3 w-3 text-amber-500" />
                      <span className="text-amber-100">{f}</span>
                    </li>
                  ))}
                  {it.features.length > 2 && (
                    <li className="text-xs text-amber-100">+{it.features.length - 2} more features</li>
                  )}
                </ul>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(it.rating || 0) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-xs text-amber-100 ml-1">{it.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Gem className="h-4 w-4 text-amber-500" />
                    <span className="font-bold text-sm text-amber-100">{it.price} SP</span>
                  </div>
                </div>

                <footer className="flex items-center justify-between">
                  <Badge className={cn('px-2 py-1 rounded-sm border', difficultyColors[it.difficulty])}>{it.difficulty}</Badge>
                  <Button asChild size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
                    <Link to={it.category === 'texts' ? '/library' : it.category === 'sadhanas' ? '/sadhanas' : '/journeys'}>
                      Explore
                    </Link>
                  </Button>
                </footer>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-center">
          <Button size="lg" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-lg" asChild>
            <Link to="/library">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Explore Full Library
            </Link>
          </Button>
        </div>
      </div>

      {/* floating decorative symbols */}
      <div className="pointer-events-none absolute left-4 bottom-6 opacity-80">
        <div className="animate-float-petal text-2xl">✨</div>
      </div>
      <div className="pointer-events-none absolute right-8 bottom-10 opacity-60">
        <div className="animate-float-petal text-3xl">ॐ</div>
      </div>
    </section>
  );
};

export default CosmicLibraryShowcase;