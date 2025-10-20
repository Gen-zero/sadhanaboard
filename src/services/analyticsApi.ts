const BASE_API = (import.meta.env.VITE_API_BASE_URL as string) || '/api';
const USE_CREDENTIALS = (import.meta.env.VITE_API_USE_CREDENTIALS === 'true');

async function req(path: string, init: RequestInit = {}) {
  const res = await fetch(`${BASE_API}${path}`, {
    ...(USE_CREDENTIALS ? { credentials: 'include' } : {}),
    headers: { 'Content-Type': 'application/json', ...(init.headers as any || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
  return res.json().catch(() => null);
}

export const analyticsApi = {
  async getPracticeTrends(_userId: string | number, timeframe = '30d', granularity = 'daily') {
    const qs = new URLSearchParams({ timeframe, granularity });
    return req(`/profile/analytics/practice-trends?${qs.toString()}`);
  },
  async getCompletionRates(_userId: string | number, groupBy = 'category', timeframe = '30d') {
    const qs = new URLSearchParams({ groupBy, timeframe });
    return req(`/profile/analytics/completion-rates?${qs.toString()}`);
  },
  async getStreaks(_userId: string | number) { return req(`/profile/analytics/streaks`); },
  async getComparative(_userId: string | number, timeframe = '30d') { return req(`/profile/analytics/comparative?timeframe=${timeframe}`); },
  async getHeatmap(_userId: string | number, year?: number) { const qs = new URLSearchParams(); if (year) qs.append('year', String(year)); return req(`/profile/analytics/heatmap?${qs.toString()}`); },
  async getCategoryInsights(_userId: string | number) { return req('/profile/analytics/category-insights'); }
};
