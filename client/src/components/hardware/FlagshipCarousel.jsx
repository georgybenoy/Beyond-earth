import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Compass, Camera, Sparkles, ArrowRight, Pause, Play } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function FlagshipCarousel({ hardware = [] }) {
  // Filter for featured flagships or fallback to the first 5 iconic missions
  const flagships = hardware.filter(h => h.is_featured).slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Accessible playback controls (WCAG 2.2.2 Pause, Stop, Hide)
  const [isPaused, setIsPaused] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [isHoveredOrFocused, setIsHoveredOrFocused] = useState(false);

  useEffect(() => {
    if (flagships.length <= 1 || isPaused || isHoveredOrFocused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % flagships.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [flagships.length, isPaused, isHoveredOrFocused]);

  if (!flagships || flagships.length === 0) return null;

  const current = flagships[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + flagships.length) % flagships.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flagships.length);
  };

  return (
    <div 
      className="relative rounded-3xl overflow-hidden glass-panel border border-space-border mb-10 group"
      onPointerEnter={() => setIsHoveredOrFocused(true)}
      onPointerLeave={() => setIsHoveredOrFocused(false)}
      onFocus={() => setIsHoveredOrFocused(true)}
      onBlur={() => setIsHoveredOrFocused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Flagship NASA Missions Spotlight"
    >
      {/* Background Hero Image */}
      <div className="relative h-[340px] sm:h-[420px] w-full overflow-hidden bg-space-navy">
        <img
          key={current.slug}
          src={current.image_url}
          alt={`${current.name} flagship spacecraft`}
          decoding="async"
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out animate-fadeIn"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-space-black via-space-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-space-black/85 via-space-black/40 to-transparent" />
      </div>

      {/* Attribution, Flagship Badge & Pause/Play Control */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
        {/* WCAG 2.2.2 Pause/Play toggle */}
        <button
          onClick={() => setIsPaused(prev => !prev)}
          aria-label={isPaused ? 'Resume flagship carousel autoplay' : 'Pause flagship carousel autoplay'}
          aria-pressed={isPaused}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-space-black/80 hover:bg-space-black backdrop-blur-md border border-white/10 text-[10.5px] font-mono text-purple-200 transition-colors focus-ring"
        >
          {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-purple-300" />}
          <span>{isPaused ? 'Play' : 'Pause'}</span>
        </button>

        <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-900/40 text-purple-200 border border-purple-500/30 text-[10.5px] font-mono uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>Flagship Mission Spotlight</span>
        </span>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-space-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
          <Camera className="w-3 h-3 text-purple-300" />
          <span>{current.image_attribution || 'NASA / JPL-Caltech'}</span>
        </div>
      </div>

      {/* Slide Navigation Buttons */}
      <button
        onClick={handlePrev}
        aria-label="Previous flagship"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-space-black/60 hover:bg-space-black border border-white/10 text-white flex items-center justify-center transition-all backdrop-blur-md focus-ring"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next flagship"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-space-black/60 hover:bg-space-black border border-white/10 text-white flex items-center justify-center transition-all backdrop-blur-md focus-ring"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-200 px-2.5 py-0.5 rounded-full bg-purple-900/40 border border-purple-500/30">
              {current.category.replace(/_/g, ' ')}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-white/90 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              <Compass className="w-3 h-3 text-purple-300" />
              <span>{current.destination_name}</span>
            </span>
            <StatusBadge status={current.operational_status} size="sm" />
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
            {current.name}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed max-w-2xl">
            {current.mission_purpose}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to={`/hardware/${current.slug}`}
              className="btn-violet inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-xs hover:scale-105 transition-all shadow-violet-glow"
            >
              <span>Explore Mission Chronicle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/solar-system"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-space-navy/80 hover:bg-space-navy border border-purple-500/30 text-slate-300 hover:text-purple-300 font-mono text-xs transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>View in 3D Cosmos</span>
            </Link>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="mt-6 flex items-center gap-2">
          {flagships.map((f, idx) => (
            <button
              key={f.slug}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to slide ${idx + 1}`}
              aria-current={idx === currentIndex ? 'true' : undefined}
              className={`h-1.5 rounded-full transition-all focus-ring ${
                idx === currentIndex ? 'w-8 bg-purple-400' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
