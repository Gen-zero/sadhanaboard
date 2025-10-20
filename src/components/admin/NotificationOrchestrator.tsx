import React from 'react';

export default function NotificationOrchestrator({ advanced }: any) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Notification Channels</h2>
      {advanced.loading ? <div>Loading...</div> : (
        <div className="space-y-2">
          {advanced.channels.map((c: any) => (
            <div key={c.id} className="p-2 border rounded">
              <div className="font-medium">{c.name} ({c.type})</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
