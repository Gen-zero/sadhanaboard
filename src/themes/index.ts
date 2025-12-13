// Import all themes
import defaultTheme from './default';
import androidTheme from './android';
import ayyappanTheme from './ayyappan';
import bhairavaTheme from './bhairava';
import chaitanyaTheme from './chaitanya';
import cosmosTheme from './cosmos';
import durgaTheme from './durga';
import earthTheme from './earth';
import fireTheme from './fire';
import ganeshaTheme from './ganesha';
import hanumanTheme from './hanuman';
import krishnaTheme from './krishna';
import lakshmiTheme from './lakshmi';
import libraryLightTheme from './library-light';
import mahakaliTheme from './mahakali';
import mysteryTheme from './mystery';
import narasimhaTheme from './narasimha';
import neonTheme from './neon';
import premanandTheme from './premanand';
import serenityTheme from './serenity';
import shivaTheme from './shiva';
import swamijiTheme from './swamiji';
import taraTheme from './tara';
import vishnuTheme from './vishnu';
import waterTheme from './water';

// Import theme utilities
import * as themeUtils from './utils';

// Create theme registry
const themes = [
  defaultTheme,
  androidTheme,
  ayyappanTheme,
  bhairavaTheme,
  chaitanyaTheme,
  cosmosTheme,
  durgaTheme,
  earthTheme,
  fireTheme,
  ganeshaTheme,
  hanumanTheme,
  krishnaTheme,
  lakshmiTheme,
  libraryLightTheme,
  mahakaliTheme,
  mysteryTheme,
  narasimhaTheme,
  neonTheme,
  premanandTheme,
  serenityTheme,
  shivaTheme,
  swamijiTheme,
  taraTheme,
  vishnuTheme,
  waterTheme,
];

// Export theme utilities
export { themeUtils };

// Filter options type for listThemes
interface ThemeFilterOptions {
  category?: 'landing' | 'color-scheme' | 'hybrid' | undefined;
  available?: boolean;
}

// Export function to get theme by ID
export function getThemeById(id: string) {
  return themes.find(theme => theme.metadata.id === id) || null;
}

// Export function to list all themes with optional filters
export function listThemes(options?: ThemeFilterOptions) {
  let result = [...themes];

  if (options?.category) {
    result = result.filter(theme => theme.metadata.category === options.category);
  }

  // For 'available' filter, we consider all themes available by default
  // This could be extended to check for asset availability, etc.

  return result;
}

// Export function to get themes by deity
export function getThemesByDeity(deity?: string) {
  if (!deity) {
    return themes.filter(theme => theme.metadata.deity);
  }
  return themes.filter(theme => theme.metadata.deity === deity);
}

// Export function to get landing page themes
export function getLandingPageThemes() {
  return themes.filter(theme => theme.metadata.isLandingPage || theme.metadata.category === 'landing');
}

// Export function to get color scheme themes
export function getColorSchemeThemes() {
  return themes.filter(theme => theme.metadata.category === 'color-scheme' || theme.metadata.category === 'hybrid');
}

// Export individual themes for backward compatibility
export {
  defaultTheme,
  androidTheme,
  ayyappanTheme,
  bhairavaTheme,
  chaitanyaTheme,
  cosmosTheme,
  durgaTheme,
  earthTheme,
  fireTheme,
  ganeshaTheme,
  hanumanTheme,
  krishnaTheme,
  lakshmiTheme,
  libraryLightTheme,
  mahakaliTheme,
  mysteryTheme,
  narasimhaTheme,
  neonTheme,
  premanandTheme,
  serenityTheme,
  shivaTheme,
  swamijiTheme,
  taraTheme,
  vishnuTheme,
  waterTheme,
};