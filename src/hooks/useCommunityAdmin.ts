import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/services/adminApi';
import type { CommunityPost, CommunityComment, CommunityReport, ActivityStreamEntry } from '@/types/community';

export function useCommunityAdmin() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [activity, setActivity] = useState<ActivityStreamEntry[]>([]);

  const loadPosts = useCallback(async (params = {}) => {
    const res = await adminApi.getCommunityPosts(params as any);
    setPosts(res.items || []);
    return res;
  }, []);

  const loadComments = useCallback(async (params = {}) => {
    const res = await adminApi.getCommunityComments(params as any);
    setComments(res.items || []);
    return res;
  }, []);

  const loadReports = useCallback(async (params = {}) => {
    const res = await adminApi.getCommunityReports(params as any);
    setReports(res.items || []);
    return res;
  }, []);

  const loadActivity = useCallback(async (params = {}) => {
    const res = await adminApi.getCommunityActivity(params as any);
    setActivity(res.items || []);
    return res;
  }, []);

  useEffect(() => { loadActivity(); loadPosts(); loadComments(); loadReports(); }, [loadActivity, loadPosts, loadComments, loadReports]);

  return {
    posts, comments, reports, activity,
    loadPosts, loadComments, loadReports, loadActivity,
    approvePost: async (id: number) => { await adminApi.approvePost(id); return loadPosts(); },
    rejectPost: async (id: number, reason?: string) => { await adminApi.rejectPost(id, reason); return loadPosts(); },
    deletePost: async (id: number) => { await adminApi.deletePost(id); return loadPosts(); },
    moderateComment: async (id: number, action: 'approve'|'reject'|'delete', reason?: string) => { await adminApi.moderateComment(id, action, reason); return loadComments(); },
    resolveReport: async (id: number, action: 'approve'|'remove'|'ignore', notes?: string) => { await adminApi.resolveReport(id, action, notes); return loadReports(); },
  };
}

export default useCommunityAdmin;

