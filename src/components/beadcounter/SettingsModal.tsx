import React from 'react';
import { X, Volume2, VolumeX, Smartphone, ZapOff } from 'lucide-react';
import { BeadType, BeadConfig, Settings } from '@/types/beadTypes';
import { BEAD_CONFIGS } from '@/constants/beadConfigs';
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Sound Toggle */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Sound</h3>
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-700 mr-3">
                  {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Audible Feedback</h4>
                  <p className="text-xs text-gray-500">Click sounds & completion chimes</p>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.soundEnabled ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>

          {/* Haptics Toggle */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Haptics</h3>
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-700 mr-3">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Vibration</h4>
                  <p className="text-xs text-gray-500">Tactile feedback on tap</p>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ ...settings, hapticEnabled: !settings.hapticEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.hapticEnabled ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.hapticEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {settings.hapticEnabled && (
              <div className="space-y-2 pl-2">
                <label htmlFor="vibrationDuration" className="text-xs font-medium text-gray-500">Vibration Duration (ms)</label>
                <input
                  id="vibrationDuration"
                  type="range"
                  min="5"
                  max="50"
                  value={settings.vibrationDuration}
                  onChange={(e) => onUpdateSettings({ ...settings, vibrationDuration: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5ms</span>
                  <span className="font-medium text-orange-700">{settings.vibrationDuration}ms</span>
                  <span>50ms</span>
                </div>
              </div>
            )}
          </div>

          {/* Target Count */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Target</h3>
            <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-700 mr-3">
                  <ZapOff size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Beads Per Mala</h4>
                  <p className="text-xs text-gray-500">Traditional count is 108</p>
                </div>
              </div>
              <select
                value={settings.targetCount}
                onChange={(e) => onUpdateSettings({ ...settings, targetCount: parseInt(e.target.value) })}
                className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-500"
              >
                <option value={27}>27 (¼ Mala)</option>
                <option value={54}>54 (½ Mala)</option>
                <option value={108}>108 (Full Mala)</option>
                <option value={216}>216 (2 Malas)</option>
                <option value={1008}>1008 (Complete Cycle)</option>
              </select>
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
                  className={`flex items-center p-3 rounded-2xl border-2 transition-all text-left ${selectedBead === bead.type
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