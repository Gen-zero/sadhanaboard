import React, { Suspense, useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useTexture, Sparkles, Text } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { KernelSize, BlendFunction } from 'postprocessing';
import { createMahakaliYantraTexture, createFallbackTexture, validateTextureLoading } from '@/utils/textureUtils';
import * as THREE from 'three';

// Uniforms record type for shader materials
type UniformsRecord = Record<string, { value: unknown }>;

export interface MahakaliAnimatedBackgroundProps {
  intensity?: number;
  enableParticles?: boolean;
  enableBloom?: boolean;
  enablePostFX?: boolean;
  className?: string;
}

// Add new component for floating mantras
const FloatingMantra: React.FC<{ text: string; position: [number, number, number]; intensity: number }> = ({ text, position, intensity }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle rotation and floating
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.7) * 0.6;
      meshRef.current.position.x = position[0] + Math.cos(time * 0.4) * 0.4;
    }
  });

  return (
    <Text
      ref={meshRef}
      position={position}
      fontSize={0.9}
      color="#ff4444"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.06}
      outlineColor="#990000"
    >
      {text}
    </Text>
  );
};

// Add new component for glowing yantra symbols
const GlowingSymbol: React.FC<{ position: [number, number, number]; size: number; intensity: number }> = ({ position, size, intensity }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle pulsing glow
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.9;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 * intensity * pulse;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial 
        color={0xff0000}
        transparent 
        opacity={0.8}
        emissive={0xff0000}
        emissiveIntensity={0.6 * intensity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Enhanced Mahakali Scene with more mystical elements
const MahakaliScene: React.FC<{ intensity: number; enableParticles: boolean; enableBloom: boolean; enablePostFX?: boolean }> = ({ intensity, enableParticles, enableBloom, enablePostFX }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [hasTexture, setHasTexture] = useState(false);
  
  // Load texture via async effect instead of Suspense
  useEffect(() => {
    let isMounted = true;
    
    const loadTexture = async () => {
      try {
        const tex = await createMahakaliYantraTexture();
        if (isMounted) {
          setTexture(tex);
          setHasTexture(validateTextureLoading(tex));
        }
      } catch (err) {
        console.warn('Failed to load Mahakali yantra texture:', err);
        // Create fallback texture
        if (isMounted) {
          const fallback = createFallbackTexture('#dc2626');
          setTexture(fallback);
          setHasTexture(true);
        }
      }
    };
    
    loadTexture();
    
    return () => {
      isMounted = false;
      if (texture) {
        try {
          texture.dispose();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // Yantra shader material with proper texture handling
  const yantraMaterial = useMemo(() => {
    const uniforms: UniformsRecord = {
      time: { value: 0 },
      yantraTexture: { value: texture || null },
      hasTexture: { value: hasTexture },
      pulseIntensity: { value: intensity },
      glowColor: { value: new THREE.Color('#ff0000') }, // Intense red instead of crimson
      triangleThreshold: { value: 0.2 }, // Lowered threshold from 0.25 to 0.2 for more glow
      triangleSoftness: { value: 0.15 } // Increased softness from 0.12 to 0.15 for fiercer effect
    };

    const vertexShader = `varying vec2 vUv; void main(){ vUv = vec2(uv.x, 1.0 - uv.y); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;

    const fragmentShader = `
      uniform sampler2D yantraTexture;
      uniform bool hasTexture;
      uniform float time;
      uniform float pulseIntensity;
      uniform vec3 glowColor;
      varying vec2 vUv;
      uniform float triangleThreshold;
      uniform float triangleSoftness;
      
      void main(){
        vec2 center = vec2(0.5);
        vec4 tex = hasTexture ? texture2D(yantraTexture, vUv) : vec4(0.86, 0.08, 0.08, 0.7);
        float dist = distance(vUv, center);
        float pulse = 0.5 + 0.5 * sin(time * 2.0);
        
        // compute luminance and a triangle mask to focus glow on triangular regions
        float lum = hasTexture ? dot(tex.rgb, vec3(0.299,0.587,0.114)) : 0.5;
        float triMask = smoothstep(triangleThreshold - triangleSoftness, triangleThreshold + triangleSoftness, lum);
        
        // central glow falls off with distance and is masked by triangle areas
        float glow = smoothstep(0.5, 0.0, dist) * pulse * pulseIntensity * triMask;
        
        // Enhanced glow contribution for fiercer effect
        vec3 glowCol = glowColor * (glow * 3.0); // Increased from 2.5 to 3.0 for even more intensity
        vec3 base = tex.rgb;
        
        // Mix texture with stronger glow, enhanced for fiercer look
        vec3 final = clamp(base + glowCol, 0.0, 1.3); // Allow more oversaturation for fierce effect
        
        // Enhanced alpha and glow for more intense effect
        float alpha = tex.a * 0.9; // Increased from 0.85 to 0.9
        gl_FragColor = vec4(final, clamp(alpha + glow * 1.2, 0.0, 1.0)); // Increased glow contribution
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false
    });
    
    // mark as not tone-mapped so bloom treats it as glowing
    (mat as unknown as { toneMapped?: boolean }).toneMapped = false;
    return mat;
  }, [texture, hasTexture, intensity]);

  // Energy waves material
  const wavesMaterial = useMemo(() => {
  const uniforms: UniformsRecord = {
      time: { value: 0 },
      waveSpeed: { value: 2.5 }, // Increased from 2.0 to 2.5
      waveIntensity: { value: 0.45 } // Increased from 0.35 to 0.45
    };

  const vertexShader = `varying vec2 vUv; void main(){ vUv = vec2(uv.x, 1.0 - uv.y); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;

    const fragmentShader = `
      uniform float time;
      uniform float waveSpeed;
      uniform float waveIntensity;
      varying vec2 vUv;
      void main(){
        vec2 center = vec2(0.5);
        float dist = distance(vUv, center);
        float waves = sin(dist * 25.0 - time * waveSpeed); // Increased frequency from 20.0 to 25.0
        float fade = smoothstep(0.0, 0.9, 1.0 - dist);
        float intensity = waves * 0.6 * waveIntensity * fade; // Increased from 0.5 to 0.6
        vec3 color = vec3(0.9, 0.1, 0.1) * max(0.0, intensity); // More intense red
        // Reduce the alpha for more transparency
        float alpha = max(0.0, intensity) * 0.8; // Increased from 0.7 to 0.8
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    // mark waves as not tone-mapped to enhance bloom responsiveness
    (mat as unknown as { toneMapped?: boolean }).toneMapped = false;
    return mat;
  }, []);

  // --------------------------- Eclipse Aura Shader ---------------------------
  const eclipseMaterial = useMemo(() => {
    const uniforms: UniformsRecord = {
      time: { value: 0 },
      intensity: { value: 1.0 }, // Increased from 0.8 to 1.0
      innerRadius: { value: 0.25 }, // Decreased from 0.3 to 0.25
      outerRadius: { value: 1.5 } // Increased from 1.2 to 1.5
    };

    const vertexShader = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;

    const fragmentShader = `
      varying vec2 vUv;
      uniform float time;
      uniform float intensity;
      uniform float innerRadius;
      uniform float outerRadius;
      void main(){
        vec2 center = vec2(0.5);
        float d = distance(vUv, center);
        float pulse = 0.7 + sin(time * 1.0) * 0.3; // Increased pulse from 0.6+0.2 to 0.7+0.3
        float t = smoothstep(innerRadius, outerRadius, d);
        // inner core crimson, mid ember, outer fade to transparent
        vec3 inner = vec3(0.6, 0.0, 0.0); // Darker inner core #990000
        vec3 mid = vec3(1.0, 0.3, 0.1); // More intense mid #ff4d1a
        vec3 color = mix(inner, mid, smoothstep(innerRadius, (innerRadius+outerRadius)/2.0, d));
        // Reduce the alpha for more transparency
        float alpha = (1.0 - t) * intensity * pulse * smoothstep(outerRadius, innerRadius, d) * 0.8; // Increased from 0.7 to 0.8
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    // ensure bloom sees this as HDR-like
  // mark as not tone mapped so bloom treats it as glowing
  (mat as unknown as { toneMapped?: boolean }).toneMapped = false;
    return mat;
  }, []);

  // Light refs for dynamic lighting
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const emberLightsRef = useRef<THREE.PointLight[]>([]);

  // Particles group: smoke, embers, ash, skulls, hibiscus, bones using Sparkles + custom meshes
  const ParticlesGroup: React.FC<{ enabled: boolean }> = ({ enabled }) => {
    const smokeRef = useRef<THREE.Group>(null);
    const embersRef = useRef<THREE.Group>(null);
    const ashRef = useRef<THREE.Group>(null);
    const skullsRef = useRef<THREE.Group>(null);
    const hibiscusRef = useRef<THREE.Group>(null);
    const bonesRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      if (smokeRef.current) {
        smokeRef.current.position.y = Math.sin(t * 0.2) * 0.05;
      }
      if (embersRef.current) {
        embersRef.current.rotation.z = Math.sin(t * 0.6) * 0.1;
      }
      if (ashRef.current) {
        ashRef.current.position.x = Math.sin(t * 0.15) * 0.02;
      }
      // Animate floating skulls with slow rotation and drift
      if (skullsRef.current) {
        skullsRef.current.rotation.y = t * 0.08; // Slower, more ominous rotation
        skullsRef.current.position.y = Math.sin(t * 0.25) * 0.1;
        skullsRef.current.position.x = Math.cos(t * 0.15) * 0.05;
      }
      // Animate hibiscus flowers with gentle swaying
      if (hibiscusRef.current) {
        hibiscusRef.current.rotation.z = Math.sin(t * 0.3) * 0.12;
        hibiscusRef.current.position.x = Math.cos(t * 0.22) * 0.08;
        hibiscusRef.current.position.y = Math.sin(t * 0.18) * 0.04;
      }
      // Animate bones with tumbling motion
      if (bonesRef.current) {
        bonesRef.current.rotation.x = t * 0.06; // Slower tumbling
        bonesRef.current.rotation.z = t * 0.09;
        bonesRef.current.position.y = Math.cos(t * 0.16) * 0.07;
        bonesRef.current.position.x = Math.sin(t * 0.12) * 0.03;
      }
    });

    if (!enabled) return null;

    return (
      <>
        <group ref={smokeRef} position={[0, -0.2, -2]} renderOrder={-2}>
          <Sparkles count={1000} scale={20} size={1.5} speed={0.2} color="#0a0a0a" noise={2.0} opacity={0.7} /> {/* Increased smoke intensity */}
        </group>
        <group ref={embersRef} position={[0, -0.1, -1]} renderOrder={0}>
          <Sparkles count={600} scale={12} size={0.7} speed={0.8} color="#ff2200" noise={3.0} opacity={1.0} /> {/* More intense embers */}
        </group>
        <group ref={ashRef} position={[0, 0.2, -1.5]} renderOrder={-1}>
          <Sparkles count={700} scale={18} size={0.3} speed={0.1} color="#5a5a5a" noise={1.5} opacity={0.6} /> {/* More ash particles */}
        </group>
        {/* Add fierce flame sparks */}
        <group position={[0, 0, -0.5]} renderOrder={1}>
          <Sparkles count={500} scale={15} size={1.0} speed={1.0} color="#ff3300" noise={4.0} opacity={0.9} /> {/* More intense flame sparks */}
        </group>
        {/* Add dark spiritual energy */}
        <group position={[0, 0.3, -2.5]} renderOrder={-3}>
          <Sparkles count={800} scale={25} size={0.5} speed={0.07} color="#220000" noise={1.0} opacity={0.5} /> {/* More dark energy */}
        </group>
        {/* Floating skulls for cremation ground atmosphere - multiple layers */}
        <group ref={skullsRef} position={[0, 1, -3]} renderOrder={2}>
          <Sparkles count={80} scale={30} size={2.2} speed={0.015} color="#ffffff" noise={0.2} opacity={0.9} /> {/* Larger, more prominent skulls */}
        </group>
        <group position={[2, 0.5, -4]} renderOrder={2}>
          <Sparkles count={50} scale={25} size={1.5} speed={0.02} color="#f0f0f0" noise={0.3} opacity={0.7} /> {/* Medium distant skulls */}
        </group>
        <group position={[-1.8, 1.2, -3.5]} renderOrder={2}>
          <Sparkles count={40} scale={20} size={1.2} speed={0.025} color="#e0e0e0" noise={0.4} opacity={0.6} /> {/* Small scattered skulls */}
        </group>
        {/* Hibiscus flowers - traditional cremation ground offering - layered */}
        <group ref={hibiscusRef} position={[0, -0.5, -1.8]} renderOrder={1}>
          <Sparkles count={120} scale={25} size={1.3} speed={0.04} color="#ff0000" noise={0.7} opacity={0.8} /> {/* More vibrant red hibiscus */}
        </group>
        <group position={[1.5, -0.2, -2.2]} renderOrder={1}>
          <Sparkles count={60} scale={20} size={0.9} speed={0.045} color="#cc0000" noise={1.0} opacity={0.6} /> {/* Darker red hibiscus */}
        </group>
        <group position={[-1.2, -0.8, -2.5]} renderOrder={1}>
          <Sparkles count={50} scale={18} size={0.7} speed={0.05} color="#990000" noise={1.2} opacity={0.5} /> {/* Deep maroon hibiscus */}
        </group>
        {/* Floating bones scattered around - multiple bone types */}
        <group ref={bonesRef} position={[0, 0.5, -2.2]} renderOrder={0}>
          <Sparkles count={60} scale={22} size={2.5} speed={0.01} color="#ffffff" noise={0.3} opacity={0.7} /> {/* Larger bones */}
        </group>
        <group position={[1.8, 0.2, -2.8]} renderOrder={0}>
          <Sparkles count={50} scale={15} size={1.8} speed={0.015} color="#f8f8f8" noise={0.5} opacity={0.6} /> {/* Rib bones */}
        </group>
        <group position={[-1.5, 0.8, -3.2]} renderOrder={0}>
          <Sparkles count={40} scale={12} size={1.2} speed={0.02} color="#f0f0f0" noise={0.7} opacity={0.5} /> {/* Small bone fragments */}
        </group>
      </>
    );
  };

  // clone inner material to avoid sharing state
  const innerMaterial = useMemo(() => {
    const mat = yantraMaterial.clone();
    // Make the inner layer more transparent for a subtle hypnotic effect
    mat.transparent = true;
    mat.opacity = 0.6; // Increased from 0.5 to 0.6 for more visibility
    return mat;
  }, [yantraMaterial]);
  // ensure inner clone is not tone-mapped so bloom works uniformly
  (innerMaterial as unknown as { toneMapped?: boolean }).toneMapped = false;

  // group ref for eclipse mesh
  const eclipseRef = useRef<THREE.Mesh | null>(null);

  // cleanup shader materials when component unmounts
  useEffect(() => {
    return () => {
      if (typeof yantraMaterial?.dispose === 'function') yantraMaterial.dispose();
      if (typeof wavesMaterial?.dispose === 'function') wavesMaterial.dispose();
      if (typeof innerMaterial?.dispose === 'function') innerMaterial.dispose();
      if (typeof eclipseMaterial?.dispose === 'function') eclipseMaterial.dispose();
    };
  }, [yantraMaterial, wavesMaterial, innerMaterial, eclipseMaterial]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    // precise 40-second rotation: full rotation = 2PI over 40 seconds
    const rot = (elapsed * Math.PI * 2) / 40;
    if (meshRef.current) {
      meshRef.current.rotation.z = rot;
      meshRef.current.rotation.x = Math.sin(elapsed * 0.1) * 0.03 * intensity; // Increased from 0.02 to 0.03
      const mat = meshRef.current.material as THREE.Material & { uniforms?: UniformsRecord };
      if (mat.uniforms?.time) {
        (mat.uniforms.time.value as number) = elapsed;
      }
    }
    if (innerRef.current) {
      // inner triangle rotates at a different rate for hypnotic effect
      innerRef.current.rotation.z = rot * -1.5; // Increased from -1.25 to -1.5
      const imat = innerRef.current.material as THREE.Material & { uniforms?: UniformsRecord };
      if (imat.uniforms?.time) {
        (imat.uniforms.time.value as number) = elapsed * 1.5; // Increased from 1.2 to 1.5
      }
    }
    // update shader uniforms for waves
    const wmat = wavesMaterial as THREE.ShaderMaterial & { uniforms?: UniformsRecord };
    if (wmat.uniforms?.time) {
      (wmat.uniforms.time.value as number) = elapsed;
    }

    // update eclipse aura
    if (eclipseRef.current) {
      const mat = eclipseRef.current.material as THREE.ShaderMaterial & { uniforms?: UniformsRecord };
      if (mat.uniforms?.time) mat.uniforms.time.value = elapsed;
      eclipseRef.current.rotation.z = elapsed * 0.03; // Increased from 0.02 to 0.03
    }

    // dynamic lighting updates
    if (dirLightRef.current) {
      // Increased intensity for fiercer lighting
      dirLightRef.current.intensity = (1.2 + Math.sin(elapsed * 2.5) * 0.5) * intensity; // Increased from 1.0+0.4 to 1.2+0.5
    }
    if (rimLightRef.current) {
      // Increased rim light intensity
      rimLightRef.current.intensity = (0.3 + Math.sin(elapsed * 1.0) * 0.1) * intensity; // Increased from 0.25+0.08 to 0.3+0.1
    }
    // ember lights orbital motion with increased intensity
    emberLightsRef.current.forEach((l, i) => {
      const ang = elapsed * (0.9 + i * 0.3) + i; // Increased from 0.7+i*0.2 to 0.9+i*0.3
      const r = 1.5 + (i % 2) * 1.0; // Increased from 1.2+(i%2)*0.8 to 1.5+(i%2)*1.0
      l.position.set(Math.cos(ang) * r, Math.sin(ang * 1.1) * 0.8, Math.sin(ang) * 1.0 - 0.2); // Increased from 0.9 to 1.1, 0.6 to 0.8, 0.8 to 1.0
      // Increased ember intensity for fiercer effect
      l.intensity = (0.5 + Math.abs(Math.sin(elapsed * (2.0 + i * 0.4))) * 1.0) * intensity; // Increased from 0.4+0.8 to 0.5+1.0
    });
  });

  return (
    <>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.15 * intensity} color="#440000" />
      {/* Primary dynamic crimson directional light - enhanced */}
      <directionalLight ref={dirLightRef} position={[3, 4, 2]} color="#ff0000" intensity={1.5 * intensity} castShadow />
      {/* Secondary fierce directional light */}
      <directionalLight position={[-2, -3, 1]} color="#cc0000" intensity={1.0 * intensity} />
      {/* atmospheric rim light behind scene - enhanced */}
      <pointLight ref={rimLightRef} position={[0, 0, -5]} color="#880000" intensity={0.4 * intensity} />
      {/* Additional dramatic point lights */}
      <pointLight position={[2, 2, 1]} color="#ff5500" intensity={0.6 * intensity} distance={6} />
      <pointLight position={[-2, -2, 1]} color="#bb0000" intensity={0.7 * intensity} distance={5} />
      {/* Skull illumination lights */}
      <pointLight position={[0, 1, -2.5]} color="#ffffff" intensity={0.4 * intensity} distance={8} />
      <pointLight position={[2, 0.5, -3.5]} color="#f0f0f0" intensity={0.3 * intensity} distance={7} />
      {/* Hibiscus flower accent lights */}
      <pointLight position={[0, -0.5, -1.5]} color="#ff8888" intensity={0.3 * intensity} distance={6} />
      <pointLight position={[1.5, -0.2, -2]} color="#ee6666" intensity={0.25 * intensity} distance={5} />
      {/* Ember orbital lights (created and managed in useFrame) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <pointLight key={i} ref={(el) => { if (el) emberLightsRef.current[i] = el; }} color={i % 2 ? '#ff8b55' : '#ff6666'} intensity={0.4 * intensity} distance={5} />
      ))}

      <group position={[0, 0, 0]}> 
        {/* Energy waves behind yantra - HIDDEN */}
        {/* <mesh position={[0, 0, -0.5]} renderOrder={-1}>
          <planeGeometry args={[8, 8]} />
          <primitive object={wavesMaterial} attach="material" />
        </mesh> */}

        {/* Eclipse aura behind yantra - HIDDEN */}
        {/* <mesh ref={eclipseRef} position={[0, 0, -1.5]} renderOrder={-3}>
          <planeGeometry args={[10, 10]} />
          <primitive object={eclipseMaterial} attach="material" />
        </mesh> */}

        {/* Central yantra plane */}
        <mesh ref={meshRef} position={[0, 0, 0]} renderOrder={0}>
          <planeGeometry args={[3, 3, 1, 1]} />
          {/* attach shader material */}
          <primitive object={yantraMaterial} attach="material" />
        </mesh>

        {/* Inner rotating layer for hypnotic effect */}
        <mesh ref={innerRef} position={[0, 0, 0.01]} renderOrder={1}>
          <planeGeometry args={[1.2, 1.2]} />
          <primitive object={innerMaterial} attach="material" />
        </mesh>

        {/* Glowing yantra symbols representing the fierce energy */}
        <GlowingSymbol position={[1.8, 1.2, 0.1]} size={0.4} intensity={intensity} />
        <GlowingSymbol position={[-1.6, -1.0, 0.1]} size={0.35} intensity={intensity} />
        <GlowingSymbol position={[1.2, -1.4, 0.1]} size={0.3} intensity={intensity} />
        <GlowingSymbol position={[-1.3, 1.5, 0.1]} size={0.45} intensity={intensity} />

        {/* Sacred mantra texts floating around */}
        <FloatingMantra text="शक्ति" position={[2.5, 1.8, 0.2]} intensity={intensity} />
        <FloatingMantra text="क्रीं" position={[-2.2, -1.5, 0.2]} intensity={intensity} />
        <FloatingMantra text="क्रीं" position={[2.0, -2.0, 0.2]} intensity={intensity} />
        <FloatingMantra text="क्लीं" position={[-2.0, 2.2, 0.2]} intensity={intensity} />

        {/* Particles: smoke, embers, ash (conditional) */}
        <ParticlesGroup enabled={enableParticles} />

      </group>
      {/* Post-processing composer (decoupled gating) */}
      {((enablePostFX ?? enableBloom) && (
        <EffectComposer multisampling={8} enableNormalPass={false}>
          {enableBloom && <Bloom intensity={3.0} luminanceThreshold={0.2} luminanceSmoothing={0.01} kernelSize={KernelSize.VERY_LARGE} mipmapBlur />}
          <Noise opacity={0.1} premultiply blendFunction={(BlendFunction.SCREEN as unknown) as number} />
          <Vignette eskil={false} offset={0.03} darkness={2.5} />
        </EffectComposer>
      ))}
    </>
  );
};

const MahakaliAnimatedBackground: React.FC<MahakaliAnimatedBackgroundProps> = ({ intensity = 1, enableParticles = true, enableBloom = false, enablePostFX = true, className }) => {
  return (
    <div className={className ?? 'fixed inset-0 z-0'}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} frameloop="always" dpr={[1, 2]} gl={{ antialias: true }}>
        <MahakaliScene intensity={intensity} enableParticles={!!enableParticles} enableBloom={!!enableBloom} enablePostFX={enablePostFX} />
        <OrbitControls enabled={false} enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default MahakaliAnimatedBackground;