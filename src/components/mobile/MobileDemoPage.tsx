import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  User, 
  Plus, 
  Bell, 
  Search,
  Settings,
  ChevronRight,
  Check,
  X,
  Menu,
  MoreVertical,
  Heart,
  Star,
  ThumbsUp,
  Zap,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CheckSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TouchGestureArea } from '@/hooks/useTouchGestures';
import { 
  AndroidButton,
  AndroidCard,
  AndroidAppBar,
  AndroidListItem,
  FloatingActionButton,
  AndroidDialog,
  AndroidBottomSheet,
  useSnackbar,
  Snackbar,
  useToast as useAndroidToast,
  Toast,
  AndroidSwitch,
  AndroidCheckbox,
  AndroidRadio,
  AndroidChip,
  AndroidTab,
  AndroidExpansionPanel,
  AndroidLinearProgress
} from './AndroidMobileComponents';
import { 
  MobileInput, 
  MobileTextarea, 
  MobilePasswordInput, 
  MobileSearchInput, 
  MobileButton 
} from './MobileFormComponents';
import PullToRefresh from './PullToRefresh';

const MobileDemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [heartCount, setHeartCount] = useState(0);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [expansionPanelOpen, setExpansionPanelOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(30);
  
  const { toast } = useToast();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { toast: androidToast, showToast } = useAndroidToast();

  // Handle pull to refresh
  const handleRefresh = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        showToast({ message: 'Content refreshed!' });
        resolve();
      }, 1500);
    });
  };

  // Handle swipe gestures
  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down', velocity: number) => {
    console.log(`Swiped ${direction} with velocity ${velocity}`);
    
    if (velocity > 1.0) {
      showToast({ 
        message: `Fast ${direction} swipe detected!`, 
        duration: 2000 
      });
    }
  };

  // Handle navigation
  const handleNavItemClick = (id: string) => {
    setActiveTab(id);
    toast({
      title: "Navigation",
      description: `Switched to ${id} tab`
    });
  };

  // Handle quick actions
  const handleLike = () => {
    setLikeCount(prev => prev + 1);
    showToast({ message: `Liked! (${likeCount + 1})` });
  };

  const handleFavorite = () => {
    setFavoriteCount(prev => prev + 1);
    showToast({ message: `Favorited! (${favoriteCount + 1})` });
  };

  const handleHeart = () => {
    setHeartCount(prev => prev + 1);
    showToast({ message: `Hearted! (${heartCount + 1})` });
  };

  // Handle chip selection
  const handleChipSelect = (chip: string) => {
    setSelectedChip(chip === selectedChip ? null : chip);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSnackbar({
      message: "Form submitted successfully!",
      actionLabel: "Undo",
      onAction: () => {
        showToast({ message: "Action undone" });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Pull to Refresh Wrapper */}
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Android App Bar */}
        <AndroidAppBar 
          title="Mobile Demo"
          onMenuClick={() => setBottomSheetOpen(true)}
          onSearchClick={() => showToast({ message: 'Search opened' })}
          onMoreClick={() => setDialogOpen(true)}
        />
        
        {/* Main Content */}
        <div className="pt-16 px-4 space-y-6">
          {/* Welcome Card */}
          <AndroidCard className="p-6">
            <h1 className="text-2xl font-bold mb-2">Mobile UI Demo</h1>
            <p className="text-muted-foreground mb-4">
              This demo showcases all the enhanced mobile components with Android-like styling.
            </p>
            <div className="flex flex-wrap gap-2">
              <AndroidChip 
                label="UI Components" 
                selected={selectedChip === 'ui'}
                onClick={() => handleChipSelect('ui')}
              />
              <AndroidChip 
                label="Gestures" 
                selected={selectedChip === 'gestures'}
                onClick={() => handleChipSelect('gestures')}
              />
              <AndroidChip 
                label="Forms" 
                selected={selectedChip === 'forms'}
                onClick={() => handleChipSelect('forms')}
              />
            </div>
          </AndroidCard>
          
          {/* Progress Demo */}
          <AndroidCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Progress Indicators</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Loading...</span>
                  <span>{progressValue}%</span>
                </div>
                <AndroidLinearProgress value={progressValue} />
              </div>
              <div className="flex gap-2">
                <AndroidButton 
                  variant="outlined" 
                  size="small"
                  onClick={() => setProgressValue(Math.max(0, progressValue - 10))}
                >
                  Decrease
                </AndroidButton>
                <AndroidButton 
                  variant="outlined" 
                  size="small"
                  onClick={() => setProgressValue(Math.min(100, progressValue + 10))}
                >
                  Increase
                </AndroidButton>
              </div>
            </div>
          </AndroidCard>
          
          {/* Form Components Demo */}
          <AndroidCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Form Components</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <MobileInput
                label="Name"
                placeholder="Enter your name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              
              <MobileSearchInput
                placeholder="Search anything..."
                value={searchValue}
                onSearch={setSearchValue}
              />
              
              <MobilePasswordInput
                label="Password"
                placeholder="Enter your password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
              />
              
              <MobileTextarea
                label="Message"
                placeholder="Enter your message"
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                maxLength={200}
                showCharCount
              />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enable notifications</span>
                <AndroidSwitch 
                  checked={switchChecked}
                  onChange={setSwitchChecked}
                />
              </div>
              
              <div className="space-y-2">
                <AndroidCheckbox
                  checked={checkboxChecked}
                  onChange={setCheckboxChecked}
                  label="I agree to the terms and conditions"
                />
                
                <div className="space-y-2">
                  <AndroidRadio
                    checked={radioValue === 'option1'}
                    onChange={() => setRadioValue('option1')}
                    label="Option 1"
                  />
                  <AndroidRadio
                    checked={radioValue === 'option2'}
                    onChange={() => setRadioValue('option2')}
                    label="Option 2"
                  />
                  <AndroidRadio
                    checked={radioValue === 'option3'}
                    onChange={() => setRadioValue('option3')}
                    label="Option 3"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <MobileButton type="submit" className="flex-1">
                  Submit
                </MobileButton>
                <MobileButton 
                  variant="outline" 
                  type="button" 
                  onClick={() => {
                    setInputValue('');
                    setSearchValue('');
                    setPasswordValue('');
                    setTextareaValue('');
                  }}
                >
                  Clear
                </MobileButton>
              </div>
            </form>
          </AndroidCard>
          
          {/* Touch Gesture Demo */}
          <AndroidCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Touch Gestures</h2>
            <TouchGestureArea
              gestureOptions={{
                onSwipe: handleSwipe,
                onSwipeLeft: () => console.log('Swiped left'),
                onSwipeRight: () => console.log('Swiped right'),
                onSwipeUp: () => console.log('Swiped up'),
                onSwipeDown: () => console.log('Swiped down'),
                onTap: () => showToast({ message: 'Tapped!' }),
                onDoubleTap: () => showToast({ message: 'Double tapped!' }),
                onLongPress: () => showToast({ message: 'Long pressed!' }),
                threshold: 30,
                velocityThreshold: 0.3
              }}
              className="h-48 bg-secondary/20 rounded-xl flex items-center justify-center border-2 border-dashed border-border cursor-pointer"
            >
              <div className="text-center p-4">
                <div className="text-2xl mb-2">👆</div>
                <p className="font-medium">Touch & Gesture Area</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try swiping, tapping, or pinching
                </p>
              </div>
            </TouchGestureArea>
            
            <div className="grid grid-cols-4 gap-2 mt-4">
              <AndroidButton 
                variant="outlined" 
                size="small"
                icon={<ArrowLeft size={16} />}
                onClick={() => handleSwipe('left', 1.5)}
              >
                &nbsp;
              </AndroidButton>
              <AndroidButton 
                variant="outlined" 
                size="small"
                icon={<ArrowUp size={16} />}
                onClick={() => handleSwipe('up', 1.5)}
              >
                &nbsp;
              </AndroidButton>
              <AndroidButton 
                variant="outlined" 
                size="small"
                icon={<ArrowDown size={16} />}
                onClick={() => handleSwipe('down', 1.5)}
              >
                &nbsp;
              </AndroidButton>
              <AndroidButton 
                variant="outlined" 
                size="small"
                icon={<ArrowRight size={16} />}
                onClick={() => handleSwipe('right', 1.5)}
              >
                &nbsp;
              </AndroidButton>
            </div>
          </AndroidCard>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <AndroidButton
              variant="filled"
              color="primary"
              size="large"
              icon={<ThumbsUp size={20} />}
              onClick={handleLike}
              className="flex-col h-20"
            >
              <span className="text-xs mt-1">Like ({likeCount})</span>
            </AndroidButton>
            
            <AndroidButton
              variant="filled"
              color="secondary"
              size="large"
              icon={<Star size={20} />}
              onClick={handleFavorite}
              className="flex-col h-20"
            >
              <span className="text-xs mt-1">Favorite ({favoriteCount})</span>
            </AndroidButton>
            
            <AndroidButton
              variant="filled"
              color="danger"
              size="large"
              icon={<Heart size={20} />}
              onClick={handleHeart}
              className="flex-col h-20"
            >
              <span className="text-xs mt-1">Heart ({heartCount})</span>
            </AndroidButton>
          </div>
          
          {/* Expansion Panel Demo */}
          <AndroidExpansionPanel
            title="Advanced Settings"
            expanded={expansionPanelOpen}
            onToggle={() => setExpansionPanelOpen(!expansionPanelOpen)}
          >
            <div className="space-y-4">
              <p className="text-muted-foreground">
                This is an example of an expansion panel that can be used to hide and show additional content.
              </p>
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <AndroidSwitch checked={true} onChange={() => {}} />
              </div>
              <div className="flex items-center justify-between">
                <span>Push Notifications</span>
                <AndroidSwitch checked={false} onChange={() => {}} />
              </div>
            </div>
          </AndroidExpansionPanel>
          
          {/* List Items Demo */}
          <AndroidCard>
            <AndroidListItem
              title="Account Settings"
              icon={<Settings size={24} />}
              trailing={<ChevronRight size={20} />}
              onClick={() => showToast({ message: 'Account settings opened' })}
            />
            <AndroidListItem
              title="Notifications"
              icon={<Bell size={24} />}
              trailing={<ChevronRight size={20} />}
              onClick={() => showToast({ message: 'Notifications opened' })}
            />
            <AndroidListItem
              title="Privacy Policy"
              icon={<User size={24} />}
              trailing={<ChevronRight size={20} />}
              onClick={() => showToast({ message: 'Privacy policy opened' })}
            />
          </AndroidCard>
        </div>
        
        {/* Android Floating Action Button */}
        <FloatingActionButton 
          icon={<Plus size={24} />}
          onClick={() => showToast({ message: 'FAB tapped!' })}
        />
        
        {/* Android Dialog */}
        <AndroidDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Options"
        >
          <div className="space-y-2">
            <AndroidListItem
              title="View Profile"
              icon={<User size={20} />}
              onClick={() => {
                showToast({ message: 'Profile opened' });
                setDialogOpen(false);
              }}
            />
            <AndroidListItem
              title="Account Settings"
              icon={<Settings size={20} />}
              onClick={() => {
                showToast({ message: 'Settings opened' });
                setDialogOpen(false);
              }}
            />
            <AndroidListItem
              title="Help & Support"
              icon={<Search size={20} />}
              onClick={() => {
                showToast({ message: 'Help opened' });
                setDialogOpen(false);
              }}
            />
          </div>
        </AndroidDialog>
        
        {/* Android Bottom Sheet */}
        <AndroidBottomSheet
          open={bottomSheetOpen}
          onClose={() => setBottomSheetOpen(false)}
        >
          <div className="space-y-2">
            <AndroidListItem
              title="Settings"
              icon={<Settings size={24} />}
              trailing={<ChevronRight size={20} />}
              onClick={() => {
                showToast({ message: 'Settings opened' });
                setBottomSheetOpen(false);
              }}
            />
            <AndroidListItem
              title="Notifications"
              icon={<Bell size={24} />}
              trailing={<ChevronRight size={20} />}
              onClick={() => {
                showToast({ message: 'Notifications opened' });
                setBottomSheetOpen(false);
              }}
            />
            <AndroidListItem
              title="Help & Support"
              icon={<Search size={24} />}
              trailing={<ChevronRight size={20} />}
              onClick={() => {
                showToast({ message: 'Help opened' });
                setBottomSheetOpen(false);
              }}
            />
          </div>
        </AndroidBottomSheet>
        
        {/* Snackbar */}
        <Snackbar snackbar={snackbar} onClose={hideSnackbar} />
        
        {/* Toast */}
        <Toast toast={androidToast} />
      </PullToRefresh>
    </div>
  );
};

export default MobileDemoPage;