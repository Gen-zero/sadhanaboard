import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

const SadhanaComments: React.FC<{ sadhanaId: string | number }> = ({ sadhanaId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.getSadhanaComments(String(sadhanaId));
      setComments(res.comments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [sadhanaId]);

  const submit = async () => {
    if (!user) return;
    if (!text.trim()) return;
    try {
      await api.createSadhanaComment(String(sadhanaId), { content: text });
      setText('');
      fetch();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-card p-4 rounded">
      <h4 className="font-medium mb-2">Comments</h4>
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
          <input className="flex-1 input" value={text} onChange={e => setText(e.target.value)} />
          <button className="btn" onClick={submit}>Post</button>
        </div>
      ) : (
        <div className="mt-3 text-sm text-muted-foreground">Sign in to comment</div>
      )}
    </div>
  );
};

export default SadhanaComments;
