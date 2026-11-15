import { seedStore } from '../data/seedStore.js';

const ALLOWED_SORT_FIELDS = ['name', 'launch_date', 'operational_status', 'mass_kg', 'category'];

export const getAllHardware = (req, res, next) => {
  try {
    const { status, destination, category, search, featured, sort } = req.query;
    const rawHardware = seedStore.getRawHardware();
    const destMap = seedStore.getDestMap();

    // Map destination names for quick frontend display
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

    // Filter by hardware category (ROVER, LANDER, ORBITER, DEEP_SPACE_PROBE, OBSERVATORY)
    if (category) {
      const catLower = category.toLowerCase();
      hardware = hardware.filter(h => h.category.toLowerCase() === catLower);
    }

    // Filter by featured
    if (featured === 'true') {
      hardware = hardware.filter(h => h.is_featured === true);
    }

    // Text search on name, purpose, historical significance, or destination name
    if (search) {
      const q = search.toLowerCase();
      hardware = hardware.filter(h =>
        h.name.toLowerCase().includes(q) ||
        (h.mission_purpose && h.mission_purpose.toLowerCase().includes(q)) ||
        (h.historical_significance && h.historical_significance.toLowerCase().includes(q)) ||
        (h.destination_name && h.destination_name.toLowerCase().includes(q))
      );
    }

    // Safe sorting with field allowlist
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
      // Default: sort by launch date ascending (chronological exploration)
      hardware.sort((a, b) => new Date(a.launch_date) - new Date(b.launch_date));
    }

    res.json({
      success: true,
      data: hardware,
      meta: {
        total: hardware.length,
        filtersApplied: { status, destination, category, search, featured, sort }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getHardwareBySlug = (req, res, next) => {
  try {
    const { slug } = req.params;
    const item = seedStore.getHardwareBySlug(slug);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Hardware with slug '${slug}' not found`
      });
    }

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

    res.json({
      success: true,
      data: {
        ...item,
        destination_details: destination || null,
        related_missions: relatedMissions
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedHardware = (req, res, next) => {
  try {
    const hardware = seedStore.getRawHardware();
    const destMap = seedStore.getDestMap();
    const featured = hardware
      .filter(h => h.is_featured)
      .map(h => ({
        ...h,
        destination_name: destMap[h.destination_slug] || h.destination_slug
      }));

    res.json({
      success: true,
      data: featured,
      meta: { total: featured.length }
    });
  } catch (error) {
    next(error);
  }
};
