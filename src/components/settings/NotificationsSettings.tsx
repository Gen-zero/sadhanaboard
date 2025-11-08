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
import { Input } from '@/components/ui/input';
import { Bell, Sunrise, Sun, Sunset, MessageCircle, Target, Sparkles } from 'lucide-react';
import { SettingsType } from './SettingsTypes';

interface NotificationsSettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const NotificationsSettings: React.FC<NotificationsSettingsProps> = ({
  settings,
  updateSettings,
}) => {
  // Guard against undefined settings or settings still loading
  if (!settings || !settings.notifications || !settings.reminders) {
    return (
      <div className="space-y-6">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
            <Bell className="h-5 w-5" />
            <span>Notification Settings</span>
          </CardTitle>
          <CardDescription>Manage when and how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/20 hover:bg-background/70 transition-all duration-300">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2 text-foreground">
                  <Bell className="h-4 w-4 text-primary" />
                  Enable Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive reminders for your practices and tasks
                </p>
              </div>
              <Switch
                checked={settings.notifications?.enabled ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['notifications', 'enabled'], checked)
                }
              />
            </div>

            <Separator className="bg-primary/20" />

            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/20 hover:bg-background/70 transition-all duration-300">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2 text-foreground">
                  <Sunrise className="h-4 w-4 text-primary" />
                  Daily Ritual Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about your daily spiritual practices
                </p>
              </div>
              <Switch
                disabled={!settings.notifications?.enabled}
                checked={settings.notifications?.ritualReminders ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['notifications', 'ritualReminders'], checked)
                }
              />
            </div>

            <Separator className="bg-primary/20" />

            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/20 hover:bg-background/70 transition-all duration-300">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2 text-foreground">
                  <Target className="h-4 w-4 text-primary" />
                  Goal Progress Updates
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates on your spiritual journey progress
                </p>
              </div>
              <Switch
                disabled={!settings.notifications?.enabled}
                checked={settings.notifications?.goalProgress ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(['notifications', 'goalProgress'], checked)
                }
              />
            </div>

            <Separator className="bg-primary/20" />

            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-primary/20 hover:bg-background/70 transition-all duration-300">
              <div className="space-y-1">
                <Label className="text-base font-medium flex items-center gap-2 text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Motivational Messages
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive inspirational quotes and messages
                </p>
              </div>
              <Switch
                disabled={!settings.notifications?.enabled}
                checked={settings.notifications?.motivationalMessages ?? true}
                onCheckedChange={(checked) =>
                  updateSettings(
                    ['notifications', 'motivationalMessages'],
                    checked
                  )
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
            <Bell className="h-5 w-5" />
            <span>Reminder Times</span>
          </CardTitle>
          <CardDescription>Set times for your practice reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 p-4 rounded-lg bg-background/50 border border-primary/20">
            <Label htmlFor="morning-reminder" className="flex items-center gap-2 text-foreground">
              <Sunrise className="h-4 w-4 text-primary" />
              Morning Reminder
            </Label>
            <Input
              type="time"
              id="morning-reminder"
              value={settings.reminders?.morning || '06:00'}
              onChange={(e) => updateSettings(['reminders', 'morning'], e.target.value)}
              disabled={!settings.notifications?.enabled}
              className="border-primary/30 focus:border-primary focus:ring-primary bg-background/50"
            />
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-background/50 border border-primary/20">
            <Label htmlFor="midday-reminder" className="flex items-center gap-2 text-foreground">
              <Sun className="h-4 w-4 text-primary" />
              Midday Reminder
            </Label>
            <Input
              type="time"
              id="midday-reminder"
              value={settings.reminders?.midday || '12:00'}
              onChange={(e) => updateSettings(['reminders', 'midday'], e.target.value)}
              disabled={!settings.notifications?.enabled}
              className="border-primary/30 focus:border-primary focus:ring-primary bg-background/50"
            />
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-background/50 border border-primary/20">
            <Label htmlFor="evening-reminder" className="flex items-center gap-2 text-foreground">
              <Sunset className="h-4 w-4 text-primary" />
              Evening Reminder
            </Label>
            <Input
              type="time"
              id="evening-reminder"
              value={settings.reminders?.evening || '18:00'}
              onChange={(e) => updateSettings(['reminders', 'evening'], e.target.value)}
              disabled={!settings.notifications?.enabled}
              className="border-primary/30 focus:border-primary focus:ring-primary bg-background/50"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsSettings;