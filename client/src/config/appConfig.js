/**
 * Centralized Client Application Configuration
 */

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/v1`;
  }
  return '/api/v1';
};

export const APP_CONFIG = Object.freeze({
  appName: 'Beyond Earth',
  version: '1.0.0',
  apiBaseUrl: getApiBaseUrl(),
  defaultLanguage: 'en',
  
  // Local storage keys for client persistence
  storageKeys: Object.freeze({
    cadetPoints: 'beyond_earth_points',
    cadetBadges: 'beyond_earth_badges',
    completedQuizzes: 'beyond_earth_completed_quizzes',
    completedSims: 'beyond_earth_completed_sims',
    dailyStreak: 'beyond_earth_daily_streak',
    lastDailyDate: 'beyond_earth_last_daily',
    solarSystemViewMode: 'beyond_earth_solarsystem_viewmode'
  }),

  // NASA External Authoritative References
  externalLinks: Object.freeze({
    nssdca: 'https://nssdc.gsfc.nasa.gov/',
    jpl: 'https://www.jpl.nasa.gov/',
    pds: 'https://pds.nasa.gov/',
    nasaApis: 'https://api.nasa.gov/',
    liveWebsite: 'https://beyond-earth-ten.vercel.app/'
  })
});
