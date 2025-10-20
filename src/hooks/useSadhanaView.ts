
import { useState } from 'react';

export const useSadhanaView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [view3D, setView3D] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  return {
    isEditing,
    view3D,
    showDashboard,
    setIsEditing,
    setView3D,
    setShowDashboard,
    toggleEditing: () => setIsEditing(prev => !prev),
    toggle3DView: () => setView3D(prev => !prev)
  };
};
