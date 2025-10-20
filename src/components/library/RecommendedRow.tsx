import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { StoreSadhana } from '@/types/store';
import { storeSadhanas } from '@/data/storeSadhanas';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Star } from 'lucide-react';
import api from '@/services/api';

interface RecommendedItem {
  id: string;
  title: string;
  description: string;
  type: 'sadhana' | 'book';
  difficulty?: string;
  duration?: number;
  price?: number;
  rating?: number;
  completedBy?: number;
  author?: string;
  traditions?: string[];
}

const RecommendedRow = () => {
  const { user } = useAuth();
  const [recommendedItems, setRecommendedItems] = useState<RecommendedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get user profile to understand their preferences
        const profileData = await api.getProfile();
        const userProfile = profileData.profile;
        
        // Get user's practice history
        const userSadhanas = await api.getUserSadhanas();
        
        // Generate recommendations based on user data
        const recommendations = generateRecommendations(userProfile, userSadhanas);
        setRecommendedItems(recommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        // Fallback to default recommendations
        setRecommendedItems(generateDefaultRecommendations());
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [user]);

  const generateRecommendations = (profile: any, userSadhanas: any): RecommendedItem[] => {
    const recommendations: RecommendedItem[] = [];
    
    // Get user's favorite deity and traditions from profile
    const favoriteDeity = profile?.favorite_deity;
    const traditions = profile?.traditions || [];
    
    // Get user's completed sadhanas
    const completedSadhanas = userSadhanas?.sadhanas?.filter((s: any) => s.completed) || [];
    
    // Recommend based on favorite deity
    if (favoriteDeity) {
      const deitySadhanas = storeSadhanas.filter(s => 
        s.deity?.toLowerCase().includes(favoriteDeity.toLowerCase()) ||
        s.title.toLowerCase().includes(favoriteDeity.toLowerCase())
      );
      
      deitySadhanas.slice(0, 2).forEach(sadhana => {
        recommendations.push({
          id: sadhana.id,
          title: sadhana.title,
          description: sadhana.description,
          type: 'sadhana',
          difficulty: sadhana.difficulty,
          duration: sadhana.duration,
          price: sadhana.price,
          rating: sadhana.rating,
          completedBy: sadhana.completedBy
        });
      });
    }
    
    // Recommend based on user's practice history
    if (completedSadhanas.length > 0) {
      // Find genres the user has engaged with
      const userGenres = new Set(completedSadhanas.map((s: any) => s.genre?.id));
      
      // Recommend similar sadhanas from the same genres
      storeSadhanas.forEach(sadhana => {
        if (userGenres.has(sadhana.genre.id) && 
            !recommendations.some(r => r.id === sadhana.id) &&
            recommendations.length < 4) {
          recommendations.push({
            id: sadhana.id,
            title: sadhana.title,
            description: sadhana.description,
            type: 'sadhana',
            difficulty: sadhana.difficulty,
            duration: sadhana.duration,
            price: sadhana.price,
            rating: sadhana.rating,
            completedBy: sadhana.completedBy
          });
        }
      });
    }
    
    // If we don't have enough recommendations, add some popular ones
    if (recommendations.length < 4) {
      const popularSadhanas = [...storeSadhanas]
        .sort((a, b) => (b.completedBy || 0) - (a.completedBy || 0))
        .slice(0, 4);
        
      popularSadhanas.forEach(sadhana => {
        if (!recommendations.some(r => r.id === sadhana.id) &&
            recommendations.length < 4) {
          recommendations.push({
            id: sadhana.id,
            title: sadhana.title,
            description: sadhana.description,
            type: 'sadhana',
            difficulty: sadhana.difficulty,
            duration: sadhana.duration,
            price: sadhana.price,
            rating: sadhana.rating,
            completedBy: sadhana.completedBy
          });
        }
      });
    }
    
    return recommendations;
  };

  const generateDefaultRecommendations = (): RecommendedItem[] => {
    // Return some default recommendations for new users
    return [
      {
        id: 'meditation-basics',
        title: '21-Day Mindful Awakening',
        description: 'Begin your meditation journey with gentle daily practices',
        type: 'sadhana',
        difficulty: 'beginner',
        duration: 21,
        price: 0,
        rating: 4.8,
        completedBy: 1247
      },
      {
        id: 'surya-namaskara',
        title: '21-Day Sun Salutation',
        description: 'Energize your body and spirit with solar practices',
        type: 'sadhana',
        difficulty: 'beginner',
        duration: 21,
        price: 0,
        rating: 4.7,
        completedBy: 2143
      },
      {
        id: 'krishna-bhakti',
        title: '49-Day Krishna Bhakti',
        description: 'Immerse in divine love through Krishna consciousness',
        type: 'sadhana',
        difficulty: 'beginner',
        duration: 49,
        price: 15,
        rating: 4.9,
        completedBy: 1034
      },
      {
        id: 'divine-mother',
        title: '21-Day Divine Mother Worship',
        description: 'Connect with the nurturing aspect of the Divine',
        type: 'sadhana',
        difficulty: 'beginner',
        duration: 21,
        price: 10,
        rating: 4.8,
        completedBy: 567
      }
    ];
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
          Recommended For You
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="min-w-[280px] animate-pulse border border-primary/20 bg-gradient-to-b from-primary/10 via-primary/5 to-primary/10">
              <CardContent className="p-4">
                <div className="h-4 bg-primary/20 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-primary/10 rounded w-full mb-2"></div>
                <div className="h-3 bg-primary/10 rounded w-5/6 mb-4"></div>
                <div className="h-8 bg-primary/20 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
        Recommended For You
      </h2>
      <div className="flex space-x-5 overflow-x-auto pb-4">
        {recommendedItems.map((item) => (
          <Card key={item.id} className="min-w-[280px] flex-shrink-0 border border-primary/20 bg-gradient-to-b from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 rounded-xl">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg line-clamp-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">{item.title}</h3>
                {item.type === 'sadhana' && item.price === 0 && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Free
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {item.type === 'sadhana' && item.difficulty && (
                  <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30">
                    {item.difficulty}
                  </Badge>
                )}
                {item.type === 'sadhana' && item.duration && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.duration} days
                  </div>
                )}
                {item.type === 'sadhana' && item.rating && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
                    {item.rating}
                  </div>
                )}
                {item.type === 'book' && item.author && (
                  <div className="text-xs text-muted-foreground">
                    by {item.author}
                  </div>
                )}
              </div>
              
              <Button size="sm" className="w-full bg-gradient-to-r from-primary/30 to-secondary/30 border border-primary/30 hover:from-primary/40 hover:to-secondary/40 transition-all duration-300">
                <BookOpen className="h-4 w-4 mr-2" />
                {item.type === 'sadhana' ? 'View Practice' : 'Read Book'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendedRow;