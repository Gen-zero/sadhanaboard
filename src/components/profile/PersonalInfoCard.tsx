import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, User, Calendar, MapPin, Sparkles, Leaf, Mountain, Sun, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PersonalInfo {
  name: string;
  deity: string;
  varna: string;
  gotra: string;
  dikshitStatus: string;
  dob: string;
  location: string;
  intention: string;
  primaryPath: string;
  avatar_url: string;
}

interface PersonalInfoCardProps {
  info: PersonalInfo;
  onUpdate: (updates: Partial<PersonalInfo>) => void;
  className?: string;
}

const PersonalInfoCard = ({ info, onUpdate, className = '' }: PersonalInfoCardProps) => {
  const [showVedicDetails, setShowVedicDetails] = useState(false);

  return (
    <Card className={`backdrop-blur-sm bg-background/70 border border-primary/20 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <img 
            src={info.avatar_url || "/lovable-uploads/sadhanaboard_logo.png"} 
            alt={info.name} 
            className="w-16 h-16 rounded-full border-2 border-purple-500/30 object-cover"
          />
          <div>
            <h3 className="text-xl font-bold">{info.name}</h3>
            <p className="text-sm text-muted-foreground">Spiritual Seeker</p>
          </div>
        </div>
        
        {/* Universal Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-background/50 hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Deity
            </p>
            <p className="font-medium">{info.deity}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-background/50 hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Target className="h-3 w-3" />
              My Intention
            </p>
            <p className="font-medium">{info.intention || 'Not specified'}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-background/50 hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mountain className="h-3 w-3" />
              Primary Path
            </p>
            <p className="font-medium">{info.primaryPath || 'Not specified'}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-background/50 hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Date of Birth
            </p>
            <p className="font-medium">{info.dob}</p>
          </div>
          
          <div className="col-span-1 md:col-span-2 p-3 rounded-lg bg-background/50 hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Location
            </p>
            <p className="font-medium">{info.location}</p>
          </div>
        </div>

        {/* Vedic Details Toggle */}
        <div className="border-t border-border pt-4">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
            onClick={() => setShowVedicDetails(!showVedicDetails)}
          >
            <span className="font-medium">Vedic Details</span>
            {showVedicDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {showVedicDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
            >
              <div className="p-3 rounded-lg bg-background/50 hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mountain className="h-3 w-3" />
                  Varna
                </p>
                <p className="font-medium">{info.varna}</p>
              </div>
              
              <div className="p-3 rounded-lg bg-background/50 hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  Gotra
                </p>
                <p className="font-medium">{info.gotra}</p>
              </div>
              
              <div className="p-3 rounded-lg bg-background/50 hover:bg-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sun className="h-3 w-3" />
                  Dikshit Status
                </p>
                <p className="font-medium">{info.dikshitStatus}</p>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;