import React from 'react';

export default function PracticeHeatmapCalendar({ data }: { data?: any[] }) {
  if (!data || data.length === 0) return <div className="text-sm text-muted-foreground">No heatmap data</div>;
  return (
    <div className="p-2">
      <div className="text-sm text-muted-foreground mb-2">Practice Heatmap</div>
      <div className="grid grid-cols-7 gap-1">
        {data.slice(0, 70).map((d, i) => (
          <div key={i} title={`${d.date}: ${d.count}`} className={`w-6 h-6 rounded ${d.count>3? 'bg-green-600': d.count>0? 'bg-green-300':'bg-gray-100'}`}></div>
        ))}
      </div>
    </div>
  );
}
