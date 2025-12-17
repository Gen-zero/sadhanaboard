import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home,
  BookHeart, 
  CheckSquare, 
  Sparkles, 
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useThemeColors } from '@/hooks/useThemeColors';

interface BottomNavigationItem {
  name: string;
  icon: React.ComponentType<any>;
  path: string;
}

const BottomNavigationBar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const { colors } = useThemeColors();

  const navItems: BottomNavigationItem[] = [
    { name: t('saadhana_board'), icon: BookHeart, path: '/sadhana' },
    { name: t('sadhanas'), icon: CheckSquare, path: '/saadhanas' },
    // Hidden: { name: t('your_yantras'), icon: Sparkles, path: '/your-atma-yantra' },
    { name: user ? t('profile') : t('account'), icon: User, path: user ? '/profile' : '/login' }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.nav 
      className="fixed bottom-3 left-3 right-3 z-50 backdrop-blur-lg rounded-2xl shadow-2xl pb-safe"
      style={{
        background: `linear-gradient(135deg, hsl(${colors.primary}/0.85), hsl(${colors.secondary}/0.95))`,
        border: `1px solid hsl(${colors.accent}/0.3)`
      }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center p-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-3 px-1 rounded-xl transition-all duration-300 touch-target-xl relative ${active ? 'scale-105' : ''}`}
              style={{
                color: active 
                  ? `hsl(${colors.accent})` 
                  : `hsl(${colors.foreground}/0.7)`
              }}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <div 
                  className="absolute -top-1 w-6 h-1 rounded-full shadow-lg mx-auto left-1/2 transform -translate-x-1/2"
                  style={{
                    background: `linear-gradient(90deg, hsl(${colors.accent}), hsl(${colors.accent}/0.8))`,
                    boxShadow: `0 0 8px hsl(${colors.accent}/0.5)`
                  }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex flex-col items-center justify-center"
              >
                <Icon className={`w-6 h-6 transition-all duration-300 ${active ? 'scale-110' : ''}`} />
                <span className="text-[11px] mt-1 font-medium truncate w-full text-center tracking-wide">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNavigationBar;