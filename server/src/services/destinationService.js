import { seedStore } from '../data/seedStore.js';

export const destinationService = {
  /**
   * Retrieve all destinations enriched with resident and active hardware counts
   * @returns {Array<Object>} List of celestial destination objects
   */
  getAllDestinations: () => {
    return seedStore.getEnrichedDestinations();
  },

  /**
   * Retrieve destination details by slug, including associated resident hardware
   * @param {string} slug - Unique destination slug (e.g. 'mars', 'europa')
   * @returns {Object|null} Destination object with hardware array or null if not found
   */
  getDestinationBySlug: (slug) => {
    const destination = seedStore.getDestinationBySlug(slug);
    if (!destination) return null;

    const allHardware = seedStore.getRawHardware();
    const residentHardware = allHardware.filter(
      (h) => h.destination_slug === destination.slug || (h.visited_destination_slugs && h.visited_destination_slugs.includes(destination.slug))
    );

    return {
      ...destination,
      hardware: residentHardware
    };
  }
};
