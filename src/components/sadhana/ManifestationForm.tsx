import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useThemeColors } from '@/hooks/useThemeColors';

interface ManifestationFormProps {
  onClose: () => void;
}

const ManifestationForm = ({ onClose }: ManifestationFormProps) => {
  const [manifestationIntent, setManifestationIntent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { colors } = useThemeColors();

  const handleSubmitManifestation = () => {
    if (!manifestationIntent.trim()) {
      toast({
        title: "Empty Intention",
        description: "Please share your intention",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate sending the intention
    setTimeout(() => {
      toast({
        title: "Intention Sent",
        description: "Your intention has been recorded",
      });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="relative">
      <Card className="border border-white bg-transparent backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: 'hsl(45 100% 50%)' }}>
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Manifest Your Intention</span>
          </CardTitle>
          <CardDescription style={{ color: 'white' }}>
            Write your intention clearly to begin manifesting it
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manifestation" className="flex items-center gap-1" style={{ color: 'white' }}>
              <span>Your Intention</span>
            </Label>
            <Textarea 
              id="manifestation" 
              value={manifestationIntent}
              onChange={(e) => setManifestationIntent(e.target.value)}
              placeholder="Write your intention clearly..."
              className="min-h-[150px] bg-background/50 border border-primary/30 placeholder:text-muted-foreground/50 
              text-foreground focus-visible:ring-primary/50 resize-none"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitManifestation}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  <span>Send Intention</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManifestationForm;