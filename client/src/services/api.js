const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/v1` 
  : '/api/v1';

// In-flight request deduplication map to prevent duplicate wire calls during simultaneous component mounts
const inFlightRequests = new Map();

async function fetchJSON(endpoint) {
  if (inFlightRequests.has(endpoint)) {
    return inFlightRequests.get(endpoint);
  }

  const requestPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`);
      if (!res.ok) {
        // If direct remote API returned error status and API_BASE is remote, fallback to Vercel edge proxy
        if (API_BASE.startsWith('http')) {
          try {
            const fallbackRes = await fetch(`/api/v1${endpoint}`);
            if (fallbackRes.ok) {
              const fallbackJson = await fallbackRes.json();
              return fallbackJson.data;
            }
          } catch {
            // Fall through to error
          }
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${res.status}`);
      }
      const json = await res.json();
      return json.data;
    } catch (error) {
      // If browser CORS or network error occurred and API_BASE is remote, fallback to Vercel edge proxy
      if (API_BASE.startsWith('http')) {
        try {
          const fallbackRes = await fetch(`/api/v1${endpoint}`);
          if (fallbackRes.ok) {
            const fallbackJson = await fallbackRes.json();
            return fallbackJson.data;
          }
        } catch {
          // Fallback also failed
        }
      }
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    } finally {
      inFlightRequests.delete(endpoint);
    }
  })();

  inFlightRequests.set(endpoint, requestPromise);
  return requestPromise;
}

export const api = {
  // Destinations
  getDestinations: () => fetchJSON('/destinations'),
  getDestination: (slug) => fetchJSON(`/destinations/${slug}`),

  // Hardware
  getHardware: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    return fetchJSON(`/hardware${queryString ? `?${queryString}` : ''}`);
  },
  getHardwareBySlug: (slug) => fetchJSON(`/hardware/${slug}`),
  getFeaturedHardware: () => fetchJSON('/hardware/featured'),

  // Timeline
  getTimeline: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    return fetchJSON(`/timeline${queryString ? `?${queryString}` : ''}`);
  },

  // Science
  getConcepts: () => fetchJSON('/science/concepts'),
  getConceptBySlug: (slug) => fetchJSON(`/science/concepts/${slug}`),
  getDiscoveries: (domain) => fetchJSON(`/science/discoveries${domain ? `?domain=${domain}` : ''}`),

  // Status
  getStatusSummary: () => fetchJSON('/status/summary'),
  getStatusRadar: () => fetchJSON('/status/radar'),

  // Academy / Quizzes
  getQuizzes: (difficulty) => fetchJSON(`/academy/quizzes${difficulty ? `?difficulty=${difficulty}` : ''}`),
  getQuiz: (slug) => fetchJSON(`/academy/quizzes/${slug}`),
  getSimulations: () => fetchJSON('/academy/quizzes/simulations'),
  getSimulation: (slug) => fetchJSON(`/academy/quizzes/simulations/${slug}`),
  getDailyChallenge: () => fetchJSON('/academy/quizzes/daily')
};
