import { StoreSadhana } from '@/types/store';
import { storeSadhanas } from '@/data/storeSadhanas';
import { UserProgression } from '@/hooks/useUserProgression';

export const getUnlockedStoreSadhanas = (progression: UserProgression): StoreSadhana[] => {
  try {
    if (!progression) {
      console.warn('No progression data provided');
      return [];
    }
    const result = storeSadhanas.map(sadhana => ({
      ...sadhana,
      isUnlocked: progression.unlockedStoreSadhanas.includes(sadhana.id)
    }));
    console.log(`Total sadhanas processed: ${result.length}`);
    return result;
  } catch (error) {
    console.error('Error processing unlocked sadhanas:', error);
    return [];
  }
};

export const getStoreSadhanasByGenreWithUnlockStatus = (
  genreId: string, 
  progression: UserProgression
): StoreSadhana[] => {
  try {
    const allSadhanas = getUnlockedStoreSadhanas(progression);
    const filteredSadhanas = allSadhanas.filter(sadhana => {
      if (!sadhana || !sadhana.genre) {
        console.warn('Invalid sadhana found:', sadhana);
        return false;
      }
      return sadhana.genre.id === genreId;
    });
    console.log(`Genre ${genreId}: Found ${filteredSadhanas.length} sadhanas`);
    return filteredSadhanas;
  } catch (error) {
    console.error(`Error filtering sadhanas for genre ${genreId}:`, error);
    return [];
  }
};