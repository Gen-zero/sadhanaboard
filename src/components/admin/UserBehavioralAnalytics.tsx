import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserBehavioralAnalytics({ analytics }: { analytics?: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Behavioral Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/10 rounded">Login Frequency: {analytics?.recentLogins?.length ?? 0}</div>
          <div className="p-3 bg-muted/10 rounded">Practice Sessions: {analytics?.recentSessions?.length ?? 0}</div>
        </div>
      </CardContent>
    </Card>
  );
}
