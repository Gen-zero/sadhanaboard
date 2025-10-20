import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BreadcrumbItem {
  name: string;
  path: string;
  isCurrent?: boolean;
}

interface BreadcrumbNavigationProps {
  className?: string;
}

const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({ className = '' }) => {
  const location = useLocation();
  const { t } = useTranslation();

  // Map routes to breadcrumb names
  const routeNames: Record<string, string> = {
    '/': t('home'),
    '/dashboard': t('dashboard'),
    '/sadhana': t('saadhana_board'),
    '/library': t('library'),
    '/saadhanas': t('sadhanas'),
    '/your-atma-yantra': t('your_yantras'),
    '/store': t('store'),
    '/settings': t('settings'),
    '/profile': t('profile'),
    '/login': t('login'),
    '/signup': t('signup'),
    '/waitlist': t('waitlist')
  };

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    // Always start with home
    const breadcrumbs: BreadcrumbItem[] = [
      {
        name: t('home'),
        path: '/',
        isCurrent: pathnames.length === 0
      }
    ];

    // Add each path segment
    pathnames.forEach((pathname, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      
      // Try to get translated name, fallback to pathname
      const name = routeNames[path] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
      
      breadcrumbs.push({
        name,
        path,
        isCurrent: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <nav 
      className={`flex items-center text-sm ${className}`} 
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {breadcrumb.isCurrent ? (
              <span 
                className="text-purple-300 font-medium truncate max-w-[200px]"
                aria-current="page"
              >
                {breadcrumb.name}
              </span>
            ) : (
              <Link 
                to={breadcrumb.path}
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center truncate max-w-[200px]"
              >
                {index === 0 ? (
                  <Home className="h-4 w-4 mr-1 flex-shrink-0" />
                ) : null}
                <span className="truncate">{breadcrumb.name}</span>
              </Link>
            )}
            
            {!breadcrumb.isCurrent && index < breadcrumbs.length - 1 && (
              <ChevronRight className="h-4 w-4 text-purple-500/50 mx-1 flex-shrink-0" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;