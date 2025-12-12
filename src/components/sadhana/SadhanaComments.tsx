import React, { useEffect, useState, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

const SadhanaComments: React.FC<{ sadhanaId: string | number }> = ({ sadhanaId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getSadhanaComments(String(sadhanaId));
      setComments(res.comments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sadhanaId]);

  useEffect(() => { 
    fetch(); 
  }, [fetch]);

  const submit = useCallback(async () => {
    if (!user) return;
    if (!text.trim()) return;
    try {
      await api.createSadhanaComment(String(sadhanaId), { content: text });
      setText('');
      fetch();
    } catch (err) { console.error(err); }
  }, [user, text, sadhanaId, fetch]);

  return (
    <div className="bg-gradient-to-r from-[#DC143C]/50 to-[#8B0000]/50 backdrop-blur-md p-4 rounded">
      <h4 className="font-medium mb-2 text-white">Comments</h4>
      {loading && <div>Loading...</div>}
      <div className="space-y-2">
        {comments.map(c => (
          <div key={c.id} className="border-b border-muted-foreground/10 py-2">
            <div className="text-sm font-medium">{c.user_name || c.user_id}</div>
            <div className="text-sm text-muted-foreground">{c.content}</div>
          </div>
        ))}
      </div>
      {user ? (
        <div className="mt-3 flex gap-2">
          <input className="flex-1 input bg-gradient-to-r from-[#8B0000] to-[#5C0000] text-white placeholder:text-white/70" value={text} onChange={e => setText(e.target.value)} />
          <button className="btn" onClick={submit}>Post</button>
        </div>
      ) : (
        <div className="mt-3 text-sm text-muted-foreground">Sign in to comment</div>
      )}
    </div>
  );
};

export default SadhanaComments;
