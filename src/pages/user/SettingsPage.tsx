import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Clock, 
  ShieldCheck, 
  Bell, 
  Eye, 
  User, 
  SlidersHorizontal,
  Save,
  Download,
  Upload,
  RotateCcw,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/hooks/useSettings';
import GeneralSettings from '@/components/settings/GeneralSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import MeditationSettings from '@/components/settings/MeditationSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import NotificationsSettings from '@/components/settings/NotificationsSettings';
import AccessibilitySettings from '@/components/settings/AccessibilitySettings';
import ProfileSettings from '@/components/settings/ProfileSettings';
import AdvancedSettings from '@/components/settings/AdvancedSettings';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

// Section icon mapping
const sectionIcons = {
  general: SettingsIcon,
  appearance: Palette,
  meditation: Clock,
  privacy: ShieldCheck,
  notifications: Bell,
  accessibility: Eye,
  profile: User,
  advanced: SlidersHorizontal
};

const SettingsPage = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize to adjust layout
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show loading spinner while settings are loading
  if (!settings) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Since settings are automatically saved through updateSettings, 
    // we'll trigger a manual save to ensure all settings are persisted
    try {
      localStorage.setItem('sadhanaSettings', JSON.stringify(settings));
      setTimeout(() => {
        setIsSaving(false);
        toast({
          title: t('save_settings'),
          description: t('settings_saved_success'),
        });
      }, 500);
    } catch (error) {
      setIsSaving(false);
      toast({
        title: t('save_failed'),
        description: t('settings_save_error'),
        variant: 'destructive',
      });
    }
  };

  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: t('reset_settings'),
      description: t('settings_reset_success'),
    });
  };

  const handleExportSettings = () => {
    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saadhana-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: t('export_settings'),
      description: t('settings_export_success'),
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        // Update each setting individually to ensure proper state management
        Object.keys(importedSettings).forEach(key => {
          const typedKey = key as keyof typeof settings;
          updateSettings([typedKey], importedSettings[typedKey]);
        });
        
        toast({
          title: t('import_settings'),
          description: t('settings_import_success'),
        });
      } catch (error) {
        toast({
          title: t('import_failed'),
          description: t('settings_import_error'),
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
    // Reset the input value to allow importing the same file again
    event.target.value = '';
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings settings={settings} updateSettings={updateSettings} />;
      case 'appearance':
        return <AppearanceSettings settings={settings} updateSettings={updateSettings} />;
      case 'meditation':
        return <MeditationSettings settings={settings} updateSettings={updateSettings} />;
      case 'privacy':
        return <PrivacySettings settings={settings} updateSettings={updateSettings} />;
      case 'notifications':
        return <NotificationsSettings settings={settings} updateSettings={updateSettings} />;
      case 'accessibility':
        return <AccessibilitySettings settings={settings} updateSettings={updateSettings} />;
      case 'profile':
        return <ProfileSettings settings={settings} updateSettings={updateSettings} />;
      case 'advanced':
        return <AdvancedSettings settings={settings} updateSettings={updateSettings} />;
      default:
        return <GeneralSettings settings={settings} updateSettings={updateSettings} />;
    }
  };

  const sections = [
    {
      title: t('personal'),
      items: [
        { id: 'general', label: t('general'), icon: SettingsIcon },
        { id: 'profile', label: t('profile'), icon: User }
      ]
    },
    {
      title: t('appearance_experience'),
      items: [
        { id: 'appearance', label: t('appearance'), icon: Palette },
        { id: 'meditation', label: t('meditation'), icon: Clock }
      ]
    },
    {
      title: t('preferences'),
      items: [
        { id: 'notifications', label: t('notifications'), icon: Bell },
        { id: 'privacy', label: t('privacy'), icon: ShieldCheck },
        { id: 'accessibility', label: t('accessibility'), icon: Eye }
      ]
    },
    {
      title: t('advanced'),
      items: [
        { id: 'advanced', label: t('advanced'), icon: SlidersHorizontal }
      ]
    }
  ];

  // Custom header actions for the Layout component
  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="hidden md:flex items-center gap-2 border-purple-500/30 hover:bg-purple-500/10 font-medium"
        onClick={handleExportSettings}
      >
        <Download className="h-4 w-4" />
        {t('export')}
      </Button>
      <div className="hidden md:block">
        <input
          type="file"
          accept=".json"
          onChange={handleImportSettings}
          className="hidden"
          id="import-settings"
        />
        <label htmlFor="import-settings">
          <Button
            variant="outline"
            size="sm"
            className="items-center gap-2 border-purple-500/30 hover:bg-purple-500/10 font-medium"
            asChild
          >
            <span>
              <Upload className="h-4 w-4" />
              {t('import')}
            </span>
          </Button>
        </label>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="hidden md:flex items-center gap-2 border-purple-500/30 hover:bg-purple-500/10 font-medium"
        onClick={handleResetSettings}
      >
        <RotateCcw className="h-4 w-4" />
        {t('reset')}
      </Button>
      <Button
        variant="default"
        size="sm"
        className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white focus:outline-none focus:ring-0 focus:border-0 border-none shadow-none font-medium"
        onClick={handleSaveSettings}
        disabled={isSaving}
      >
        {isSaving ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {t('saving')}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {t('save')}
          </div>
        )}
      </Button>
    </div>
  );

  // Get the icon for the current active section
  const getCurrentSectionIcon = () => {
    const currentSection = sections.flatMap(section => section.items).find(item => item.id === activeSection);
    if (currentSection) {
      const IconComponent = currentSection.icon;
      return <IconComponent className="h-5 w-5" />;
    }
    return <SettingsIcon className="h-5 w-5" />;
  };

  // Determine if we're on mobile view
  const isMobileView = windowWidth < 1024; // lg breakpoint

  return (
    <Layout headerActions={headerActions}>
      <div className="container mx-auto px-4 py-6 animate-fade-in mobile-container overflow-hidden">
        {/* Mobile Header with Menu Toggle */}
        <div className="lg:hidden w-full mb-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center gap-2 border-purple-500/30 hover:bg-purple-500/10 font-medium touch-target-large"
            >
              <Menu className="h-5 w-5" />
              <span className="font-medium">{t('menu')}</span>
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground capitalize">
                {t(activeSection)}
              </span>
              {getCurrentSectionIcon()}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 overflow-hidden">
          {/* Mobile Sheet Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetContent 
              side="left" 
              className="w-[280px] p-0 mobile-sheet-content overflow-hidden"
            >
              <SheetHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <SheetTitle className="flex items-center gap-2 text-lg font-semibold text-foreground settings-header">
                    <SettingsIcon className="h-5 w-5 text-purple-500" />
                    <span className="text-wrap">{t('settings_menu')}</span>
                  </SheetTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="touch-target-large"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </SheetHeader>
              <div className="h-full overflow-y-auto p-4 max-h-[calc(100vh-120px)]">
                <nav className="space-y-4">
                  {sections.map((section) => (
                    <div key={section.title} className="mb-2">
                      <h3 className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-wrap settings-section-title">
                        {section.title}
                      </h3>
                      <div className="space-y-1 mt-2">
                        {section.items.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <Button
                              key={item.id}
                              variant={activeSection === item.id ? 'secondary' : 'ghost'}
                              className={`w-full justify-start gap-3 rounded-lg font-medium touch-target-large ${
                                activeSection === item.id 
                                  ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30' 
                                  : 'hover:bg-purple-500/10'
                              }`}
                              onClick={() => {
                                setActiveSection(item.id);
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <IconComponent className="h-5 w-5 flex-shrink-0" />
                              <span className="text-wrap truncate">{item.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Sidebar Navigation */}
          <AnimatePresence>
            {isDesktopSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="hidden lg:block lg:w-64 flex-shrink-0"
              >
                <Card className="h-full border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between gap-2 text-lg font-semibold text-foreground settings-header">
                      <div className="flex items-center gap-2">
                        <SettingsIcon className="h-5 w-5 text-purple-500" />
                        <span className="text-wrap">{t('settings_menu')}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsDesktopSidebarOpen(false)}
                        className="p-1 h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 overflow-auto">
                    <nav className="space-y-1">
                      {sections.map((section) => (
                        <div key={section.title} className="mb-3">
                          <h3 className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-wrap settings-section-title">
                            {section.title}
                          </h3>
                          <div className="space-y-1 mt-1">
                            {section.items.map((item) => {
                              const IconComponent = item.icon;
                              return (
                                <Button
                                  key={item.id}
                                  variant={activeSection === item.id ? 'secondary' : 'ghost'}
                                  className={`w-full justify-start gap-3 rounded-lg font-medium touch-target-large ${
                                    activeSection === item.id 
                                      ? 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30' 
                                      : 'hover:bg-purple-500/10'
                                  }`}
                                  onClick={() => setActiveSection(item.id)}
                                >
                                  <IconComponent className="h-5 w-5 flex-shrink-0" />
                                  <span className="text-wrap truncate">{item.label}</span>
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </nav>

                    <div className="mt-6 pt-4 border-t border-border space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-purple-500/30 hover:bg-purple-500/10 font-medium touch-target-large"
                        onClick={handleExportSettings}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        <span className="text-wrap">{t('export_settings')}</span>
                      </Button>
                      <div>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportSettings}
                          className="hidden"
                          id="import-settings-desktop"
                        />
                        <label htmlFor="import-settings-desktop">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full cursor-pointer border-purple-500/30 hover:bg-purple-500/10 font-medium touch-target-large"
                            asChild
                          >
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              <span className="text-wrap">{t('import_settings')}</span>
                            </span>
                          </Button>
                        </label>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 font-medium touch-target-large"
                        onClick={handleResetSettings}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        <span className="text-wrap">{t('reset_to_defaults')}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed Sidebar Toggle for Desktop */}
          {!isDesktopSidebarOpen && (
            <div className="hidden lg:flex items-start pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDesktopSidebarOpen(true)}
                className="border-purple-500/30 hover:bg-purple-500/10 font-medium touch-target-large rounded-r-none border-r-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 backdrop-blur-sm mobile-card-compact h-full flex flex-col">
              <CardHeader className="hidden lg:block pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground mobile-heading-scale settings-header">
                  {(() => {
                    const IconComponent = sectionIcons[activeSection as keyof typeof sectionIcons];
                    return <IconComponent className="h-5 w-5 text-purple-500 flex-shrink-0" />;
                  })()}
                  <span className="capitalize text-wrap truncate">{t(activeSection)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="mobile-card-compact flex-1 overflow-auto pt-2">
                {renderSection()}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Fixed action buttons for mobile */}
        <div className="lg:hidden fixed bottom-4 right-4 flex gap-2 z-10 pb-safe">
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/30 hover:bg-purple-500/10 font-medium touch-target-large"
            onClick={handleExportSettings}
          >
            <Download className="h-4 w-4" />
          </Button>
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
              id="import-settings-mobile"
            />
            <label htmlFor="import-settings-mobile">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer border-purple-500/30 hover:bg-purple-500/10 font-medium touch-target-large"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4" />
                </span>
              </Button>
            </label>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 font-medium touch-target-large"
            onClick={handleResetSettings}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white font-medium touch-target-large"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;