import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { api } from '@/services/api';
import type { BookSuggestion } from '@/types/books';
import { Badge } from '@/components/ui/badge';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onSelectSuggestion?: (suggestion: BookSuggestion) => void;
}

const SearchBar = ({ value, onChange, placeholder = "Search...", onSelectSuggestion }: SearchBarProps) => {
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = async () => {
      try {
        if (!value || value.trim().length < 2) {
          setSuggestions([]);
          setOpen(false);
          setLoading(false);
          return;
        }
        setLoading(true);
        const res = await api.getBookSuggestions(value, 6);
        const s: BookSuggestion[] = res.suggestions || [];
        setSuggestions(s);
        setOpen(s.length > 0);
        setSelectedIndex(-1); // Reset selection when new suggestions load
      } catch (e) {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(handler, 250);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleSelect = (s: BookSuggestion) => {
    if (onSelectSuggestion) onSelectSuggestion(s);
    setOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && open) {
      const element = document.getElementById(`suggestion-${selectedIndex}`);
      if (element) {
        element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, open]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
        className="pl-10 pr-4 py-2.5 md:py-3 bg-background/80 backdrop-blur-sm border border-purple-500/20 focus:border-purple-500/50 rounded-lg w-full h-11 md:h-10 transition-transform duration-200 focus:ring-2 focus:ring-purple-500/30"
      />

      {open && (suggestions.length > 0 || loading) && (
        <ul 
          role="listbox" 
          className="absolute z-50 mt-1 w-[calc(100vw-2rem)] left-0 right-0 md:max-w-md md:left-auto md:right-auto bg-popover border border-border rounded-md shadow-lg overflow-hidden"
        >
          {loading ? (
            <li className="p-3 md:p-2 text-xs text-muted-foreground">
              Loading suggestions...
            </li>
          ) : (
            suggestions.map((s, index) => (
              <li 
                key={s.id || `${s.title}-${s.author}`}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={index === selectedIndex}
                className={`p-3 md:p-2 cursor-pointer min-h-[44px] transition-colors ${
                  index === selectedIndex 
                    ? 'bg-accent/30' 
                    : 'hover:bg-accent/20'
                }`}
                onClick={() => handleSelect(s)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="font-medium text-sm md:text-base">{s.title}</div>
                {s.author && (
                  <div className="text-xs text-muted-foreground mt-1">
                    by {s.author}
                  </div>
                )}
                {s.tradition && (
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs bg-purple-500/15 border-purple-500/30">
                      {s.tradition}
                    </Badge>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;