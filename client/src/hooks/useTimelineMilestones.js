import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { DECADE_CONFIG } from '../components/timeline/DecadeNavigator';

/**
 * Custom hook to manage historical timeline milestones, filters, and URL query synchronization
 * @returns {Object} Timeline state, decade counts, and filter handlers
 */
export function useTimelineMilestones() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial filter values from URL query parameters
  const initialEra = searchParams.get('era') || '';
  const initialDest = searchParams.get('destination') || '';
  const initialHw = searchParams.get('hardware') || '';
  const initialType = searchParams.get('type') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialMajor = searchParams.get('major') === 'true';
  const initialSort = searchParams.get('sort') || 'asc';

  // State
  const [milestones, setMilestones] = useState([]);
  const [allMilestonesUnfiltered, setAllMilestonesUnfiltered] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [hardwareList, setHardwareList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [selectedEra, setSelectedEra] = useState(initialEra);
  const [selectedDestination, setSelectedDestination] = useState(initialDest);
  const [selectedHardware, setSelectedHardware] = useState(initialHw);
  const [selectedEventType, setSelectedEventType] = useState(initialType);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [majorOnly, setMajorOnly] = useState(initialMajor);
  const [sortBy, setSortBy] = useState(initialSort);

  // Initial lookup data (destinations & hardware list)
  useEffect(() => {
    async function loadLookups() {
      try {
        const [dList, hList, allMList] = await Promise.all([
          api.getDestinations(),
          api.getHardware(),
          api.getTimeline()
        ]);
        setDestinations(dList || []);
        setHardwareList(hList || []);
        setAllMilestonesUnfiltered(allMList || []);
      } catch (err) {
        console.error('Failed to load lookup metadata for timeline:', err);
      }
    }
    loadLookups();
  }, []);

  // Compute event counts per decade for the decade navigator badges
  const countsByEra = useMemo(() => {
    const counts = { '': allMilestonesUnfiltered.length };
    DECADE_CONFIG.forEach(d => {
      if (!d.id) return;
      const count = allMilestonesUnfiltered.filter(m => {
        const yr = parseInt(m.date.split('-')[0], 10);
        if (d.id === '1960s') return yr >= 1960 && yr < 1970;
        if (d.id === '1970s') return yr >= 1970 && yr < 1980;
        if (d.id === '1980s') return yr >= 1980 && yr < 1990;
        if (d.id === '1990s') return yr >= 1990 && yr < 2000;
        if (d.id === '2000s') return yr >= 2000 && yr < 2010;
        if (d.id === '2010s') return yr >= 2010 && yr < 2020;
        if (d.id === '2020s') return yr >= 2020;
        return true;
      }).length;
      counts[d.id] = count;
    });
    return counts;
  }, [allMilestonesUnfiltered]);

  // Synchronize state with URL query parameters
  const updateUrlParams = useCallback((newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newParams };
    Object.keys(merged).forEach((k) => {
      if (!merged[k]) delete merged[k];
    });
    setSearchParams(merged);
  }, [searchParams, setSearchParams]);

  // Fetch timeline milestones whenever filters change
  useEffect(() => {
    async function fetchFilteredTimeline() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getTimeline({
          era: selectedEra,
          destination: selectedDestination,
          hardware_slug: selectedHardware,
          event_type: selectedEventType,
          category: selectedCategory,
          search,
          major_only: majorOnly ? 'true' : undefined,
          sort: sortBy
        });
        setMilestones(data || []);
      } catch (err) {
        console.error('Failed to load timeline milestones:', err);
        setError(err.message || 'Timeline archive request failed');
      } finally {
        setLoading(false);
      }
    }
    fetchFilteredTimeline();
  }, [selectedEra, selectedDestination, selectedHardware, selectedEventType, selectedCategory, search, majorOnly, sortBy]);

  const handleEraSelect = useCallback((era) => {
    setSelectedEra(era);
    updateUrlParams({ era });
  }, [updateUrlParams]);

  const resetAllFilters = useCallback(() => {
    setSelectedEra('');
    setSelectedDestination('');
    setSelectedHardware('');
    setSelectedEventType('');
    setSelectedCategory('');
    setSearch('');
    setMajorOnly(false);
    setSortBy('asc');
    setSearchParams({});
  }, [setSearchParams]);

  return {
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
    resetAllFilters
  };
}
