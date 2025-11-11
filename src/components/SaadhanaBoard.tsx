import { useState, useEffect } from 'react';
import ManifestationForm from './sadhana/ManifestationForm';
import SadhanaHeader from './sadhana/SadhanaHeader';
import SadhanaContent from './sadhana/SadhanaContent';
import SadhanaFooter from './sadhana/SadhanaFooter';
import CosmicBackgroundSimple from './sadhana/CosmicBackgroundSimple';
import { useSadhanaData } from '@/hooks/useSadhanaData';
import { useManifestationForm } from '@/hooks/useManifestationForm';
import { useSadhanaView } from '@/hooks/useSadhanaView';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  Eye, 
  Pencil, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  AlertTriangle, 
  LayoutDashboard, 
  MoonStar 
} from 'lucide-react';
import { format } from 'date-fns';
import { useSettings } from '@/hooks/useSettings';
import { useDefaultThemeStyles } from '@/hooks/useDefaultThemeStyles';
import { useNavigate } from 'react-router-dom';
import type { StoreSadhana } from '@/types/store';

const SaadhanaBoard = () => {
  const navigate = useNavigate();
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
  const { settings } = useSettings();
  const { isDefaultTheme, defaultThemeClasses } = useDefaultThemeStyles();
  
  // Check if default theme is active (kept for backward compatibility)
  const isDefaultThemeCheck = settings?.appearance?.colorScheme === 'default';

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
              backgroundColor: 'hsl(var(--primary) / 0.1)', // Use theme primary color with opacity
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
                <div className={`p-6 rounded-lg ${isDefaultTheme ? defaultThemeClasses.borderedContainer : 'backdrop-blur-sm bg-background/70 border border-primary/20'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className={`text-2xl font-bold mb-2 ${isDefaultTheme ? defaultThemeClasses.primaryText : 'text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary'}`}>
                        Your Sacred Sadhana
                      </h2>
                      <div className="flex items-center gap-4 text-sm mb-2">
                        <span className={`flex items-center gap-1 ${isDefaultTheme ? defaultThemeClasses.secondaryText : ''}`}>
                          <Calendar className="h-4 w-4" />
                          {format(new Date(sadhanaData.startDate), 'MMM dd')} - {format(new Date(sadhanaData.endDate), 'MMM dd, yyyy')}
                        </span>
                        <span className={isDefaultTheme ? 'text-[hsl(var(--accent))]' : getStatusColor()}>
                          {getStatusMessage()}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      {sadhanaState.status === 'active' && (
                        <div className="space-y-2">
                          <Progress value={progress} className="h-2" />
                          <p className={`text-xs ${isDefaultTheme ? defaultThemeClasses.primaryText : 'text-muted-foreground'}`}>
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
                            className={`flex items-center gap-1 ${isDefaultTheme ? defaultThemeClasses.primaryButton : 'bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary-foreground'}`}
                            onClick={handleEditToggle}
                          >
                            {isEditing ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                            {isEditing ? 'View Paper' : 'Edit Details'}
                          </Button>
                          
                          {canComplete && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={`flex items-center gap-1 ${isDefaultTheme ? defaultThemeClasses.primaryButton : 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20 text-green-600'}`}
                              onClick={handleCompleteSadhana}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Complete Sadhana
                            </Button>
                          )}
                        </>
                      )}
                      
                      {sadhanaState.status === 'completed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`flex items-center gap-1 ${isDefaultTheme ? defaultThemeClasses.primaryButton : 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-600'}`}
                          onClick={() => navigate('/dashboard')}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          View Progress
                        </Button>
                      )}
                      
                      {sadhanaState.status === 'broken' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`flex items-center gap-1 ${isDefaultTheme ? defaultThemeClasses.primaryButton : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-600'}`}
                          onClick={handleResetSadhana}
                        >
                          <RotateCcw className="h-4 w-4" />
                          Start New
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sadhana Content */}
                <SadhanaContent 
                  isEditing={isEditing} 
                  view3D={view3D}
                  hasStarted={sadhanaState.hasStarted}
                  isCreating={false}
                  isSelecting={false}
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

                {/* Action Footer */}
                {sadhanaState.status === 'active' && !isEditing && (
                  <SadhanaFooter 
                    onBreakSadhana={handleBreakSadhana}
                    isDefaultTheme={isDefaultTheme}
                    defaultThemeClasses={defaultThemeClasses}
                  />
                )}
              </div>
            )}

            {!sadhanaState.hasStarted && (
              <div className={`p-8 rounded-xl text-center ${isDefaultTheme ? defaultThemeClasses.borderedContainer : 'backdrop-blur-sm bg-background/70 border border-primary/20'}`}>
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-primary/20 to-secondary/20">
                    <MoonStar className={`h-8 w-8 ${isDefaultTheme ? defaultThemeClasses.accentText : 'text-primary'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDefaultTheme ? defaultThemeClasses.primaryText : 'text-foreground'}`}>
                    Begin Your Sacred Journey
                  </h3>
                  <p className={`mb-6 ${isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-muted-foreground'}`}>
                    Start a new Sadhana practice to manifest your intentions and track your spiritual growth.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={startSadhanaCreation}
                      className={`px-6 ${isDefaultTheme ? defaultThemeClasses.primaryButton : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground'}`}
                    >
                      Create Custom Sadhana
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/store')}
                      className={`px-6 ${isDefaultTheme ? defaultThemeClasses.secondaryButton : 'border border-primary/30 hover:bg-primary/10 text-primary'}`}
                    >
                      Browse Sadhana Library
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Confirmation Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className={isDefaultTheme ? defaultThemeClasses.borderedContainer : ''}>
          <DialogHeader>
            <DialogTitle className={isDefaultTheme ? defaultThemeClasses.primaryText : ''}>
              Complete Sadhana
            </DialogTitle>
            <DialogDescription className={isDefaultTheme ? defaultThemeClasses.secondaryText : ''}>
              Are you sure you want to mark this Sadhana as completed? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setShowCompleteDialog(false)}
              className={isDefaultTheme ? defaultThemeClasses.secondaryButton : ''}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmCompleteSadhana}
              className={isDefaultTheme ? defaultThemeClasses.primaryButton : 'bg-green-500 hover:bg-green-600 text-white'}
            >
              Complete Sadhana
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Break Confirmation Dialog */}
      <Dialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
        <DialogContent className={isDefaultTheme ? defaultThemeClasses.borderedContainer : ''}>
          <DialogHeader>
            <DialogTitle className={isDefaultTheme ? defaultThemeClasses.primaryText : ''}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                End Sadhana Early
              </div>
            </DialogTitle>
            <DialogDescription className={isDefaultTheme ? defaultThemeClasses.secondaryText : ''}>
              Are you sure you want to end this Sadhana early? This will mark it as broken and you'll need to start a new one.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setShowBreakDialog(false)}
              className={isDefaultTheme ? defaultThemeClasses.secondaryButton : ''}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmBreakSadhana}
              className={isDefaultTheme ? defaultThemeClasses.primaryButton : 'bg-red-500 hover:bg-red-600 text-white'}
            >
              End Sadhana
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className={isDefaultTheme ? defaultThemeClasses.borderedContainer : ''}>
          <DialogHeader>
            <DialogTitle className={isDefaultTheme ? defaultThemeClasses.primaryText : ''}>
              Start New Sadhana
            </DialogTitle>
            <DialogDescription className={isDefaultTheme ? defaultThemeClasses.secondaryText : ''}>
              Are you sure you want to start a new Sadhana? This will reset your current progress.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setShowResetDialog(false)}
              className={isDefaultTheme ? defaultThemeClasses.secondaryButton : ''}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmResetSadhana}
              className={isDefaultTheme ? defaultThemeClasses.primaryButton : 'bg-blue-500 hover:bg-blue-600 text-white'}
            >
              Start New
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SaadhanaBoard;