import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, Download, Lock, BarChart, Fingerprint } from 'lucide-react';
import { SettingsType } from './SettingsTypes';
import { useToast } from '@/hooks/use-toast';

interface PrivacySettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  settings,
  updateSettings,
}) => {
  const { toast } = useToast();

  // Guard against undefined settings or settings still loading
  if (!settings || !settings.privacy) {
    return (
      <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </CardContent>
      </Card>
    );
  }

  const handleExportData = () => {
    // In a real implementation, this would export the user's data
    toast({
      title: "Data Export",
      description: "Your data export will begin shortly.",
    });
  };

  return (
    <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground mobile-heading-scale settings-header">
          <ShieldCheck className="h-5 w-5 text-purple-500" />
          <span className="text-wrap">Privacy & Data</span>
        </CardTitle>
        <CardDescription className="text-sm mobile-text-scale text-wrap text-muted-foreground settings-subheader">Control how your data is stored and used</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-purple-500/20 hover:bg-background/70 transition-all duration-300 touch-target-large">
              <div className="space-y-1">
                <Label className="font-medium flex items-center gap-2 text-foreground mobile-text-scale">
                  <Lock className="h-4 w-4 text-purple-500" />
                  <span className="text-wrap">Store Data Locally</span>
                </Label>
                <p className="text-sm text-muted-foreground mobile-text-scale text-wrap">
                  Keep all your spiritual journey data stored on your device
                </p>
              </div>
              <Switch
                checked={settings.privacy?.storeDataLocally ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['privacy', 'storeDataLocally'], checked)
                }
              />
            </div>
          </div>

          <Separator className="bg-purple-500/20" />

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-purple-500/20 hover:bg-background/70 transition-all duration-300 touch-target-large">
              <div className="space-y-1">
                <Label className="font-medium flex items-center gap-2 text-foreground mobile-text-scale">
                  <BarChart className="h-4 w-4 text-purple-500" />
                  <span className="text-wrap">Anonymous Analytics</span>
                </Label>
                <p className="text-sm text-muted-foreground mobile-text-scale text-wrap">
                  Allow us to collect anonymous usage data to improve the app
                </p>
              </div>
              <Switch
                checked={settings.privacy?.analyticsConsent ?? false}
                onCheckedChange={(checked) =>
                  updateSettings(['privacy', 'analyticsConsent'], checked)
                }
              />
            </div>
          </div>

          <Separator className="bg-purple-500/20" />

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-purple-500/20 hover:bg-background/70 transition-all duration-300 touch-target-large">
              <div className="space-y-1">
                <Label className="font-medium flex items-center gap-2 text-foreground mobile-text-scale">
                  <Fingerprint className="h-4 w-4 text-purple-500" />
                  <span className="text-wrap">Biometric Authentication</span>
                </Label>
                <p className="text-sm text-muted-foreground mobile-text-scale text-wrap">
                  Use fingerprint or face recognition to protect your spiritual data
                </p>
              </div>
              <Switch
                checked={settings.privacy?.biometricLogin ?? false}
                onCheckedChange={(checked) =>
                  updateSettings(['privacy', 'biometricLogin'], checked)
                }
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 p-4 rounded-lg border border-purple-500/20 space-y-3 mt-4">
            <p className="text-sm text-foreground mobile-text-scale text-wrap">Your spiritual journey data is stored securely.</p>
            <Button variant="outline" className="w-full flex items-center gap-2 border-purple-500/30 hover:bg-purple-500/10 touch-target-large" onClick={handleExportData}>
              <Download className="h-4 w-4" />
              <span className="text-wrap">Export Your Data</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;