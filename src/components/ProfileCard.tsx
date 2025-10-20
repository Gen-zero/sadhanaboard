import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Users, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  PawPrint, 
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useProfileData } from '@/hooks/useProfileData';
import api from '@/services/api';

const VARNAS = {
  'brahmana': 'Brahmana 🙏',
  'kshatriya': 'Kshatriya ⚔️',
  'vaishya': 'Vaishya व्यापार',
  'shudra': 'Shudra 🛠️',
  'outcaste': 'Outcaste'
};

const SAMPRADAYAS = {
  'shakta': 'Shakta',
  'shaiva': 'Shaiva',
  'smarta': 'Smarta',
  'vaishnava': 'Vaishnava',
  'buddhist': 'Buddhist / Zen',
  'jain': 'Jain'
};

const ProfileCard = () => {
  const { profile } = useProfileData();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const data = await api.getProfile();
        setProfileData(data.profile);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="animate-pulse rounded-full bg-purple-500/20 w-6 h-6" />
            <div className="animate-pulse h-6 bg-purple-500/20 rounded w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="animate-pulse h-4 bg-purple-500/20 rounded w-full" />
            <div className="animate-pulse h-4 bg-purple-500/20 rounded w-3/4" />
            <div className="animate-pulse h-4 bg-purple-500/20 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profileData) return null;

  const growthLevel = Math.floor(Math.random() * 10) + 1; // Placeholder for actual growth level
  const pet = "🐶"; // Placeholder for actual pet

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20 hover-lift">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-500" />
              <span>Profile</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setExpanded(!expanded)}
              className="h-8 w-8 p-0"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full w-12 h-12 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-5 h-5 border-2 border-background"></div>
            </div>
            <div>
              <h3 className="font-semibold">{profileData.display_name}</h3>
              <p className="text-sm text-muted-foreground">Seeker</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {profileData.varna && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="text-sm">{VARNAS[profileData.varna as keyof typeof VARNAS] || profileData.varna}</span>
              </div>
            )}

            {profileData.favorite_deity && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-fuchsia-500" />
                <span className="text-sm">{profileData.favorite_deity}</span>
              </div>
            )}

            {profileData.gotra && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                <span className="text-sm">{profileData.gotra}</span>
              </div>
            )}

            {(profileData.sampradaya || profileData.isDikshit) && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  {profileData.sampradaya 
                    ? `${profileData.isDikshit ? 'Dikshit' : 'Adikshit'} - ${SAMPRADAYAS[profileData.sampradaya as keyof typeof SAMPRADAYAS] || profileData.sampradaya}`
                    : profileData.isDikshit ? 'Dikshit' : 'Adikshit'}
                </span>
              </div>
            )}

            {profileData.date_of_birth && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-500" />
                <span className="text-sm">
                  {new Date(profileData.date_of_birth).toLocaleDateString()}
                </span>
              </div>
            )}

            {profileData.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                <span className="text-sm">{profileData.location}</span>
              </div>
            )}
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 pt-3 border-t border-purple-500/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm">Growth Level</span>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    Level {growthLevel} 📈
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PawPrint className="h-4 w-4 text-rose-500" />
                    <span className="text-sm">Spiritual Pet</span>
                  </div>
                  <Badge variant="secondary" className="bg-rose-500/20 text-rose-700 dark:text-rose-300">
                    {pet}
                  </Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;