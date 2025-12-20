import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  pulseDirection: number;
}

const DurgaBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system for the background
    let particles: Particle[] = [];
    const particleCount = 100;

    // Initialize particles
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 50 + 50)}, ${Math.floor(Math.random() * 50 + 50)}, ${Math.random() * 0.5 + 0.3})`,
          alpha: Math.random() * 0.5 + 0.2,
          pulseDirection: Math.random() > 0.5 ? 1 : -1
        });
      }
    };

    initParticles();

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas with a dark red background
      ctx.fillStyle = 'rgba(40, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.alpha += 0.005 * particle.pulseDirection;
        
        if (particle.alpha <= 0.2 || particle.alpha >= 0.7) {
          particle.pulseDirection *= -1;
        }
        
        // Reset particles that go off screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at center, #8B000080, #40000040, transparent)',
        }}
      />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/themes/durga/assets/Durga-yantra.svg)',
          backgroundSize: '40%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          animation: 'durga-yantra-rotate 80s linear infinite'
        }}
      />
      {/* Animated Sanskrit words */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-2xl font-bold durga-animated-text">
          शक्ति
        </div>
        <div className="absolute top-1/3 right-1/3 text-2xl font-bold durga-animated-text">
          महिषासुरमर्दिनी
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-2xl font-bold durga-animated-text">
          अम्बा
        </div>
        <div className="absolute bottom-1/4 right-1/4 text-2xl font-bold durga-animated-text">
          दुर्गा
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold durga-animated-text">
          भवानी
        </div>
      </div>
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
          
          @keyframes durga-text-giggle {
            0%, 100% {
              transform: translateY(0) rotate(0deg) scale(1);
              text-shadow: 
                0 0 5px rgba(255, 69, 0, 0.7),
                0 0 10px rgba(255, 69, 0, 0.5);
            }
            25% {
              transform: translateY(-2px) rotate(-1deg) scale(1.02);
              text-shadow: 
                0 0 8px rgba(255, 69, 0, 0.9),
                0 0 15px rgba(255, 69, 0, 0.7);
            }
            50% {
              transform: translateY(0) rotate(0deg) scale(0.98);
              text-shadow: 
                0 0 5px rgba(255, 69, 0, 0.7),
                0 0 10px rgba(255, 69, 0, 0.5);
            }
            75% {
              transform: translateY(2px) rotate(1deg) scale(1.01);
              text-shadow: 
                0 0 10px rgba(255, 69, 0, 1),
                0 0 20px rgba(255, 69, 0, 0.8);
            }
          }
          
          .durga-animated-text {
            display: inline-block;
            animation: durga-text-giggle 2.5s ease-in-out infinite;
            color: #ff6347;
            font-family: 'Source Serif 4', serif;
          }
          
          .durga-animated-text:nth-child(2n) {
            animation-delay: 0.2s;
          }
          
          .durga-animated-text:nth-child(3n) {
            animation-delay: 0.4s;
          }
          
          .durga-animated-text:nth-child(4n) {
            animation-delay: 0.6s;
          }
          
          .durga-animated-text:nth-child(5n) {
            animation-delay: 0.8s;
          }
        `}
      </style>
    </div>
  );
};

export default DurgaBackground;
