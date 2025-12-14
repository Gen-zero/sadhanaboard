import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import SaadhanaBoard from "@/components/SaadhanaBoard";
import { useSettings } from "@/hooks/useSettings";



const SadhanaPage = () => {
  const { settings } = useSettings();
  const [hasVisited, setHasVisited] = useState(false);


  useEffect(() => {


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
      {/* Cosmic particles removed per user request */}

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