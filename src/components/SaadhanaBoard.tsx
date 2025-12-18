import React, { useState, useEffect } from 'react';
import ManifestationForm from './sadhana/ManifestationForm';
import SadhanaHeader from './sadhana/SadhanaHeader';
import SadhanaContent from './sadhana/SadhanaContent';
import SadhanaFooter from './sadhana/SadhanaFooter';
import CosmicBackgroundSimple from './sadhana/CosmicBackgroundSimple';
import { useSadhanaData } from '@/hooks/useSadhanaData';
import { useManifestationForm } from '@/hooks/useManifestationForm';
import { useSadhanaView } from '@/hooks/useSadhanaView';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Eye, Pencil, RotateCcw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const SaadhanaBoard = () => {
  const { 
    sadhanaState, 
    sadhanaData, 
    paperContent, 
    startSadhanaCreation,
    cancelSadhanaCreation,
    createCustomSadhana,
    selectStoreSadhana,
    createSadhana,
    updateSadhana,
    completeSadhana,
    breakSadhana,
    resetSadhana,
    canComplete,
    daysRemaining,
    daysCompleted,
    progress
  } = useSadhanaData();
  
  const { isEditing, view3D, setIsEditing, setView3D } = useSadhanaView();
  const { showManifestationForm, setShowManifestationForm } = useManifestationForm();
  const { colors } = useThemeColors();
  
  // State for confirmation dialogs
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showBreakDialog, setShowBreakDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCompleteSadhana = () => {
    setShowCompleteDialog(true);
  };

  const handleBreakSadhana = () => {
    setShowBreakDialog(true);
  };

  const handleResetSadhana = () => {
    setShowResetDialog(true);
  };

  const confirmCompleteSadhana = () => {
    completeSadhana();
    setIsEditing(false);
    setView3D(false);
    setShowCompleteDialog(false);
  };

  const confirmBreakSadhana = () => {
    breakSadhana();
    setIsEditing(false);
    setView3D(false);
    setShowBreakDialog(false);
  };

  const confirmResetSadhana = () => {
    resetSadhana();
    setIsEditing(false);
    setView3D(false);
    setShowResetDialog(false);
  };

  const getStatusMessage = () => {
    if (sadhanaState.status === 'completed') {
      return 'Sadhana completed successfully! 🎉';
    }
    if (sadhanaState.status === 'broken') {
      return 'Sadhana was ended early. You can start a new one.';
    }
    if (canComplete) {
      return `Sadhana period complete! You can now mark it as finished.`;
    }
    return `Day ${daysCompleted} of ${sadhanaData?.durationDays} • ${daysRemaining} days remaining`;
  };

  const getStatusColor = () => {
    if (sadhanaState.status === 'completed') return 'text-green-600';
    if (sadhanaState.status === 'broken') return 'text-red-600';
    if (canComplete) return 'text-blue-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6 animate-fade-in relative bg-transparent">
      <CosmicBackgroundSimple />
      
      {/* Enhanced cosmic overlay - reduced for mobile performance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 hidden md:block">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: 'hsl(var(--primary) / 0.05)', // Use theme primary color with reduced opacity
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s infinite ease-in-out, pulse ${Math.random() * 8 + 4}s infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.3 + 0.1
            }}
          ></div>
        ))}
      </div>
      
      <div className="relative z-10 mb-6">
        <SadhanaHeader 
          showManifestationForm={showManifestationForm}
          view3D={view3D}
          showDashboard={false}
          setIsEditing={setIsEditing}
          setShowManifestationForm={setShowManifestationForm}
          setView3D={setView3D}
          setShowDashboard={() => {}} // No-op function since we're redirecting to the dashboard page
        />
      </div>

      {showManifestationForm && (
        <div className="relative z-20">
          <ManifestationForm onClose={() => setShowManifestationForm(false)} />
        </div>
      )}

      <div className="flex justify-center relative z-10">
        <div className="w-full lg:max-w-4xl">
          {/* Sadhana Paper Section */}
          <div className="space-y-6 mt-4">
            <SadhanaContent 
              isEditing={isEditing}
              view3D={view3D}
              hasStarted={sadhanaState.hasStarted}
              isCreating={sadhanaState.isCreating}
              isSelecting={sadhanaState.isSelecting}
              sadhanaData={sadhanaData}
              paperContent={paperContent}
              setView3D={setView3D}
              onStartSadhana={startSadhanaCreation}
              onCancelSadhana={cancelSadhanaCreation}
              onCreateSadhana={createSadhana}
              onUpdateSadhana={updateSadhana}
              onSelectStoreSadhana={selectStoreSadhana}
              onCreateCustomSadhana={createCustomSadhana}
              status={sadhanaState.status}
            />
            
            {sadhanaState.hasStarted && sadhanaData && (
              <div className="pt-4 border-t border-white/20">
                {/* Minimal Sadhana Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <span>Day {daysCompleted} of {sadhanaData.durationDays}</span>
                    </div>
                    {sadhanaState.status === 'active' && (
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={progress} className="h-1.5 w-24" />
                        <span className="text-xs text-foreground/60">{Math.round(progress)}%</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Minimal Action Buttons */}
                  <div className="flex gap-2">
                    {sadhanaState.status === 'active' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 text-xs bg-transparent border-white/30 hover:bg-white/10"
                          onClick={handleEditToggle}
                        >
                          {isEditing ? 'View' : 'Edit'}
                        </Button>
                        
                        {canComplete && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2 text-xs bg-green-500/20 border-green-500/50 hover:bg-green-500/30 text-green-300"
                            onClick={handleCompleteSadhana}
                          >
                            Complete
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-2 text-xs bg-destructive/20 border-destructive/50 hover:bg-destructive/30 text-destructive-foreground"
                          onClick={handleBreakSadhana}
                        >
                          Break
                        </Button>
                      </>
                    )}
                    
                    {(sadhanaState.status === 'completed' || sadhanaState.status === 'broken') && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 text-xs bg-secondary/20 border-secondary/50 hover:bg-secondary/30 text-secondary-foreground"
                        onClick={handleResetSadhana}
                      >
                        New
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <SadhanaFooter />
      
      {/* Complete Sadhana Confirmation Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg md:text-xl font-semibold uppercase tracking-wide" style={{ color: 'hsl(45 100% 50%)' }}>
              <CheckCircle className="h-5 w-5 text-amber-500" />
              Complete Sadhana
            </DialogTitle>
            <DialogDescription style={{ color: 'hsl(210 40% 80%)' }}>
              Are you sure you want to mark this sadhana as complete? You have successfully finished your spiritual practice!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-amber-500/50 hover:bg-amber-500/10 rounded-full" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-full" onClick={confirmCompleteSadhana}>
              Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Break Sadhana Confirmation Dialog */}
      <Dialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg md:text-xl font-semibold uppercase tracking-wide" style={{ color: 'hsl(45 100% 50%)' }}>
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Break Sadhana
            </DialogTitle>
            <DialogDescription style={{ color: 'hsl(210 40% 80%)' }}>
              Are you sure you want to break this sadhana? This will end your current practice early. You can start a new sadhana afterwards.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-amber-500/50 hover:bg-amber-500/10 rounded-full" onClick={() => setShowBreakDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-destructive hover:bg-destructive/90 rounded-full" onClick={confirmBreakSadhana}>
              Break
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Sadhana Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg md:text-xl font-semibold uppercase tracking-wide" style={{ color: 'hsl(45 100% 50%)' }}>
              <RotateCcw className="h-5 w-5 text-amber-500" />
              Start New Sadhana
            </DialogTitle>
            <DialogDescription style={{ color: 'hsl(210 40% 80%)' }}>
              Are you sure you want to start a new sadhana? This will clear your current practice.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-amber-500/50 hover:bg-amber-500/10 rounded-full" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-full" onClick={confirmResetSadhana}>
              Start New
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Custom styles for cosmic animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, 10px); }
          50% { transform: translate(0, 20px); }
          75% { transform: translate(-10px, 10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .space-y-8 {
            space-y: 1.5rem;
          }
          
          .backdrop-blur-sm {
            backdrop-filter: blur(8px);
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(SaadhanaBoard);