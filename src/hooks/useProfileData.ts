import { useState, useEffect } from 'react';
import { useSadhanaData } from './useSadhanaData';

export interface HistoricalSadhana {
  id: string;
  title: string;
  purpose: string;
  goal: string;
  deity: string;
  message: string;
  offerings: string[];
  startDate: string;
  endDate: string;
  durationDays: number;
  completedAt?: string;
  brokenAt?: string;
  status: 'completed' | 'broken';
  actualDuration: number;
}

export interface ProfileStats {
  completedSadhanas: number;
  totalPracticeDays: number;
  successRate: number;
  uniqueDeities: number;
  joinDate: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
}

const HISTORY_STORAGE_KEY = 'sadhana-history';
const PROFILE_STORAGE_KEY = 'user-profile';

const getInitialProfile = (): UserProfile => {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.log('Could not load user profile from localStorage');
  }
  
  return {
    name: 'Spiritual Seeker',
    email: 'seeker@example.com',
    avatar: '',
    joinDate: new Date().toISOString()
  };
};

const getHistoricalSadhanas = (): HistoricalSadhana[] => {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.log('Could not load sadhana history from localStorage');
  }
  return [];
};

export const useProfileData = () => {
  const { sadhanaState, sadhanaData } = useSadhanaData();
  const [profile, setProfile] = useState<UserProfile>(getInitialProfile);
  const [history, setHistory] = useState<HistoricalSadhana[]>(getHistoricalSadhanas);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.log('Could not save user profile to localStorage');
    }
  }, [profile]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.log('Could not save sadhana history to localStorage');
    }
  }, [history]);

  const addToHistory = (sadhana: HistoricalSadhana) => {
    setHistory(prev => [sadhana, ...prev]);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const calculateStats = (): ProfileStats => {
    const completedSadhanas = history.filter(s => s.status === 'completed').length;
    const totalSadhanas = history.length;
    const totalPracticeDays = history.reduce((sum, s) => sum + s.actualDuration, 0);
    const successRate = totalSadhanas > 0 ? Math.round((completedSadhanas / totalSadhanas) * 100) : 0;
    const uniqueDeities = new Set(history.map(s => s.deity)).size;

    return {
      completedSadhanas,
      totalPracticeDays,
      successRate,
      uniqueDeities,
      joinDate: profile.joinDate
    };
  };

  const getCurrentPractice = () => {
    if (!sadhanaState.hasStarted || !sadhanaData) return null;
    
    const today = new Date();
    const startDate = new Date(sadhanaData.startDate);
    const diffTime = today.getTime() - startDate.getTime();
    const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const progress = Math.min(100, (currentDay / sadhanaData.durationDays) * 100);

    return {
      title: `${sadhanaData.durationDays}-Day Spiritual Practice`,
      deity: sadhanaData.deity,
      currentDay: Math.max(1, Math.min(currentDay, sadhanaData.durationDays)),
      totalDays: sadhanaData.durationDays,
      progress,
      status: sadhanaState.status
    };
  };

  return {
    profile,
    history,
    stats: calculateStats(),
    currentPractice: getCurrentPractice(),
    addToHistory,
    updateProfile
  };
};