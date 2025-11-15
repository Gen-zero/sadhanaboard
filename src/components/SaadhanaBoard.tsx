﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿import { useState, useEffect } from 'react';
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
import { Eye, Pencil, RotateCcw, CheckCircle, XCircle, Calendar, AlertTriangle } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in relative bg-transparent">
      <CosmicBackgroundSimple />
      
      {/* Enhanced cosmic overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(30)].map((_, i) => (
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
      
      <SadhanaHeader 
        showManifestationForm={showManifestationForm}
        view3D={view3D}
        showDashboard={false}
        setIsEditing={setIsEditing}
        setShowManifestationForm={setShowManifestationForm}
        setView3D={setView3D}
        setShowDashboard={() => {}} // No-op function since we're redirecting to the dashboard page
      />

      {showManifestationForm && (
        <div className="relative z-20">
          <ManifestationForm onClose={() => setShowManifestationForm(false)} />
        </div>
      )}

      <div className="flex justify-center relative z-10">
        <div className="w-full lg:max-w-4xl">
          {/* Sadhana Paper Section */}
          <div className="space-y-6">
            {sadhanaState.hasStarted && sadhanaData && (
              <div className="space-y-4">
                {/* Sadhana Header with Progress */}
                <div className="backdrop-blur-sm bg-transparent p-6 rounded-lg border border-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-2" style={{ color: 'hsl(45 100% 50%)' }}>
                        Your Sacred Sadhana
                      </h2>
                      <div className="flex items-center gap-4 text-sm mb-2">
                        <span className="flex items-center gap-1 text-foreground" style={{ color: 'white' }}>
                          <Calendar className="h-4 w-4" />
                          {format(new Date(sadhanaData.startDate), 'MMM dd')} - {format(new Date(sadhanaData.endDate), 'MMM dd, yyyy')}
                        </span>
                        <span className={getStatusColor()}>
                          {getStatusMessage()}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      {sadhanaState.status === 'active' && (
                        <div className="space-y-2">
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-foreground" style={{ color: 'white' }}>
                            {Math.round(progress)}% complete
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 shrink-0 ml-4">
                      {sadhanaState.status === 'active' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1 bg-primary/30 border-primary/50 hover:bg-primary/40 text-primary-foreground"
                            onClick={handleEditToggle}
                          >
                            {isEditing ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                            {isEditing ? 'View Paper' : 'Edit Details'}
                          </Button>
                          
                          {canComplete && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-1 bg-green-500/30 border-green-500/50 hover:bg-green-500/40 text-green-900"
                              onClick={handleCompleteSadhana}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Complete Sadhana
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1 bg-destructive/30 border-destructive/50 hover:bg-destructive/40 text-destructive-foreground"
                            onClick={handleBreakSadhana}
                          >
                            <XCircle className="h-4 w-4" />
                            Break Sadhana
                          </Button>
                        </>
                      )}
                      
                      {(sadhanaState.status === 'completed' || sadhanaState.status === 'broken') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1 bg-secondary/30 border-secondary/50 hover:bg-secondary/40 text-secondary-foreground"
                          onClick={handleResetSadhana}
                        >
                          <RotateCcw className="h-4 w-4" />
                          Start New Sadhana
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
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
          </div>
        </div>
      </div>
      
      <SadhanaFooter />
      
      {/* Complete Sadhana Confirmation Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              Complete Sadhana
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this sadhana as complete? You have successfully finished your spiritual practice!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-accent hover:bg-accent/90" onClick={confirmCompleteSadhana}>
              Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Break Sadhana Confirmation Dialog */}
      <Dialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Break Sadhana
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to break this sadhana? This will end your current practice early. You can start a new sadhana afterwards.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBreakDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-destructive hover:bg-destructive/90" onClick={confirmBreakSadhana}>
              Break
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Sadhana Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              Start New Sadhana
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to start a new sadhana? This will clear your current practice.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={confirmResetSadhana}>
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
      `}</style>
    </div>
  );
};

export default SaadhanaBoard;