import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { adminApi } from '@/services/adminApi';

export default function UserCommunicationPanel({ userId }: { userId: number }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const load = async () => {
    try {
      const r = await adminApi.getUserMessages(userId);
      const msgs = r.messages || [];
      setMessages(msgs);
      // compute unread for receiver side
      const unread = msgs.filter((m: any) => m.receiver_id === userId && !m.is_read).length;
      setUnreadCount(unread);
      // Mark messages as read that are addressed to the admin (if any) when the panel is opened
      // Mark messages where receiver_id !== userId (i.e., admin-sent) should not be marked here
      // For messages where receiver_id === admin (not applicable here) skip
    } catch (e) { /* ignore */ }
  };

  useEffect(() => { load(); }, [userId]);

  // mark a single message read
  const markRead = async (messageId: number) => {
    try {
      await adminApi.markMessageRead(userId, messageId);
      // update local state
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, is_read: true } : m));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error('mark read failed', e);
    }
  };

  const send = async () => {
    if (!text.trim()) return;
    try {
      await adminApi.sendUserMessage(userId, text.trim());
      setText('');
      await load();
    } catch (e) { console.error(e); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages {unreadCount > 0 ? `(${unreadCount} unread)` : ''}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40 mb-3">
          <ScrollArea>
            <div className="space-y-2 p-2">
              {messages.map(m => (
                <div key={m.id} className="p-2 border rounded">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">{m.sender_id === userId ? 'User' : 'Admin'} \u2022 {new Date(m.created_at).toLocaleString()}</div>
                    <div>
                      {!m.is_read && m.receiver_id === userId ? (
                        <span className="inline-block text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">Unread</span>
                      ) : (
                        <span className="inline-block text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded">{m.is_read ? 'Seen' : 'Sent'}</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-1">{m.content}</div>
                  <div className="mt-2">
                    {m.receiver_id === userId && !m.is_read && (
                      <Button size="sm" variant="ghost" onClick={() => markRead(m.id)}>Mark Read</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="space-y-2">
          <Textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write a message to the user" />
          <Button onClick={send}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
