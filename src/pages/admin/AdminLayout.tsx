import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/services/adminApi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Shield, 
  Users, 
  LineChart, 
  ImageIcon, 
  Activity,
  Home,
  Settings,
  Library,
  UserCheck,
  BarChart3
} from 'lucide-react';
import CosmicToastManager from '@/components/admin/CosmicToastManager';
import soundManager from '@/utils/soundManager';

// Import cosmic styles
import '@/styles/admin-cosmic.css';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const resp = await adminApi.me();
        if (!mounted) return;
        setUser(resp.user || resp);
      } catch (e: any) {
        // If unauthorized, redirect to login preserving returnTo
        navigate(`/admin/login?returnTo=${encodeURIComponent(location.pathname)}`);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [navigate, location.pathname]);

  // Handle mouse move for glow effects
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      navRef.current.style.setProperty('--mouse-x', `${x}px`);
      navRef.current.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            soundManager.playNavigationSound();
            navigate('/admin');
            break;
          case '2':
            e.preventDefault();
            soundManager.playNavigationSound();
            navigate('/admin/users');
            break;
          case '3':
            e.preventDefault();
            soundManager.playNavigationSound();
            navigate('/admin/community');
            break;
          case '4':
            e.preventDefault();
            soundManager.playNavigationSound();
            navigate('/admin/content');
            break;
          case '5':
            e.preventDefault();
            soundManager.playNavigationSound();
            navigate('/admin/system');
            break;
          case '6':
            e.preventDefault();
            soundManager.playNavigationSound();
            navigate('/admin/logs');
            break;
          case '7':
            e.preventDefault();
            soundManager.playNavigationSound();
            navigate('/admin/library');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } finally {
      window.location.href = '/admin/login';
    }
  };

  // Create particle trail effect
  const createParticleTrail = (fromElement: HTMLElement, toElement: HTMLElement) => {
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    
    const startX = fromRect.left + fromRect.width / 2;
    const startY = fromRect.top + fromRect.height / 2;
    const endX = toRect.left + toRect.width / 2;
    const endY = toRect.top + toRect.height / 2;
    
    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const progress = i / (particleCount - 1);
      const tx = (endX - startX) * progress;
      const ty = (endY - startY) * progress;
      
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  };

  // Navigation items with cosmic names
  const navItems = [
    { to: '/admin', icon: Home, label: '🌌 Cosmic Dashboard', tooltip: '🌌 Universal Command Center' },
    { to: '/admin/users', icon: Users, label: '👥 Soul Registry', tooltip: '👥 Manage All Souls in the System' },
    { to: '/admin/community', icon: UserCheck, label: '🪐 Community Nebula', tooltip: '🪐 View Community Constellations' },
    { to: '/admin/content', icon: ImageIcon, label: '🌠 Content Cosmos', tooltip: '🌠 Manage Universal Content' },
    { to: '/admin/system', icon: Activity, label: '⚡ System Prana', tooltip: '⚡ Monitor System Vitality' },
    { to: '/admin/logs', icon: Shield, label: '📜 Akashic Records', tooltip: '📜 View System Chronicles' },
    { to: '/admin/library', icon: Library, label: '📚 Library of Wisdom', tooltip: '📚 Access Sacred Texts' },
    { to: '/admin/settings', icon: Settings, label: '⚙️ Cosmic Settings', tooltip: '⚙️ Adjust Universal Parameters' },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="spinner" /></div>;

  if (error) return (
    <div className="container mx-auto p-6">
      <div className="text-red-600">{error}</div>
      <div className="mt-4">
        <Button onClick={() => { setError(null); setLoading(true); window.location.reload(); }}>Retry</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Cosmic Toast Manager */}
      <CosmicToastManager />
      
      {/* Cosmic Holo-Nav Sidebar */}
      <motion.nav 
        ref={navRef}
        className="holo-nav"
        onMouseMove={handleMouseMove}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="holo-nav-glow"></div>
        
        <div className="mb-8">
          <motion.div 
            className="text-xl font-bold text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🌌
          </motion.div>
          <AnimatePresence>
            {navRef.current && (
              <motion.div
                className="text-xs text-center mt-1 opacity-70"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.3 }}
              >
                SādhanaBoard
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex-1 w-full">
          {navItems.map((item, index) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              className={({ isActive }) => `holo-nav-item ${isActive ? 'active' : ''}`}
              onMouseEnter={() => setActiveTooltip(item.label)}
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={(e) => {
                // Create particle trail effect
                const activeElement = document.querySelector('.holo-nav-item.active');
                if (activeElement) {
                  createParticleTrail(activeElement as HTMLElement, e.currentTarget);
                }
                soundManager.playNavigationSound();
              }}
            >
              <div className="holo-nav-item-icon">
                <item.icon className="w-5 h-5" />
              </div>
              <span className="holo-nav-item-text">{item.label}</span>
              <AnimatePresence>
                {activeTooltip === item.label && !navRef.current?.matches(':hover') && (
                  <motion.div
                    className="cosmic-tooltip"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.tooltip}
                  </motion.div>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </div>
        
        <div className="mt-auto">
          <Button 
            variant="ghost" 
            size="icon"
            className="holo-nav-item w-full justify-center"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <div className="holo-nav-item-icon">
              <Shield className="w-5 h-5" />
            </div>
            <span className="holo-nav-item-text">🚪 Exit Cosmos</span>
          </Button>
        </div>
      </motion.nav>
      
      {/* Main Content Area */}
      <main className="admin-main-content flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Logout Confirmation */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div 
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-background/80 backdrop-blur-md p-6 rounded-lg shadow-xl border border-purple-500/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="mb-4">Are you sure you want to exit the cosmic realm?</div>
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
                <Button onClick={handleLogout} className="cosmic-button">Logout</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;