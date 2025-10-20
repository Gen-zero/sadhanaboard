import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import CosmicToast from './CosmicToast';
import soundManager from '@/utils/soundManager';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

const CosmicToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Function to show a toast
  const showToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, type, message };
    
    setToasts(prev => [...prev, newToast]);
    
    // Play sound based on type
    switch (type) {
      case 'success':
        soundManager.playSuccessSound();
        break;
      case 'info':
        soundManager.playInfoSound();
        break;
      case 'error':
        soundManager.playErrorSound();
        break;
      case 'warning':
        soundManager.playInfoSound();
        break;
    }
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  // Function to remove a toast
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Make showToast available globally
  useEffect(() => {
    (window as any).showCosmicToast = showToast;
    
    return () => {
      delete (window as any).showCosmicToast;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <CosmicToast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CosmicToastManager;