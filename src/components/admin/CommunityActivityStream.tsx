import React, { useRef, useState, useEffect, useMemo } from 'react';
import type { ActivityStreamEntry } from '@/types/community';

// Re-use adminApi socket connection pattern
import { adminApi } from '@/services/adminApi';

type Props = { initial?: ActivityStreamEntry[] };

export default function CommunityActivityStream({ initial = [] }: Props) {
  const [items, setItems] = useState<ActivityStreamEntry[]>(initial || []);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [limit] = useState(100);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<number | undefined>(undefined);

  useEffect(() => {
    // load initial page
    let mounted = true;
    setLoading(true);
    adminApi.getCommunityActivity({ limit }).then((r:any) => {
      if (!mounted) return;
      setItems(r.items || []);
    }).catch(console.error).finally(() => setLoading(false));
    return () => { mounted = false; };
  }, [limit]);

  useEffect(() => {
    // connect socket and subscribe to community:stream
    const socket = adminApi.connectDashboardStream(() => {}, () => {});
    socket.emit('community:subscribe', { rooms: ['community:stream'] });
    const onActivity = (payload: ActivityStreamEntry) => {
      // prepend new items (debounced by server)
      setItems((prev) => [payload, ...prev].slice(0, 2000));
    };
    socket.on('community:activity', onActivity);
    return () => {
      try { socket.emit('community:unsubscribe'); socket.off('community:activity', onActivity); socket.disconnect(); } catch (e) { /* ignore */ }
    };
  }, []);

  const filtered = useMemo(() => {
    return items.filter(it => {
      if (filterType && it.activity_type !== filterType) return false;
      if (userId && Number(it.user_id) !== Number(userId)) return false;
      return true;
    });
  }, [items, filterType, userId]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Activity Stream</h3>
        <div className="flex items-center gap-2">
          <select value={filterType || ''} onChange={(e) => setFilterType(e.target.value || undefined)} className="input">
            <option value="">All</option>
            <option value="post">Post</option>
            <option value="comment">Comment</option>
            <option value="like">Like</option>
            <option value="milestone">Milestone</option>
          </select>
          <input placeholder="User ID" value={userId ?? ''} onChange={e => setUserId(e.target.value ? Number(e.target.value) : undefined)} className="input w-24" />
        </div>
      </div>

      <div ref={parentRef} className="mt-3 max-h-[420px] overflow-auto space-y-2">
        {filtered.map(item => (
          <div key={String(item.id) + (item.created_at||'')} className="p-2 border-b">
            <div className="text-xs text-gray-500">{item.activity_type} • {item.created_at}</div>
            <div className="text-sm">{typeof item.activity_data === 'string' ? item.activity_data : JSON.stringify(item.activity_data || item)}</div>
          </div>
        ))}
      </div>

      {loading && <div className="mt-2 text-sm text-gray-500">Loading...</div>}
    </div>
  );
}

