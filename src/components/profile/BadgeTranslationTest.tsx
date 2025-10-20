import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

// Hinglish translations for badge names
const badgeHinglishTranslations: Record<string, string> = {
  // Consistency & Devotion Badges
  'Nitya Sādhaka': 'Nitya Sādhaka (Regular Practitioner)',
  'Ananya Bhakta': 'Ananya Bhakta (Devoted Worshipper)',
  'Sankalpa Shakti': 'Sankalpa Shakti (Power of Intention)',
  'Aparājita': 'Aparājita (Unconquerable)',
  'Ekāgratā': 'Ekāgratā (Single-pointed Focus)',
  
  // Discipline & Tapasya Badges
  'Kālī’s Flame': 'Kālī\'s Flame (Intensity)',
  'Tapasvī': 'Tapasvī (Austere Practitioner)',
  'Mouna Ratna': 'Mouna Ratna (Silence Jewel)',
  'Agni Vratī': 'Agni Vratī (Fire Vow)',
  
  // Bhakti & Emotional Depth Badges
  'Viraha Jñānī': 'Viraha Jñānī (Knowledge of Separation)',
  'Prem Bhakta': 'Prem Bhakta (Loving Devotee)',
  'Rasa Sāgara': 'Rasa Sāgara (Ocean of Emotion)',
  'Śaraṇāgata': 'Śaraṇāgata (Surrendered)',
  
  // Knowledge & Wisdom Badges
  'Śāstra Vidyārthī': 'Śāstra Vidyārthī (Scripture Student)',
  'Mantra Master': 'Mantra Master (Chanting Expert)',
  'Jnana Jyoti': 'Jnana Jyoti (Light of Knowledge)',
  'Sādhana Scholar': 'Sādhana Scholar (Practice Scholar)',
  
  // Community & Service Badges
  'Seva Dhārī': 'Seva Dhārī (Service Holder)',
  'Anukampā': 'Anukampā (Compassion)',
  'Satsangī': 'Satsangī (Good Company)',
  'Guru Bhakta': 'Guru Bhakta (Devotee of Guru)',
  
  // Divine Realization & Milestone Badges
  'Antarjyoti': 'Antarjyoti (Inner Light)',
  'Mahā Siddha': 'Mahā Siddha (Great Accomplished)',
  'Kālī Anugraha': 'Kālī Anugraha (Kālī\'s Blessing)',
  'Mokṣa Margī': 'Mokṣa Margī (Path to Liberation)',
  
  // Hidden / Mystery Badges
  'Śūnya Dṛṣṭi': 'Śūnya Dṛṣṭi (Vision of Emptiness)',
  'Kālī\'s Whisper': 'Kālī\'s Whisper (Divine Communication)',
  'Gupta Bhakta': 'Gupta Bhakta (Secret Devotee)',
  'Ananta Loop': 'Ananta Loop (Infinite Cycle)',
  
  // Existing badges
  'First Steps': 'First Steps (Beginner)',
  'Dedicated Practitioner': 'Dedicated Practitioner (Committed)',
  'Spiritual Journey': 'Spiritual Journey (Path)',
  'Devoted Seeker': 'Devoted Seeker (Dedicated)',
  'Spiritual Master': 'Spiritual Master (Advanced)',
  'Week of Discipline': 'Week of Discipline (7 Days)',
  'Month of Dedication': 'Month of Dedication (30 Days)',
  'Centurion of Spirit': 'Centurion of Spirit (100 Days)',
  'Awakening': 'Awakening (Level 5)',
  'Illumination': 'Illumination (Level 10)',
  'Transcendence': 'Transcendence (Level 20)',
  'Meditation Master': 'Meditation Master (5 Sessions)',
  'Yoga Practitioner': 'Yoga Practitioner (5 Sessions)',
  'Mantra Devotee': 'Mantra Devotee (5 Sessions)',
  'Study Scholar': 'Study Scholar (5 Sessions)',
  'Devotion Follower': 'Devotion Follower (5 Sessions)'
};

const BadgeTranslationTest: React.FC = () => {
  const [showHinglish, setShowHinglish] = useState(false);
  
  // Test badge titles
  const testBadges = [
    'Nitya Sādhaka',
    'Kālī’s Flame',
    'Viraha Jñānī',
    'Śāstra Vidyārthī',
    'Seva Dhārī',
    'Antarjyoti',
    'Śūnya Dṛṣṭi',
    'First Steps',
    'Meditation Master'
  ];

  return (
    <Card className="m-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Badge Translation Test</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowHinglish(!showHinglish)}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            <span>{showHinglish ? 'Show English' : 'Show Hinglish'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testBadges.map((title, index) => {
            const displayName = showHinglish && badgeHinglishTranslations[title] 
              ? badgeHinglishTranslations[title] 
              : title;
            
            return (
              <div key={index} className="p-3 border rounded-lg">
                <div className="font-semibold">{displayName}</div>
                <div className="text-sm text-muted-foreground mt-1">{title}</div>
                {showHinglish && !badgeHinglishTranslations[title] && (
                  <div className="text-xs text-red-500 mt-1">Translation missing</div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgeTranslationTest;