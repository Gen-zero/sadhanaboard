import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, RotateCcw, Volume2, VolumeX, X, Smartphone, Target } from 'lucide-react';
import ThemedBackground from '@/components/ThemedBackground';
import { useSettings } from '@/hooks/useSettings';

// Bead style configurations
const beadStyles = {
  rudraksha: {
    name: 'Rudraksha',
    baseColor: '#8B4513',
    filter: 'url(#rudraksha3D)',
    guruColor: '#A0522D',
    stroke: '#3e1b05'
  },
  karungali: {
    name: 'Karungali',
    baseColor: '#1a1a1a',
    filter: 'url(#karungaliEbony)',
    guruColor: '#000000',
    stroke: '#000'
  },
  spatik: {
    name: 'Spatik',
    baseColor: '#e0f7fa',
    filter: 'url(#spatikCrystal)',
    guruColor: '#ffffff',
    stroke: '#b2ebf2'
  },
  tulsi: {
    name: 'Tulsi',
    baseColor: '#DEB887',
    filter: 'url(#tulsiGrain)',
    guruColor: '#cd853f',
    stroke: '#8b4513'
  },
  redSandal: {
    name: 'Red Sandal',
    baseColor: '#800000',
    filter: 'url(#redSandalFiber)',
    guruColor: '#800000',
    stroke: '#400000'
  }
};

type BeadStyleKey = keyof typeof beadStyles;

// Constants for geometry
const BEAD_COUNT = 108;
const BEAD_SIZE = 28;
const BEAD_SPACING = 70;
const VISIBLE_BEADS = 5;
const CURVE_INTENSITY = 9;

// SVG Filter definitions for realistic bead textures
const RealisticFilters = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      {/* Thread Fiber Texture */}
      <filter id="threadFiber" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8 0.1" numOctaves="3" result="noise" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.6  0 0 0 0 0.4  0 0 0 1 0" in="noise" result="coloredNoise" />
        <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="texturedString" />
        <feBlend mode="multiply" in="texturedString" in2="SourceGraphic" />
      </filter>

      {/* 1. Rudraksha 3D */}
      <filter id="rudraksha3D" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="4" result="noise" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 7 -3" in="noise" result="bumpyNoise" />
        <feDiffuseLighting in="bumpyNoise" lightingColor="#ffdbac" surfaceScale="3" diffuseConstant="1.2">
          <feDistantLight azimuth="45" elevation="60" />
        </feDiffuseLighting>
        <feComposite operator="arithmetic" k1="1" k2="0" k3="0" k4="0" in2="SourceGraphic" result="lighted" />
        <feComposite operator="in" in="lighted" in2="SourceGraphic" />
        <feBlend mode="multiply" in2="SourceGraphic" />
      </filter>

      {/* 2. Karungali (Ebony) */}
      <filter id="karungaliEbony" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.5 0.05" numOctaves="3" result="grain" />
        <feSpecularLighting in="grain" surfaceScale="1" specularConstant="0.5" specularExponent="15" lightingColor="#555" result="spec">
          <feDistantLight azimuth="90" elevation="60" />
        </feSpecularLighting>
        <feComposite in="spec" in2="SourceGraphic" operator="in" result="specIn" />
        <feComposite in="SourceGraphic" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litWood" />
        <feFlood floodColor="black" floodOpacity="0.4" result="darkness" />
        <feComposite in="darkness" in2="litWood" operator="in" result="darkWood" />
        <feBlend mode="multiply" in="darkWood" in2="litWood" result="finalUnclipped" />
        <feComposite operator="in" in="finalUnclipped" in2="SourceGraphic" />
      </filter>

      {/* 3. Spatik (Crystal/Quartz) */}
      <filter id="spatikCrystal" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
        <feFlood floodColor="#d1f2fb" floodOpacity="0.8" result="glowColor" />
        <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
        <feComposite in="glow" in2="SourceGraphic" operator="in" result="innerGlow" />
        <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="sharpBlur" />
        <feSpecularLighting in="sharpBlur" surfaceScale="8" specularConstant="1.6" specularExponent="55" lightingColor="white" result="spec">
          <fePointLight x="-150" y="-150" z="300" />
        </feSpecularLighting>
        <feComposite in="spec" in2="SourceAlpha" operator="in" result="specShape" />
        <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" result="noise" />
        <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.05 0" in="noise" result="subtleNoise" />
        <feBlend mode="screen" in="innerGlow" in2="SourceGraphic" result="base" />
        <feBlend mode="multiply" in="subtleNoise" in2="base" result="texturedBase" />
        <feComposite in="specShape" in2="texturedBase" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="finalUnclipped" />
        <feComposite operator="in" in="finalUnclipped" in2="SourceGraphic" />
      </filter>

      {/* 4. Tulsi (Holy Basil Wood) */}
      <filter id="tulsiGrain" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03 0.15" numOctaves="5" seed="1" result="woodNoise" />
        <feDisplacementMap in="woodNoise" in2="woodNoise" scale="4" xChannelSelector="R" yChannelSelector="G" result="warpedNoise" />
        <feDiffuseLighting in="warpedNoise" lightingColor="#F5DEB3" surfaceScale="1.5" diffuseConstant="1.1" result="diffuse">
          <feDistantLight azimuth="45" elevation="35" />
        </feDiffuseLighting>
        <feComposite in="diffuse" in2="SourceGraphic" operator="in" result="textured" />
        <feFlood floodColor="#8B4513" floodOpacity="0.2" result="warmFlood" />
        <feBlend mode="overlay" in="warmFlood" in2="textured" result="blended" />
        <feComposite operator="in" in="blended" in2="SourceGraphic" />
      </filter>

      {/* 5. Red Sandalwood */}
      <filter id="redSandalFiber" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="turbulence" baseFrequency="0.08 0.5" numOctaves="5" result="fibers" />
        <feDiffuseLighting in="fibers" lightingColor="#b34d4d" surfaceScale="2.5" diffuseConstant="1.3">
          <feDistantLight azimuth="120" elevation="50" />
        </feDiffuseLighting>
        <feComposite in2="SourceGraphic" operator="in" result="litFibers" />
        <feFlood floodColor="#4a0e0e" floodOpacity="0.6" result="deepRed" />
        <feBlend mode="multiply" in="deepRed" in2="litFibers" result="blended" />
        <feComposite operator="in" in="blended" in2="SourceGraphic" />
      </filter>

      <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="0" dy="5" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.4" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

