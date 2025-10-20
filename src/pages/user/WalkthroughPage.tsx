import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  BookOpen, 
  Target, 
  Calendar,
  Heart,
  Users,
  Play,
  X,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';

// Define walkthrough steps
const WALKTHROUGH_STEPS = [
  {
    title: "Your Spiritual Dashboard",
    description: "Track your daily practices, monitor progress, and stay connected with your spiritual goals",
    icon: BookOpen,
    color: "from-purple-500 to-fuchsia-500",
    features: [
      "Daily practice tracking",
      "Progress visualization",
      "Streak maintenance",
      "Goal monitoring"
    ]
  },
  {
    title: "Create Sacred Commitments",
    description: "Design personalized spiritual practices with divine intentions and sacred commitments",
    icon: Heart,
    color: "from-fuchsia-500 to-pink-500",
    features: [
      "Custom sadhana creation",
      "Divine focus selection",
      "Duration planning",
      "Sacred paper generation"
    ]
  },
  {
    title: "Community & Growth",
    description: "Connect with fellow practitioners and track your spiritual evolution",
    icon: Users,
    color: "from-indigo-500 to-purple-500",
    features: [
      "Spiritual level progression",
      "Community sharing",
      "Achievement badges",
      "Reflection journaling"
    ]
  }
];

