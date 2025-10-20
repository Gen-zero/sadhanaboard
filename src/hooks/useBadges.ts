import { useState, useEffect } from 'react';
import { useUserProgression } from './useUserProgression';
import { useProfileData } from './useProfileData';
import { ALL_BADGES, Badge, UserBadges } from '@/types/badges';

const BADGES_STORAGE_KEY = 'user-badges';

const getInitialBadges = (): UserBadges => {
  try {
    const stored = localStorage.getItem(BADGES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.log('Could not load user badges from localStorage');
  }
  
  return {
    badges: ALL_BADGES,
    earnedBadges: []
  };
};

export const useBadges = () => {
  const { progression } = useUserProgression();
  const { history } = useProfileData();
  const [userBadges, setUserBadges] = useState<UserBadges>(getInitialBadges());

  // Save badges to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(userBadges));
    } catch (error) {
      console.log('Could not save user badges to localStorage');
    }
  }, [userBadges]);

  // Check for earned badges based on user progression and history
  useEffect(() => {
    const earnedBadges = new Set(userBadges.earnedBadges);
    let newBadgesEarned = false;

    // Count sadhanas by genre
    const sadhanaCounts: Record<string, number> = {};
    history.forEach(sadhana => {
      // For now, we'll use a simple approach to determine genre
      // In a real implementation, this would be based on the actual sadhana data
      if (sadhana.title.toLowerCase().includes('meditation')) {
        sadhanaCounts['meditation'] = (sadhanaCounts['meditation'] || 0) + 1;
      } else if (sadhana.title.toLowerCase().includes('yoga')) {
        sadhanaCounts['yoga'] = (sadhanaCounts['yoga'] || 0) + 1;
      } else if (sadhana.title.toLowerCase().includes('mantra')) {
        sadhanaCounts['mantra'] = (sadhanaCounts['mantra'] || 0) + 1;
      } else if (sadhana.title.toLowerCase().includes('study')) {
        sadhanaCounts['study'] = (sadhanaCounts['study'] || 0) + 1;
      } else if (sadhana.title.toLowerCase().includes('devotion')) {
        sadhanaCounts['devotion'] = (sadhanaCounts['devotion'] || 0) + 1;
      }
    });

    // Mock data for new badge criteria (in a real implementation, this would come from the backend)
    const mockBadgeData = {
      dailyStreak: progression.totalPracticeDays || 0,
      earlyMorningPractices: 0, // Would be tracked in backend
      intenseChallengesCompleted: 0, // Would be tracked in backend
      earlyWakeups: 0, // Would be tracked in backend
      silencePractices: 0, // Would be tracked in backend
      fastingPractices: 0, // Would be tracked in backend
      reflectiveSessions: 0, // Would be tracked in backend
      chantingSessions: 0, // Would be tracked in backend
      japaRounds: 0, // Would be tracked in backend
      sadhanaTypes: Object.keys(sadhanaCounts).length,
      scriptureChapters: 0, // Would be tracked in backend
      mantrasMemorized: 0, // Would be tracked in backend
      coursesCompleted: 0, // Would be tracked in backend
      learningMinutes: 0, // Would be tracked in backend
      helpedOthers: 0, // Would be tracked in backend
      motivationalPosts: 0, // Would be tracked in backend
      groupMeditations: 0, // Would be tracked in backend
      liveSessions: 0, // Would be tracked in backend
      sadhanaCycles: 0, // Would be tracked in backend
      reflectionsUploaded: 0, // Would be tracked in backend
      mahakaliSadhanas: 0, // Would be tracked in backend
      allSadhanaLevels: 0, // Would be tracked in backend
      longestMeditation: 0, // Would be tracked in backend
      midnightVisits: 0, // Would be tracked in backend
      quietPractices: 0, // Would be tracked in backend
      repeatedSadhanas: 0 // Would be tracked in backend
    };

    // Check each badge criteria
    ALL_BADGES.forEach(badge => {
      if (earnedBadges.has(badge.id)) return; // Already earned

      let shouldEarn = false;

      switch (badge.id) {
        // Existing badge checks
        case 'first-sadhana':
          shouldEarn = progression.completedSadhanas.length >= 1;
          break;
        case 'five-sadhanas':
          shouldEarn = progression.completedSadhanas.length >= 5;
          break;
        case 'ten-sadhanas':
          shouldEarn = progression.completedSadhanas.length >= 10;
          break;
        case 'twenty-sadhanas':
          shouldEarn = progression.completedSadhanas.length >= 20;
          break;
        case 'fifty-sadhanas':
          shouldEarn = progression.completedSadhanas.length >= 50;
          break;
        case 'seven-day-streak':
          shouldEarn = progression.totalPracticeDays >= 7;
          break;
        case 'thirty-day-streak':
          shouldEarn = progression.totalPracticeDays >= 30;
          break;
        case 'hundred-day-streak':
          shouldEarn = progression.totalPracticeDays >= 100;
          break;
        case 'level-5':
          shouldEarn = progression.level >= 5;
          break;
        case 'level-10':
          shouldEarn = progression.level >= 10;
          break;
        case 'level-20':
          shouldEarn = progression.level >= 20;
          break;
        case 'meditation-master':
          shouldEarn = (sadhanaCounts['meditation'] || 0) >= 5;
          break;
        case 'yoga-practitioner':
          shouldEarn = (sadhanaCounts['yoga'] || 0) >= 5;
          break;
        case 'mantra-devotee':
          shouldEarn = (sadhanaCounts['mantra'] || 0) >= 5;
          break;
        case 'study-scholar':
          shouldEarn = (sadhanaCounts['study'] || 0) >= 5;
          break;
        case 'devotion-follower':
          shouldEarn = (sadhanaCounts['devotion'] || 0) >= 5;
          break;
          
        // New badge checks
        case 'nitya-sadhaka':
          shouldEarn = mockBadgeData.dailyStreak >= 7;
          break;
        case 'ananya-bhakta':
          shouldEarn = mockBadgeData.dailyStreak >= 30;
          break;
        case 'sankalpa-shakti':
          shouldEarn = mockBadgeData.dailyStreak >= 100;
          break;
        case 'aparajita':
          shouldEarn = mockBadgeData.dailyStreak >= 365;
          break;
        case 'ekagratā':
          shouldEarn = mockBadgeData.earlyMorningPractices >= 21;
          break;
        case 'kalīs-flame':
          shouldEarn = mockBadgeData.intenseChallengesCompleted >= 3;
          break;
        case 'tapasvī':
          shouldEarn = mockBadgeData.earlyWakeups >= 10;
          break;
        case 'mouna-ratna':
          shouldEarn = mockBadgeData.silencePractices >= 1;
          break;
        case 'agni-vratī':
          shouldEarn = mockBadgeData.fastingPractices >= 1;
          break;
        case 'viraha-jñānī':
          shouldEarn = mockBadgeData.reflectiveSessions >= 7;
          break;
        case 'prem-bhakta':
          shouldEarn = mockBadgeData.chantingSessions >= 50;
          break;
        case 'rasa-sāgara':
          shouldEarn = mockBadgeData.japaRounds >= 108;
          break;
        case 'śaraṇāgata':
          shouldEarn = mockBadgeData.sadhanaTypes >= 5;
          break;
        case 'śāstra-vidyārthī':
          shouldEarn = mockBadgeData.scriptureChapters >= 5;
          break;
        case 'mantra-master':
          shouldEarn = mockBadgeData.mantrasMemorized >= 10;
          break;
        case 'jnana-jyoti':
          shouldEarn = mockBadgeData.coursesCompleted >= 1;
          break;
        case 'sādhana-scholar':
          shouldEarn = mockBadgeData.learningMinutes >= 100;
          break;
        case 'seva-dhārī':
          shouldEarn = mockBadgeData.helpedOthers >= 1;
          break;
        case 'anukampā':
          shouldEarn = mockBadgeData.motivationalPosts >= 10;
          break;
        case 'satsangī':
          shouldEarn = mockBadgeData.groupMeditations >= 5;
          break;
        case 'guru-bhakta':
          shouldEarn = mockBadgeData.liveSessions >= 1;
          break;
        case 'antarjyoti':
          shouldEarn = mockBadgeData.sadhanaCycles >= 1;
          break;
        case 'mahā-siddha':
          shouldEarn = mockBadgeData.sadhanaCycles >= 5 && mockBadgeData.reflectionsUploaded >= 5;
          break;
        case 'kalī-anugraha':
          shouldEarn = mockBadgeData.mahakaliSadhanas >= 10;
          break;
        case 'mokṣa-margī':
          shouldEarn = mockBadgeData.allSadhanaLevels >= 10;
          break;
        case 'śūnya-dṛṣṭi':
          shouldEarn = mockBadgeData.longestMeditation >= 108;
          break;
        case 'kalīs-whisper':
          shouldEarn = mockBadgeData.midnightVisits >= 1;
          break;
        case 'gupta-bhakta':
          shouldEarn = mockBadgeData.quietPractices >= 30;
          break;
        case 'ananta-loop':
          shouldEarn = mockBadgeData.repeatedSadhanas >= 3;
          break;
      }

      if (shouldEarn) {
        earnedBadges.add(badge.id);
        newBadgesEarned = true;
      }
    });

    if (newBadgesEarned) {
      setUserBadges(prev => ({
        ...prev,
        earnedBadges: Array.from(earnedBadges)
      }));
    }
  }, [progression, history, userBadges.earnedBadges]);

  const getEarnedBadges = (): Badge[] => {
    return userBadges.badges.filter(badge => 
      userBadges.earnedBadges.includes(badge.id)
    );
  };

  const getUnearnedBadges = (): Badge[] => {
    return userBadges.badges.filter(badge => 
      !userBadges.earnedBadges.includes(badge.id)
    );
  };

  const getBadgesByCategory = (category: string): Badge[] => {
    return userBadges.badges.filter(badge => 
      badge.category === category
    );
  };

  const getEarnedBadgesByCategory = (category: string): Badge[] => {
    return userBadges.badges.filter(badge => 
      badge.category === category && userBadges.earnedBadges.includes(badge.id)
    );
  };

  return {
    allBadges: userBadges.badges,
    earnedBadges: getEarnedBadges(),
    unearnedBadges: getUnearnedBadges(),
    getBadgesByCategory,
    getEarnedBadgesByCategory,
    totalBadges: userBadges.badges.length,
    earnedCount: userBadges.earnedBadges.length
  };
};