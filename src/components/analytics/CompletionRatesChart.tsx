import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function CompletionRatesChart({ data = [] }: { data?: any[] }) {
  if (!data || data.length === 0) return <div className="text-sm text-muted-foreground">No completion data</div>;
  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="group" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="completionRate" fill="#06b6d4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