const WalkthroughPage = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [currentStep, setCurrentStep] = useState(0);
  
  const nextStep = () => {
    if (currentStep < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Mark walkthrough as complete in localStorage
    localStorage.setItem('walkthroughComplete', 'true');
    navigate('/dashboard');
  };

  const handleComplete = () => {
    // Mark walkthrough as complete in localStorage
    localStorage.setItem('walkthroughComplete', 'true');
    navigate('/dashboard');
  };

  // Check if Shiva theme is active
  const isShivaTheme = settings?.appearance?.colorScheme === 'shiva';

  const currentStepData = WALKTHROUGH_STEPS[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen cosmic-nebula-bg flex items-center justify-center p-4 relative">
      {/* Sticky Navigation Bar with Saadhana Paper Texture */}
      <nav className="sticky top-4 z-50 mx-4 bg-[url('/textures/parchment.jpg')] bg-cover bg-center border border-amber-500/30 rounded-lg shadow-2xl backdrop-blur-sm" style={{
        backgroundImage: 'url(/textures/parchment.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(255, 248, 220, 0.9)',
        backdropFilter: 'blur(8px)',
        boxShadow: 'inset 0 0 20px rgba(255, 215, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Decorative border overlay */}
        <div className="absolute inset-0 border-[8px] border-[rgba(255,215,0,0.4)] rounded-lg pointer-events-none"></div>
        
        <div className="flex items-center justify-between p-4 relative z-10">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/sadhanaboard_logo.png" 
              alt="Saadhana Board Logo" 
              className="h-8 w-8 rounded-full border-2 border-amber-600/30" 
            />
            <span className="text-lg font-semibold text-amber-900 font-serif drop-shadow-sm">
              SadhanaBoard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-amber-800 hover:text-amber-900 hover:bg-amber-200/30"
            >
              Skip Tour
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="border-amber-600/30 hover:border-amber-600/50 text-amber-800 hover:text-amber-900 hover:bg-amber-200/30"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>
        </div>
      </nav>
      {/* Cosmic particles animation - hidden for Shiva theme */}
      <div className={`fixed inset-0 overflow-hidden pointer-events-none ${isShivaTheme ? 'hidden' : ''}`}>
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60 cosmic-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-2xl bg-background/80 backdrop-blur-sm border border-purple-500/20 shadow-2xl mt-20">
        <CardHeader className="text-center relative">
          
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/sadhanaboard_logo.png" 
              alt="Saadhana Board Logo" 
              className="h-12 w-12 border-2 border-purple-500/30 rounded-full" 
            />
            <Sparkles className="ml-2 h-6 w-6 text-purple-500 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 mb-2">
            Welcome to Saadhana Yantra
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Let's explore the features that will enhance your spiritual journey
          </p>
          
          {/* Step indicator */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            {WALKTHROUGH_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i <= currentStep 
                    ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 scale-110' 
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-6"
            >
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${currentStepData.color} mb-6`}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 mb-4">
                  {currentStepData.title}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {currentStepData.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentStepData.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge 
                      variant="secondary" 
                      className="p-3 text-sm bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                    >
                      <CheckSquare className="w-4 h-4 mr-2 text-purple-400" />
                      {feature}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center pt-6">
            {currentStep > 0 ? (
              <Button
                variant="outline"
                onClick={prevStep}
                className="border-purple-500/30 hover:border-purple-500/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip Tour
              </Button>
              
              {currentStep < WALKTHROUGH_STEPS.length - 1 ? (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600"
                >
                  Start Journey
                  <Play className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spiritual Library Showcase Section */}
      <div className="w-full max-w-6xl mt-16 mb-8">
        <SpiritualLibraryShowcase />
      </div>
    </div>
  );
};

// Spiritual Library Showcase Component
const SpiritualLibraryShowcase = () => {
  const [activeTab, setActiveTab] = useState('sadhanas');
  const [selectedBook, setSelectedBook] = useState(null);
  const [hoveredSadhana, setHoveredSadhana] = useState(null);

  // Sample data for showcase
  const sampleSadhanas = [
    {
      id: 1,
      title: "21-Day Mindful Awakening",
      description: "Begin your meditation journey",
      duration: "21 days",
      difficulty: "Beginner",
      icon: "🧘‍♂️",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Om Namah Shivaya",
      description: "Sacred mantra practice",
      duration: "108 days",
      difficulty: "Intermediate",
      icon: "🕉️",
      color: "from-orange-500 to-amber-500"
    },
    {
      id: 3,
      title: "Krishna Bhakti",
      description: "Divine love through devotion",
      duration: "49 days",
      difficulty: "Beginner",
      icon: "💝",
      color: "from-pink-500 to-rose-500"
    }
  ];

  const sampleBooks = [
    {
      id: 1,
      title: "Bhagavad Gita",
      author: "Vyasa",
      tradition: "Hinduism",
      excerpt: "You are what you believe yourself to be...",
      pages: "18 Chapters"
    },
    {
      id: 2,
      title: "Tao Te Ching",
      author: "Laozi",
      tradition: "Taoism",
      excerpt: "The Tao that can be told is not the eternal Tao...",
      pages: "81 Verses"
    },
    {
      id: 3,
      title: "Yoga Sutras",
      author: "Patanjali",
      tradition: "Yoga",
      excerpt: "Yoga is the cessation of fluctuations of the mind...",
      pages: "196 Sutras"
    }
  ];

  const sampleMantras = [
    "ॐ गं गणपतये नमः",
    "ॐ नमः शिवाय",
    "ॐ तत्सत्वितुर्वरेण्यं",
    "ॐ शान्तिः शान्तिः शान्तिः",
    "ॐ अहं ब्रह्मास्मि",
    "ॐ हरे कृष्ण हरे कृष्ण"
  ];

  return (
    <Card className="bg-background/95 backdrop-blur-sm border border-amber-500/30 shadow-2xl overflow-hidden">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-4">
          <div className="text-4xl mr-3">📚</div>
          <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700">
            A Living Spiritual Library, Always Within Reach
          </CardTitle>
        </div>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
          Discover a sacred space where everything you need for your practice lives together — sadhanas to guide you, 
          texts to inspire you, and mantras to uplift you. No more searching, no more scattered rituals — just a single home for your journey.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Interactive Tabs */}
        <div className="flex justify-center space-x-1 bg-muted/50 p-1 rounded-lg">
          {[
            { id: 'sadhanas', label: 'Sacred Practices', icon: '🧘‍♂️' },
            { id: 'texts', label: 'Holy Texts', icon: '📖' },
            { id: 'mantras', label: 'Divine Mantras', icon: '🕉️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg transform scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'sadhanas' && (
              <motion.div
                key="sadhanas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {sampleSadhanas.map((sadhana, index) => (
                  <motion.div
                    key={sadhana.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredSadhana(sadhana.id)}
                    onMouseLeave={() => setHoveredSadhana(null)}
                    className="group relative overflow-hidden rounded-xl border border-amber-200/50 bg-gradient-to-br from-background/80 to-background/40 p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${sadhana.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className="relative z-10">
                      <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {sadhana.icon}
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-amber-700 transition-colors">
                        {sadhana.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4">
                        {sadhana.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs">
                        <Badge variant="secondary" className="bg-amber-100/50 text-amber-800 border-amber-200/50">
                          {sadhana.duration}
                        </Badge>
                        <Badge variant="outline" className="border-amber-300/50 text-amber-700">
                          {sadhana.difficulty}
                        </Badge>
                      </div>
                      
                      {hoveredSadhana === sadhana.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 bg-gradient-to-br from-amber-500/90 to-orange-500/90 backdrop-blur-sm rounded-xl flex items-center justify-center"
                        >
                          <div className="text-white text-center">
                            <Play className="w-8 h-8 mx-auto mb-2" />
                            <p className="font-semibold">Start Practice</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'texts' && (
              <motion.div
                key="texts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {sampleBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedBook(selectedBook === book.id ? null : book.id)}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-xl p-6 border border-amber-200/50 hover:border-amber-300/70 transition-all duration-300 hover:shadow-xl">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-16 bg-gradient-to-b from-amber-600 to-orange-600 rounded shadow-lg flex items-center justify-center text-white font-bold transform group-hover:scale-105 transition-transform">
                          📖
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-amber-800 dark:text-amber-200 mb-1">
                            {book.title}
                          </h3>
                          <p className="text-sm text-amber-600 dark:text-amber-300 mb-1">
                            by {book.author}
                          </p>
                          <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 dark:text-amber-300">
                            {book.tradition}
                          </Badge>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {selectedBook === book.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-amber-200/50"
                          >
                            <p className="text-sm text-muted-foreground italic mb-2">
                              "{book.excerpt}"
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-amber-600">{book.pages}</span>
                              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                                <BookOpen className="w-4 h-4 mr-1" />
                                Read Now
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'mantras' && (
              <motion.div
                key="mantras"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                    🕉️
                  </div>
                  <h3 className="text-xl font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Sacred Mantras Collection
                  </h3>
                  <p className="text-muted-foreground">
                    Divine vibrations for meditation and spiritual practice
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sampleMantras.map((mantra, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/50 dark:to-orange-950/50 border border-amber-200/50 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    >
                      <div className="text-center">
                        <div className="text-lg font-semibold text-amber-700 dark:text-amber-300 mb-2 group-hover:scale-105 transition-transform">
                          {mantra}
                        </div>
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button size="sm" variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-100/50">
                            <Play className="w-3 h-3 mr-1" />
                            Chant
                          </Button>
                        </div>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    <Heart className="w-4 h-4 mr-2" />
                    Explore Full Collection
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-8 border-t border-amber-200/50">
          <div className="max-w-2xl mx-auto">
            <h4 className="text-xl font-semibold text-amber-800 dark:text-amber-200 mb-3">
              Ready to Begin Your Sacred Journey?
            </h4>
            <p className="text-muted-foreground mb-6">
              Join thousands of seekers who have found their spiritual home in our integrated practice platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-8">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Your Practice
              </Button>
              <Button variant="outline" className="border-amber-300/50 text-amber-700 hover:bg-amber-50/50 px-8">
                <BookOpen className="w-4 h-4 mr-2" />
                Explore Library
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalkthroughPage;