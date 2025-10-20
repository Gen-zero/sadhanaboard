import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { adminApi } from '@/services/adminApi';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } finally {
      window.location.href = '/admin/login';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={() => { setError(null); setLoading(true); window.location.reload(); }}>
          Retry
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <AdminNavigation />
      
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
          <div className="text-lg font-semibold text-foreground">
            {user?.username ? `Welcome, ${user.username}` : 'Admin Panel'}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>
        
        {/* Main content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      
      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-96 border border-border">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-muted-foreground mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="secondary" 
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="default" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;