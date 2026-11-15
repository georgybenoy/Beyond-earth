import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Zap, 
  Radio, 
  Orbit, 
  Flame, 
  HeartHandshake, 
  Cpu, 
  ExternalLink,
  ChevronRight,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBanner from '../components/common/ErrorBanner';

export default function SciencePage() {
  const [concepts, setConcepts] = useState([]);
  const [discoveries, setDiscoveries] = useState([]);
  const [activeTab, setActiveTab] = useState('concepts'); // 'concepts' or 'discoveries'
  const [selectedDomain, setSelectedDomain] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadScienceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [conceptData, discoveryData] = await Promise.all([
        api.getConcepts(),
        api.getDiscoveries(selectedDomain)
      ]);
      setConcepts(conceptData || []);
      setDiscoveries(discoveryData || []);
    } catch (err) {
      console.error('Failed to load science data:', err);
      setError(err.message || 'Failed to retrieve STEM science modules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScienceData();
  }, [selectedDomain]);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-deep-space">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-mono uppercase tracking-wider text-space-cyan mb-1">
            Student STEM Learning Center
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Science Behind the Machine
          </h1>
          <p className="mt-2 text-slate-300 max-w-2xl text-sm leading-relaxed">
            How do machines survive temperatures colder than deep freeze, navigate millions of miles without GPS, and zap rocks with lasers? Explore the physics, engineering, and discoveries that make space exploration possible.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-space-border gap-6 mb-8 text-sm" role="tablist" aria-label="Science learning categories">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'concepts'}
            aria-controls="concepts-panel"
            id="tab-concepts"
            onClick={() => setActiveTab('concepts')}
            className={`pb-3 font-medium transition-colors flex items-center gap-2 border-b-2 focus-ring rounded-t ${
              activeTab === 'concepts'
                ? 'border-purple-400 text-purple-300 font-bold'
                : 'border-transparent text-[#A99BBF] hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Engineering Concepts ({concepts.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'discoveries'}
            aria-controls="discoveries-panel"
            id="tab-discoveries"
            onClick={() => setActiveTab('discoveries')}
            className={`pb-3 font-medium transition-colors flex items-center gap-2 border-b-2 focus-ring rounded-t ${
              activeTab === 'discoveries'
                ? 'border-purple-400 text-purple-300 font-bold'
                : 'border-transparent text-[#A99BBF] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Key Scientific Breakthroughs ({discoveries.length})</span>
          </button>
        </div>

        {error ? (
          <ErrorBanner
            title="Science Center Telemetry Unavailable"
            message={error}
            onRetry={loadScienceData}
            retryLabel="Retry Learning Modules Sync"
          />
        ) : loading ? (
          <LoadingSpinner message="Translating complex astrophysics into student explainers..." />
        ) : activeTab === 'concepts' ? (
          /* Engineering Concepts View */
          <div id="concepts-panel" role="tabpanel" aria-labelledby="tab-concepts" className="space-y-12">
            {concepts.map((concept) => (
              <div
                key={concept.slug}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-space-border relative overflow-hidden"
              >
                <div className="max-w-3xl">
                  <div className="text-xs font-mono uppercase tracking-widest text-purple-300 mb-1">
                    Fundamental Space Technology
                  </div>
                  <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-2">
                    {concept.title}
                  </h2>
                  <p className="text-sm font-semibold text-slate-200 mb-4">
                    {concept.headline}
                  </p>
                  <p className="text-sm text-[#A99BBF] leading-relaxed mb-6">
                    {concept.summary}
                  </p>
                </div>

                {/* Step-by-Step Mechanism */}
                <div className="mt-6 mb-6">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#A99BBF] mb-3">
                    How It Works — Step by Step:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {concept.how_it_works?.map((step) => (
                      <div
                        key={step.step}
                        className="p-4 rounded-2xl bg-space-navy/80 border border-space-border flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono font-bold text-xs mb-3">
                            {step.step}
                          </div>
                          <h4 className="font-heading font-bold text-sm text-white mb-1.5">
                            {step.title}
                          </h4>
                          <p className="text-xs text-[#A99BBF] leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why It Matters on Earth */}
                <div className="p-4 rounded-2xl bg-purple-900/20 border border-purple-500/30 flex items-start gap-3">
                  <HeartHandshake className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-mono text-purple-300 uppercase tracking-wider block mb-0.5">
                      Why It Matters for Life on Earth:
                    </strong>
                    <p className="text-xs text-[#F5F0FF] leading-relaxed">
                      {concept.why_it_matters_on_earth}
                    </p>
                  </div>
                </div>

                {/* Related Spacecraft Links */}
                {concept.related_hardware_slugs && (
                  <div className="mt-5 pt-4 border-t border-space-border flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-[#A99BBF]">Used by:</span>
                    {concept.related_hardware_slugs.map((slug) => (
                      <Link
                        key={slug}
                        to={`/hardware/${slug}`}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-purple-900/40 hover:text-purple-300 text-slate-300 border border-white/10 transition-colors flex items-center gap-1 focus-ring"
                      >
                        <Cpu className="w-3 h-3" />
                        <span>{slug.replace(/-/g, ' ')}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Scientific Discoveries View */
          <div id="discoveries-panel" role="tabpanel" aria-labelledby="tab-discoveries">
            {/* Domain Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-mono" role="group" aria-label="Filter by scientific domain">
              <span className="text-[#A99BBF]">Scientific Domain:</span>
              {['', 'ASTROBIOLOGY', 'GEOLOGY', 'ATMOSPHERE', 'COSMOLOGY'].map((dom) => (
                <button
                  key={dom}
                  type="button"
                  aria-pressed={selectedDomain === dom}
                  onClick={() => setSelectedDomain(dom)}
                  className={`px-3 py-1.5 rounded-lg transition-colors focus-ring ${
                    selectedDomain === dom
                      ? 'bg-purple-600 text-white font-semibold'
                      : 'text-[#A99BBF] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {dom === '' ? 'ALL DOMAINS' : dom}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {discoveries.map((d, index) => (
                <div
                  key={index}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-500/30">
                        {d.scientific_domain}
                      </span>
                      <Link
                        to={`/hardware/${d.hardware_slug}`}
                        className="text-xs font-mono text-[#A99BBF] hover:text-purple-300 focus-ring rounded px-1"
                      >
                        {d.hardware_name}
                      </Link>
                    </div>

                    <h2 className="font-heading font-bold text-xl text-white mb-2">
                      {d.title}
                    </h2>

                    <p className="text-xs text-[#A99BBF] leading-relaxed mb-4">
                      {d.plain_english_summary}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-space-navy border border-white/5">
                    <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider block mb-1 font-bold">
                      Educational Significance:
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {d.why_it_matters}
                    </p>
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
