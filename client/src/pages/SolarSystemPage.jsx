import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Layers, 
  Cpu, 
  ExternalLink, 
  X, 
  ChevronRight, 
  Info,
  Radio,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Eye,
  MousePointerClick
} from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SolarSystemCanvas from '../components/3d/SolarSystemCanvas';
import { useSolarSystemNavigation } from '../hooks/useSolarSystemNavigation';

export default function SolarSystemPage() {
  const {
    destinations,
    selectedDest,
    setSelectedDest,
    activeHardwareList,
    loadingHardware,
    viewMode,
    setViewMode,
    isResetView,
    handleSelectDestination,
    handleResetCamera,
    handleResetComplete
  } = useSolarSystemNavigation();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-deep-space relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Controls Toolbar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-space-cyan mb-1 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-space-cyan" />
              <span>Interactive 3D Planetary Navigator</span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              Solar System Explorer
            </h1>
            <p className="mt-1 text-slate-300 max-w-xl text-sm leading-relaxed">
              Explore 3D celestial bodies from the Sun to interstellar space. Click any planet to orbit and inspect its NASA rovers, orbiters, and landers.
            </p>
          </div>

          {/* Mode Switcher & Quick Tools */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-space-navy border border-purple-500/25">
              <button
                onClick={() => setViewMode('3d')}
                aria-pressed={viewMode === '3d'}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 focus-ring ${
                  viewMode === '3d'
                    ? 'btn-violet text-white font-bold shadow-violet-glow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>3D Solar System</span>
              </button>
              <button
                onClick={() => setViewMode('schematic')}
                aria-pressed={viewMode === 'schematic'}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors focus-ring ${
                  viewMode === 'schematic'
                    ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Orbital Map (2D)
              </button>
              <button
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors focus-ring ${
                  viewMode === 'grid'
                    ? 'bg-purple-900/40 text-purple-200 border border-purple-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Destination Grid
              </button>
            </div>

            {/* Reset Camera Button for 3D View */}
            {viewMode === '3d' && (
              <button
                onClick={handleResetCamera}
                aria-label="Reset camera to overarching solar perspective"
                className="px-3 py-2 rounded-xl bg-space-navy/90 hover:bg-space-navy border border-purple-500/25 text-slate-300 hover:text-purple-300 text-xs font-mono transition-colors flex items-center gap-1.5 focus-ring"
                title="Reset camera to overarching solar perspective"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Solar View</span>
              </button>
            )}
          </div>
        </div>

        {/* Educational Disclaimer Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-space-navy/70 border border-purple-500/20 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Info className="w-4 h-4 text-purple-300 shrink-0" />
            <span>
              <strong>Educational Model:</strong> Planetary sizes and orbital distances are scaled for visibility and discovery. Telemetry and hardware records are strictly corroborated with NASA archives.
            </span>
          </div>

          {/* Quick Planet Jumper */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-slate-400">Quick Jump:</span>
            <select
              aria-label="Quick jump to celestial body"
              value={selectedDest?.slug || ''}
              onChange={(e) => {
                if (!e.target.value) {
                  handleResetCamera();
                  return;
                }
                const target = destinations.find(d => d.slug === e.target.value);
                if (target) handleSelectDestination(target);
              }}
              className="bg-space-black border border-purple-500/30 text-xs font-mono text-purple-200 px-2.5 py-1 rounded-lg focus-ring"
            >
              <option value="">Select a destination...</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} ({d.hardware_count} craft)
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Calculating planetary ephemeris and orbital vectors..." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Visual Explorer (3D, 2D Schematic, or Grid) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {viewMode === '3d' ? (
                /* Interactive 3D Solar System Viewport */
                <SolarSystemCanvas
                  destinations={destinations}
                  selectedDest={selectedDest}
                  onSelectDestination={handleSelectDestination}
                  isResetView={isResetView}
                  onResetComplete={() => setIsResetView(false)}
                  onFallback={() => setViewMode('schematic')}
                />
              ) : viewMode === 'schematic' ? (
                /* 2D Orbital Map Fallback */
                <div className="glass-panel p-6 rounded-3xl border border-space-border relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-slate-400">
                      Heliocentric Distance from the Sun (Astronomical Units - AU)
                    </span>
                    <span className="text-[10px] font-mono text-space-cyan">
                      1 AU = 149.6 Million km
                    </span>
                  </div>

                  {/* Visual Orbital Tracks */}
                  <div className="space-y-3">
                    {destinations.map((dest) => {
                      const isSelected = selectedDest?.slug === dest.slug;
                      return (
                        <div
                          key={dest.slug}
                          onClick={() => handleSelectDestination(dest)}
                          className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-between border ${
                            isSelected
                              ? 'bg-purple-900/40 border-purple-400 shadow-violet-glow'
                              : 'bg-space-navy/60 border-space-border hover:border-purple-400/50 hover:bg-space-navy/90'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Color Planet Indicator */}
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md relative"
                              style={{ backgroundColor: dest.color || '#8B5CF6' }}
                            >
                              {dest.slug === 'asteroid-belt' ? (
                                <div className="flex items-center gap-0.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white/90" />
                                  <div className="w-1 h-1 rounded-full bg-white/60" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-white/90" />
                                </div>
                              ) : (
                                <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className={`font-heading font-bold text-sm ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                                  {dest.name}
                                </h3>
                                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                                  {dest.type}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 font-mono">
                                {dest.distance_from_sun_au} AU from Sun
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-xs font-mono font-bold text-white block">
                                {dest.hardware_count} {dest.hardware_count === 1 ? 'Craft' : 'Crafts'}
                              </span>
                              {dest.active_hardware_count > 0 && (
                                <span className="text-[10px] font-mono text-emerald-400">
                                  {dest.active_hardware_count} Active
                                </span>
                              )}
                            </div>
                            <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-purple-300' : 'text-slate-500'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destinations.map((dest) => {
                    const isSelected = selectedDest?.slug === dest.slug;
                    return (
                      <div
                        key={dest.slug}
                        onClick={() => handleSelectDestination(dest)}
                        className={`p-5 rounded-2xl glass-panel cursor-pointer transition-all border ${
                          isSelected
                            ? 'border-purple-400 bg-purple-900/30 shadow-violet-glow'
                            : 'border-space-border hover:border-purple-400/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: dest.color || '#8B5CF6' }}
                          >
                            <div className="w-3 h-3 rounded-full bg-white/40" />
                          </div>
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                            {dest.hardware_count} Missions
                          </span>
                        </div>
                        <h3 className="font-heading font-bold text-lg text-white">
                          {dest.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {dest.description}
                        </p>
                        <div className="mt-3 text-[11px] font-mono text-purple-300">
                          {dest.distance_from_sun_au} AU from Sun
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Destination Inspector Panel */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
              {selectedDest ? (
                <div className="glass-panel p-6 rounded-3xl border border-space-border">
                  <div className="flex items-center justify-between pb-4 border-b border-space-border">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: selectedDest.color || '#8B5CF6' }}
                      />
                      <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
                        Destination Telemetry
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {selectedDest.distance_from_sun_au} AU
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-heading font-extrabold text-2xl text-white">
                        {selectedDest.name}
                      </h2>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                        {selectedDest.type}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                      {selectedDest.description}
                    </p>

                    {/* Educational Dossier: Main Asteroid Belt & Ceres Deep Dive */}
                    {selectedDest.slug === 'asteroid-belt' && (
                      <div className="mt-4 p-3.5 rounded-2xl bg-space-navy/90 border border-amber-500/30 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Asteroid Belt Science Dossier</span>
                        </div>

                        {/* Location & Orbital Gulf */}
                        <div className="text-[11px] text-slate-300 leading-relaxed">
                          <span className="font-semibold text-white">Location:</span> Situated in the vast 140-million-km gap between the orbits of <strong className="text-amber-200">Mars (1.52 AU)</strong> and <strong className="text-amber-200">Jupiter (5.2 AU)</strong>, spanning 2.2 to 3.2 AU from the Sun.
                        </div>

                        {/* Planetesimals & Jupiter Gravity */}
                        <div className="text-[11px] text-slate-300 leading-relaxed">
                          <span className="font-semibold text-white">Cosmic Origin:</span> Millions of primitive rocky fragments left over from the birth of the solar system 4.6 billion years ago. They were prevented from coalescing into a planet by the intense gravitational tides of nearby proto-Jupiter.
                        </div>

                        {/* Queen of the Belt: Dwarf Planet Ceres */}
                        <div className="p-2.5 rounded-xl bg-space-black/60 border border-white/5 space-y-1">
                          <div className="text-[11.5px] font-heading font-bold text-white flex items-center justify-between">
                            <span>Dwarf Planet Ceres</span>
                            <span className="text-[10px] font-mono text-space-cyan">940 km Diameter</span>
                          </div>
                          <p className="text-[10.5px] text-slate-300 leading-relaxed">
                            Ceres accounts for nearly <strong>one-third of the entire belt's mass</strong>. Large enough to be shaped into a sphere by its own gravity, Ceres has a rocky core, a water-ice mantle, and famous bright sodium carbonate salt deposits inside <em>Occator Crater</em>, discovered up close by NASA's <strong>Dawn</strong> mission.
                          </p>
                        </div>

                        {/* Composition Types */}
                        <div className="grid grid-cols-3 gap-1.5 text-[9.5px] font-mono text-center pt-1">
                          <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-slate-400 block">C-Type (75%)</span>
                            <span className="text-white font-semibold">Carbonaceous</span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-slate-400 block">S-Type (17%)</span>
                            <span className="text-white font-semibold">Stony Silicate</span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-slate-400 block">M-Type (8%)</span>
                            <span className="text-white font-semibold">Metallic Fe-Ni</span>
                          </div>
                        </div>

                        {/* Space Navigation Fact */}
                        <div className="text-[10px] font-mono text-slate-400 border-t border-white/5 pt-2 flex items-start gap-1.5">
                          <Info className="w-3.5 h-3.5 text-space-cyan shrink-0 mt-0.5" />
                          <span>
                            Unlike sci-fi movies, asteroids are separated by an average distance of over 1 to 3 million km—NASA probes like Pioneer 10, Voyager, Galileo, and New Horizons sailed through with zero collisions!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hardware at this Destination */}
                  <div className="mt-6 pt-4 border-t border-space-border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-purple-300" />
                        <span>NASA Hardware Here ({activeHardwareList.length})</span>
                      </h4>
                      {activeHardwareList.length > 0 && (
                        <span className="text-[10px] font-mono text-slate-400">
                          Click to inspect
                        </span>
                      )}
                    </div>

                    {loadingHardware ? (
                      <div className="text-xs text-slate-400 font-mono py-6 text-center">
                        Acquiring spacecraft telemetry...
                      </div>
                    ) : activeHardwareList.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3">
                        No NASA hardware currently recorded at this celestial body.
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                        {activeHardwareList.map((hw) => (
                          <Link
                            key={hw.slug}
                            to={`/hardware/${hw.slug}`}
                            className="group block p-3.5 rounded-xl bg-space-navy/80 hover:bg-[#1A1230] border border-space-border hover:border-purple-400/50 transition-all"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-heading font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                                {hw.name}
                              </span>
                              <StatusBadge status={hw.operational_status} size="sm" />
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                              <span>{hw.category.replace(/_/g, ' ')}</span>
                              <span>Launched {hw.launch_date.slice(0, 4)}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {activeHardwareList.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5 text-right">
                        <Link
                          to={`/hardware?destination=${selectedDest.slug}`}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-space-cyan hover:underline"
                        >
                          <span>Explore all in Hardware Catalog</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 relative overflow-hidden animate-fadeIn shadow-2xl">
                  {/* Cosmic ambient glow */}
                  <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Header Badge */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-500/30 text-purple-300">
                      <Compass className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 font-bold block">
                        NASA Educational Archive • Orbital Overview
                      </span>
                      <span className="text-xs font-mono text-[#A99BBF]">Cosmic Planetary Explorer</span>
                    </div>
                  </div>

                  {/* Welcome Title */}
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mb-2 leading-tight">
                    Explore Our Solar System
                  </h2>

                  {/* Welcome Description */}
                  <p className="text-sm text-[#A99BBF] leading-relaxed mb-6">
                    Journey across our cosmic neighborhood. Discover planets, moons, spacecraft and the mysteries of space.
                  </p>

                  {/* Interactive Visual Cue Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-purple-900/30 to-space-navy border border-purple-500/40 mb-6 flex items-start gap-3.5 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-200 shrink-0 mt-0.5 animate-pulse">
                      <MousePointerClick className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-white mb-1">
                        Click any celestial body to explore its details.
                      </h3>
                      <p className="text-xs text-[#A99BBF] leading-relaxed">
                        Select a planet, moon, the Sun, or the Asteroid Belt in the 3D scene or from the Quick Jump menu to inspect live telemetry and historical NASA missions.
                      </p>
                    </div>
                  </div>

                  {/* Fast-jump suggestions / popular exploration targets */}
                  <div className="pt-1">
                    <span className="text-[11px] font-mono text-purple-300 uppercase tracking-wider block mb-2.5 font-bold">
                      Popular Celestial Targets:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {destinations.slice(0, 6).map((dest) => (
                        <button
                          key={dest.slug}
                          type="button"
                          onClick={() => handleSelectDestination(dest)}
                          className="p-2.5 rounded-xl bg-space-navy/70 hover:bg-purple-900/40 border border-space-border hover:border-purple-400/50 text-left transition-all flex items-center justify-between group focus-ring"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div
                              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                              style={{ backgroundColor: dest.color || '#8B5CF6' }}
                            />
                            <span className="font-heading text-xs font-bold text-slate-200 group-hover:text-purple-200 truncate">
                              {dest.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-purple-300 shrink-0 ml-1">
                            {dest.hardware_count} 🛰️
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Solar System Overview Stats */}
                  <div className="mt-6 pt-4 border-t border-space-border grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-space-black/50 border border-white/5">
                      <span className="text-purple-300 font-bold block text-sm">1 Star</span>
                      <span className="text-[10px] text-[#A99BBF]">Central Sun</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-space-black/50 border border-white/5">
                      <span className="text-purple-300 font-bold block text-sm">8 Planets</span>
                      <span className="text-[10px] text-[#A99BBF]">Major Orbits</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-space-black/50 border border-white/5">
                      <span className="text-purple-300 font-bold block text-sm">16 Craft</span>
                      <span className="text-[10px] text-[#A99BBF]">NASA Missions</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
