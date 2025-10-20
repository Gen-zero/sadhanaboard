
import { useState } from 'react';

export const useManifestationForm = () => {
  const [showManifestationForm, setShowManifestationForm] = useState(false);
  
  return {
    showManifestationForm,
    setShowManifestationForm,
    openManifestationForm: () => setShowManifestationForm(true),
    closeManifestationForm: () => setShowManifestationForm(false),
    toggleManifestationForm: () => setShowManifestationForm(prev => !prev)
  };
};
