import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  Lightbulb, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  Home,
  User,
  Calendar,
  Target,
  Users,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHelp } from '@/contexts/HelpContext';

interface HelpTopic {
  id: string;
  title: string;
  content: string;
  category: string;
  icon: React.ReactNode;
}

const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    content: 'Your dashboard is the central hub for tracking your spiritual progress. Here you can view your daily practices, streaks, and achievements. The dashboard provides a quick overview of your spiritual journey and upcoming commitments.',
    category: 'Getting Started',
    icon: <Home className="w-5 h-5" />
  },
  {
    id: 'profile',
    title: 'Profile Management',
    content: 'Your profile contains all your personal information and spiritual preferences. You can update your birth details, preferred deities, and spiritual background here. This information helps personalize your experience.',
    category: 'Account',
    icon: <User className="w-5 h-5" />
  },
  {
    id: 'sadhana',
    title: 'Creating Sadhanas',
    content: 'Sadhana creation allows you to design personalized spiritual practices. You can set intentions, choose duration, select focus areas, and generate sacred papers. Each sadhana can be tracked and monitored for consistency.',
    category: 'Practices',
    icon: <Target className="w-5 h-5" />
  },
  {
    id: 'calendar',
    title: 'Calendar & Scheduling',
    content: 'The calendar helps you plan and track your practices. You can view your daily commitments, upcoming festivals, and schedule new practices. The calendar integrates with your sadhanas to provide a comprehensive view.',
    category: 'Planning',
    icon: <Calendar className="w-5 h-5" />
  },
  {
    id: 'community',
    title: 'Community Features',
    content: 'Connect with fellow practitioners through the community section. Share your progress, participate in discussions, and join group practices. You can also view leaderboards and celebrate achievements together.',
    category: 'Social',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: 'settings',
    title: 'Customization & Settings',
    content: 'Customize your experience through settings. Adjust themes, notification preferences, privacy settings, and spiritual preferences. You can also manage your account and subscription settings here.',
    category: 'Account',
    icon: <Settings className="w-5 h-5" />
  }
];

const CATEGORIES = [
  'All',
  'Getting Started',
  'Account',
  'Practices',
  'Planning',
  'Social'
];

export const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null);
  const { markFeatureAsDiscovered } = useHelp();

  // Filter topics based on search and category
  const filteredTopics = HELP_TOPICS.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          topic.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTopicSelect = (topic: HelpTopic) => {
    setSelectedTopic(topic);
    markFeatureAsDiscovered(topic.id);
  };

  const handleBackToList = () => {
    setSelectedTopic(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-background border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Help Center</h2>
                  <p className="text-muted-foreground">Find answers and guidance</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row h-[70vh]">
              {/* Sidebar */}
              <div className="w-full md:w-64 border-r border-border p-4 flex flex-col">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search help..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-1 mb-4">
                  <h3 className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Categories
                  </h3>
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedTopic(null);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-sm transition-colors',
                        selectedCategory === category
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-muted'
                      )}
                    >
                      <span>{category}</span>
                    </button>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-auto space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => {
                    setSelectedCategory('Getting Started');
                    setSelectedTopic(null);
                  }}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Getting Started
                  </Button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-hidden">
                {selectedTopic ? (
                  // Topic Detail View
                  <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-border">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleBackToList}
                        className="mb-4"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back to topics
                      </Button>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg text-white">
                          {selectedTopic.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{selectedTopic.title}</h3>
                          <p className="text-sm text-muted-foreground">{selectedTopic.category}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="prose max-w-none">
                        <p className="text-muted-foreground">{selectedTopic.content}</p>
                        <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <h4 className="font-semibold text-blue-500 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Pro Tip
                          </h4>
                          <p className="mt-2 text-sm">
                            {selectedTopic.id === 'dashboard' && 'Check your dashboard daily to maintain your practice streak!'}
                            {selectedTopic.id === 'profile' && 'Keep your profile updated to get personalized recommendations.'}
                            {selectedTopic.id === 'sadhana' && 'Start with shorter sadhanas and gradually increase duration.'}
                            {selectedTopic.id === 'calendar' && 'Use the calendar to plan your practices around important festivals.'}
                            {selectedTopic.id === 'community' && 'Engage with the community to stay motivated on your journey.'}
                            {selectedTopic.id === 'settings' && 'Customize your notifications to avoid missing important updates.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Topic List View
                  <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-border">
                      <h3 className="text-lg font-semibold">
                        {selectedCategory === 'All' ? 'All Topics' : selectedCategory}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {filteredTopics.length} topics found
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      {filteredTopics.length > 0 ? (
                        <div className="grid gap-3">
                          {filteredTopics.map((topic) => (
                            <Card 
                              key={topic.id} 
                              className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => handleTopicSelect(topic)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                    {topic.icon}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium">{topic.title}</h4>
                                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {topic.content}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-xs px-2 py-1 bg-muted rounded-full">
                                        {topic.category}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                          <HelpCircle className="w-12 h-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No topics found</h3>
                          <p className="text-muted-foreground">
                            Try adjusting your search or category filter
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper function for class names
function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default HelpModal;