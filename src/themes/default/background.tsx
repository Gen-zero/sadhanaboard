import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float, Text } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
import * as THREE from 'three';

export interface CosmicSpiritualBackgroundProps {
  intensity?: number;
  enableParticles?: boolean;
  enableBloom?: boolean;
  className?: string;
}

// Central Image - Default Background
const CentralBackgroundImage: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/themes/default/assets/default-bg.jpg', (texture) => {
      textureRef.current = texture;
      if (meshRef.current) {
        const material = meshRef.current.material as THREE.MeshBasicMaterial;
        material.map = texture;
        material.needsUpdate = true;
      }
    });
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(t * 0.3) * 0.15;
      // Gentle rotation
      meshRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;
      // Pulsing scale
      meshRef.current.scale.setScalar(1 + Math.sin(t * 0.4) * 0.08);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[6, 6]} />
      <meshBasicMaterial 
        transparent={true}
        opacity={0.9}
        map={textureRef.current}
      />
    </mesh>
  );
};

// Sacred Geometry - Rotating Sri Yantra-inspired pattern (dimmed)
const SacredGeometry: React.FC<{ intensity: number }> = ({ intensity }) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Group>(null);

  // Create sacred geometry shader material
  const geometryMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: intensity },
        color1: { value: new THREE.Color('#9b59b6') }, // Purple
        color2: { value: new THREE.Color('#f1c40f') }, // Gold
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        
        float circle(vec2 uv, vec2 center, float radius, float blur) {
          return smoothstep(radius + blur, radius - blur, length(uv - center));
        }
        
        void main() {
          vec2 center = vec2(0.5);
          float dist = distance(vUv, center);
          
          // Pulsing glow effect
          float pulse = 0.5 + 0.5 * sin(time * 1.5);
          float glow = smoothstep(0.5, 0.0, dist) * pulse * intensity;
          
          // Concentric rings
          float rings = sin(dist * 30.0 - time * 2.0) * 0.5 + 0.5;
          rings *= smoothstep(0.5, 0.2, dist);
          
          // Mix colors
          vec3 color = mix(color1, color2, rings + glow * 0.5);
          float alpha = (glow * 0.8 + rings * 0.3) * smoothstep(0.55, 0.3, dist);
          
          gl_FragColor = vec4(color, alpha * 0.12);  // Much darker geometry
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [intensity]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (groupRef.current) {
      // Gentle breathing effect
      groupRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05);
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.z = t * 0.1;
    }
    
    if (outerRef.current) {
      outerRef.current.rotation.z = -t * 0.05;
    }
    
    // Update shader time
    geometryMaterial.uniforms.time.value = t;
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {/* Central mandala plane */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <primitive object={geometryMaterial} attach="material" />
      </mesh>
      
      {/* Inner rotating ring */}
      <group ref={innerRef}>
        <mesh position={[0, 0, 0.1]}>
          <ringGeometry args={[0.8, 1.0, 64]} />
          <meshBasicMaterial color="#f1c40f" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <ringGeometry args={[1.2, 1.35, 64]} />
          <meshBasicMaterial color="#9b59b6" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      </group>
      
      {/* Outer rotating ring */}
      <group ref={outerRef}>
        <mesh position={[0, 0, 0.05]}>
          <ringGeometry args={[1.8, 2.0, 64]} />
          <meshBasicMaterial color="#e74c3c" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <ringGeometry args={[2.3, 2.5, 64]} />
          <meshBasicMaterial color="#f1c40f" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

// Floating Om Symbol
const FloatingOm: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(t * 0.7 + position[0]) * 0.3;
      meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
      // Pulsing glow
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(t * 1.5) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <Text
        ref={meshRef}
        position={position}
        fontSize={0.8 * scale}
        color="#f1c40f"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#9b59b6"
      >
        ॐ
      </Text>
    </Float>
  );
};

// Divine Light Rays
const DivineLightRays: React.FC<{ intensity: number }> = ({ intensity }) => {
  const rayMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: intensity * 0.15 },  // Much more reduced
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        varying vec2 vUv;
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          vec2 dir = vUv - center;
          float angle = atan(dir.y, dir.x);
          float dist = length(dir);
          
          // Create ray pattern
          float rays = abs(sin(angle * 12.0 + time * 0.5));
          rays = pow(rays, 3.0);
          
          // Fade from center
          float fade = smoothstep(0.5, 0.0, dist);
          
          // Pulsing effect
          float pulse = 0.7 + 0.3 * sin(time * 2.0);
          
          // Golden divine light - very subtle
          vec3 color = vec3(0.95, 0.85, 0.4) * rays * fade * pulse * intensity;
          float alpha = rays * fade * 0.06 * intensity;  // Much much lower alpha
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [intensity]);

  useFrame(({ clock }) => {
    rayMaterial.uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <mesh position={[0, 0, -3]}>
      <planeGeometry args={[15, 15]} />
      <primitive object={rayMaterial} attach="material" />
    </mesh>
  );
};

