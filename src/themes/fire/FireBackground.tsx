import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  phase: number;
  pulseSpeed: number;
}

// Firework particle interface
interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

// Firework interface
interface Firework {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  exploded: boolean;
  particles: FireworkParticle[];
}

const FireBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const fireworksRef = useRef<Firework[]>([]);
  const lastFireworkTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeParticles();
    };

    const initializeParticles = () => {
      // Reduce particle count for better performance
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          color: i % 3 === 0 ? '#FF0000' : i % 3 === 1 ? '#FF8C00' : '#8B0000',
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.015 + 0.005
        });
      }
    };

    // Create a new firework
    const createFirework = (): Firework => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: -(Math.random() * 3 + 2),
        size: Math.random() * 3 + 2,
        color: ['#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#8B0000'][Math.floor(Math.random() * 5)],
        exploded: false,
        particles: []
      };
    };

    // Explode a firework
    const explodeFirework = (firework: Firework) => {
      firework.exploded = true;
      const particleCount = 50;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = Math.random() * 3 + 1;
        
        firework.particles.push({
          x: firework.x,
          y: firework.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2 + 1,
          opacity: 1,
          color: firework.color,
          life: 1,
          maxLife: Math.random() * 30 + 30
        });
      }
    };

    const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle, time: number) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      
      // Gentle pulsing effect
      const pulsedOpacity = particle.opacity * (0.8 + 0.2 * Math.sin(time * particle.pulseSpeed + particle.phase));
      const pulsedSize = particle.size * (0.9 + 0.1 * Math.sin(time * particle.pulseSpeed * 1.5 + particle.phase));
      
      ctx.fillStyle = particle.color.replace(')', `, ${pulsedOpacity})`).replace('rgb', 'rgba');
      ctx.shadowBlur = pulsedSize * 1.5;
      ctx.shadowColor = particle.color;
      
      // Simple circle particles for cleaner look
      ctx.beginPath();
      ctx.arc(0, 0, pulsedSize, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    // Draw firework
    const drawFirework = (ctx: CanvasRenderingContext2D, firework: Firework, time: number) => {
      if (!firework.exploded) {
        // Draw rising firework
        ctx.save();
        ctx.translate(firework.x, firework.y);
        
        ctx.fillStyle = firework.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = firework.color;
        
        ctx.beginPath();
        ctx.arc(0, 0, firework.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw trail
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-firework.vx * 3, -firework.vy * 3);
        ctx.strokeStyle = firework.color.replace(')', ', 0.5)').replace('rgb', 'rgba');
        ctx.lineWidth = firework.size / 2;
        ctx.stroke();
        
        ctx.restore();
      } else {
        // Draw exploded particles
        firework.particles.forEach((particle, index) => {
          if (particle.life <= 0) return;
          
          ctx.save();
          ctx.translate(particle.x, particle.y);
          
          const currentOpacity = particle.opacity * (particle.life / particle.maxLife);
          ctx.fillStyle = particle.color.replace(')', `, ${currentOpacity})`).replace('rgb', 'rgba');
          ctx.shadowBlur = particle.size * 2;
          ctx.shadowColor = particle.color;
          
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
          
          // Update particle
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.05; // Gravity
          particle.life -= 1;
          
          // Remove dead particles
          if (particle.life <= 0) {
            firework.particles.splice(index, 1);
          }
        });
        
        // Remove firework if all particles are gone
        if (firework.particles.length === 0) {
          const index = fireworksRef.current.indexOf(firework);
          if (index > -1) {
            fireworksRef.current.splice(index, 1);
          }
        }
      }
    };

    const animate = (time: number) => {
      // Lighter overlay for subtler effect
      ctx.fillStyle = 'rgba(40, 5, 5, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.phase += particle.pulseSpeed;
        
        // Very gentle movement toward center for subtle cohesion
        particle.vx += (canvas.width / 2 - particle.x) * 0.0000005;
        particle.vy += (canvas.height / 2 - particle.y) * 0.0000005;
        
        // Gentle damping
        particle.vx *= 0.995;
        particle.vy *= 0.995;
        
        // Wrap around screen
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;
        
        drawParticle(ctx, particle, time);
      });
      
      // Create new fireworks occasionally
      if (time - lastFireworkTimeRef.current > 1000 && Math.random() < 0.02) {
        fireworksRef.current.push(createFirework());
        lastFireworkTimeRef.current = time;
      }
      
      // Update and draw fireworks
      fireworksRef.current.forEach((firework, index) => {
        if (!firework.exploded) {
          // Update position
          firework.x += firework.vx;
          firework.y += firework.vy;
          
          // Apply gravity
          firework.vy += 0.02;
          
          // Explode when reaching peak or after some time
          if (firework.vy > -0.5 || Math.random() < 0.01) {
            explodeFirework(firework);
          }
          
          // Remove if off screen
          if (firework.y > canvas.height + 50 || firework.x < -50 || firework.x > canvas.width + 50) {
            fireworksRef.current.splice(index, 1);
          }
        }
        
        drawFirework(ctx, firework, time);
      });
      
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div 
        className="absolute inset-0 opacity-20 z-10"
        style={{
          background: 'radial-gradient(circle at center, #8B000080, #40000040, transparent)',
        }}
      />
      <div 
        className="absolute inset-0 opacity-80 z-30"
        style={{
          backgroundImage: 'url(/themes/fire/assets/Durga-yantra.svg)',
          backgroundSize: '50%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          animation: 'durga-yantra-rotate 60s linear infinite'
        }}
      />
      <style>
        {`
          @keyframes durga-yantra-rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default FireBackground;