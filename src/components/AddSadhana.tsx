import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { Sadhana } from '@/types/sadhana';
import { StoreSadhana } from '@/types/store';
import SadhanaForm from './SadhanaForm';
import UnlockedSadhanas from './UnlockedSadhanas';

interface AddSadhanaProps {
  onAddSadhana: (newSadhana: Omit<Sadhana, 'id' | 'reflection'>) => boolean;
  triggerButton?: React.ReactNode;
}

const AddSadhana = ({ onAddSadhana, triggerButton }: AddSadhanaProps) => {
  const [open, setOpen] = useState(false);
  const [selectedStoreSadhana, setSelectedStoreSadhana] = useState<StoreSadhana | null>(null);
  const [newSadhana, setNewSadhana] = useState<Omit<Sadhana, 'id' | 'reflection'>>({
    title: '',
    description: '',
    completed: false,
    category: 'daily',
    dueDate: new Date().toISOString().split('T')[0],
    time: '09:00',
    priority: 'medium',
    tags: []
  });

  const handleSelectStoreSadhana = (storeSadhana: StoreSadhana) => {
    setSelectedStoreSadhana(storeSadhana);
    // Pre-fill the form with store sadhana data
    setNewSadhana({
      title: storeSadhana.title,
      description: storeSadhana.description,
      completed: false,
      category: 'daily', // Default to daily, user can change
      dueDate: new Date().toISOString().split('T')[0],
      time: '09:00',
      priority: storeSadhana.difficulty === 'advanced' ? 'high' : 
                storeSadhana.difficulty === 'intermediate' ? 'medium' : 'low',
      tags: storeSadhana.tags || []
    });
  };

  const handleClearSelection = () => {
    setSelectedStoreSadhana(null);
    setNewSadhana({
      title: '',
      description: '',
      completed: false,
      category: 'daily',
      dueDate: new Date().toISOString().split('T')[0],
      time: '09:00',
      priority: 'medium',
      tags: []
    });
  };

  const handleAdd = () => {
    if (onAddSadhana(newSadhana)) {
      setNewSadhana({
        title: '',
        description: '',
        completed: false,
        category: 'daily',
        dueDate: new Date().toISOString().split('T')[0],
        time: '09:00',
        priority: 'medium',
        tags: []
      });
      setSelectedStoreSadhana(null);
      setOpen(false);
    }
  };
  
  const defaultTrigger = (
    <Button className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/30">
      <Plus className="mr-2 h-4 w-4" />
      Add Sadhana
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Sadhana</DialogTitle>
          <DialogDescription>
            Create a new sadhana for your spiritual practice or choose from your unlocked practices.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Selected Store Sadhana Indicator */}
          {selectedStoreSadhana && (
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedStoreSadhana.genre.icon}</span>
                  <div>
                    <p className="font-medium text-sm">Using template:</p>
                    <p className="text-purple-600 font-semibold">{selectedStoreSadhana.title}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearSelection}
                  className="bg-background/70 border-purple-500/30 hover:bg-purple-500/10"
                >
                  Clear
                </Button>
              </div>
              {selectedStoreSadhana.practices.length > 0 && (
                <div className="mt-3 pt-3 border-t border-purple-500/20">
                  <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-2">Suggested Practices:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedStoreSadhana.practices.slice(0, 3).map((practice, index) => (
                      <span key={index} className="text-xs bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                        {practice}
                      </span>
                    ))}
                    {selectedStoreSadhana.practices.length > 3 && (
                      <span className="text-xs bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                        +{selectedStoreSadhana.practices.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Sadhana Form */}
          <SadhanaForm sadhana={newSadhana} setSadhana={setNewSadhana} />
          
          {/* Separator */}
          <Separator className="my-4" />
          
          {/* Unlocked Sadhanas */}
          <div>
            <UnlockedSadhanas 
              onSelectSadhana={handleSelectStoreSadhana} 
              selectedSadhanaId={selectedStoreSadhana?.id || null}
            />
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} className="bg-background/70 border-purple-500/30 hover:bg-purple-500/10">Cancel</Button>
          <Button onClick={handleAdd} className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/30">Add Sadhana</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSadhana;