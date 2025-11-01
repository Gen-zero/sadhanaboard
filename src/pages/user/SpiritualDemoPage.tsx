import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserProgression } from "@/hooks/useUserProgression";
import AtmaYantra from "@/components/profile/AtmaYantra";
import { Gem, Lock, ShoppingCart, Sparkles, Info, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SpiritualDemoPage = () => {
  const { progression } = useUserProgression();
  const navigate = useNavigate();
  const [selectedYantra, setSelectedYantra] = useState<string | null>(null);

  // Define yantras that can be purchased
  const yantras = [
    {
      id: 'shiva-yantra',
      title: 'Shiva Yantra 3D',
      description: 'Dynamic 3D Shiva Yantra with rotating energy',
      isUnlocked: progression.unlockedStoreSadhanas.includes('shiva-yantra')
    },
    {
      id: 'ganesha-yantra',
      title: 'Ganesha Yantra 3D',
      description: 'Interactive 3D Ganesha Yantra for obstacle removal',
      isUnlocked: progression.unlockedStoreSadhanas.includes('ganesha-yantra')
    },
    {
      id: 'lakshmi-yantra',
      title: 'Lakshmi Yantra 3D',
      description: 'Prosperity-focused 3D Lakshmi Yantra',
      isUnlocked: progression.unlockedStoreSadhanas.includes('lakshmi-yantra')
    },
    {
      id: 'atma-yantra',
      title: 'Atma Yantra',
      description: 'Your personalized sacred geometry representation',
      isUnlocked: true, // Always available
      isDefault: true
    }
  ];

  // Separate yantras into owned and recommended
  const ownedYantras = yantras.filter(yantra => yantra.isUnlocked);
  const recommendedYantras = yantras.filter(yantra => !yantra.isUnlocked);

  // Mock data for the yantra
  const yantraData = {
    streak: 15,
    level: 7,
    achievements: 23,
    goals: [
      { progress: 85 },
      { progress: 60 },
      { progress: 40 },
      { progress: 95 }
    ]
  };

  const handleYantraClick = (yantraId: string) => {
    if (yantraId === 'atma-yantra') {
      setSelectedYantra(yantraId);
    } else {
      const yantra = yantras.find(y => y.id === yantraId);
      if (yantra?.isUnlocked) {
        setSelectedYantra(yantraId);
      }
    }
  };

  const handleUnlockYantra = () => {
    navigate('/store');
  };

  interface Yantra {
    id: string;
    title: string;
    description: string;
    isUnlocked: boolean;
  }

  const YantraCard = ({ yantra }: { yantra: Yantra }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
          yantra.isUnlocked 
            ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10' 
            : 'border-gray-500/20 opacity-90 hover:opacity-100'
        } relative overflow-hidden`}
        onClick={() => handleYantraClick(yantra.id)}
      >
        {/* Glow effect for unlocked yantras */}
        {yantra.isUnlocked && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg blur-xl -z-10"></div>
        )}
        
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="font-semibold">{yantra.title}</span>
            {yantra.isUnlocked ? (
              <Gem className="h-5 w-5 text-primary" />
            ) : (
              <Lock className="h-5 w-5 text-gray-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-4">
            {yantra.description}
          </p>
          {!yantra.isUnlocked && (
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              onClick={(e) => {
                e.stopPropagation();
                handleUnlockYantra();
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Unlock in Store
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Layout>
      <div className="space-y-8 w-full max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
            Your Sacred Yantras
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-lg">
            Explore your personalized sacred geometry and unlock powerful yantras to enhance your spiritual journey
          </p>
        </motion.div>

        {/* Yantra Request Temporarily Unavailable Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 p-6 bg-gradient-to-r from-amber-900/50 to-yellow-900/50 rounded-lg border border-amber-500/30 text-center"
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-amber-900" />
            </div>
            <h3 className="font-bold text-xl text-amber-100 mb-2">
              Yantras will be updated in the next update
            </h3>
            <p className="text-amber-200 max-w-md">
              This feature is temporarily unavailable but will be restored with enhanced capabilities in a future update.
            </p>
          </div>
        </motion.div>

        {/* Your Yantras Section */}
        {ownedYantras.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
              Your Yantras
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ownedYantras.map((yantra, index) => (
                <YantraCard key={yantra.id} yantra={yantra} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommended Yantras Section */}
        {recommendedYantras.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
              Recommended Yantras
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedYantras.map((yantra, index) => (
                <YantraCard key={yantra.id} yantra={yantra} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Selected Yantra Display */}
        {selectedYantra && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="backdrop-blur-sm bg-background/70 border border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>
                      {yantras.find(y => y.id === selectedYantra)?.title || 'Atma Yantra'}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedYantra(null)}
                  >
                    Close
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] w-full">
                  <AtmaYantra 
                    streak={yantraData.streak}
                    level={yantraData.level}
                    achievements={yantraData.achievements}
                    goals={yantraData.goals}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="backdrop-blur-sm bg-background/70 border border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <span>About Sacred Yantras</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yantras are mystical diagrams used in Hindu and Buddhist traditions for meditation and spiritual practice. 
                They represent the divine energy and cosmic principles in geometric forms. Each yantra is associated with 
                specific deities and carries unique spiritual significance.
              </p>
              <p className="text-muted-foreground mt-3">
                The Atma Yantra represents the soul's journey toward self-realization and enlightenment. 
                Its geometric patterns help focus the mind during meditation and connect with higher consciousness.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-background/70 border border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>How to Use</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Focus on the yantra during meditation to enhance concentration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Rotate and zoom to explore different aspects of the yantra</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Hover over elements to understand their spiritual significance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Click on elements to see how they relate to your spiritual progress</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SpiritualDemoPage;