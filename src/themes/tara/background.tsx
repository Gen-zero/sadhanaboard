import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { createTaraYantraTexture } from '../../utils/textureUtils';
import * as THREE from 'three';

// Glittering Yantra Component with enhanced effects
const GlitteringYantra: React.FC<{ texture: THREE.Texture | null; intensity: number }> = ({ texture, intensity }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  
  // Create glitter particles
  const particleCount = 200;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const radius = 3 + Math.random() * 1.5;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 2;
    
    particlePositions[i * 3] = Math.cos(angle) * radius;
    particlePositions[i * 3 + 1] = height;
    particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    particleSizes[i] = Math.random() * 0.1 + 0.05;
  }
  
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
  
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x66ccff,
    size: 0.1,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Enhanced rotation with variable speed for more dynamic feel
      meshRef.current.rotation.z += delta * (0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1);
      
      // More pronounced pulsing effect for a "breathing" yantra
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05 * intensity;
      meshRef.current.scale.x = pulse;
      meshRef.current.scale.y = pulse;
      
      // Color shifting for more visual interest
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        const material = meshRef.current.material;
        material.emissiveIntensity = 0.7 * intensity + Math.sin(state.clock.elapsedTime * 2) * 0.3 * intensity;
        
        // Subtle color shift from blue to cyan
        const r = 0;
        const g = 0.4 + Math.sin(state.clock.elapsedTime * 0.7) * 0.1;
        const b = 0.8 + Math.cos(state.clock.elapsedTime * 0.7) * 0.2;
        material.emissive.setRGB(r, g, b);
      }
    }
    
    // Animate glitter particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Gentle floating motion
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
        positions[i3] += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.001;
        positions[i3 + 2] += Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.0015;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      
      // Pulsing opacity for glitter effect
      (particlesRef.current.material as THREE.PointsMaterial).opacity = 0.5 + Math.sin(state.clock.elapsedTime * 3 + particleCount) * 0.3;
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 2]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial 
          map={texture} 
          transparent 
          opacity={0.98}
          emissive={0x0066cc}
          emissiveIntensity={0.7 * intensity}
          side={THREE.DoubleSide}
          metalness={0.8}
          roughness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Glitter particles around the yantra */}
      <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} position={[0, 0, 2.1]} />
    </>
  );
};

// Enhanced Floating lotus petals with more shimmer
const EnhancedLotus: React.FC<{ position: [number, number, number]; size: number; color: number; speed: number }> = ({ position, size, color, speed }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * speed;
      // More dynamic floating motion
      const time = state.clock.elapsedTime;
      meshRef.current.position.x = position[0] + Math.sin(time * 0.5) * 1.2;
      meshRef.current.position.y = position[1] + Math.cos(time * 0.7) * 0.8;
      meshRef.current.position.z = position[2] + Math.sin(time * 0.3) * 0.6;
      
      // Add subtle pulsing to the lotus petals
      const scale = 1 + Math.sin(time * 2 + position[0]) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
      
      // Color shifting for more visual interest
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        const material = meshRef.current.material;
        material.emissiveIntensity = 0.4 + Math.sin(time * 3 + position[1]) * 0.2;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial 
        color={color}
        transparent 
        opacity={0.7}
        emissive={color}
        emissiveIntensity={0.4}
        side={THREE.DoubleSide}
        metalness={0.6}
        roughness={0.2}
      />
    </mesh>
  );
};

// Enhanced Skull symbols with more intense glowing effect
const RadiantSkull: React.FC<{ position: [number, number, number]; size: number; intensity: number }> = ({ position, size, intensity }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // More dynamic pulsing glow with multiple frequencies
      const pulse1 = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 0.8;
      const pulse2 = Math.sin(state.clock.elapsedTime * 5) * 0.1 + 0.9;
      const combinedPulse = pulse1 * pulse2;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 * intensity * combinedPulse;
      
      // Add subtle rotation for more life
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial 
        color={0xffffff}
        transparent 
        opacity={0.8}
        emissive={0xffffff}
        emissiveIntensity={0.6 * intensity}
        side={THREE.DoubleSide}
        metalness={0.7}
        roughness={0.1}
      />
    </mesh>
  );
};

// Sacred mantra text with enhanced effects
const EnhancedMantraText: React.FC<{ text: string; position: [number, number, number]; intensity: number }> = ({ text, position, intensity }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // More dynamic rotation and floating
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.z = Math.sin(time * 1.0) * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(time * 1.2) * 0.8;
      meshRef.current.position.x = position[0] + Math.cos(time * 0.8) * 0.5;
    }
  });

  return (
    <Text
      ref={meshRef}
      position={position}
      fontSize={0.9}
      color="#66ccff"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.08}
      outlineColor="#003366"
    >
      {text}
    </Text>
  );
};

