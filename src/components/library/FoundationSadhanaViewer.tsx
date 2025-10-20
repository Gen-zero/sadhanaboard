import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Clock, Users, Heart, Save, X } from 'lucide-react';
import { StoreSadhana } from '@/types/store';
import { useToast } from '@/components/ui/use-toast';

interface FoundationSadhanaViewerProps {
  sadhana: StoreSadhana;
  onClose: () => void;
  onStart: (sadhana: StoreSadhana) => void;
}

const FoundationSadhanaViewer = ({ sadhana, onClose, onStart }: FoundationSadhanaViewerProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [customData, setCustomData] = useState({
    purpose: '',
    goal: '',
    message: '',
    offerings: [''] as string[],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + (sadhana.duration * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    durationDays: sadhana.duration
  });

  // Update end date when start date or duration changes
  useEffect(() => {
    const startDate = new Date(customData.startDate);
    const endDate = new Date(startDate.getTime() + (sadhana.duration * 24 * 60 * 60 * 1000));
    setCustomData(prev => ({
      ...prev,
      endDate: endDate.toISOString().split('T')[0]
    }));
  }, [customData.startDate, sadhana.duration]);

  const handleAddOffering = () => {
    setCustomData(prev => ({
      ...prev,
      offerings: [...prev.offerings, '']
    }));
  };

  const handleRemoveOffering = (index: number) => {
    setCustomData(prev => ({
      ...prev,
      offerings: prev.offerings.filter((_, i) => i !== index)
    }));
  };

  const handleOfferingChange = (index: number, value: string) => {
    setCustomData(prev => ({
      ...prev,
      offerings: prev.offerings.map((offering, i) => i === index ? value : offering)
    }));
  };

  const handleStartDateChange = (date: string) => {
    setCustomData(prev => ({
      ...prev,
      startDate: date
    }));
  };

  const handleStartSadhana = () => {
    // Validate that at least one offering is provided
    const validOfferings = customData.offerings.filter(o => o.trim());
    if (validOfferings.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add at least one offering or practice for your sadhana.",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would create the sadhana
    toast({
      title: "Sadhana Started",
      description: `You've successfully started "${sadhana.title}". It will appear in your Sadhana Board.`,
    });
    
    // Call the start function passed from parent
    onStart(sadhana);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
          {sadhana.title}
        </h2>
        <Button variant="outline" size="icon" onClick={onClose} className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sadhana Information */}
        <Card className="backdrop-blur-sm bg-gradient-to-b from-background/70 to-secondary/10 border border-purple-500/20">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <BookOpen className="h-5 w-5 text-purple-500" />
              </div>
              <span>About This Practice</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <p className="text-muted-foreground">{sadhana.description}</p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30">
                {sadhana.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30">
                {sadhana.duration} days
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-500/10 border-green-500/30">
                {sadhana.isPremium ? 'Premium' : 'Free'}
              </Badge>
              <Badge variant="outline" className="text-xs bg-amber-500/10 border-amber-500/30">
                ⭐ {sadhana.rating}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{sadhana.completedBy} practitioners completed this</span>
            </div>
            
            <div className="pt-4">
              <h3 className="font-medium mb-2">What You'll Practice:</h3>
              <ul className="space-y-1">
                {sadhana.practices.map((practice, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span className="text-sm">{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-4">
              <h3 className="font-medium mb-2">Benefits:</h3>
              <ul className="space-y-1">
                {sadhana.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Customization Form */}
        <Card className="backdrop-blur-sm bg-gradient-to-b from-background/70 to-secondary/10 border border-purple-500/20">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Heart className="h-5 w-5 text-purple-500" />
              </div>
              <span>Personalize Your Practice</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="purpose">Your Purpose</Label>
              <Textarea 
                id="purpose" 
                value={customData.purpose}
                onChange={(e) => setCustomData(prev => ({ ...prev, purpose: e.target.value }))}
                placeholder="What is the purpose of your spiritual practice?"
                className="min-h-[80px] border-purple-500/20 focus:border-purple-500/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal">Your Goal</Label>
              <Textarea 
                id="goal" 
                value={customData.goal}
                onChange={(e) => setCustomData(prev => ({ ...prev, goal: e.target.value }))}
                placeholder="What is your specific spiritual goal?"
                className="min-h-[80px] border-purple-500/20 focus:border-purple-500/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea 
                id="message" 
                value={customData.message}
                onChange={(e) => setCustomData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="What message would you like to share with the divine?"
                className="min-h-[80px] border-purple-500/20 focus:border-purple-500/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Your Offerings & Practices</Label>
              <div className="space-y-2">
                {customData.offerings.map((offering, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={offering} 
                      onChange={(e) => handleOfferingChange(index, e.target.value)}
                      placeholder={`Offering or practice ${index + 1}`}
                      className="border-purple-500/20 focus:border-purple-500/50"
                    />
                    {customData.offerings.length > 1 && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="shrink-0 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20"
                        onClick={() => handleRemoveOffering(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20"
                  onClick={handleAddOffering}
                >
                  + Add Offering
                </Button>
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                <span>Duration: {sadhana.duration} days</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                  <Input 
                    id="startDate" 
                    type="date" 
                    value={customData.startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="endDate" className="text-xs">End Date</Label>
                  <Input 
                    id="endDate" 
                    type="date" 
                    value={customData.endDate}
                    readOnly
                    className="border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 transition-all duration-300 hover:scale-[1.02]"
              onClick={handleStartSadhana}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Begin This Practice
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FoundationSadhanaViewer;