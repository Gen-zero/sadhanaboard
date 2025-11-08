import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useUserProgression } from '@/hooks/useUserProgression';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  ShoppingCart, 
  Coins, 
  Palette, 
  Gem, 
  Shirt, 
  Calendar,
  CreditCard,
  Lock,
  Star,
  TrendingUp,
  Zap,
  Flower2,
  Users,
  BookOpen,
  Plus,
  Award,
  Sparkles,
  Gift,
  Check,
  Filter,
  Search,
  ArrowRight,
  Crown,
  Flame
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: number; // in spiritual points
  realPrice?: number; // in real money (USD)
  type: 'theme' | 'yantra' | 'merchandise' | 'workshop';
  isPremium?: boolean;
  isLocked?: boolean;
  unlockLevel?: number;
  imageUrl?: string;
  rating: number;
  category?: 'general' | 'deity'; // Added to categorize themes
  // New properties for first-time visitor appeal
  isNew?: boolean;
  isPopular?: boolean;
  isLimitedTime?: boolean;
}

const StorePage = () => {
  const { toast } = useToast();
  const { progression, spendSpiritualPoints } = useUserProgression();
  const { spiritualPoints, level: userLevel } = progression;
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [spPointsToBuy, setSpPointsToBuy] = useState(100);
  // New state for first-time visitor
  const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useState(true);
  // New states for filtering and search
  const [activeTab, setActiveTab] = useState<'all' | 'theme' | 'yantra' | 'merchandise' | 'workshop'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'general' | 'deity'>('all');

  // Define store items with enhanced properties
  const storeItems: StoreItem[] = [
    // Themes - General
    {
      id: 'dark-theme',
      title: 'Elegant Dark Theme',
      description: 'A sophisticated dark theme with cosmic purple accents',
      price: 50,
      type: 'theme',
      isPremium: false,
      isLocked: false,
      rating: 4.8,
      category: 'general',
      isPopular: true
    },
    {
      id: 'ocean-theme',
      title: 'Serene Ocean Theme',
      description: 'Calm blue tones inspired by tranquil waters',
      price: 75,
      type: 'theme',
      isPremium: false,
      isLocked: false,
      rating: 4.6,
      category: 'general',
      isNew: true
    },
    {
      id: 'forest-theme',
      title: 'Mystical Forest Theme',
      description: 'Earthy greens and nature-inspired elements',
      price: 75,
      type: 'theme',
      isPremium: false,
      isLocked: false,
      rating: 4.7,
      category: 'general'
    },
    {
      id: 'cosmic-theme',
      title: 'Cosmic Nebula Theme',
      description: 'Stunning cosmic visuals with deep purples and blues',
      price: 100,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 5,
      rating: 4.9,
      category: 'general',
      isPopular: true
    },
    {
      id: 'golden-theme',
      title: 'Lakshmi Theme',
      description: 'Warm golden tones for an uplifting experience',
      price: 100,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 7,
      rating: 4.9,
      category: 'general',
      isLimitedTime: true
    },

    // Themes - Deity
    {
      id: 'mahakali-theme',
      title: 'Mahakali Divine Theme',
      description: 'Powerful red and black theme with Mahakali symbolism',
      price: 150,
      realPrice: 9.99,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 10,
      rating: 5.0,
      category: 'deity',
      isNew: true
    },
    {
      id: 'shiva-theme',
      title: 'Shiva Consciousness Theme',
      description: 'Transformative theme with Shiva symbolism and ash tones',
      price: 150,
      realPrice: 9.99,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 10,
      rating: 5.0,
      category: 'deity',
      isPopular: true
    },
    {
      id: 'krishna-theme',
      title: 'Krishna Bliss Theme',
      description: 'Divine love theme with Krishna symbolism and vibrant colors',
      price: 150,
      realPrice: 9.99,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 10,
      rating: 5.0,
      category: 'deity'
    },
    {
      id: 'ganesha-theme',
      title: 'Ganesha Wisdom Theme',
      description: 'Obstacle-removing theme with Ganesha symbolism and golden accents',
      price: 150,
      realPrice: 9.99,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 10,
      rating: 5.0,
      category: 'deity'
    },
    {
      id: 'lakshmi-theme',
      title: 'Lakshmi Prosperity Theme',
      description: 'Abundance-focused theme with Lakshmi symbolism and gold tones',
      price: 150,
      realPrice: 9.99,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 10,
      rating: 5.0,
      category: 'deity',
      isLimitedTime: true
    },
    {
      id: 'saraswati-theme',
      title: 'Saraswati Knowledge Theme',
      description: 'Wisdom-themed with Saraswati symbolism and blue-white tones',
      price: 150,
      realPrice: 9.99,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 10,
      rating: 5.0,
      category: 'deity'
    },
    
    // 3D Yantras
    {
      id: 'shiva-yantra',
      title: 'Shiva Yantra 3D',
      description: 'Dynamic 3D Shiva Yantra with rotating energy',
      price: 120,
      realPrice: 12.99,
      type: 'yantra',
      isPremium: true,
      isLocked: true,
      unlockLevel: 4,
      rating: 4.7,
      isNew: true
    },
    {
      id: 'ganesha-yantra',
      title: 'Ganesha Yantra 3D',
      description: 'Interactive 3D Ganesha Yantra for obstacle removal',
      price: 100,
      realPrice: 9.99,
      type: 'yantra',
      isPremium: true,
      isLocked: true,
      unlockLevel: 2,
      rating: 4.8,
      isPopular: true
    },
    {
      id: 'lakshmi-yantra',
      title: 'Lakshmi Yantra 3D',
      description: 'Prosperity-focused 3D Lakshmi Yantra',
      price: 130,
      realPrice: 11.99,
      type: 'yantra',
      isPremium: true,
      isLocked: true,
      unlockLevel: 5,
      rating: 4.6
    },
    
    // Merchandise
    {
      id: 'yantra-poster',
      title: 'Sacred Yantra Poster Set',
      description: 'Set of 5 high-quality printed yantra posters',
      price: 80,
      realPrice: 24.99,
      type: 'merchandise',
      isPremium: false,
      isLocked: false,
      rating: 4.5,
      isNew: true
    },
    {
      id: 'malas-set',
      title: 'Rudraksha Malas Collection',
      description: 'Set of 3 handcrafted Rudraksha malas',
      price: 200,
      realPrice: 39.99,
      type: 'merchandise',
      isPremium: true,
      isLocked: true,
      unlockLevel: 6,
      rating: 4.9,
      isPopular: true
    },
    {
      id: 'incense-kit',
      title: 'Divine Incense Kit',
      description: 'Premium incense collection for meditation',
      price: 60,
      realPrice: 19.99,
      type: 'merchandise',
      isPremium: false,
      isLocked: false,
      rating: 4.4
    },
    {
      id: 'yantra-bracelet',
      title: 'Protection Yantra Bracelet',
      description: 'Handcrafted bracelet with embedded yantra',
      price: 90,
      realPrice: 29.99,
      type: 'merchandise',
      isPremium: true,
      isLocked: true,
      unlockLevel: 4,
      rating: 4.7,
      isLimitedTime: true
    },
    
    // Workshops
    {
      id: 'meditation-workshop',
      title: 'Advanced Meditation Workshop',
      description: '7-day intensive meditation program',
      price: 300,
      realPrice: 199.99,
      type: 'workshop',
      isPremium: true,
      isLocked: true,
      unlockLevel: 5,
      rating: 4.9,
      isPopular: true
    },
    {
      id: 'yantra-workshop',
      title: 'Sacred Geometry & Yantra Creation',
      description: 'Learn to create and energize yantras',
      price: 250,
      realPrice: 149.99,
      type: 'workshop',
      isPremium: true,
      isLocked: true,
      unlockLevel: 7,
      rating: 4.8,
      isNew: true
    },
    {
      id: 'mantra-workshop',
      title: 'Mantra Chanting Mastery',
      description: 'Deep dive into sacred sound vibrations',
      price: 200,
      realPrice: 129.99,
      type: 'workshop',
      isPremium: true,
      isLocked: true,
      unlockLevel: 6,
      rating: 4.7
    }
  ];

  const handlePurchase = (item: StoreItem) => {
    // Check if user has already purchased this item
    if (purchasedItems.includes(item.id)) {
      toast({
        title: "Already Unlocked",
        description: `You've already unlocked ${item.title}.`,
        variant: "default"
      });
      return;
    }

    // Check if item is locked due to level requirements
    if (item.isLocked && item.unlockLevel && userLevel < item.unlockLevel) {
      toast({
        title: "Item Locked",
        description: `This item requires Level ${item.unlockLevel}. Continue your spiritual journey to unlock it.`,
        variant: "destructive"
      });
      return;
    }

    // During beta period, all items are free - no SP required
    // Simply add the item to purchased items
    setPurchasedItems([...purchasedItems, item.id]);
    
    toast({
      title: "Item Unlocked!",
      description: `You've unlocked ${item.title} for FREE during our beta period!`,
      duration: 3000
    });
    
    // Set first-time visitor to false after first "purchase"
    if (isFirstTimeVisitor) {
      setIsFirstTimeVisitor(false);
    }
  };

  const handleBuyWithRealMoney = (item: StoreItem) => {
    setSelectedItem(item);
    setIsPaymentModalOpen(true);
  };

  const handleBuySPPackage = () => {
    // In a real app, this would integrate with a payment processor
    toast({
      title: "Purchase Successful!",
      description: `You've purchased ${spPointsToBuy} Spiritual Points!`,
      duration: 3000
    });
    setIsPaymentModalOpen(false);
    
    // Set first-time visitor to false after first purchase
    if (isFirstTimeVisitor) {
      setIsFirstTimeVisitor(false);
    }
  };

  const renderStoreSection = (title: string, icon: React.ReactNode, type: StoreItem['type'], category?: StoreItem['category']) => {
    // For merchandise and workshops, show coming soon message instead of items
    if (type === 'merchandise' || type === 'workshop') {
      return (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {icon}
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
          </div>
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-8 text-center">
              {type === 'merchandise' ? (
                <Shirt className="h-12 w-12 text-primary mx-auto mb-4" />
              ) : (
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              )}
              <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                {type === 'merchandise' 
                  ? "We're preparing our spiritual merchandise collection. Check back soon for exclusive items!"
                  : "We're preparing our spiritual workshops and courses. Check back soon for transformative learning experiences!"}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Filter items based on type and optional category
    let items = storeItems.filter(item => item.type === type);
    if (category) {
      items = items.filter(item => item.category === category);
    }
    
    if (items.length === 0) return null;
    
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <StoreItemCard 
              key={item.id} 
              item={item} 
              userLevel={userLevel}
              spiritualPoints={spiritualPoints}
              isPurchased={purchasedItems.includes(item.id)}
              onPurchase={handlePurchase}
              onBuyWithRealMoney={handleBuyWithRealMoney}
              isFirstTimeVisitor={isFirstTimeVisitor}
            />
          ))}
        </div>
      </div>
    );
  };

  // SP Packages for purchase with first-time visitor discounts
  const spPackages = [
    { points: 100, price: 4.99, popular: false },
    { points: 250, price: 9.99, popular: true },
    { points: 500, price: 17.99, popular: false },
    { points: 1000, price: 29.99, popular: false }
  ];

  // Filter items based on active tab, search query, and category
  const getFilteredItems = () => {
    let filtered = storeItems;

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.type === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category (for themes)
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    return filtered;
  };

  const filteredItems = getFilteredItems();

  // Get counts for each category
  const getCounts = () => {
    return {
      all: storeItems.length,
      theme: storeItems.filter(i => i.type === 'theme').length,
      yantra: storeItems.filter(i => i.type === 'yantra').length,
      merchandise: storeItems.filter(i => i.type === 'merchandise').length,
      workshop: storeItems.filter(i => i.type === 'workshop').length
    };
  };

  const counts = getCounts();

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in bg-transparent">
        {/* Premium Hero Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15)_0%,rgba(0,0,0,0)_70%)]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
          
          <CardHeader className="relative z-10 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left: Store Title & Description */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                    Spiritual Store
                  </CardTitle>
                </div>
                <p className="text-muted-foreground text-lg mb-4">
                  Transform your spiritual practice with premium themes, yantras, and exclusive content
                </p>
                
                {/* Beta Badge */}
                <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 px-4 py-2 rounded-full">
                  <Gift className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-accent">Beta Special: All Items FREE</span>
                </div>
              </div>
              
              {/* Right: SP Balance Card */}
              <Card className="lg:w-80 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-accent/20">
                        <Coins className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Your Balance</p>
                        <p className="text-2xl font-bold text-gold">{spiritualPoints} SP</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white"
                      onClick={() => setIsPaymentModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Buy SP
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>Level {userLevel} • {purchasedItems.length} items owned</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardHeader>
        </Card>

        {/* Search and Filter Section */}
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search themes, yantras, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Category Tabs */}
              <div className="flex gap-2 overflow-x-auto">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('all')}
                  className="whitespace-nowrap"
                >
                  All ({counts.all})
                </Button>
                <Button
                  variant={activeTab === 'theme' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('theme')}
                  className="whitespace-nowrap"
                >
                  <Palette className="h-4 w-4 mr-1" />
                  Themes ({counts.theme})
                </Button>
                <Button
                  variant={activeTab === 'yantra' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('yantra')}
                  className="whitespace-nowrap"
                >
                  <Flower2 className="h-4 w-4 mr-1" />
                  Yantras ({counts.yantra})
                </Button>
                <Button
                  variant={activeTab === 'merchandise' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('merchandise')}
                  className="whitespace-nowrap"
                >
                  <Shirt className="h-4 w-4 mr-1" />
                  Merch ({counts.merchandise})
                </Button>
                <Button
                  variant={activeTab === 'workshop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('workshop')}
                  className="whitespace-nowrap"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Workshops ({counts.workshop})
                </Button>
              </div>
            </div>
            
            {/* Theme Category Filter (only show when themes tab is active) */}
            {activeTab === 'theme' && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                <Button
                  variant={categoryFilter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCategoryFilter('all')}
                >
                  All Themes
                </Button>
                <Button
                  variant={categoryFilter === 'general' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCategoryFilter('general')}
                >
                  General
                </Button>
                <Button
                  variant={categoryFilter === 'deity' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCategoryFilter('deity')}
                >
                  <Crown className="h-4 w-4 mr-1" />
                  Deity Themes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured/Popular Items */}
        {activeTab === 'all' && !searchQuery && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Featured Items</h2>
              </div>
              <Badge variant="secondary" className="text-xs">Most Popular</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storeItems.filter(item => item.isPopular || item.isNew).slice(0, 6).map((item) => (
                <StoreItemCard 
                  key={item.id} 
                  item={item} 
                  userLevel={userLevel}
                  spiritualPoints={spiritualPoints}
                  isPurchased={purchasedItems.includes(item.id)}
                  onPurchase={handlePurchase}
                  onBuyWithRealMoney={handleBuyWithRealMoney}
                  isFirstTimeVisitor={isFirstTimeVisitor}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Items Grid */}
        <div>
          {activeTab !== 'all' && (
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-foreground">
                {activeTab === 'theme' && 'Themes'}
                {activeTab === 'yantra' && '3D Yantras'}
                {activeTab === 'merchandise' && 'Merchandise'}
                {activeTab === 'workshop' && 'Workshops & Courses'}
              </h2>
              <Badge variant="outline">{filteredItems.length} items</Badge>
            </div>
          )}
          
          {activeTab === 'all' && !searchQuery && (
            <div className="flex items-center gap-2 mb-4 mt-8">
              <h2 className="text-2xl font-bold text-foreground">All Items</h2>
              <Badge variant="outline">{filteredItems.length} items</Badge>
            </div>
          )}

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <StoreItemCard 
                  key={item.id} 
                  item={item} 
                  userLevel={userLevel}
                  spiritualPoints={spiritualPoints}
                  isPurchased={purchasedItems.includes(item.id)}
                  onPurchase={handlePurchase}
                  onBuyWithRealMoney={handleBuyWithRealMoney}
                  isFirstTimeVisitor={isFirstTimeVisitor}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-muted">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* SP Purchase Modal */}
        {isPaymentModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-accent" />
                  Buy Spiritual Points (Optional During Beta)
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Support our development by purchasing SP. All items are free during beta!
                </p>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                {selectedItem ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <h3 className="font-medium">{selectedItem.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium">{selectedItem.price} SP</span>
                        {selectedItem.realPrice && (
                          <span className="font-medium">${selectedItem.realPrice}</span>
                        )}
                      </div>
                    </div>
                    {/* First-time visitor discount */}
                    {isFirstTimeVisitor && (
                      <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-accent" />
                          <span className="font-medium text-accent">First-Time Visitor Discount!</span>
                        </div>
                        <p className="text-xs mt-1">Get 15% off your first purchase</p>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm">Original Price:</span>
                          <span className="text-sm line-through">${selectedItem.realPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Discounted Price:</span>
                          <span className="text-sm font-bold">${(selectedItem.realPrice * 0.85).toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                    <p className="text-sm">
                      You can buy this item with real money instead of using your Spiritual Points.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-medium">Select SP Package</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant={spPointsToBuy === 100 ? "default" : "outline"}
                        onClick={() => setSpPointsToBuy(100)}
                        className="flex flex-col h-auto p-4"
                      >
                        <span className="text-lg font-bold">100 SP</span>
                        <span className="text-sm">$4.99</span>
                        {isFirstTimeVisitor && (
                          <span className="text-xs text-accent">120 SP with bonus</span>
                        )}
                      </Button>
                      <Button 
                        variant={spPointsToBuy === 250 ? "default" : "outline"}
                        onClick={() => setSpPointsToBuy(250)}
                        className="flex flex-col h-auto p-4 relative"
                      >
                        <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
                          BEST
                        </div>
                        <span className="text-lg font-bold">250 SP</span>
                        <span className="text-sm">$9.99</span>
                        {isFirstTimeVisitor && (
                          <span className="text-xs text-accent">300 SP with bonus</span>
                        )}
                      </Button>
                      <Button 
                        variant={spPointsToBuy === 500 ? "default" : "outline"}
                        onClick={() => setSpPointsToBuy(500)}
                        className="flex flex-col h-auto p-4"
                      >
                        <span className="text-lg font-bold">500 SP</span>
                        <span className="text-sm">$17.99</span>
                        {isFirstTimeVisitor && (
                          <span className="text-xs text-accent">600 SP with bonus</span>
                        )}
                      </Button>
                      <Button 
                        variant={spPointsToBuy === 1000 ? "default" : "outline"}
                        onClick={() => setSpPointsToBuy(1000)}
                        className="flex flex-col h-auto p-4"
                      >
                        <span className="text-lg font-bold">1000 SP</span>
                        <span className="text-sm">$29.99</span>
                        {isFirstTimeVisitor && (
                          <span className="text-xs text-accent">1200 SP with bonus</span>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setIsPaymentModalOpen(false);
                      setSelectedItem(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    onClick={selectedItem ? () => handlePurchase(selectedItem) : handleBuySPPackage}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {selectedItem ? "Buy with Card" : "Purchase"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

interface StoreItemCardProps {
  item: StoreItem;
  userLevel: number;
  spiritualPoints: number;
  isPurchased: boolean;
  onPurchase: (item: StoreItem) => void;
  onBuyWithRealMoney: (item: StoreItem) => void;
  isFirstTimeVisitor: boolean; // New prop
}

const StoreItemCard = ({ item, userLevel, spiritualPoints, isPurchased, onPurchase, onBuyWithRealMoney, isFirstTimeVisitor }: StoreItemCardProps) => {
  const isLocked = item.isLocked && item.unlockLevel && userLevel < item.unlockLevel;
  const canAfford = spiritualPoints >= item.price;
  
  // Get item type icon and color
  const getTypeIcon = () => {
    switch (item.type) {
      case 'theme':
        return <Palette className="h-5 w-5" />;
      case 'yantra':
        return <Flower2 className="h-5 w-5" />;
      case 'merchandise':
        return <Shirt className="h-5 w-5" />;
      case 'workshop':
        return <Users className="h-5 w-5" />;
    }
  };
  
  return (
    <Card className={`group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
      isPurchased 
        ? 'border-accent/50 bg-gradient-to-br from-accent/5 to-accent/10' 
        : 'border-primary/20 hover:border-primary/40 bg-gradient-to-br from-primary/5 to-transparent'
    } ${isLocked ? 'opacity-70' : ''}`}>
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Top badges - reorganized for better visibility */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          {isPurchased && (
            <Badge className="bg-accent text-white text-xs flex items-center gap-1 shadow-lg">
              <Check className="h-3 w-3" />
              Owned
            </Badge>
          )}
          {!isPurchased && (
            <Badge className="bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-bold shadow-lg">
              FREE Beta
            </Badge>
          )}
        </div>
        
        <div className="flex flex-col gap-1 items-end">
          {item.isNew && (
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white text-xs shadow-lg">
              New
            </Badge>
          )}
          {item.isPopular && (
            <Badge className="bg-gradient-to-r from-accent to-accent/80 text-white text-xs flex items-center gap-1 shadow-lg">
              <Flame className="h-3 w-3" />
              Popular
            </Badge>
          )}
          {item.isPremium && (
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white text-xs flex items-center gap-1 shadow-lg">
              <Crown className="h-3 w-3" />
              Premium
            </Badge>
          )}
        </div>
      </div>
      
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-20 gap-2">
          <div className="p-4 rounded-full bg-primary/20 border-2 border-primary/50">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-white">Level {item.unlockLevel} Required</p>
            <p className="text-xs text-white/70">Continue your journey</p>
          </div>
        </div>
      )}
      
      {/* Item icon/image placeholder */}
      <div className="relative h-32 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="p-4 rounded-full bg-background/80 backdrop-blur-sm border border-primary/30">
          <div className="text-primary">
            {getTypeIcon()}
          </div>
        </div>
      </div>
      
      <CardContent className="p-5 relative z-10 space-y-3">
        {/* Title and rating */}
        <div>
          <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${
                    i < Math.floor(item.rating) 
                      ? 'text-accent fill-accent' 
                      : 'text-muted-foreground/30'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{item.rating}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {item.description}
        </p>
        
        {/* Price section */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-gold" />
              <span className="font-bold text-lg text-gold">{item.price} SP</span>
            </div>
            {item.realPrice && (
              <span className="text-xs text-muted-foreground line-through ml-5">
                ${item.realPrice}
              </span>
            )}
          </div>
          
          {isFirstTimeVisitor && !isPurchased && (
            <Badge variant="outline" className="border-accent text-accent text-xs">
              15% OFF
            </Badge>
          )}
        </div>
        
        {/* Action buttons */}
        <Button
          size="lg"
          className={`w-full h-11 font-semibold transition-all duration-300 ${
            isPurchased 
              ? "bg-accent/20 hover:bg-accent/30 text-accent border-2 border-accent/30" 
              : "bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 hover:bg-pos-100 text-white shadow-lg hover:shadow-xl"
          }`}
          onClick={() => onPurchase(item)}
          disabled={isPurchased || isLocked}
        >
          {isPurchased ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Unlocked
            </>
          ) : isLocked ? (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </>
          ) : (
            <>
              <ArrowRight className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
              Get for FREE
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StorePage;