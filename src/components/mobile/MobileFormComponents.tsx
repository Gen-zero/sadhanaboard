import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Search, X } from 'lucide-react';

interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

export const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(({
  label,
  error,
  showClearButton = false,
  onClear,
  className,
  value,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          ref={ref}
          className={cn(
            "mobile-input h-12 text-base", // 16px font size prevents zoom on iOS
            "transition-all duration-200",
            isFocused && "ring-2 ring-primary/20 border-primary",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            showClearButton && value && "pr-10",
            className
          )}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {showClearButton && value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
            onClick={() => {
              onClear?.();
              if ('vibrate' in navigator) {
                navigator.vibrate(25);
              }
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear input</span>
          </Button>
        )}
      </div>
      {error && (
        <p className="text-sm text-destructive font-medium">
          {error}
        </p>
      )}
    </div>
  );
});;

interface MobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export const MobileTextarea: React.FC<MobileTextareaProps> = ({
  label,
  error,
  maxLength,
  showCharCount = false,
  className,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-foreground">
            {label}
          </Label>
          {showCharCount && maxLength && (
            <span className="text-xs text-muted-foreground">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <Textarea
          className={cn(
            "mobile-input min-h-[100px] text-base resize-none", // 16px font size prevents zoom
            "transition-all duration-200",
            isFocused && "ring-2 ring-primary/20 border-primary",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            className
          )}
          value={value}
          maxLength={maxLength}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
      </div>
      <div className="flex justify-between items-center">
        {error ? (
          <p className="text-sm text-destructive font-medium">
            {error}
          </p>
        ) : (
          <div />
        )}
        {!showCharCount && maxLength && (
          <span className="text-xs text-muted-foreground">
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

interface MobilePasswordInputProps extends Omit<MobileInputProps, 'type'> {
  showPasswordToggle?: boolean;
}

export const MobilePasswordInput: React.FC<MobilePasswordInputProps> = ({
  showPasswordToggle = true,
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  };

  return (
    <div className="relative">
      <MobileInput
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={cn(showPasswordToggle && "pr-10", className)}
      />
      {showPasswordToggle && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50 mt-4"
          onClick={togglePassword}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>
      )}
    </div>
  );
};

interface MobileSearchInputProps extends Omit<MobileInputProps, 'type'> {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export const MobileSearchInput: React.FC<MobileSearchInputProps> = ({
  onSearch,
  placeholder = "Search...",
  className,
  value,
  onChange,
  ...props
}) => {
  const [searchValue, setSearchValue] = useState(value || '');

  const handleSearch = (query: string) => {
    setSearchValue(query);
    onSearch?.(query);
    if (onChange) {
      const event = {
        target: { value: query }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  const clearSearch = () => {
    handleSearch('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
      <MobileInput
        type="search"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        className={cn("pl-10", className)}
        showClearButton={!!searchValue}
        onClear={clearSearch}
        {...props}
      />
    </div>
  );
};;

interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'cosmic' | 'shimmer' | 'interactive' | 'floating';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  hapticFeedback?: boolean;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  className,
  loading = false,
  hapticFeedback = true,
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Haptic feedback for supported devices
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }

    onClick?.(e);
  };

  return (
    <Button
      className={cn(
        "mobile-button touch-target-large transition-all duration-200",
        "active:scale-95 active:bg-primary/90",
        "disabled:opacity-50 disabled:pointer-events-none",
        loading && "opacity-70 pointer-events-none",
        className
      )}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

// Mobile form container with keyboard handling
interface MobileFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export const MobileForm: React.FC<MobileFormProps> = ({
  children,
  className,
  onSubmit
}) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let initialViewportHeight = window.visualViewport?.height || window.innerHeight;

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;
      
      // If viewport height decreased significantly, keyboard is likely visible
      setKeyboardVisible(heightDifference > 150);
    };

    // Use visual viewport API if available (better for mobile)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
      };
    }

    // Fallback for older browsers
    window.addEventListener('resize', handleViewportChange);
    return () => {
      window.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  return (
    <form
      ref={formRef}
      className={cn(
        "space-y-4 transition-all duration-300",
        keyboardVisible && "mobile-keyboard-adjust pb-4",
        className
      )}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
};

// Hook for managing mobile keyboard state
export const useMobileKeyboard = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(
    window.visualViewport?.height || window.innerHeight
  );

  useEffect(() => {
    const initialHeight = window.visualViewport?.height || window.innerHeight;

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(currentHeight);
      
      const heightDifference = initialHeight - currentHeight;
      setIsKeyboardVisible(heightDifference > 150);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
      };
    }

    window.addEventListener('resize', handleViewportChange);
    return () => {
      window.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  return {
    isKeyboardVisible,
    viewportHeight,
    keyboardHeight: (window.visualViewport?.height || window.innerHeight) - viewportHeight
  };
};