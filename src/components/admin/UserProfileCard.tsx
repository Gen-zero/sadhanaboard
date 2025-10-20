import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

export default function UserProfileCard({ profile, user }: { profile?: any; user?: any }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Avatar />
          <div>
            <div className="font-semibold">{user?.display_name || user?.email}</div>
            <div className="text-sm text-muted-foreground">{profile?.experience_level || 'Unknown'}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div><strong>Traditions:</strong> {profile?.traditions?.join(', ') || '—'}</div>
          <div><strong>Favorite Deity:</strong> {profile?.favorite_deity || '—'}</div>
          <div><strong>Onboarding:</strong> {profile?.onboarding_completed ? 'Completed' : 'Pending'}</div>
        </div>
      </CardContent>
    </Card>
  );
}
