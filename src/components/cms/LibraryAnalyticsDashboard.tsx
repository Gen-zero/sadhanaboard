import React, { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import type { LibraryAnalytics } from '@/types/books';

export default function LibraryAnalyticsDashboard() {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<LibraryAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getLibraryAnalytics({ days: 30 });
      setAnalytics(res as LibraryAnalytics);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function handleExportCSV() {
    adminApi.exportLibraryAnalytics({ days: 30 }, 'csv')
      .then((csv) => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `library-analytics-30d.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })
      .catch((err) => alert('Export failed: ' + (err?.message || String(err))));
  }

  function formatBytes(bytes: number | undefined | null) {
    if (!bytes && bytes !== 0) return '0 B';
    const b = Number(bytes || 0);
    if (b < 1024) return `${b} B`;
    const kb = b / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Library Analytics (30 days)</h2>
        <div className="space-x-2">
          <button className="btn" onClick={load} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
          <button className="btn btn-outline" onClick={handleExportCSV}>Export CSV</button>
        </div>
      </div>

      {error && <div className="text-red-600">Error: {error}</div>}

      {!analytics && !loading && <div>No analytics data available.</div>}

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="text-sm text-muted">Total Books</div>
            <div className="text-2xl font-bold">{analytics.overview.totalBooks}</div>
          </div>

          <div className="card p-4">
            <div className="text-sm text-muted">Total Views</div>
            <div className="text-2xl font-bold">{analytics.overview.totalViews}</div>
          </div>

          <div className="card p-4">
            <div className="text-sm text-muted">Total Downloads</div>
            <div className="text-2xl font-bold">{analytics.overview.totalDownloads}</div>
          </div>

          <div className="card p-4 md:col-span-2">
            <div className="text-sm text-muted">Popular Books (by views)</div>
            <ul className="mt-2 space-y-1">
              {analytics.popularBooks.slice(0, 10).map((b) => (
                <li key={b.id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{b.title}</div>
                    {b.author && <div className="text-sm text-muted">{b.author}</div>}
                  </div>
                  <span className="text-sm text-muted">{b.views} views</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-4">
            <div className="text-sm text-muted">Storage Used</div>
            <div className="text-2xl font-bold">{formatBytes(analytics.overview.totalStorage)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
