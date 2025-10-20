import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  type: 'star' | 'sigil' | 'rune' | 'sparkle';
  rotation: number;
  rotationSpeed: number;
  color: string;
  phase: number;
  pulseSpeed: number;
}

interface Sigil {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: 'pentagram' | 'hexagram' | 'ankh' | 'caduceus';
  glow: number;
  pulsePhase: number;
}

const LakshmiBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const sigilsRef = useRef<Sigil[]>([]);
  const animationFrameRef = useRef<number>();
  // Removed mouse position state for static particles
  // const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeParticles();
      initializeSigils();
    };

    const initializeParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        const types: Particle['type'][] = ['star', 'sigil', 'rune', 'sparkle'];
        const colors = [
          '#FFD700', // Gold
          '#FFA500', // Orange
          '#FF8C00', // Dark Orange
          '#DAA520', // Goldenrod
          '#B8860B', // Dark Goldenrod
          '#F4A460', // Sandy Brown
          '#CD853F'  // Peru
        ];
        
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          type: types[Math.floor(Math.random() * types.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          color: colors[Math.floor(Math.random() * colors.length)],
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01
        });
      }
    };

    const initializeSigils = () => {
      const sigilCount = 8;
      sigilsRef.current = [];
      
      for (let i = 0; i < sigilCount; i++) {
        const types: Sigil['type'][] = ['pentagram', 'hexagram', 'ankh', 'caduceus'];
        
        sigilsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 60 + 40,
          opacity: Math.random() * 0.3 + 0.1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.005,
          type: types[Math.floor(Math.random() * types.length)],
          glow: Math.random() * 20 + 10,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    };

    const drawPentagram = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const outerRadius = size;
      const innerRadius = size * 0.382; // Golden ratio
      
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const px = x + Math.cos(angle - Math.PI / 2) * radius;
        const py = y + Math.sin(angle - Math.PI / 2) * radius;
        
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
    };

    const drawHexagram = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      // Draw two overlapping triangles
      for (let tri = 0; tri < 2; tri++) {
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI) / 3 + (tri * Math.PI);
          const px = x + Math.cos(angle) * size;
          const py = y + Math.sin(angle) * size;
          
          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }
    };

    const drawAnkh = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const scale = size / 30;
      
      // Cross part
      ctx.beginPath();
      ctx.moveTo(x, y + 10 * scale);
      ctx.lineTo(x, y + 30 * scale);
      ctx.moveTo(x - 8 * scale, y + 18 * scale);
      ctx.lineTo(x + 8 * scale, y + 18 * scale);
      ctx.stroke();
      
      // Loop part
      ctx.beginPath();
      ctx.arc(x, y + 2 * scale, 8 * scale, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawCaduceus = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const scale = size / 40;
      
      // Central staff
      ctx.beginPath();
      ctx.moveTo(x, y - 20 * scale);
      ctx.lineTo(x, y + 20 * scale);
      ctx.stroke();
      
      // Serpent curves
      for (let i = -1; i <= 1; i += 2) {
        ctx.beginPath();
        ctx.arc(x + i * 5 * scale, y - 10 * scale, 5 * scale, 0, Math.PI);
        ctx.arc(x - i * 5 * scale, y, 5 * scale, 0, Math.PI);
        ctx.arc(x + i * 5 * scale, y + 10 * scale, 5 * scale, 0, Math.PI);
        ctx.stroke();
      }
      
      // Wings at top
      ctx.beginPath();
      ctx.ellipse(x - 8 * scale, y - 18 * scale, 6 * scale, 3 * scale, -0.3, 0, Math.PI * 2);
      ctx.ellipse(x + 8 * scale, y - 18 * scale, 6 * scale, 3 * scale, 0.3, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawSigil = (ctx: CanvasRenderingContext2D, sigil: Sigil) => {
      ctx.save();
      ctx.translate(sigil.x, sigil.y);
      ctx.rotate(sigil.rotation);
      
      // Create glow effect
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, sigil.size + sigil.glow);
      gradient.addColorStop(0, `rgba(255, 215, 0, ${sigil.opacity})`);
      gradient.addColorStop(0.5, `rgba(255, 165, 0, ${sigil.opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.shadowBlur = sigil.glow;
      ctx.shadowColor = '#FFD700';
      
      switch (sigil.type) {
        case 'pentagram':
          drawPentagram(ctx, 0, 0, sigil.size);
          ctx.stroke();
          break;
        case 'hexagram':
          drawHexagram(ctx, 0, 0, sigil.size);
          break;
        case 'ankh':
          drawAnkh(ctx, 0, 0, sigil.size);
          break;
        case 'caduceus':
          drawCaduceus(ctx, 0, 0, sigil.size);
          break;
      }
      
      ctx.restore();
    };

    const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle, time: number) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      const pulsedOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(time * particle.pulseSpeed + particle.phase));
      
      ctx.fillStyle = particle.color.replace(')', `, ${pulsedOpacity})`).replace('rgb', 'rgba');
      ctx.shadowBlur = particle.size * 2;
      ctx.shadowColor = particle.color;
      
      switch (particle.type) {
        case 'star':
          // 5-pointed star
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5;
            const radius = i % 2 === 0 ? particle.size : particle.size * 0.5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'sparkle':
          // Diamond sparkle
          ctx.beginPath();
          ctx.moveTo(0, -particle.size);
          ctx.lineTo(particle.size * 0.3, 0);
          ctx.lineTo(0, particle.size);
          ctx.lineTo(-particle.size * 0.3, 0);
          ctx.closePath();
          ctx.fill();
          break;
          
        case 'sigil':
          // Small mystical symbol
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add inner symbol
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(-particle.size * 0.5, 0);
          ctx.lineTo(particle.size * 0.5, 0);
          ctx.moveTo(0, -particle.size * 0.5);
          ctx.lineTo(0, particle.size * 0.5);
          ctx.stroke();
          break;
          
        case 'rune':
          // Simple runic shape
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-particle.size, -particle.size);
          ctx.lineTo(particle.size, particle.size);
          ctx.moveTo(-particle.size * 0.5, -particle.size);
          ctx.lineTo(particle.size * 0.5, -particle.size);
          ctx.stroke();
          break;
      }
      
      ctx.restore();
    };

    const animate = (time: number) => {
      ctx.fillStyle = 'rgba(25, 17, 8, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw sigils
      sigilsRef.current.forEach(sigil => {
        sigil.rotation += sigil.rotationSpeed;
        sigil.pulsePhase += 0.01;
        sigil.glow = 15 + 10 * Math.sin(sigil.pulsePhase);
        
        // Gentle floating movement
        sigil.x += Math.sin(time * 0.0001 + sigil.pulsePhase) * 0.1;
        sigil.y += Math.cos(time * 0.0001 + sigil.pulsePhase) * 0.1;
        
        // Wrap around screen
        if (sigil.x < -sigil.size) sigil.x = canvas.width + sigil.size;
        if (sigil.x > canvas.width + sigil.size) sigil.x = -sigil.size;
        if (sigil.y < -sigil.size) sigil.y = canvas.height + sigil.size;
        if (sigil.y > canvas.height + sigil.size) sigil.y = -sigil.size;
        
        drawSigil(ctx, sigil);
      });
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        particle.phase += particle.pulseSpeed;
        
        // Removed mouse interaction - particles are now static
        // const dx = mousePos.x - particle.x;
        // const dy = mousePos.y - particle.y;
        // const distance = Math.sqrt(dx * dx + dy * dy);
        // 
        // if (distance < 150) {
        //   const force = (150 - distance) / 150 * 0.001;
        //   particle.vx += dx * force;
        //   particle.vy += dy * force;
        // }
        
        // Gentle drift towards center
        particle.vx += (canvas.width / 2 - particle.x) * 0.000001;
        particle.vy += (canvas.height / 2 - particle.y) * 0.000001;
        
        // Damping to prevent excessive speed
        particle.vx *= 0.999;
        particle.vy *= 0.999;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        drawParticle(ctx, particle, time);
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Removed mouse interaction - particles are now static
    // const handleMouseMove = (e: MouseEvent) => {
    //   const rect = canvas.getBoundingClientRect();
    //   setMousePos({
    //     x: e.clientX - rect.left,
    //     y: e.clientY - rect.top
    //   });
    // };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    // canvas.addEventListener('mousemove', handleMouseMove); // Removed mouse listener
    
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      // canvas.removeEventListener('mousemove', handleMouseMove); // Removed mouse listener
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);



  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <div 
        className="absolute inset-0 opacity-30 z-10"
        style={{
          backgroundImage: 'url(/themes/lakshmi/assets/lakshmi-yantra.svg)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      {/* Fixed yantra that's always visible and not affected by cursor */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-50 z-20 pointer-events-none"
        style={{
          backgroundImage: 'url(/themes/lakshmi/assets/lakshmi-yantra.svg)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.7))'
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default LakshmiBackground;