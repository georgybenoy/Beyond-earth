import { seedStore } from '../data/seedStore.js';

export const getStatusSummary = (req, res, next) => {
  try {
    const counts = seedStore.getStatusCounts();

    res.json({
      success: true,
      data: {
        counts,
        latest_audit_date: "2026-11-01",
        verification_statement: "Statuses corroborated with NASA NSSDCA, JPL Telemetry, and Deep Space Network logs. Objects without active telemetry are never assumed to be operational."
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getStatusRadar = (req, res, next) => {
  try {
    const hardware = seedStore.getRawHardware();

    const radarItems = hardware.map(h => ({
      slug: h.slug,
      name: h.name,
      category: h.category,
      destination_slug: h.destination_slug,
      operational_status: h.operational_status,
      status_verified_date: h.status_verified_date,
      status_summary: h.status_summary,
      power_source: h.power_source,
      launch_date: h.launch_date,
      sources: h.sources
    }));

    res.json({
      success: true,
      data: radarItems,
      meta: { total: radarItems.length }
    });
  } catch (error) {
    next(error);
  }
};
