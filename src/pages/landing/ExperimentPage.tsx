import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FlaskConical, 
  Zap, 
  Brain, 
  Eye, 
  Sparkles,
  ChevronRight,
  Star,
  Rocket
} from 'lucide-react';

const ExperimentPage = () => {
  const navigate = useNavigate();
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);

  const experiments = [
    {
      id: 'consciousness',
      title: 'Consciousness Explorer',
      description: 'Interactive journey through states of awareness',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      status: 'active'
    },
    {
      id: 'energy',
      title: 'Energy Visualization',
      description: 'See your subtle energy fields in real-time',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      status: 'beta'
    },
    {
      id: 'astral',
      title: 'Astral Projection',
      description: 'Guided out-of-body experience simulator',
      icon: Eye,
      color: 'from-blue-500 to-cyan-500',
      status: 'coming'
    },
    {
      id: 'quantum',
      title: 'Quantum Meditation',
      description: 'Experience reality at the quantum level',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-500',
      status: 'active'
    }
  ];

  const handleExperimentSelect = (id: string) => {
    setActiveExperiment(id);
    // Navigate to specific experiment page
    navigate(`/experiment/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-fuchsia-900/20 to-pink-900/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 mb-6">
            <FlaskConical className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            Consciousness Lab
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the frontiers of human consciousness through interactive spiritual experiments
          </p>
        </motion.div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {experiments.map((experiment, index) => {
            const IconComponent = experiment.icon;
            return (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card 
                  className={`relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-background/70 to-secondary/10 border border-purple-500/20 rounded-2xl shadow-xl h-full cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                    activeExperiment === experiment.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => handleExperimentSelect(experiment.id)}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      experiment.status === 'active' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : experiment.status === 'beta' 
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                      {experiment.status === 'active' ? 'Active' : experiment.status === 'beta' ? 'Beta' : 'Coming Soon'}
                    </span>
                  </div>

                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${experiment.color} opacity-10 blur-3xl`}></div>

                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${experiment.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {experiment.title}
                          {experiment.status === 'active' && (
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {experiment.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <Button 
                      className={`w-full bg-gradient-to-r ${experiment.color} hover:opacity-90 transition-opacity`}
                      disabled={experiment.status === 'coming'}
                    >
                      {experiment.status === 'coming' ? 'Coming Soon' : 'Launch Experiment'}
                      <Rocket className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-purple-300" />
                About Our Experiments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our consciousness experiments are designed to expand your awareness and deepen your spiritual understanding 
                through interactive, technology-enhanced experiences.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-start gap-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <Brain className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Scientific Approach</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on ancient wisdom combined with modern neuroscience
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-fuchsia-500/10 rounded-lg border border-fuchsia-500/20">
                  <Sparkles className="h-5 w-5 text-fuchsia-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Safe Exploration</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Guided experiences with built-in safety protocols
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
                  <Eye className="h-5 w-5 text-pink-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Personal Insights</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gain unique perspectives on your consciousness and growth
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ExperimentPage;