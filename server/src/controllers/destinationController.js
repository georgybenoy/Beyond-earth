import { destinationService } from '../services/destinationService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getAllDestinations = asyncHandler(async (req, res) => {
  const enriched = destinationService.getAllDestinations();
  res.json({
    success: true,
    data: enriched,
    meta: { total: enriched.length }
  });
});

export const getDestinationBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const result = destinationService.getDestinationBySlug(slug);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: `Destination '${slug}' not found`
    });
  }

  res.json({
    success: true,
    data: result
  });
});
