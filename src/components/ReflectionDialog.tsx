
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sadhana } from '@/types/sadhana';

interface ReflectionDialogProps {
  reflectingSadhana: Sadhana | null;
  setReflectingSadhana: (sadhana: Sadhana | null) => void;
  reflectionText: string;
  setReflectionText: (text: string) => void;
  onSave: () => void;
}

const ReflectionDialog = ({
  reflectingSadhana,
  setReflectingSadhana,
  reflectionText,
  setReflectionText,
  onSave,
}: ReflectionDialogProps) => {

  const handleClose = () => {
    setReflectingSadhana(null);
    setReflectionText('');
  }
  
  return (
    <Dialog open={!!reflectingSadhana} onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Sadhana: {reflectingSadhana?.title}</DialogTitle>
          <DialogDescription>
            Record a reflection on your practice. This can be a thought, a feeling, or an insight you gained.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="reflection">Your Reflection</Label>
          <Textarea
            id="reflection"
            placeholder="How was your practice today?"
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            className="mt-2 min-h-[120px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={onSave}>Complete & Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ReflectionDialog;
