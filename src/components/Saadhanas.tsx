import {
  CheckSquare,
  Filter,
  Search,
  ChevronDown,
  Plus,
  Target,
  Flame,
  Clock
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sadhana } from '@/types/sadhana';
import { useSaadhanas } from '@/hooks/useSaadhanas';
import SadhanaGroup from './SadhanaGroup';
import AddSadhana from './AddSadhana';
import ReflectionDialog from './ReflectionDialog';
import CosmicBackgroundSimple from './sadhana/CosmicBackgroundSimple';
import { useSettings } from '@/hooks/useSettings';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

const CosmicParticle = ({ delay }: { delay: number }) => {
  return (
    <div
      className="absolute rounded-full opacity-0"
      style={{
        backgroundColor: 'hsl(var(--primary) / 0.5)', // Use theme primary color with opacity
        width: `${Math.random() * 3 + 1} px`,
        height: `${Math.random() * 3 + 1} px`,
        top: `${Math.random() * 100}% `,
        left: `${Math.random() * 100}% `,
        animation: `float ${Math.random() * 5 + 3}s ease -in -out infinite,
  cosmic - pulse ${Math.random() * 4 + 2}s ease -in -out infinite`,
        animationDelay: `${delay} s`,
        opacity: Math.random() * 0.5 + 0.2
      }}
    ></div>
  );
};

const Saadhanas = () => {
  const {
    searchQuery, setSearchQuery,
    filter, setFilter,
    reflectingSadhana, setReflectingSadhana,
    reflectionText, setReflectionText,
    groupedSaadhanas,
    dailyRituals,
    goalTasks,
    handleAddSadhana,
    handleUpdateSadhana,
    handleDeleteSadhana,
    handleToggleCompletion,
    handleSaveReflection
  } = useSaadhanas();

  const { settings } = useSettings();
  const [cosmicParticles, setCosmicParticles] = useState<number[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Create cosmic particles
    const particles = Array.from({ length: 50 }, (_, i) => i);
    setCosmicParticles(particles);
  }, []);

  const totalSaadhanas = Object.values(groupedSaadhanas).reduce((sum, arr) => sum + arr.length, 0);
  const activeFiltersCount = (filter !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0);

  // Check if Shiva theme is active
  const isShivaTheme = settings?.appearance?.colorScheme === 'shiva';

  // Wrapper function to handle the return type expected by AddSadhana
  const handleAddSadhanaWrapper = (newSadhana: Omit<Sadhana, 'id' | 'reflection'>): boolean => {
    try {
      // Convert the type to match what handleAddSadhana expects
      const sadhanaToAdd: Omit<Sadhana, 'id'> = {
        ...newSadhana,
        reflection: undefined
      };
      handleAddSadhana(sadhanaToAdd);
      return true;
    } catch (error) {
      console.error('Failed to add sadhana:', error);
      return false;
    }
  };

  // Type-safe filter handler
  const handleFilterChange = (value: string) => {
    if (value === 'all' || value === 'high' || value === 'medium' || value === 'low') {
      setFilter(value);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in cosmic-nebula-bg relative bg-transparent">
      <CosmicBackgroundSimple />

      {/* Cosmic particles - hidden for Shiva theme */}
      <div className={`fixed inset - 0 pointer - events - none overflow - hidden ${isShivaTheme ? 'hidden' : ''} `}>
        {cosmicParticles.map((_, index) => (
          <CosmicParticle key={index} delay={index * 0.1} />
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
            <CheckSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Saadhanas
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Organize your spiritual practices and goals
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="backdrop-blur-sm bg-background/70 p-4 rounded-xl border border-primary/20">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search saadhanas..."
              className="pl-9 glass-effect"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {/* Filter Button */}
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-background/70 border-primary/30 hover:bg-primary/10"
              onClick={() => isMobile ? setIsMobileFiltersOpen(true) : setIsDesktopFiltersOpen(!isDesktopFiltersOpen)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Filter Sheet */}
        {isMobile && (
          <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
            <SheetContent side="bottom" className="h-[50vh]">
              <SheetHeader>
                <SheetTitle>Filter Saadhanas</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="priority-filter-mobile" className="text-sm font-medium text-muted-foreground mb-2 block">Priority</label>
                  <Select value={filter} onValueChange={handleFilterChange}>
                    <SelectTrigger id="priority-filter-mobile" className="glass-effect">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setIsMobileFiltersOpen(false)}>Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Desktop Filter Panel */}
        {!isMobile && isDesktopFiltersOpen && (
          <CollapsibleContent className="pt-4 border-t border-primary/20 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="priority-filter-desktop" className="text-sm font-medium text-muted-foreground mb-2 block">Priority</label>
                <Select value={filter} onValueChange={handleFilterChange}>
                  <SelectTrigger id="priority-filter-desktop" className="glass-effect">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        )}
      </div>

      <div className="mt-6">
        {/* Add Sadhana Button */}
        <div className="flex justify-end mb-6">
          <AddSadhana
            onAddSadhana={handleAddSadhanaWrapper}
            triggerButton={
              <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/30">
                <Plus className="mr-2 h-4 w-4" />
                Add Sadhana
              </Button>
            }
          />
        </div>

        {/* Two-Column Layout: Goal Tasks (left) & Daily Rituals (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Goal Tasks Section (Left) - Search applies here only */}
          <div className="backdrop-blur-sm bg-background/70 p-6 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Target className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Goal Tasks</h2>
                <p className="text-xs text-muted-foreground">Searchable • {goalTasks.length} tasks</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {goalTasks.length > 0 ? (
                goalTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/20 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-md cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {task.time && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.time}
                          </span>
                        )}
                        <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30"
                        onClick={() => handleToggleCompletion(task)}
                      >
                        Complete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">{searchQuery ? 'No matching goals found' : 'No goal tasks yet'}</p>
                  <p className="text-xs mt-2">Add tasks with category "goal" to see them here</p>
                </div>
              )}
            </div>
          </div>

          {/* Daily Rituals Section (Right) - No search filter */}
          <div className="backdrop-blur-sm bg-background/70 p-6 rounded-xl border border-amber-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Flame className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Daily Rituals</h2>
                <p className="text-xs text-muted-foreground">Today's practices • {dailyRituals.length} rituals</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {dailyRituals.length > 0 ? (
                dailyRituals.map((ritual) => (
                  <div
                    key={ritual.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/20 border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:shadow-md cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{ritual.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {ritual.time && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3 text-amber-400" />
                            {ritual.time}
                          </span>
                        )}
                        <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          daily
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
                        onClick={() => handleToggleCompletion(ritual)}
                      >
                        Complete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Flame className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No daily rituals for today</p>
                  <p className="text-xs mt-2">Add tasks with category "daily" to see them here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Completed Section - Collapsible */}
        <div className="mt-8">
          <SadhanaGroup
            title="Completed"
            isCollapsible={true}
            defaultOpen={false}
            sadhanas={groupedSaadhanas.completed}
            onUpdate={handleUpdateSadhana}
            onDelete={handleDeleteSadhana}
            onToggleCompletion={handleToggleCompletion}
          />
        </div>
      </div>

      <ReflectionDialog
        reflectingSadhana={reflectingSadhana}
        setReflectingSadhana={setReflectingSadhana}
        reflectionText={reflectionText}
        setReflectionText={setReflectionText}
        onSave={handleSaveReflection}
      />
    </div>
  );
};

export default Saadhanas;