import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { DECADE_CONFIG } from '../components/timeline/DecadeNavigator';
import { getDecadeFromDate } from '../utils/dateUtils';

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
      const count = allMilestonesUnfiltered.filter(m => getDecadeFromDate(m.date) === d.id).length;
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
  const fetchFilteredTimeline = useCallback(async () => {
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
  }, [selectedEra, selectedDestination, selectedHardware, selectedEventType, selectedCategory, search, majorOnly, sortBy]);

  useEffect(() => {
    fetchFilteredTimeline();
  }, [fetchFilteredTimeline]);

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
    resetAllFilters,
    reload: fetchFilteredTimeline
  };
}
