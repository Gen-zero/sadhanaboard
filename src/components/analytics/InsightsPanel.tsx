import React from 'react';

export default function InsightsPanel({ insights = [] }: { insights?: string[] }) {
  if (!insights || insights.length === 0) return <div className="text-sm text-muted-foreground">No insights yet</div>;
  return (
    <div className="space-y-2">
      {insights.map((i, idx) => (
        <div key={idx} className="p-2 rounded border bg-background/50 text-sm">• {i}</div>
      ))}
    </div>
  );
}
