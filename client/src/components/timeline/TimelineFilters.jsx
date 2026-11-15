import React from 'react';
import { Filter, RefreshCw, ArrowUpDown, Sparkles, Compass, Rocket } from 'lucide-react';
import SearchInput from '../common/SearchInput';

const EVENT_TYPES = [
  { id: '', label: 'All Event Types' },
  { id: 'LAUNCH', label: 'Launch' },
  { id: 'LANDING', label: 'Surface Landing' },
  { id: 'FLYBY', label: 'Planetary Flyby' },
  { id: 'ORBIT_INSERTION', label: 'Orbit Insertion' },
  { id: 'DISCOVERY', label: 'Scientific Discovery' },
  { id: 'MILESTONE', label: 'Historic Milestone' },
  { id: 'FINAL_SIGNAL', label: 'Final Telemetry Signal' },
];

const MISSION_TYPES = [
  { id: '', label: 'All Mission Types' },
  { id: 'ROVER', label: 'Rovers' },
  { id: 'LANDER', label: 'Surface Landers' },
  { id: 'ORBITER', label: 'Planetary Orbiters' },
  { id: 'DEEP_SPACE_PROBE', label: 'Deep Space Probes' },
  { id: 'SPACE_TELESCOPE', label: 'Space Telescopes' },
];

export default function TimelineFilters({
  destinations = [],
  hardwareList = [],
  selectedDestination,
  selectedHardware,
  selectedEventType,
  selectedCategory,
  search,
  majorOnly,
  sortBy,
  onFilterChange,
  onReset
}) {
  const hasActiveFilters = Boolean(
    search || selectedDestination || selectedHardware || selectedEventType || selectedCategory || majorOnly || sortBy !== 'asc'
  );

  return (
    <div className="glass-panel p-5 rounded-2xl mb-8 space-y-4 border border-space-border">
      {/* Row 1: Search & Dropdown Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-4">
          <SearchInput
            ariaLabel="Search flight timeline milestones, craft, or discoveries"
            placeholder="Search milestones, craft, or discoveries..."
            value={search}
            onChange={(val) => onFilterChange('search', val)}
          />
        </div>

        {/* Destination Dropdown */}
        <div className="md:col-span-3">
          <select
            aria-label="Filter timeline by planetary destination"
            value={selectedDestination}
            onChange={(e) => onFilterChange('destination', e.target.value)}
            className="w-full px-3 py-2 bg-space-navy/80 border border-purple-500/25 rounded-xl text-sm text-slate-200 focus-ring"
          >
            <option value="">All Destinations</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Spacecraft Dropdown */}
        <div className="md:col-span-3">
          <select
            aria-label="Filter timeline by spacecraft"
            value={selectedHardware}
            onChange={(e) => onFilterChange('hardware', e.target.value)}
            className="w-full px-3 py-2 bg-space-navy/80 border border-purple-500/25 rounded-xl text-sm text-slate-200 focus-ring"
          >
            <option value="">All Spacecraft ({hardwareList.length})</option>
            {hardwareList.map((h) => (
              <option key={h.slug} value={h.slug}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chronological Sort Toggle */}
        <div className="md:col-span-2">
          <button
            onClick={() => onFilterChange('sortBy', sortBy === 'asc' ? 'desc' : 'asc')}
            aria-label={`Chronological order: currently ${sortBy === 'asc' ? 'Oldest First' : 'Newest First'}. Click to toggle.`}
            className="w-full px-3 py-2 bg-space-navy/80 hover:bg-[#1A1230] border border-purple-500/25 rounded-xl text-sm text-slate-200 flex items-center justify-center gap-1.5 transition-colors focus-ring"
            title="Toggle chronological sorting"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-300" />
            <span className="text-xs font-mono">
              {sortBy === 'asc' ? 'Oldest First' : 'Newest First'}
            </span>
          </button>
        </div>
      </div>

      {/* Row 2: Secondary Filters & Mode Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-space-border text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          {/* Major Milestones Spotlight Toggle */}
          <button
            onClick={() => onFilterChange('majorOnly', !majorOnly)}
            aria-pressed={majorOnly}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all focus-ring ${
              majorOnly
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white bg-white/5 border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pivotal Landmarks Only</span>
          </button>

          {/* Event Category Select */}
          <select
            aria-label="Filter by event type"
            value={selectedEventType}
            onChange={(e) => onFilterChange('eventType', e.target.value)}
            className="px-2.5 py-1.5 bg-space-navy/80 border border-purple-500/25 rounded-xl text-xs text-slate-300 focus-ring"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Mission Type Select */}
          <select
            aria-label="Filter by mission category"
            value={selectedCategory}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="px-2.5 py-1.5 bg-space-navy/80 border border-purple-500/25 rounded-xl text-xs text-slate-300 focus-ring"
          >
            {MISSION_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Action */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-slate-400 hover:text-space-cyan transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
