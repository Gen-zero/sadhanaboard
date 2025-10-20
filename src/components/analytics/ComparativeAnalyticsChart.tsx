import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';

export default function ComparativeAnalyticsChart({ data }: { data?: any }) {
  if (!data) return <div className="text-sm text-muted-foreground">No comparative data</div>;
  const pieData = [
    { name: 'You', value: data.user?.avgCompletionsPerDay || 0 },
    { name: 'Community', value: data.community?.avgCompletionsPerDay || 0 }
  ];
  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8" />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
