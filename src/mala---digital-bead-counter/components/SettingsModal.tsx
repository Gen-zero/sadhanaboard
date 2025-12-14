import React from 'react';
import { X, Volume2, VolumeX, Smartphone, ZapOff } from 'lucide-react';
import { BeadType, BeadConfig, Settings } from '../types';
import { BEAD_CONFIGS } from '../constants';
import Bead from './Bead';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBead: BeadType;
  onSelectBead: (type: BeadType) => void;
  settings: Settings;
  onUpdateSettings: (newSettings: Settings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedBead,
  onSelectBead,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-orange-50/50">
          <h2 className="text-xl font-bold text-orange-900">Bead Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-orange-100 rounded-full text-orange-800 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8 no-scrollbar">
          
          {/* Controls Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Feedback</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  settings.soundEnabled 
                  ? 'border-orange-500 bg-orange-50 text-orange-900' 
                  : 'border-gray-200 text-gray-400'
                }`}
              >
                {settings.soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                <span className="mt-2 text-sm font-medium">Sound</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ ...settings, hapticEnabled: !settings.hapticEnabled })}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  settings.hapticEnabled 
                  ? 'border-orange-500 bg-orange-50 text-orange-900' 
                  : 'border-gray-200 text-gray-400'
                }`}
              >
                {settings.hapticEnabled ? <Smartphone size={24} /> : <ZapOff size={24} />}
                <span className="mt-2 text-sm font-medium">Haptics</span>
              </button>
            </div>
          </div>

          {/* Bead Selection Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Choose Material</h3>
            <div className="grid grid-cols-1 gap-3">
              {(Object.values(BEAD_CONFIGS) as BeadConfig[]).map((bead) => (
                <button
                  key={bead.type}
                  onClick={() => onSelectBead(bead.type)}
                  className={`flex items-center p-3 rounded-2xl border-2 transition-all text-left ${
                    selectedBead === bead.type
                      ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200 ring-offset-1'
                      : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0 mr-4">
                    <Bead config={bead} size="sm" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${selectedBead === bead.type ? 'text-orange-900' : 'text-gray-700'}`}>
                      {bead.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{bead.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-xs text-gray-400">
          Chant with focus &bull; 108 Beads
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;