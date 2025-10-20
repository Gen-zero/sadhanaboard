import io from 'socket.io-client';
const BASE_API = (import.meta.env.VITE_API_BASE_URL as string) || '/api';
export const ADMIN_API_BASE = `${BASE_API}/admin`;
const SOCKET_BASE = (import.meta.env.VITE_SOCKET_BASE_URL as string) ?? (typeof window !== 'undefined' ? window.location.origin : BASE_API);
const USE_CREDENTIALS = (import.meta.env.VITE_API_USE_CREDENTIALS === 'true');

// Generic request helper. If `asText` is true, return raw text wrapped as { css: string }.
async function adminRequest<T>(path: string, init: RequestInit = {}, asText = false): Promise<T> {
  // If body is FormData, let the browser set Content-Type
  const headers: Record<string, string> = {
    ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...((init.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${ADMIN_API_BASE}${path}`, {
    ...(USE_CREDENTIALS ? { credentials: 'include' } : {}),
    headers,
    ...init,
  });

  if (!res.ok) {
    // Try to read JSON error, fall back to text
    const data = await res.json().catch(() => null);
    const text = data ? (data.message || data.error || JSON.stringify(data)) : await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (asText) {
    const text = await res.text();
    // wrap as { css }
    return ({ css: text } as unknown) as T;
  }

  // Try JSON, but tolerate text responses (wrap as { css })
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }

  // Non-JSON fallback
  const txt = await res.text();
  return ({ css: txt } as unknown) as T;
}

import type { DashboardSnapshot, ProgressStats, HealthStats } from '@/types/admin-dashboard';
import type { CommunityPost, CommunityComment, CommunityReport, CommunityEvent, MentorshipPair, SpiritualMilestone, ActivityStreamEntry, Paginated, GetActivityParams } from '@/types/community';
import type { Socket } from 'socket.io-client';

export const adminApi = {
  async login(username: string, password: string) {
    return adminRequest<{ message: string, token?: string, admin?: { id: number; role: string; username: string } }>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  async me() {
    return adminRequest<{ user: { id: number; role: string; username: string } }>('/me');
  },
  async logout() {
    return adminRequest<{ message: string }>('/logout', { method: 'POST' });
  },
  async stats() {
    return adminRequest<{
      totalUsers: number;
      activeUsers: number;
      activeSadhanas: number;
      completedSadhanas: number;
      uploadedBooks: number;
      currentThemes: number;
      recentLogins: number;
      todaysSadhanas: number;
      weeklyLogins: Array<{ date: string; logins: number }>;
      weeklySadhanaCompletions: Array<{ date: string; completions: number }>;
    }>('/stats');
  },
  async listUsers(q = '', limit = 20, offset = 0, status = 'all') {
    const params = new URLSearchParams({ q, limit: String(limit), offset: String(offset), status });
    return adminRequest<{ users: Array<{ id: number; email: string; display_name: string; is_admin: boolean; active: boolean }>, total: number, limit: number, offset: number }>(`/users?${params.toString()}`);
  },
  async listUsersWithFilters(filters: { q?: string; limit?: number; offset?: number } & Partial<any> = {}) {
    const params = new URLSearchParams();
    if (filters.q) params.append('q', filters.q);
    if (filters.limit) params.append('limit', String(filters.limit));
    if (filters.offset) params.append('offset', String(filters.offset));
    if (filters.experience_level) params.append('experience_level', filters.experience_level);
    if (filters.traditions) params.append('traditions', Array.isArray(filters.traditions) ? filters.traditions.join(',') : String(filters.traditions));
    if (filters.favorite_deity) params.append('favorite_deity', filters.favorite_deity);
    if (typeof filters.onboarding_completed !== 'undefined') params.append('onboarding_completed', String(filters.onboarding_completed));
    const res = await adminRequest<{ users: any[]; total: number; limit: number; offset: number }>(`/users?${params.toString()}`);
    // normalize profile shape: backend may return flat fields or nested `profile` — ensure `profile` exists
    const users = (res.users || []).map((u: any) => {
      if (u.profile && typeof u.profile === 'object') return u;
      const profile = {
        experience_level: u.experience_level ?? null,
        traditions: u.traditions ?? null,
        onboarding_completed: typeof u.onboarding_completed !== 'undefined' ? !!u.onboarding_completed : null,
        favorite_deity: u.favorite_deity ?? null,
      };
      // remove flat keys to avoid confusion
      const { experience_level, traditions, onboarding_completed, favorite_deity, ...rest } = u;
      return { ...rest, profile } as any;
    });
    return { ...res, users };
  },
  async updateUser(id: number, payload: Partial<{ email: string; display_name: string; is_admin: boolean; active: boolean }>) {
    return adminRequest<{ message: string }>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  async logs(limit = 50, offset = 0, action = '', admin_id = '') {
    const params = new URLSearchParams({ 
      limit: String(limit), 
      offset: String(offset),
      ...(action && { action }),
      ...(admin_id && { admin_id })
    });
    // normalize to { items, total, limit, offset }
    const r = await adminRequest<any>(`/logs?${params.toString()}`);
    const items = r.items || r.logs || r.rows || r;
    const total = r.total ?? (Array.isArray(items) ? items.length : 0);
    return { items, total, limit: r.limit ?? limit, offset: r.offset ?? offset };
  },
  // New log management APIs
  async listLogs(params: { q?: string; severity?: string; category?: string; limit?: number; offset?: number } = {}) {
    const qs = new URLSearchParams();
    if (params.q) qs.append('q', params.q);
    if (params.severity) qs.append('severity', params.severity);
    if (params.category) qs.append('category', params.category);
    qs.append('limit', String(params.limit ?? 50));
    qs.append('offset', String(params.offset ?? 0));
    const r = await adminRequest<any>(`/logs?${qs.toString()}`);
    const items = r.items || r.rows || r.logs || [];
    const total = r.total ?? (Array.isArray(items) ? items.length : 0);
    return { items, total, limit: r.limit ?? params.limit ?? 50, offset: r.offset ?? params.offset ?? 0 };
  },
  async getLogStatistics() {
    return adminRequest<any>(`/logs/stats`);
  },
  async getSecurityEvents() {
    const r = await adminRequest<any>(`/logs/security-events`);
    return { items: r.items || r || [] };
  },
  async getStatsReport() {
    return adminRequest<any>(`/stats/report`);
  },
  async createAlertRule(payload: Partial<{ rule_name: string; conditions: any; notification_channels?: any[] }>) {
    return adminRequest<any>(`/logs/alert-rules`, { method: 'POST', body: JSON.stringify(payload) });
  },
  async updateAlertRule(id: number, payload: { rule_name: string; conditions: any; notification_channels?: any[] }) { return adminRequest<any>(`/logs/alert-rules/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }); },
  async deleteAlertRule(id: number) { return adminRequest<any>(`/logs/alert-rules/${id}`, { method: 'DELETE' }); },
  async testAlertRule(id: number) { return adminRequest<any>(`/logs/alert-rules/${id}/test`, { method: 'POST' }); },
  async listAlertRules() {
    const r = await adminRequest<any>(`/logs/alert-rules`);
    return { items: r.items || r || [] };
  },
  async exportLogs(filters: any = {}, format = 'csv') { return adminRequest<any>(`/logs/export`, { method: 'POST', body: JSON.stringify({ filters, format }) }); },
  reportUsersCsvUrl() { return `${ADMIN_API_BASE}/reports/users.csv`; },
  reportSadhanasCsvUrl() { return `${ADMIN_API_BASE}/reports/sadhanas.csv`; },
  async resolveSecurityEvent(id: number) { return adminRequest<{ ok: boolean }>(`/logs/security-events/${id}/resolve`, { method: 'PATCH' }); },
  // Enhanced user management
  async getUserDetails(id: number) {
    return adminRequest<{ user: any; sadhanas: any[]; profile: any; progress?: any; analytics?: any; unreadMessages?: number }>(`/users/${id}`);
  },
  async getUserAnalytics(id: number) {
    return adminRequest<{ analytics: any }>(`/users/${id}/analytics`);
  },
  async getUserProgress(id: number) {
    return adminRequest<{ progress: any }>(`/users/${id}/progress`);
  },
  async getUserMessages(id: number, limit = 50, offset = 0) {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    return adminRequest<{ messages: any[] }>(`/users/${id}/messages?${params.toString()}`);
  },
  async sendUserMessage(id: number, content: string) {
    return adminRequest<{ message: string; id?: number }>(`/users/${id}/message`, { method: 'POST', body: JSON.stringify({ content }) });
  },
  async markMessageRead(userId: number, messageId: number) {
    return adminRequest<{ message: string }>(`/users/${userId}/messages/${messageId}/read`, { method: 'PATCH' });
  },
  async deleteUser(id: number) {
    return adminRequest<{ message: string }>(`/users/${id}`, { method: 'DELETE' });
  },
  // Assets
  async listAssets() {
    const r = await adminRequest<any>(`/assets`);
    // backend may return { assets, total, limit, offset } or an object wrapper. Normalize to { items, total, page, limit, totalPages }
    const assets = r.assets || r.items || r;
    const total = r.total ?? (Array.isArray(assets) ? assets.length : 0);
    const limit = r.limit ?? 20;
    // compute page from provided page or from offset
    const page = r.page ?? (r.offset ? Math.floor(Number(r.offset) / Number(limit)) + 1 : 1);
    const totalPages = r.totalPages ?? (limit ? Math.ceil(total / limit) : 1);
    return { items: assets, total, page, limit, totalPages };
  },
  async listUIElements(params: { q?: string; limit?: number; offset?: number } = {}) {
    const search = new URLSearchParams();
    if (params.q) search.append('q', params.q);
    if (params.limit) search.append('limit', String(params.limit));
    if (params.offset) search.append('offset', String(params.offset));
    const r = await adminRequest<any>(`/ui-elements?${search.toString()}`);
    const items = r.ui_elements || r.items || r;
    const pagination = r.pagination || { total_count: Array.isArray(items) ? items.length : 0, current_page: 1, per_page: r.limit || 20, total_pages: 1 };
    return { items, total: pagination.total_count ?? pagination.total, page: pagination.current_page ?? 1, limit: pagination.per_page ?? r.limit ?? 20, totalPages: pagination.total_pages ?? 1 };
  },
  async getUILocations() {
    const r = await adminRequest<any>(`/ui-elements/locations`);
    return r.locations || r;
  },
  async previewUIElement(id: number) {
    const r = await adminRequest<any>(`/ui-elements/${id}/preview`);
    return r.preview || r;
  },
  async getAssetById(id: number) {
    const r = await adminRequest<any>(`/assets/${id}`);
    return r.asset || r;
  },
  // Real-time dashboard: socket connection management
  _socket: null as Socket | null,
  connectDashboardStream(onInit: (data: DashboardSnapshot) => void, onUpdate: (data: DashboardSnapshot) => void, onError?: (err: unknown) => void): Socket {
    // use top-level io import
    if (this._socket) {
      this._socket.disconnect();
      this._socket = null;
    }
    // connect, cookies are sent automatically by the browser
    const base = SOCKET_BASE;
    const socket = io(base, { withCredentials: true, path: '/socket.io' });
  this._socket = socket as Socket;
    socket.on('connect', () => {
      // connected
    });
    socket.on('dashboard:stats:init', (payload: DashboardSnapshot) => {
      try { onInit && onInit(payload); } catch (e) { console.error(e); }
    });
    socket.on('dashboard:stats:update', (payload: DashboardSnapshot) => {
      try { onUpdate && onUpdate(payload); } catch (e) { console.error(e); }
    });
    socket.on('connect_error', (err: unknown) => { if (onError) onError && onError(err); });
    socket.on('error', (err: unknown) => { if (onError) onError && onError(err); });
    return socket;
  },
  
  async getProgressStats() {
    return adminRequest<ProgressStats>(`/stats/progress`);
  },
  async getHealthStats() {
    return adminRequest<HealthStats>(`/stats/health`);
  },
  // Community APIs
  async getCommunityPosts(params: { status?: string; limit?: number; offset?: number } = {}): Promise<Paginated<CommunityPost>> {
    const qs = new URLSearchParams(); if (params.status) qs.append('status', params.status); qs.append('limit', String(params.limit ?? 50)); qs.append('offset', String(params.offset ?? 0));
    const r = await adminRequest<any>(`/community/posts?${qs.toString()}`);
    const items: CommunityPost[] = r.items || r || [];
    const total = r.total ?? (Array.isArray(items) ? items.length : 0);
    const limit = r.limit ?? params.limit ?? 50;
    const offset = r.offset ?? params.offset ?? 0;
    const page = r.page ?? (offset ? Math.floor(Number(offset) / Number(limit)) + 1 : 1);
    const totalPages = r.totalPages ?? (limit ? Math.ceil(total / limit) : 1);
    return { items, total, page, limit, totalPages };
  },
  async approvePost(id: number) { return adminRequest<{ item: CommunityPost }>(`/community/posts/${id}/approve`, { method: 'PATCH' }); },
  async rejectPost(id: number, reason?: string) { return adminRequest<{ item: CommunityPost }>(`/community/posts/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) }); },
  async deletePost(id: number) { return adminRequest<{ ok: boolean }>(`/community/posts/${id}`, { method: 'DELETE' }); },
  async getCommunityActivity(params: GetActivityParams = {}): Promise<Paginated<ActivityStreamEntry>> { const qs = new URLSearchParams(); if (params.limit) qs.append('limit', String(params.limit)); else qs.append('limit', '100'); if (params.offset) qs.append('offset', String(params.offset)); if (params.userId) qs.append('userId', String(params.userId)); if (params.type) qs.append('type', params.type); if (params.from) qs.append('from', params.from); if (params.to) qs.append('to', params.to); const r = await adminRequest<any>(`/community/activity?${qs.toString()}`); const items: ActivityStreamEntry[] = r.items || r || []; const total = r.total ?? (Array.isArray(items) ? items.length : 0); const limit = r.limit ?? params.limit ?? 100; const offset = r.offset ?? params.offset ?? 0; const page = r.page ?? (offset ? Math.floor(Number(offset) / Number(limit)) + 1 : 1); const totalPages = r.totalPages ?? (limit ? Math.ceil(total / limit) : 1); return { items, total, page, limit, totalPages }; },
  async createActivityEntry(payload: { userId?: number; activityType: string; data?: any }) { return adminRequest<{ item: ActivityStreamEntry }>(`/community/activity`, { method: 'POST', body: JSON.stringify(payload) }); },
  // Comments
  async getCommunityComments(params: { postId?: number; status?: string; limit?: number; offset?: number } = {}): Promise<Paginated<CommunityComment>> { const qs = new URLSearchParams(); if (params.postId) qs.append('postId', String(params.postId)); if (params.status) qs.append('status', params.status); qs.append('limit', String(params.limit ?? 50)); qs.append('offset', String(params.offset ?? 0)); const r = await adminRequest<any>(`/community/comments?${qs.toString()}`); const items: CommunityComment[] = r.items || r || []; const total = r.total ?? (Array.isArray(items) ? items.length : 0); const limit = r.limit ?? params.limit ?? 50; const offset = r.offset ?? params.offset ?? 0; const page = r.page ?? (offset ? Math.floor(Number(offset) / Number(limit)) + 1 : 1); const totalPages = r.totalPages ?? (limit ? Math.ceil(total / limit) : 1); return { items, total, page, limit, totalPages }; },
  async moderateComment(id: number, action: 'approve' | 'reject' | 'delete', reason?: string) { return adminRequest<{ item: CommunityComment }>(`/community/comments/${id}/moderate`, { method: 'PATCH', body: JSON.stringify({ action, reason }) }); },
  // Reports
  async getCommunityReports(params: { status?: string; limit?: number; offset?: number } = {}): Promise<Paginated<CommunityReport>> { const qs = new URLSearchParams(); if (params.status) qs.append('status', params.status); qs.append('limit', String(params.limit ?? 50)); qs.append('offset', String(params.offset ?? 0)); const r = await adminRequest<any>(`/community/reports?${qs.toString()}`); const items: CommunityReport[] = r.items || r || []; const total = r.total ?? (Array.isArray(items) ? items.length : 0); const limit = r.limit ?? params.limit ?? 50; const offset = r.offset ?? params.offset ?? 0; const page = r.page ?? (offset ? Math.floor(Number(offset) / Number(limit)) + 1 : 1); const totalPages = r.totalPages ?? (limit ? Math.ceil(total / limit) : 1); return { items, total, page, limit, totalPages }; },
  async resolveReport(id: number, action: 'approve' | 'remove' | 'ignore', notes?: string) { return adminRequest<{ item: CommunityReport }>(`/community/reports/${id}/resolve`, { method: 'PATCH', body: JSON.stringify({ action, notes }) }); },
  async getReportStats() { return adminRequest<any>(`/community/reports/stats`); },
  // Events
  async getCommunityEvents(params: { limit?: number; offset?: number } = {}): Promise<Paginated<CommunityEvent>> { const qs = new URLSearchParams(); qs.append('limit', String(params.limit ?? 50)); qs.append('offset', String(params.offset ?? 0)); const r = await adminRequest<any>(`/community/events?${qs.toString()}`); const items: CommunityEvent[] = r.items || r || []; const total = r.total ?? (Array.isArray(items) ? items.length : 0); const limit = r.limit ?? params.limit ?? 50; const offset = r.offset ?? params.offset ?? 0; const page = r.page ?? (offset ? Math.floor(Number(offset) / Number(limit)) + 1 : 1); const totalPages = r.totalPages ?? (limit ? Math.ceil(total / limit) : 1); return { items, total, page, limit, totalPages }; },
  async createEvent(data: Partial<CommunityEvent>) { return adminRequest<{ item: CommunityEvent }>(`/community/events`, { method: 'POST', body: JSON.stringify(data) }); },
  async updateEvent(id: number, updates: Partial<CommunityEvent>) { return adminRequest<{ item: CommunityEvent }>(`/community/events/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }); },
  async deleteEvent(id: number) { return adminRequest<{ ok: boolean }>(`/community/events/${id}`, { method: 'DELETE' }); },
  async getEventParticipants(id: number) { return adminRequest<any>(`/community/events/${id}/participants`); },
  async notifyEventParticipants(id: number, message: string) { return adminRequest<{ sent: number }>(`/community/events/${id}/notify`, { method: 'POST', body: JSON.stringify({ message }) }); },
  // Mentorship
  async getMentorshipPairs(params: { limit?: number; offset?: number } = {}): Promise<Paginated<MentorshipPair>> { const qs = new URLSearchParams(); qs.append('limit', String(params.limit ?? 50)); qs.append('offset', String(params.offset ?? 0)); const r = await adminRequest<any>(`/community/mentorship/pairs?${qs.toString()}`); const items: MentorshipPair[] = r.items || r || []; const total = r.total ?? (Array.isArray(items) ? items.length : 0); const limit = r.limit ?? params.limit ?? 50; const offset = r.offset ?? params.offset ?? 0; const page = r.page ?? (offset ? Math.floor(Number(offset) / Number(limit)) + 1 : 1); const totalPages = r.totalPages ?? (limit ? Math.ceil(total / limit) : 1); return { items, total, page, limit, totalPages }; },
  async createMentorshipPair(mentorId: number, menteeId: number, programType?: string) { return adminRequest<{ item: MentorshipPair }>(`/community/mentorship/pairs`, { method: 'POST', body: JSON.stringify({ mentorId, menteeId, programType }) }); },
  async updateMentorshipStatus(id: number, status: string) { return adminRequest<{ item: MentorshipPair }>(`/community/mentorship/pairs/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }); },
  async getMentorshipStats() { return adminRequest<any>(`/community/mentorship/stats`); },
  // Milestones
  async getSpiritualMilestones(params: { userId?: number; limit?: number; offset?: number } = {}): Promise<Paginated<SpiritualMilestone>> { const qs = new URLSearchParams(); if (params.userId) qs.append('userId', String(params.userId)); qs.append('limit', String(params.limit ?? 50)); qs.append('offset', String(params.offset ?? 0)); const r = await adminRequest<any>(`/community/milestones?${qs.toString()}`); const items: SpiritualMilestone[] = r.items || r || []; const total = r.total ?? (Array.isArray(items) ? items.length : 0); const limit = r.limit ?? params.limit ?? 50; const offset = r.offset ?? params.offset ?? 0; const page = r.page ?? (offset ? Math.floor(Number(offset) / Number(limit)) + 1 : 1); const totalPages = r.totalPages ?? (limit ? Math.ceil(total / limit) : 1); return { items, total, page, limit, totalPages }; },
  async getMilestoneStats() { return adminRequest<any>(`/community/milestones/stats`); },
  async celebrateMilestone(id: number) { return adminRequest<{ item: SpiritualMilestone }>(`/community/milestones/${id}/celebrate`, { method: 'POST' }); },
  disconnectDashboardStream() {
    if (this._socket) {
      try { this._socket.disconnect(); } catch (e) { /* ignore */ }
      this._socket = null;
    }
  },
  async uploadAsset(file: File, meta: { title?: string; type?: string; description?: string; tags?: string }) {
    const form = new FormData();
    form.append('file', file);
    if (meta.title) form.append('title', meta.title);
    if (meta.type) form.append('type', meta.type);
    if (meta.description) form.append('description', meta.description);
    if (meta.tags) form.append('tags', meta.tags);
    const res = await fetch(`${ADMIN_API_BASE}/assets`, { method: 'POST', body: form, credentials: 'include' });
    if (!res.ok) throw new Error('Upload failed');
    const json = await res.json().catch(() => ({}));
    // map backend asset keys (snake_case) to frontend-friendly camelCase
    const asset = json.asset || json;
    return asset;
  },
  async updateAsset(id: number, payload: any) {
    return adminRequest<{ asset: any }>(`/assets/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
  },
  async deleteAsset(id: number) {
    return adminRequest<{ message: string }>(`/assets/${id}`, { method: 'DELETE' });
  },
  // Enhanced asset management
  async getAssetStats() {
    return adminRequest<any>(`/assets/stats`);
  },
  // Themes
  async listThemes() {
    const r = await adminRequest<any>(`/themes`);
    // backend might return { themes, pagination, filters } or { themes }
    const themes = r.themes || r.items || r;
    const pagination = r.pagination || { total_count: Array.isArray(themes) ? themes.length : 0, current_page: 1, total_pages: 1 };
    return { items: themes, total: pagination.total_count ?? pagination.total, page: pagination.current_page ?? 1, totalPages: pagination.total_pages ?? 1 };
  },
  // Books (admin) - list mapping
  async listBooks(params: { q?: string; limit?: number; offset?: number } = {}) {
    const search = new URLSearchParams();
    if (params.q) search.append('q', params.q);
    if (params.limit) search.append('limit', String(params.limit));
    if (params.offset) search.append('offset', String(params.offset));
    const r = await adminRequest<any>(`/books?${search.toString()}`);
    const books = r.books || r.items || r;
    const pagination = r.pagination || { total_count: Array.isArray(books) ? books.length : 0, current_page: 1, per_page: r.limit || 20, total_pages: 1 };
    return { items: books, total: pagination.total_count ?? pagination.total, page: pagination.current_page ?? 1, limit: pagination.per_page ?? r.limit ?? 20, totalPages: pagination.total_pages ?? 1 };
  },
  // Admin create book supports multipart with fields 'book' and 'cover' (or bookFile/bookData depending on backend). Accepts { form, book?, cover? }
  async createBookAdmin(input: { form: Record<string, any>; book?: File | null; cover?: File | null }) {
    const form = new FormData();
    // Append metadata fields as strings
    Object.keys(input.form || {}).forEach(key => {
      const val = input.form[key];
      if (val === undefined || val === null) return;
      form.append(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
    });
    if (input.book) form.append('book', input.book);
    if (input.cover) form.append('cover', input.cover);

    const res = await fetch(`${ADMIN_API_BASE}/books`, { method: 'POST', body: form, credentials: 'include' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Create book failed');
    }
    const json = await res.json().catch(() => ({}));
    return json.book || json;
  },
  async createTheme(payload: any) { return adminRequest<{ theme: any }>(`/themes`, { method: 'POST', body: JSON.stringify(payload) }); },
  async updateTheme(id: number, payload: any) { return adminRequest<{ theme: any }>(`/themes/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }); },
  async deleteTheme(id: number) { return adminRequest<{ message: string }>(`/themes/${id}`, { method: 'DELETE' }); },
  // previewTheme: backend may return JSON { preview: { css } } or raw text. Support both.
  async previewTheme(id: number) {
    // Try JSON first via adminRequest which tolerates both JSON and text
    const r = await adminRequest<any>(`/themes/${id}/preview`);
    if (r && r.preview && typeof r.preview.css === 'string') return { css: r.preview.css };
    if (r && typeof r.css === 'string') return { css: r.css };
    // if adminRequest returned { css: text } due to non-json content-type
    if (r && typeof r === 'object' && 'css' in r) return r;
    return { css: '' };
  },
  // Templates
  async listTemplates() { return adminRequest<{ templates: any[] }>(`/templates`); },
  async createTemplate(payload: any) { return adminRequest<{ template: any }>(`/templates`, { method: 'POST', body: JSON.stringify(payload) }); },
  async updateTemplate(id: number, payload: any) { return adminRequest<{ template: any }>(`/templates/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }); },
  async deleteTemplate(id: number) { return adminRequest<{ message: string }>(`/templates/${id}`, { method: 'DELETE' }); },
  async getTemplate(id: number) {
    return adminRequest<{ template: any }>(`/templates/${id}`);
  },
  // Enhanced settings & reports
  async getSettings() { 
    return adminRequest<{ settings: any }>(`/settings`); 
  },
  async saveSettings(payload: any) { 
    return adminRequest<{ message: string; settings: any }>(`/settings`, { method: 'PUT', body: JSON.stringify(payload) }); 
  },
  // Advanced settings API
  // Feature flags
  async listFeatureFlags(params: { q?: string; limit?: number; offset?: number } = {}) {
    const qs = new URLSearchParams();
    if (params.q) qs.append('q', params.q);
    if (params.limit) qs.append('limit', String(params.limit));
    if (params.offset) qs.append('offset', String(params.offset));
    return adminRequest<{ items: any[]; total: number }>(`/settings/feature-flags?${qs.toString()}`);
  },
  async createFeatureFlag(payload: any) { return adminRequest<{ feature_flag: any }>(`/settings/feature-flags`, { method: 'POST', body: JSON.stringify(payload) }); },
  async updateFeatureFlag(id: number, payload: any) { return adminRequest<{ feature_flag: any }>(`/settings/feature-flags/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }); },
  async deleteFeatureFlag(id: number) { return adminRequest<{ message: string }>(`/settings/feature-flags/${id}`, { method: 'DELETE' }); },
  // Experiments
  async listExperiments(params: { q?: string; limit?: number; offset?: number } = {}) {
    const qs = new URLSearchParams(); if (params.q) qs.append('q', params.q); if (params.limit) qs.append('limit', String(params.limit)); if (params.offset) qs.append('offset', String(params.offset));
    return adminRequest<{ items: any[]; total: number }>(`/settings/experiments?${qs.toString()}`);
  },
  async createExperiment(payload: any) { return adminRequest<{ experiment: any }>(`/settings/experiments`, { method: 'POST', body: JSON.stringify(payload) }); },
  async updateExperiment(id: number, payload: any) { return adminRequest<{ experiment: any }>(`/settings/experiments/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }); },
  async deleteExperiment(id: number) { return adminRequest<{ message: string }>(`/settings/experiments/${id}`, { method: 'DELETE' }); },
  // Notification channels
  async listNotificationChannels(params: { limit?: number; offset?: number } = {}) { const qs = new URLSearchParams(); if (params.limit) qs.append('limit', String(params.limit)); if (params.offset) qs.append('offset', String(params.offset)); return adminRequest<{ items: any[] }>(`/settings/notification-channels?${qs.toString()}`); },
  async createNotificationChannel(payload: any) { return adminRequest<{ channel: any }>(`/settings/notification-channels`, { method: 'POST', body: JSON.stringify(payload) }); },
  async updateNotificationChannel(id: number, payload: any) { return adminRequest<{ channel: any }>(`/settings/notification-channels/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }); },
  async deleteNotificationChannel(id: number) { return adminRequest<{ message: string }>(`/settings/notification-channels/${id}`, { method: 'DELETE' }); },
  // Integrations
  async listIntegrations(params: { limit?: number; offset?: number } = {}) { 
    const qs = new URLSearchParams(); 
    if (params.limit) qs.append('limit', String(params.limit)); 
    if (params.offset) qs.append('offset', String(params.offset)); 
    return adminRequest<{ items: any[] }>(`/settings/integrations?${qs.toString()}`); 
},
async createIntegration(payload: any) { 
  return adminRequest<{ integration: any }>(`/settings/integrations`, { method: 'POST', body: JSON.stringify(payload) }); 
},
async updateIntegration(id: number, payload: any) { 
  return adminRequest<{ integration: any }>(`/settings/integrations/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }); 
},
async deleteIntegration(id: number) { 
  return adminRequest<{ message: string }>(`/settings/integrations/${id}`, { method: 'DELETE' }); 
},

