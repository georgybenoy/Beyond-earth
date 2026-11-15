import { seedStore } from '../data/seedStore.js';

export const getAllConcepts = (req, res, next) => {
  try {
    const concepts = seedStore.getRawScience();
    res.json({
      success: true,
      data: concepts,
      meta: { total: concepts.length }
    });
  } catch (error) {
    next(error);
  }
};

export const getConceptBySlug = (req, res, next) => {
  try {
    const { slug } = req.params;
    const concept = seedStore.getScienceBySlug(slug);

    if (!concept) {
      return res.status(404).json({
        success: false,
        message: `Science concept '${slug}' not found`
      });
    }

    // Enrich with associated hardware details
    const hardwareList = seedStore.getRawHardware();
    const relatedHardware = hardwareList.filter(h =>
      concept.related_hardware_slugs && concept.related_hardware_slugs.includes(h.slug)
    );

    res.json({
      success: true,
      data: {
        ...concept,
        related_hardware: relatedHardware
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDiscoveries = (req, res, next) => {
  try {
    const { domain } = req.query;
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
      discoveries = discoveries.filter(d => d.scientific_domain.toLowerCase() === domain.toLowerCase());
    }

    res.json({
      success: true,
      data: discoveries,
      meta: { total: discoveries.length }
    });
  } catch (error) {
    next(error);
  }
};
