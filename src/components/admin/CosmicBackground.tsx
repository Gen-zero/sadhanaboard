import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const CosmicBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Handle mouse movement for parallax effect
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Create stars with different sizes and colors
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const starsVertices = [];
    const starsColors = [];
    const starCount = 10000;
    
    for (let i = 0; i < starCount; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);
      starsVertices.push(x, y, z);
      
      // Random star colors (white, blue, purple)
      const colors = [
        new THREE.Color(0xffffff), // White
        new THREE.Color(0x8a2be2), // Purple
        new THREE.Color(0x00bfff), // Blue
        new THREE.Color(0xffd700)  // Gold
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      starsColors.push(color.r, color.g, color.b);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
    starsMaterial.vertexColors = true;
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create nebula clouds
    const nebulaGroup = new THREE.Group();
    const nebulaCount = 15;
    
    for (let i = 0; i < nebulaCount; i++) {
      const nebulaGeometry = new THREE.SphereGeometry(
        THREE.MathUtils.randFloat(50, 150), 
        32, 
        32
      );
      
      const nebulaMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(
          Math.random() * 0.5 + 0.5,
          Math.random() * 0.3,
          Math.random() * 0.5 + 0.5
        ),
        transparent: true,
        opacity: Math.random() * 0.05 + 0.02,
        side: THREE.BackSide
      });
      
      const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
      nebula.position.set(
        THREE.MathUtils.randFloatSpread(1000),
        THREE.MathUtils.randFloatSpread(1000),
        THREE.MathUtils.randFloatSpread(1000)
      );
      
      nebulaGroup.add(nebula);
    }
    
    scene.add(nebulaGroup);

    // Position camera
    camera.position.z = 500;

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate stars and nebula slowly
      stars.rotation.x += 0.0001;
      stars.rotation.y += 0.0002;
      
      // Rotate nebula group in opposite direction
      nebulaGroup.rotation.x -= 0.00005;
      nebulaGroup.rotation.y -= 0.0001;
      
      // Apply parallax effect based on mouse position
      camera.position.x = mousePosition.current.x * 10;
      camera.position.y = mousePosition.current.y * 10;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-[-1]" />;
};

export default CosmicBackground;