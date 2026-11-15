import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Radio, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Flame, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBanner from '../components/common/ErrorBanner';
import { humanizeEnum } from '../utils/formatters';

export default function StatusTrackerPage() {
  const [summary, setSummary] = useState(null);
  const [radarItems, setRadarItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const loadStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sum, radar] = await Promise.all([
        api.getStatusSummary(),
        api.getStatusRadar()
      ]);
      setSummary(sum);
      setRadarItems(radar || []);
    } catch (err) {
      console.error('Failed to load status radar:', err);
      setError(err.message || 'Deep space telemetry network link failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const filteredItems = filterStatus
    ? radarItems.filter(item => item.operational_status === filterStatus)
    : radarItems;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-deep-space">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-mono uppercase tracking-wider text-space-cyan mb-1 flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Deep Space Telemetry Verification Board</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Mission Status Tracker
          </h1>
          <p className="mt-2 text-slate-300 max-w-2xl text-sm leading-relaxed">
            Real-time status assessment of NASA hardware across deep space. Telemetry is verified against NASA Deep Space Network and NSSDCA records.
          </p>
        </div>

        {/* Scientific Integrity Rule Alert */}
        <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white font-semibold block mb-0.5">
              Scientific Accuracy Standard:
            </strong>
            We strictly differentiate actively communicating hardware from dormant surface artifacts and silent deep-space drifters.
            <strong> A machine is never assumed operational simply because its mission has not officially closed.</strong> Every status features a verified telemetry date.
          </div>
        </div>

        {error ? (
          <ErrorBanner
            title="Telemetry Status Radar Unavailable"
            message={error}
            onRetry={loadStatus}
            retryLabel="Retry DSN Telemetry Sync"
          />
        ) : loading ? (
          <LoadingSpinner message="Auditing deep space telemetry and DSN communication links..." />
        ) : (
          <div>
            {/* Status Summary Metrics Cards */}
            {summary && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
                {[
                  {
                    status: 'OPERATIONAL',
                    label: 'Operational',
                    count: summary.counts.OPERATIONAL,
                    color: 'text-emerald-400',
                    border: 'border-emerald-500/30',
                    bg: 'bg-emerald-500/10'
                  },
                  {
                    status: 'INACTIVE_SURFACE',
                    label: 'Resting on Surface',
                    count: summary.counts.INACTIVE_SURFACE,
                    color: 'text-slate-300',
                    border: 'border-slate-500/30',
                    bg: 'bg-slate-500/10'
                  },
                  {
                    status: 'DEEP_SPACE_TRAVELLING',
                    label: 'Deep Space (Silent)',
                    count: summary.counts.DEEP_SPACE_TRAVELLING,
                    color: 'text-purple-400',
                    border: 'border-purple-500/30',
                    bg: 'bg-purple-500/10'
                  },
                  {
                    status: 'ATMOSPHERIC_ENTRY_DESTROYED',
                    label: 'Atmospheric Entry',
                    count: summary.counts.ATMOSPHERIC_ENTRY_DESTROYED,
                    color: 'text-amber-400',
                    border: 'border-amber-500/30',
                    bg: 'bg-amber-500/10'
                  },
                  {
                    status: 'SURFACE_IMPACT_DESTROYED',
                    label: 'Surface Impact',
                    count: summary.counts.SURFACE_IMPACT_DESTROYED,
                    color: 'text-amber-300',
                    border: 'border-amber-500/30',
                    bg: 'bg-amber-500/10'
                  },
                  {
                    status: 'LOST_CONTACT',
                    label: 'Lost Contact',
                    count: summary.counts.LOST_CONTACT,
                    color: 'text-rose-400',
                    border: 'border-rose-500/30',
                    bg: 'bg-rose-500/10'
                  }
                ].map((card) => (
                  <button
                    key={card.status}
                    onClick={() => setFilterStatus(filterStatus === card.status ? '' : card.status)}
                    aria-pressed={filterStatus === card.status}
                    className={`p-4 rounded-2xl glass-panel text-left transition-all border ${card.border} focus-ring ${
                      filterStatus === card.status ? 'ring-2 ring-purple-400 shadow-violet-glow' : ''
                    }`}
                  >
                    <div className="text-2xl font-mono font-bold text-white mb-1">
                      {card.count ?? 0}
                    </div>
                    <div className={`text-xs font-semibold ${card.color}`}>
                      {card.label}
                    </div>
                    <div className="text-[10px] text-[#A99BBF] mt-1 font-mono">
                      {filterStatus === card.status ? 'Filtered [Active]' : 'Click to filter'}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Filter Reset Button if filtered */}
            {filterStatus && (
              <div className="mb-4 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Filtering by: <strong className="text-space-cyan">{filterStatus}</strong> ({filteredItems.length} craft)
                </span>
                <button
                  onClick={() => setFilterStatus('')}
                  className="text-space-cyan hover:underline"
                >
                  Show All Spacecraft
                </button>
              </div>
            )}

            {/* Detailed Telemetry Board */}
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.slug}
                  className="glass-panel p-5 rounded-2xl border border-space-border flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading font-bold text-lg text-white">
                        {item.name}
                      </h3>
                      <StatusBadge status={item.operational_status} size="sm" />
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                        {humanizeEnum(item.category)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.status_summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-space-cyan" />
                        Verified Date: <strong className="text-white">{item.status_verified_date}</strong>
                      </span>
                      <span>Power: {item.power_source}</span>
                      <span>Launch: {item.launch_date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <Link
                      to={`/hardware/${item.slug}`}
                      className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white font-semibold text-xs font-mono transition-all flex items-center gap-1.5 focus-ring"
                    >
                      <span>Telemetry Profile</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
