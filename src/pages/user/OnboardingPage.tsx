import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  User, 
  MapPin, 
  Users, 
  BookOpen, 
  Sword, 
  Flower2, 
  Zap, 
  Mountain,
  Heart,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/lib/auth-context';
import { DEITY_OPTIONS } from '@/data/deityPreferences';
import { ENERGY_LEVEL_QUESTIONS, calculateEnergyLevel } from '@/data/energyLevelQuestions';

// Define the deities, varnas, and sampradayas directly in the component
const DEITIES = [
  { value: 'vishnu', label: 'Lord Vishnu', emoji: '🌀' },
  { value: 'krishna', label: 'Lord Krishna', emoji: '🪶' },
  { value: 'rama', label: 'Lord Rama', emoji: '🏹' },
  { value: 'ganesha', label: 'Lord Ganesha', emoji: '🐘' },
  { value: 'durga', label: 'Goddess Durga', emoji: '🦁' },
  { value: 'lakshmi', label: 'Goddess Lakshmi', emoji: '🪷' },
  { value: 'saraswati', label: 'Goddess Saraswati', emoji: '🎵' },
  { value: 'kali', label: 'Goddess Kali', emoji: '⚔️' },
  { value: 'parvati', label: 'Goddess Parvati', emoji: '🏔️' },
  { value: 'brahma', label: 'Lord Brahma', emoji: '🌸' },
  { value: 'other', label: 'Other', emoji: '✨' }
];

const VARNAS = [
  { value: 'brahmana', label: 'Brahmana 🙏' },
  { value: 'kshatriya', label: 'Kshatriya ⚔️' },
  { value: 'vaishya', label: 'Vaishya व्यापार' },
  { value: 'shudra', label: 'Shudra 🛠️' },
  { value: 'outcaste', label: 'Outcaste' }
];

const SAMPRADAYAS = [
  { value: 'shakta', label: 'Shakta' },
  { value: 'shaiva', label: 'Shaiva' },
  { value: 'smarta', label: 'Smarta' },
  { value: 'vaishnava', label: 'Vaishnava' },
  { value: 'buddhist', label: 'Buddhist / Zen' },
  { value: 'jain', label: 'Jain' }
];

