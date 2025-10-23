import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Flame, Sparkles } from "lucide-react";

const ThemeToggle = () => {
  const location = useLocation();
  
  // Determine which theme we're currently on
  const isMahakaliTheme = location.pathname === '/MahakaliLandingpage' || location.pathname === '/mahakalilandingpage';
  
  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-[999998]">
      {isMahakaliTheme ? (
        // Button to switch to Divine theme
        <Button 
          asChild
          className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-white rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-400/50"
          style={{ 
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)',
          }}
        >
          <Link to="/landingpage" title="Switch to Divine Theme">
            <Sparkles className="h-6 w-6" />
          </Link>
        </Button>
      ) : (
        // Button to switch to Mahakali theme
        <Button 
          asChild
          className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-800 hover:to-black text-white rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300 border border-red-700/50"
          style={{ 
            boxShadow: '0 0 15px rgba(220, 38, 38, 0.5)',
          }}
        >
          <Link to="/MahakaliLandingpage" title="Switch to Mahakali Theme">
            <Flame className="h-6 w-6" />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default ThemeToggle;