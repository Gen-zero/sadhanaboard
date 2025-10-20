import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// We assume CosmicJourneyTimeline exists; we'll reuse its markup ideas but keep this lightweight

export default function UserJourneyTimeline({ events = [] }: { events?: Array<{ date: string; title: string; description?: string }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Journey</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal space-y-2">
          {(events || []).map((e, i) => (
            <li key={i}>
              <div className="font-semibold">{e.title} <span className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()}</span></div>
              {e.description && <div className="text-sm">{e.description}</div>}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
