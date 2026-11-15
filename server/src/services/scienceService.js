import { seedStore } from '../data/seedStore.js';

export const scienceService = {
  /**
   * Get all STEM science concepts
   * @returns {Array<Object>} List of concepts
   */
  getAllConcepts: () => {
    return seedStore.getRawScience();
  },

  /**
   * Get concept by slug enriched with associated hardware
   * @param {string} slug - Concept slug
   * @returns {Object|null} Enriched concept or null
   */
  getConceptBySlug: (slug) => {
    const concept = seedStore.getScienceBySlug(slug);
    if (!concept) return null;

    const hardwareList = seedStore.getRawHardware();
    const relatedHardware = hardwareList.filter(h =>
      concept.related_hardware_slugs && concept.related_hardware_slugs.includes(h.slug)
    );

    return {
      ...concept,
      related_hardware: relatedHardware
    };
  },

  /**
   * Aggregate discoveries across all missions
   * @param {string} [domain] - Optional scientific domain filter
   * @returns {Array<Object>} Discoveries array
   */
  getDiscoveries: (domain) => {
    const hardwareList = seedStore.getRawHardware();
    let discoveries = [];

    hardwareList.forEach(h => {
      if (h.discoveries && Array.isArray(h.discoveries)) {
        h.discoveries.forEach(d => {
          discoveries.push({
            ...d,
            hardware_slug: h.slug,
            hardware_name: h.name,
            destination_slug: h.destination_slug
          });
        });
      }
    });

    if (domain) {
      const domLower = domain.toLowerCase();
      discoveries = discoveries.filter(d => d.scientific_domain.toLowerCase() === domLower);
    }

    return discoveries;
  }
};
