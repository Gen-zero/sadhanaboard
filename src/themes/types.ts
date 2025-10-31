import React from 'react';

export type ThemeCategory = 'landing' | 'color-scheme' | 'hybrid';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  // sidebar variants
  sidebarBackground?: string;
  sidebarForeground?: string;
  sidebarPrimary?: string;
  sidebarPrimaryForeground?: string;
  sidebarAccent?: string;
  sidebarAccentForeground?: string;
  sidebarBorder?: string;
  sidebarRing?: string;
}

export interface ThemeAssets {
  icon?: string; // path to icon asset
  logo?: string;
  backgroundImage?: string;
  css?: string; // path to theme-specific CSS file
}

export interface ThemeMetadata {
  id: string;
  name: string;
  description?: string;
  deity?: string;
  category: ThemeCategory;
  isLandingPage?: boolean;
  landingPagePath?: string;
  icon?: React.ComponentType | string;
  gradient?: string;
}

export interface ThemeDefinition {
  metadata: ThemeMetadata;
  colors: ThemeColors;
  assets?: ThemeAssets;
  BackgroundComponent?: React.ComponentType<Record<string, unknown>>;
  available?: boolean;
  createdAt?: string | Date;
}