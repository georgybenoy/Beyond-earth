import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { DEFAULT_DESTINATIONS, DEFAULT_DESTINATION_HARDWARE } from '../data/defaultDestinations';

/**
 * Custom hook to manage 3D / 2D Solar System destination selection, hardware retrieval, and camera states
 * @returns {Object} Solar System state and interaction handlers
 */
export function useSolarSystemNavigation() {
  const [destinations, setDestinations] = useState(DEFAULT_DESTINATIONS);
  const [selectedDest, setSelectedDest] = useState(null); // Neutral initial state (no celestial body selected by default)
  const [loading, setLoading] = useState(false);
  const [activeHardwareList, setActiveHardwareList] = useState([]);
  const [loadingHardware, setLoadingHardware] = useState(false);
  const [viewMode, setViewMode] = useState('3d'); // '3d', 'schematic', 'grid'
  const [isResetView, setIsResetView] = useState(false);

  useEffect(() => {
    async function loadDestinations() {
      try {
        const data = await api.getDestinations();
        if (data && data.length > 0) {
          setDestinations(data);
          setSelectedDest(prev => {
            if (!prev) return null; // Retain full overview neutral state on fresh load
            return data.find(d => d.slug === prev.slug) || prev;
          });
        }
      } catch (err) {
        console.warn('Using local planetary ephemeris (API unreachable):', err);
      }
    }
    loadDestinations();
  }, []);

  const handleSelectDestination = useCallback(async (dest) => {
    setSelectedDest(dest);
    setLoadingHardware(true);
    try {
      const detailed = await api.getDestination(dest.slug);
      setActiveHardwareList(detailed.hardware || DEFAULT_DESTINATION_HARDWARE[dest.slug] || []);
    } catch (err) {
      console.warn('Falling back to local hardware manifest:', err);
      setActiveHardwareList(DEFAULT_DESTINATION_HARDWARE[dest.slug] || []);
    } finally {
      setLoadingHardware(false);
    }
  }, []);

  const handleResetCamera = useCallback(() => {
    setSelectedDest(null);
    setActiveHardwareList([]);
    setIsResetView(true);
  }, []);

  const handleResetComplete = useCallback(() => {
    setIsResetView(false);
  }, []);

  return {
    destinations,
    selectedDest,
    setSelectedDest,
    loading,
    activeHardwareList,
    loadingHardware,
    viewMode,
    setViewMode,
    isResetView,
    handleSelectDestination,
    handleResetCamera,
    handleResetComplete
  };
}
