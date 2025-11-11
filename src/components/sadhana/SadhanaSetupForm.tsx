import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Calendar, 
  Heart, 
  Sparkles 
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { SadhanaData } from '@/hooks/useSadhanaData';
import { useDefaultThemeStyles } from '@/hooks/useDefaultThemeStyles';

interface SadhanaSetupFormProps {
  onCreateSadhana: (data: SadhanaData) => void;
  onCancel: () => void;
}

const SadhanaSetupForm = ({ onCreateSadhana, onCancel }: SadhanaSetupFormProps) => {
  const { settings } = useSettings();
  const { isDefaultTheme, defaultThemeClasses } = useDefaultThemeStyles();
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    purpose: '',
    goal: '',
    startDate: today,
    durationDays: 40,
    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deity: '',
    message: '',
    offerings: ['']
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if Shiva theme is active
  const isShivaTheme = settings?.appearance?.colorScheme === 'shiva';

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }
    
    if (!formData.goal.trim()) {
      newErrors.goal = 'Goal is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.deity.trim()) {
      newErrors.deity = 'Deity or spiritual focus is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    const hasOfferings = formData.offerings.some(offering => offering.trim() !== '');
    if (!hasOfferings) {
      newErrors.offerings = 'At least one offering is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartDateChange = (date: string) => {
    const startDate = new Date(date);
    const endDate = new Date(startDate.getTime() + formData.durationDays * 24 * 60 * 60 * 1000);
    
    setFormData(prev => ({
      ...prev,
      startDate: date,
      endDate: endDate.toISOString().split('T')[0]
    }));
  };

  const handleDurationChange = (days: number) => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
    
    setFormData(prev => ({
      ...prev,
      durationDays: days,
      endDate: endDate.toISOString().split('T')[0]
    }));
  };

  const handleOfferingChange = (index: number, value: string) => {
    const newOfferings = [...formData.offerings];
    newOfferings[index] = value;
    setFormData(prev => ({ ...prev, offerings: newOfferings }));
  };

  const handleAddOffering = () => {
    setFormData(prev => ({ ...prev, offerings: [...prev.offerings, ''] }));
  };

  const handleRemoveOffering = (index: number) => {
    if (formData.offerings.length <= 1) return;
    
    const newOfferings = [...formData.offerings];
    newOfferings.splice(index, 1);
    setFormData(prev => ({ ...prev, offerings: newOfferings }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onCreateSadhana({
        purpose: formData.purpose,
        goal: formData.goal,
        startDate: formData.startDate,
        durationDays: formData.durationDays,
        endDate: formData.endDate,
        deity: formData.deity,
        message: formData.message,
        offerings: formData.offerings.filter(o => o.trim() !== '')
      });
    }
  };

  return (
    <div className={`rounded-lg p-6 ${isShivaTheme ? 'bg-background/50' : isDefaultTheme ? defaultThemeClasses.borderedContainer : 'cosmic-nebula-bg'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onCancel} className={isDefaultTheme ? defaultThemeClasses.secondaryButton : ''}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className={`text-2xl font-bold ${isDefaultTheme ? defaultThemeClasses.primaryText : 'text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary'}`}>
              Create Your Sacred Sadhana
            </h2>
            <p className={isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-muted-foreground'}>Fill in your spiritual intentions and divine commitments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className={isDefaultTheme ? defaultThemeClasses.borderedContainer : ''}>
              <CardHeader>
                <CardTitle className={isDefaultTheme ? defaultThemeClasses.primaryText : ''}>Purpose & Goal</CardTitle>
                <CardDescription className={isDefaultTheme ? defaultThemeClasses.secondaryText : ''}>Why you're on this spiritual journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="purpose" className={isDefaultTheme ? defaultThemeClasses.primaryText : ''}>Purpose *</Label>
                  <Textarea 
                    id="purpose" 
                    value={formData.purpose}
                    onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="What is the purpose of your spiritual practice?"
                    className={`min-h-[100px] ${isDefaultTheme ? 'bg-transparent border-white/30 text-amber-100 placeholder:text-amber-200/50 focus-visible:ring-amber-500/50' : ''}`}
                  />
                  {errors.purpose && <p className="text-sm text-destructive">{errors.purpose}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal" className={isDefaultTheme ? defaultThemeClasses.primaryText : ''}>Goal *</Label>
                  <Textarea 
                    id="goal" 
                    value={formData.goal}
                    onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                    placeholder="What is your specific spiritual goal?"
                    className={`min-h-[100px] ${isDefaultTheme ? 'bg-transparent border-white/30 text-amber-100 placeholder:text-amber-200/50 focus-visible:ring-amber-500/50' : ''}`}
                  />
                  {errors.goal && <p className="text-sm text-destructive">{errors.goal}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className={isDefaultTheme ? defaultThemeClasses.borderedContainer : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isDefaultTheme ? defaultThemeClasses.primaryText : ''}`}>
                  <Calendar className={`h-5 w-5 ${isDefaultTheme ? defaultThemeClasses.accentText : 'text-primary'}`} />
                  <span>Duration & Timeline</span>
                </CardTitle>
                <CardDescription className={isDefaultTheme ? defaultThemeClasses.secondaryText : ''}>Set your sadhana practice period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className={isDefaultTheme ? defaultThemeClasses.primaryText : ''}>Start Date *</Label>
                    <Input 
                      id="startDate" 
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      min={today}
                      className={isDefaultTheme ? 'bg-transparent border-white/30 text-amber-100 focus-visible:ring-amber-500/50' : ''}
                    />
                    {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className={isDefaultTheme ? defaultThemeClasses.primaryText : ''}>End Date</Label>
                    <Input 
                      id="endDate" 
                      type="date"
                      value={formData.endDate}
                      readOnly
                      className={isDefaultTheme ? 'bg-transparent border-white/30 text-amber-100' : ''}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className={isDefaultTheme ? defaultThemeClasses.primaryText : ''}>Duration (Days) *</Label>
                  <Select 
                    value={formData.durationDays.toString()} 
                    onValueChange={(value) => handleDurationChange(Number(value))}
                  >
                    <SelectTrigger className={isDefaultTheme ? 'bg-transparent border-white/30 text-amber-100 focus:ring-amber-500/50' : ''}>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="21">21 Days</SelectItem>
                      <SelectItem value="40">40 Days</SelectItem>
                      <SelectItem value="108">108 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className={isDefaultTheme ? defaultThemeClasses.borderedContainer : ''}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isDefaultTheme ? defaultThemeClasses.primaryText : ''}`}>
                  <Heart className={`h-5 w-5 ${isDefaultTheme ? defaultThemeClasses.accentText : 'text-primary'}`} />
                  <span>Divine Focus & Offerings</span>
                </CardTitle>
                <CardDescription className={isDefaultTheme ? defaultThemeClasses.secondaryText : ''}>Connect with your spiritual focus and offerings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deity" className={isDefaultTheme ? defaultThemeClasses.primaryText : ''}>Deity or Spiritual Focus *</Label>
                  <Input 
                    id="deity" 
                    value={formData.deity}
                    onChange={(e) => setFormData(prev => ({ ...prev, deity: e.target.value }))}
                    placeholder="Which deity or spiritual focus guides your practice?"
                    className={isDefaultTheme ? 'bg-transparent border-white/30 text-amber-100 placeholder:text-amber-200/50 focus-visible:ring-amber-500/50' : ''}
                  />
                  {errors.deity && <p className="text-sm text-destructive">{errors.deity}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className={isDefaultTheme ? defaultThemeClasses.primaryText : ''}>Sacred Message *</Label>
                  <Textarea 
                    id="message" 
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Write a sacred message to your spiritual focus..."
                    className={`min-h-[120px] ${isDefaultTheme ? 'bg-transparent border-white/30 text-amber-100 placeholder:text-amber-200/50 focus-visible:ring-amber-500/50' : ''}`}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className={isDefaultTheme ? defaultThemeClasses.primaryText : ''}>Offerings *</Label>
                  {formData.offerings.map((offering, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        value={offering}
                        onChange={(e) => handleOfferingChange(index, e.target.value)}
                        placeholder={`Offering ${index + 1}`}
                        className={isDefaultTheme ? 'bg-transparent border-white/30 text-amber-100 placeholder:text-amber-200/50 focus-visible:ring-amber-500/50' : ''}
                      />
                      {formData.offerings.length > 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRemoveOffering(index)}
                          className={isDefaultTheme ? defaultThemeClasses.secondaryButton : ''}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddOffering}
                    className={`mt-2 ${isDefaultTheme ? defaultThemeClasses.secondaryButton : ''}`}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Add Offering
                  </Button>
                  {errors.offerings && <p className="text-sm text-destructive">{errors.offerings}</p>}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={onCancel}
                className={isDefaultTheme ? defaultThemeClasses.secondaryButton : ''}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                className={isDefaultTheme ? defaultThemeClasses.primaryButton : 'bg-primary hover:bg-primary/90 text-primary-foreground'}
              >
                Create Sadhana
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SadhanaSetupForm;