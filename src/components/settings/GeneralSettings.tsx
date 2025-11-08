import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  Globe, 
  Home, 
  Languages, 
  LayoutDashboard,
  BadgeInfo
} from 'lucide-react';
import { SettingsType } from './SettingsTypes';
import { useTranslation } from 'react-i18next';
import { EnhancedTooltip } from '@/components/ui/EnhancedTooltip';

interface GeneralSettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  settings,
  updateSettings,
}) => {
  const [displayName, setDisplayName] = useState(settings.general?.displayName || '');
  const [email, setEmail] = useState(settings.general?.email || '');
  const { t } = useTranslation();

  // Update local state when settings change
  useEffect(() => {
    setDisplayName(settings.general?.displayName || '');
    setEmail(settings.general?.email || '');
  }, [settings]);

  // Handle display name change
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayName(value);
    updateSettings(['general', 'displayName'], value);
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    updateSettings(['general', 'email'], value);
  };

  // Guard against undefined settings or settings still loading
  if (!settings) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground mobile-heading-scale settings-header">
          <SettingsIcon className="h-5 w-5 text-primary" />
          <span className="text-wrap">{t('general_settings')}</span>
        </CardTitle>
        <CardDescription className="text-sm mobile-text-scale text-wrap text-muted-foreground settings-subheader">{t('manage_your_general_preferences')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          {/* Display Name */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="display-name" className="flex items-center gap-2 text-foreground font-medium mobile-text-scale">
                <User className="h-4 w-4 text-primary" />
                <span className="text-wrap">{t('display_name')}</span>
              </Label>
              <EnhancedTooltip id="display-name-tooltip" content={t('display_name_tooltip')}>
                <BadgeInfo className="h-4 w-4 text-muted-foreground" />
              </EnhancedTooltip>
            </div>
            <Input
              id="display-name"
              value={displayName}
              onChange={handleDisplayNameChange}
              placeholder={t('enter_your_display_name')}
              className="border-primary/30 focus:border-primary focus:ring-primary bg-background/50 mobile-input form-text-input"
            />
          </div>

          <Separator className="bg-primary/20" />

          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-foreground font-medium mobile-text-scale">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-wrap">{t('email')}</span>
              </Label>
              <EnhancedTooltip id="email-tooltip" content={t('email_tooltip')}>
                <BadgeInfo className="h-4 w-4 text-muted-foreground" />
              </EnhancedTooltip>
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder={t('enter_your_email')}
              className="border-primary/30 focus:border-primary focus:ring-primary bg-background/50 mobile-input form-text-input"
            />
          </div>

          <Separator className="bg-primary/20" />

          {/* Language - Limited to English and Hindi */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="language" className="flex items-center gap-2 text-foreground font-medium mobile-text-scale">
                <Languages className="h-4 w-4 text-primary" />
                <span className="text-wrap">{t('language')}</span>
              </Label>
              <EnhancedTooltip id="language-tooltip" content={t('language_tooltip')}>
                <BadgeInfo className="h-4 w-4 text-muted-foreground" />
              </EnhancedTooltip>
            </div>
            <Select 
              value={settings.language || 'english'} 
              onValueChange={(value) => updateSettings(['language'], value)}
            >
              <SelectTrigger className="w-full border-primary/30 focus:border-primary focus:ring-primary bg-background/50 mobile-input form-select">
                <SelectValue placeholder={t('select_language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">
                  <span className="text-wrap">{t('english')}</span>
                </SelectItem>
                <SelectItem value="hindi">
                  <span className="text-wrap">{t('hindi')}</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-primary/20" />

          {/* Start Page */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="start-page" className="flex items-center gap-2 text-foreground font-medium mobile-text-scale">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <span className="text-wrap">{t('start_page')}</span>
              </Label>
              <EnhancedTooltip id="start-page-tooltip" content={t('start_page_tooltip')}>
                <BadgeInfo className="h-4 w-4 text-muted-foreground" />
              </EnhancedTooltip>
            </div>
            <Select 
              value={settings.startPage || 'dashboard'} 
              onValueChange={(value) => updateSettings(['startPage'], value)}
            >
              <SelectTrigger className="w-full border-primary/30 focus:border-primary focus:ring-primary bg-background/50 mobile-input form-select">
                <SelectValue placeholder={t('select_start_page')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">
                  <span className="text-wrap">{t('dashboard')}</span>
                </SelectItem>
                <SelectItem value="library">
                  <span className="text-wrap">{t('library')}</span>
                </SelectItem>
                <SelectItem value="sadhanas">
                  <span className="text-wrap">{t('sadhanas')}</span>
                </SelectItem>
                <SelectItem value="community">
                  <span className="text-wrap">{t('community')}</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;