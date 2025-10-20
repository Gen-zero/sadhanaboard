import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Sparkles, 
  Check, 
  Type, 
  Contrast, 
  Zap,
  MonitorSmartphone,
  PaletteIcon
} from 'lucide-react';
import { SettingsType } from './SettingsTypes';
import { listThemes, themeUtils, getThemeHealth } from '@/themes';
import { useTranslation } from 'react-i18next';
import { EnhancedTooltip } from '@/components/ui/EnhancedTooltip';
import { BadgeInfo } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

interface AppearanceSettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  settings,
  updateSettings,
}) => {
  const { t } = useTranslation();
  
  // Remove the isChangingTheme state since ThemeProvider now handles this

  // Debug: Log available themes
  const availableThemes = listThemes({ category: undefined, available: true });
  console.log('[DEBUG] Available themes:', availableThemes.map(t => ({
    id: t.metadata.id,
    name: t.metadata.name,
    icon: t.metadata.icon,
    assets: t.assets
  })));

  // Guard against undefined settings or settings still loading
  if (!settings || !settings.appearance) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground mobile-heading-scale settings-header">
          <Palette className="h-5 w-5 text-purple-500" />
          <span className="text-wrap">{t('visual_preferences')}</span>
        </CardTitle>
        <CardDescription className="text-sm mobile-text-scale text-wrap text-muted-foreground settings-subheader">{t('customize_how_the_app_looks_and_feels')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="theme" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-background/50">
            <TabsTrigger 
              value="theme" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-fuchsia-500/20 font-medium touch-target-large"
            >
              <PaletteIcon className="h-4 w-4 mr-2" />
              <span className="text-wrap">{t('themes')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="display" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-fuchsia-500/20 font-medium touch-target-large"
            >
              <MonitorSmartphone className="h-4 w-4 mr-2" />
              <span className="text-wrap">{t('display')}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="theme" className="space-y-8 mt-0">
            {/* Color Scheme Selection */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-lg font-semibold flex items-center gap-2 text-foreground mobile-heading-scale">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <span className="text-wrap">{t('color_scheme')}</span>
                  </Label>
                  <EnhancedTooltip 
                    id="color-scheme-tooltip"
                    content={t('color_scheme_tooltip')}
                  >
                    <BadgeInfo className="h-4 w-4 text-muted-foreground cursor-help" />
                  </EnhancedTooltip>
                </div>
                {/* General Themes Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">{t('general_themes')}</h3>
                  <RadioGroup
                    value={settings.appearance?.colorScheme || 'default'}
                    onValueChange={(value) => {
                      // Directly update the settings without manual loading state
                      updateSettings(['appearance', 'colorScheme'], value);
                    }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                  >
                    {listThemes({ category: undefined, available: true }).filter(t => {
                      // Remove duplicate Krishna and Vishnu themes that come later in the registry
                      // The 'earth' theme is named 'Krishna Theme' and comes before 'krishna' theme
                      // The 'water' theme is named 'Vishnu Theme' and comes before 'vishnu' theme
                      const themeId = (t as any).metadata.id;
                      if (themeId === 'krishna' || themeId === 'vishnu') {
                        return false;
                      }
                      
                      const keep = t.metadata.category === 'color-scheme' || 
                      t.metadata.category === 'hybrid' || 
                      t.metadata.isLandingPage;
                      
                      // Filter for general themes (themes without deity metadata)
                      return keep && !t.metadata.deity;
                    }).map((theme) => {
                      const id = (theme as any).metadata.id;
                      const label = (theme as any).metadata.name || id;
                      const health = getThemeHealth(theme as any);
                      const isHealthy = health.status === 'healthy';
                      const isSelected = settings.appearance?.colorScheme === id;
                      
                      return (
                        <div key={id} className="relative">
                          <RadioGroupItem value={id} id={`scheme-${id}`} className="sr-only" />
                          <Label
                            htmlFor={`scheme-${id}`}
                            className={`flex flex-col items-center justify-between rounded-xl border-2 bg-popover p-4 hover:bg-accent hover:text-accent-foreground transition-all duration-300 cursor-pointer touch-target-large ${
                              isSelected 
                                ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 shadow-lg shadow-purple-500/20' 
                                : 'border-muted hover:border-purple-300 bg-background/50'
                            } ${
                              !isHealthy ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="relative mb-3">
                              <div className="rounded-full w-12 h-12 flex items-center justify-center">
                                {themeUtils.renderThemeIcon(theme as any, 'w-8 h-8 rounded-full')}
                              </div>
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              )}
                              {!isHealthy && (
                                <EnhancedTooltip 
                                  id={`theme-health-${id}`}
                                  content={`Theme health: ${health.status}. Issues: ${health.issues.join(', ')}`}
                                >
                                  <div 
                                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 cursor-help"
                                  />
                                </EnhancedTooltip>
                              )}
                            </div>
                            <span className="mt-2 text-sm font-medium text-center text-foreground mobile-text-scale text-wrap">{label}</span>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Deity Themes Section */}
                <div className="space-y-4 pt-6">
                  <h3 className="text-lg font-semibold text-foreground">{t('deity_themes')}</h3>
                  <RadioGroup
                    value={settings.appearance?.colorScheme || 'default'}
                    onValueChange={(value) => {
                      // Directly update the settings without manual loading state
                      updateSettings(['appearance', 'colorScheme'], value);
                    }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                  >
                    {listThemes({ category: undefined, available: true }).filter(t => {
                      // Remove duplicate Krishna and Vishnu themes that come later in the registry
                      // The 'earth' theme is named 'Krishna Theme' and comes before 'krishna' theme
                      // The 'water' theme is named 'Vishnu Theme' and comes before 'vishnu' theme
                      const themeId = (t as any).metadata.id;
                      if (themeId === 'krishna' || themeId === 'vishnu') {
                        return false;
                      }
                      
                      const keep = t.metadata.category === 'color-scheme' || 
                      t.metadata.category === 'hybrid' || 
                      t.metadata.isLandingPage;
                      
                      // Filter for deity themes (themes with deity metadata)
                      return keep && t.metadata.deity;
                    }).map((theme) => {
                      const id = (theme as any).metadata.id;
                      const label = (theme as any).metadata.name || id;
                      const health = getThemeHealth(theme as any);
                      const isHealthy = health.status === 'healthy';
                      const isSelected = settings.appearance?.colorScheme === id;
                      
                      return (
                        <div key={id} className="relative">
                          <RadioGroupItem value={id} id={`scheme-${id}`} className="sr-only" />
                          <Label
                            htmlFor={`scheme-${id}`}
                            className={`flex flex-col items-center justify-between rounded-xl border-2 bg-popover p-4 hover:bg-accent hover:text-accent-foreground transition-all duration-300 cursor-pointer touch-target-large ${
                              isSelected 
                                ? 'border-purple-500 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 shadow-lg shadow-purple-500/20' 
                                : 'border-muted hover:border-purple-300 bg-background/50'
                            } ${
                              !isHealthy ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="relative mb-3">
                              <div className="rounded-full w-12 h-12 flex items-center justify-center">
                                {themeUtils.renderThemeIcon(theme as any, 'w-8 h-8 rounded-full')}
                              </div>
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              )}
                              {!isHealthy && (
                                <EnhancedTooltip 
                                  id={`theme-health-${id}`}
                                  content={`Theme health: ${health.status}. Issues: ${health.issues.join(', ')}`}
                                >
                                  <div 
                                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 cursor-help"
                                  />
                                </EnhancedTooltip>
                              )}
                            </div>
                            <span className="mt-2 text-sm font-medium text-center text-foreground mobile-text-scale text-wrap">{label}</span>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="display" className="space-y-8 mt-0">
            {/* Font Size */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-lg font-semibold flex items-center gap-2 text-foreground mobile-heading-scale">
                    <Type className="h-5 w-5 text-purple-500" />
                    <span className="text-wrap">{t('font_size')}</span>
                  </Label>
                  <EnhancedTooltip 
                    id="font-size-tooltip"
                    content={t('font_size_tooltip')}
                  >
                    <BadgeInfo className="h-4 w-4 text-muted-foreground cursor-help" />
                  </EnhancedTooltip>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-foreground mobile-text-scale text-wrap">A</span>
                  <Slider
                    value={[settings.appearance?.fontSize || 16]}
                    min={12}
                    max={24}
                    step={1}
                    onValueChange={(value) => updateSettings(['appearance', 'fontSize'], value[0])}
                    className="w-full"
                  />
                  <span className="text-xl font-medium text-foreground mobile-text-scale text-wrap">A</span>
                </div>
                <p className="text-sm text-muted-foreground mobile-text-scale text-wrap">
                  {t('current_font_size')}: {settings.appearance?.fontSize || 16}px
                </p>
              </div>

              <Separator className="my-6 bg-purple-500/20" />
            </div>

            {/* Appearance Toggles */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-purple-500/20 hover:bg-background/70 transition-all duration-300 touch-target-large">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="font-medium flex items-center gap-2 text-foreground mobile-text-scale">
                        <Zap className="h-4 w-4 text-purple-500" />
                        <span className="text-wrap">{t('animations')}</span>
                      </Label>
                      <EnhancedTooltip 
                        id="animations-tooltip"
                        content={t('animations_tooltip')}
                      >
                        <BadgeInfo className="h-4 w-4 text-muted-foreground cursor-help" />
                      </EnhancedTooltip>
                    </div>
                    <p className="text-sm text-muted-foreground mobile-text-scale text-wrap">
                      {t('enable_visual_animations_throughout_the_app')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.appearance?.animationsEnabled ?? true}
                    onCheckedChange={(checked) =>
                      updateSettings(['appearance', 'animationsEnabled'], checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-purple-500/20 hover:bg-background/70 transition-all duration-300 touch-target-large">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="font-medium flex items-center gap-2 text-foreground mobile-text-scale">
                        <Contrast className="h-4 w-4 text-purple-500" />
                        <span className="text-wrap">{t('high_contrast_mode')}</span>
                      </Label>
                      <EnhancedTooltip 
                        id="high-contrast-tooltip"
                        content={t('high_contrast_mode_tooltip')}
                      >
                        <BadgeInfo className="h-4 w-4 text-muted-foreground cursor-help" />
                      </EnhancedTooltip>
                    </div>
                    <p className="text-sm text-muted-foreground mobile-text-scale text-wrap">
                      {t('increase_visual_contrast_for_better_readability')}
                    </p>
                  </div>
                  <Switch
                    checked={settings.appearance?.highContrastMode ?? false}
                    onCheckedChange={(checked) =>
                      updateSettings(['appearance', 'highContrastMode'], checked)
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;