// Enhanced Tara Scene with more mystical elements
const TaraScene: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  // texture state
  const [yantraTex, setYantraTex] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const tex = await createTaraYantraTexture();
        if (mounted) {
          setYantraTex(tex as THREE.Texture);
        }
      } catch (e) {
        console.error('TaraScene: Error creating texture:', e);
        // ignore, fallback inside util
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {/* Deep blue-black cosmic background with enhanced depth */}
      <color attach="background" args={['#000a1a']} />
      
      {/* Enhanced lighting setup for better yantra visibility */}
      <ambientLight intensity={0.5 * intensity} color={0x3366aa} />
      <directionalLight color={0x66ccff} intensity={0.8 * intensity} position={[5, 10, 5]} castShadow />
      <pointLight color={0x3399ff} intensity={0.7 * intensity} position={[0, 5, -5]} />
      <pointLight color={0xff6699} intensity={0.5 * intensity} position={[-5, -3, 2]} />
      {/* Additional lights to highlight the yantra */}
      <pointLight color={0x66ccff} intensity={0.6 * intensity} position={[0, 0, 5]} />
      <pointLight color={0x33ccff} intensity={0.4 * intensity} position={[3, 2, 0]} />
      <pointLight color={0x3366ff} intensity={0.4 * intensity} position={[-3, -2, 0]} />
      
      {/* Background yantra plane with enhanced effects */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -3, -10]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial 
          map={yantraTex} 
          transparent 
          opacity={0.4}
          emissive={0x003366}
          emissiveIntensity={0.3 * intensity}
          side={THREE.DoubleSide}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Additional mystical elements - ethereal lotus petals with enhanced shimmer */}
      <EnhancedLotus position={[4, 1, -4]} size={1.5} color={0x66ccff} speed={0.5} />
      <EnhancedLotus position={[-3, -2, -5]} size={1.8} color={0x3399ff} speed={-0.6} />
      <EnhancedLotus position={[2, -3, -6]} size={1.2} color={0x99ccff} speed={0.7} />
      <EnhancedLotus position={[-2, 4, -5]} size={1.6} color={0x6699cc} speed={-0.4} />
      <EnhancedLotus position={[0, 0, -7]} size={2.5} color={0x336699} speed={0.3} />
      <EnhancedLotus position={[5, -1, -6]} size={1.3} color={0x66ccff} speed={-0.5} />
      <EnhancedLotus position={[-4, 2, -7]} size={1.4} color={0x99ccff} speed={0.4} />

      {/* Radiant skull symbols representing the cremation ground */}
      <RadiantSkull position={[5, 3, -3]} size={1.0} intensity={intensity} />
      <RadiantSkull position={[-4, -1, -4]} size={0.9} intensity={intensity} />
      <RadiantSkull position={[3, -4, -3]} size={1.1} intensity={intensity} />
      <RadiantSkull position={[-2, 5, -4]} size={0.8} intensity={intensity} />
      <RadiantSkull position={[0, -6, -2]} size={0.7} intensity={intensity} />
      <RadiantSkull position={[6, 0, -5]} size={0.9} intensity={intensity} />

      {/* Sacred mantra texts floating around with enhanced effects */}
      <EnhancedMantraText text="उग्र तारा" position={[6, 2, -2]} intensity={intensity} />
      <EnhancedMantraText text="नील सरस्वती" position={[-5, -3, -3]} intensity={intensity} />
      <EnhancedMantraText text="महाविद्या" position={[4, -5, -2]} intensity={intensity} />
      <EnhancedMantraText text="बामदेव" position={[-3, 6, -3]} intensity={intensity} />
      <EnhancedMantraText text="त्रिशूल" position={[7, -2, -1]} intensity={intensity} />
      <EnhancedMantraText text="श्मशान" position={[-6, 4, -1]} intensity={intensity} />

      {/* Stars - enhanced with more density and color variation */}
      <Stars radius={100} depth={50} count={8000} factor={4} saturation={0.7} fade />
      
      {/* Central Glittering Yantra - the main focus, now more impressive */}
      <GlitteringYantra texture={yantraTex} intensity={intensity} />
    </>
  );
};

const TaraAnimatedBackground: React.FC<{ className?: string; intensity?: number; enableParticles?: boolean; enableBloom?: boolean; enablePostFX?: boolean }> = ({ 
  className = '', 
  intensity = 1,
  enableBloom = true,
  enablePostFX = true 
}) => {
  
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        <TaraScene intensity={intensity} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        {enablePostFX && (
          <EffectComposer>
            {enableBloom && <Bloom luminanceThreshold={0.1} intensity={1.8 * intensity} luminanceSmoothing={0.9} />}
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
            <Noise opacity={0.03 * intensity} />
            <ChromaticAberration 
              offset={new THREE.Vector2(0.002 * intensity, 0.003 * intensity)} 
              radialModulation={false}
              modulationOffset={0}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default TaraAnimatedBackground;