import { Sadhana } from '@/types/sadhana';
import SadhanaCard from './SadhanaCard';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SadhanaGroupProps {
  title: string;
  sadhanas: Sadhana[];
  onUpdate: (sadhana: Sadhana) => void;
  onDelete: (id: number) => void;
  onToggleCompletion: (sadhana: Sadhana) => void;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
}

const SadhanaGroup = ({ 
  title, 
  sadhanas, 
  onUpdate, 
  onDelete, 
  onToggleCompletion, 
  isCollapsible = false,
  defaultOpen = true,
}: SadhanaGroupProps) => {
  if (!sadhanas || sadhanas.length === 0) {
    return null;
  }

  const handleToggleCompletion = (id: number) => {
    const sadhana = sadhanas.find(s => s.id === id);
    if (sadhana) {
      onToggleCompletion(sadhana);
    }
  };

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {sadhanas.map(sadhana => {
        // Convert Sadhana to SharedSadhana by adding the required isShared property
        const sharedSadhana = {
          ...sadhana,
          isShared: false
        };
        
        return (
          <SadhanaCard
            key={sadhana.id}
            sadhana={sharedSadhana}
            onToggleCompletion={handleToggleCompletion}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        );
      })}
    </div>
  );

  if (isCollapsible) {
    return (
      <Collapsible defaultOpen={defaultOpen}>
        <CollapsibleTrigger className="w-full group">
          <div className="flex justify-between items-center border-b border-purple-500/20 pb-3">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
              {title}
              <span className="text-sm font-normal text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                {sadhanas.length}
              </span>
            </h2>
            <Button variant="ghost" size="sm" className="w-auto p-2 cosmic-highlight">
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-5 animate-in fade-in-0 zoom-in-95">
           {content}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 border-b border-purple-500/20 pb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
        {title} 
        <span className="text-sm font-normal text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
          {sadhanas.length}
        </span>
      </h2>
      {content}
    </div>
  );
};

export default SadhanaGroup;