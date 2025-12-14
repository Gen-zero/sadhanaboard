import React, { useState, useEffect, useCallback } from 'react';
import { Settings as SettingsIcon, RotateCcw, Award } from 'lucide-react';
import Layout from '@/components/Layout';
import { TransparentGlassMorphismContainer } from '@/components/design/SadhanaDesignComponents';
import { BeadType, Settings as BeadSettings } from '@/types';
import { BEAD_CONFIGS } from '@/constants';
import { Bead, SettingsModal } from '@/components/beadcounter';
import { useAudio } from '@/hooks/beadcounter';

const BeadCounterPage = () => {
  // State initialization with LocalStorage
  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem('mala-count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [malaCompleted, setMalaCompleted] = useState<number>(() => {
    const saved = localStorage.getItem('mala-rounds');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [selectedBeadType, setSelectedBeadType] = useState<BeadType>(() => {
    const saved = localStorage.getItem('mala-bead-type');
    return (saved as BeadType) || BeadType.TULSI;
  });

  const [settings, setSettings] = useState<BeadSettings>(() => {
    const saved = localStorage.getItem('mala-settings');
    return saved ? JSON.parse(saved) : {
      soundEnabled: true,
      hapticEnabled: true,
      vibrationDuration: 15,
      targetCount: 108
    };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [animateBead, setAnimateBead] = useState(false); // Trigger for slide animation
  
  // Audio Hook
  const { playClick, playChime } = useAudio(settings.soundEnabled);

  // Persistence Effects
  useEffect(() => localStorage.setItem('mala-count', count.toString()), [count]);
  useEffect(() => localStorage.setItem('mala-rounds', malaCompleted.toString()), [malaCompleted]);
  useEffect(() => localStorage.setItem('mala-bead-type', selectedBeadType), [selectedBeadType]);
  useEffect(() => localStorage.setItem('mala-settings', JSON.stringify(settings)), [settings]);

  // Handlers
  const handleIncrement = useCallback(() => {
    // 1. Audio Feedback
    if (count === settings.targetCount - 1) {
      playChime();
    } else {
      playClick();
    }

    // 2. Haptic Feedback
    if (settings.hapticEnabled && navigator.vibrate) {
      if (count === settings.targetCount - 1) {
        navigator.vibrate([50, 50, 50]); // Triple vibe for completion
      } else {
        navigator.vibrate(settings.vibrationDuration);
      }
    }

    // 3. Animation Trigger
    setAnimateBead(true);
    setTimeout(() => setAnimateBead(false), 200); // Reset animation class

    // 4. State Update
    setCount((prev) => {
      const next = prev + 1;
      if (next > settings.targetCount) {
        setMalaCompleted(m => m + 1);
        return 0; // Reset for next round automatically
      }
      return next;
    });

  }, [count, settings, playClick, playChime]);

  const handleReset = () => {
    if (confirm("Reset current mala progress?")) {
      setCount(0);
    }
  };

  const handleFullReset = () => {
    if (confirm("Reset ALL progress including completed rounds?")) {
      setCount(0);
      setMalaCompleted(0);
    }
  };

  const currentBeadConfig = BEAD_CONFIGS[selectedBeadType];

  // Make background fully transparent to match Sadhana design theme
  const getBgStyle = () => {
    switch (selectedBeadType) {
      case BeadType.RUDRAKSHA: return 'bg-transparent text-orange-950';
      case BeadType.KAMAL_GATTA: return 'bg-transparent text-slate-900';
      case BeadType.SPHATIK: return 'bg-transparent text-cyan-950';
      default: return 'bg-transparent text-stone-800';
    }
  };

  return (
    <Layout>
      <div className={`h-[calc(100vh-4rem)] w-full flex flex-col overflow-hidden relative ${getBgStyle()} transition-colors duration-500 rounded-xl`}>
        <TransparentGlassMorphismContainer className="h-full flex flex-col">
          {/* --- Top Bar --- */}
          <header className="flex justify-between items-center p-6 z-10 relative">
            <div className="flex items-center space-x-2">
              {/* Mini badge for rounds */}
              <div className="flex flex-col">
                <span className="text-xs font-semibold tracking-widest opacity-60 uppercase">Rounds</span>
                <div className="flex items-center space-x-1">
                  <Award size={18} className="text-amber-500" />
                  <span className="text-xl font-bold font-mono">{malaCompleted}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 rounded-full hover:bg-black/5 transition-colors"
              aria-label="Settings"
            >
              <SettingsIcon size={24} className="opacity-70" />
            </button>
          </header>

          {/* --- Main Interactive Area --- */}
          {/* We make this entire area clickable for ease of use on mobile */}
          <main 
            className="flex-1 flex flex-col items-center justify-center relative touch-manipulation cursor-pointer"
            onClick={handleIncrement}
            role="button"
            tabIndex={0}
            aria-label="Tap to count bead"
          >
            
            {/* Background Decorative String */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-amber-900/10 -translate-y-1/2 -z-0"></div>

            {/* Thread for the bead */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-orange-800/30 left-1/2 -translate-x-1/2 z-0 hidden md:block"></div>

            {/* Previous Bead (Ghost) - Visual cue for movement */}
            <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-[180%] opacity-30 scale-50 transition-transform duration-300 ${animateBead ? 'translate-y-[250%] opacity-0' : ''}`}>
              <Bead config={currentBeadConfig} size="md" />
            </div>

            {/* THE MAIN BEAD */}
            <div className="relative z-10 p-8">
              <div className={`transform transition-all duration-150 ease-out ${animateBead ? 'translate-y-[20%] scale-95' : 'translate-y-0 scale-100'}`}>
                <Bead 
                  config={currentBeadConfig} 
                  size="xl" 
                  isCenter={true} 
                  className="shadow-2xl"
                />
              </div>
            </div>

            {/* Next Bead (Ghost) */}
            <div className={`absolute left-1/2 -translate-x-1/2 translate-y-[180%] opacity-30 scale-50 transition-transform duration-300 ${animateBead ? 'translate-y-[80%] opacity-100' : ''}`}>
              <Bead config={currentBeadConfig} size="md" />
            </div>

            {/* Count Display */}
            <div className="absolute bottom-[15%] flex flex-col items-center pointer-events-none select-none">
              <span className="text-6xl md:text-8xl font-light tracking-tight tabular-nums transition-all">
                {count}
              </span>
              <span className="text-sm uppercase tracking-[0.2em] opacity-50 mt-2">
                / {settings.targetCount}
              </span>
            </div>

            {/* Tap Prompt (Only shows if count is 0) */}
            {count === 0 && malaCompleted === 0 && (
              <div className="absolute bottom-[10%] text-sm opacity-40 animate-pulse pointer-events-none">
                Tap anywhere to start
              </div>
            )}

          </main>

          {/* --- Bottom Controls --- */}
          <footer className="p-6 flex justify-between items-center relative z-10 bg-gradient-to-t from-transparent to-transparent">
            <button 
              onClick={(e) => { e.stopPropagation(); handleReset(); }}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-medium transition-colors"
            >
              <RotateCcw size={16} />
              <span>Reset Mala</span>
            </button>

            {/* Current Bead Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/60 border border-black/5 backdrop-blur-sm shadow-sm">
              <div className={`w-3 h-3 rounded-full ${currentBeadConfig.color}`}></div>
              <span className="text-xs font-semibold opacity-70">{currentBeadConfig.name}</span>
            </div>
          </footer>

          {/* --- Modals --- */}
          <SettingsModal 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            selectedBead={selectedBeadType}
            onSelectBead={setSelectedBeadType}
            settings={settings}
            onUpdateSettings={setSettings}
          />
        </TransparentGlassMorphismContainer>
      </div>
    </Layout>
  );
};

export default BeadCounterPage;