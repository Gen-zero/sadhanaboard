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
import { Slider } from '@/components/ui/slider';
import { Clock, Music, Bell, Volume2, Timer, Waves } from 'lucide-react';
import { SettingsType } from './SettingsTypes';

interface MeditationSettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const MeditationSettings: React.FC<MeditationSettingsProps> = ({
  settings,
  updateSettings,
}) => {
  // Guard against undefined settings or settings still loading
  if (!settings || !settings.meditation) {
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
        <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
          <Clock className="h-5 w-5" />
          <span>Meditation Settings</span>
        </CardTitle>
        <CardDescription>Customize your meditation experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/20 hover:bg-background/70 transition-all duration-300">
            <div className="space-y-1">
              <Label className="flex items-center gap-2 font-medium text-foreground">
                <Music className="h-4 w-4 text-primary" />
                Background Sounds
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable ambient sounds during meditation sessions
              </p>
            </div>
            <Switch
              checked={settings.meditation?.backgroundSounds ?? true}
              onCheckedChange={(checked) =>
                updateSettings(['meditation', 'backgroundSounds'], checked)
              }
            />
          </div>

          <Separator className="bg-primary/20" />

          <div className="space-y-4 p-4 rounded-lg bg-background/50 border border-primary/20">
            <Label className="flex items-center gap-2 font-medium text-foreground">
              <Timer className="h-4 w-4 text-primary" />
              Default Timer Duration
            </Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[settings.meditation?.timerDuration || 15]}
                min={5}
                max={60}
                step={5}
                onValueChange={(value) =>
                  updateSettings(['meditation', 'timerDuration'], value[0])
                }
                className="w-full"
              />
              <span className="w-16 text-right font-medium text-foreground">
                {settings.meditation?.timerDuration || 15} min
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 min</span>
              <span>60 min</span>
            </div>
          </div>

          <Separator className="bg-primary/20" />

          <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/20 hover:bg-background/70 transition-all duration-300">
            <div className="space-y-1">
              <Label className="flex items-center gap-2 font-medium text-foreground">
                <Bell className="h-4 w-4 text-primary" />
                Interval Bell
              </Label>
              <p className="text-sm text-muted-foreground">
                Play a mindfulness bell at regular intervals
              </p>
            </div>
            <Switch
              checked={settings.meditation?.intervalBell ?? true}
              onCheckedChange={(checked) =>
                updateSettings(['meditation', 'intervalBell'], checked)
              }
            />
          </div>

          <Separator className="bg-primary/20" />

          <div className="space-y-4 p-4 rounded-lg bg-background/50 border border-primary/20">
            <Label className="flex items-center gap-2 font-medium text-foreground">
              <Volume2 className="h-4 w-4 text-primary" />
              Sound Volume
            </Label>
            <div className="flex items-center space-x-4">
              <Slider
                value={[settings.meditation?.soundVolume || 50]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) =>
                  updateSettings(['meditation', 'soundVolume'], value[0])
                }
                className="w-full"
              />
              <span className="w-16 text-right font-medium text-foreground">
                {settings.meditation?.soundVolume || 50}%
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationSettings;