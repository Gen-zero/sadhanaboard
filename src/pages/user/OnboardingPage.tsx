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
  ChevronUp,
  Sparkles,
  Crown,
  Gem,
  Clock
} from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuth } from '@/lib/auth-context';
import { DEITY_OPTIONS } from '@/data/deityPreferences';
import { ENERGY_LEVEL_QUESTIONS, calculateEnergyLevel } from '@/data/energyLevelQuestions';
import { GlassMorphismContainer, SacredCircuitPattern, PulsingOMSymbol } from '@/components/design/SadhanaDesignComponents';

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
  <div className="flex items-center justify-center space-x-3 mb-8 relative">
    {/* Background track */}
    <div className="absolute h-1 bg-gray-700 rounded-full w-full max-w-md z-0"></div>
    <div 
      className="absolute h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full z-10 transition-all duration-500 ease-out"
      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
    ></div>
    
    {Array.from({ length: totalSteps }, (_, i) => (
      <div key={i} className="relative z-20 flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
            i + 1 <= currentStep 
              ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 border-purple-400 scale-110 shadow-lg shadow-purple-500/30' 
              : 'bg-gray-800 border-gray-600'
          }`}
        >
          {i + 1 < currentStep ? (
            <Sparkles className="w-4 h-4 text-white" />
          ) : (
            <span className="text-xs font-bold text-white">{i + 1}</span>
          )}
        </div>
        <div className="mt-2 text-xs font-medium text-center text-gray-400">
          Step {i + 1}
        </div>
      </div>
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
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 mb-6 shadow-lg shadow-purple-500/30 animate-pulse-slow relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 blur-xl opacity-30 animate-pulse"></div>
                <User className="w-10 h-10 text-white relative z-10" />
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-500 mb-4 tracking-tight">
                Welcome to Your Sacred Journey
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                Let's begin by getting to know you better
              </p>
              <div className="flex justify-center">
                <PulsingOMSymbol size="text-2xl" />
              </div>
            </div>

            <GlassMorphismContainer className="border border-purple-500/20 p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-lg font-medium flex items-center gap-2 mb-2">
                    <Gem className="w-5 h-5 text-purple-400" />
                    What should we call you? *
                  </Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={onboardingData.name}
                      onChange={(e) => updateData('name', e.target.value)}
                      className="pl-12 bg-background/50 border-purple-500/30 focus:border-purple-500/70 text-lg text-foreground rounded-xl h-14 transition-all duration-300 focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>
                  {localErrors.name && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {localErrors.name}
                    </p>
                  )}
                </div>
              </div>
            </GlassMorphismContainer>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 mb-6 shadow-lg shadow-blue-500/30 animate-pulse-slow relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-30 animate-pulse"></div>
                <Calendar className="w-10 h-10 text-white relative z-10" />
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-300 to-blue-500 mb-4 tracking-tight">
                Birth Details (Optional)
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                These details help personalize your spiritual experience
              </p>
              <div className="flex justify-center">
                <PulsingOMSymbol size="text-2xl" />
              </div>
            </div>

            <GlassMorphismContainer className="border border-blue-500/20 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="dateOfBirth" className="text-lg font-medium flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Date of Birth
                  </Label>
                  <div className="relative mt-2">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={onboardingData.dateOfBirth || ''}
                      onChange={(e) => updateData('dateOfBirth', e.target.value)}
                      className="pl-12 bg-background/50 border-blue-500/30 focus:border-blue-500/70 text-foreground rounded-xl h-14 transition-all duration-300 focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  {localErrors.dateOfBirth && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {localErrors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="timeOfBirth" className="text-lg font-medium flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Time of Birth (24hr)
                  </Label>
                  <div className="relative mt-2">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                    <Input
                      id="timeOfBirth"
                      type="time"
                      value={onboardingData.timeOfBirth || ''}
                      onChange={(e) => updateData('timeOfBirth', e.target.value)}
                      className="pl-12 bg-background/50 border-blue-500/30 focus:border-blue-500/70 text-foreground rounded-xl h-14 transition-all duration-300 focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  {localErrors.timeOfBirth && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {localErrors.timeOfBirth}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="birthPlace" className="text-lg font-medium flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  Place of Birth
                </Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <Input
                    id="birthPlace"
                    placeholder="City, State/Country"
                    value={onboardingData.placeOfBirth || ''}
                    onChange={(e) => updateData('placeOfBirth', e.target.value)}
                    className="pl-12 bg-background/50 border-blue-500/30 focus:border-blue-500/70 text-foreground rounded-xl h-14 transition-all duration-300 focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>
            </GlassMorphismContainer>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 mb-6 shadow-lg shadow-amber-500/30 animate-pulse-slow relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 blur-xl opacity-30 animate-pulse"></div>
                <Users className="w-10 h-10 text-white relative z-10" />
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 mb-4 tracking-tight">
                Divine Connection
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                Which deity resonates most with your spiritual path?
              </p>
              <div className="flex justify-center">
                <PulsingOMSymbol size="text-2xl" />
              </div>
            </div>

            <GlassMorphismContainer className="border border-amber-500/20 p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {DEITIES.map((deity) => (
                  <div
                    key={deity.value}
                    onClick={() => {
                      setOtherDeity('');
                      updateData('favoriteDeity', deity.value);
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      onboardingData.favoriteDeity === deity.value
                        ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 to-orange-500/20 scale-105 shadow-lg shadow-amber-500/20'
                        : 'border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10'
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
                    <div className="text-3xl mb-2 flex justify-center">{deity.emoji}</div>
                    <div className="text-sm font-medium text-center">{deity.label}</div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Label htmlFor="otherDeity" className="text-lg font-medium flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
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
                  className="mt-2 bg-background/50 border-amber-500/30 focus:border-amber-500/70 text-foreground rounded-xl h-14 transition-all duration-300 focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </GlassMorphismContainer>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 mb-6 shadow-lg shadow-green-500/30 animate-pulse-slow relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 blur-xl opacity-30 animate-pulse"></div>
                <BookOpen className="w-10 h-10 text-white relative z-10" />
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 mb-4 tracking-tight">
                Profile Information
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                Share some details about your spiritual background
              </p>
              <div className="flex justify-center">
                <PulsingOMSymbol size="text-2xl" />
              </div>
            </div>

            <GlassMorphismContainer className="border border-green-500/20 p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="gotra" className="text-lg font-medium flex items-center gap-2 mb-2">
                    <Flower2 className="w-5 h-5 text-green-400" />
                    Gotra *
                  </Label>
                  <Input
                    id="gotra"
                    placeholder="Enter your gotra"
                    value={onboardingData.gotra || ''}
                    onChange={(e) => updateData('gotra', e.target.value)}
                    className="mt-2 bg-background/50 border-green-500/30 focus:border-green-500/70 text-foreground rounded-xl h-14 transition-all duration-300 focus:ring-2 focus:ring-green-500/30"
                  />
                  {localErrors.gotra && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {localErrors.gotra}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="varna" className="text-lg font-medium flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-green-400" />
                    Varna *
                  </Label>
                  <Select value={onboardingData.varna || ''} onValueChange={(value) => updateData('varna', value)}>
                    <SelectTrigger className="mt-2 bg-background/50 border-green-500/30 focus:border-green-500/70 rounded-xl h-14 transition-all duration-300 focus:ring-2 focus:ring-green-500/30">
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
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {localErrors.varna}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3 pt-2 pl-2">
                  <input
                    type="checkbox"
                    id="isDikshit"
                    checked={isDikshit}
                    onChange={(e) => setIsDikshit(e.target.checked)}
                    className="h-5 w-5 text-green-500 border-green-500/30 rounded focus:ring-green-500/50 focus:ring-2 cursor-pointer"
                  />
                  <Label htmlFor="isDikshit" className="text-lg flex items-center gap-2">
                    <Sword className="w-5 h-5 text-green-400" />
                    I am Dikshit (formally initiated)
                  </Label>
                </div>

                {isDikshit && (
                  <div>
                    <Label htmlFor="sampradaya" className="text-lg font-medium flex items-center gap-2 mb-2">
                      <Mountain className="w-5 h-5 text-green-400" />
                      Sampradaya *
                    </Label>
                    <Select value={onboardingData.sampradaya || ''} onValueChange={(value) => updateData('sampradaya', value)}>
                      <SelectTrigger className="mt-2 bg-background/50 border-green-500/30 focus:border-green-500/70 rounded-xl h-14 transition-all duration-300 focus:ring-2 focus:ring-green-500/30">
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
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {localErrors.sampradaya}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="location" className="text-lg font-medium flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-green-400" />
                    Location
                  </Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
                    <Input
                      id="location"
                      placeholder="City, State/Country"
                      value={onboardingData.location || ''}
                      onChange={(e) => updateData('location', e.target.value)}
                      className="pl-12 bg-background/50 border-green-500/30 focus:border-green-500/70 text-foreground rounded-xl h-14 transition-all duration-300 focus:ring-2 focus:ring-green-500/30"
                    />
                  </div>
                </div>
              </div>
            </GlassMorphismContainer>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 mx-auto shadow-lg shadow-indigo-500/30 animate-pulse-slow relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 blur-xl opacity-30 animate-pulse"></div>
                <User className="w-10 h-10 text-white relative z-10" />
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-500 mb-4 tracking-tight">
                About You
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                Share more about your spiritual journey and experience level
              </p>
              <div className="flex justify-center">
                <PulsingOMSymbol size="text-2xl" />
              </div>
            </div>

            <GlassMorphismContainer className="border border-indigo-500/20 p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="bio" className="text-lg font-medium flex items-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-indigo-400" />
                    Spiritual Journey (Bio)
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your spiritual path, interests, and what brings you here..."
                    value={onboardingData.bio || ''}
                    onChange={(e) => updateData('bio', e.target.value)}
                    className="mt-2 bg-background/50 border-indigo-500/30 focus:border-indigo-500/70 min-h-[150px] rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <Label htmlFor="experience_level" className="text-lg font-medium flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-indigo-400" />
                    Experience Level *
                  </Label>
                  <Select value={onboardingData.experience_level || ''} onValueChange={(value) => updateData('experience_level', value)}>
                    <SelectTrigger className="mt-2 bg-background/50 border-indigo-500/30 focus:border-indigo-500/70 rounded-xl h-14 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/30">
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
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {localErrors.experience_level}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location" className="text-lg font-medium flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-indigo-400" />
                    Current Location
                  </Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
                    <Input
                      id="location"
                      placeholder="City, State/Country"
                      value={onboardingData.location || ''}
                      onChange={(e) => updateData('location', e.target.value)}
                      className="pl-12 bg-background/50 border-indigo-500/30 focus:border-indigo-500/70 text-foreground rounded-xl h-14 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>
              </div>
            </GlassMorphismContainer>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 mb-6 mx-auto shadow-lg shadow-pink-500/30 animate-pulse-slow relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 blur-xl opacity-30 animate-pulse"></div>
                <Heart className="w-10 h-10 text-white relative z-10" />
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 mb-4 tracking-tight">
                Divine Preferences
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                Select your top 5 deity forms in order of preference (1 = highest)
              </p>
              <div className="flex justify-center">
                <PulsingOMSymbol size="text-2xl" />
              </div>
            </div>

            <GlassMorphismContainer className="border border-pink-500/20 p-6">
              <div className="space-y-4">
                {DEITY_OPTIONS.map((deity) => {
                  const preference = onboardingData.deityPreferences.find(p => p.deityId === deity.id);
                  return (
                    <div key={deity.id} className="flex items-center p-4 rounded-xl border border-pink-500/20 bg-background/50 hover:bg-gradient-to-r from-pink-500/5 to-rose-500/5 transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-pink-500/10">
                      <div className="flex items-center w-full">
                        <div className="flex items-center space-x-4 flex-1">
                          <span className="text-3xl">{deity.emoji}</span>
                          <div>
                            <div className="font-medium text-lg">{deity.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {deity.attributes.join(', ')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Label htmlFor={`priority-${deity.id}`} className="text-base flex items-center gap-2">
                            <Crown className="w-4 h-4 text-pink-400" />
                            Priority:
                          </Label>
                          <Select 
                            value={preference ? preference.priority.toString() : ''} 
                            onValueChange={(value) => updateDeityPreference(deity.id, parseInt(value))}
                          >
                            <SelectTrigger className="w-24 rounded-xl border-pink-500/30 focus:border-pink-500/70 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30">
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
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {localErrors.deityPreferences}
                  </p>
                )}
              </div>
            </GlassMorphismContainer>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            key="step7"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 mb-6 mx-auto shadow-lg shadow-yellow-500/30 animate-pulse-slow relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 blur-xl opacity-30 animate-pulse"></div>
                <Zap className="w-10 h-10 text-white relative z-10" />
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-500 mb-4 tracking-tight">
                Energy Level Assessment
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                Answer these questions to understand your current energy balance (Sattva, Rajas, Tamas)
              </p>
              <div className="flex justify-center">
                <PulsingOMSymbol size="text-2xl" />
              </div>
            </div>

            <GlassMorphismContainer className="border border-yellow-500/20 p-6">
              <div className="space-y-6">
                {ENERGY_LEVEL_QUESTIONS.map((question, index) => {
                  const isExpanded = expandedQuestions[question.id];
                  const selectedAnswer = onboardingData.energyLevelAnswers[question.id];
                  
                  return (
                    <div key={question.id} className="border border-yellow-500/20 rounded-xl bg-background/50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
                      <div 
                        className="p-5 cursor-pointer flex justify-between items-center hover:bg-gradient-to-r from-yellow-500/5 to-orange-500/5 transition-all duration-300"
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
                        <div className="font-medium text-lg flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          {question.question}
                        </div>
                        {isExpanded ? <ChevronUp className="h-6 w-6 text-yellow-400" /> : <ChevronDown className="h-6 w-6 text-yellow-400" />}
                      </div>
                      
                      {isExpanded && (
                        <div className="p-5 pt-0 border-t border-yellow-500/20">
                          <div className="space-y-4 mt-4">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                onClick={() => updateEnergyLevelAnswer(question.id, optionIndex)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                                  selectedAnswer === optionIndex
                                    ? 'border-yellow-500 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 shadow-lg shadow-yellow-500/20'
                                    : 'border-yellow-500/30 hover:border-yellow-500/60 hover:bg-yellow-500/10'
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
                                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-300 ${
                                    selectedAnswer === optionIndex 
                                      ? 'border-yellow-500 bg-yellow-500' 
                                      : 'border-yellow-500/50'
                                  }`}>
                                    {selectedAnswer === optionIndex && (
                                      <div className="w-3 h-3 rounded-full bg-white"></div>
                                    )}
                                  </div>
                                  <span className="text-base">{option.text}</span>
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
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {localErrors.energyLevel}
                  </p>
                )}
              </div>
            </GlassMorphismContainer>
          </motion.div>
        );

      case 8:
        return (
          <motion.div
            key="step8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 mb-6 mx-auto shadow-lg shadow-violet-500/30 animate-pulse-slow relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 blur-xl opacity-30 animate-pulse"></div>
                <Flower2 className="w-10 h-10 text-white relative z-10" />
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-violet-500 mb-4 tracking-tight">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                You're all set to start your spiritual practice with SaadhanaBoard.
              </p>
              <div className="flex justify-center">
                <PulsingOMSymbol size="text-2xl" />
              </div>
            </div>

            <GlassMorphismContainer className="border border-violet-500/20 p-6">
              <div className="space-y-6">
                <p className="text-muted-foreground text-center mb-8">
                  Would you like a quick walkthrough of the features, or dive right in?
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleCompleteWithWalkthrough}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 px-8 py-6 text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-violet-500/30 flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Show Me Around
                  </Button>
                  <Button
                    onClick={handleComplete}
                    variant="outline"
                    className="border-violet-500/30 hover:bg-violet-500/10 px-8 py-6 text-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Start Practicing
                  </Button>
                </div>
                
                <div className="pt-8 flex justify-center">
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Skip for now
                  </Button>
                </div>
              </div>
            </GlassMorphismContainer>
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium background with sacred circuit pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <SacredCircuitPattern color="#8B5CF6" />
      </div>
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900/20 via-fuchsia-900/20 to-indigo-900/20 animate-pulse-slow"></div>
      
      <div className="w-full max-w-2xl relative z-10">
        <GlassMorphismContainer className="border border-purple-500/30 p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <Crown className="w-10 h-10 text-yellow-400" />
          </div>
          
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
                className="border-purple-500/30 hover:bg-purple-500/10 transition-all duration-300 hover:scale-105"
              >
                <ChevronDown className="w-4 h-4 mr-2 rotate-90" />
                Back
              </Button>
              <Button
                onClick={currentStep === 7 ? handleComplete : handleNext}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-300 hover:scale-105 flex items-center"
              >
                {currentStep === 7 ? 'Complete Setup' : 'Next'}
                <ChevronDown className="w-4 h-4 ml-2 -rotate-90" />
              </Button>
            </div>
          )}
        </GlassMorphismContainer>
      </div>
    </div>
  );
};

export default OnboardingPage;