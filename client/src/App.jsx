import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import CosmicBackground from './components/common/CosmicBackground';
import ErrorBoundary from './components/common/ErrorBoundary';
import { CadetProvider } from './context/CadetContext';

// Critical entry page
import HomePage from './pages/HomePage';

// Route-level code splitting for production performance & initial bundle minimization
const SolarSystemPage = lazy(() => import('./pages/SolarSystemPage'));
const HardwarePage = lazy(() => import('./pages/HardwarePage'));
const HardwareDetailPage = lazy(() => import('./pages/HardwareDetailPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const SciencePage = lazy(() => import('./pages/SciencePage'));
const StatusTrackerPage = lazy(() => import('./pages/StatusTrackerPage'));
const AcademyPage = lazy(() => import('./pages/AcademyPage'));

function SuspenseFallback({ message }) {
  return (
    <div className="min-h-screen pt-28 bg-deep-space flex items-center justify-center">
      <LoadingSpinner message={message || 'Acquiring mission telemetry & flight archives...'} />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <CadetProvider>
        {/* Skip to Main Content Link (WCAG 2.1 AA Keyboard Accessibility) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-purple-600 focus:text-white focus:rounded-xl focus:shadow-violet-glow focus:font-mono focus:text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
        >
          Skip to main content
        </a>

        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-space-black text-space-text relative selection:bg-purple-600/35 selection:text-purple-200">
          <CosmicBackground />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main id="main-content" tabIndex="-1" className="flex-1 focus:outline-none">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/solar-system"
                    element={
                      <Suspense fallback={<SuspenseFallback message="Calibrating 3D planetary physics engine & textures..." />}>
                        <SolarSystemPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/hardware"
                    element={
                      <Suspense fallback={<SuspenseFallback message="Scanning NASA hardware catalog & spacecraft fleet..." />}>
                        <HardwarePage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/hardware/:slug"
                    element={
                      <Suspense fallback={<SuspenseFallback message="Retrieving NASA spacecraft telemetry & flight chronicles..." />}>
                        <HardwareDetailPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/timeline"
                    element={
                      <Suspense fallback={<SuspenseFallback message="Compiling six decades of verified NASA flight milestones..." />}>
                        <TimelinePage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/science"
                    element={
                      <Suspense fallback={<SuspenseFallback message="Translating astrophysics into STEM learning modules..." />}>
                        <SciencePage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/status-tracker"
                    element={
                      <Suspense fallback={<SuspenseFallback message="Connecting to Deep Space Network telemetry board..." />}>
                        <StatusTrackerPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/academy"
                    element={
                      <Suspense fallback={<SuspenseFallback message="Opening NASA Space Academy flight evaluation terminal..." />}>
                        <AcademyPage />
                      </Suspense>
                    }
                  />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </div>
      </CadetProvider>
    </BrowserRouter>
  );
}
