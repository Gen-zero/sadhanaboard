import { useEffect, useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  BarChartHorizontal, 
  Save, 
  User as UserIcon, 
  Edit3, 
  Check, 
  MapPin, 
  Star, 
  Award,
  UserCircle,
  BarChart3,
  BadgeInfo,
  Camera,
  Upload
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfileData, type HistoricalSadhana } from '@/hooks/useProfileData';
import { useAuth } from '@/lib/auth-context';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { SettingsType } from './SettingsTypes';
import { useTranslation } from 'react-i18next';
import { EnhancedTooltip } from '@/components/ui/EnhancedTooltip';

interface ProfileSettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const ProfileSettings = ({ settings, updateSettings }: ProfileSettingsProps) => {
  const { profile, history, stats, currentPractice, addToHistory, updateProfile } = useProfileData();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    display_name: profile.name,
    bio: '',
    location: '',
    experience_level: 'beginner',
    favorite_deity: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen for sadhana completion/break events
  useEffect(() => {
    const handleSadhanaCompleted = (event: CustomEvent) => {
      addToHistory(event.detail as HistoricalSadhana);
    };

    const handleSadhanaBroken = (event: CustomEvent) => {
      addToHistory(event.detail as HistoricalSadhana);
    };

    window.addEventListener('sadhana-completed', handleSadhanaCompleted as EventListener);
    window.addEventListener('sadhana-broken', handleSadhanaBroken as EventListener);

    return () => {
      window.removeEventListener('sadhana-completed', handleSadhanaCompleted as EventListener);
      window.removeEventListener('sadhana-broken', handleSadhanaBroken as EventListener);
    };
  }, [addToHistory]);

  // Load profile data from backend when component mounts
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (user?.id) {
          const data = await api.getProfile();
          setEditedProfile({
            display_name: data.profile.display_name || profile.name,
            bio: data.profile.bio || '',
            location: data.profile.location || '',
            experience_level: data.profile.experience_level || 'beginner',
            favorite_deity: data.profile.favorite_deity || '',
          });
          if (data.profile.avatar) {
            setAvatarPreview(data.profile.avatar);
          }
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfileData();
  }, [user, profile.name]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getJoinedDate = () => {
    return new Date(profile.joinDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        toast({
          title: t('invalid_file'),
          description: t('please_select_an_image_file'),
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: t('file_too_large'),
          description: t('please_select_a_file_smaller_than_5mb'),
          variant: "destructive",
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    try {
      // Prepare profile data for saving
      const profileData = {
        display_name: editedProfile.display_name,
        bio: editedProfile.bio,
        location: editedProfile.location,
        experience_level: editedProfile.experience_level,
        favorite_deity: editedProfile.favorite_deity,
        avatar: avatarPreview || profile.avatar || '',
      };

      await api.updateProfile(profileData);

      // Update local profile data
      updateProfile({ name: editedProfile.display_name });
      
      toast({
        title: t('profile_updated'),
        description: t('profile_updated_successfully'),
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message || t('failed_to_update_profile'),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground mobile-heading-scale settings-header">
          <UserIcon className="h-5 w-5 text-primary flex-shrink-0" />
          <span className="text-wrap">{t('profile_settings')}</span>
        </CardTitle>
        <CardDescription className="text-sm mobile-text-scale text-wrap text-muted-foreground settings-subheader">{t('manage_your_profile_information')}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-background/50">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-secondary/20 font-medium touch-target-large"
            >
              <UserCircle className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
              <span className="text-wrap">{t('profile')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="statistics" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-secondary/20 font-medium touch-target-large"
            >
              <BarChart3 className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
              <span className="text-wrap">{t('statistics')}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6 mt-0">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative flex-shrink-0">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarImage src={avatarPreview || profile.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary text-3xl">
                    <UserIcon className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-primary/30 bg-background hover:bg-primary/10"
                    onClick={triggerFileInput}
                  >
                    <Camera className="h-4 w-4 text-primary" />
                  </Button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="display_name" className="flex items-center gap-2 text-foreground font-medium">
                        <UserIcon className="h-4 w-4 text-primary flex-shrink-0" />
                        {t('name')}
                      </Label>
                      <Input
                        id="display_name"
                        value={editedProfile.display_name}
                        onChange={(e) => setEditedProfile({...editedProfile, display_name: e.target.value})}
                        className="border-purple-500/30 focus:border-purple-500 focus:ring-purple-500 bg-background/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2 text-foreground font-medium">
                        <UserIcon className="h-4 w-4 text-primary flex-shrink-0" />
                        {t('email')}
                      </Label>
                      <Input
                        id="email"
                        value={profile.email}
                        disabled
                        className="border-primary/30 bg-background/50"
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button onClick={handleSaveProfile} className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-medium">
                        <Check className="h-4 w-4" />
                        {t('save_changes')}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="border-primary/30 hover:bg-primary/10 font-medium">
                        {t('cancel')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="min-w-0">
                    <CardTitle className="text-3xl font-bold text-foreground truncate">
                      {profile.name}
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-1.5 text-base">
                      <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="truncate">{t('joined')} {getJoinedDate()}</span>
                    </CardDescription>
                    <p className="mt-2 text-muted-foreground truncate">{profile.email}</p>
                    <Button variant="outline" className="mt-4 flex items-center gap-2 border-primary/30 hover:bg-primary/10 font-medium" onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4" />
                      {t('edit_profile')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {isEditing && (
              <div className="space-y-6 mt-6">
                <Separator className="bg-primary/20" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor="bio" className="flex items-center gap-2 text-foreground font-medium">
                        <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                        {t('bio')}
                      </Label>
                      <EnhancedTooltip id="bio-tooltip" content={t('bio_tooltip')}>
                        <BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </EnhancedTooltip>
                    </div>
                    <Textarea
                      id="bio"
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      placeholder={t('tell_us_about_your_spiritual_journey')}
                      className="min-h-[120px] border-primary/30 focus:border-primary focus:ring-primary bg-background/50"
                    />
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="location" className="flex items-center gap-2 text-foreground font-medium">
                          <MapPin className="h-4 w-4 text-purple-500 flex-shrink-0" />
                          {t('location')}
                        </Label>
                        <EnhancedTooltip id="location-tooltip" content={t('location_tooltip')}>
                          <BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </EnhancedTooltip>
                      </div>
                      <Input
                        id="location"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                        placeholder={t('where_are_you_on_your_spiritual_journey')}
                        className="border-purple-500/30 focus:border-purple-500 focus:ring-purple-500 bg-background/50"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="experience_level" className="flex items-center gap-2 text-foreground font-medium">
                          <Star className="h-4 w-4 text-primary flex-shrink-0" />
                          {t('experience_level')}
                        </Label>
                        <EnhancedTooltip id="experience-level-tooltip" content={t('experience_level_tooltip')}>
                          <BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </EnhancedTooltip>
                      </div>
                      <Select 
                        value={editedProfile.experience_level} 
                        onValueChange={(value) => setEditedProfile({...editedProfile, experience_level: value})}
                      >
                        <SelectTrigger className="border-primary/30 focus:border-primary focus:ring-primary bg-background/50 w-full">
                          <SelectValue placeholder={t('select_your_experience_level')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">{t('beginner')}</SelectItem>
                          <SelectItem value="intermediate">{t('intermediate')}</SelectItem>
                          <SelectItem value="advanced">{t('advanced')}</SelectItem>
                          <SelectItem value="master">{t('master')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="favorite_deity" className="flex items-center gap-2 text-foreground font-medium">
                          <Award className="h-4 w-4 text-primary flex-shrink-0" />
                          {t('favorite_deity')}
                        </Label>
                        <EnhancedTooltip id="favorite-deity-tooltip" content={t('favorite_deity_tooltip')}>
                          <BadgeInfo className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </EnhancedTooltip>
                      </div>
                      <Input
                        id="favorite_deity"
                        value={editedProfile.favorite_deity}
                        onChange={(e) => setEditedProfile({...editedProfile, favorite_deity: e.target.value})}
                        placeholder={t('which_deity_do_you_most_connect_with')}
                        className="border-purple-500/30 focus:border-purple-500 focus:ring-purple-500 bg-background/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!isEditing && (
              <div className="space-y-6 mt-6">
                <Separator className="bg-primary/20" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                      <BookOpen className="h-5 w-5 text-purple-500 flex-shrink-0" />
                      {t('about_me')}
                    </h3>
                    {editedProfile.bio ? (
                      <p className="text-muted-foreground">{editedProfile.bio}</p>
                    ) : (
                      <p className="text-muted-foreground italic">{t('no_bio_added_yet')}</p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                      <Award className="h-5 w-5 text-purple-500 flex-shrink-0" />
                      {t('details')}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {t('experience_level')}: <span className="font-medium text-foreground capitalize">{t(editedProfile.experience_level)}</span>
                        </span>
                      </div>
                      {editedProfile.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-purple-500 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {t('location')}: <span className="font-medium text-foreground">{editedProfile.location}</span>
                          </span>
                        </div>
                      )}
                      {editedProfile.favorite_deity && (
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-500 flex-shrink-0" />
                          <span className="text-muted-foreground">
                            {t('favorite_deity')}: <span className="font-medium text-foreground">{editedProfile.favorite_deity}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="statistics" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                <div className="text-2xl font-bold text-primary">{stats?.completedSadhanas || 0}</div>
                <div className="text-sm text-muted-foreground">{t('sadhanas_completed')}</div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                <div className="text-2xl font-bold text-primary">{stats?.totalPracticeDays || 0}</div>
                <div className="text-sm text-muted-foreground">{t('practice_days')}</div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                <div className="text-2xl font-bold text-primary">{stats?.successRate || 0}%</div>
                <div className="text-sm text-muted-foreground">{t('success_rate')}</div>
              </div>
            </div>
            
            <Separator className="bg-primary/20" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <BarChartHorizontal className="h-5 w-5 text-primary flex-shrink-0" />
                {t('recent_activity')}
              </h3>
              {history && history.length > 0 ? (
                <div className="space-y-3">
                  {history.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/20">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{item.title}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {item.completedAt ? formatDate(item.completedAt) : 
                           item.brokenAt ? formatDate(item.brokenAt) : 
                           formatDate(item.startDate)}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        item.status === 'completed' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {t(item.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">{t('no_recent_activity')}</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;