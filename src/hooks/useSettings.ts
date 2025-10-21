import { useState, useEffect } from 'react';
import { SettingsType } from '@/components/settings/SettingsTypes';

// Define default settings - ALWAYS use dark theme
const DEFAULT_SETTINGS: SettingsType = {
  theme: 'dark', // Enforce dark mode
  language: 'en',
  startPage: 'dashboard',
  general: {
    displayName: '',
    email: '',
  },
  notifications: {
    enabled: true,
    ritualReminders: true,
    goalProgress: true,
    motivationalMessages: true,
  },
  reminders: {
    morning: '06:00',
    midday: '12:00',
    evening: '18:00',
  },
  appearance: {
    fontSize: 16,
    animationsEnabled: true,
    highContrastMode: false,
    colorScheme: 'default',
  },
  privacy: {
    storeDataLocally: true,
    analyticsConsent: false,
    biometricLogin: false,
  },
  meditation: {
    backgroundSounds: true,
    timerDuration: 15,
    intervalBell: true,
    soundVolume: 80,
  },
  accessibility: {
    screenReader: false,
    largeText: false,
    reducedMotion: false,
  },
  profile: {
    showName: true,
    showVarna: true,
    showDeity: true,
    showGotra: true,
    showDikshitStatus: true,
    showDOB: true,
    showGrowthLevel: true,
    showPet: true,
    showLocation: true,
  },
  // Removed divine themes
};

export const useSettings = (): {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
  resetSettings: () => void;
  isLoading: boolean;
} => {
  const [settings, setSettings] = useState<SettingsType>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadSettings = () => {
      try {
        const localSettings = localStorage.getItem('sadhanaSettings');
        if (localSettings) {
          // Merge default settings with saved settings to ensure all properties exist
          const parsedSettings = JSON.parse(localSettings);
          
          const mergedSettings = {
            ...DEFAULT_SETTINGS,
            ...parsedSettings,
            // Ensure nested objects are also properly merged
            general: {
              ...DEFAULT_SETTINGS.general,
              ...parsedSettings.general
            },
            notifications: {
              ...DEFAULT_SETTINGS.notifications,
              ...parsedSettings.notifications
            },
            reminders: {
              ...DEFAULT_SETTINGS.reminders,
              ...parsedSettings.reminders
            },
            appearance: {
              ...DEFAULT_SETTINGS.appearance,
              ...parsedSettings.appearance
            },
            privacy: {
              ...DEFAULT_SETTINGS.privacy,
              ...parsedSettings.privacy
            },
            meditation: {
              ...DEFAULT_SETTINGS.meditation,
              ...parsedSettings.meditation
            },
            accessibility: {
              ...DEFAULT_SETTINGS.accessibility,
              ...parsedSettings.accessibility
            },
            profile: {
              ...DEFAULT_SETTINGS.profile,
              ...parsedSettings.profile
            },
            // Removed divineTheme merging
          };
          
          // ALWAYS enforce dark theme regardless of saved settings
          mergedSettings.theme = 'dark';
          
          setSettings(mergedSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        // If there's an error, use default settings with dark theme enforced
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = (path: (string | number)[], value: any) => {
    // Prevent changing the theme to light mode
    if (path.length === 1 && path[0] === 'theme' && value !== 'dark') {
      console.log('Attempt to change theme to light mode blocked. Enforcing dark mode.');
      value = 'dark';
    }
    
    setSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      
      // Navigate to the target property
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!(key in current)) {
          current[key] = typeof path[i + 1] === 'number' ? [] : {};
        }
        current = current[key];
      }
      
      // Set the value
      const lastKey = path[path.length - 1];
      current[lastKey] = value;
      
      // ALWAYS ensure theme is dark
      newSettings.theme = 'dark';
      
      // Save to localStorage
      try {
        localStorage.setItem('sadhanaSettings', JSON.stringify(newSettings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
      
      return newSettings;
    });
  };

  const resetSettings = () => {
    // Reset to default settings but always keep dark theme
    const resetSettings = { ...DEFAULT_SETTINGS };
    resetSettings.theme = 'dark';
    
    setSettings(resetSettings);
    try {
      localStorage.setItem('sadhanaSettings', JSON.stringify(resetSettings));
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  return { settings, updateSettings, resetSettings, isLoading };
};