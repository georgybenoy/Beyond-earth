import { timelineService } from '../services/timelineService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getTimelineMilestones = asyncHandler(async (req, res) => {
  const {
    era,
    event_type,
    hardware_slug,
    destination,
    category,
    mission_type,
    search,
    major_only,
    sort = 'asc'
  } = req.query;

  const milestones = timelineService.getMilestones({
    era,
    event_type,
    hardware_slug,
    destination,
    category,
    mission_type,
    search,
    major_only,
    sort
  });

  const effectiveCategory = category || mission_type;

  res.json({
    success: true,
    data: milestones,
    meta: {
      total: milestones.length,
      major_milestones_count: milestones.filter(m => m.is_major_milestone).length,
      filtersApplied: { era, event_type, hardware_slug, destination, category: effectiveCategory, search, sort }
    }
  });
});
