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
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useThemeColors } from '@/hooks/useThemeColors';

// Define types for all exported components
interface AndroidMobileComponents {
  AndroidButton: typeof AndroidButton;
  AndroidCard: typeof AndroidCard;
  AndroidAppBar: typeof AndroidAppBar;
  AndroidListItem: typeof AndroidListItem;
  AndroidSwitch: typeof AndroidSwitch;
  AndroidCheckbox: typeof AndroidCheckbox;
  AndroidRadio: typeof AndroidRadio;
  AndroidChip: typeof AndroidChip;
  useSnackbar: typeof useSnackbar;
  Snackbar: typeof Snackbar;
  useToast: typeof useToast;
  Toast: typeof Toast;
  AndroidDialog: typeof AndroidDialog;
  AndroidBottomSheet: typeof AndroidBottomSheet;
  FloatingActionButton: typeof FloatingActionButton;
  AndroidTab: typeof AndroidTab;
  AndroidExpansionPanel: typeof AndroidExpansionPanel;
  AndroidLinearProgress: typeof AndroidLinearProgress;
}

// Android-like Button Component
interface AndroidButtonProps {
  variant?: 'filled' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const AndroidButton = ({
  variant = 'filled',
  color = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  children,
  onClick,
  className = ''
}: AndroidButtonProps) => {
  const baseClasses = 'btn-android touch-ripple transition-all duration-200 active:scale-95';
  const variantClasses = `btn-android-${variant}`;
  
  const colorClasses = {
    primary: 'text-primary bg-primary border-primary',
    secondary: 'text-secondary bg-secondary border-secondary',
    danger: 'text-destructive bg-destructive border-destructive'
  }[color];
  
  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  }[size];
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${colorClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center justify-center">
        {icon && <span className="mr-2">{icon}</span>}
        <span>{children}</span>
      </div>
    </button>
  );
};

// Android-like Card Component
interface AndroidCardProps {
  elevation?: 1 | 2 | 3 | 4 | 5;
  children: React.ReactNode;
  className?: string;
}

export const AndroidCard = ({
  elevation = 1,
  children,
  className = ''
}: AndroidCardProps) => {
  return (
    <div className={`android-card material-elevation-${elevation} ${className}`}>
      {children}
    </div>
  );
};

// Android-like AppBar Component
interface AndroidAppBarProps {
  title: string;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onMoreClick?: () => void;
  className?: string;
}

export const AndroidAppBar = ({
  title,
  onMenuClick,
  onSearchClick,
  onMoreClick,
  className = ''
}: AndroidAppBarProps) => {
  return (
    <div className={`app-bar ${className}`}>
      {onMenuClick && (
        <button className="app-bar-action" onClick={onMenuClick} aria-label="Menu">
          <Menu size={24} />
        </button>
      )}
      <div className="app-bar-title">{title}</div>
      <div className="flex">
        {onSearchClick && (
          <button className="app-bar-action" onClick={onSearchClick} aria-label="Search">
            <Search size={24} />
          </button>
        )}
        {onMoreClick && (
          <button className="app-bar-action" onClick={onMoreClick} aria-label="More options">
            <MoreVertical size={24} />
          </button>
        )}
      </div>
    </div>
  );
};



// Android-like List Item Component
interface AndroidListItemProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const AndroidListItem = ({
  title,
  subtitle,
  icon,
  trailing,
  onClick,
  className = ''
}: AndroidListItemProps) => {
  return (
    <div 
      className={`android-list-item touch-ripple ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && <div className="android-list-item-icon">{icon}</div>}
      <div className="android-list-item-content">
        <div className="android-list-item-title">{title}</div>
        {subtitle && <div className="android-list-item-subtitle">{subtitle}</div>}
      </div>
      {trailing && <div>{trailing}</div>}
    </div>
  );
};

// Android-like Switch Component
interface AndroidSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const AndroidSwitch = ({
  checked,
  onChange,
  disabled = false,
  className = '',
  ariaLabel = 'Toggle switch'
}: AndroidSwitchProps) => {
  return (
    <label className={`android-switch ${className} ${disabled ? 'opacity-50' : ''}`} aria-label={ariaLabel}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="android-switch-slider"></span>
    </label>
  );
};

// Android-like Checkbox Component
interface AndroidCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const AndroidCheckbox = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  ariaLabel
}: AndroidCheckboxProps) => {
  return (
    <label className={`android-checkbox ${className} ${disabled ? 'opacity-50' : ''}`} aria-label={ariaLabel}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="android-checkbox-input"
      />
      <span className="android-checkbox-checkmark"></span>
      {label && <span>{label}</span>}
    </label>
  );
};

// Android-like Radio Button Component
interface AndroidRadioProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const AndroidRadio = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  ariaLabel
}: AndroidRadioProps) => {
  return (
    <label className={`android-radio ${className} ${disabled ? 'opacity-50' : ''}`} aria-label={ariaLabel}>
      <input
        type="radio"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="android-radio-input"
      />
      <span className="android-radio-checkmark"></span>
      {label && <span>{label}</span>}
    </label>
  );
};

// Android-like Chip Component
interface AndroidChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const AndroidChip = ({
  label,
  selected = false,
  onClick,
  className = ''
}: AndroidChipProps) => {
  return (
    <div 
      className={`android-chip ${selected ? 'selected' : ''} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {label}
    </div>
  );
};

// Android-like Snackbar Component
interface SnackbarProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
  onClose?: () => void;
}

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarProps | null>(null);
  
  const showSnackbar = (props: SnackbarProps) => {
    setSnackbar(props);
  };
  
  const hideSnackbar = () => {
    setSnackbar(null);
  };
  
  return { snackbar, showSnackbar, hideSnackbar };
};

