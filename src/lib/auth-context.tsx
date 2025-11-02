import * as React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth as useLocalAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import type { Profile } from '@/types/profile';

interface AuthContextType {
  user: { id: string | number; email: string; display_name: string } | null;
  isLoading: boolean;
  isOnboardingComplete: boolean | null;
  checkOnboardingStatus: () => Promise<boolean>;
  refreshOnboardingStatus: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, signIn, signUp, signOut, refreshUser } = useLocalAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState<boolean>(false);

  const checkOnboardingStatus = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      setIsOnboardingLoading(true);
      const data = await api.getProfile();
      // Type guard to check if data has profile property or is profile object directly
      const profile = 'profile' in data ? data.profile : data;
      const completed = profile?.onboarding_completed || false;
      setIsOnboardingComplete(completed);
      return completed;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Don't assume onboarding is complete on error - let the user try again
      setIsOnboardingComplete(false);
      return false;
    } finally {
      setIsOnboardingLoading(false);
    }
  }, [user?.id]);

  // Refresh onboarding status - useful after completing onboarding
  const refreshOnboardingStatus = async (): Promise<boolean> => {
    return await checkOnboardingStatus();
  };

  // Check onboarding status when user changes
  useEffect(() => {
    if (user && !isLoading) {
      // Add a small delay to ensure the profile is properly created
      const timer = setTimeout(() => {
        checkOnboardingStatus();
      }, 100);
      
      return () => clearTimeout(timer);
    } else if (!user) {
      setIsOnboardingComplete(null);
    }
  }, [user, isLoading, checkOnboardingStatus]);

  const login = async (email: string, password: string) => {
    // Validate inputs
    if (!email || !password) {
      return { error: 'Email and password are required' };
    }
    
    const result = await signIn(email, password);
    // result.error is already a string based on the hook implementation
    return { error: result.error || null };
  };

  const signup = async (email: string, password: string, displayName: string) => {
    // Validate inputs
    if (!email || !password || !displayName) {
      return { error: 'Email, password, and display name are required' };
    }
    
    const result = await signUp(email, password, displayName);
    // result.error is already a string based on the hook implementation
    return { error: result.error || null };
  };

  const logout = async () => {
    await signOut();
  };

  const value = {
    user,
    isLoading: isLoading || isOnboardingLoading,
    isOnboardingComplete,
    checkOnboardingStatus,
    refreshOnboardingStatus,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};