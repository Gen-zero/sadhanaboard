import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Save, Eye } from 'lucide-react';
import { SadhanaData } from '@/hooks/useSadhanaData';
import { useThemeColors } from '@/hooks/useThemeColors';
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
  const { colors } = useThemeColors();

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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg md:text-xl font-semibold uppercase tracking-wide" style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }}>
          Edit Sadhana Details
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setView3D(!view3D)}
          className="flex items-center gap-1 h-8 md:h-9 text-xs md:text-sm px-2 md:px-3"
        >
          {view3D ? <Eye className="h-3 w-3 md:h-4 md:w-4" /> : <Eye className="h-3 w-3 md:h-4 md:w-4" />}
          <span className="hidden xs:inline">{view3D ? '2D View' : '3D View'}</span>
        </Button>
      </div>
      
      {/* Mobile-optimized grid layout */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <div className="space-y-4 md:space-y-6">
          <Card className="bg-gradient-to-r from-[#DC143C]/50 to-[#8B0000]/50 backdrop-blur-md">
            <CardHeader className="p-4 md:p-6">
              <CardTitle style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }} className="text-lg md:text-xl uppercase tracking-wide">Purpose & Goal</CardTitle>
              <CardDescription style={{ color: 'hsl(210 40% 80%)', fontFamily: '"Chakra Petch", sans-serif' }} className="text-xs md:text-sm">Why you're on this spiritual journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 md:p-6">
              <div className="space-y-2">
                <Label htmlFor="purpose" style={{ color: 'hsl(210 40% 80%)', fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm md:text-base font-semibold uppercase tracking-wide">Purpose</Label>
                <Textarea 
                  id="purpose" 
                  value={formData.purpose}
                  onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="What is the purpose of your spiritual practice?"
                  className="min-h-[80px] md:min-h-[100px] text-sm md:text-base bg-[radial-gradient(ellipse_at_top_left,#8B0000,#5C0000)] text-white placeholder:text-white/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal" style={{ color: 'hsl(210 40% 80%)', fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm md:text-base font-semibold uppercase tracking-wide">Goal</Label>
                <Textarea 
                  id="goal" 
                  value={formData.goal}
                  onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                  placeholder="What is your specific spiritual goal?"
                  className="min-h-[80px] md:min-h-[100px] text-sm md:text-base bg-[radial-gradient(ellipse_at_top_left,#8B0000,#5C0000)] text-white placeholder:text-white/70"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-[#DC143C]/50 to-[#8B0000]/50 backdrop-blur-md">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl uppercase tracking-wide" style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }}>
                <Heart className="h-4 w-4 md:h-5 md:w-5" style={{ color: 'hsl(45 100% 50%)', filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))' }} />
                <span>Divine Connection</span>
              </CardTitle>
              <CardDescription style={{ color: 'hsl(210 40% 80%)', fontFamily: '"Chakra Petch", sans-serif' }} className="text-xs md:text-sm">Your chosen deity or spiritual focus</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 md:p-6">
              <div className="space-y-2">
                <Label htmlFor="deity" style={{ color: 'hsl(210 40% 80%)', fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm md:text-base font-semibold uppercase tracking-wide">Deity or Spiritual Focus</Label>
                <Input 
                  id="deity" 
                  value={formData.deity}
                  onChange={(e) => setFormData(prev => ({ ...prev, deity: e.target.value }))}
                  placeholder="Who or what is your spiritual focus?"
                  className="text-sm md:text-base bg-gradient-to-r from-[#8B0000] to-[#5C0000] text-white placeholder:text-white/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" style={{ color: 'hsl(210 40% 80%)', fontFamily: '"Chakra Petch", sans-serif' }} className="text-sm md:text-base font-semibold uppercase tracking-wide">Your Message</Label>
                <Textarea 
                  id="message" 
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="What message would you like to share with your deity?"
                  className="min-h-[80px] md:min-h-[100px] text-sm md:text-base bg-[radial-gradient(ellipse_at_top_left,#8B0000,#5C0000)] text-white placeholder:text-white/70"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-[#DC143C]/50 to-[#8B0000]/50 backdrop-blur-md">
          <CardHeader className="p-4 md:p-6">
            <CardTitle style={{ color: 'hsl(45 100% 50%)', fontFamily: '"Chakra Petch", sans-serif', textShadow: '0 0 8px rgba(255, 215, 0, 0.6)' }} className="text-lg md:text-xl uppercase tracking-wide">Offerings & Practices</CardTitle>
            <CardDescription style={{ color: 'hsl(210 40% 80%)', fontFamily: '"Chakra Petch", sans-serif' }} className="text-xs md:text-sm">What you'll be doing or offering for your spiritual practice</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              {formData.offerings.map((offering, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={offering} 
                    onChange={(e) => handleOfferingChange(index, e.target.value)}
                    placeholder={`Offering or practice ${index + 1}`}
                    className="text-sm md:text-base bg-gradient-to-r from-[#8B0000] to-[#5C0000] text-white placeholder:text-white/70"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="shrink-0 h-9 w-9 md:h-10 md:w-10"
                    onClick={() => handleRemoveOffering(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2 md:mt-3 text-sm md:text-base h-9 md:h-10" onClick={handleAddOffering}>
                + Add New Offering
              </Button>
              <Button 
                className="w-full mt-4 md:mt-6 bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg transition-all hover:shadow-amber-500/50 text-sm md:text-base h-10 md:h-12 rounded-full" 
                onClick={handleSave}
              >
                <Save className="mr-2 h-4 w-4 md:h-5 md:w-5" />
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