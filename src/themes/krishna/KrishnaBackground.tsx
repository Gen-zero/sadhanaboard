import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  type: 'peacock-feather' | 'flute-note' | 'lotus' | 'sparkle' | 'jasmine' | 'mogra';
  rotation: number;
  rotationSpeed: number;
  color: string;
  phase: number;
  pulseSpeed: number;
}

interface SymbolItem {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: 'om' | 'lotus' | 'peacock' | 'flute' | 'jasmine' | 'mogra' | 'tulsi';
  glow: number;
  pulsePhase: number;
}

const KrishnaBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const symbolsRef = useRef<SymbolItem[]>([]);
  const animationRef = useRef<number | null>(null);
  // store mouse in a ref to avoid re-render/effect re-runs on every pointer move
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
      initSymbols();
    };

    const initParticles = () => {
      const count = Math.max(100, Math.floor((canvas.width * canvas.height) / 15000));
      particlesRef.current = [];

      const colors = ['#D2691E', '#CD853F', '#DAA520', '#B8860B', '#8B4513', '#A0522D', '#FFFACD', '#FFE4B5'];
      const types: Particle['type'][] = ['peacock-feather', 'flute-note', 'lotus', 'sparkle', 'jasmine', 'mogra'];

      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          type: types[Math.floor(Math.random() * types.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          color: colors[Math.floor(Math.random() * colors.length)],
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.005
        });
      }
    };

    // helper to convert hex color to rgba string with alpha
    const hexToRgba = (hex: string, alpha = 1): string => {
      const h = hex.replace('#', '');
      const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const initSymbols = () => {
      const count = 12;
      symbolsRef.current = [];
      const types: SymbolItem['type'][] = ['om', 'lotus', 'peacock', 'flute', 'jasmine', 'mogra', 'tulsi'];

      for (let i = 0; i < count; i++) {
        symbolsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 80 + 40,
          opacity: Math.random() * 0.35 + 0.08,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.002,
          type: types[Math.floor(Math.random() * types.length)],
          glow: Math.random() * 18 + 6,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    };

    const drawLotus = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      const petals = 6;
      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(Math.cos(angle) * size * 0.35, Math.sin(angle) * size * 0.35, size * 0.45, size * 0.2, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawJasmine = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      
      // Draw star-shaped jasmine flower
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const x1 = Math.cos(angle) * size * 0.8;
        const y1 = Math.sin(angle) * size * 0.8;
        if (i === 0) {
          ctx.moveTo(x1, y1);
        } else {
          ctx.lineTo(x1, y1);
        }
        
        // Draw petals between main points
        const midAngle = ((i + 0.5) * Math.PI * 2) / 5;
        const x2 = Math.cos(midAngle) * size * 0.4;
        const y2 = Math.sin(midAngle) * size * 0.4;
        ctx.lineTo(x2, y2);
      }
      ctx.closePath();
      ctx.fill();
      
      // Draw center
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFACD';
      ctx.fill();
      ctx.restore();
    };

    const drawMogra = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      
      // Draw mogra (jasmine) flower cluster
      const clusters = 5;
      for (let i = 0; i < clusters; i++) {
        const angle = (i / clusters) * Math.PI * 2;
        const offsetX = Math.cos(angle) * size * 0.3;
        const offsetY = Math.sin(angle) * size * 0.3;
        
        ctx.beginPath();
        ctx.arc(offsetX, offsetY, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw center
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFACD';
      ctx.fill();
      ctx.restore();
    };

    const drawTulsi = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      
      // Draw tulsi leaf pattern
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.8);
      ctx.bezierCurveTo(
        size * 0.4, -size * 0.4,
        size * 0.3, size * 0.2,
        0, size * 0.6
      );
      ctx.bezierCurveTo(
        -size * 0.3, size * 0.2,
        -size * 0.4, -size * 0.4,
        0, -size * 0.8
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawOm = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.font = `${Math.max(12, size * 0.7)}px Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ॐ', 0, 0);
      ctx.restore();
    };

    const drawPeacock = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x, y);
      // simple feather arc
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(size * 0.6, -size * 0.6, size, 0);
      ctx.quadraticCurveTo(size * 0.6, size * 0.6, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    const drawFlute = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.save();
      ctx.translate(x - size * 0.4, y);
      ctx.fillRect(0, -size * 0.06, size * 0.8, size * 0.12);
      ctx.restore();
    };

    const drawSymbol = (ctx: CanvasRenderingContext2D, s: SymbolItem) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, s.size + s.glow);
      grad.addColorStop(0, `rgba(218,165,32,${s.opacity})`);
      grad.addColorStop(0.6, `rgba(160,110,60,${s.opacity * 0.7})`);
      grad.addColorStop(1, 'rgba(160,110,60,0)');

      ctx.fillStyle = grad;
      ctx.shadowBlur = s.glow;
      ctx.shadowColor = 'rgba(218,165,32,0.8)';

      switch (s.type) {
        case 'lotus':
          drawLotus(ctx, 0, 0, s.size);
          break;
        case 'jasmine':
          ctx.fillStyle = `rgba(255,250,205,${s.opacity})`;
          drawJasmine(ctx, 0, 0, s.size);
          break;
        case 'mogra':
          ctx.fillStyle = `rgba(255,228,181,${s.opacity})`;
          drawMogra(ctx, 0, 0, s.size);
          break;
        case 'tulsi':
          ctx.fillStyle = `rgba(0,100,0,${s.opacity})`;
          drawTulsi(ctx, 0, 0, s.size);
          break;
        case 'om':
          ctx.fillStyle = `rgba(218,165,32,${s.opacity})`;
          drawOm(ctx, 0, 0, s.size);
          break;
        case 'peacock':
          ctx.fillStyle = `rgba(165,105,60,${s.opacity})`;
          drawPeacock(ctx, 0, 0, s.size);
          break;
        case 'flute':
          ctx.fillStyle = `rgba(180,110,60,${s.opacity})`;
          drawFlute(ctx, 0, 0, s.size);
          break;
      }

      ctx.restore();
    };

    const drawParticle = (ctx: CanvasRenderingContext2D, p: Particle, t: number) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

  const pulsed = p.opacity * (0.65 + 0.35 * Math.sin(t * p.pulseSpeed + p.phase));

  // ensure fillStyle is rgba with pulsing alpha; keep shadowColor as opaque base hex for a warm glow
  ctx.fillStyle = hexToRgba(p.color, pulsed);
  ctx.shadowBlur = p.size * 2;
  ctx.shadowColor = p.color;

      switch (p.type) {
        case 'sparkle':
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.3, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.3, 0);
          ctx.closePath();
          ctx.fill();
          break;
        case 'lotus':
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.9, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'jasmine':
          // Small star shape for jasmine
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const x = Math.cos(angle) * p.size;
            const y = Math.sin(angle) * p.size;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.fill();
          break;
        case 'mogra':
          // Small circle clusters for mogra
          ctx.beginPath();
          ctx.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.4, 0, Math.PI * 2);
          ctx.arc(p.size * 0.3, -p.size * 0.3, p.size * 0.4, 0, Math.PI * 2);
          ctx.arc(0, p.size * 0.3, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'flute-note':
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'peacock-feather':
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.2, p.size * 0.5, p.rotation, 0, Math.PI * 2);
          ctx.fill();
          break;
      }

      ctx.restore();
    };

    const animate = (time: number) => {
      if (!ctx) return;

      ctx.fillStyle = 'rgba(48,32,16,0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // symbols
      symbolsRef.current.forEach(s => {
        s.rotation += s.rotationSpeed;
        s.pulsePhase += 0.008;
        s.glow = 8 + 8 * Math.sin(s.pulsePhase);
        s.x += Math.sin(time * 0.00008 + s.pulsePhase) * 0.15;
        s.y += Math.cos(time * 0.00008 + s.pulsePhase) * 0.15;

        if (s.x < -s.size) s.x = canvas.width + s.size;
        if (s.x > canvas.width + s.size) s.x = -s.size;
        if (s.y < -s.size) s.y = canvas.height + s.size;
        if (s.y > canvas.height + s.size) s.y = -s.size;

        drawSymbol(ctx, s);
      });

      // particles
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.phase += p.pulseSpeed;

        // mouse attraction gentle (read from ref to avoid effect re-runs)
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const f = (160 - dist) / 160 * 0.0009;
          p.vx += dx * f;
          p.vy += dy * f;
        }

        // gentle central drift
        p.vx += (canvas.width / 2 - p.x) * 0.0000008;
        p.vy += (canvas.height / 2 - p.y) * 0.0000008;

        p.vx *= 0.998;
        p.vy *= 0.998;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        drawParticle(ctx, p, time);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouse = (e: MouseEvent) => {
      // write client coordinates directly to ref. Using clientX/clientY is fine since canvas sits at the viewport origin.
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };


  // initialize once
  resize();
  window.addEventListener('resize', resize);
  // canvas has pointer-events-none; listen on window for pointer movement
  window.addEventListener('mousemove', handleMouse);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('/themes/earth/assets/Bhagwan_Krishna.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
    </div>
  );
};

export default KrishnaBackground;
