import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  MoreVertical
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  AndroidButton,
  AndroidCard,
  AndroidAppBar,
  AndroidBottomNav,
  AndroidListItem,
  FloatingActionButton,
  AndroidDialog,
  AndroidBottomSheet,
  useSnackbar,
  Snackbar,
  useToast,
  Toast
} from './AndroidMobileComponents';

interface AndroidMobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AndroidMobileLayout: React.FC<AndroidMobileLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const { toast, showToast } = useToast();
  
  // Navigation items for bottom navigation
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: <Home size={24} />, path: '/dashboard' },
    { id: 'sadhana', label: 'Sadhana', icon: <Check size={24} />, path: '/sadhana' },
    { id: 'saadhanas', label: 'Saadhanas', icon: <Check size={24} />, path: '/saadhanas' },
    { id: 'library', label: 'Library', icon: <BookOpen size={24} />, path: '/library' },
    { id: 'profile', label: 'Profile', icon: <User size={24} />, path: '/profile' }
  ];
  
  // Determine active navigation item based on current path
  const getActiveNavItem = () => {
    const path = location.pathname;
    if (path.startsWith('/sadhana') && !path.startsWith('/saadhanas')) return 'sadhana';
    if (path.startsWith('/saadhanas')) return 'saadhanas';
    if (path.startsWith('/library')) return 'library';
    if (path.startsWith('/profile')) return 'profile';
    return 'dashboard';
  };
  
  // Handle navigation item click
  const handleNavItemClick = (id: string) => {
    const item = navItems.find(navItem => navItem.id === id);
    if (item) {
      navigate(item.path);
    }
  };
  
  // Show a sample snackbar
  const showSampleSnackbar = () => {
    showSnackbar({
      message: 'Task completed successfully!',
      actionLabel: 'Undo',
      onAction: () => {
        showToast({ message: 'Action undone' });
      }
    });
  };
  
  // Show a sample toast
  const showSampleToast = () => {
    showToast({ message: 'Changes saved' });
  };
  
  return (
    <div className={`flex flex-col min-h-screen bg-background ${className}`}>
      {/* Android App Bar */}
      <AndroidAppBar 
        title="SadhanaBoard"
        onMenuClick={() => setBottomSheetOpen(true)}
        onSearchClick={() => showToast({ message: 'Search functionality coming soon' })}
        onMoreClick={() => setDialogOpen(true)}
      />
      
      {/* Main Content Area with top spacing */}
      <main className="flex-1 overflow-y-auto pt-16">
        {children}
      </main>
      
      {/* Android Floating Action Button */}
      <FloatingActionButton 
        icon={<Plus size={24} />}
        onClick={() => navigate('/sadhana/new')}
      />
      
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
              navigate('/settings');
              setBottomSheetOpen(false);
            }}
          />
          <AndroidListItem
            title="Notifications"
            icon={<Bell size={24} />}
            trailing={<ChevronRight size={20} />}
            onClick={() => {
              navigate('/notifications');
              setBottomSheetOpen(false);
            }}
          />
          <AndroidListItem
            title="Help & Support"
            icon={<Search size={24} />}
            trailing={<ChevronRight size={20} />}
            onClick={() => {
              navigate('/help');
              setBottomSheetOpen(false);
            }}
          />
        </div>
      </AndroidBottomSheet>
      
      {/* Android Dialog */}
      <AndroidDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Options"
      >
        <div className="space-y-4">
          <AndroidListItem
            title="View Profile"
            onClick={() => {
              navigate('/profile');
              setDialogOpen(false);
            }}
          />
          <AndroidListItem
            title="Account Settings"
            onClick={() => {
              navigate('/settings');
              setDialogOpen(false);
            }}
          />
          <AndroidListItem
            title="Show Snackbar"
            onClick={() => {
              showSampleSnackbar();
              setDialogOpen(false);
            }}
          />
          <AndroidListItem
            title="Show Toast"
            onClick={() => {
              showSampleToast();
              setDialogOpen(false);
            }}
          />
        </div>
      </AndroidDialog>
      
      {/* Snackbar */}
      <Snackbar snackbar={snackbar} onClose={hideSnackbar} />
      
      {/* Toast */}
      <Toast toast={toast} />
    </div>
  );
};

export default AndroidMobileLayout;