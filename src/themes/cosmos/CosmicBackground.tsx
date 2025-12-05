import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface CosmicBackgroundProps {
  className?: string;
}

const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ className = '' }) => {
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
      
      // Random star colors (white, blue, purple, gold)
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

    // Create solar system with a central sun and orbiting planets
    const solarSystemGroup = new THREE.Group();
    
    // Central Sun - Large glowing star
    const sunGeometry = new THREE.SphereGeometry(200, 64, 64);
    const sunMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(1.0, 0.9, 0.3), // Bright yellow
      emissive: new THREE.Color(1.0, 0.7, 0.2), // Strong glow
      emissiveIntensity: 2.5,
      roughness: 0.2,
      metalness: 0.8
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 0, 0);
    solarSystemGroup.add(sun);
    
    // Sun's corona effect
    const coronaGeometry = new THREE.SphereGeometry(220, 64, 64);
    const coronaMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(1.0, 0.8, 0.4),
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    solarSystemGroup.add(corona);
    
    // Create orbit paths (invisible, just for reference)
    const createOrbit = (radius) => {
      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        orbitPoints.push(
          Math.cos(theta) * radius,
          0,
          Math.sin(theta) * radius
        );
      }
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      return orbitGeometry;
    };
    
    // Create orbiting planets with orbital motion
    // Planet 1 - Mercury (closest to sun)
    const mercuryGroup = new THREE.Group();
    const mercuryOrbitGroup = new THREE.Group();
    const mercuryGeometry = new THREE.SphereGeometry(30, 32, 32);
    const mercuryMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.5, 0.5, 0.5), // Gray
      roughness: 0.9,
      metalness: 0.1,
      emissive: new THREE.Color(0.5, 0.5, 0.5), // Gray glow
      emissiveIntensity: 0.8
    });
    const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
    mercury.position.set(240, 0, 0); // Distance from sun
    mercuryOrbitGroup.add(mercury);
    mercuryGroup.add(mercuryOrbitGroup);
    solarSystemGroup.add(mercuryGroup);
    
    // Planet 2 - Venus
    const venusGroup = new THREE.Group();
    const venusOrbitGroup = new THREE.Group();
    const venusGeometry = new THREE.SphereGeometry(40, 32, 32);
    const venusMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.8, 0.6, 0.2), // Yellowish
      emissive: new THREE.Color(0.8, 0.6, 0.2), // Yellowish glow
      emissiveIntensity: 1.0,
      roughness: 0.8,
      metalness: 0.2
    });
    const venus = new THREE.Mesh(venusGeometry, venusMaterial);
    venus.position.set(360, 0, 0); // Distance from sun
    venusOrbitGroup.add(venus);
    venusGroup.add(venusOrbitGroup);
    solarSystemGroup.add(venusGroup);
    
    // Planet 3 - Earth
    const earthGroup = new THREE.Group();
    const earthOrbitGroup = new THREE.Group();
    const earthGeometry = new THREE.SphereGeometry(44, 32, 32);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.2, 0.4, 0.8), // Blue
      emissive: new THREE.Color(0.2, 0.4, 0.8), // Blue glow
      emissiveIntensity: 1.0,
      roughness: 0.7,
      metalness: 0.3
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(480, 0, 0); // Distance from sun
    earthOrbitGroup.add(earth);
    
    // Earth's atmosphere
    const earthAtmosphereGeometry = new THREE.SphereGeometry(48, 32, 32);
    const earthAtmosphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.5, 0.7, 1.0),
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    const earthAtmosphere = new THREE.Mesh(earthAtmosphereGeometry, earthAtmosphereMaterial);
    earthAtmosphere.position.copy(earth.position);
    earthOrbitGroup.add(earthAtmosphere);
    
    earthGroup.add(earthOrbitGroup);
    solarSystemGroup.add(earthGroup);
    
    // Planet 4 - Mars
    const marsGroup = new THREE.Group();
    const marsOrbitGroup = new THREE.Group();
    const marsGeometry = new THREE.SphereGeometry(36, 32, 32);
    const marsMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.8, 0.3, 0.2), // Red
      emissive: new THREE.Color(0.8, 0.3, 0.2), // Red glow
      emissiveIntensity: 1.0,
      roughness: 0.8,
      metalness: 0.2
    });
    const mars = new THREE.Mesh(marsGeometry, marsMaterial);
    mars.position.set(600, 0, 0); // Distance from sun
    marsOrbitGroup.add(mars);
    marsGroup.add(marsOrbitGroup);
    solarSystemGroup.add(marsGroup);
    
    // Planet 5 - Jupiter (gas giant)
    const jupiterGroup = new THREE.Group();
    const jupiterOrbitGroup = new THREE.Group();
    const jupiterGeometry = new THREE.SphereGeometry(90, 64, 64);
    const jupiterMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.8, 0.7, 0.5), // Brownish
      emissive: new THREE.Color(0.8, 0.7, 0.5), // Brownish glow
      emissiveIntensity: 1.2,
      roughness: 0.6,
      metalness: 0.4
    });
    const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
    jupiter.position.set(800, 0, 0); // Distance from sun
    jupiterOrbitGroup.add(jupiter);
    
    // Jupiter's rings
    const jupiterRingGeometry = new THREE.RingGeometry(96, 120, 32);
    const jupiterRingMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.7, 0.6, 0.4),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const jupiterRing = new THREE.Mesh(jupiterRingGeometry, jupiterRingMaterial);
    jupiterRing.position.copy(jupiter.position);
    jupiterRing.rotation.x = Math.PI / 2;
    jupiterOrbitGroup.add(jupiterRing);
    
    jupiterGroup.add(jupiterOrbitGroup);
    solarSystemGroup.add(jupiterGroup);
    
    // Planet 6 - Saturn (with prominent rings)
    const saturnGroup = new THREE.Group();
    const saturnOrbitGroup = new THREE.Group();
    const saturnGeometry = new THREE.SphereGeometry(80, 64, 64);
    const saturnMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.8, 0.7, 0.4), // Yellowish
      emissive: new THREE.Color(0.8, 0.7, 0.4), // Yellowish glow
      emissiveIntensity: 1.2,
      roughness: 0.6,
      metalness: 0.4
    });
    const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
    saturn.position.set(1040, 0, 0); // Distance from sun
    saturnOrbitGroup.add(saturn);
    
    // Saturn's rings
    const saturnRingGeometry = new THREE.RingGeometry(100, 150, 64);
    const saturnRingMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.8, 0.7, 0.5),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
    saturnRing.position.copy(saturn.position);
    saturnRing.rotation.x = Math.PI / 3;
    saturnOrbitGroup.add(saturnRing);
    
    saturnGroup.add(saturnOrbitGroup);
    solarSystemGroup.add(saturnGroup);
    
    // Planet 7 - Uranus
    const uranusGroup = new THREE.Group();
    const uranusOrbitGroup = new THREE.Group();
    const uranusGeometry = new THREE.SphereGeometry(60, 32, 32);
    const uranusMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.5, 0.8, 0.9), // Light blue
      emissive: new THREE.Color(0.5, 0.8, 0.9), // Light blue glow
      emissiveIntensity: 1.1,
      roughness: 0.7,
      metalness: 0.3
    });
    const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
    uranus.position.set(1240, 0, 0); // Distance from sun
    uranusOrbitGroup.add(uranus);
    uranusGroup.add(uranusOrbitGroup);
    solarSystemGroup.add(uranusGroup);
    
    // Planet 8 - Neptune
    const neptuneGroup = new THREE.Group();
    const neptuneOrbitGroup = new THREE.Group();
    const neptuneGeometry = new THREE.SphereGeometry(56, 32, 32);
    const neptuneMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0.3, 0.4, 0.8), // Deep blue
      emissive: new THREE.Color(0.3, 0.4, 0.8), // Deep blue glow
      emissiveIntensity: 1.1,
      roughness: 0.7,
      metalness: 0.3
    });
    const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
    neptune.position.set(1440, 0, 0); // Distance from sun
    neptuneOrbitGroup.add(neptune);
    neptuneGroup.add(neptuneOrbitGroup);
    solarSystemGroup.add(neptuneGroup);
    
    scene.add(solarSystemGroup);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // Add point light for the sun
    const sunLight = new THREE.PointLight(0xffffcc, 3, 3000);
    sunLight.position.copy(sun.position);
    scene.add(sunLight);
    
    // Add additional point lights for each planet to enhance glow effect
    const mercuryLight = new THREE.PointLight(0x888888, 0.5, 200);
    mercuryLight.position.copy(mercury.position);
    scene.add(mercuryLight);
    
    const venusLight = new THREE.PointLight(0xffaa33, 0.7, 300);
    venusLight.position.copy(venus.position);
    scene.add(venusLight);
    
    const earthLight = new THREE.PointLight(0x3366ff, 0.7, 300);
    earthLight.position.copy(earth.position);
    scene.add(earthLight);
    
    const marsLight = new THREE.PointLight(0xff5533, 0.7, 250);
    marsLight.position.copy(mars.position);
    scene.add(marsLight);
    
    const jupiterLight = new THREE.PointLight(0xddbb88, 1.0, 500);
    jupiterLight.position.copy(jupiter.position);
    scene.add(jupiterLight);
    
    const saturnLight = new THREE.PointLight(0xddcc88, 1.0, 500);
    saturnLight.position.copy(saturn.position);
    scene.add(saturnLight);
    
    const uranusLight = new THREE.PointLight(0x88ccff, 0.8, 400);
    uranusLight.position.copy(uranus.position);
    scene.add(uranusLight);
    
    const neptuneLight = new THREE.PointLight(0x5566cc, 0.8, 400);
    neptuneLight.position.copy(neptune.position);
    scene.add(neptuneLight);

    // Position camera
    camera.position.z = 2500;

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
      
      // Rotate the entire solar system
      solarSystemGroup.rotation.y += 0.0002;
      
      // Orbital motion - rotate each planet group around the sun at different speeds
      mercuryGroup.rotation.y += 0.005; // Fastest orbit
      venusGroup.rotation.y += 0.004;
      earthGroup.rotation.y += 0.003;
      marsGroup.rotation.y += 0.0025;
      jupiterGroup.rotation.y += 0.0015;
      saturnGroup.rotation.y += 0.0012;
      uranusGroup.rotation.y += 0.0008;
      neptuneGroup.rotation.y += 0.0006; // Slowest orbit
      
      // Rotation on axis - rotate each planet on its own axis
      mercuryOrbitGroup.rotation.y += 0.02; // Fastest rotation
      venusOrbitGroup.rotation.y += 0.015;
      earthOrbitGroup.rotation.y += 0.012;
      marsOrbitGroup.rotation.y += 0.01;
      jupiterOrbitGroup.rotation.y += 0.008;
      saturnOrbitGroup.rotation.y += 0.006;
      uranusOrbitGroup.rotation.y += 0.004;
      neptuneOrbitGroup.rotation.y += 0.003;
      
      // Pulsing effect for the sun
      const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 1;
      sun.scale.set(pulse, pulse, pulse);
      corona.scale.set(pulse, pulse, pulse);
      
      // Update positions of point lights to follow planets
      mercuryLight.position.copy(mercury.position);
      venusLight.position.copy(venus.position);
      earthLight.position.copy(earth.position);
      marsLight.position.copy(mars.position);
      jupiterLight.position.copy(jupiter.position);
      saturnLight.position.copy(saturn.position);
      uranusLight.position.copy(uranus.position);
      neptuneLight.position.copy(neptune.position);
      
      // Apply parallax effect based on mouse position
      camera.position.x = mousePosition.current.x * 10;
      camera.position.y = mousePosition.current.y * 10;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    const currentMountRef = mountRef.current;
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (currentMountRef) {
        currentMountRef.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`fixed inset-0 z-[-1] ${className}`} />;
};

export default CosmicBackground;