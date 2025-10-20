
import { useState, useRef, useEffect } from 'react';
import { MoonStar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

interface MeditationSession {
  duration: number; // in seconds
  title: string;
  description: string;
  audioSrc?: string;
}

const GuidedMeditation = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedSession, setSelectedSession] = useState<MeditationSession>({
    duration: 300, // 5 minutes
    title: "Divine Connection",
    description: "Connect with your higher self through guided visualization",
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Meditation sessions
  const meditationSessions: MeditationSession[] = [
    {
      duration: 300, // 5 minutes
      title: "Divine Connection",
      description: "Connect with your higher self through guided visualization",
      audioSrc: "/sounds/ambient.mp3"
    },
    {
      duration: 600, // 10 minutes
      title: "Shadow Integration",
      description: "Embrace your shadow aspects with love and acceptance",
      audioSrc: "/sounds/ambient.mp3"
    }
  ];

  useEffect(() => {
    // Setup audio
    audioRef.current = new Audio(selectedSession.audioSrc || "/sounds/ambient.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedSession]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startMeditation = () => {
    if (isPlaying) return;
    
    // Start playing audio
    if (audioRef.current) {
      try {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
          toast({
            title: "Audio Playback Issue",
            description: "Please interact with the page first to enable audio",
          });
        });
      } catch (error) {
        console.error("Audio playback error:", error);
      }
    }

    // Reset timer
    setElapsedTime(0);
    
    // Start timer
    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        if (prev >= selectedSession.duration - 1) {
          // End meditation when time is up
          endMeditation();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    
    setIsPlaying(true);
    
    toast({
      title: "Meditation Started",
      description: `Beginning ${selectedSession.title} meditation session`,
    });
  };

  const endMeditation = () => {
    if (!isPlaying) return;
    
    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Clear timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsPlaying(false);
    
    if (elapsedTime > 10) { // Only show completion if they meditated for at least 10 seconds
      toast({
        title: "Meditation Complete",
        description: `You completed ${formatTime(elapsedTime)} of meditation`,
      });
    }
  };

  return (
    <div className="text-center p-10 space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center">
        <MoonStar className={`h-10 w-10 text-purple-500 ${isPlaying ? 'animate-pulse' : ''}`} />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-medium">{selectedSession.title}</h3>
        <p className="text-muted-foreground">{selectedSession.description}</p>
      </div>
      
      {isPlaying && (
        <div className="text-3xl font-mono font-light">
          {formatTime(elapsedTime)}
        </div>
      )}
      
      <div className="flex justify-center">
        <Button 
          className={`bg-gradient-to-r ${
            isPlaying 
              ? 'from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
              : 'from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-purple-700'
          }`}
          onClick={isPlaying ? endMeditation : startMeditation}
        >
          {isPlaying ? 'End Meditation' : 'Begin Guided Meditation'}
        </Button>
      </div>
    </div>
  );
};

export default GuidedMeditation;
