import React from 'react';
import { useThemeIconColor } from '@/hooks/useThemeColors';
import { cn } from '@/lib/utils';

export interface ThemeAwareIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Lucide icon component to render
   */
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Size preset (overrides className dimensions)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Use theme's primary color (default: true)
   */
  useThemeColor?: boolean;
  /**
   * Custom color override (bypasses theme color)
   */
  color?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

/**
 * Theme-aware icon wrapper that automatically applies theme colors to Lucide icons
 * @example
 * ```tsx
 * <ThemeAwareIcon icon={Star} size="lg" />
 * <ThemeAwareIcon icon={CheckCircle} className="h-6 w-6" />
 * <ThemeAwareIcon icon={Settings} color="red" />
 * ```
 */
export const ThemeAwareIcon: React.FC<ThemeAwareIconProps> = ({
  icon: Icon,
  className,
  size,
  useThemeColor = true,
  color,
  ...props
}) => {
  const themeColor = useThemeIconColor();
  
  const sizeClass = size ? sizeMap[size] : '';
  const style = useThemeColor && !color ? { color: themeColor } : color ? { color } : {};
  
  return (
    <Icon 
      className={cn(sizeClass, className)} 
      style={style}
      {...props}
    />
  );
};

/**
 * Higher-order component to make any icon theme-aware
 * @example
 * ```tsx
 * const ThemedStar = withThemeColor(Star);
 * <ThemedStar className="h-6 w-6" />
 * ```
 */
export function withThemeColor<P extends React.SVGProps<SVGSVGElement>>(
  IconComponent: React.ComponentType<P>
) {
  return React.forwardRef<SVGSVGElement, P & React.RefAttributes<SVGSVGElement>>((props, ref) => {
    const themeColor = useThemeIconColor();
    
    return (
      <IconComponent 
        {...(props as P)}
        ref={ref}
        style={{
          ...(props.style || {}),
          color: themeColor,
        }}
      />
    );
  });
}

export default ThemeAwareIcon;
