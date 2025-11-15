import React from 'react';
import { useThemeColors } from '@/hooks/useThemeColors';

const SadhanaFooter = () => {
  const { colors } = useThemeColors();

  return (
    <div className="p-4 bg-transparent rounded-lg border border-white backdrop-blur-md">
      <p className="text-center text-sm italic text-white font-light tracking-wide">
        "The universe is not outside of you. Look inside yourself; everything that you want, you already are." — Rumi
      </p>
    </div>
  );
};

export default SadhanaFooter;