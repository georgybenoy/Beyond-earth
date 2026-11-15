import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Reusable accessible search bar with icon and quick clear button
 * @param {Object} props
 * @param {string} props.value - Search term
 * @param {Function} props.onChange - Handler called with new string value
 * @param {string} [props.placeholder='Search...'] - Placeholder text
 * @param {string} props.ariaLabel - ARIA label for screen readers
 * @param {string} [props.className] - Container CSS class overrides
 */
export default function SearchInput({
  value = '',
  onChange,
  placeholder = 'Search...',
  ariaLabel,
  className = ''
}) {
  const handleClear = () => {
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="text"
        aria-label={ariaLabel || placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="w-full pl-10 pr-9 py-2 bg-space-navy/80 border border-purple-500/25 rounded-xl text-sm text-white placeholder-slate-400 focus-ring"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search input"
          className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-white rounded-lg transition-colors focus-ring"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
