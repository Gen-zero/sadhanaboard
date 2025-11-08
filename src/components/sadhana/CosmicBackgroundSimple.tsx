import React from 'react';
import { useSettings } from '@/hooks/useSettings';

const CosmicBackgroundSimple = () => {
  const { settings } = useSettings();
  const currentTheme = settings?.appearance?.colorScheme || 'default';
  
  // Define theme-specific CSS variables
  const getThemeVariables = () => {
    switch (currentTheme) {
      case 'tara':
        return {
          '--theme-primary': '#3b82f6', // blue-500
          '--theme-secondary': '#6366f1' // indigo-500
        };
      case 'earth':
        return {
          '--theme-primary': '#16a34a', // green-600
          '--theme-secondary': '#059669' // emerald-600
        };
      case 'water':
        return {
          '--theme-primary': '#3b82f6', // blue-500
          '--theme-secondary': '#06b6d4' // cyan-500
        };
      case 'fire':
        return {
          '--theme-primary': '#ea580c', // orange-600
          '--theme-secondary': '#ef4444' // red-500
        };
      case 'shiva':
        return {
          '--theme-primary': '#4b5563', // gray-600
          '--theme-secondary': '#64748b' // slate-500
        };
      case 'bhairava':
        return {
          '--theme-primary': '#b91c1c', // red-700
          '--theme-secondary': '#e11d48' // rose-600
        };
      case 'mahakali':
        return {
          '--theme-primary': '#7e22ce', // purple-800
          '--theme-secondary': '#a21caf' // fuchsia-700
        };
      case 'ganesha':
        return {
          '--theme-primary': '#d97706', // amber-600
          '--theme-secondary': '#eab308' // yellow-500
        };
      case 'lakshmi':
        return {
          '--theme-primary': '#22c55e', // green-500
          '--theme-secondary': '#10b981' // emerald-400
        };
      case 'krishna':
        return {
          '--theme-primary': '#15803d', // green-700
          '--theme-secondary': '#059669' // emerald-600
        };
      case 'vishnu':
        return {
          '--theme-primary': '#041C3E', // Deep Vishnu Blue
          '--theme-secondary': '#00B7FF' // Oceanic Blue Glow
        };
      case 'durga':
        return {
          '--theme-primary': '#dc2626', // red-600
          '--theme-secondary': '#f97316' // orange-500
        };
      default:
        // Default purple theme
        return {
          '--theme-primary': '#a855f7', // purple-500
          '--theme-secondary': '#8b5cf6' // violet-500
        };
    }
  };
  
  const themeVariables = getThemeVariables();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div 
        className="absolute top-0 left-1/4 w-64 h-64 rounded-full filter blur-3xl animate-pulse-slow"
        style={{ 
          backgroundColor: 'var(--theme-primary)',
          opacity: 0.2
        }}
      ></div>
      <div 
        className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full filter blur-3xl animate-pulse-slow"
        style={{ 
          backgroundColor: 'var(--theme-secondary)',
          opacity: 0.2,
          animationDelay: '2s'
        }}
      ></div>
    </div>
  );
};

export default CosmicBackgroundSimple;