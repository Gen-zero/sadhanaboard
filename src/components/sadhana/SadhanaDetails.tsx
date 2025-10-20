import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Save, Eye } from 'lucide-react';
import { SadhanaData } from '@/hooks/useSadhanaData';
import { Dispatch, SetStateAction } from 'react';

interface SadhanaDetailsProps {
  sadhanaData: SadhanaData | null;
  onUpdateSadhana: (data: SadhanaData) => void;
  setView3D: Dispatch<SetStateAction<boolean>>;
  view3D: boolean;
}

const SadhanaDetails = ({ sadhanaData, onUpdateSadhana, setView3D, view3D }: SadhanaDetailsProps) => {
  const [formData, setFormData] = useState<SadhanaData>(sadhanaData || {
    purpose: '',
    goal: '',
    deity: '',
    message: '',
    offerings: [''],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    durationDays: 40
  });

  const handleAddOffering = () => {
    setFormData(prev => ({
      ...prev,
      offerings: [...prev.offerings, '']
    }));
  };

  const handleRemoveOffering = (index: number) => {
    setFormData(prev => ({
      ...prev,
      offerings: prev.offerings.filter((_, i) => i !== index)
    }));
  };

  const handleOfferingChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      offerings: prev.offerings.map((offering, i) => i === index ? value : offering)
    }));
  };

  const handleSave = () => {
    const validOfferings = formData.offerings.filter(o => o.trim());
    onUpdateSadhana({
      ...formData,
      offerings: validOfferings
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Edit Sadhana Details</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setView3D(!view3D)}
          className="flex items-center gap-1"
        >
          {view3D ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {view3D ? '2D View' : '3D View'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purpose & Goal</CardTitle>
              <CardDescription>Why you're on this spiritual journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea 
                  id="purpose" 
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="What is the purpose of your spiritual practice?"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Textarea 
                  id="goal" 
                  value={formData.goal}
                  onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                  placeholder="What is your specific spiritual goal?"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <span>Divine Connection</span>
              </CardTitle>
              <CardDescription>Your chosen deity or spiritual focus</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deity">Deity or Spiritual Focus</Label>
                <Input 
                  id="deity" 
                  value={formData.deity}
                  onChange={(e) => setFormData(prev => ({ ...prev, deity: e.target.value }))}
                  placeholder="Who or what is your spiritual focus?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea 
                  id="message" 
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="What message would you like to share with your deity?"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Offerings & Practices</CardTitle>
            <CardDescription>What you'll be doing or offering for your spiritual practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.offerings.map((offering, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={offering} 
                    onChange={(e) => handleOfferingChange(index, e.target.value)}
                    placeholder={`Offering or practice ${index + 1}`}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="shrink-0"
                    onClick={() => handleRemoveOffering(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2" onClick={handleAddOffering}>
                + Add New Offering
              </Button>
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90" 
                onClick={handleSave}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SadhanaDetails;