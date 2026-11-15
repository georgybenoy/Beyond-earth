import { scienceService } from '../services/scienceService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getAllConcepts = asyncHandler(async (req, res) => {
  const concepts = scienceService.getAllConcepts();
  res.json({
    success: true,
    data: concepts,
    meta: { total: concepts.length }
  });
});

export const getConceptBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const concept = scienceService.getConceptBySlug(slug);

  if (!concept) {
    return res.status(404).json({
      success: false,
      message: `Science concept '${slug}' not found`
    });
  }

  res.json({
    success: true,
    data: concept
  });
});

export const getAllDiscoveries = asyncHandler(async (req, res) => {
  const { domain } = req.query;
  const discoveries = scienceService.getDiscoveries(domain);

  res.json({
    success: true,
    data: discoveries,
    meta: { total: discoveries.length }
  });
});