// Lotus Petals floating
const LotusPetals: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.rotation.z = t * 0.02;
    }
  });

  if (!enabled) return null;

  return (
    <group ref={groupRef} position={[0, 0, -1]}>
      {/* Golden divine particles */}
      <Sparkles 
        count={300} 
        scale={12} 
        size={2} 
        speed={0.3} 
        color="#f1c40f" 
        opacity={0.8}
      />
      
      {/* Purple mystical particles */}
      <Sparkles 
        count={200} 
        scale={15} 
        size={1.5} 
        speed={0.2} 
        color="#9b59b6" 
        opacity={0.6}
      />
      
      {/* White divine light particles */}
      <Sparkles 
        count={150} 
        scale={10} 
        size={1} 
        speed={0.4} 
        color="#ffffff" 
        opacity={0.5}
      />
      
      {/* Rose/pink blessing particles */}
      <Sparkles 
        count={100} 
        scale={18} 
        size={0.8} 
        speed={0.15} 
        color="#e91e63" 
        opacity={0.4}
      />
      
      {/* Deep cosmic purple dust */}
      <Sparkles 
        count={250} 
        scale={20} 
        size={0.5} 
        speed={0.1} 
        color="#4a148c" 
        opacity={0.3}
      />
    </group>
  );
};

// Cosmic Nebula Background
const CosmicNebula: React.FC<{ intensity: number }> = ({ intensity }) => {
  const nebulaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: intensity * 0.15 },  // Much more reduced
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        varying vec2 vUv;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          vec2 uv = vUv;
          float t = time * 0.1;
          
          // Multiple layers of noise for nebula effect
          float n1 = snoise(uv * 3.0 + t) * 0.5 + 0.5;
          float n2 = snoise(uv * 5.0 - t * 0.5) * 0.5 + 0.5;
          float n3 = snoise(uv * 8.0 + t * 0.3) * 0.5 + 0.5;
          
          // Combine noises
          float nebula = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
          
          // Color gradient - cosmic purple to gold
          vec3 purple = vec3(0.4, 0.1, 0.6);
          vec3 gold = vec3(0.9, 0.7, 0.2);
          vec3 pink = vec3(0.8, 0.2, 0.5);
          vec3 blue = vec3(0.1, 0.2, 0.5);
          
          vec3 color = mix(purple, gold, nebula);
          color = mix(color, pink, n2 * 0.3);
          color = mix(color, blue, n3 * 0.2);
          
          // Vignette
          float vignette = 1.0 - length(uv - 0.5) * 0.8;
          
          gl_FragColor = vec4(color * vignette * intensity * 0.08, 0.15);  // Very subtle nebula, no white film
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }, [intensity]);

  useFrame(({ clock }) => {
    nebulaMaterial.uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <mesh position={[0, 0, -5]}>
      <planeGeometry args={[25, 25]} />
      <primitive object={nebulaMaterial} attach="material" />
    </mesh>
  );
};

// Main Scene
const CosmicSpiritualScene: React.FC<{ 
  intensity: number; 
  enableParticles: boolean; 
  enableBloom: boolean 
}> = ({ intensity, enableParticles, enableBloom }) => {
  return (
    <>
      {/* Central background image positioned in middle */}
      <CentralBackgroundImage />
      
      {/* Ambient spiritual light */}
      <ambientLight intensity={0.05 * intensity} color="#9b59b6" />
      {/* Divine golden light from above */}
      <directionalLight position={[0, 5, 3]} color="#f1c40f" intensity={0.15 * intensity} />
      
      {/* Purple mystical accent lights */}
      <pointLight position={[-3, 2, 2]} color="#9b59b6" intensity={0.08 * intensity} distance={10} />
      <pointLight position={[3, -2, 2]} color="#8e44ad" intensity={0.06 * intensity} distance={8} />
      
      {/* Central golden glow */}
      <pointLight position={[0, 0, 1]} color="#f1c40f" intensity={0.1 * intensity} distance={6} />

      {/* Cosmic nebula background */}
      <CosmicNebula intensity={intensity} />
      
      {/* Divine light rays */}
      <DivineLightRays intensity={intensity} />
      
      {/* Sacred geometry mandala */}
      <SacredGeometry intensity={intensity} />
      
      {/* Floating Om symbols */}
      <FloatingOm position={[-2.5, 2, 0]} scale={0.8} />
      <FloatingOm position={[2.8, -1.5, 0.5]} scale={0.6} />
      <FloatingOm position={[-1.5, -2.5, 0.3]} scale={0.5} />
      <FloatingOm position={[1.8, 2.2, -0.2]} scale={0.7} />
      
      {/* Divine particles */}
      <LotusPetals enabled={enableParticles} />

      {/* Post-processing effects - minimal bloom */}
      {enableBloom && (
        <EffectComposer multisampling={4}>
          <Bloom 
            intensity={0.25}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.9} 
            kernelSize={KernelSize.LARGE} 
            mipmapBlur={false}
          />
          <Vignette eskil={false} offset={0.15} darkness={1.8} />
        </EffectComposer>
      )}
    </>
  );
};

// Main Component
const CosmicSpiritualBackground: React.FC<CosmicSpiritualBackgroundProps> = ({ 
  intensity = 1, 
  enableParticles = true, 
  enableBloom = true, 
  className 
}) => {
  return (
    <div className={className ?? 'fixed inset-0 z-0'}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 60 }} 
        frameloop="always" 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true, premultipliedAlpha: true }}
      >
        <CosmicSpiritualScene 
          intensity={intensity} 
          enableParticles={enableParticles} 
          enableBloom={enableBloom} 
        />
      </Canvas>
    </div>
  );
};

export default CosmicSpiritualBackground;
