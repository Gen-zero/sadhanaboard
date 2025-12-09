import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, Copy, Check } from 'lucide-react';
import { enhanceWithGemini } from '@/services/geminiAiService';

interface AITextEnhancerProps {
  type: 'purpose' | 'goal' | 'message';
  currentValue: string;
  onApplySuggestion: (text: string) => void;
  isLoading?: boolean;
}

const AITextEnhancer = ({
  type,
  currentValue,
  onApplySuggestion,
  isLoading: externalLoading = false,
}: AITextEnhancerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [enhanced, setEnhanced] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const handleEnhance = async () => {
    if (!currentValue.trim()) {
      setError('Please write something first to enhance');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuggestions([]);
    setEnhanced('');

    try {
      const result = await enhanceWithGemini(type, currentValue);
      setEnhanced(result.enhanced);
      setSuggestions(result.suggestions);
      setShowSuggestions(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enhance text. Please try again.');
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (text: string) => {
    onApplySuggestion(text);
    setSuggestions([]);
    setEnhanced('');
    setShowSuggestions(false);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getButtonLabel = () => {
    switch (type) {
      case 'purpose':
        return 'Enhance Purpose';
      case 'goal':
        return 'Enhance Goal';
      case 'message':
        return 'Enhance Message';
      default:
        return 'Enhance Text';
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleEnhance}
        disabled={isLoading || externalLoading || !currentValue.trim()}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 border-purple-400/30 hover:border-purple-400/50 text-purple-300"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Enhancing...</span>
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            <span>{getButtonLabel()}</span>
          </>
        )}
      </Button>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}

      {showSuggestions && enhanced && (
        <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-purple-950/30 to-pink-950/30 border border-purple-500/20 backdrop-blur-sm">
          <div className="space-y-3">
            {/* Primary Enhancement */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                AI Enhanced
              </div>
              <div className="p-3 rounded-md bg-background/40 border border-purple-400/20 text-sm text-black leading-relaxed">
                {enhanced}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleApply(enhanced)}
                  className="flex-1 sm:flex-initial bg-purple-600 hover:bg-purple-700 text-white text-xs py-1"
                >
                  Apply This
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(enhanced, -1)}
                  className="text-purple-300 hover:text-purple-100 text-xs py-1"
                >
                  {copiedIndex === -1 ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="pt-3 border-t border-purple-500/20 space-y-2">
                <div className="text-xs font-semibold text-pink-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                  Alternatives
                </div>
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="space-y-2">
                    <div className="p-3 rounded-md bg-background/40 border border-pink-400/20 text-sm text-black leading-relaxed">
                      {suggestion}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleApply(suggestion)}
                        className="flex-1 sm:flex-initial bg-pink-600/60 hover:bg-pink-600 text-white text-xs py-1"
                      >
                        Apply
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(suggestion, index)}
                        className="text-pink-300 hover:text-pink-100 text-xs py-1"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setShowSuggestions(false);
              setSuggestions([]);
              setEnhanced('');
            }}
            className="w-full text-xs text-muted-foreground hover:text-muted-foreground/80"
          >
            Close Suggestions
          </Button>
        </div>
      )}
    </div>
  );
};

export default AITextEnhancer;
