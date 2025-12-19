import React from 'react';
import SadhanaDetails from './SadhanaDetails';
import SadhanaViewer from './SadhanaViewer';
import { useState, useEffect } from 'react';
import PaperScroll2D from './PaperScroll2D';
import AnimatedParchment from './AnimatedParchment';
import SadhanaWelcome from './SadhanaWelcome';
import SadhanaSetupForm from './SadhanaSetupForm';
import SadhanaSelection from './SadhanaSelection';
import SadhanaCompletionMarker from '../SadhanaCompletionMarker';
import { SadhanaData } from '@/hooks/useSadhanaData';
import { StoreSadhana } from '@/types/store';
import { useSettings } from '@/hooks/useSettings';
import { useThemeColors } from '@/hooks/useThemeColors';
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
  onSaveAsDraft?: (data: SadhanaData) => void;
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
  onSaveAsDraft,
  status = 'active' // Default to active
}: SadhanaContentProps) => {
  const { settings } = useSettings();
  const { colors } = useThemeColors();
  
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
        onSaveAsDraft={onSaveAsDraft}
      />
    );
  }

  if (!hasStarted) {
    return (
      <SadhanaWelcome onStartSadhana={onStartSadhana} />
    );
  }

  return (
    <div className="transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
      <div className={`rounded-lg p-6 ${isShivaTheme ? 'bg-transparent' : 'bg-transparent'}`}>
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
          <AnimatedParchment 
            content={paperContent} 
            isCompleted={status === 'completed'}
          />
        )}
        
        {/* Completion Marker - Visible when viewing Sadhana paper (both 2D and 3D) */}
        {!isEditing && sadhanaData && (
          <div className="mt-6 pt-4 border-t border-amber-900/50">
            <SadhanaCompletionMarker 
              sadhanaId={sadhanaData.id || ''}
              date={new Date().toISOString().split('T')[0]}
              showLabel={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SadhanaContent;