const BeadCounterPage = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const currentTheme = settings?.appearance?.colorScheme || 'default';
  const audioContextRef = useRef<AudioContext | null>(null);

  // State initialization with LocalStorage
  const [totalCount, setTotalCount] = useState<number>(() => {
    const saved = localStorage.getItem('mala-total-count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [beadType, setBeadType] = useState<BeadStyleKey>(() => {
    const saved = localStorage.getItem('mala-bead-type');
    // Validate that saved value is a valid bead style key
    const validKeys = Object.keys(beadStyles) as BeadStyleKey[];
    if (saved && validKeys.includes(saved as BeadStyleKey)) {
      return saved as BeadStyleKey;
    }
    return 'rudraksha';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('mala-sound-enabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [hapticEnabled, setHapticEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('mala-haptic-enabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [vibrationDuration, setVibrationDuration] = useState<number>(() => {
    const saved = localStorage.getItem('mala-vibration-duration');
    return saved ? parseInt(saved, 10) : 15;
  });

  const [targetCount, setTargetCount] = useState<number>(() => {
    const saved = localStorage.getItem('mala-target-count');
    return saved ? parseInt(saved, 10) : 108;
  });

  const [showSettings, setShowSettings] = useState(false);
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Derived state - single atomic count
  const currentBeadIndex = totalCount % targetCount;
  const round = Math.floor(totalCount / targetCount);

  const currentStyle = beadStyles[beadType];

  // Persistence Effects
  useEffect(() => localStorage.setItem('mala-total-count', totalCount.toString()), [totalCount]);
  useEffect(() => localStorage.setItem('mala-bead-type', beadType), [beadType]);
  useEffect(() => localStorage.setItem('mala-sound-enabled', JSON.stringify(soundEnabled)), [soundEnabled]);
  useEffect(() => localStorage.setItem('mala-haptic-enabled', JSON.stringify(hapticEnabled)), [hapticEnabled]);
  useEffect(() => localStorage.setItem('mala-vibration-duration', vibrationDuration.toString()), [vibrationDuration]);
  useEffect(() => localStorage.setItem('mala-target-count', targetCount.toString()), [targetCount]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Audio functions
  const initAudio = useCallback(() => {
    if (soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [soundEnabled]);

  const playClickSound = useCallback(() => {
    if (soundEnabled && audioContextRef.current) {
      try {
        const osc = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioContextRef.current.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.05);

        osc.start();
        osc.stop(audioContextRef.current.currentTime + 0.05);
      } catch (e) {
        console.error("Audio error", e);
      }
    }
  }, [soundEnabled]);

  // Handlers
  const handleIncrement = useCallback(() => {
    if (isResetConfirming) setIsResetConfirming(false);
    initAudio();
    playClickSound();

    // Haptic feedback
    if (hapticEnabled && navigator.vibrate) {
      if (currentBeadIndex === targetCount - 1) {
        navigator.vibrate([50, 50, 50]); // Triple vibration for completion
      } else {
        navigator.vibrate(vibrationDuration);
      }
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);
    setTotalCount(prev => prev + 1);
  }, [initAudio, playClickSound, isResetConfirming, hapticEnabled, vibrationDuration, currentBeadIndex, targetCount]);

  const handleReset = useCallback(() => {
    if (isResetConfirming) {
      setTotalCount(0);
      setIsResetConfirming(false);
    } else {
      setIsResetConfirming(true);
      setTimeout(() => setIsResetConfirming(false), 3000);
    }
  }, [isResetConfirming]);

  // Unified Geometry Function for bead positions
  const getPosition = useCallback((offset: number) => {
    const absOffset = Math.abs(offset);
    const direction = Math.sign(offset);
    const spacingCompression = 1 - (absOffset * 0.06);
    const x = direction * absOffset * BEAD_SPACING * spacingCompression;
    const y = Math.pow(absOffset, 1.9) * CURVE_INTENSITY;
    const rot = offset * 18;
    return { x, y, rot };
  }, []);

  // Generate the string path dynamically
  const stringPathData = useMemo(() => {
    let d = "";
    const steps = 60;
    const range = VISIBLE_BEADS + 1.5;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const offset = -range + t * (range * 2);
      const pos = getPosition(offset);

      if (i === 0) {
        d += `M ${pos.x} ${pos.y}`;
      } else {
        d += ` L ${pos.x} ${pos.y}`;
      }
    }
    return d;
  }, [getPosition]);

  // Get visible beads for rendering
  const getVisibleBeads = useCallback(() => {
    const beads = [];
    for (let i = -VISIBLE_BEADS; i <= VISIBLE_BEADS; i++) {
      const sequenceIndex = totalCount + i;
      let beadId = sequenceIndex % BEAD_COUNT;
      if (beadId < 0) beadId += BEAD_COUNT;

      beads.push({
        offset: i,
        id: beadId,
        key: sequenceIndex
      });
    }
    return beads;
  }, [totalCount]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden touch-none select-none">
      {/* Themed Background */}
      <ThemedBackground theme={currentTheme as any} slowMode={true} />

      {/* SVG Filters */}
      <RealisticFilters />

      {/* Header with Back Button */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm bg-background/70 border border-purple-500/20 text-foreground hover:bg-background/90 transition-all duration-300"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 rounded-full backdrop-blur-sm bg-background/70 border border-purple-500/20 hover:bg-background/90 transition-all duration-300"
        >
          <Settings size={20} className="text-foreground" />
        </button>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed top-20 right-4 z-50 w-80 max-h-[80vh] overflow-y-auto backdrop-blur-xl bg-background/95 border border-purple-500/20 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Settings</h3>
            <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-muted rounded-full">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Bead Material */}
            <div>
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Bead Material</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(beadStyles) as [BeadStyleKey, typeof beadStyles[BeadStyleKey]][]).map(([key, style]) => (
                  <button
                    key={key}
                    onClick={() => setBeadType(key)}
                    className={`p-3 text-left text-sm rounded-lg border transition-all flex items-center gap-2
                      ${beadType === key
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300 font-medium ring-1 ring-purple-400'
                        : 'border-muted hover:border-purple-500/50 text-muted-foreground bg-muted/20'}`}
                  >
                    <div
                      className="w-5 h-5 rounded-full shadow-sm border border-white/20"
                      style={{ backgroundColor: style.baseColor }}
                    />
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Count */}
            <div className="pt-2 border-t border-purple-500/20">
              <label className="block text-sm font-semibold text-muted-foreground mb-2">Target Count</label>
              <div className="flex items-center gap-2">
                <Target size={18} className="text-purple-400" />
                <select
                  value={targetCount}
                  onChange={(e) => setTargetCount(parseInt(e.target.value))}
                  className="flex-1 bg-muted/30 border border-purple-500/20 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-purple-400 focus:border-purple-500"
                >
                  <option value={27}>27 (¼ Mala)</option>
                  <option value={54}>54 (½ Mala)</option>
                  <option value={108}>108 (Full Mala)</option>
                  <option value={216}>216 (2 Malas)</option>
                  <option value={1008}>1008 (Complete Cycle)</option>
                </select>
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
              <div className="flex items-center gap-2">
                {soundEnabled ? <Volume2 size={18} className="text-purple-400" /> : <VolumeX size={18} className="text-muted-foreground" />}
                <label className="text-sm font-semibold text-muted-foreground">Sound Effects</label>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${soundEnabled ? 'bg-purple-500' : 'bg-muted'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {/* Haptic Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
              <div className="flex items-center gap-2">
                <Smartphone size={18} className={hapticEnabled ? "text-purple-400" : "text-muted-foreground"} />
                <label className="text-sm font-semibold text-muted-foreground">Haptic Feedback</label>
              </div>
              <button
                onClick={() => setHapticEnabled(!hapticEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hapticEnabled ? 'bg-purple-500' : 'bg-muted'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hapticEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {/* Vibration Duration Slider */}
            {hapticEnabled && (
              <div className="space-y-2 pl-2">
                <label className="text-xs font-medium text-muted-foreground">Vibration Duration</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={vibrationDuration}
                  onChange={(e) => setVibrationDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5ms</span>
                  <span className="font-medium text-purple-400">{vibrationDuration}ms</span>
                  <span>50ms</span>
                </div>
              </div>
            )}

            {/* Reset Section */}
            <div className="pt-4 border-t border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Total Offerings</p>
                  <p className="text-xl font-source-serif text-foreground">{totalCount}</p>
                </div>
                <button
                  onClick={handleReset}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isResetConfirming
                    ? 'bg-red-500 text-white'
                    : 'bg-muted/30 text-muted-foreground hover:bg-red-500/20 hover:text-red-400'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className={`w-4 h-4 ${isResetConfirming ? 'animate-spin' : ''}`} />
                    {isResetConfirming ? 'Confirm Reset' : 'Reset'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Area */}
      <main className="flex-1 flex flex-col items-center justify-between pt-20 pb-4 px-4">


        {/* Consecrated Count Unit - Temple Plaque Style */}
        <div className="w-full max-w-lg flex flex-col items-center">
          <div
            className="relative px-12 py-8 text-center"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.03) 0%, transparent 70%)',
            }}
          >
            {/* Subtle gold line accent above */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
              }}
            />

            {/* Primary Count - Consecrated Fraction */}
            <div
              className="flex items-baseline justify-center gap-1 transition-opacity duration-700"
              style={{ opacity: isAnimating ? 0.6 : 1 }}
            >
              <span
                className="text-5xl sm:text-6xl font-source-serif font-normal text-white/90 tracking-tight"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {currentBeadIndex}
              </span>
              <span className="text-3xl sm:text-4xl font-source-serif font-light text-white/30 tracking-wider mx-1">
                /
              </span>
              <span className="text-3xl sm:text-4xl font-source-serif font-light text-white/40 tracking-wide">
                {targetCount}
              </span>
            </div>

            {/* Secondary - Round Indicator (Whispered) */}
            <p
              className="mt-4 text-sm font-source-serif font-normal text-white/20 tracking-widest uppercase"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              Round {round}
            </p>

            {/* Subtle gold line accent below */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)',
              }}
            />
          </div>
        </div>

        {/* Bottom Section - Mala */}
        <div className="w-full max-w-lg flex flex-col items-center mt-auto">
          {/* Curve Mala Visualization */}
          <div
            className="relative w-full h-[300px] cursor-pointer active:cursor-grabbing group overflow-visible"
            onClick={handleIncrement}
          >
            {/* Center Marker - Subtle Sacred */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />

            <svg
              width="100%"
              height="100%"
              className="overflow-visible"
              viewBox="-200 -50 400 300"
            >
              {/* String Core (Shadow) */}
              <path
                d={stringPathData}
                stroke="#5d4037"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* String Texture (Twisted Look) */}
              <path
                d={stringPathData}
                stroke="#d7ccc8"
                strokeWidth="3"
                fill="none"
                strokeDasharray="3 3"
                opacity="0.9"
                filter="url(#threadFiber)"
              />

              {/* String Highlight (Top Twist) */}
              <path
                d={stringPathData}
                stroke="#efebe9"
                strokeWidth="1"
                fill="none"
                strokeDasharray="2 4"
                strokeDashoffset="1"
                opacity="0.6"
              />

              {/* Render Beads */}
              {getVisibleBeads().map((bead) => {
                const isGuru = bead.id === 0;
                const pos = getPosition(bead.offset);

                // Scale for Depth of Field
                const dist = Math.abs(bead.offset);
                const scale = Math.max(0.6, 1 - (dist * 0.12));

                return (
                  <g
                    key={bead.key}
                    transform={`translate(${pos.x}, ${pos.y}) rotate(${pos.rot}) scale(${scale})`}
                    style={{
                      transition: 'transform 0.4s cubic-bezier(0.1, 0.9, 0.2, 1)',
                    }}
                  >
                    {/* Shadow for realism */}
                    <circle
                      cx={0} cy={0} r={BEAD_SIZE}
                      fill="black" opacity="0.1"
                      transform="translate(2, 4)"
                      filter="url(#dropShadow)"
                    />

                    {/* Bead Body */}
                    <circle
                      cx={0}
                      cy={0}
                      r={isGuru ? BEAD_SIZE + 4 : BEAD_SIZE}
                      fill={isGuru ? currentStyle.guruColor : currentStyle.baseColor}
                      stroke={currentStyle.stroke}
                      strokeWidth={isGuru ? 0 : 0.5}
                      filter={currentStyle.filter}
                    />

                    {/* Tassel for Guru Bead */}
                    {isGuru && (
                      <g transform="translate(0, 30) rotate(-10)">
                        <path
                          d="M -6 -5 Q 0 5 6 -5 L 10 25 Q 0 35 -10 25 Z"
                          fill="#d62828"
                        />
                        <circle cy="-5" r="5" fill={currentStyle.guruColor} />
                        <line x1="-3" y1="25" x2="-4" y2="35" stroke="#d62828" strokeWidth="1" />
                        <line x1="0" y1="25" x2="0" y2="38" stroke="#d62828" strokeWidth="1" />
                        <line x1="3" y1="25" x2="4" y2="34" stroke="#d62828" strokeWidth="1" />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Touch Feedback - Subtle Breath */}
            <div className={`absolute top-[45px] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-amber-200/10 blur-xl pointer-events-none transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} />
          </div>

          {/* Instruction - Whispered */}
          <p className="text-white/15 text-sm font-source-serif italic tracking-wide">Tap to offer</p>
        </div>
      </main>
    </div>
  );
};

export default BeadCounterPage;
