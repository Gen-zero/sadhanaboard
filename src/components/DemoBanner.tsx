import { useDemoMode } from '@/hooks/useDemoMode';
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const DemoBanner = () => {
  const { isDemoMode } = useDemoMode();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isDemoMode || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-amber-500/10 border-b border-amber-500/30 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-amber-900">
              Demo Mode Active
            </p>
            <p className="text-xs text-amber-800">
              You are using the application in demo mode. Backend connection is not required.
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDismissed(true)}
          className="h-6 w-6 p-0 hover:bg-amber-500/20"
        >
          <X className="h-4 w-4 text-amber-600" />
        </Button>
      </div>
    </div>
  );
};

export default DemoBanner;
