
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SacredYantraProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
}

const SacredYantra = ({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = 1.5, // Increased default scale for more zoom
  color = "#f5b042" 
}: SacredYantraProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Create custom shader for glow effect
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(color) },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          float alpha = smoothstep(0.5, 0.2, dist);
          alpha *= 0.8 + 0.2 * sin(time * 2.0);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [color]);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Complex rotation pattern
      meshRef.current.rotation.z += 0.001;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
      
      // Pulsing scale effect with increased amplitude
      const pulseScale = scale * (1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.08);
      meshRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    }
    
    if (glowRef.current) {
      // Update shader time uniform
      (glowRef.current.material as THREE.ShaderMaterial).uniforms.time.value = state.clock.getElapsedTime();
      
      // Make glow larger than the yantra
      const glowScale = scale * 1.4 * (1 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.12);
      glowRef.current.scale.set(glowScale, glowScale, glowScale);
    }
  });

  // Create the yantra shape with more complex sacred geometry
  const createYantraShape = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Complex yantra with multiple shapes
    const segments = 120; // Higher segments for smoother curves
    const radius = 2.2; // Increased radius
    
    // Start point
    shape.moveTo(radius, 0);
    
    // Create outer circle
    for (let i = 1; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      shape.lineTo(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius
      );
    }
    
    // Create inner triangle
    const triangleShape = new THREE.Shape();
    const triangleSize = radius * 0.85; // Larger triangle
    triangleShape.moveTo(0, triangleSize);
    triangleShape.lineTo(-triangleSize * Math.sqrt(3)/2, -triangleSize/2);
    triangleShape.lineTo(triangleSize * Math.sqrt(3)/2, -triangleSize/2);
    triangleShape.lineTo(0, triangleSize);
    
    // Create inner hexagon
    const hexagonShape = new THREE.Shape();
    const hexRadius = radius * 0.6; // Larger hexagon
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * hexRadius;
      const y = Math.sin(angle) * hexRadius;
      if (i === 0) hexagonShape.moveTo(x, y);
      else hexagonShape.lineTo(x, y);
    }
    hexagonShape.closePath();
    
    // Create star shape
    const starShape = new THREE.Shape();
    const outerRadius = radius * 0.4; // Larger star
    const innerRadius = radius * 0.2;
    const spikes = 9; // Sacred number
    
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i / (spikes * 2)) * Math.PI * 2;
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();
    
    shape.holes.push(triangleShape);
    shape.holes.push(hexagonShape);
    shape.holes.push(starShape);
    
    return shape;
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Glow effect */}
      <mesh ref={glowRef} renderOrder={-1}>
        <planeGeometry args={[6, 6]} /> {/* Larger plane for glow */}
        <primitive object={glowMaterial} attach="material" />
      </mesh>
      
      {/* Yantra shape */}
      <mesh ref={meshRef} castShadow>
        <shapeGeometry args={[createYantraShape]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.7}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.8} // Increased emissive intensity
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default SacredYantra;
