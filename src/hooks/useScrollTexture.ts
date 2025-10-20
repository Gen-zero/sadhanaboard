
import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { createFallbackTexture, createDisplacementMap } from '@/utils/textureUtils';

export const useScrollTexture = () => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [fallbackActive, setFallbackActive] = useState(false);
  
  useEffect(() => {
    // First attempt to load the texture directly
    const loader = new THREE.TextureLoader();
    loader.load(
      '/textures/parchment.jpg',
      // Success callback
      (loadedTexture) => {
        console.log("Texture loaded successfully");
        setTexture(loadedTexture);
      },
      // Progress callback
      undefined,
      // Error callback
      (error) => {
        console.error("Failed to load parchment texture:", error);
        setFallbackActive(true);
        setTexture(createFallbackTexture());
      }
    );
    
    // Cleanup
    return () => {
      if (texture) texture.dispose();
    };
  }, []);

  // Create displacement map
  const displacement = createDisplacementMap();
  
  // Use fallback texture if texture loading fails or while loading
  const finalTexture = fallbackActive || !texture ? createFallbackTexture() : texture;

  return { finalTexture, displacement };
};
