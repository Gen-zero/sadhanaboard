import React from 'react';
import SadhanaDetails from './SadhanaDetails';
import SadhanaViewer from './SadhanaViewer';
import { useState, useEffect } from 'react';
import PaperScroll2D from './PaperScroll2D';
import AnimatedParchment from './AnimatedParchment';
import SadhanaWelcome from './SadhanaWelcome';
import SadhanaSetupForm from './SadhanaSetupForm';
import SadhanaSelection from './SadhanaSelection';
import { SadhanaData } from '@/hooks/useSadhanaData';
import { StoreSadhana } from '@/types/store';
import { useSettings } from '@/hooks/useSettings';
import { Dispatch, SetStateAction } from 'react';

interface SadhanaContentProps {
  isEditing: boolean;
  view3D: boolean;
  hasStarted: boolean;
  isCreating: boolean;
  isSelecting: boolean;
  sadhanaData: SadhanaData | null;
  paperContent: string;
  setView3D: Dispatch<SetStateAction<boolean>>;
  onStartSadhana: () => void;
  onCancelSadhana: () => void;
  onCreateSadhana: (data: SadhanaData) => void;
  onUpdateSadhana: (data: SadhanaData) => void;
  onSelectStoreSadhana: (sadhana: StoreSadhana) => void;
  onCreateCustomSadhana: () => void;
  status?: 'active' | 'completed' | 'broken'; // Add status prop
}

const SadhanaContent = ({
  isEditing,
  view3D,
  hasStarted,
  isCreating,
  isSelecting,
  sadhanaData,
  paperContent,
  setView3D,
  onStartSadhana,
  onCancelSadhana,
  onCreateSadhana,
  onUpdateSadhana,
  onSelectStoreSadhana,
  onCreateCustomSadhana,
  status = 'active' // Default to active
}: SadhanaContentProps) => {
  const { settings } = useSettings();
  
  // Check if Shiva theme is active
  const isShivaTheme = settings?.appearance?.colorScheme === 'shiva';

  // Render different components based on state
  if (isSelecting) {
    return (
      <SadhanaSelection 
        onSelectStoreSadhana={onSelectStoreSadhana}
        onCreateCustomSadhana={onCreateCustomSadhana}
        onCancel={onCancelSadhana}
      />
    );
  }

  if (isCreating) {
    return (
      <SadhanaSetupForm 
        onCreateSadhana={onCreateSadhana}
        onCancel={onCancelSadhana}
      />
    );
  }

  if (!hasStarted) {
    return (
      <SadhanaWelcome onStartSadhana={onStartSadhana} />
    );
  }

  return (
    <div className="transition-all duration-500 ease-in-out transform hover:scale-[1.01] relative">
      {/* Mystical background elements */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none -z-10">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-400/20"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.4 + 0.1
            }}
          ></div>
        ))}
      </div>
      
      <div className={`rounded-xl p-6 relative overflow-hidden ${isShivaTheme ? 'bg-background/50' : 'bg-gradient-to-br from-amber-50/30 via-yellow-50/30 to-amber-100/30'} border border-amber-200/50 shadow-lg`}>
        {/* Decorative corner elements */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-amber-400/50 rounded-tl-lg"></div>
        <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-amber-400/50 rounded-tr-lg"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-amber-400/50 rounded-bl-lg"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-amber-400/50 rounded-br-lg"></div>
        
        {/* Sacred thread border */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        
        {isEditing ? (
          <SadhanaDetails 
            sadhanaData={sadhanaData}
            onUpdateSadhana={onUpdateSadhana}
            setView3D={setView3D}
            view3D={view3D}
          />
        ) : view3D ? (
          <SadhanaViewer 
            sadhanaData={sadhanaData}
            setView3D={setView3D}
          />
        ) : (
          <div className="relative">
            {/* Removed the Sparkles icon that was above the parchment */}
            <AnimatedParchment 
              content={paperContent} 
              isCompleted={status === 'completed'}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SadhanaContent;