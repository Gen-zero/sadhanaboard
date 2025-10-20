import { useState, useEffect } from 'react';

export interface SpiritualPointsState {
  totalPoints: number;
  dailyPoints: number;
  lastClaimedDate: string | null;
}

const STORAGE_KEY = 'spiritual-points';

const getInitialState = (): SpiritualPointsState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.log('Could not load spiritual points from localStorage');
  }
  
  return {
    totalPoints: 0,
    dailyPoints: 0,
    lastClaimedDate: null
  };
};

export const useSpiritualPoints = () => {
  const [pointsState, setPointsState] = useState<SpiritualPointsState>(getInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pointsState));
    } catch (error) {
      console.log('Could not save spiritual points to localStorage');
    }
  }, [pointsState]);

  const addPoints = (points: number, source: string) => {
    setPointsState(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + points,
      dailyPoints: prev.dailyPoints + points
    }));
    
    // Log the points earned for analytics/debugging
    console.log(`Earned ${points} SP from ${source}`);
  };

  const claimDailyQuest = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if already claimed today
    if (pointsState.lastClaimedDate === today) {
      return false;
    }
    
    setPointsState(prev => ({
      ...prev,
      lastClaimedDate: today
    }));
    
    return true;
  };

  const resetDailyPoints = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Reset daily points if it's a new day
    if (pointsState.lastClaimedDate !== today) {
      setPointsState(prev => ({
        ...prev,
        dailyPoints: 0
      }));
    }
  };

  return {
    pointsState,
    addPoints,
    claimDailyQuest,
    resetDailyPoints
  };
};