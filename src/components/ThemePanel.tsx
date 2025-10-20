import { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLandingPageThemes, themeUtils } from '@/themes';

const ThemePanel = () => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, updateSettings } = useSettings();
  const [globalMode, setGlobalMode] = useState(false); // toggle between landing vs global theme

  // Hide theme panel on landing page
  const isLandingPage = location.pathname === '/landingpage';
  if (isLandingPage) {
    return null;
  }

  const themeOptions = getLandingPageThemes();
  
  // Sync currentTheme with settings
  useEffect(() => {
    if (settings?.appearance?.colorScheme) {
      setCurrentTheme(settings.appearance.colorScheme);
    }
  }, [settings?.appearance?.colorScheme]);

  // Apply theme to body when currentTheme changes
  useEffect(() => {
    // remove legacy theme-* classes
    Array.from(document.body.classList)
      .filter((c) => c.startsWith('theme-') || c.endsWith('-theme'))
      .forEach((c) => document.body.classList.remove(c));

    document.body.classList.add(`theme-${currentTheme}`);

    // Apply colors from registry if available
    const active = themeOptions.find((t) => t.metadata.id === currentTheme);
    if (active) {
      themeUtils.applyThemeColors(active.colors as any);
    }
  }, [currentTheme]);

  const handleThemeChange = (themeId: string) => {
    const selectedTheme = themeOptions.find(theme => theme.metadata.id === themeId);
    if (globalMode) {
      // Apply as global theme in settings using the path-based API
      if (updateSettings) {
        updateSettings(['appearance', 'colorScheme'], themeId);
      }
      setCurrentTheme(themeId);
    } else if (selectedTheme && selectedTheme.metadata?.isLandingPage && (selectedTheme.metadata as any).landingPagePath) {
      // Navigate to the landing page for this theme
      navigate((selectedTheme.metadata as any).landingPagePath || selectedTheme.metadata.landingPagePath);
    } else {
      // Apply the theme locally (component level)
      setCurrentTheme(themeId);
    }
    
    setIsOpen(false);
  };

  const getCurrentTheme = () => {
    return themeOptions.find(theme => theme.metadata.id === currentTheme) || themeOptions[0];
  };

  // Determine button style based on current theme
  const getButtonClass = () => 'flex items-center gap-2 bg-background/80 backdrop-blur-lg border border-purple-500/20 hover:bg-background/90';

  const getMainButtonIcon = () => {
    const active = getCurrentTheme();
    return themeUtils.renderThemeIcon(active as any, 'h-6 w-6');
  };

  return (
    <div className="relative z-[60]">
      <Button
        variant="outline"
        className={getButtonClass()}
        onClick={() => setIsOpen(!isOpen)}
      >
        {getMainButtonIcon()}
        <span className="text-sm">Themes</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-background/90 backdrop-blur-xl rounded-xl border border-purple-500/20 shadow-2xl z-[60]">
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Select Theme</div>
              <div className="text-xs text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setGlobalMode(!globalMode)}
                  className="px-2 py-1 rounded bg-background/10 text-xs border border-muted-foreground"
                  aria-pressed={globalMode}
                >
                  {globalMode ? 'Global Theme' : 'Landing Page'}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              {themeOptions.map((theme) => {
                const id = theme.metadata.id;
                const isActive = currentTheme === id;
                return (
                  <Button
                    key={id}
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full justify-start h-auto py-3 px-3 rounded-lg transition-all duration-300 ${isActive ? 'bg-gradient-to-r text-white border-0' : 'justify-start hover:bg-background/50'}`}
                    onClick={() => handleThemeChange(id)}
                  >
                    <div className="flex items-center w-full">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-purple-500/10 text-purple-400'}`}>
                        {themeUtils.renderThemeIcon(theme as any, 'h-8 w-8')}
                      </div>
                      <div className="ml-3 text-left">
                        <div className={`font-medium ${isActive ? 'text-white' : 'text-foreground'}`}>
                          {theme.metadata.name}
                        </div>
                        <div className={`text-xs ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {theme.metadata.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemePanel;