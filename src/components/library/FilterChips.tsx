import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { BookFilters } from '@/types/books';
import { FILTER_PRESETS } from '@/lib/filterPresets';

interface FilterChipsProps {
  filters: BookFilters;
  onRemoveFilter: (key: string, value?: string | number | { sortBy: string; sortOrder?: string } | undefined) => void;
  onClearAll?: () => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, onRemoveFilter, onClearAll }) => {
  const isMobile = useIsMobile();
  const chips = [] as { key: string; label: string; payload?: string | number | { sortBy: string; sortOrder?: string } | undefined }[];
  
  if (filters.preset) {
    const preset = FILTER_PRESETS.find(p => p.id === filters.preset);
    chips.push({ key: 'preset', label: `Preset: ${preset?.name || filters.preset}` });
  }
  
  if (filters.search) chips.push({ key: 'search', label: `Search: ${filters.search}`, payload: filters.search });
  if (filters.language) chips.push({ key: 'language', label: `Language: ${filters.language}`, payload: filters.language });
  if (filters.fileType && filters.fileType !== 'all') chips.push({ key: 'fileType', label: `Type: ${filters.fileType}`, payload: filters.fileType });
  if (filters.minYear) chips.push({ key: 'minYear', label: `From: ${filters.minYear}`, payload: filters.minYear });
  if (filters.maxYear) chips.push({ key: 'maxYear', label: `To: ${filters.maxYear}`, payload: filters.maxYear });
  if (filters.sortBy && filters.sortBy !== 'created_at') chips.push({ key: 'sort', label: `Sort: ${filters.sortBy} ${filters.sortOrder || ''}`, payload: { sortBy: filters.sortBy, sortOrder: filters.sortOrder } });
  if (Array.isArray(filters.traditions) && filters.traditions.length > 0) {
    filters.traditions.forEach((t: string) => chips.push({ key: 'tradition', label: `Tradition: ${t}`, payload: t }));
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex gap-1.5 md:gap-2 flex-wrap w-full">
      {chips.map((c, idx) => (
        <div 
          key={`${c.key}-${idx}`} 
          className="px-3 py-2 md:px-2 md:py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-xs md:text-sm rounded-full border border-primary/20 flex items-center gap-2 min-h-[36px] md:min-h-auto transition-all duration-200 hover:from-primary/20 hover:to-secondary/20"
        >
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-medium">
            {c.label}
          </span>
          <button 
            className="text-base md:text-xs p-1 hover:bg-primary/20 rounded-full transition-colors h-5 w-5 flex items-center justify-center hover:scale-110 text-muted-foreground"
            onClick={() => onRemoveFilter(c.key, c.payload)}
            aria-label={`Remove ${c.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      
      {/* Always show Clear All button when there are chips */}
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={onClearAll || (() => {
          // Fallback to individual removal if onClearAll not provided
          onRemoveFilter('search');
          onRemoveFilter('language');
          onRemoveFilter('fileType');
          onRemoveFilter('minYear');
          onRemoveFilter('maxYear');
          onRemoveFilter('sort');
          // Clear all traditions
          if (Array.isArray(filters.traditions) && filters.traditions.length > 0) {
            filters.traditions.forEach((t: string) => onRemoveFilter('tradition', t));
          }
        })}
        className="text-xs border border-primary/20 hover:bg-primary/10"
      >
        <X className="h-3 w-3 mr-1" />
        Clear All
      </Button>
    </div>
  );
};

export default FilterChips;