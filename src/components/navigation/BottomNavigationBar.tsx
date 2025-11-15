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

interface BottomNavigationItem {
  name: string;
  icon: React.ComponentType<any>;
  path: string;
}

const BottomNavigationBar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();

  const navItems: BottomNavigationItem[] = [
    { name: t('saadhana_board'), icon: BookHeart, path: '/sadhana' },
    { name: t('sadhanas'), icon: CheckSquare, path: '/saadhanas' },
    { name: t('your_yantras'), icon: Sparkles, path: '/your-atma-yantra' },
    { name: user ? t('profile') : t('account'), icon: User, path: user ? '/profile' : '/login' }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-primary/20 pb-safe"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="grid grid-cols-5 gap-1 p-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 touch-target-xl ${
                active 
                  ? 'bg-primary/20 text-primary scale-105 shadow-lg' 
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Icon className={`w-6 h-6 transition-all duration-300 ${active ? 'scale-110' : ''}`} />
                <span className="text-xs mt-1 font-medium truncate w-full text-center">{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNavigationBar;