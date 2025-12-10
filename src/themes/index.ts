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

// Export function to get theme by ID
export function getThemeById(id: string) {
  return themes.find(theme => theme.metadata.id === id) || null;
}

// Export function to list all themes
export function listThemes() {
  return [...themes];
}

// Export function to get theme health status
export function getThemeHealth(theme: any) {
  // Simple implementation - all themes are considered healthy by default
  // In a more complex implementation, this could check for missing assets, invalid configurations, etc.
  return {
    status: 'healthy',
    issues: [] as string[]
  };
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