const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex items-center justify-center space-x-2 mb-8">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div
        key={i}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          i + 1 <= currentStep 
            ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 scale-110' 
            : 'bg-gray-700'
        }`}
      />
    ))}
  </div>
);

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner (Just starting my spiritual journey)' },
  { value: 'intermediate', label: 'Intermediate (Some experience with practices)' },
  { value: 'advanced', label: 'Advanced (Regular practitioner)' },
  { value: 'master', label: 'Master (Deep knowledge and experience)' }
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { 
    onboardingData, 
    updateData, 
    updateDeityPreference,
    updateEnergyLevelAnswer,
    currentStep, 
    nextStep, 
    prevStep, 
    completeOnboarding, 
    skipOnboarding,
    isLoading 
  } = useOnboarding();
  
  const { refreshOnboardingStatus } = useAuth();

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [isDikshit, setIsDikshit] = useState(false);
  const [otherDeity, setOtherDeity] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!onboardingData.name.trim()) {
          errors.name = 'Name is required';
        }
        break;
      case 2:
        // Birth details are optional but validate format if provided
        if (onboardingData.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(onboardingData.dateOfBirth)) {
          errors.dateOfBirth = 'Please enter a valid date';
        }
        if (onboardingData.timeOfBirth && !/^\d{2}:\d{2}$/.test(onboardingData.timeOfBirth)) {
          errors.timeOfBirth = 'Please enter a valid time (HH:MM)';
        }
        break;
      case 3:
        // Deity selection is optional
        break;
      case 4:
        // Profile information step
        if (!onboardingData.gotra?.trim()) {
          errors.gotra = 'Gotra is required';
        }
        if (!onboardingData.varna) {
          errors.varna = 'Varna selection is required';
        }
        if (isDikshit && !onboardingData.sampradaya) {
          errors.sampradaya = 'Sampradaya selection is required for Dikshit';
        }
        break;
      case 5:
        // Additional profile information step
        if (!onboardingData.experience_level) {
          errors.experience_level = 'Experience level is required';
        }
        break;
      case 6:
        // Deity preferences step - at least one preference required
        if (onboardingData.deityPreferences.length === 0) {
          errors.deityPreferences = 'Please select at least one deity';
        }
        break;
      case 7:
        // Energy level assessment step - all questions required
        ENERGY_LEVEL_QUESTIONS.forEach(question => {
          if (onboardingData.energyLevelAnswers[question.id] === undefined) {
            errors.energyLevel = 'Please answer all questions';
          }
        });
        break;
    }
    
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handleComplete = async () => {
    if (validateStep(currentStep)) {
      // Calculate energy level before completing onboarding
      const energyLevelResult = calculateEnergyLevel(onboardingData.energyLevelAnswers);
      updateData('energyLevelResult', energyLevelResult);
      
      const { error, showWalkthrough } = await completeOnboarding(false);
      if (!error) {
        // Refresh onboarding status to ensure auth context is updated
        await refreshOnboardingStatus();
        navigate('/sadhana');
      }
    }
  };

  const handleCompleteWithWalkthrough = async () => {
    if (validateStep(currentStep)) {
      // Calculate energy level before completing onboarding
      const energyLevelResult = calculateEnergyLevel(onboardingData.energyLevelAnswers);
      updateData('energyLevelResult', energyLevelResult);
      
      const { error } = await completeOnboarding(true);
      if (!error) {
        // Refresh onboarding status to ensure auth context is updated
        await refreshOnboardingStatus();
        navigate('/walkthrough');
      }
    }
  };

  const handleSkip = async () => {
    const { error } = await skipOnboarding();
    if (!error) {
      // Refresh onboarding status to ensure auth context is updated
      await refreshOnboardingStatus();
      navigate('/sadhana');
    }
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 mb-2">
                Welcome to your spiritual journey
              </h2>
              <p className="text-muted-foreground">
                Let's start by getting to know you better
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-base font-medium">
                  What should we call you? *
                </Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={onboardingData.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    className="pl-10 bg-background/50 border-purple-500/20 focus:border-purple-500/50 text-lg"
                  />
                </div>
                {localErrors.name && (
                  <p className="text-red-400 text-sm mt-1">{localErrors.name}</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-400 to-blue-600 mb-2">
                Birth Details (Optional)
              </h2>
              <p className="text-muted-foreground">
                These details help personalize your spiritual experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="dateOfBirth" className="text-base font-medium">
                  Date of Birth
                </Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={onboardingData.dateOfBirth || ''}
                    onChange={(e) => updateData('dateOfBirth', e.target.value)}
                    className="pl-10 bg-background/50 border-blue-500/20 focus:border-blue-500/50"
                  />
                </div>
                {localErrors.dateOfBirth && (
                  <p className="text-red-400 text-sm mt-1">{localErrors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <Label htmlFor="timeOfBirth" className="text-base font-medium">
                  Time of Birth (24hr)
                </Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="timeOfBirth"
                    type="time"
                    value={onboardingData.timeOfBirth || ''}
                    onChange={(e) => updateData('timeOfBirth', e.target.value)}
                    className="pl-10 bg-background/50 border-blue-500/20 focus:border-blue-500/50"
                  />
                </div>
                {localErrors.timeOfBirth && (
                  <p className="text-red-400 text-sm mt-1">{localErrors.timeOfBirth}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="birthPlace" className="text-base font-medium">
                Place of Birth
              </Label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="birthPlace"
                  placeholder="City, State/Country"
                  value={onboardingData.placeOfBirth || ''}
                  onChange={(e) => updateData('placeOfBirth', e.target.value)}
                  className="pl-10 bg-background/50 border-blue-500/20 focus:border-blue-500/50"
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 mb-2">
                Divine Connection
              </h2>
              <p className="text-muted-foreground">
                Which deity resonates most with your spiritual path?
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {DEITIES.map((deity) => (
                <div
                  key={deity.value}
                  onClick={() => {
                    setOtherDeity('');
                    updateData('favoriteDeity', deity.value);
                  }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    onboardingData.favoriteDeity === deity.value
                      ? 'border-amber-500 bg-amber-500/10 scale-105'
                      : 'border-border hover:border-amber-500/50 hover:bg-amber-500/5'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOtherDeity('');
                      updateData('favoriteDeity', deity.value);
                    }
                  }}
                >
                  <div className="text-2xl mb-2">{deity.emoji}</div>
                  <div className="text-sm font-medium text-center">{deity.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Label htmlFor="otherDeity" className="text-base font-medium">
                Other Deity or Spiritual Focus
              </Label>
              <Input
                id="otherDeity"
                placeholder="If your deity isn't listed above..."
                value={otherDeity}
                onChange={(e) => {
                  setOtherDeity(e.target.value);
                  updateData('favoriteDeity', e.target.value);
                }}
                className="mt-2 bg-background/50 border-amber-500/20 focus:border-amber-500/50"
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 mb-2">
                Profile Information
              </h2>
              <p className="text-muted-foreground">
                Share some details about your spiritual background
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="gotra" className="text-base font-medium">
                  Gotra *
                </Label>
                <Input
                  id="gotra"
                  placeholder="Enter your gotra"
                  value={onboardingData.gotra || ''}
                  onChange={(e) => updateData('gotra', e.target.value)}
                  className="mt-2 bg-background/50 border-green-500/20 focus:border-green-500/50"
                />
                {localErrors.gotra && (
                  <p className="text-red-400 text-sm mt-1">{localErrors.gotra}</p>
                )}
              </div>

              <div>
                <Label htmlFor="varna" className="text-base font-medium">
                  Varna *
                </Label>
                <Select value={onboardingData.varna || ''} onValueChange={(value) => updateData('varna', value)}>
                  <SelectTrigger className="mt-2 bg-background/50 border-green-500/20 focus:border-green-500/50">
                    <SelectValue placeholder="Select your varna" />
                  </SelectTrigger>
                  <SelectContent>
                    {VARNAS.map((varna) => (
                      <SelectItem key={varna.value} value={varna.value}>
                        {varna.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {localErrors.varna && (
                  <p className="text-red-400 text-sm mt-1">{localErrors.varna}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isDikshit"
                  checked={isDikshit}
                  onChange={(e) => setIsDikshit(e.target.checked)}
                  className="h-4 w-4 text-green-500 border-green-500/20 rounded focus:ring-green-500"
                />
                <Label htmlFor="isDikshit" className="text-base">
                  I am Dikshit (formally initiated)
                </Label>
              </div>

              {isDikshit && (
                <div>
                  <Label htmlFor="sampradaya" className="text-base font-medium">
                    Sampradaya *
                  </Label>
                  <Select value={onboardingData.sampradaya || ''} onValueChange={(value) => updateData('sampradaya', value)}>
                    <SelectTrigger className="mt-2 bg-background/50 border-green-500/20 focus:border-green-500/50">
                      <SelectValue placeholder="Select your sampradaya" />
                    </SelectTrigger>
                    <SelectContent>
                      {SAMPRADAYAS.map((sampradaya) => (
                        <SelectItem key={sampradaya.value} value={sampradaya.value}>
                          {sampradaya.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {localErrors.sampradaya && (
                    <p className="text-red-400 text-sm mt-1">{localErrors.sampradaya}</p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="location" className="text-base font-medium">
                  Location
                </Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City, State/Country"
                    value={onboardingData.location || ''}
                    onChange={(e) => updateData('location', e.target.value)}
                    className="pl-10 bg-background/50 border-green-500/20 focus:border-green-500/50"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mb-4 mx-auto">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-600 mb-2">
                About You
              </h2>
              <p className="text-muted-foreground mb-6">
                Share more about your spiritual journey and experience level
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="bio" className="text-base font-medium">
                  Spiritual Journey (Bio)
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your spiritual path, interests, and what brings you here..."
                  value={onboardingData.bio || ''}
                  onChange={(e) => updateData('bio', e.target.value)}
                  className="mt-2 bg-background/50 border-indigo-500/20 focus:border-indigo-500/50 min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="experience_level" className="text-base font-medium">
                  Experience Level *
                </Label>
                <Select value={onboardingData.experience_level || ''} onValueChange={(value) => updateData('experience_level', value)}>
                  <SelectTrigger className="mt-2 bg-background/50 border-indigo-500/20 focus:border-indigo-500/50">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {localErrors.experience_level && (
                  <p className="text-red-400 text-sm mt-1">{localErrors.experience_level}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location" className="text-base font-medium">
                  Current Location
                </Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City, State/Country"
                    value={onboardingData.location || ''}
                    onChange={(e) => updateData('location', e.target.value)}
                    className="pl-10 bg-background/50 border-indigo-500/20 focus:border-indigo-500/50"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 mb-4 mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 mb-2">
                Divine Preferences
              </h2>
              <p className="text-muted-foreground mb-6">
                Select your top 5 deity forms in order of preference (1 = highest)
              </p>
            </div>

            <div className="space-y-4">
              {DEITY_OPTIONS.map((deity) => {
                const preference = onboardingData.deityPreferences.find(p => p.deityId === deity.id);
                return (
                  <div key={deity.id} className="flex items-center p-4 rounded-lg border border-border bg-background/50 hover:bg-background/70 transition-colors">
                    <div className="flex items-center w-full">
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-2xl">{deity.emoji}</span>
                        <div>
                          <div className="font-medium">{deity.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {deity.attributes.join(', ')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`priority-${deity.id}`} className="text-sm">
                          Priority:
                        </Label>
                        <Select 
                          value={preference ? preference.priority.toString() : ''} 
                          onValueChange={(value) => updateDeityPreference(deity.id, parseInt(value))}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                );
              })}
              {localErrors.deityPreferences && (
                <p className="text-red-400 text-sm">{localErrors.deityPreferences}</p>
              )}
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            key="step7"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 mb-4 mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-600 mb-2">
                Energy Level Assessment
              </h2>
              <p className="text-muted-foreground mb-6">
                Answer these questions to understand your current energy balance (Sattva, Rajas, Tamas)
              </p>
            </div>

            <div className="space-y-6">
              {ENERGY_LEVEL_QUESTIONS.map((question, index) => {
                const isExpanded = expandedQuestions[question.id];
                const selectedAnswer = onboardingData.energyLevelAnswers[question.id];
                
                return (
                  <div key={question.id} className="border border-border rounded-lg bg-background/50 overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer flex justify-between items-center hover:bg-background/70 transition-colors"
                      onClick={() => toggleQuestion(question.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleQuestion(question.id);
                        }
                      }}
                    >
                      <div className="font-medium">
                        {index + 1}. {question.question}
                      </div>
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                    
                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-border">
                        <div className="space-y-3 mt-3">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              onClick={() => updateEnergyLevelAnswer(question.id, optionIndex)}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedAnswer === optionIndex
                                  ? 'border-yellow-500 bg-yellow-500/10'
                                  : 'border-border hover:border-yellow-500/50 hover:bg-yellow-500/5'
                              }`}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  updateEnergyLevelAnswer(question.id, optionIndex);
                                }
                              }}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                                  selectedAnswer === optionIndex 
                                    ? 'border-yellow-500 bg-yellow-500' 
                                    : 'border-muted-foreground'
                                }`}>
                                  {selectedAnswer === optionIndex && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                  )}
                                </div>
                                <span>{option.text}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {localErrors.energyLevel && (
                <p className="text-red-400 text-sm">{localErrors.energyLevel}</p>
              )}
            </div>
          </motion.div>
        );

      case 8:
        return (
          <motion.div
            key="step8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 mb-4 mx-auto">
              <Flower2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 mb-2">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-muted-foreground mb-8">
              You're all set to start your spiritual practice with SaadhanaBoard. 
              Would you like a quick walkthrough of the features, or dive right in?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleCompleteWithWalkthrough}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 px-8 py-6 text-lg"
              >
                Show Me Around
              </Button>
              <Button
                onClick={handleComplete}
                variant="outline"
                className="border-purple-500/30 hover:bg-purple-500/10 px-8 py-6 text-lg"
              >
                Start Practicing
              </Button>
            </div>
            
            <div className="pt-8">
              <Button
                onClick={handleSkip}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="backdrop-blur-sm bg-background/70 rounded-2xl border border-purple-500/20 p-8 shadow-2xl">
          <StepIndicator currentStep={currentStep} totalSteps={8} />
          
          <div className="mb-8">
            {renderStep()}
          </div>
          
          {currentStep < 8 && (
            <div className="flex justify-between pt-6 border-t border-border">
              <Button
                onClick={prevStep}
                variant="outline"
                disabled={currentStep === 1}
                className="border-purple-500/30 hover:bg-purple-500/10"
              >
                Back
              </Button>
              <Button
                onClick={currentStep === 7 ? handleComplete : handleNext}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
              >
                {currentStep === 7 ? 'Complete Setup' : 'Next'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;