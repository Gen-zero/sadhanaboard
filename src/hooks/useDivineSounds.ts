import { useEffect, useRef } from 'react';

interface DivineSounds {
  playAmbient: () => void;
  playButtonClick: () => void;
  playNotification: () => void;
  playMantra: () => void;
}

export const useDivineSounds = (): DivineSounds => {
  const ambientSoundRef = useRef<HTMLAudioElement | null>(null);
  const buttonSoundRef = useRef<HTMLAudioElement | null>(null);
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
  const mantraSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize sounds
  useEffect(() => {
    // Create audio elements
    ambientSoundRef.current = new Audio('/sounds/ambient.mp3');
    buttonSoundRef.current = new Audio('/sounds/cosmic-enter.mp3');
    notificationSoundRef.current = new Audio('/sounds/cosmic-enter.mp3');
    mantraSoundRef.current = new Audio('/sounds/ambient.mp3');
    
    // Set volume levels
    if (ambientSoundRef.current) ambientSoundRef.current.volume = 0.1;
    if (buttonSoundRef.current) buttonSoundRef.current.volume = 0.3;
    if (notificationSoundRef.current) notificationSoundRef.current.volume = 0.4;
    if (mantraSoundRef.current) mantraSoundRef.current.volume = 0.2;
    
    // Set loop for ambient sound
    if (ambientSoundRef.current) ambientSoundRef.current.loop = true;
    
    // Cleanup
    return () => {
      if (ambientSoundRef.current) {
        ambientSoundRef.current.pause();
        ambientSoundRef.current = null;
      }
      if (buttonSoundRef.current) {
        buttonSoundRef.current.pause();
        buttonSoundRef.current = null;
      }
      if (notificationSoundRef.current) {
        notificationSoundRef.current.pause();
        notificationSoundRef.current = null;
      }
      if (mantraSoundRef.current) {
        mantraSoundRef.current.pause();
        mantraSoundRef.current = null;
      }
    };
  }, []);

  // Play ambient background sound
  const playAmbient = () => {
    try {
      if (ambientSoundRef.current) {
        ambientSoundRef.current.currentTime = 0;
        ambientSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
    } catch (err) {
      console.log('Could not play ambient sound');
    }
  };

  // Play button click sound
  const playButtonClick = () => {
    try {
      if (buttonSoundRef.current) {
        buttonSoundRef.current.currentTime = 0;
        buttonSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
    } catch (err) {
      console.log('Could not play button sound');
    }
  };

  // Play notification sound
  const playNotification = () => {
    try {
      if (notificationSoundRef.current) {
        notificationSoundRef.current.currentTime = 0;
        notificationSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
    } catch (err) {
      console.log('Could not play notification sound');
    }
  };

  // Play mantra sound
  const playMantra = () => {
    try {
      if (mantraSoundRef.current) {
        mantraSoundRef.current.currentTime = 0;
        mantraSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
    } catch (err) {
      console.log('Could not play mantra sound');
    }
  };

  return {
    playAmbient,
    playButtonClick,
    playNotification,
    playMantra
  };
};