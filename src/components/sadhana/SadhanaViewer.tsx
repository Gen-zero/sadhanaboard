import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import SceneContainer from './SceneContainer';
import ViewerControls from './ViewerControls';
import ViewerFooter from './ViewerFooter';
import CosmicBackground from './CosmicBackground';
import { SadhanaData } from '@/hooks/useSadhanaData';
import { Dispatch, SetStateAction } from 'react';

interface SadhanaViewerProps {
  sadhanaData: SadhanaData | null;
  setView3D: Dispatch<SetStateAction<boolean>>;
}

const SadhanaViewer = ({ sadhanaData, setView3D }: SadhanaViewerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  
  // Format paper content from sadhana data
  const formatPaperContent = (data: SadhanaData | null): string => {
    if (!data) return '';
    
    return `
Purpose:
${data.purpose}

Goal:
${data.goal}

Divine Focus:
${data.deity}

Duration:
${data.durationDays} days

Message:
"${data.message}"

My Offerings:
${data.offerings.map((o, i) => `${i+1}. ${o}`).join('\n')}
    `;
  };
  
  const paperContent = formatPaperContent(sadhanaData);
  
  useEffect(() => {
    // Create ambient sound
    const audio = new Audio('/sounds/ambient.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };
  
  const handlePrint = () => {
    // Implementation for printing functionality
    console.log('Printing sadhana');
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 rounded-lg overflow-hidden shadow-2xl relative h-[600px]">
      <CosmicBackground />
      
      <ViewerControls 
        audioPlaying={audioPlaying} 
        toggleAudio={toggleAudio} 
        handlePrint={handlePrint} 
        setView3D={setView3D}
      />
      
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        className="h-full w-full"
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <SceneContainer paperContent={paperContent} />
      </Canvas>
      
      <ViewerFooter />
    </div>
  );
};

export default SadhanaViewer;