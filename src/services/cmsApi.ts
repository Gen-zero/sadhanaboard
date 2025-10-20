import { adminApi } from './adminApi';
import type { CmsAsset, CmsTheme, CmsTemplate } from '@/types/cms';

const CMS_BASE = '/cms';

export const cmsApi = {
  async uploadAsset(file: File, meta: Record<string, any> = {}) {
    const form = new FormData();
    form.append('file', file);
    Object.keys(meta || {}).forEach(k => form.append(k, typeof meta[k] === 'object' ? JSON.stringify(meta[k]) : String(meta[k])));
    const res = await fetch(`/api/admin${CMS_BASE}/assets`, { method: 'POST', body: form, credentials: 'include' });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },

  async listAssets(params: { q?: string; limit?: number; offset?: number } = {}) {
    const qs = new URLSearchParams();
    if (params.q) qs.append('q', params.q);
    if (params.limit) qs.append('limit', String(params.limit));
    if (params.offset) qs.append('offset', String(params.offset));
    const r = await fetch(`/api/admin${CMS_BASE}/assets?${qs.toString()}`, { credentials: 'include' });
    if (!r.ok) throw new Error('Failed to list assets');
    return r.json();
  },

  async getAsset(id: number) {
    const r = await fetch(`/api/admin${CMS_BASE}/assets/${id}`, { credentials: 'include' });
    if (!r.ok) throw new Error('Failed to get asset');
    return r.json();
  },

  async createTheme(theme: Partial<CmsTheme>) {
    const r = await fetch(`/api/admin${CMS_BASE}/themes`, { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify(theme) });
    if (!r.ok) throw new Error('Failed to create theme');
    return r.json();
  },

  async createTemplate(template: Partial<CmsTemplate>) {
    const r = await fetch(`/api/admin${CMS_BASE}/templates`, { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify(template) });
    if (!r.ok) throw new Error('Failed to create template');
    return r.json();
  },

  async listThemes(params: { limit?: number; offset?: number } = {}) {
    const qs = new URLSearchParams();
    if (params.limit) qs.append('limit', String(params.limit));
    if (params.offset) qs.append('offset', String(params.offset));
    const r = await fetch(`/api/admin${CMS_BASE}/themes?${qs.toString()}`, { credentials: 'include' });
    if (!r.ok) throw new Error('Failed to list themes');
    return r.json();
  },

  async listTemplates(params: { limit?: number; offset?: number } = {}) {
    const qs = new URLSearchParams();
    if (params.limit) qs.append('limit', String(params.limit));
    if (params.offset) qs.append('offset', String(params.offset));
    const r = await fetch(`/api/admin${CMS_BASE}/templates?${qs.toString()}`, { credentials: 'include' });
    if (!r.ok) throw new Error('Failed to list templates');
    return r.json();
  },

  // TODO: implement processing hooks, variant retrieval, publish, versioning
};

export default cmsApi;
