import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown,
  RotateCcw,
  Zap,
  Heart,
  Star,
  ThumbsUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TouchGestureArea } from '@/hooks/useTouchGestures';
import { 
  AndroidCard,
  AndroidButton,
  FloatingActionButton
} from './AndroidMobileComponents';

const SwipeGestureDemo: React.FC = () => {
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [swipeVelocity, setSwipeVelocity] = useState<number>(0);
  const [gestureHistory, setGestureHistory] = useState<string[]>([]);
  const [likeCount, setLikeCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [heartCount, setHeartCount] = useState(0);
  const { toast } = useToast();

  // Handle swipe gestures
  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down', velocity: number) => {
    setSwipeDirection(direction);
    setSwipeVelocity(velocity);
    
    // Add to gesture history
    const gestureText = `${direction.charAt(0).toUpperCase() + direction.slice(1)} swipe (${velocity.toFixed(2)} px/ms)`;
    setGestureHistory(prev => [gestureText, ...prev.slice(0, 4)]);
    
    // Show toast for fast swipes
    if (velocity > 1.0) {
      toast({
        title: "Fast Swipe Detected!",
        description: `Velocity: ${velocity.toFixed(2)} pixels/ms`
      });
    }
    
    // Reset direction after delay
    setTimeout(() => setSwipeDirection(null), 1000);
  };

  // Handle specific swipe directions
  const handleSwipeLeft = () => {
    console.log('Swiped left');
  };

  const handleSwipeRight = () => {
    console.log('Swiped right');
  };

  const handleSwipeUp = () => {
    console.log('Swiped up');
  };

  const handleSwipeDown = () => {
    console.log('Swiped down');
  };

  // Handle tap gestures
  const handleTap = () => {
    toast({
      title: "Tap Detected!",
      description: "Single tap registered"
    });
  };

  const handleDoubleTap = () => {
    toast({
      title: "Double Tap Detected!",
      description: "Double tap registered"
    });
  };

  // Handle long press
  const handleLongPress = () => {
    toast({
      title: "Long Press Detected!",
      description: "Held for 500ms or more"
    });
  };

  // Handle pinch gestures
  const handlePinch = (scale: number) => {
    console.log('Pinch scale:', scale);
  };

  // Handle quick actions
  const handleLike = () => {
    setLikeCount(prev => prev + 1);
    toast({
      title: "Liked!",
      description: `You've liked this ${likeCount + 1} times`
    });
  };

  const handleFavorite = () => {
    setFavoriteCount(prev => prev + 1);
    toast({
      title: "Favorited!",
      description: `Added to favorites ${favoriteCount + 1} times`
    });
  };

  const handleHeart = () => {
    setHeartCount(prev => prev + 1);
    toast({
      title: "Hearted!",
      description: `You've hearted this ${heartCount + 1} times`
    });
  };

  // Reset all counters
  const handleReset = () => {
    setLikeCount(0);
    setFavoriteCount(0);
    setHeartCount(0);
    setGestureHistory([]);
    toast({
      title: "Counters Reset!",
      description: "All counters have been reset to zero"
    });
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Swipe Gesture Demo</h1>
      
      {/* Swipe Direction Indicator */}
      <AndroidCard className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Swipe Direction</h2>
        <div className="relative h-48 flex items-center justify-center">
          <AnimatePresence>
            {swipeDirection && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute flex flex-col items-center"
              >
                <div className="text-4xl mb-2">
                  {swipeDirection === 'left' && <ArrowLeft className="text-blue-500" />}
                  {swipeDirection === 'right' && <ArrowRight className="text-green-500" />}
                  {swipeDirection === 'up' && <ArrowUp className="text-purple-500" />}
                  {swipeDirection === 'down' && <ArrowDown className="text-orange-500" />}
                </div>
                <div className="text-lg font-medium capitalize">{swipeDirection}</div>
                <div className="text-sm text-muted-foreground">
                  Velocity: {swipeVelocity.toFixed(2)} px/ms
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!swipeDirection && (
            <div className="text-muted-foreground text-center">
              <Zap className="w-12 h-12 mx-auto mb-2" />
              <p>Swipe in any direction to see detection</p>
            </div>
          )}
        </div>
      </AndroidCard>
      
      {/* Touch Gesture Area */}
      <AndroidCard className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Touch Gesture Area</h2>
        <TouchGestureArea
          gestureOptions={{
            onSwipe: handleSwipe,
            onSwipeLeft: handleSwipeLeft,
            onSwipeRight: handleSwipeRight,
            onSwipeUp: handleSwipeUp,
            onSwipeDown: handleSwipeDown,
            onTap: handleTap,
            onDoubleTap: handleDoubleTap,
            onLongPress: handleLongPress,
            onPinch: handlePinch,
            threshold: 30,
            velocityThreshold: 0.3
          }}
          className="h-64 bg-secondary/20 rounded-xl flex items-center justify-center border-2 border-dashed border-border cursor-pointer"
        >
          <div className="text-center p-4">
            <div className="text-2xl mb-2">👆</div>
            <p className="font-medium">Touch & Gesture Area</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try swiping, tapping, or pinching
            </p>
          </div>
        </TouchGestureArea>
      </AndroidCard>
      
      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-4">
        <AndroidButton
          variant="filled"
          color="primary"
          size="large"
          icon={<ThumbsUp size={20} />}
          onClick={handleLike}
          className="flex-col h-20"
        >
          <span className="text-xs mt-1">Like ({likeCount})</span>
        </AndroidButton>
        
        <AndroidButton
          variant="filled"
          color="secondary"
          size="large"
          icon={<Star size={20} />}
          onClick={handleFavorite}
          className="flex-col h-20"
        >
          <span className="text-xs mt-1">Favorite ({favoriteCount})</span>
        </AndroidButton>
        
        <AndroidButton
          variant="filled"
          color="danger"
          size="large"
          icon={<Heart size={20} />}
          onClick={handleHeart}
          className="flex-col h-20"
        >
          <span className="text-xs mt-1">Heart ({heartCount})</span>
        </AndroidButton>
      </div>
      
      {/* Gesture History */}
      <AndroidCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gesture History</h2>
          <AndroidButton
            variant="text"
            color="primary"
            size="small"
            icon={<RotateCcw size={16} />}
            onClick={handleReset}
          >
            Reset
          </AndroidButton>
        </div>
        
        {gestureHistory.length > 0 ? (
          <ul className="space-y-2">
            {gestureHistory.map((gesture, index) => (
              <li 
                key={index} 
                className="p-3 bg-secondary/10 rounded-lg flex items-center"
              >
                <Zap className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm">{gesture}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No gestures detected yet</p>
            <p className="text-sm mt-1">Try swiping in the gesture area above</p>
          </div>
        )}
      </AndroidCard>
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        icon={<Zap size={24} />}
        onClick={() => toast({
          title: "FAB Tapped!",
          description: "Floating Action Button activated"
        })}
      />
    </div>
  );
};

export default SwipeGestureDemo;