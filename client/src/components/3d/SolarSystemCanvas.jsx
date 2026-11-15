import React, { useState, useMemo, useEffect, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import Sun from './Sun';
import Planet from './Planet';
import CameraDirector from './CameraDirector';
import SpacecraftBeacon from './SpacecraftBeacon';
import AsteroidBelt from './AsteroidBelt';
import { getPlanetTexture } from './planetTextures';
import { DEFAULT_DESTINATIONS } from '../../data/defaultDestinations';

// WebGL Error Boundary to catch hardware acceleration issues
class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('WebGL Canvas Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[420px] sm:h-[500px] lg:h-[680px] glass-panel rounded-3xl flex flex-col items-center justify-center p-8 text-center">
          <p className="text-white font-bold mb-2">WebGL 3D Acceleration Unavailable</p>
          <p className="text-xs text-slate-400 mb-4 max-w-md">
            Your browser or device does not currently support WebGL hardware acceleration. You can view the full planetary catalog using the 2D Orbital Map.
          </p>
          <button
            onClick={this.props.onFallback}
            className="btn-violet px-5 py-2.5 rounded-xl font-semibold text-xs font-mono shadow-violet-glow focus-ring"
          >
            Switch to 2D Orbital Map
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Scientifically calibrated visibility scale configuration
const PLANET_CONFIG = {
  'mercury': { orbitRadius: 15, radius: 0.65, angle: 0.20, speed: 0.8, beaconType: 'impact', labelOffset: [5.2, -0.5, 3.2] },
  'venus': { orbitRadius: 23, radius: 1.05, angle: 1.75, speed: 0.4, beaconType: 'atmospheric_entry', labelOffset: [-5.0, 0.5, 4.8] },
  'earth': { orbitRadius: 32, radius: 1.15, angle: 3.40, speed: 0.5, beaconType: 'orbit', labelOffset: [-6.2, 2.5, -3.5] },
  'moon': { isLunar: true, radius: 0.45, localDistance: 4.8, speed: 0.6, beaconType: 'surface', labelOffset: [1.2, -3.8, 6.4] },
  'mars': { orbitRadius: 44, radius: 0.90, angle: 4.95, speed: 0.45, beaconType: 'surface', labelOffset: [4.5, 2.8, -4.5] },
  'asteroid-belt': { orbitRadius: 52, radius: 1.8, angle: 2.50, speed: 0.35, isBelt: true, labelOffset: [-5.5, 2.2, 3.5] },
  'jupiter': { orbitRadius: 65, radius: 2.8, angle: 4.15, speed: 0.3, beaconType: 'orbit', labelOffset: [-6.5, 4.5, -3.0] },
  'saturn': { orbitRadius: 84, radius: 2.3, angle: 5.85, speed: 0.25, hasRings: true, beaconType: 'flyby', labelOffset: [7.0, 4.0, -1.5] },
  'uranus': { orbitRadius: 102, radius: 1.6, angle: 1.15, speed: 0.2, beaconType: 'flyby', labelOffset: [4.5, 3.8, -5.5] },
  'neptune': { orbitRadius: 118, radius: 1.5, angle: 2.05, speed: 0.18, beaconType: 'flyby', labelOffset: [-4.0, 4.5, -8.0] },
  'kuiper-belt': { orbitRadius: 136, radius: 0.6, angle: 3.85, speed: 0.15, beaconType: 'flyby', labelOffset: [-5.0, 3.5, -4.0] },
  'interstellar-space': { orbitRadius: 154, radius: 0.5, angle: 5.35, speed: 0.1, beaconType: 'flyby', labelOffset: [6.0, 3.5, -4.0] }
};

// Earth's Moon component rendered locally in Earth's orbit
function MoonInEarthOrbit({ moonDest, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const texture = useMemo(() => getPlanetTexture('moon'), []);
  const cfg = PLANET_CONFIG['moon'];

  const moonPos = useMemo(() => {
    return new THREE.Vector3(cfg.localDistance, 0, 0);
  }, [cfg.localDistance]);

  const earthCfg = PLANET_CONFIG['earth'];
  const earthAbsolutePos = useMemo(() => {
    const ex = Math.cos(earthCfg.angle) * earthCfg.orbitRadius;
    const ez = Math.sin(earthCfg.angle) * earthCfg.orbitRadius;
    return new THREE.Vector3(ex, 0, ez);
  }, [earthCfg]);

  const moonAbsolutePos = useMemo(() => {
    return new THREE.Vector3(earthAbsolutePos.x + cfg.localDistance, 0, earthAbsolutePos.z);
  }, [earthAbsolutePos, cfg.localDistance]);

  return (
    <>
      {/* Local Lunar Orbit Ring around Earth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[cfg.localDistance - 0.02, cfg.localDistance + 0.02, 64]} />
        <lineBasicMaterial color={isSelected ? '#C4B5FD' : '#E9D5FF'} transparent opacity={isSelected ? 0.7 : 0.16} />
      </mesh>

      {/* Moon Mesh */}
      <group position={moonPos}>
        {/* Invisible Hit Proxy Sphere for reliable raycasting from overview */}
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelect(moonAbsolutePos, moonDest, cfg.radius);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <sphereGeometry args={[2.4, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelect(moonAbsolutePos, moonDest, cfg.radius);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <sphereGeometry args={[cfg.radius, 24, 24]} />
          <meshStandardMaterial map={texture} roughness={0.8} />
        </mesh>

        {/* Selection Ring */}
        {(isSelected || hovered) && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[cfg.radius * 1.3, cfg.radius * 1.45, 32]} />
            <meshBasicMaterial color="#A855F7" side={THREE.DoubleSide} transparent opacity={0.85} />
          </mesh>
        )}

        {/* Surface Beacon for Apollo 11 Lunar Module */}
        <SpacecraftBeacon
          planetRadius={cfg.radius}
          beaconType="surface"
          count={moonDest?.hardware_count || 1}
          isSelected={isSelected}
        />

        {/* 3D Label (fixed screen scale prevents zoom explosion, clickable, adaptive offset in overview) */}
        <Html
          position={isSelected ? [0, cfg.radius + 0.6, 0] : (cfg.labelOffset || [1.2, -3.8, 6.4])}
          center
          className="select-none z-10"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(moonAbsolutePos, moonDest, cfg.radius);
            }}
            onPointerOver={() => {
              setHovered(true);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHovered(false);
              document.body.style.cursor = 'auto';
            }}
            className={`px-2 py-0.5 rounded-xl backdrop-blur-md border text-center transition-all max-w-[110px] shadow-lg cursor-pointer hover:scale-105 active:scale-95 ${
              isSelected
                ? 'bg-[#170F2C]/95 border-purple-400 text-purple-200 shadow-violet-glow scale-105'
                : hovered
                ? 'bg-space-navy/90 border-space-cyan/60 text-white'
                : 'bg-[#110B20]/85 border-purple-500/25 text-[#F5F0FF]'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 leading-tight truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 shadow-sm" />
              <span className="font-heading font-bold text-xs truncate">The Moon</span>
            </div>
            <div className="text-[8px] font-mono text-purple-300 font-semibold leading-tight truncate mt-0.5">Apollo 11 Site</div>
          </div>
        </Html>
      </group>
    </>
  );
}

export default function SolarSystemCanvas({
  destinations = [],
  selectedDest,
  onSelectDestination,
  isResetView,
  onResetComplete,
  onFallback
}) {
  const [targetPosition, setTargetPosition] = useState(null);
  const [targetRadius, setTargetRadius] = useState(1.0);

  // Ensure we always have full planetary ephemeris even if API response is empty/delayed
  const activeDestinations = useMemo(() => {
    return Array.isArray(destinations) && destinations.length > 0
      ? destinations
      : DEFAULT_DESTINATIONS;
  }, [destinations]);

  // Separate the Sun and Moon from heliocentric planets
  const sunDest = useMemo(() => {
    return activeDestinations.find((d) => d.slug === 'sun') || { slug: 'sun', name: 'The Sun', hardware_count: 1 };
  }, [activeDestinations]);

  const moonDest = useMemo(() => {
    return activeDestinations.find((d) => d.slug === 'moon') || { slug: 'moon', name: 'The Moon', hardware_count: 1 };
  }, [activeDestinations]);

  const asteroidBeltDest = useMemo(() => {
    return activeDestinations.find((d) => d.slug === 'asteroid-belt') || {
      slug: 'asteroid-belt',
      name: 'Main Asteroid Belt & Ceres',
      type: 'ASTEROID_BELT',
      distance_from_sun_au: 2.77,
      hardware_count: 1
    };
  }, [activeDestinations]);

  const planetDestinations = useMemo(() => {
    return activeDestinations.filter((d) => d.slug !== 'sun' && d.slug !== 'moon' && d.slug !== 'asteroid-belt');
  }, [activeDestinations]);

  // Synchronize camera target whenever selectedDest prop changes (supports Quick Jump dropdown!)
  useEffect(() => {
    if (!selectedDest) {
      setTargetPosition(null);
      return;
    }

    if (selectedDest.slug === 'sun') {
      setTargetPosition(new THREE.Vector3(0, 0, 0));
      setTargetRadius(5.0);
      return;
    }

    if (selectedDest.slug === 'asteroid-belt') {
      setTargetPosition(new THREE.Vector3(
        Math.cos(2.50) * 52.0,
        0,
        Math.sin(2.50) * 52.0
      ));
      setTargetRadius(2.2);
      return;
    }

    const cfg = PLANET_CONFIG[selectedDest.slug];
    if (!cfg) return;

    if (cfg.isLunar) {
      const earthCfg = PLANET_CONFIG['earth'];
      const ex = Math.cos(earthCfg.angle) * earthCfg.orbitRadius;
      const ez = Math.sin(earthCfg.angle) * earthCfg.orbitRadius;
      setTargetPosition(new THREE.Vector3(ex + cfg.localDistance, 0, ez));
      setTargetRadius(cfg.radius);
      return;
    }

    const px = Math.cos(cfg.angle) * cfg.orbitRadius;
    const pz = Math.sin(cfg.angle) * cfg.orbitRadius;
    setTargetPosition(new THREE.Vector3(px, 0, pz));
    setTargetRadius(cfg.radius);
  }, [selectedDest]);

  const handlePlanetSelect = (pos, dest, radius) => {
    setTargetPosition(pos);
    setTargetRadius(radius || 1.0);
    onSelectDestination(dest);
  };

  const handleSunSelect = () => {
    setTargetPosition(new THREE.Vector3(0, 0, 0));
    setTargetRadius(5.0);
    onSelectDestination(sunDest);
  };

  return (
    <CanvasErrorBoundary onFallback={onFallback}>
      <div className="w-full h-[420px] sm:h-[500px] lg:h-[680px] rounded-3xl overflow-hidden glass-panel border border-space-border relative">
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 150, 220], fov: 45, near: 0.1, far: 2000 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          {/* Deep midnight violet cosmic background */}
          <color attach="background" args={['#080512']} />

          {/* Ambient Lavender Starlight */}
          <ambientLight intensity={0.32} color="#E9D5FF" />

          {/* Procedural Stars */}
          <Stars
            radius={280}
            depth={80}
            count={3600}
            factor={4}
            saturation={0.25}
            fade={true}
            speed={0.6}
          />

          {/* Camera Smooth Controller with adaptive zoom */}
          <CameraDirector
            targetPosition={targetPosition}
            targetRadius={targetRadius}
            isResetView={isResetView}
            onResetComplete={() => {
              setTargetPosition(null);
              if (onResetComplete) onResetComplete();
            }}
          />

          {/* Central Sun */}
          <Sun
            onSelect={handleSunSelect}
            isSelected={selectedDest?.slug === 'sun'}
            hardwareCount={sunDest.hardware_count || 1}
          />

          {/* Main Asteroid Belt between Mars (orbit 44) and Jupiter (orbit 65) */}
          <AsteroidBelt
            innerRadius={48.5}
            outerRadius={55.5}
            count={650}
            isSelected={selectedDest?.slug === 'asteroid-belt'}
            onSelect={(pos, d, r) => handlePlanetSelect(pos, d, r)}
            destination={asteroidBeltDest}
          />

          {/* Planet Spheres & Orbit Lines */}
          {planetDestinations.map((dest) => {
            const config = PLANET_CONFIG[dest.slug] || {
              orbitRadius: 40,
              radius: 1.0,
              angle: 0,
              speed: 0.3,
              beaconType: 'orbit'
            };
            const isSelected = selectedDest?.slug === dest.slug;

            return (
              <Planet
                key={dest.slug}
                destination={dest}
                orbitRadius={config.orbitRadius}
                radius={config.radius}
                angle={config.angle}
                rotationSpeed={config.speed}
                hasRings={config.hasRings}
                beaconType={config.beaconType}
                isSelected={isSelected}
                hardwareCount={dest.hardware_count}
                labelOffset={config.labelOffset}
                onSelect={(pos, d, r) => handlePlanetSelect(pos, d, r)}
              >
                {/* If Earth, nest the Moon orbiting Earth locally! */}
                {dest.slug === 'earth' && (
                  <MoonInEarthOrbit
                    moonDest={moonDest}
                    isSelected={selectedDest?.slug === 'moon'}
                    onSelect={(pos, d, r) => handlePlanetSelect(pos, d, r)}
                  />
                )}
              </Planet>
            );
          })}
        </Canvas>

        {/* Floating Canvas UI Overlay: Desktop & Mobile Navigation Hints */}
        <div className="absolute bottom-4 left-4 pointer-events-none text-[10.5px] font-mono text-slate-300 bg-space-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 sm:gap-4">
          <span className="hidden sm:inline">Left Click + Drag: <strong>Orbit</strong></span>
          <span className="hidden sm:inline">Right Click + Drag: <strong>Pan</strong></span>
          <span className="hidden sm:inline">Scroll: <strong>Zoom</strong></span>
          <span className="sm:hidden">Drag: <strong>Rotate</strong> • Pinch: <strong>Zoom</strong></span>
        </div>
      </div>
    </CanvasErrorBoundary>
  );
}
