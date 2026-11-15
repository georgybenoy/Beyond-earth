import React from 'react';
import { Link } from 'react-router-dom';
import { Filter, Cpu, ArrowUpDown, RefreshCw, Radio, Camera, Compass } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBanner from '../components/common/ErrorBanner';
import SearchInput from '../components/common/SearchInput';
import FlagshipCarousel from '../components/hardware/FlagshipCarousel';
import { useHardwareCatalog } from '../hooks/useHardwareCatalog';

export default function HardwarePage() {
  const {
    hardware,
    destinations,
    loading,
    error,
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    selectedDestination,
    handleDestinationChange,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    resetFilters,
    reload
  } = useHardwareCatalog();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-deep-space">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-mono uppercase tracking-wider text-space-cyan mb-1">
            NASA Mission Artifacts & Active Craft
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Hardware Explorer
          </h1>
          <p className="mt-2 text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
            Discover the scientific instruments, engineering specifications, and historical journeys of humanity’s robotic emissaries.
          </p>
        </div>

        {/* Flagship Spotlight Carousel */}
        {!selectedDestination && !search && (
          <FlagshipCarousel hardware={hardware} />
        )}

        {/* Filter & Search Bar */}
        <div className="glass-panel p-5 rounded-2xl mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5">
              <SearchInput
                ariaLabel="Search spacecraft catalog by name, mission, or payload"
                placeholder="Search spacecraft (e.g. Voyager, Perseverance, laser)..."
                value={search}
                onChange={setSearch}
              />
            </div>

            {/* Status Filter */}
            <div className="md:col-span-2">
              <select
                aria-label="Filter by operational status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-space-navy/80 border border-purple-500/25 rounded-xl text-sm text-slate-200 focus-ring"
              >
                <option value="">All Statuses</option>
                <option value="OPERATIONAL">Operational</option>
                <option value="INACTIVE_SURFACE">Resting on Surface</option>
                <option value="DEEP_SPACE_TRAVELLING">Deep Space Travelling</option>
                <option value="ATMOSPHERIC_ENTRY_DESTROYED">Atmospheric Entry</option>
                <option value="SURFACE_IMPACT_DESTROYED">Surface Impact</option>
              </select>
            </div>

            {/* Destination Filter */}
            <div className="md:col-span-3">
              <select
                aria-label="Filter by planetary destination"
                value={selectedDestination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                className="w-full px-3 py-2 bg-space-navy/80 border border-purple-500/25 rounded-xl text-sm text-slate-200 focus-ring"
              >
                <option value="">All Destinations</option>
                {destinations.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name} ({d.hardware_count})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2">
              <select
                aria-label="Sort spacecraft catalog"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-space-navy/80 border border-purple-500/25 rounded-xl text-sm text-slate-200 focus-ring"
              >
                <option value="launch_date:asc">Oldest Launch</option>
                <option value="launch_date:desc">Newest Launch</option>
                <option value="name:asc">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-space-border text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-mono mr-1">Category:</span>
              {['', 'ROVER', 'LANDER', 'ORBITER', 'DEEP_SPACE_PROBE'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                    selectedCategory === cat
                      ? 'bg-space-cyan/20 text-space-cyan border border-space-cyan/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat === '' ? 'ALL' : cat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {(search || selectedStatus || selectedDestination || selectedCategory) && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-slate-400 hover:text-space-cyan transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-4 text-xs font-mono text-slate-400">
          <span>Showing {hardware.length} verified NASA hardware profiles</span>
          {selectedDestination && (
            <span className="text-space-cyan">
              Filtered by: {destinations.find(d => d.slug === selectedDestination)?.name || selectedDestination}
            </span>
          )}
        </div>

        {/* Catalog Grid */}
        {error ? (
          <ErrorBanner
            title="Hardware Catalog Telemetry Unavailable"
            message={error}
            onRetry={reload}
            retryLabel="Retry Telemetry Link"
          />
        ) : loading ? (
          <LoadingSpinner message="Scanning NASA hardware catalog..." />
        ) : hardware.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-2xl">
            <Radio className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-lg text-white font-medium">No spacecraft found matching criteria</p>
            <p className="text-sm text-slate-400 mt-1">Try resetting your search query or filters.</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-space-cyan/20 text-space-cyan border border-space-cyan/30 text-xs font-semibold hover:bg-space-cyan/30"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hardware.map((item) => (
              <Link
                key={item.slug}
                to={`/hardware/${item.slug}`}
                className="group glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-space-navy">
                    <img
                      src={item.image_url}
                      alt={`${item.name} spacecraft`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-space-card via-transparent to-black/30" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={item.operational_status} size="sm" />
                    </div>

                    {/* Attribution Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-space-black/75 backdrop-blur-sm text-slate-300 border border-white/10">
                        <Camera className="w-2.5 h-2.5 text-space-cyan" />
                        <span>{item.image_attribution?.split('/')[0]?.trim() || 'NASA'}</span>
                      </span>
                    </div>

                    {/* Destination Pill */}
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-medium px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-space-cyan border border-white/10">
                        <Compass className="w-3 h-3 text-space-cyan" />
                        <span>{item.destination_name}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      {item.category.replace(/_/g, ' ')}
                    </div>
                    <h3 className="font-heading font-bold text-xl text-white group-hover:text-space-cyan transition-colors mt-0.5">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {item.mission_purpose}
                    </p>

                    {/* Scientific Instruments pill */}
                    {item.instruments && item.instruments.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {item.instruments.slice(0, 3).map((inst, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10"
                            title={inst.purpose_student_friendly}
                          >
                            {inst.acronym}
                          </span>
                        ))}
                        {item.instruments.length > 3 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                            +{item.instruments.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-space-border flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Launched {item.launch_date}</span>
                    <span className="text-space-cyan font-semibold group-hover:translate-x-1 transition-transform">
                      Inspect &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
