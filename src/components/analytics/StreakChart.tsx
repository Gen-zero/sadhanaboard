import React from 'react';

export default function StreakChart({ data }: { data?: any }) {
  if (!data) return <div className="text-sm text-muted-foreground">No streak data</div>;
  return (
    <div className="p-4">
      <div className="text-sm text-muted-foreground">Current Streak</div>
      <div className="text-2xl font-bold">{data.currentStreak || 0} days</div>
      <div className="text-xs text-muted-foreground">Longest: {data.longestStreak || 0} days • Avg: {data.averageStreak || 0} days</div>
    </div>
  );
}