// Google Sheets Integration
async exportBooksToGoogleSheets(payload: { 
  integrationId: string; 
  spreadsheetId?: string; 
  createNew?: boolean; 
  title?: string; 
}) { 
  return adminRequest<{ message: string; spreadsheetId?: string }>(`/google-sheets/export-books`, { 
    method: 'POST', 
    body: JSON.stringify(payload) 
  }); 
},

  // --- Business Intelligence (BI) reporting APIs ---
  async getBIKPISnapshot(): Promise<any> {
    return adminRequest<any>(`/bi-reports/kpis/snapshot`);
  },
  async getSpiritualProgressAnalytics(filters: any = {}) {
    const qs = new URLSearchParams(); if (filters.timeframe) qs.append('timeframe', filters.timeframe); if (filters.from) qs.append('from', filters.from); if (filters.to) qs.append('to', filters.to);
    return adminRequest<any>(`/bi-reports/analytics/spiritual-journey?${qs.toString()}`);
  },
  async getEngagementAnalytics(timeframe = '30d') {
    const qs = new URLSearchParams(); qs.append('timeframe', timeframe);
    return adminRequest<any>(`/bi-reports/kpis/engagement?${qs.toString()}`);
  },
  async getCommunityHealthMetrics() {
    return adminRequest<any>(`/bi-reports/kpis/community-health`);
  },

  // Templates
  async getBIReportTemplates(params: { q?: string; limit?: number; offset?: number } = {}) {
    const qs = new URLSearchParams(); if (params.q) qs.append('q', params.q); qs.append('limit', String(params.limit ?? 50)); qs.append('offset', String(params.offset ?? 0));
    const r = await adminRequest<any>(`/bi-reports/templates?${qs.toString()}`);
    const items: any[] = r.items || r || [];
    const total = r.total ?? (Array.isArray(items) ? items.length : 0);
    return { items, total, limit: r.limit ?? params.limit ?? 50, offset: r.offset ?? params.offset ?? 0 };
  },
  async createBIReportTemplate(payload: Partial<any>) { return adminRequest<{ item: any }>(`/bi-reports/templates`, { method: 'POST', body: JSON.stringify(payload) }); },
  async updateBIReportTemplate(id: string, updates: Partial<any>) { return adminRequest<{ item: any }>(`/bi-reports/templates/${id}`, { method: 'PUT', body: JSON.stringify(updates) }); },
  async deleteBIReportTemplate(id: string) { return adminRequest<{ ok: boolean }>(`/bi-reports/templates/${id}`, { method: 'DELETE' }); },
  async executeBIReportTemplate(id: string, parameters: any = {}) { return adminRequest<{ execution: any }>(`/bi-reports/templates/${id}/execute`, { method: 'POST', body: JSON.stringify(parameters) }); },

  // Scheduling
  async getScheduledReports(params: { limit?: number; offset?: number } = {}) { const qs = new URLSearchParams(); qs.append('limit', String(params.limit ?? 50)); qs.append('offset', String(params.offset ?? 0)); const r = await adminRequest<any>(`/bi-reports/schedules?${qs.toString()}`); const items: any[] = r.items || r || []; const total = r.total ?? (Array.isArray(items) ? items.length : 0); return { items, total, limit: r.limit ?? params.limit ?? 50, offset: r.offset ?? params.offset ?? 0 }; },
  async createScheduledReport(payload: Partial<any>) { return adminRequest<{ item: any }>(`/bi-reports/schedules`, { method: 'POST', body: JSON.stringify(payload) }); },
  async updateScheduledReport(id: string, updates: Partial<any>) { return adminRequest<{ item: any }>(`/bi-reports/schedules/${id}`, { method: 'PUT', body: JSON.stringify(updates) }); },
  async deleteScheduledReport(id: string) { return adminRequest<{ ok: boolean }>(`/bi-reports/schedules/${id}`, { method: 'DELETE' }); },
  async triggerScheduledReport(id: string) { return adminRequest<{ execution: any }>(`/bi-reports/schedules/${id}/trigger`, { method: 'POST' }); },

  // Executions
  async getReportExecutions(params: { templateId?: string; scheduledId?: string; limit?: number; offset?: number } = {}) { const qs = new URLSearchParams(); if (params.templateId) qs.append('templateId', String(params.templateId)); if (params.scheduledId) qs.append('scheduledId', String(params.scheduledId)); qs.append('limit', String(params.limit ?? 50)); qs.append('offset', String(params.offset ?? 0)); const r = await adminRequest<any>(`/bi-reports/executions?${qs.toString()}`); const items: any[] = r.items || r || []; const total = r.total ?? (Array.isArray(items) ? items.length : 0); return { items, total, limit: r.limit ?? params.limit ?? 50, offset: r.offset ?? params.offset ?? 0 }; },
  async getExecutionStatus(executionId: string) { return adminRequest<{ status: any }>(`/bi-reports/executions/${executionId}/status`); },
  async downloadReportResult(executionId: string) { return adminRequest<any>(`/bi-reports/executions/${executionId}/download`, {}, true); },

  // Insights
  async getUserInsights(userId: string) { return adminRequest<{ items: any[] }>(`/bi-reports/insights/user/${userId}`); },
  async getCommunityInsights() { return adminRequest<{ items: any[] }>(`/bi-reports/insights/community`); },
  async generateInsights(type: any, params: any = {}) { return adminRequest<{ items: any[] }>(`/bi-reports/insights/generate`, { method: 'POST', body: JSON.stringify({ type, ...params }) }); },

  // BI socket stream
  connectBIStream(onKPIUpdate: (d:any)=>void, onExecutionStatus: (d:any)=>void, onInsight: (d:any)=>void, onError?: (err:unknown)=>void) {
    // use top-level io import
    try {
      if (this._socket) {
        this._socket.disconnect();
        this._socket = null;
      }
  const socket = io(SOCKET_BASE, { withCredentials: true, path: '/socket.io' });
      this._socket = socket as Socket;
      socket.on('connect', () => {
        try { socket.emit('bi:subscribe', { rooms: ['bi-kpis','bi-executions','bi-insights'] }); } catch (e) {
          console.error('Failed to subscribe to BI rooms:', e);
        }
      });
      socket.on('bi:kpi-update', (payload: any) => { try { onKPIUpdate && onKPIUpdate(payload); } catch (e) { console.error(e); } });
      socket.on('bi:execution-status', (payload: any) => { try { onExecutionStatus && onExecutionStatus(payload); } catch (e) { console.error(e); } });
      socket.on('bi:insight-generated', (payload: any) => { try { onInsight && onInsight(payload); } catch (e) { console.error(e); } });
      socket.on('error', (err: unknown) => { if (onError) onError(err); });
  return socket;
    } catch (e) {
      if (onError) onError(e);
      throw e;
    }
  },

  // --- System monitoring APIs ---
  async getSystemMetrics() {
    return adminRequest<any>(`/system/metrics/current`);
  },
  async getSystemMetricsHistory(timeframe: string = '24h') {
    const qs = new URLSearchParams(); qs.append('timeframe', timeframe);
    return adminRequest<any>(`/system/metrics/history?${qs.toString()}`);
  },
  async getApiAnalytics(timeframe: string = '24h') {
    const qs = new URLSearchParams(); qs.append('timeframe', timeframe);
    return adminRequest<any>(`/system/metrics/api-analytics?${qs.toString()}`);
  },
  async getDatabaseMetrics() { return adminRequest<any>(`/system/metrics/database`); },

  async getDatabaseAnalysis() { return adminRequest<any>(`/system/database/analysis`); },
  async runDatabaseOptimization(payload: { table?: string } = {}) { return adminRequest<any>(`/system/database/optimize`, { method: 'POST', body: JSON.stringify(payload) }); },
  async getSlowQueries(limit: number = 100) { 
    const qs = new URLSearchParams(); qs.append('limit', String(limit));
    return adminRequest<any>(`/system/database/slow-queries?${qs.toString()}`); 
  },
  async getConnectionPoolStatus() { return adminRequest<any>(`/system/database/connections`); },

  async getSystemAlerts() { const r = await adminRequest<any>(`/system/alerts/system`); return r.items || r || []; },
  async getSystemAlertRules() { const r = await adminRequest<any>(`/system/alerts/system/rules`); return r.items || r || []; },
  async createSystemAlertRule(payload: any) { return adminRequest<any>(`/system/alerts/system/rules`, { method: 'POST', body: JSON.stringify(payload) }); },
  async updateSystemAlertRule(id: string, updates: any) { return adminRequest<any>(`/system/alerts/system/rules/${id}`, { method: 'PUT', body: JSON.stringify(updates) }); },
  async deleteSystemAlertRule(id: string) { return adminRequest<any>(`/system/alerts/system/rules/${id}`, { method: 'DELETE' }); },
  async resolveSystemAlert(id: string) { return adminRequest<any>(`/system/alerts/system/${id}/resolve`, { method: 'POST' }); },

  async getDeploymentInfo() { return adminRequest<any>(`/system/deployment/info`); },
  async getDeploymentHistory() { const r = await adminRequest<any>(`/system/deployment/history`); return r.items || r || []; },
  async getSystemHealth() { return adminRequest<any>(`/system/deployment/health`); },
  // optional restart - may not be enabled
  async restartSystem() { return adminRequest<any>(`/system/deployment/restart`, { method: 'POST' }); },
  
  // System metrics streaming connection
  connectSystemMetricsStream(onMetrics: (data: any) => void, onAlert: (data: any) => void, onError?: (err: unknown) => void) {
    // For Socket.IO approach
    try {
      if (this._socket) {
        this._socket.disconnect();
        this._socket = null;
      }
      const socket = io(SOCKET_BASE, { withCredentials: true, path: '/socket.io' });
      this._socket = socket as Socket;
      socket.on('connect', () => {
        try { socket.emit('system:subscribe', { rooms: ['system-metrics', 'system-alerts'] }); } catch (e) { console.error('Failed to subscribe to system rooms', e); }
      });
      socket.on('system:metrics', (payload: any) => { try { onMetrics && onMetrics(payload); } catch (e) { console.error(e); } });
      socket.on('system:alert', (payload: any) => { try { onAlert && onAlert(payload); } catch (e) { console.error(e); } });
      socket.on('error', (err: unknown) => { if (onError) onError(err); });
      return socket;
    } catch (e) {
      if (onError) onError(e);
      throw e;
    }
  },
};