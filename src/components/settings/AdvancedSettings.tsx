import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SlidersHorizontal, Database, RefreshCw, Cloud, Trash2, AlertTriangle } from 'lucide-react';
import { SettingsType } from './SettingsTypes';

interface AdvancedSettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const AdvancedSettings = ({ settings, updateSettings }: AdvancedSettingsProps) => {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
          <SlidersHorizontal className="h-5 w-5" />
          <span>Advanced Settings</span>
        </CardTitle>
        <CardDescription>
          Configure advanced features and developer options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-4 rounded-lg border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <Label className="text-amber-500 font-medium">Warning</Label>
            </div>
            <p className="text-sm text-amber-600">
              These settings are for advanced users. Changes here may affect your app experience.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-foreground">
                <Database className="h-4 w-4 text-primary" />
                Cache Settings
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Clear Cache
                </Button>
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Rebuild Index
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Last cache purge: Never</p>
            </div>

            <Separator className="bg-primary/20" />

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-foreground">
                <Cloud className="h-4 w-4 text-primary" />
                Data Management
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                  Backup Data
                </Button>
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                  Restore Backup
                </Button>
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                  Sync Now
                </Button>
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                  Check Updates
                </Button>
              </div>
            </div>

            <Separator className="bg-primary/20" />

            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                Danger Zone
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="destructive" size="sm" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete All User Data
                </Button>
                <Button variant="destructive" size="sm" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                These actions cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSettings;