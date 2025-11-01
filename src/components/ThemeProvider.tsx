import { useEffect, useRef, useMemo, useState } from 'react';
import { SettingsType } from '@/components/settings/SettingsTypes';
import i118n from '@/lib/i18n';
import { getThemeById, listThemes, themeUtils } from '@/themes';

interface ThemeProviderProps {
  settings: SettingsType;
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ settings, children }) => {
  const previousThemeRef = useRef<string | undefined>(undefined);
  const [isReloading, setIsReloading] = useState(false);
  const reloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
  
  useEffect(() => {
    // Base theme - ALWAYS use dark mode regardless of settings
    const baseTheme = 'dark';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(baseTheme);
    
    // Apply appearance settings
    const appearance = memoizedSettings?.appearance;
    
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
    
    // Apply color scheme via registry-driven classes + CSS variables
    if (appearance?.colorScheme) {
      const selected = appearance.colorScheme;
      console.log('ThemeProvider: Applying color scheme:', selected);
      
      // Check if theme actually changed
      if (previousThemeRef.current !== selected) {
        console.log('ThemeProvider: Theme changed from', previousThemeRef.current, 'to', selected);
        
        // Show loading indicator and reload the page
        if (previousThemeRef.current !== undefined) {
          setIsReloading(true);
          // Show a loading message
          const loadingDiv = document.createElement('div');
          loadingDiv.id = 'theme-loading-indicator';
          loadingDiv.innerHTML = `
            <div style="
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.8);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              z-index: 9999;
              color: white;
              font-family: -apple-system, BlinkMacSystemFont, 'San Francisco', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
            ">
              <div style="
                width: 40px;
                height: 40px;
                border: 4px solid rgba(139, 92, 246, 0.3);
                border-top: 4px solid #8b5cf6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
              "></div>
              <div style="font-size: 18px; font-weight: 500;">
                Applying new theme...
              </div>
            </div>
            <style>
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          `;
          document.body.appendChild(loadingDiv);
          
          // Clear any existing timeout
          if (reloadTimeoutRef.current) {
            clearTimeout(reloadTimeoutRef.current);
          }
          
          // Reload the page after a short delay to show the loading indicator
          reloadTimeoutRef.current = setTimeout(() => {
            window.location.reload();
          }, 500);
        }
        
        // Add a small delay to ensure smooth transition for initial load
        setTimeout(() => {
          // remove any known color-scheme-* and theme-* classes conservatively
          Array.from(document.body.classList)
            .filter((c) => c.startsWith('color-scheme-') || c.startsWith('theme-') || c.endsWith('-theme'))
            .forEach((c) => {
              console.log('ThemeProvider: Removing class:', c);
              document.body.classList.remove(c);
            });

          if (selected && selected !== 'default') {
            // add a theme class for legacy CSS that expects it
            const themeClass = `theme-${selected}`;
            console.log('ThemeProvider: Adding theme class:', themeClass);
            document.body.classList.add(themeClass);

            // apply CSS vars if the theme is in registry
            const themeDef = getThemeById(selected as string);
            if (!themeDef) {
              console.warn(`Unknown theme id '${selected}', falling back to default`);
            } else {
              console.log('ThemeProvider: Found theme definition:', themeDef);
              // apply theme token colors
              try {
                console.log('ThemeProvider: Applying theme colors:', themeDef.colors);
                // Convert ThemeColors to Record<string, string>
                const colorsRecord: Record<string, string> = {};
                Object.entries(themeDef.colors).forEach(([key, value]) => {
                  colorsRecord[key] = value as string;
                });
                themeUtils.applyThemeColors(colorsRecord);
                
                // apply theme CSS if specified
                themeUtils.applyThemeCSS(themeDef);
              } catch(e) {
                console.warn('applyThemeColors failed', e);
              }
            }
          }
          
          // Update the ref to the current theme
          previousThemeRef.current = selected;
        }, 10);
      }
    }
    
    // Apply language setting
    if (memoizedSettings?.language) {
      const languageMap: Record<string, string> = {
        'english': 'en',
        'hindi': 'hi'
      };
      
      const languageCode = languageMap[memoizedSettings.language] || 'en';
      i118n.changeLanguage(languageCode);
    }
    
    // Apply explicit themeColors from settings if present (overrides)
    // Note: themeColors is not part of the standard SettingsType, but may be present in some custom implementations
    const explicitColors = (memoizedSettings?.appearance as Record<string, unknown>)?.themeColors || 
                          (memoizedSettings as Record<string, unknown>)?.themeColors;
    if (explicitColors && typeof explicitColors === 'object' && explicitColors !== null) {
      try {
        themeUtils.applyThemeColors(explicitColors as Record<string, string>);
      } catch(e) {
        console.warn('applyThemeColors failed for explicit colors', e);
      }
    }
  }, [memoizedSettings?.theme, memoizedSettings?.appearance, memoizedSettings?.language]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
    };
  }, []);

  // If we're reloading, don't render children
  if (isReloading) {
    return null;
  }

  return <>{children}</>;
};

export default ThemeProvider;