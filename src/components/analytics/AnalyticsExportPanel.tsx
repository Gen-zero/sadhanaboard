import React from 'react';

export default function AnalyticsExportPanel() {
  const download = async (format: 'csv' | 'pdf') => {
    try {
      const res = await fetch(`/api/profile/analytics/export/${format === 'csv' ? 'csv' : 'pdf'}?type=detailed&start=2024-01-01&end=2024-12-31`, { credentials: 'include' });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics_export.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export analytics data:', e);
      alert('Export failed');
    }
  };

  return (
    <div className="flex gap-2">
      <button className="btn" onClick={() => download('csv')}>Export CSV</button>
      <button className="btn" onClick={() => download('pdf')}>Export PDF</button>
    </div>
  );
}