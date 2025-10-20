import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import api from '@/services/api';

export interface UserProgression {
  level: number;
  experience: number;
  spiritualPoints: number;
  completedSadhanas: string[];
  unlockedGenres: string[];
  unlockedStoreSadhanas: string[]; // IDs of purchased/unlocked store sadhanas
  totalPracticeDays: number;
  longestStreak: number;
  
  // New spiritual progression fields
  karmaBalance: number;
  dailyStreak: number;
  sankalpaProgress: number;
  chakraBalance: {
    root: number;
    sacral: number;
    solar: number;
    heart: number;
    throat: number;
    thirdEye: number;
    crown: number;
  };
  energyBalance: {
    sattva: number;
    rajas: number;
    tamas: number;
  };
}

export const useUserProgression = () => {
  const { user } = useAuth();
  const [progression, setProgression] = useState<UserProgression>({
    level: 1,
    experience: 0,
    spiritualPoints: 50,
    completedSadhanas: [],
    unlockedGenres: ['meditation', 'yoga'],
    unlockedStoreSadhanas: [],
    totalPracticeDays: 0,
    longestStreak: 0,
    
    // New spiritual progression fields
    karmaBalance: 100,
    dailyStreak: 0,
    sankalpaProgress: 0.00,
    chakraBalance: {
      root: 50,
      sacral: 50,
      solar: 50,
      heart: 50,
      throat: 50,
      thirdEye: 50,
      crown: 50
    },
    energyBalance: {
      sattva: 33,
      rajas: 33,
      tamas: 34
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProgressionData();
  }, [user]);

  const loadProgressionData = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const data = await api.getProfile();
      
      if (data.profile) {
        // Map backend data to frontend progression structure
        const mappedProgression: UserProgression = {
          level: data.profile.level || 1,
          experience: data.profile.spiritual_points || 0,
          spiritualPoints: data.profile.spiritual_points || 50,
          completedSadhanas: [],
          unlockedGenres: ['meditation', 'yoga'],
          unlockedStoreSadhanas: [],
          totalPracticeDays: 0,
          longestStreak: 0,
          
          // New spiritual progression fields
          karmaBalance: data.profile.karma_balance || 100,
          dailyStreak: data.profile.daily_streak || 0,
          sankalpaProgress: data.profile.sankalpa_progress || 0.00,
          chakraBalance: data.profile.chakra_balance || {
            root: 50,
            sacral: 50,
            solar: 50,
            heart: 50,
            throat: 50,
            thirdEye: 50,
            crown: 50
          },
          energyBalance: data.profile.energy_balance || {
            sattva: 33,
            rajas: 33,
            tamas: 34
          }
        };
        
        // Unlock genres based on level
        const unlockedGenres = ['meditation', 'yoga'];
        if (mappedProgression.level >= 3) unlockedGenres.push('mantra');
        if (mappedProgression.level >= 4) unlockedGenres.push('study');
        if (mappedProgression.level >= 5) unlockedGenres.push('devotion');
        if (mappedProgression.level >= 6) unlockedGenres.push('service');
        if (mappedProgression.level >= 10) unlockedGenres.push('advanced');
        
        mappedProgression.unlockedGenres = unlockedGenres;
        
        setProgression(mappedProgression);
      }
    } catch (error) {
      console.error('Error loading user progression:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLevel = (experience: number): number => {
    // Each level requires 100 more experience than the previous
    // Level 1: 0-99 XP, Level 2: 100-299 XP, Level 3: 300-599 XP, etc.
    return Math.floor(Math.sqrt(experience / 100)) + 1;
  };

  const getExperienceForNextLevel = (currentLevel: number): number => {
    return Math.pow(currentLevel, 2) * 100;
  };

  const addExperience = async (amount: number) => {
    if (!user?.id) return;
    
    try {
      // Update backend
      const updatedProfile = await api.updateProfile({
        spiritual_points: progression.spiritualPoints + amount
      });
      
      // Update local state
      setProgression(prev => {
        const newExperience = prev.experience + amount;
        const newLevel = calculateLevel(newExperience);
        const leveledUp = newLevel > prev.level;
        
        const updated = {
          ...prev,
          experience: newExperience,
          level: newLevel,
          spiritualPoints: prev.spiritualPoints + (leveledUp ? newLevel * 10 : 5) // Bonus for leveling up
        };

        // Unlock new genres based on level
        const unlockedGenres = ['meditation', 'yoga'];
        if (newLevel >= 3) unlockedGenres.push('mantra');
        if (newLevel >= 4) unlockedGenres.push('study');
        if (newLevel >= 5) unlockedGenres.push('devotion');
        if (newLevel >= 6) unlockedGenres.push('service');
        if (newLevel >= 10) unlockedGenres.push('advanced');
        
        updated.unlockedGenres = unlockedGenres;

        return updated;
      });
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  const spendSpiritualPoints = async (amount: number): Promise<boolean> => {
    if (!user?.id || progression.spiritualPoints < amount) return false;
    
    try {
      // Update backend
      await api.updateProfile({
        spiritual_points: progression.spiritualPoints - amount
      });
      
      // Update local state
      setProgression(prev => {
        const updated = {
          ...prev,
          spiritualPoints: prev.spiritualPoints - amount
        };
        
        return updated;
      });
      
      return true;
    } catch (error) {
      console.error('Error spending spiritual points:', error);
      return false;
    }
  };

  const addSpiritualPoints = async (amount: number) => {
    if (!user?.id) return;
    
    try {
      // Update backend
      const updatedProfile = await api.updateProfile({
        spiritual_points: progression.spiritualPoints + amount
      });
      
      // Update local state
      setProgression(prev => {
        const updated = {
          ...prev,
          spiritualPoints: prev.spiritualPoints + amount
        };
        
        return updated;
      });
    } catch (error) {
      console.error('Error adding spiritual points:', error);
    }
  };

  const completeSadhana = async (sadhanaId: string, durationDays: number) => {
    if (!user?.id) return;
    
    try {
      // Award experience and spiritual points
      const experienceGained = durationDays * 10; // 10 XP per day
      const spiritualPointsGained = durationDays * 5; // 5 spiritual points per day
      
      // Update backend
      const updatedProfile = await api.updateProfile({
        spiritual_points: progression.spiritualPoints + spiritualPointsGained,
        daily_streak: progression.dailyStreak + 1
      });
      
      // Update local state
      setProgression(prev => {
        const newExperience = prev.experience + experienceGained;
        const newLevel = calculateLevel(newExperience);
        const leveledUp = newLevel > prev.level;
        
        const updated = {
          ...prev,
          experience: newExperience,
          level: newLevel,
          spiritualPoints: prev.spiritualPoints + spiritualPointsGained + (leveledUp ? newLevel * 20 : 0),
          dailyStreak: prev.dailyStreak + 1,
          completedSadhanas: [...prev.completedSadhanas, sadhanaId],
          totalPracticeDays: prev.totalPracticeDays + durationDays,
          longestStreak: Math.max(prev.longestStreak, durationDays)
        };

        // Unlock new genres based on level
        const unlockedGenres = ['meditation', 'yoga'];
        if (newLevel >= 3) unlockedGenres.push('mantra');
        if (newLevel >= 4) unlockedGenres.push('study');
        if (newLevel >= 5) unlockedGenres.push('devotion');
        if (newLevel >= 6) unlockedGenres.push('service');
        if (newLevel >= 10) unlockedGenres.push('advanced');
        
        updated.unlockedGenres = unlockedGenres;

        return updated;
      });
    } catch (error) {
      console.error('Error completing sadhana:', error);
    }
  };

  const unlockStoreSadhana = (sadhanaId: string) => {
    setProgression(prev => {
      if (prev.unlockedStoreSadhanas.includes(sadhanaId)) {
        return prev; // Already unlocked
      }
      
      const updated = {
        ...prev,
        unlockedStoreSadhanas: [...prev.unlockedStoreSadhanas, sadhanaId]
      };

      return updated;
    });
  };

  const getProgressToNextLevel = () => {
    const currentLevelXP = Math.pow(progression.level - 1, 2) * 100;
    const nextLevelXP = getExperienceForNextLevel(progression.level);
    const progressXP = progression.experience - currentLevelXP;
    const requiredXP = nextLevelXP - currentLevelXP;
    
    return {
      current: progressXP,
      required: requiredXP,
      percentage: Math.min((progressXP / requiredXP) * 100, 100)
    };
  };

  // New methods for spiritual progression
  const updateChakraBalance = async (chakraData: Partial<UserProgression['chakraBalance']>) => {
    if (!user?.id) return;
    
    try {
      const updatedChakraBalance = {
        ...progression.chakraBalance,
        ...chakraData
      };
      
      // Update backend
      await api.updateProfile({
        chakra_balance: updatedChakraBalance
      });
      
      // Update local state
      setProgression(prev => ({
        ...prev,
        chakraBalance: updatedChakraBalance
      }));
    } catch (error) {
      console.error('Error updating chakra balance:', error);
    }
  };

  const updateEnergyBalance = async (energyData: Partial<UserProgression['energyBalance']>) => {
    if (!user?.id) return;
    
    try {
      const updatedEnergyBalance = {
        ...progression.energyBalance,
        ...energyData
      };
      
      // Update backend
      await api.updateProfile({
        energy_balance: updatedEnergyBalance
      });
      
      // Update local state
      setProgression(prev => ({
        ...prev,
        energyBalance: updatedEnergyBalance
      }));
    } catch (error) {
      console.error('Error updating energy balance:', error);
    }
  };

  const updateSankalpaProgress = async (progress: number) => {
    if (!user?.id) return;
    
    try {
      // Update backend
      await api.updateProfile({
        sankalpa_progress: progress
      });
      
      // Update local state
      setProgression(prev => ({
        ...prev,
        sankalpaProgress: progress
      }));
    } catch (error) {
      console.error('Error updating sankalpa progress:', error);
    }
  };

  const awardKarmaPoints = async (points: number) => {
    if (!user?.id) return;
    
    try {
      // Update backend
      await api.updateProfile({
        karma_balance: progression.karmaBalance + points
      });
      
      // Update local state
      setProgression(prev => ({
        ...prev,
        karmaBalance: prev.karmaBalance + points
      }));
    } catch (error) {
      console.error('Error awarding karma points:', error);
    }
  };

  return {
    progression,
    isLoading,
    addExperience,
    spendSpiritualPoints,
    addSpiritualPoints,
    completeSadhana,
    unlockStoreSadhana,
    getProgressToNextLevel,
    calculateLevel,
    getExperienceForNextLevel,
    
    // New methods
    updateChakraBalance,
    updateEnergyBalance,
    updateSankalpaProgress,
    awardKarmaPoints,
    loadProgressionData
  };
};