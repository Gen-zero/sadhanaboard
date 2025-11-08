/**
 * Theme-Aware Component Examples
 * This file demonstrates best practices for creating theme-adaptive components
 */

import React from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ThemeAwareIcon } from '@/components/ThemeAwareIcon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, Sparkles } from 'lucide-react';

/**
 * Example 1: Using the useThemeColors hook for custom components
 */
export const ThemeAwareCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const { colors, classes } = useThemeColors();
  
  return (
    <div className="card-theme p-6 rounded-lg">
      <h3 className={`text-xl font-semibold mb-4 ${classes.primaryText}`}>
        {title}
      </h3>
      <div style={{ borderLeft: `3px solid hsl(${colors.primary})` }} className="pl-4">
        {children}
      </div>
    </div>
  );
};

/**
 * Example 2: Using theme-aware icons
 */
export const ThemeAwareIconDemo: React.FC = () => {
  return (
    <div className="flex gap-4 items-center">
      {/* Method 1: Using ThemeAwareIcon component */}
      <ThemeAwareIcon icon={Star} size="lg" />
      
      {/* Method 2: Using Tailwind class */}
      <CheckCircle className="h-6 w-6 text-primary" />
      
      {/* Method 3: Using theme utility class */}
      <Sparkles className="h-6 w-6 icon-theme-primary" />
    </div>
  );
};

/**
 * Example 3: Using theme-aware buttons
 */
export const ThemeAwareButtons: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Primary button - uses theme primary color */}
      <Button variant="default">
        Primary Action
      </Button>
      
      {/* Secondary button - uses theme secondary color */}
      <Button variant="secondary">
        Secondary Action
      </Button>
      
      {/* Outline button - adapts border to theme */}
      <Button variant="outline">
        Outline Button
      </Button>
      
      {/* Ghost button - subtle theme adaptation */}
      <Button variant="ghost">
        Ghost Button
      </Button>
    </div>
  );
};

/**
 * Example 4: Using theme-aware badges
 */
export const ThemeAwareBadges: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Primary Badge</Badge>
      <Badge variant="secondary">Secondary Badge</Badge>
      <Badge variant="outline">Outline Badge</Badge>
      <Badge className="badge-theme-primary">Custom Theme Badge</Badge>
    </div>
  );
};

/**
 * Example 5: Using theme-aware backgrounds and borders
 */
export const ThemeAwareContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-theme-primary-soft border border-theme-primary-soft rounded-lg p-4 hover-theme-primary transition-theme">
      {children}
    </div>
  );
};

/**
 * Example 6: Loading spinner with theme colors
 */
export const ThemeAwareSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };
  
  return (
    <div className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`} />
  );
};

/**
 * Example 7: Theme-aware gradient background
 */
export const ThemeAwareGradient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-gradient-theme-mixed p-8 rounded-xl text-white">
      {children}
    </div>
  );
};

/**
 * Example 8: Inline style usage with theme colors
 */
export const ThemeAwareInlineStyle: React.FC = () => {
  const { styles, colors } = useThemeColors();
  
  return (
    <div>
      <p style={styles.primary}>Text with theme primary color</p>
      <div style={styles.primaryBg} className="p-4 rounded">
        Background with theme primary color
      </div>
      <div style={{ boxShadow: `0 4px 6px hsl(${colors.primary} / 0.2)` }}>
        Custom shadow with theme color
      </div>
    </div>
  );
};

/**
 * Complete example component showing all theme-aware features
 */
export const ThemeAwareShowcase: React.FC = () => {
  const { scheme } = useThemeColors();
  
  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Theme-Aware Components
        </h2>
        <p className="text-muted-foreground">
          Current theme: <span className="text-primary font-semibold">{scheme}</span>
        </p>
      </div>
      
      <ThemeAwareCard title="Example Card">
        <p className="text-foreground">
          This card automatically adapts to the active theme with proper colors, borders, and styling.
        </p>
      </ThemeAwareCard>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-theme p-4">
          <h4 className="font-semibold mb-2 text-primary">Icons</h4>
          <ThemeAwareIconDemo />
        </div>
        
        <div className="card-theme p-4">
          <h4 className="font-semibold mb-2 text-primary">Buttons</h4>
          <ThemeAwareButtons />
        </div>
        
        <div className="card-theme p-4">
          <h4 className="font-semibold mb-2 text-primary">Badges</h4>
          <ThemeAwareBadges />
        </div>
        
        <div className="card-theme p-4">
          <h4 className="font-semibold mb-2 text-primary">Loading</h4>
          <div className="flex gap-4 items-center">
            <ThemeAwareSpinner size="sm" />
            <ThemeAwareSpinner size="md" />
            <ThemeAwareSpinner size="lg" />
          </div>
        </div>
      </div>
      
      <ThemeAwareGradient>
        <h3 className="text-xl font-bold mb-2">Gradient Background</h3>
        <p>This container uses a theme-aware gradient that adapts to the current theme's colors.</p>
      </ThemeAwareGradient>
    </div>
  );
};

export default ThemeAwareShowcase;
