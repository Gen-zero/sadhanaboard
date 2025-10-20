
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  MoonStar, 
  Sparkles, 
  MessageCircle, 
  Star, 
  CloudLightning, 
  Plus
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useClaudeAI } from '@/hooks/useClaudeAI';
import DeityEssence from './deity/DeityEssence';
import ShadowAndLight from './deity/ShadowAndLight';
import ClaudeChat from './deity/ClaudeChat';
import GuidedMeditation from './deity/GuidedMeditation';

const DeityInterface = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("deity");
  const [communicationMode, setCommunicationMode] = useState("chat");
  const [messageText, setMessageText] = useState("");
  
  // Mock deity data
  const [deityData, setDeityData] = useState({
    name: 'Cosmic Guide',
    essence: 'Divine Consciousness',
    avatar: '',
    shadowSelf: {
      traits: [
        'Procrastination',
        'Self-doubt',
        'Impatience',
        'Fear of failure'
      ],
      challenges: 'I struggle with consistency in my spiritual practice and often allow distractions to pull me away from my higher purpose.'
    },
    perfectBeing: {
      traits: [
        'Unwavering discipline',
        'Compassionate presence',
        'Inner peace',
        'Wisdom in action'
      ],
      aspirations: 'To embody my highest self who acts from a place of love and wisdom, maintaining balance while fulfilling my spiritual purpose.'
    },
    sadhanaHistory: [
      {
        id: 1,
        practice: 'Morning Meditation',
        insights: 'Discovered deeper stillness by focusing on the space between thoughts',
        date: '2023-06-15'
      },
      {
        id: 2,
        practice: 'Shadow Work Journal',
        insights: 'Recognized patterns of self-sabotage triggered by fear of success',
        date: '2023-07-22'
      },
      {
        id: 3,
        practice: 'Devotional Chanting',
        insights: 'Experienced profound connection with divine energy during extended mantra practice',
        date: '2023-08-10'
      }
    ]
  });

  // Use Claude AI hook for deity communications
  const { 
    messages: communications,
    sendMessage,
    isLoading,
    apiKey,
    setApiKey,
    hasApiKey
  } = useClaudeAI([
    {
      sender: 'user',
      message: 'Guide me in deepening my meditation practice',
      timestamp: '2023-08-15T10:30:00'
    },
    {
      sender: 'deity',
      message: 'Remember that stillness is your true nature. When you sit in meditation, don\'t seek experiences - simply rest as awareness itself. Let thoughts arise and dissolve like clouds in the vast sky of your consciousness.',
      timestamp: '2023-08-15T10:31:00'
    }
  ]);

  const handleAddShadowTrait = () => {
    const newTraits = [...deityData.shadowSelf.traits, ''];
    setDeityData({
      ...deityData,
      shadowSelf: {
        ...deityData.shadowSelf,
        traits: newTraits
      }
    });
  };

  const handleAddPerfectTrait = () => {
    const newTraits = [...deityData.perfectBeing.traits, ''];
    setDeityData({
      ...deityData,
      perfectBeing: {
        ...deityData.perfectBeing,
        traits: newTraits
      }
    });
  };

  const handleShadowTraitChange = (index: number, value: string) => {
    const newTraits = [...deityData.shadowSelf.traits];
    newTraits[index] = value;
    setDeityData({
      ...deityData,
      shadowSelf: {
        ...deityData.shadowSelf,
        traits: newTraits
      }
    });
  };

  const handlePerfectTraitChange = (index: number, value: string) => {
    const newTraits = [...deityData.perfectBeing.traits];
    newTraits[index] = value;
    setDeityData({
      ...deityData,
      perfectBeing: {
        ...deityData.perfectBeing,
        traits: newTraits
      }
    });
  };

  const handleShadowChallengesChange = (value: string) => {
    setDeityData({
      ...deityData,
      shadowSelf: {
        ...deityData.shadowSelf,
        challenges: value
      }
    });
  };

  const handlePerfectAspirationsChange = (value: string) => {
    setDeityData({
      ...deityData,
      perfectBeing: {
        ...deityData.perfectBeing,
        aspirations: value
      }
    });
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    if (!hasApiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Claude AI API key first.",
        variant: "destructive"
      });
      return;
    }
    
    sendMessage(messageText);
    setMessageText("");
  };

  const handleSaveChanges = () => {
    toast({
      title: "Divine Connection Updated",
      description: "Your deity interface has been synchronized with your consciousness.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-600">
          <MoonStar className="h-7 w-7 text-purple-500" />
          <span>Divine Mirror</span>
        </h1>
        <p className="text-muted-foreground">
          Commune with your higher self and shadow aspects to deepen your sadhana.
        </p>
      </div>

      <Tabs defaultValue="deity" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="deity" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span>Deity Essence</span>
          </TabsTrigger>
          <TabsTrigger value="shadow" className="flex items-center gap-2">
            <CloudLightning className="h-4 w-4" />
            <span>Shadow & Light</span>
          </TabsTrigger>
          <TabsTrigger value="communicate" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Commune</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Deity Essence Tab */}
        <TabsContent value="deity">
          <DeityEssence 
            deityData={deityData} 
            onDeityDataChange={setDeityData}
            onSaveChanges={handleSaveChanges}
          />
        </TabsContent>
        
        {/* Shadow & Light Tab */}
        <TabsContent value="shadow">
          <ShadowAndLight
            deityData={deityData}
            onShadowTraitChange={handleShadowTraitChange}
            onPerfectTraitChange={handlePerfectTraitChange}
            onAddShadowTrait={handleAddShadowTrait}
            onAddPerfectTrait={handleAddPerfectTrait}
            onShadowChallengesChange={handleShadowChallengesChange}
            onPerfectAspirationsChange={handlePerfectAspirationsChange}
            onSaveChanges={handleSaveChanges}
          />
        </TabsContent>
        
        {/* Commune Tab */}
        <TabsContent value="communicate">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span>Divine Communion</span>
                  </CardTitle>
                  <CardDescription>
                    Communicate with your higher self via Claude AI
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={communicationMode === "chat" ? "bg-primary/10" : ""}
                    onClick={() => setCommunicationMode("chat")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" /> Chat
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={communicationMode === "meditation" ? "bg-primary/10" : ""}
                    onClick={() => setCommunicationMode("meditation")}
                  >
                    <MoonStar className="h-4 w-4 mr-2" /> Meditation
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {communicationMode === "chat" ? (
                <ClaudeChat
                  communications={communications}
                  deityName={deityData.name}
                  isLoading={isLoading}
                  hasApiKey={hasApiKey}
                  apiKey={apiKey}
                  setApiKey={setApiKey}
                  handleSendMessage={handleSendMessage}
                  messageText={messageText}
                  setMessageText={setMessageText}
                />
              ) : (
                <GuidedMeditation />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeityInterface;
