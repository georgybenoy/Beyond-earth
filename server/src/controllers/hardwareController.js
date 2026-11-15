import { hardwareService } from '../services/hardwareService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getAllHardware = asyncHandler(async (req, res) => {
  const { status, destination, category, search, featured, sort } = req.query;
  const hardware = hardwareService.getHardwareList({
    status,
    destination,
    category,
    search,
    featured,
    sort
  });

  res.json({
    success: true,
    data: hardware,
    meta: {
      total: hardware.length,
      filtersApplied: { status, destination, category, search, featured, sort }
    }
  });
});

export const getHardwareBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const item = hardwareService.getHardwareBySlug(slug);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: `Hardware with slug '${slug}' not found`
    });
  }

  res.json({
    success: true,
    data: item
  });
});

export const getFeaturedHardware = asyncHandler(async (req, res) => {
  const featured = hardwareService.getFeaturedHardware();

  res.json({
    success: true,
    data: featured,
    meta: { total: featured.length }
  });
});
