import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import type { EnhancedUser, UserSegmentationFilters } from '@/types/admin';

export function useEnhancedUserManagement() {
  const [users, setUsers] = useState<EnhancedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Partial<UserSegmentationFilters>>({});
  const [pagination, setPagination] = useState({ total: 0, limit: 20, offset: 0 });

  const load = useCallback(async (opts: Partial<{ offset: number; limit: number; q?: string }> = {}) => {
    setLoading(true);
    try {
      const payload = await adminApi.listUsersWithFilters({ ...filters, limit: opts.limit || pagination.limit, offset: typeof opts.offset === 'number' ? opts.offset : pagination.offset, q: opts.q });
      setUsers(payload.users || []);
      setPagination({ total: payload.total || 0, limit: payload.limit || pagination.limit, offset: payload.offset || pagination.offset });
    } catch (e) {
      console.error('load users error', e);
    } finally { setLoading(false); }
  }, [filters, pagination.limit, pagination.offset]);

  useEffect(() => { load({ offset: 0 }); }, [filters]);

  const getUser = async (id: number) => {
    // Return full payload from backend: { user, sadhanas, profile, progress, analytics, unreadMessages }
    return adminApi.getUserDetails(id);
  };

  const sendMessage = async (id: number, content: string) => {
    return adminApi.sendUserMessage(id, content);
  };

  const nextPage = () => {
    const newOffset = pagination.offset + pagination.limit;
    if (newOffset < pagination.total) {
      load({ offset: newOffset });
    }
  };

  const prevPage = () => {
    const newOffset = Math.max(0, pagination.offset - pagination.limit);
    load({ offset: newOffset });
  };

  return { users, loading, filters, setFilters, load, getUser, sendMessage, pagination, nextPage, prevPage };
}
