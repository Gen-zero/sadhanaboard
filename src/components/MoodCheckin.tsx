import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MoodOption {
  emoji: string;
  label: string;
  suggestion: string;
  practice: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    emoji: "😊",
    label: "Joyful",
    suggestion: "Maintain your positive energy with a gratitude practice",
    practice: "Write down 3 things you're grateful for"
  },
  {
    emoji: "🧘",
    label: "Peaceful",
    suggestion: "Deepen your inner calm with mindful breathing",
    practice: "Practice 5 minutes of conscious breathing"
  },
  {
    emoji: "😔",
    label: "Low Energy",
    suggestion: "Gently uplift your spirit with energizing practices",
    practice: "Do 10 minutes of gentle stretching or walking meditation"
  },
  {
    emoji: "🙏",
    label: "Seeking Guidance",
    suggestion: "Connect with the divine through prayer or chanting",
    practice: "Chant your favorite mantra 27 times"
  },
  {
    emoji: "😤",
    label: "Frustrated",
    suggestion: "Release tension and find balance through calming techniques",
    practice: "Practice progressive muscle relaxation for 10 minutes"
  },
  {
    emoji: "😴",
    label: "Tired",
    suggestion: "Recharge with restorative practices",
    practice: "Take a 10-minute mindful rest or yoga nidra"
  }
];

const MoodCheckin = () => {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const { toast } = useToast();

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood);
    
    toast({
      title: `Feeling ${mood.label}?`,
      description: mood.suggestion,
      action: (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            toast({
              title: "Quick Practice Suggestion",
              description: mood.practice,
            });
          }}
        >
          See Practice
        </Button>
      ),
    });
  };

  return (
    <Card className="border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span className="text-lg">How are you feeling today?</span>
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {MOOD_OPTIONS.map((mood) => (
            <button
              key={mood.emoji}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                selectedMood?.emoji === mood.emoji
                  ? "bg-purple-500/20 border border-purple-500/50 scale-105"
                  : "bg-background/50 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30"
              }`}
              onClick={() => handleMoodSelect(mood)}
              aria-label={mood.label}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs mt-1 text-muted-foreground">{mood.label}</span>
            </button>
          ))}
        </div>
        {selectedMood && (
          <div className="mt-3 pt-3 border-t border-purple-500/20">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{selectedMood.emoji} {selectedMood.label}:</span> {selectedMood.suggestion}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 w-full"
              onClick={() => {
                toast({
                  title: "Quick Practice Suggestion",
                  description: selectedMood.practice,
                });
              }}
            >
              Try this {selectedMood.label.toLowerCase()} practice (1-2 min)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodCheckin;