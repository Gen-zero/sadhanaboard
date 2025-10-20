import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import api from '@/services/api';

// Define a local User type since we're removing Supabase
interface User {
  id: string;
  email: string;
  display_name: string;
  created_at?: string;
  updated_at?: string;
  // Removed welcome_quiz_completed field
}

interface AuthResponse {
  user: User;
  token?: string;
}

interface AuthError {
  message: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = async () => {
    try {
      if (api.token) {
        const data = await api.getCurrentUser();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear token if it's invalid
      api.clearToken();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for existing session
    initializeAuth();
  }, []);

  const refreshUser = async () => {
    try {
      if (api.token) {
        const data = await api.getCurrentUser();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setIsLoading(true);
      
      const data: AuthResponse = await api.register(email, password, displayName);

      toast({
        title: "Success!",
        description: "Account created successfully."
      });

      setUser(data.user);
      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      const message = error?.message || 'Registration failed';
      toast({ title: 'Registration failed', description: message, variant: 'destructive' });
      return { error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const data: AuthResponse = await api.login(email, password);

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in."
      });

      setUser(data.user);
      return { error: null };
    } catch (error: any) {
      console.error('Signin error:', error);
      const message = error?.message || 'Sign in failed';
      toast({ title: 'Sign in failed', description: message, variant: 'destructive' });
      return { error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await api.logout();
      
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error: any) {
      console.error('Signout error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
    refreshUser // Add refreshUser function
  };
};