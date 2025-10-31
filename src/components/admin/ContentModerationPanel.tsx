import React, { useState, useEffect } from 'react';
import type { CommunityPost, CommunityComment, CommunityReport } from '@/types/community';
import { adminApi } from '@/services/adminApi';
import { Button } from '@/components/ui/button';

export default function ContentModerationPanel() {
  const [tab, setTab] = useState<'posts'|'comments'|'reports'>('posts');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const loadPosts = async () => {
    const res = await adminApi.getCommunityPosts({ limit, offset: (page-1)*limit, status: 'flagged' } as any);
    setPosts(res.items || []);
  };
  const loadComments = async () => {
    const res = await adminApi.getCommunityComments({ limit, offset: (page-1)*limit } as any);
    setComments(res.items || []);
  };
  const loadReports = async () => {
    const res = await adminApi.getCommunityReports({ status: 'pending', limit, offset: (page-1)*limit } as any);
    setReports(res.items || []);
  };

  useEffect(() => { if (tab === 'posts') loadPosts(); if (tab === 'comments') loadComments(); if (tab === 'reports') loadReports(); }, [tab, page]);

  const bulkApprovePosts = async (ids: number[]) => { await Promise.all(ids.map(id => adminApi.approvePost(id))); await loadPosts(); };
  const bulkRejectPosts = async (ids: number[], reason = 'moderation') => { await Promise.all(ids.map(id => adminApi.rejectPost(id, reason))); await loadPosts(); };
  const bulkDeletePosts = async (ids: number[]) => { await Promise.all(ids.map(id => adminApi.deletePost(id))); await loadPosts(); };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Content Moderation</h3>
        <div className="space-x-2">
          <Button variant={tab==='posts'?'default':'secondary'} size="sm" onClick={() => setTab('posts')}>Posts</Button>
          <Button variant={tab==='comments'?'default':'secondary'} size="sm" onClick={() => setTab('comments')}>Comments</Button>
          <Button variant={tab==='reports'?'default':'secondary'} size="sm" onClick={() => setTab('reports')}>Reports</Button>
        </div>
      </div>

      {tab === 'posts' && (
        <div className="mt-3">
          {posts.map(p => (
            <div key={p.id} className="border p-2 rounded mb-2">
              <div className="text-sm text-gray-700">{p.content}</div>
              <div className="mt-2 text-xs text-gray-500">{p.status} • {p.user_name}</div>
              <div className="mt-2">
                <Button variant="default" size="sm" className="mr-2 bg-green-500 hover:bg-green-600" onClick={() => adminApi.approvePost(p.id).then(loadPosts)}>Approve</Button>
                <Button variant="default" size="sm" className="mr-2 bg-yellow-500 hover:bg-yellow-600" onClick={() => adminApi.rejectPost(p.id, 'violates-guidelines').then(loadPosts)}>Reject</Button>
                <Button variant="destructive" size="sm" onClick={() => adminApi.deletePost(p.id).then(loadPosts)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'comments' && (
        <div className="mt-3">
          {comments.map(c => (
            <div key={c.id} className="border p-2 rounded mb-2">
              <div className="text-sm text-gray-700">{c.content}</div>
              <div className="mt-2 text-xs text-gray-500">{c.status} • {c.user_name}</div>
              <div className="mt-2">
                <Button variant="default" size="sm" className="mr-2 bg-green-500 hover:bg-green-600" onClick={() => adminApi.moderateComment(c.id, 'approve').then(loadComments)}>Approve</Button>
                <Button variant="default" size="sm" className="mr-2 bg-yellow-500 hover:bg-yellow-600" onClick={() => adminApi.moderateComment(c.id, 'reject').then(loadComments)}>Reject</Button>
                <Button variant="destructive" size="sm" onClick={() => adminApi.moderateComment(c.id, 'delete').then(loadComments)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'reports' && (
        <div className="mt-3">
          {reports.map(rp => (
            <div key={rp.id} className="border p-2 rounded mb-2">
              <div className="text-sm text-gray-700">{rp.reason || `${rp.reported_content_type}:${rp.reported_content_id}`}</div>
              <div className="mt-2 text-xs text-gray-500">{rp.status}</div>
              <div className="mt-2">
                <Button variant="default" size="sm" className="mr-2 bg-green-500 hover:bg-green-600" onClick={() => adminApi.resolveReport(rp.id, 'approve').then(loadReports)}>Resolve Approve</Button>
                <Button variant="default" size="sm" className="mr-2 bg-yellow-500 hover:bg-yellow-600" onClick={() => adminApi.resolveReport(rp.id, 'remove').then(loadReports)}>Resolve Remove</Button>
                <Button variant="secondary" size="sm" onClick={() => adminApi.resolveReport(rp.id, 'ignore').then(loadReports)}>Ignore</Button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}