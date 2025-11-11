import React from 'react';
import { useDefaultThemeStyles } from '@/hooks/useDefaultThemeStyles';

interface SadhanaFooterProps {
  onBreakSadhana: () => void;
  isDefaultTheme: boolean;
  defaultThemeClasses: ReturnType<typeof useDefaultThemeStyles>['defaultThemeClasses'];
}

const SadhanaFooter = ({ onBreakSadhana, isDefaultTheme, defaultThemeClasses }: SadhanaFooterProps) => {
  return (
    <div className={`p-4 rounded-lg backdrop-blur-md ${isDefaultTheme ? defaultThemeClasses.borderedContainer : 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/20'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className={`text-center text-sm italic font-light tracking-wide ${isDefaultTheme ? defaultThemeClasses.secondaryText : 'text-foreground'}`}>
          "The universe is not outside of you. Look inside yourself; everything that you want, you already are." — Rumi
        </p>
        <button
          onClick={onBreakSadhana}
          className={`text-sm px-4 py-2 rounded-md transition-colors ${isDefaultTheme ? defaultThemeClasses.primaryButton : 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-600'}`}
        >
          End Sadhana Early
        </button>
      </div>
    </div>
  );
};

export default SadhanaFooter;