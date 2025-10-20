import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import SadhanaCard from '@/components/SadhanaCard';

const CommunityFeedPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchFeed = async (reset = false) => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.getCommunityFeed({ limit: 20, offset: reset ? 0 : page * 20 });
      if (reset) setItems(res.feed || []);
      else setItems((prev) => [...prev, ...(res.feed || [])]);
      setHasMore(res.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Community Feed</h2>
      <div className="grid grid-cols-1 gap-4">
        {items.map((it) => (
          <SadhanaCard key={it.sadhana_id || it.id} sadhana={it} showSocialFeatures />
        ))}
      </div>
      {hasMore && (
        <div className="mt-4">
          <button className="btn" onClick={() => { setPage(p => p + 1); fetchFeed(); }}>Load more</button>
        </div>
      )}
      {loading && <div className="mt-4 text-sm text-muted-foreground">Loading...</div>}
    </div>
  );
};

export default CommunityFeedPage;
