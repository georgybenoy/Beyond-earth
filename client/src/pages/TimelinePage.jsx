import React, { useState } from 'react';
import { History, Radio, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBanner from '../components/common/ErrorBanner';

import GrandTourHero from '../components/timeline/GrandTourHero';
import DecadeNavigator from '../components/timeline/DecadeNavigator';
import TimelineFilters from '../components/timeline/TimelineFilters';
import EditorialSpotlightCard from '../components/timeline/EditorialSpotlightCard';
import TimelineEventCard from '../components/timeline/TimelineEventCard';
import EventDetailModal from '../components/timeline/EventDetailModal';
import { useTimelineMilestones } from '../hooks/useTimelineMilestones';

export default function TimelinePage() {
  const {
    milestones,
    destinations,
    hardwareList,
    loading,
    error,
    countsByEra,
    selectedEra,
    handleEraSelect,
    selectedDestination,
    setSelectedDestination,
    selectedHardware,
    setSelectedHardware,
    selectedEventType,
    setSelectedEventType,
    selectedCategory,
    setSelectedCategory,
    search,
    setSearch,
    majorOnly,
    setMajorOnly,
    sortBy,
    setSortBy,
    updateUrlParams,
    resetAllFilters,
    reload
  } = useTimelineMilestones();

  // Modal State
  const [activeModalMilestone, setActiveModalMilestone] = useState(null);

  // Filter change dispatcher
  const handleFilterChange = (filterKey, value) => {
    if (filterKey === 'destination') {
      setSelectedDestination(value);
      updateUrlParams({ destination: value });
    } else if (filterKey === 'hardware') {
      setSelectedHardware(value);
      updateUrlParams({ hardware: value });
    } else if (filterKey === 'eventType') {
      setSelectedEventType(value);
      updateUrlParams({ type: value });
    } else if (filterKey === 'category') {
      setSelectedCategory(value);
      updateUrlParams({ category: value });
    } else if (filterKey === 'search') {
      setSearch(value);
      updateUrlParams({ search: value });
    } else if (filterKey === 'majorOnly') {
      setMajorOnly(value);
      updateUrlParams({ major: value ? 'true' : '' });
    } else if (filterKey === 'sortBy') {
      setSortBy(value);
      updateUrlParams({ sort: value });
    }
  };

  const handleSelectEra = (eraId) => {
    setSelectedEra(eraId);
    updateUrlParams({ era: eraId });
  };

  const handleResetFilters = () => {
    setSelectedEra('');
    setSelectedDestination('');
    setSelectedHardware('');
    setSelectedEventType('');
    setSelectedCategory('');
    setSearch('');
    setMajorOnly(false);
    setSortBy('asc');
    setSearchParams({});
  };

  // Find landmark spotlight milestone (e.g. if viewing a specific era or all eras)
  const landmarkMilestone = useMemo(() => {
    return milestones.find(m => m.is_major_milestone) || null;
  }, [milestones]);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-deep-space">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Prologue & Metrics Hero */}
        <GrandTourHero
          totalMilestones={allMilestonesUnfiltered.length || 68}
          activeEra={selectedEra}
        />

        {/* Interactive Decade Scrubber */}
        <DecadeNavigator
          activeEra={selectedEra}
          onSelectEra={handleSelectEra}
          countsByEra={countsByEra}
        />

        {/* Multi-Criteria Filter Matrix */}
        <TimelineFilters
          destinations={destinations}
          hardwareList={hardwareList}
          selectedDestination={selectedDestination}
          selectedHardware={selectedHardware}
          selectedEventType={selectedEventType}
          selectedCategory={selectedCategory}
          search={search}
          majorOnly={majorOnly}
          sortBy={sortBy}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Results Counter & Context Bar */}
        <div className="flex flex-wrap items-center justify-between mb-6 text-xs font-mono text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{milestones.length}</span>
            <span>historical events found</span>
            {selectedEra && (
              <span className="px-2 py-0.5 rounded bg-space-cyan/15 text-space-cyan border border-space-cyan/30">
                Era: {selectedEra}
              </span>
            )}
            {selectedDestination && (
              <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300">
                World: {destinations.find(d => d.slug === selectedDestination)?.name || selectedDestination}
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            Click any milestone to open its full NASA flight dossier
          </div>
        </div>

        {/* Optional Editorial Landmark Spotlight Card */}
        {landmarkMilestone && !search && (
          <EditorialSpotlightCard
            milestone={landmarkMilestone}
            onOpenDetail={(m) => setActiveModalMilestone(m)}
          />
        )}

        {/* Chronological Timeline Stream */}
        {error ? (
          <ErrorBanner
            title="Timeline Telemetry Unavailable"
            message={error}
            onRetry={reload}
            retryLabel="Retry Timeline Sync"
          />
        ) : loading ? (
          <LoadingSpinner message="Reconstructing NASA flight chronology and archival mission records..." />
        ) : milestones.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-space-border text-slate-400 text-sm">
            <Radio className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-lg text-white mb-1">
              No Mission Events Match Your Filters
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
              Try choosing another decade, clearing your search term, or switching off specific mission type filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-space-cyan text-space-black text-xs font-mono font-bold hover:bg-space-cyan/90 transition-all shadow-cyan-glow"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 border-l-2 border-space-cyan/30 space-y-8 mt-4">
            {milestones.map((m) => (
              <TimelineEventCard
                key={m.id}
                milestone={m}
                onOpenDetail={(item) => setActiveModalMilestone(item)}
              />
            ))}
          </div>
        )}

        {/* Deep Dive Historical & Telemetry Modal */}
        {activeModalMilestone && (
          <EventDetailModal
            milestone={activeModalMilestone}
            onClose={() => setActiveModalMilestone(null)}
          />
        )}
      </div>
    </div>
  );
}
