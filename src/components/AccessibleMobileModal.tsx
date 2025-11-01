import React, { useState, useEffect, useRef } from 'react';
import { useFocusManagement } from '@/hooks/useFocusManagement.ts';
import { useVoiceAnnouncement } from '@/hooks/useVoiceAnnouncement.ts';

interface AccessibleMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AccessibleMobileModal: React.FC<AccessibleMobileModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { trapFocus } = useFocusManagement();
  const { announce } = useVoiceAnnouncement();
  const [previousActiveElement, setPreviousActiveElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      setPreviousActiveElement(document.activeElement as HTMLElement);
      
      // Trap focus in modal
      const cleanup = modalRef.current ? trapFocus(modalRef.current) : undefined;
      
      // Announce modal opening
      announce(`${title} dialog opened`, 'assertive');
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        cleanup?.();
        document.body.style.overflow = '';
      };
    } else {
      // Restore focus
      previousActiveElement?.focus();
    }
  }, [isOpen, title, announce, trapFocus, previousActiveElement]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        announce('Dialog closed');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, announce]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
          announce('Dialog closed');
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (e.target === e.currentTarget) {
            onClose();
            announce('Dialog closed');
          }
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Close dialog"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-background border rounded-lg shadow-lg p-6 mobile-modal"
      >
        <h2 id="modal-title" className="text-lg font-semibold mb-2">
          {title}
        </h2>
        {description && (
          <p id="modal-description" className="text-sm text-muted-foreground mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default AccessibleMobileModal;