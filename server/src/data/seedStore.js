import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../../data');

const loadJSON = (fileName) => {
  const filePath = path.join(dataDir, fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Immutable in-memory cache loaded once at startup
const rawDestinations = Object.freeze(loadJSON('destinations_seeds.json'));
const rawHardware = Object.freeze(loadJSON('hardware_seeds.json'));
const rawQuizzes = Object.freeze(loadJSON('quiz_seeds.json'));
const rawScience = Object.freeze(loadJSON('science_seeds.json'));
const rawSimulations = Object.freeze(loadJSON('simulation_seeds.json'));

// Precomputed lookup maps for O(1) performance
const destMap = Object.freeze(Object.fromEntries(rawDestinations.map(d => [d.slug, d.name])));
const destBySlug = Object.freeze(new Map(rawDestinations.map(d => [d.slug.toLowerCase(), d])));
const hwBySlug = Object.freeze(new Map(rawHardware.map(h => [h.slug.toLowerCase(), h])));
const quizBySlug = Object.freeze(new Map(rawQuizzes.map(q => [q.slug.toLowerCase(), q])));
const simBySlug = Object.freeze(new Map(rawSimulations.map(s => [s.slug.toLowerCase(), s])));
const sciBySlug = Object.freeze(new Map(rawScience.map(s => [s.slug.toLowerCase(), s])));

// Precomputed status summary counts
const computedStatusCounts = Object.freeze({
  TOTAL_TRACKED: rawHardware.length,
  OPERATIONAL: rawHardware.filter(h => h.operational_status === 'OPERATIONAL').length,
  INACTIVE_SURFACE: rawHardware.filter(h => h.operational_status === 'INACTIVE_SURFACE').length,
  DEEP_SPACE_TRAVELLING: rawHardware.filter(h => h.operational_status === 'DEEP_SPACE_TRAVELLING').length,
  ATMOSPHERIC_ENTRY_DESTROYED: rawHardware.filter(h => h.operational_status === 'ATMOSPHERIC_ENTRY_DESTROYED').length,
  SURFACE_IMPACT_DESTROYED: rawHardware.filter(h => h.operational_status === 'SURFACE_IMPACT_DESTROYED').length,
  LOST_CONTACT: rawHardware.filter(h => h.operational_status === 'LOST_CONTACT').length
});

// Enriched destination list with resident and active hardware counts
const enrichedDestinations = Object.freeze(
  rawDestinations.map((dest) => {
    const residentHardware = rawHardware.filter(
      (h) => h.destination_slug === dest.slug || (h.visited_destination_slugs && h.visited_destination_slugs.includes(dest.slug))
    );
    const activeCount = residentHardware.filter((h) => h.operational_status === 'OPERATIONAL').length;
    return Object.freeze({
      ...dest,
      hardware_count: residentHardware.length,
      active_hardware_count: activeCount
    });
  })
);

export const seedStore = {
  getRawDestinations: () => rawDestinations,
  getEnrichedDestinations: () => enrichedDestinations,
  getDestinationBySlug: (slug) => destBySlug.get(slug?.toLowerCase()) || null,
  getDestMap: () => destMap,

  getRawHardware: () => rawHardware,
  getHardwareBySlug: (slug) => hwBySlug.get(slug?.toLowerCase()) || null,

  getRawQuizzes: () => rawQuizzes,
  getQuizBySlug: (slug) => quizBySlug.get(slug?.toLowerCase()) || null,

  getRawScience: () => rawScience,
  getScienceBySlug: (slug) => sciBySlug.get(slug?.toLowerCase()) || null,

  getRawSimulations: () => rawSimulations,
  getSimulationBySlug: (slug) => simBySlug.get(slug?.toLowerCase()) || null,

  getStatusCounts: () => computedStatusCounts
};
