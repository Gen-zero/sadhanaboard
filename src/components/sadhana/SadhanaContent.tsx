import React from 'react';
import SadhanaSelection from './SadhanaSelection';
import SadhanaSetupForm from './SadhanaSetupForm';
import SadhanaWelcome from './SadhanaWelcome';
import SadhanaDetails from './SadhanaDetails';
import SadhanaViewer from './SadhanaViewer';
import { useSettings } from '@/hooks/useSettings';
import { useDefaultThemeStyles } from '@/hooks/useDefaultThemeStyles';
import type { SadhanaData } from '@/hooks/useSadhanaData';
import type { StoreSadhana } from '@/types/store';

interface SadhanaContentProps {
  isEditing: boolean;
  view3D: boolean;
  hasStarted: boolean;
  isCreating: boolean;
  isSelecting: boolean;
  sadhanaData: SadhanaData | null;
  paperContent: string;
  setView3D: (value: boolean) => void;
  onStartSadhana: () => void;
  onCancelSadhana: () => void;
  onCreateSadhana: (data: SadhanaData) => void;
  onUpdateSadhana: (data: SadhanaData) => void;
  onSelectStoreSadhana: (storeSadhana: StoreSadhana) => void;
  onCreateCustomSadhana: () => void;
  status?: 'active' | 'completed' | 'broken';
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
  status = 'active'
}: SadhanaContentProps) => {
  const { settings } = useSettings();
  const { isDefaultTheme, defaultThemeClasses } = useDefaultThemeStyles();
  
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
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: isDefaultTheme ? 'rgba(255, 255, 255, 0.1)' : 'hsl(var(--primary) / 0.1)',
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s infinite ease-in-out, pulse ${Math.random() * 8 + 4}s infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.3 + 0.1
            }}
          ></div>
        ))}
      </div>
      
      {/* Decorative corner elements */}
      <div className={`absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 ${isDefaultTheme ? defaultThemeClasses.border : 'border-amber-400/50'} rounded-tl-lg`}></div>
      <div className={`absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 ${isDefaultTheme ? defaultThemeClasses.border : 'border-amber-400/50'} rounded-tr-lg`}></div>
      <div className={`absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 ${isDefaultTheme ? defaultThemeClasses.border : 'border-amber-400/50'} rounded-bl-lg`}></div>
      <div className={`absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 ${isDefaultTheme ? defaultThemeClasses.border : 'border-amber-400/50'} rounded-br-lg`}></div>
      
      {/* Sacred thread border */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${isDefaultTheme ? 'bg-gradient-to-r from-transparent via-white to-transparent' : 'bg-gradient-to-r from-transparent via-amber-500 to-transparent'}`}></div>
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDefaultTheme ? 'bg-gradient-to-r from-transparent via-white to-transparent' : 'bg-gradient-to-r from-transparent via-amber-500 to-transparent'}`}></div>
      
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
          {/* Content will be rendered by the parent component */}
        </div>
      )}
    </div>
  );
};

export default SadhanaContent;