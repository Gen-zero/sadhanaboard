import { 
  CheckSquare, 
  Filter, 
  Search,
  ChevronDown,
  Plus
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
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `float ${Math.random() * 5 + 3}s ease-in-out infinite, 
                    cosmic-pulse ${Math.random() * 4 + 2}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
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
      <div className={`fixed inset-0 pointer-events-none overflow-hidden ${isShivaTheme ? 'hidden' : ''}`}>
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
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Priority</label>
                  <Select value={filter} onValueChange={handleFilterChange}>
                    <SelectTrigger className="glass-effect">
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
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Priority</label>
                <Select value={filter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="glass-effect">
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

      <div className="mt-6 space-y-8">
        {totalSaadhanas === 0 ? (
          <div className="backdrop-blur-sm bg-background/70 p-8 rounded-xl border border-primary/20">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckSquare className="h-16 w-16 text-primary/30 mb-4" />
              <h3 className="text-xl font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">No saadhanas found</h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery || filter !== 'all' 
                  ? "Try changing your search or filter settings." 
                  : "Create your first sadhana by clicking the 'Add Sadhana' button."}
              </p>
              <div className="mt-4">
                <AddSadhana 
                  onAddSadhana={handleAddSadhanaWrapper} 
                  triggerButton={
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/30">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Sadhana
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Add Sadhana Button for when there are existing saadhanas */}
            <div className="flex justify-end">
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
            
            <SadhanaGroup 
              title="Overdue" 
              sadhanas={groupedSaadhanas.overdue}
              onUpdate={handleUpdateSadhana}
              onDelete={handleDeleteSadhana}
              onToggleCompletion={handleToggleCompletion}
            />
            <SadhanaGroup 
              title="Daily Rituals"
              sadhanas={groupedSaadhanas.today}
              onUpdate={handleUpdateSadhana}
              onDelete={handleDeleteSadhana}
              onToggleCompletion={handleToggleCompletion}
            />
            <SadhanaGroup 
              title="Upcoming"
              sadhanas={groupedSaadhanas.upcoming}
              onUpdate={handleUpdateSadhana}
              onDelete={handleDeleteSadhana}
              onToggleCompletion={handleToggleCompletion}
            />
            <SadhanaGroup 
              title="Goals & Aspirations"
              sadhanas={groupedSaadhanas.noDueDate}
              onUpdate={handleUpdateSadhana}
              onDelete={handleDeleteSadhana}
              onToggleCompletion={handleToggleCompletion}
            />
            
            <SadhanaGroup
              title="Completed"
              isCollapsible={true}
              defaultOpen={false}
              sadhanas={groupedSaadhanas.completed}
              onUpdate={handleUpdateSadhana}
              onDelete={handleDeleteSadhana}
              onToggleCompletion={handleToggleCompletion}
            />
          </>
        )}
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