export const Snackbar = ({ 
  snackbar, 
  onClose 
}: { 
  snackbar: SnackbarProps | null, 
  onClose: () => void 
}) => {
  useEffect(() => {
    if (snackbar) {
      const timer = setTimeout(() => {
        onClose();
      }, snackbar.duration || 4000);
      
      return () => clearTimeout(timer);
    }
  }, [snackbar, onClose]);
  
  if (!snackbar) return null;
  
  return (
    <motion.div
      className="snackbar show"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
    >
      <div>{snackbar.message}</div>
      {snackbar.actionLabel && (
        <button 
          className="snackbar-action" 
          onClick={() => {
            snackbar.onAction?.();
            onClose();
          }}
        >
          {snackbar.actionLabel}
        </button>
      )}
    </motion.div>
  );
};

// Android-like Toast Component
interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastProps | null>(null);
  
  const showToast = (props: Omit<ToastProps, 'onClose'>) => {
    setToast({ ...props, onClose: () => setToast(null) });
  };
  
  return { toast, showToast };
};

export const Toast = ({ toast }: { toast: ToastProps | null }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        toast.onClose();
      }, toast.duration || 2000);
      
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  if (!toast) return null;
  
  return (
    <motion.div
      className="android-toast show"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {toast.message}
    </motion.div>
  );
};

// Android-like Dialog Component
interface AndroidDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  description?: string;
}

export const AndroidDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  className = '',
  description
}: AndroidDialogProps) => {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="android-dialog show" />
        <DialogPrimitive.Content
          className={`android-dialog-content ${className}`}
          onInteractOutside={onClose}
          onEscapeKeyDown={onClose}
        >
          {title && (
            <DialogPrimitive.Title className="android-dialog-header">
              {title}
            </DialogPrimitive.Title>
          )}
          {description && (
            <DialogPrimitive.Description className="android-dialog-description">
              {description}
            </DialogPrimitive.Description>
          )}
          <div className="android-dialog-body">{children}</div>
          {actions && <div className="android-dialog-footer">{actions}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

// Android-like Bottom Sheet Component
interface AndroidBottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const AndroidBottomSheet = ({
  open,
  onClose,
  children,
  className = ''
}: AndroidBottomSheetProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`android-bottom-sheet show ${className}`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
          >
            <div className="android-bottom-sheet-header">
              <div className="android-bottom-sheet-handle"></div>
            </div>
            <div className="android-bottom-sheet-content">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Android-like Floating Action Button Component
interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const FloatingActionButton = ({
  icon,
  onClick,
  className = ''
}: FloatingActionButtonProps) => {
  const { colors } = useThemeColors();
  
  return (
    <button 
      className={`fab ${className} touch-ripple`}
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, hsl(${colors.primary}), hsl(${colors.secondary}))`,
        color: `hsl(${colors.accent})`,
        border: `2px solid hsl(${colors.accent}/0.5)`
      }}
    >
      {icon}
    </button>
  );
};

// Android-like Tab Component
interface AndroidTabProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const AndroidTab = ({
  label,
  active = false,
  onClick,
  className = ''
}: AndroidTabProps) => {
  return (
    <div 
      className={`android-tab ${active ? 'active' : ''} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {label}
    </div>
  );
};

// Android-like Expansion Panel Component
interface AndroidExpansionPanelProps {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const AndroidExpansionPanel = ({
  title,
  children,
  expanded = false,
  onToggle,
  className = ''
}: AndroidExpansionPanelProps) => {
  return (
    <div 
      className={`android-expansion-panel ${expanded ? 'expanded' : ''} ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle?.();
        }
      }}
      onClick={onToggle}
    >
      <div className="android-expansion-panel-header">
        <div>{title}</div>
        <ChevronRight 
          size={20} 
          className="android-expansion-panel-icon" 
        />
      </div>
      {expanded && (
        <div className="android-expansion-panel-content">
          {children}
        </div>
      )}
    </div>
  );
};

// Android-like Progress Indicator Component
interface AndroidLinearProgressProps {
  indeterminate?: boolean;
  value?: number;
  className?: string;
}

export const AndroidLinearProgress = ({
  indeterminate = false,
  value = 0,
  className = ''
}: AndroidLinearProgressProps) => {
  return (
    <div className={`h-1 w-full bg-muted rounded ${className}`}>
      {indeterminate ? (
        <div className="android-progress-linear w-full h-full"></div>
      ) : (
        <div 
          className="h-full bg-primary rounded transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        ></div>
      )}
    </div>
  );
};

const AndroidMobileComponents = {
  AndroidButton,
  AndroidCard,
  AndroidAppBar,
  AndroidListItem,
  AndroidSwitch,
  AndroidCheckbox,
  AndroidRadio,
  AndroidChip,
  // useSnackbar,
  // Snackbar,
  // useToast,
  // Toast,
  AndroidDialog,
  AndroidBottomSheet,
  FloatingActionButton,
  AndroidTab,
  AndroidExpansionPanel,
  AndroidLinearProgress
} as const;

type AndroidMobileComponentsType = typeof AndroidMobileComponents;

export default AndroidMobileComponents;