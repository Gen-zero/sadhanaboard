import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { toast } from '@/hooks/use-toast';
import api from '@/services/api';
import { DeityPreference } from '@/data/deityPreferences';
import { EnergyLevelResult } from '@/data/energyLevelQuestions';

export interface OnboardingData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  favoriteDeity: string;
  gotra?: string;
  varna?: string;
  sampradaya?: string;
  location?: string;
  bio?: string;
  experience_level?: string;
  // Deity preferences (top 5 priority-based)
  deityPreferences: DeityPreference[];
  // Energy level assessment answers
  energyLevelAnswers: Record<string, number>;
  // Energy level result
  energyLevelResult?: EnergyLevelResult;
  // Removed welcomeQuizCompleted field
}

export const useOnboarding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: user?.display_name || '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    favoriteDeity: '',
    gotra: '',
    varna: '',
    sampradaya: '',
    location: '',
    bio: '',
    experience_level: 'beginner',
    deityPreferences: [],
    energyLevelAnswers: {}
    // Removed welcomeQuizCompleted field
  });

  const updateData = (field: keyof OnboardingData, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateDeityPreference = (deityId: string, priority: number) => {
    setOnboardingData(prev => {
      // Remove any existing preference for this deity
      const filtered = prev.deityPreferences.filter(pref => pref.deityId !== deityId);
      
      // Add new preference if priority is valid (1-5)
      if (priority >= 1 && priority <= 5) {
        return {
          ...prev,
          deityPreferences: [...filtered, { deityId, priority }]
        };
      }
      
      return {
        ...prev,
        deityPreferences: filtered
      };
    });
  };

  const updateEnergyLevelAnswer = (questionId: string, optionIndex: number) => {
    setOnboardingData(prev => ({
      ...prev,
      energyLevelAnswers: {
        ...prev.energyLevelAnswers,
        [questionId]: optionIndex
      }
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 7)); // Updated to 7 steps
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const completeOnboarding = async (showWalkthrough: boolean = false) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive"
      });
      return { error: new Error("User not authenticated") };
    }

    try {
      setIsLoading(true);

      // Update profile with onboarding data
      const profileData = {
        display_name: onboardingData.name,
        date_of_birth: onboardingData.dateOfBirth,
        time_of_birth: onboardingData.timeOfBirth,
        place_of_birth: onboardingData.placeOfBirth,
        favorite_deity: onboardingData.favoriteDeity,
        gotra: onboardingData.gotra,
        varna: onboardingData.varna,
        sampradaya: onboardingData.sampradaya,
        location: onboardingData.location,
        bio: onboardingData.bio,
        experience_level: onboardingData.experience_level,
        deity_preferences: onboardingData.deityPreferences,
        energy_level_answers: onboardingData.energyLevelAnswers,
        onboarding_completed: true
        // Removed welcome_quiz_completed field
      };

      await api.updateProfile(profileData);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      return { error: null, showWalkthrough };
    } catch (error: any) {
      console.error('Complete onboarding error:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive"
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const skipOnboarding = async () => {
    if (!user?.id) return { error: new Error("User not authenticated") };

    try {
      setIsLoading(true);

      // Mark onboarding as completed without additional data
      await api.updateProfile({
        onboarding_completed: true
        // Removed welcome_quiz_completed field
      });

      toast({
        title: "Onboarding Skipped",
        description: "You can complete your profile later in settings.",
      });

      return { error: null };
    } catch (error: unknown) {
      console.error('Skip onboarding error:', error);
      const message = error instanceof Error ? error.message : 'Failed to skip onboarding. Please try again.';
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      return { error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const checkOnboardingStatus = async () => {
    if (!user?.id) return false;

    try {
      const data = await api.getProfile();
      return data.profile?.onboarding_completed || false;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  };

  return {
    isLoading,
    currentStep,
    onboardingData,
    updateData,
    updateDeityPreference,
    updateEnergyLevelAnswer,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
    checkOnboardingStatus
  };
};