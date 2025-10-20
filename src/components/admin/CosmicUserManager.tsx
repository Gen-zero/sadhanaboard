import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, User, Shield, Mail, Calendar, Activity } from 'lucide-react';
import CosmicTable from './CosmicTable';
import CosmicButton from './CosmicButton';
import CosmicModal from './CosmicModal';
import { adminApi } from '@/services/adminApi';
import { User as UserType } from '@/types/admin';
import { useRealTimeUsers } from '@/hooks/useRealTimeUsers';

// Helper function to map backend user data to frontend User type
const mapUserFromBackend = (backendUser: any): UserType => {
  console.log('Mapping user from backend:', backendUser); // Debug log
  
  // Map role based on is_admin field
  let role: 'admin' | 'moderator' | 'user' = 'user';
  if (backendUser.is_admin) {
    role = 'admin';
  } else if (backendUser.is_moderator) {
    role = 'moderator';
  }

  // Map status based on active field
  let status: 'active' | 'suspended' | 'pending' = 'active';
  if (backendUser.active === false) {
    status = 'suspended';
  }

  // Handle date formatting
  const lastActive = backendUser.last_login ? 
    new Date(backendUser.last_login).toISOString() : 
    new Date().toISOString();
    
  const joinDate = backendUser.created_at ? 
    new Date(backendUser.created_at).toISOString() : 
    new Date().toISOString();

  return {
    id: String(backendUser.id),
    name: backendUser.display_name || backendUser.name || 'Unknown User',
    email: backendUser.email || '',
    role,
    status,
    lastActive,
    joinDate,
    practices: backendUser.sadhana_count || backendUser.practices || 0
  };
};

const CosmicUserManager: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle real-time user updates
  const handleUserUpdate = useCallback((updatedUser: any) => {
    const mappedUser = mapUserFromBackend(updatedUser);
    setUsers(prevUsers => {
      const existingUserIndex = prevUsers.findIndex(u => u.id === mappedUser.id);
      if (existingUserIndex >= 0) {
        // Update existing user
        const updatedUsers = [...prevUsers];
        updatedUsers[existingUserIndex] = mappedUser;
        return updatedUsers;
      } else {
        // Add new user
        return [...prevUsers, mappedUser];
      }
    });
  }, []);

  const { connected } = useRealTimeUsers(handleUserUpdate);

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.listUsersWithFilters();
      console.log('Raw user data from API:', data); // Debug log
      const mappedUsers = (data.users || []).map(mapUserFromBackend);
      console.log('Mapped users:', mappedUsers); // Debug log
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (columnKey: string, direction: 'asc' | 'desc') => {
    setSortColumn(columnKey);
    setSortDirection(direction);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortColumn as keyof UserType];
    const bValue = b[sortColumn as keyof UserType];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
    }
    
    return 0;
  });

  const handleUserAction = async (userData: any, action: string) => {
    // Convert the generic row data to a proper User object
    const user: UserType = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
      lastActive: userData.lastActive,
      joinDate: userData.joinDate,
      practices: userData.practices
    };

    switch (action) {
      case 'view':
        setSelectedUser(user);
        setIsUserModalOpen(true);
        break;
      case 'suspend':
        try {
          await adminApi.updateUser(Number(user.id), { 
            active: user.status === 'suspended' ? false : true 
          });
          setUsers(users.map(u => 
            u.id === user.id 
              ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } 
              : u
          ));
        } catch (error) {
          console.error('Failed to update user status:', error);
        }
        break;
      case 'delete':
        try {
          await adminApi.deleteUser(Number(user.id));
          setUsers(users.filter(u => u.id !== user.id));
        } catch (error) {
          console.error('Failed to delete user:', error);
        }
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'suspended': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-muted-foreground';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-400';
      case 'moderator': return 'text-cyan-400';
      case 'user': return 'text-blue-400';
      default: return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="cosmic-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {connected ? (
        <div className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
          🔗 Real-time connection active
        </div>
      ) : (
        <div className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm">
          ⚠️ Real-time connection disconnected - Data may not be up to date
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Users className="mr-2 h-6 w-6 text-purple-400" />
            👥 Soul Registry
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage all souls in the cosmic universe
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search souls..."
              className="pl-10 pr-4 py-2 bg-background/60 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-3 py-2 bg-background/60 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>
          
          <select
            className="px-3 py-2 bg-background/60 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          
          <CosmicButton variant="primary">
            <User className="mr-2 h-4 w-4" />
            Add Soul
          </CosmicButton>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="cosmic-card p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="cosmic-card-glow"></div>
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-400 mr-3" />
            <div>
              <div className="text-2xl font-bold cosmic-metric-value">
                {users.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Souls
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="cosmic-card p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="cosmic-card-glow"></div>
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <div className="text-2xl font-bold cosmic-metric-value">
                {users.filter(u => u.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">
                Active Souls
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="cosmic-card p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="cosmic-card-glow"></div>
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-red-400 mr-3" />
            <div>
              <div className="text-2xl font-bold cosmic-metric-value">
                {users.filter(u => u.status === 'suspended').length}
              </div>
              <div className="text-sm text-muted-foreground">
                Suspended
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="cosmic-card p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="cosmic-card-glow"></div>
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <div className="text-2xl font-bold cosmic-metric-value">
                {users.filter(u => u.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">
                Pending
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Users Table */}
      <div className="cosmic-card">
        <div className="cosmic-card-glow"></div>
        <div className="p-6">
          <CosmicTable
            data={sortedUsers}
            columns={[
              { key: 'name', title: 'Name', sortable: true },
              { key: 'email', title: 'Email', sortable: true },
              { key: 'role', title: 'Role', sortable: true },
              { key: 'status', title: 'Status', sortable: true },
              { key: 'lastActive', title: 'Last Active', sortable: true },
              { key: 'practices', title: 'Practices', sortable: true }
            ]}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            actions={(row) => (
              <div className="flex space-x-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleUserAction(row, 'view'); }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  View
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleUserAction(row, 'suspend'); }}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  {row.status === 'suspended' ? 'Activate' : 'Suspend'}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleUserAction(row, 'delete'); }}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            )}
          />
        </div>
      </div>
      
      {/* User Detail Modal */}
      <CosmicModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title="Soul Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                <User className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                <p className="text-muted-foreground">{selectedUser.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-background/40 rounded-lg">
                <div className="text-sm text-muted-foreground">Role</div>
                <div className={getRoleColor(selectedUser.role)}>
                  {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                </div>
              </div>
              
              <div className="p-3 bg-background/40 rounded-lg">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className={getStatusColor(selectedUser.status)}>
                  {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                </div>
              </div>
              
              <div className="p-3 bg-background/40 rounded-lg">
                <div className="text-sm text-muted-foreground">Practices</div>
                <div className="font-medium">{selectedUser.practices}</div>
              </div>
              
              <div className="p-3 bg-background/40 rounded-lg">
                <div className="text-sm text-muted-foreground">Join Date</div>
                <div>{new Date(selectedUser.joinDate).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="p-3 bg-background/40 rounded-lg">
              <div className="text-sm text-muted-foreground">Last Active</div>
              <div>{new Date(selectedUser.lastActive).toLocaleString()}</div>
            </div>
          </div>
        )}
      </CosmicModal>
    </div>
  );
};

export default CosmicUserManager;