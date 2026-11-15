import { statusService } from '../services/statusService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getStatusSummary = asyncHandler(async (req, res) => {
  const summary = statusService.getStatusSummary();
  res.json({
    success: true,
    data: summary
  });
});

export const getStatusRadar = asyncHandler(async (req, res) => {
  const radarItems = statusService.getStatusRadar();
  res.json({
    success: true,
    data: radarItems,
    meta: { total: radarItems.length }
  });
});
