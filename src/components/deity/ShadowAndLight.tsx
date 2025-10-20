
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CloudLightning, Star, Check, Plus } from 'lucide-react';

interface ShadowAndLightProps {
  deityData: {
    shadowSelf: {
      traits: string[];
      challenges: string;
    };
    perfectBeing: {
      traits: string[];
      aspirations: string;
    };
  };
  onShadowTraitChange: (index: number, value: string) => void;
  onPerfectTraitChange: (index: number, value: string) => void;
  onAddShadowTrait: () => void;
  onAddPerfectTrait: () => void;
  onShadowChallengesChange: (value: string) => void;
  onPerfectAspirationsChange: (value: string) => void;
  onSaveChanges: () => void;
}

const ShadowAndLight = ({ 
  deityData,
  onShadowTraitChange,
  onPerfectTraitChange,
  onAddShadowTrait,
  onAddPerfectTrait,
  onShadowChallengesChange,
  onPerfectAspirationsChange,
  onSaveChanges
}: ShadowAndLightProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="overflow-hidden border-red-500/20">
        <CardHeader className="bg-gradient-to-r from-red-900/20 to-purple-900/20">
          <CardTitle className="flex items-center gap-2">
            <CloudLightning className="h-5 w-5 text-red-400" />
            <span>Shadow Self</span>
          </CardTitle>
          <CardDescription>
            The aspects of yourself that require integration
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Shadow Traits</h3>
            <div className="space-y-2">
              {deityData.shadowSelf.traits.map((trait, index) => (
                <Input
                  key={index}
                  value={trait}
                  onChange={(e) => onShadowTraitChange(index, e.target.value)}
                  className="border-red-500/20"
                  placeholder={`Shadow trait ${index + 1}`}
                />
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 border-red-500/20"
                onClick={onAddShadowTrait}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Shadow Trait
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Shadow Challenges</h3>
            <Textarea
              value={deityData.shadowSelf.challenges}
              onChange={(e) => onShadowChallengesChange(e.target.value)}
              className="min-h-[120px] border-red-500/20"
              placeholder="Describe the challenges of your shadow self..."
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden border-blue-500/20">
        <CardHeader className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-400" />
            <span>Perfect Being</span>
          </CardTitle>
          <CardDescription>
            The highest expression of your divine nature
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Divine Traits</h3>
            <div className="space-y-2">
              {deityData.perfectBeing.traits.map((trait, index) => (
                <Input
                  key={index}
                  value={trait}
                  onChange={(e) => onPerfectTraitChange(index, e.target.value)}
                  className="border-blue-500/20"
                  placeholder={`Divine trait ${index + 1}`}
                />
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 border-blue-500/20"
                onClick={onAddPerfectTrait}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Divine Trait
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Divine Aspirations</h3>
            <Textarea
              value={deityData.perfectBeing.aspirations}
              onChange={(e) => onPerfectAspirationsChange(e.target.value)}
              className="min-h-[120px] border-blue-500/20"
              placeholder="Describe the aspirations of your perfect being..."
            />
          </div>
        </CardContent>
      </Card>
      
      <Button 
        onClick={onSaveChanges}
        className="col-span-1 md:col-span-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-purple-700"
      >
        <Check className="mr-2 h-4 w-4" /> Save Shadow & Light Integration
      </Button>
    </div>
  );
};

export default ShadowAndLight;
