import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

/**
 * Custom hook to manage NASA hardware catalog queries, filters, and URL query synchronization
 * @returns {Object} Catalog state and filter handler functions
 */
export function useHardwareCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlDestination = searchParams.get('destination') || '';

  const [hardware, setHardware] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(urlDestination);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('launch_date:asc');

  // Synchronize state with URL search params if user navigates with query
  useEffect(() => {
    if (urlDestination) {
      setSelectedDestination(urlDestination);
    }
  }, [urlDestination]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [hwList, destList] = await Promise.all([
        api.getHardware({
          search,
          status: selectedStatus,
          destination: selectedDestination,
          category: selectedCategory,
          sort: sortBy
        }),
        api.getDestinations()
      ]);
      setHardware(hwList || []);
      setDestinations(destList || []);
    } catch (err) {
      console.error('Failed to load hardware catalog:', err);
      setError(err.message || 'Failed to communicate with NASA hardware archives.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedStatus, selectedDestination, selectedCategory, sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDestinationChange = useCallback((slug) => {
    setSelectedDestination(slug);
    if (slug) {
      setSearchParams({ destination: slug });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setSelectedStatus('');
    setSelectedDestination('');
    setSelectedCategory('');
    setSortBy('launch_date:asc');
    setSearchParams({});
  }, [setSearchParams]);

  return {
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
    reload: loadData
  };
}
