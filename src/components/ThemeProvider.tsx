import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { SettingsType } from '@/components/settings/SettingsTypes';
import i118n from '@/lib/i18n';
import { getThemeById, listThemes, themeUtils } from '@/themes';
import { performanceMonitor } from '@/utils/performanceMonitor';

interface ThemeProviderProps {
  settings: SettingsType;
  children: React.ReactNode;
}

interface ThemeSwitchState {
  isLoading: boolean;
  progress: number;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ settings, children }) => {
  const previousThemeRef = useRef<string | undefined>(undefined);
  const [switchState, setSwitchState] = useState<ThemeSwitchState>({
    isLoading: false,
    progress: 0
  });
  const switchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const switchAbortRef = useRef<boolean>(false);
  
  // Memoize settings values to prevent unnecessary re-renders
  const memoizedSettings = useMemo(() => settings, [
    settings,
    settings?.theme,
    settings?.appearance?.colorScheme,
    settings?.appearance?.fontSize,
    settings?.appearance?.animationsEnabled,
    settings?.appearance?.highContrastMode,
    settings?.language
  ]);
  
  // Load theme CSS dynamically
  const loadThemeCSS = useCallback(async (cssPath: string, themeId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      const existing = document.getElementById(`theme-css-${themeId}`);
      if (existing) {
        resolve();
        return;
      }

      // Remove previous theme CSS
      document.querySelectorAll('[id^="theme-css-"]').forEach(el => {
        if (el.id !== `theme-css-${themeId}`) {
          el.remove();
        }
      });

      const link = document.createElement('link');
      link.id = `theme-css-${themeId}`;
      link.rel = 'stylesheet';
      link.href = cssPath;
      
      const timeout = setTimeout(() => {
        reject(new Error(`CSS load timeout for ${cssPath}`));
      }, 5000);

      link.onload = () => {
        clearTimeout(timeout);
        resolve();
      };

      link.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load CSS: ${cssPath}`));
      };

      document.head.appendChild(link);
    });
  }, []);
  
  // Apply theme colors smoothly without reload
  const applyThemeSmoothly = useCallback(async (selected: string) => {
    console.log('[ThemeProvider] Starting theme switch to:', selected);
    const themeDef = getThemeById(selected);
    
    if (!themeDef) {
      console.warn(`Unknown theme id '${selected}', falling back to default`);
      return;
    }

    // Prevent rapid successive theme switches
    if (switchAbortRef.current) {
      console.log('[ThemeProvider] Theme switch aborted (rapid switch detected)');
      return;
    }
    
    // START MONITORING
    const isCached = false; // TODO: Check cache
    performanceMonitor.startThemeSwitch(selected, isCached);
    
    setSwitchState({ isLoading: true, progress: 0 });

    try {
      console.log('[ThemeProvider] Step 1: Fade out');
      // Step 1: Fade out (20ms)
      document.body.style.opacity = '0.95';
      document.body.style.transition = 'opacity 150ms ease-in-out';
      setSwitchState(prev => ({ ...prev, progress: 25 }));
      
      await new Promise(resolve => setTimeout(resolve, 20));

      console.log('[ThemeProvider] Step 2: Remove old theme classes');
      // Step 2: Remove old theme classes
      Array.from(document.body.classList)
        .filter((c) => c.startsWith('color-scheme-') || c.startsWith('theme-') || c.endsWith('-theme'))
        .forEach((c) => {
          console.log('[ThemeProvider] Removing class:', c);
          document.body.classList.remove(c);
        });
      
      setSwitchState(prev => ({ ...prev, progress: 40 }));

      console.log('[ThemeProvider] Step 3: Apply new theme class');
      // Step 3: Apply new theme class
      const themeClass = `theme-${selected}`;
      document.body.classList.add(themeClass);
      console.log('[ThemeProvider] Added class:', themeClass);

      console.log('[ThemeProvider] Step 4: Apply colors');
      // Step 4: Apply colors
      const colorsRecord: Record<string, string> = {};
      Object.entries(themeDef.colors).forEach(([key, value]) => {
        colorsRecord[key] = value as string;
      });
      console.log('[ThemeProvider] Colors to apply:', Object.keys(colorsRecord));
      themeUtils.applyThemeColors(colorsRecord);
      performanceMonitor.recordColorsApplied();
      
      setSwitchState(prev => ({ ...prev, progress: 60 }));

      console.log('[ThemeProvider] Step 5: Load theme CSS');
      // Step 5: Load theme CSS asynchronously
      if (themeDef.assets?.css) {
        try {
          console.log('[ThemeProvider] Loading CSS from:', themeDef.assets.css);
          await loadThemeCSS(themeDef.assets.css, selected);
          performanceMonitor.recordCSSLoaded(themeDef.assets.css);
          setSwitchState(prev => ({ ...prev, progress: 90 }));
        } catch (e) {
          console.warn('Failed to load theme CSS:', themeDef.assets.css, e);
        }
      } else {
        console.log('[ThemeProvider] No CSS asset for theme:', selected);
      }

      console.log('[ThemeProvider] Step 6: Fade back in');
      // Step 6: Fade back in
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 30);
      
      setSwitchState(prev => ({ ...prev, progress: 100 }));

      console.log('[ThemeProvider] Step 7: Cleanup');
      // Step 7: Cleanup
      setTimeout(() => {
        document.body.style.transition = '';
        setSwitchState({ isLoading: false, progress: 0 });
        previousThemeRef.current = selected;
        console.log('[ThemeProvider] Theme switch complete:', selected);
        // COMPLETE MONITORING
        performanceMonitor.completeThemeSwitch();
      }, 150);

    } catch (e) {
      console.error('Error applying theme:', e);
      setSwitchState({ isLoading: false, progress: 0 });
    }
  }, [loadThemeCSS]);
  
  useEffect(() => {
    // Base theme - ALWAYS use dark mode regardless of settings
    const baseTheme = 'dark';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(baseTheme);
    
    // Apply appearance settings
    const appearance = memoizedSettings?.appearance;
    
    console.log('[ThemeProvider] useEffect triggered');
    console.log('[ThemeProvider] memoizedSettings:', memoizedSettings);
    console.log('[ThemeProvider] appearance:', appearance);
    console.log('[ThemeProvider] colorScheme:', appearance?.colorScheme);
    console.log('[ThemeProvider] previousThemeRef.current:', previousThemeRef.current);
    
    // Also check localStorage directly to catch updates from useSettings hook
    const localStorageSettings = localStorage.getItem('sadhanaSettings');
    if (localStorageSettings) {
      try {
        const parsed = JSON.parse(localStorageSettings);
        console.log('[ThemeProvider] localStorage colorScheme:', parsed.appearance?.colorScheme);
        if (parsed.appearance?.colorScheme && parsed.appearance.colorScheme !== previousThemeRef.current) {
          console.log('[ThemeProvider] Detected localStorage change, applying theme');
        }
      } catch (e) {
        console.warn('[ThemeProvider] Error reading localStorage:', e);
      }
    }
    
    // Apply font size
    if (appearance?.fontSize) {
      document.documentElement.style.fontSize = `${appearance.fontSize}px`;
    }
    
    // Apply animations setting
    if (appearance?.animationsEnabled !== undefined) {
      if (appearance.animationsEnabled) {
        document.body.classList.remove('reduce-motion');
      } else {
        document.body.classList.add('reduce-motion');
      }
    }
    
    // Apply high contrast mode
    if (appearance?.highContrastMode !== undefined) {
      if (appearance.highContrastMode) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    }
    
    // Apply color scheme
    if (appearance?.colorScheme) {
      const selected = appearance.colorScheme;
      console.log('[ThemeProvider] Checking if theme changed:', { selected, previous: previousThemeRef.current });
      
      // Only apply if theme actually changed
      if (previousThemeRef.current !== selected) {
        console.log('[ThemeProvider] Theme changed! Calling applyThemeSmoothly');
        switchAbortRef.current = false;
        applyThemeSmoothly(selected);
      } else {
        console.log('[ThemeProvider] Theme did not change, skipping');
      }
    }
  }, [memoizedSettings?.appearance?.colorScheme, memoizedSettings?.appearance?.fontSize, 
      memoizedSettings?.appearance?.animationsEnabled, memoizedSettings?.appearance?.highContrastMode, 
      applyThemeSmoothly]);

  // Additional effect to monitor custom settings change events
  useEffect(() => {
    const handleSettingsChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { settings: newSettings, changedPath } = customEvent.detail;
      
      console.log('[ThemeProvider] Custom event received: sadhanaSettingsChanged', {
        settings: newSettings,
        changedPath,
        currentColorScheme: newSettings.appearance?.colorScheme,
        previousColorScheme: previousThemeRef.current
      });
      
      // Check if the colorScheme changed
      if (changedPath && changedPath[0] === 'appearance' && changedPath[1] === 'colorScheme') {
        const newColorScheme = newSettings.appearance?.colorScheme;
        if (newColorScheme && newColorScheme !== previousThemeRef.current) {
          console.log('[ThemeProvider] ColorScheme changed in event! Applying theme:', newColorScheme);
          switchAbortRef.current = false;
          applyThemeSmoothly(newColorScheme);
        }
      }
    };

    // Listen for custom settings changed events
    window.addEventListener('sadhanaSettingsChanged', handleSettingsChanged as EventListener);
    return () => window.removeEventListener('sadhanaSettingsChanged', handleSettingsChanged as EventListener);
  }, [applyThemeSmoothly]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      switchAbortRef.current = true;
      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
      }
    };
  }, []);

  return <>{children}</>;
};

export default ThemeProvider;