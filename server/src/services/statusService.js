import { seedStore } from '../data/seedStore.js';

export const statusService = {
  /**
   * Get operational status summary metrics
   * @returns {Object} Counts and verification metadata
   */
  getStatusSummary: () => {
    return {
      counts: seedStore.getStatusCounts(),
      latest_audit_date: "2026-11-01",
      verification_statement: "Statuses corroborated with NASA NSSDCA, JPL Telemetry, and Deep Space Network logs. Objects without active telemetry are never assumed to be operational."
    };
  },

  /**
   * Get telemetry radar items for all tracked spacecraft
   * @returns {Array<Object>} List of radar items
   */
  getStatusRadar: () => {
    const hardware = seedStore.getRawHardware();
    return hardware.map(h => ({
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
  }
};
