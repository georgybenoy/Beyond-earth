import { seedStore } from '../data/seedStore.js';

const ALLOWED_SORT_FIELDS = Object.freeze(['name', 'launch_date', 'operational_status', 'mass_kg', 'category']);

export const hardwareService = {
  /**
   * Filter, search, and sort NASA spacecraft catalog
   * @param {Object} query - Query parameters
   * @returns {Array<Object>} Filtered hardware array
   */
  getHardwareList: ({ status, destination, category, search, featured, sort } = {}) => {
    const rawHardware = seedStore.getRawHardware();
    const destMap = seedStore.getDestMap();

    // Enrich with destination display name
    let hardware = rawHardware.map(item => ({
      ...item,
      destination_name: destMap[item.destination_slug] || item.destination_slug
    }));

    // Filter by operational status
    if (status) {
      const statusUpper = status.toUpperCase();
      hardware = hardware.filter(h => h.operational_status === statusUpper);
    }

    // Filter by destination slug
    if (destination) {
      const destLower = destination.toLowerCase();
      hardware = hardware.filter(h => h.destination_slug.toLowerCase() === destLower);
    }

    // Filter by category
    if (category) {
      const catLower = category.toLowerCase();
      hardware = hardware.filter(h => h.category.toLowerCase() === catLower);
    }

    // Filter by featured
    if (featured === 'true') {
      hardware = hardware.filter(h => h.is_featured === true);
    }

    // Text search
    if (search) {
      const q = search.toLowerCase();
      hardware = hardware.filter(h =>
        h.name.toLowerCase().includes(q) ||
        (h.mission_purpose && h.mission_purpose.toLowerCase().includes(q)) ||
        (h.historical_significance && h.historical_significance.toLowerCase().includes(q)) ||
        (h.destination_name && h.destination_name.toLowerCase().includes(q))
      );
    }

    // Safe sorting
    if (sort) {
      const [field, direction] = sort.split(':');
      if (ALLOWED_SORT_FIELDS.includes(field)) {
        const order = direction === 'desc' ? -1 : 1;
        hardware.sort((a, b) => {
          if (field === 'launch_date') {
            return (new Date(a.launch_date) - new Date(b.launch_date)) * order;
          }
          if (a[field] < b[field]) return -1 * order;
          if (a[field] > b[field]) return 1 * order;
          return 0;
        });
      }
    } else {
      // Default: sort by launch date ascending
      hardware.sort((a, b) => new Date(a.launch_date) - new Date(b.launch_date));
    }

    return hardware;
  },

  /**
   * Retrieve hardware profile with resolved destination details and sibling missions
   * @param {string} slug - Unique spacecraft slug
   * @returns {Object|null} Hardware profile or null
   */
  getHardwareBySlug: (slug) => {
    const item = seedStore.getHardwareBySlug(slug);
    if (!item) return null;

    const destination = seedStore.getDestinationBySlug(item.destination_slug);
    const destMap = seedStore.getDestMap();

    // Resolve sibling missions
    const relatedMissions = (item.related_mission_slugs || [])
      .map(s => seedStore.getHardwareBySlug(s))
      .filter(Boolean)
      .map(h => ({
        slug: h.slug,
        name: h.name,
        category: h.category,
        image_url: h.image_url,
        operational_status: h.operational_status,
        destination_slug: h.destination_slug,
        destination_name: destMap[h.destination_slug] || h.destination_slug
      }));

    return {
      ...item,
      destination_details: destination || null,
      related_missions: relatedMissions
    };
  },

  /**
   * Retrieve featured missions
   * @returns {Array<Object>} Featured hardware array
   */
  getFeaturedHardware: () => {
    const hardware = seedStore.getRawHardware();
    const destMap = seedStore.getDestMap();
    return hardware
      .filter(h => h.is_featured)
      .map(h => ({
        ...h,
        destination_name: destMap[h.destination_slug] || h.destination_slug
      }));
  }
};
