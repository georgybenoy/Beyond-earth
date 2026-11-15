import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Cpu, 
  History, 
  Sparkles, 
  Radio, 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Globe2, 
  Layers 
} from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [statusSummary, setStatusSummary] = useState(null);
  const [destinationsCount, setDestinationsCount] = useState(13);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [featuredData, summaryData, destsData] = await Promise.all([
          api.getFeaturedHardware(),
          api.getStatusSummary(),
          api.getDestinations()
        ]);
        setFeatured(featuredData || []);
        setStatusSummary(summaryData);
        if (destsData && destsData.length > 0) {
          setDestinationsCount(destsData.length);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    { 
      label: 'Hardware Tracked', 
      value: statusSummary ? `${statusSummary.counts.TOTAL_TRACKED} Missions` : '18 Missions', 
      sub: `Across ${destinationsCount} Celestial Bodies` 
    },
    { 
      label: 'Active in Flight', 
      value: statusSummary ? `${statusSummary.counts.OPERATIONAL} Probes` : '7 Active', 
      sub: 'Transmitting Science Data' 
    },
    { label: 'Farthest Machine', value: '24.7B km', sub: 'Voyager 1 in Interstellar Space' },
    { label: 'Historical Span', value: '1960 – Present', sub: '60+ Years of Exploration' },
  ];

  const wings = [
    {
      title: 'Solar System Explorer',
      desc: 'Embark on an orbital journey from the fiery Sun to interstellar space. Click planets and moons to discover resident hardware.',
      path: '/solar-system',
      icon: Compass,
      color: 'from-purple-900/40 via-violet-950/20 to-transparent',
      border: 'hover:border-purple-400/60',
      badge: 'Interactive Map'
    },
    {
      title: 'Hardware Explorer',
      desc: 'Examine detailed profiles of rovers, orbiters, and landers. Inspect scientific instruments, power sources, and verified citations.',
      path: '/hardware',
      icon: Cpu,
      color: 'from-violet-900/40 via-purple-950/20 to-transparent',
      border: 'hover:border-purple-400/60',
      badge: 'Deep Profiles'
    },
    {
      title: 'Mission Timeline',
      desc: 'Travel through six decades of space history. Discover the pivotal launches, miraculous landings, and bittersweet final signals.',
      path: '/timeline',
      icon: History,
      color: 'from-amber-900/30 via-purple-950/20 to-transparent',
      border: 'hover:border-amber-400/50',
      badge: '1960s – 2026'
    },
    {
      title: 'Science Behind the Machine',
      desc: 'Understand the engineering marvels in kid-friendly terms: RTG nuclear power, laser spectroscopy, and deep-space radio antennas.',
      path: '/science',
      icon: Sparkles,
      color: 'from-emerald-900/30 via-purple-950/20 to-transparent',
      border: 'hover:border-emerald-400/50',
      badge: 'STEM Education'
    },
    {
      title: 'Mission Status Radar',
      desc: 'Live telemetry classification distinguishing actively transmitting machines from resting artifacts and silent deep-space drifters.',
      path: '/status-tracker',
      icon: Radio,
      color: 'from-pink-900/30 via-purple-950/20 to-transparent',
      border: 'hover:border-pink-400/50',
      badge: 'Verified Facts'
    },
    {
      title: 'Space Academy',
      desc: 'Put your astronaut knowledge to the test! Complete interactive space quizzes, earn mission points, and unlock NASA badges.',
      path: '/academy',
      icon: GraduationCap,
      color: 'from-indigo-900/40 via-purple-950/20 to-transparent',
      border: 'hover:border-purple-400/60',
      badge: 'Student Quizzes'
    }
  ];

  return (
    <div className="relative min-h-screen pt-20 pb-16 bg-deep-space">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        {/* Verification Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/35 border border-purple-400/40 text-purple-200 text-xs font-mono mb-8 backdrop-blur-md shadow-sm">
          <ShieldCheck className="w-4 h-4 text-purple-300" />
          <span>NASA Space Apps Challenge — Verified Educational Archive</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Humanity’s Footprints <br />
          <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            Across the Solar System
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-[#A99BBF] max-w-2xl mx-auto leading-relaxed">
          Welcome to <strong className="text-white">Beyond Earth</strong>: an interactive digital museum that tells the true stories of human-made spacecraft, rovers, and scientific instruments deployed across the cosmos since the 1960s.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/solar-system"
            className="btn-violet focus-ring flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm hover:scale-105 transition-all shadow-violet-glow"
          >
            <Compass className="w-4 h-4" />
            Launch Solar System Explorer
          </Link>
          <Link
            to="/hardware"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#170F2C]/80 hover:bg-[#20153D]/90 text-[#F5F0FF] font-semibold text-sm border border-purple-500/30 hover:border-purple-400/60 transition-all backdrop-blur-md focus-ring"
          >
            <Cpu className="w-4 h-4 text-purple-300" />
            Explore NASA Hardware
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <div key={i} className="glass-panel p-4 rounded-xl text-center">
              <div className="text-xl sm:text-2xl font-bold font-mono text-purple-300">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-slate-200 mt-1">{stat.label}</div>
              <div className="text-[10px] text-[#A99BBF] mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Museum Wings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white">
            Explore Museum Wings
          </h2>
          <p className="mt-2 text-[#A99BBF] text-sm max-w-lg mx-auto">
            Choose a wing to begin your educational expedition through planetary science and robotic engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wings.map((wing, i) => {
            const Icon = wing.icon;
            return (
              <Link
                key={i}
                to={wing.path}
                className={`group relative p-6 rounded-2xl glass-panel bg-gradient-to-br ${wing.color} border border-space-border ${wing.border} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col justify-between focus-ring`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#110B20]/80 border border-purple-500/25 flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:border-purple-400/50 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-900/40 text-purple-200 border border-purple-500/30">
                      {wing.badge}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-purple-300 transition-colors">
                    {wing.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#A99BBF] leading-relaxed">
                    {wing.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center text-xs font-semibold text-purple-300 group-hover:translate-x-1 transition-transform">
                  <span>Enter Wing</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Iconic Hardware Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-space-border">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-purple-300 mb-1">
              Curated Highlights
            </div>
            <h2 className="font-heading font-bold text-3xl text-white">
              Legendary Space Pioneers
            </h2>
          </div>
          <Link
            to="/hardware"
            className="inline-flex items-center text-sm font-semibold text-purple-300 hover:text-purple-200 transition-colors focus-ring rounded"
          >
            <span>View All 16 Spacecraft</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#A99BBF] font-mono">Loading hardware highlights...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map((item) => (
              <Link
                key={item.slug}
                to={`/hardware/${item.slug}`}
                className="group rounded-2xl overflow-hidden glass-panel glass-panel-hover flex flex-col focus-ring"
              >
                <div className="relative h-48 w-full overflow-hidden bg-space-navy">
                  <img
                    src={item.image_url}
                    alt={`${item.name} spacecraft`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-card via-transparent to-black/30" />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={item.operational_status} size="sm" />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-mono text-purple-300 uppercase">
                      {item.category?.replace(/_/g, ' ') || 'Spacecraft'}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-white group-hover:text-purple-300 transition-colors mt-1">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-xs text-[#A99BBF] line-clamp-2 leading-relaxed">
                      {item.historical_significance || 'Historical NASA mission exploration.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-space-border flex items-center justify-between text-xs text-[#A99BBF] font-mono">
                    <span>Launched {item.launch_date ? item.launch_date.slice(0, 4) : 'Historical'}</span>
                    <span className="text-purple-300 group-hover:underline">Explore &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
