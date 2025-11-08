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
import { Eye, Volume2, Type, Zap } from 'lucide-react';
import { SettingsType } from './SettingsTypes';

interface AccessibilitySettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({
  settings,
  updateSettings,
}) => {
  // Guard against undefined settings or settings still loading
  if (!settings || !settings.accessibility) {
    return (
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
          <Eye className="h-5 w-5" />
          <span>Accessibility Settings</span>
        </CardTitle>
        <CardDescription>Make the app more accessible for your needs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/20 hover:bg-background/70 transition-all duration-300">
              <div className="space-y-1">
                <Label className="font-medium flex items-center gap-2 text-foreground">
                  <Volume2 className="h-4 w-4 text-primary" />
                  Screen Reader Support
                </Label>
                <p className="text-sm text-muted-foreground">
                  Optimize the app for screen readers
                </p>
              </div>
              <Switch
                checked={settings.accessibility?.screenReader ?? false}
                onCheckedChange={(checked) =>
                  updateSettings(['accessibility', 'screenReader'], checked)
                }
              />
            </div>
          </div>

          <Separator className="bg-primary/20" />

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/20 hover:bg-background/70 transition-all duration-300">
              <div className="space-y-1">
                <Label className="font-medium flex items-center gap-2 text-foreground">
                  <Type className="h-4 w-4 text-primary" />
                  Larger Text
                </Label>
                <p className="text-sm text-muted-foreground">
                  Use larger text throughout the application
                </p>
              </div>
              <Switch
                checked={settings.accessibility?.largeText ?? false}
                onCheckedChange={(checked) =>
                  updateSettings(['accessibility', 'largeText'], checked)
                }
              />
            </div>
          </div>

          <Separator className="bg-primary/20" />

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/20 hover:bg-background/70 transition-all duration-300">
              <div className="space-y-1">
                <Label className="font-medium flex items-center gap-2 text-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  Reduced Motion
                </Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and motion effects
                </p>
              </div>
              <Switch
                checked={settings.accessibility?.reducedMotion ?? false}
                onCheckedChange={(checked) =>
                  updateSettings(['accessibility', 'reducedMotion'], checked)
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettings;