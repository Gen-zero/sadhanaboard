import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useProfileData } from '@/hooks/useProfileData';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useProfileValidation } from '@/hooks/useProfileValidation';
import { Save, X, Loader2 } from 'lucide-react';
import { Profile } from '@/types/profile';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ open, onClose }: EditProfileModalProps) => {
  const { profile: localProfile, updateProfile: updateLocalProfile } = useProfileData();
  const { profile: backendProfile, isLoading: isProfileLoading, fetchProfile, updateProfile: updateBackendProfile } = useUserProfile();
  const { validateProfile } = useProfileValidation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    location: '',
    experience_level: 'beginner',
    favorite_deity: '',
    gotra: '',
    varna: '',
    sampradaya: '',
    date_of_birth: '',
    place_of_birth: '',
    avatar_url: '',
  });

  // Add avatar options
  const avatarOptions = [
    { id: 'default', name: 'Default', url: '/lovable-uploads/sadhanaboard_logo.png' },
    { id: 'shakt1', name: 'Shaktism 1', url: '/avatars/sampradayas/shakt1.png' },
    { id: 'shakt2', name: 'Shaktism 2', url: '/avatars/sampradayas/shakt2.png' },
    { id: 'gaudiya', name: 'Gaudiya', url: '/avatars/sampradayas/gaudiya.png' },
    { id: 'ramanandi', name: 'Ramanandi', url: '/avatars/sampradayas/ramanandi.png' },
    { id: 'tripund1', name: 'Tripundra 1', url: '/avatars/sampradayas/tripund1.png' },
    { id: 'tripund2', name: 'Tripundra 2', url: '/avatars/sampradayas/tripund2.png' },
    { id: 'swami', name: 'Swami Smarth', url: '/avatars/sampradayas/swami_smarth.jpg' },
  ];

  // Load profile data from backend when modal opens
  useEffect(() => {
    if (open) {
      const loadProfileData = async () => {
        try {
          await fetchProfile();
        } catch (error) {
          console.error('Error loading profile data:', error);
        }
      };

      loadProfileData();
    }
  }, [open, fetchProfile]);

  // Update form data when backend profile loads
  useEffect(() => {
    if (backendProfile) {
      setFormData({
        display_name: backendProfile.display_name || localProfile.name || '',
        bio: backendProfile.bio || '',
        location: backendProfile.location || '',
        experience_level: backendProfile.experience_level || 'beginner',
        favorite_deity: backendProfile.favorite_deity || '',
        gotra: backendProfile.gotra || '',
        varna: backendProfile.varna || '',
        sampradaya: backendProfile.sampradaya || '',
        date_of_birth: backendProfile.date_of_birth || '',
        place_of_birth: backendProfile.place_of_birth || '',
        avatar_url: backendProfile.avatar_url || '/lovable-uploads/sadhanaboard_logo.png',
      });
    }
  }, [backendProfile, localProfile.name]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    // Validate form data
    const validationErrors = validateProfile(formData as Partial<Profile>);
    if (Object.keys(validationErrors).length > 0) {
      // Convert ValidationErrors to Record<string, string>
      const errorRecord: Record<string, string> = {};
      Object.entries(validationErrors).forEach(([key, value]) => {
        if (value) {
          errorRecord[key] = value;
        }
      });
      setErrors(errorRecord);
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const success = await updateBackendProfile({
        display_name: formData.display_name,
        bio: formData.bio,
        location: formData.location,
        experience_level: formData.experience_level,
        favorite_deity: formData.favorite_deity,
        gotra: formData.gotra,
        varna: formData.varna,
        sampradaya: formData.sampradaya,
        date_of_birth: formData.date_of_birth,
        place_of_birth: formData.place_of_birth,
        avatar_url: formData.avatar_url,
      });

      if (success) {
        // Update local profile data
        updateLocalProfile({ name: formData.display_name });
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
        
        onClose();
      }
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Edit Profile</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {isProfileLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Avatar Selection */}
            <div>
              <Label>Profile Picture</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {avatarOptions.map((avatar) => (
                  <div 
                    key={avatar.id}
                    className={`cursor-pointer p-1 rounded-full border-2 transition-all ${
                      formData.avatar_url === avatar.url 
                        ? 'border-purple-500 ring-2 ring-purple-500/50' 
                        : 'border-transparent hover:border-purple-300'
                    }`}
                    onClick={() => handleChange('avatar_url', avatar.url)}
                  >
                    <img 
                      src={avatar.url} 
                      alt={avatar.name} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <p className="text-xs text-center mt-1 text-muted-foreground">{avatar.name}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="display_name">Name *</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => handleChange('display_name', e.target.value)}
                  className={errors.display_name ? 'border-red-500' : ''}
                />
                {errors.display_name && <p className="text-red-500 text-sm mt-1">{errors.display_name}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={localProfile.email}
                  disabled
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Tell us about your spiritual journey..."
                  rows={4}
                  className={errors.bio ? 'border-red-500' : ''}
                />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                <p className="text-muted-foreground text-xs mt-1">Max 500 characters</p>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Where are you from?"
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
              <div>
                <Label htmlFor="experience_level">Experience Level</Label>
                <select
                  id="experience_level"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={formData.experience_level}
                  onChange={(e) => handleChange('experience_level', e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="master">Master</option>
                </select>
              </div>
              <div>
                <Label htmlFor="favorite_deity">Favorite Deity</Label>
                <Input
                  id="favorite_deity"
                  value={formData.favorite_deity}
                  onChange={(e) => handleChange('favorite_deity', e.target.value)}
                  placeholder="Which deity do you connect with most?"
                  className={errors.favorite_deity ? 'border-red-500' : ''}
                />
                {errors.favorite_deity && <p className="text-red-500 text-sm mt-1">{errors.favorite_deity}</p>}
              </div>
              <div>
                <Label htmlFor="gotra">Gotra</Label>
                <Input
                  id="gotra"
                  value={formData.gotra}
                  onChange={(e) => handleChange('gotra', e.target.value)}
                  placeholder="Your family lineage"
                  className={errors.gotra ? 'border-red-500' : ''}
                />
                {errors.gotra && <p className="text-red-500 text-sm mt-1">{errors.gotra}</p>}
              </div>
              <div>
                <Label htmlFor="varna">Varna</Label>
                <select
                  id="varna"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={formData.varna}
                  onChange={(e) => handleChange('varna', e.target.value)}
                >
                  <option value="">Select Varna</option>
                  <option value="brahmana">Brahmana</option>
                  <option value="kshatriya">Kshatriya</option>
                  <option value="vaishya">Vaishya</option>
                  <option value="shudra">Shudra</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sampradaya">Sampradaya</Label>
                <Input
                  id="sampradaya"
                  value={formData.sampradaya}
                  onChange={(e) => handleChange('sampradaya', e.target.value)}
                  placeholder="Your spiritual tradition"
                  className={errors.sampradaya ? 'border-red-500' : ''}
                />
                {errors.sampradaya && <p className="text-red-500 text-sm mt-1">{errors.sampradaya}</p>}
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="place_of_birth">Place of Birth</Label>
                <Input
                  id="place_of_birth"
                  value={formData.place_of_birth}
                  onChange={(e) => handleChange('place_of_birth', e.target.value)}
                  placeholder="Where were you born?"
                  className={errors.place_of_birth ? 'border-red-500' : ''}
                />
                {errors.place_of_birth && <p className="text-red-500 text-sm mt-1">{errors.place_of_birth}</p>}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;