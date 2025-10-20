
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { CloudLightning, Star, ArrowUpCircle, Sparkles, BookHeart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShadowSelfMonitorProps {
  shadowTraits: string[];
  perfectTraits: string[];
}

const ShadowSelfMonitor: React.FC<ShadowSelfMonitorProps> = ({ shadowTraits, perfectTraits }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("awareness");
  const [reflections, setReflections] = useState<Array<{date: string, content: string, type: string}>>([]);
  const [newReflection, setNewReflection] = useState("");
  const [reflectionType, setReflectionType] = useState("shadow");
  const [selfAwarenessLevel, setSelfAwarenessLevel] = useState(30);
  
  // Daily prompt for shadow work
  const [dailyPrompt, setDailyPrompt] = useState("");
  
  const shadowPrompts = [
    "How did your shadow traits manifest today?",
    "What triggered your shadow self today and how did you respond?",
    "Which of your shadow patterns are you most aware of right now?",
    "What part of yourself are you currently rejecting or hiding?",
    "How has your shadow self protected you in the past?",
    "What aspects of yourself do you judge most harshly?"
  ];

  const higherSelfPrompts = [
    "What would your higher self advise you about your current challenge?",
    "How can you embody more of your divine traits today?",
    "What wisdom does your higher self have for your shadow aspects?",
    "How would your perfect being respond to your current situation?",
    "What is your higher self trying to communicate to you right now?",
    "How can you act more aligned with your spiritual purpose today?"
  ];
  
  useEffect(() => {
    // Set random daily prompt on load
    const prompts = reflectionType === "shadow" ? shadowPrompts : higherSelfPrompts;
    setDailyPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    
    // Load reflections from localStorage
    const savedReflections = localStorage.getItem('shadow-reflections');
    if (savedReflections) {
      setReflections(JSON.parse(savedReflections));
    }
  }, [reflectionType]);

  const handleNewReflection = () => {
    if (!newReflection.trim()) return;
    
    const today = new Date().toISOString();
    const reflection = {
      date: today,
      content: newReflection,
      type: reflectionType
    };
    
    const updatedReflections = [reflection, ...reflections];
    setReflections(updatedReflections);
    setNewReflection("");
    
    // Save to localStorage
    localStorage.setItem('shadow-reflections', JSON.stringify(updatedReflections));
    
    // Update self-awareness level based on consistent reflection
    if (updatedReflections.length > reflections.length) {
      const newLevel = Math.min(selfAwarenessLevel + 2, 100);
      setSelfAwarenessLevel(newLevel);
      localStorage.setItem('self-awareness-level', String(newLevel));
    }
    
    toast({
      title: reflectionType === "shadow" ? "Shadow Work Recorded" : "Higher Self Connection Made",
      description: "Your inner journey continues to deepen.",
    });
    
    // Change prompt
    const prompts = reflectionType === "shadow" ? shadowPrompts : higherSelfPrompts;
    setDailyPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <Card className="shadow-lg border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookHeart className="h-5 w-5 text-purple-500" />
          <span>Shadow & Higher Self Monitor</span>
        </CardTitle>
        <CardDescription>
          Track your shadow patterns and higher self integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="awareness" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="awareness" className="flex items-center gap-1">
              <CloudLightning className="h-4 w-4" />
              <span>Shadow Awareness</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>Higher Integration</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="awareness" className="space-y-4">
            <div className="space-y-2 mt-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Self-Awareness Level</h3>
                <span className="text-xs text-muted-foreground">{selfAwarenessLevel}%</span>
              </div>
              <Progress value={selfAwarenessLevel} className="h-2" />
            </div>
            
            <div className="bg-red-500/10 p-4 rounded-lg space-y-3">
              <h3 className="flex items-center gap-2 font-medium">
                <CloudLightning className="h-4 w-4 text-red-400" />
                <span>Shadow Traits to Monitor</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {shadowTraits.map((trait, i) => (
                  <div key={i} className="px-3 py-1 bg-red-900/20 border border-red-500/20 rounded-full text-sm">
                    {trait}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Daily Shadow Work Prompt</span>
              </h3>
              <p className="text-muted-foreground italic">{dailyPrompt}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="integration" className="space-y-4">
            <div className="bg-blue-500/10 p-4 rounded-lg space-y-3">
              <h3 className="flex items-center gap-2 font-medium">
                <Star className="h-4 w-4 text-blue-400" />
                <span>Divine Traits to Embody</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {perfectTraits.map((trait, i) => (
                  <div key={i} className="px-3 py-1 bg-blue-900/20 border border-blue-500/20 rounded-full text-sm">
                    {trait}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Higher Self Connection Prompt</span>
              </h3>
              <p className="text-muted-foreground italic">{dailyPrompt}</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Record Your Reflection</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReflectionType("shadow")}
                className={reflectionType === "shadow" ? "bg-red-500/10 border-red-500/30" : ""}
              >
                Shadow
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReflectionType("higher")}
                className={reflectionType === "higher" ? "bg-blue-500/10 border-blue-500/30" : ""}
              >
                Higher Self
              </Button>
            </div>
          </div>
          <Textarea
            value={newReflection}
            onChange={(e) => setNewReflection(e.target.value)}
            placeholder={`Reflect on ${reflectionType === "shadow" ? "your shadow aspects" : "your higher self wisdom"}...`}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleNewReflection} 
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600"
          >
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Record Reflection
          </Button>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Recent Reflections</h3>
          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
            {reflections.length > 0 ? (
              reflections.map((reflection, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg ${
                    reflection.type === "shadow" 
                      ? "bg-red-500/10 border border-red-500/20" 
                      : "bg-blue-500/10 border border-blue-500/20"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {reflection.type === "shadow" ? (
                        <CloudLightning className="h-3 w-3" />
                      ) : (
                        <Star className="h-3 w-3" />
                      )}
                      <span>{reflection.type === "shadow" ? "Shadow Work" : "Higher Self"}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(reflection.date)}</span>
                  </div>
                  <p className="text-sm">{reflection.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center italic py-4">
                No reflections recorded yet. Begin your inner journey.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShadowSelfMonitor;
