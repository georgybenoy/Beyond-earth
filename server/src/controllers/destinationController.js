import { seedStore } from '../data/seedStore.js';

export const getAllDestinations = (req, res, next) => {
  try {
    const enriched = seedStore.getEnrichedDestinations();

    res.json({
      success: true,
      data: enriched,
      meta: { total: enriched.length }
    });
  } catch (error) {
    next(error);
  }
};

export const getDestinationBySlug = (req, res, next) => {
  try {
    const { slug } = req.params;
    const destination = seedStore.getDestinationBySlug(slug);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: `Destination '${slug}' not found`
      });
    }

    const hardware = seedStore.getRawHardware();
    const residentHardware = hardware.filter(
      (h) => h.destination_slug === destination.slug || (h.visited_destination_slugs && h.visited_destination_slugs.includes(destination.slug))
    );

    res.json({
      success: true,
      data: {
        ...destination,
        hardware: residentHardware
      }
    });
  } catch (error) {
    next(error);
  }
};
