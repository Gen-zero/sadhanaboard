import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import SaadhanaBoard from "@/components/SaadhanaBoard";
import { useSettings } from "@/hooks/useSettings";

const CosmicParticle = ({ delay }: { delay: number }) => {
  return (
    <div 
      className="absolute rounded-full opacity-0"
      style={{
        backgroundColor: 'hsl(var(--primary) / 0.7)', // Use theme primary color with opacity
        width: `${Math.random() * 4 + 1}px`,
        height: `${Math.random() * 4 + 1}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite, 
                    cosmic-pulse ${Math.random() * 6 + 3}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: Math.random() * 0.7 + 0.3,
        zIndex: 0,
        boxShadow: '0 0 8px hsl(var(--primary) / 0.7), 0 0 16px hsl(var(--primary) / 0.7)',
        transition: 'all 0.3s ease-in-out'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(2)';
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.boxShadow = '0 0 20px hsl(var(--primary) / 1), 0 0 30px hsl(var(--primary) / 1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.opacity = (Math.random() * 0.7 + 0.3).toString();
        e.currentTarget.style.boxShadow = '0 0 8px hsl(var(--primary) / 0.7), 0 0 16px hsl(var(--primary) / 0.7)';
      }}
    ></div>
  );
};

const SadhanaPage = () => {
  const { settings } = useSettings();
  const [hasVisited, setHasVisited] = useState(false);
  const [cosmicParticles, setCosmicParticles] = useState<number[]>([]);
  
  useEffect(() => {
    // Create cosmic particles
    const particles = Array.from({ length: 50 }, (_, i) => i); // Reduce particles for mobile performance
    setCosmicParticles(particles);
    
    // Play ethereal sound on first visit
    if (!localStorage.getItem('visited-sadhana')) {
      localStorage.setItem('visited-sadhana', 'true');
      
      try {
        const audio = new Audio('/sounds/cosmic-enter.mp3');
        audio.volume = 0.2;
        audio.play();
      } catch (err) {
        console.log('Audio could not be played automatically');
      }
    }
    
    setHasVisited(true);
  }, []);

  // Check if Shiva theme is active
  const isShivaTheme = settings?.appearance?.colorScheme === 'shiva';

  return (
    <Layout>
      {/* Cosmic particles - hidden for Shiva theme */}
      <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${isShivaTheme ? 'hidden' : 'hidden md:block'}`}>
        {cosmicParticles.map((_, index) => (
          <CosmicParticle key={index} delay={index * 0.05} />
        ))}
      </div>
      
      {/* Entrance animation */}
      <div className={`transition-all duration-1000 transform relative z-10 bg-transparent ${hasVisited ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <SaadhanaBoard />
      </div>
      
      {/* Custom styles for cosmic animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(15px, 15px) rotate(5deg); }
          50% { transform: translate(0, 30px) rotate(0deg); }
          75% { transform: translate(-15px, 15px) rotate(-5deg); }
        }
        
        @keyframes cosmic-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.3); }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .cosmic-bg {
            background-attachment: scroll; /* Improve mobile performance */
          }
        }
      `}</style>
    </Layout>
  );
};

export default SadhanaPage;