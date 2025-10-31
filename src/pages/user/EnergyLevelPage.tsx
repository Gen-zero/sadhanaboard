import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Zap, 
  Leaf, 
  Flame, 
  Mountain,
  RotateCcw,
  BarChart3,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { ENERGY_LEVEL_QUESTIONS, calculateEnergyLevel, EnergyLevelResult } from '@/data/energyLevelQuestions';
import { useAuth } from '@/lib/auth-context';
import api from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useSettings } from '@/hooks/useSettings'; // Add this import

const EnergyLevelPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { settings } = useSettings(); // Add this hook
  
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<EnergyLevelResult | null>(null);
  const [previousResults, setPreviousResults] = useState<EnergyLevelResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Get current theme to adapt colors
  const currentTheme = settings?.appearance?.colorScheme || 'default';

  // Load previous results on component mount
  useEffect(() => {
    const loadPreviousResults = async () => {
      try {
        setIsLoading(true);
        const profileData = await api.getProfile();
        if (profileData.profile?.energy_level_history) {
          setPreviousResults(profileData.profile.energy_level_history);
        }
        if (profileData.profile?.energy_level_answers) {
          setAnswers(profileData.profile.energy_level_answers);
          // Calculate result if answers exist
          const calculatedResult = calculateEnergyLevel(profileData.profile.energy_level_answers);
          setResult(calculatedResult);
        }
      } catch (error) {
        console.error('Error loading previous results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreviousResults();
  }, []);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const allAnswered = ENERGY_LEVEL_QUESTIONS.every(q => answers[q.id] !== undefined);
    
    if (!allAnswered) {
      toast({
        title: "Incomplete Assessment",
        description: "Please answer all questions before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Calculate energy level
      const calculatedResult = calculateEnergyLevel(answers);
      setResult(calculatedResult);
      
      // Save to profile
      await api.updateProfile({
        energy_level_answers: answers,
        energy_level_result: calculatedResult
      });
      
      // Add to history
      setPreviousResults(prev => [calculatedResult, ...prev.slice(0, 4)]); // Keep only last 5 results
      
      toast({
        title: "Energy Level Calculated",
        description: "Your energy balance has been updated successfully."
      });
    } catch (error) {
      console.error('Error saving energy level:', error);
      toast({
        title: "Error",
        description: "Failed to save energy level. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResult(null);
  };

  const getGunaDescription = (guna: 'sattva' | 'rajas' | 'tamas') => {
    switch (guna) {
      case 'sattva':
        return {
          title: 'Sattva (Purity)',
          description: 'Represents balance, harmony, knowledge, and peace. Associated with clarity, wisdom, and spiritual growth.',
          color: 'bg-green-500',
          icon: Leaf
        };
      case 'rajas':
        return {
          title: 'Rajas (Activity)',
          description: 'Represents energy, passion, movement, and desire. Associated with action, ambition, and restlessness.',
          color: 'bg-orange-500',
          icon: Flame
        };
      case 'tamas':
        return {
          title: 'Tamas (Inertia)',
          description: 'Represents darkness, ignorance, inertia, and delusion. Associated with lethargy, confusion, and resistance to change.',
          color: 'bg-red-500',
          icon: Mountain
        };
      default:
        return {
          title: '',
          description: '',
          color: '',
          icon: Zap
        };
    }
  };

  const renderAssessment = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-600 mb-2">
          Energy Level Assessment
        </h2>
        <p className="text-muted-foreground">
          Answer these questions to understand your current energy balance
        </p>
      </div>

      <div className="space-y-4">
        {ENERGY_LEVEL_QUESTIONS.map((question, index) => {
          const selectedAnswer = answers[question.id];
          
          return (
            <Card key={question.id} className="backdrop-blur-sm bg-background/70 border border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-lg">
                  {index + 1}. {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(question.id, optionIndex)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAnswer === optionIndex
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-border hover:border-yellow-500/50 hover:bg-yellow-500/5'
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleAnswerSelect(question.id, optionIndex);
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-8 py-6 text-lg"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Calculating...
            </>
          ) : (
            'Calculate My Energy Level'
          )}
        </Button>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;

    const sattvaDesc = getGunaDescription('sattva');
    const rajasDesc = getGunaDescription('rajas');
    const tamasDesc = getGunaDescription('tamas');

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-600 mb-2">
            Your Energy Balance
          </h2>
          <p className="text-muted-foreground mb-6">
            Understanding your current guna predominance
          </p>
        </div>

        {/* Energy Level Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <sattvaDesc.icon className="h-5 w-5 text-green-400" />
                {sattvaDesc.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-2">{result.percentages.sattva}%</div>
              <div className="w-full bg-green-900/50 rounded-full h-3 mb-2">
                <div 
                  className="bg-green-500 h-3 rounded-full" 
                  style={{ width: `${result.percentages.sattva}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {sattvaDesc.description}
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <rajasDesc.icon className="h-5 w-5 text-orange-400" />
                {rajasDesc.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-400 mb-2">{result.percentages.rajas}%</div>
              <div className="w-full bg-orange-900/50 rounded-full h-3 mb-2">
                <div 
                  className="bg-orange-500 h-3 rounded-full" 
                  style={{ width: `${result.percentages.rajas}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {rajasDesc.description}
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <tamasDesc.icon className="h-5 w-5 text-red-400" />
                {tamasDesc.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400 mb-2">{result.percentages.tamas}%</div>
              <div className="w-full bg-red-900/50 rounded-full h-3 mb-2">
                <div 
                  className="bg-red-500 h-3 rounded-full" 
                  style={{ width: `${result.percentages.tamas}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {tamasDesc.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dominant Guna Recommendation */}
        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-400" />
              Personalized Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.percentages.sattva >= result.percentages.rajas && result.percentages.sattva >= result.percentages.tamas ? (
              <div>
                <h3 className="font-semibold text-green-400 mb-2">Cultivate Sattva</h3>
                <p className="text-muted-foreground">
                  Your energy is predominantly sattvic! Continue practices that enhance clarity, peace, and wisdom. 
                  Consider meditation, study of scriptures, and sattvic diet to maintain this balance.
                </p>
              </div>
            ) : result.percentages.rajas >= result.percentages.tamas ? (
              <div>
                <h3 className="font-semibold text-orange-400 mb-2">Channel Rajas Constructively</h3>
                <p className="text-muted-foreground">
                  Your energy is predominantly rajasic. Channel this dynamic energy toward spiritual goals. 
                  Practice mindfulness to avoid restlessness and direct your ambition toward selfless service.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-red-400 mb-2">Transform Tamas</h3>
                <p className="text-muted-foreground">
                  Your energy has a tamasic predominance. Focus on practices that increase awareness and activity. 
                  Regular sadhana, proper diet, and conscious effort to overcome inertia will help transform this energy.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button
            onClick={handleRetake}
            variant="outline"
            className="border-yellow-500/30 hover:bg-yellow-500/10"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Assessment
          </Button>
          <Button
            onClick={() => setShowHistory(!showHistory)}
            variant="outline"
            className="border-purple-500/30 hover:bg-purple-500/10"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {showHistory ? 'Hide' : 'Show'} History
          </Button>
        </div>

        {/* History Section */}
        {showHistory && previousResults.length > 0 && (
          <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                Energy Level History
              </CardTitle>
              <CardDescription>
                Track your energy balance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {previousResults.map((historyResult, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">
                        {index === 0 ? 'Today' : `${index} day${index > 1 ? 's' : ''} ago`}
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <Leaf className="h-3 w-3 text-green-400" />
                        <span className="text-xs">{historyResult.percentages.sattva}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-400" />
                        <span className="text-xs">{historyResult.percentages.rajas}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mountain className="h-3 w-3 text-red-400" />
                        <span className="text-xs">{historyResult.percentages.tamas}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold bg-clip-text text-transparent ${
              currentTheme === 'tara' 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                : 'bg-gradient-to-r from-yellow-500 to-orange-500'
            }`}>
              Energy Level Assessment
            </h1>
            <p className="text-muted-foreground mt-2">
              Understand and balance your spiritual energies
            </p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/profile')}
            className="p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>

        <Card className={`backdrop-blur-xl rounded-2xl shadow-xl ${
          currentTheme === 'tara' 
            ? 'bg-gradient-to-br from-blue-950/10 to-indigo-950/10 border border-blue-500/20' 
            : 'bg-gradient-to-br from-yellow-600/10 to-orange-500/10 border border-yellow-500/20'
        }`}>
          <CardContent className="p-6">
            {result ? renderResult() : renderAssessment()}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EnergyLevelPage;