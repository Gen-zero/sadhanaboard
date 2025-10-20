import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  UserCheck, 
  ImageIcon, 
  Activity, 
  Shield, 
  Library, 
  Settings,
  BarChart3
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const AdminNavigation: React.FC = () => {
  const navItems: NavItem[] = [
    { to: '/admin', icon: Home, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/community', icon: UserCheck, label: 'Community' },
    { to: '/admin/content', icon: ImageIcon, label: 'Content' },
    { to: '/admin/system', icon: Activity, label: 'System' },
    { to: '/admin/logs', icon: Shield, label: 'Logs' },
    { to: '/admin/library', icon: Library, label: 'Library' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
  ];

  return (
    <nav className="w-64 bg-background border-r border-border h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
      </div>
      
      <div className="py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminNavigation;