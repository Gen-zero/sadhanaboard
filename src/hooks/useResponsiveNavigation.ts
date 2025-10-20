import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

/**
 * Hook for managing responsive navigation state
 */
export const useResponsiveNavigation = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle responsive navigation changes
  useEffect(() => {
    if (isMobile) {
      // On mobile, close sidebar and manage mobile menu state
      setIsSidebarOpen(false);
    } else {
      // On desktop, open sidebar by default
      setIsSidebarOpen(true);
      // Close mobile menu when switching to desktop
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  // Close mobile menu when navigating
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Toggle sidebar on desktop
  const toggleSidebar = () => {
    if (!isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  // Open mobile menu
  const openMobileMenu = () => {
    if (isMobile) {
      setIsMobileMenuOpen(true);
    }
  };

  return {
    // State
    isMobile,
    isSidebarOpen,
    isMobileMenuOpen,
    
    // Actions
    setIsSidebarOpen,
    setIsMobileMenuOpen,
    closeMobileMenu,
    toggleSidebar,
    openMobileMenu
  };
};