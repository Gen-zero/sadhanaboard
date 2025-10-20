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

import type { BookProgress, Bookmark, Annotation } from '@/types/books';

export const bookApi = {
  async getProgress(bookId: number): Promise<{ data: BookProgress | null }>{
    return req(`/books/${bookId}/reading/progress`);
  },
  async upsertProgress(bookId: number, payload: { position?: string; page?: number; percent?: number; timeSpentMinutes?: number }): Promise<{ data: BookProgress }>{
    return req(`/books/${bookId}/reading/progress`, { method: 'POST', body: JSON.stringify(payload) });
  },
  async createBookmark(bookId: number, payload: { label?: string; page?: number; position?: any; isPublic?: boolean }): Promise<{ data: Bookmark }>{
    return req(`/books/${bookId}/reading/bookmarks`, { method: 'POST', body: JSON.stringify(payload) });
  },
  async listBookmarks(bookId: number): Promise<{ data: Bookmark[] }>{
    return req(`/books/${bookId}/reading/bookmarks`);
  },
  async updateBookmark(bookId: number, id: number, payload: Partial<{ label?: string; page?: number; position?: any; isPublic?: boolean }>): Promise<{ data: Bookmark }>{
    return req(`/books/${bookId}/reading/bookmarks/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },
  async deleteBookmark(bookId: number, id: number): Promise<{ success: boolean }>{
    return req(`/books/${bookId}/reading/bookmarks/${id}`, { method: 'DELETE' });
  },
  async createAnnotation(bookId: number, payload: { page?: number; position?: any; content?: string; isPrivate?: boolean }): Promise<{ data: Annotation }>{
    return req(`/books/${bookId}/reading/annotations`, { method: 'POST', body: JSON.stringify(payload) });
  },
  async listAnnotations(bookId: number, includePublic = false): Promise<{ data: Annotation[] }>{
    const q = includePublic ? '?includePublic=1' : '';
    return req(`/books/${bookId}/reading/annotations${q}`);
  },
  async updateAnnotation(bookId: number, id: number, payload: Partial<{ page?: number; position?: any; content?: string; isPrivate?: boolean }>): Promise<{ data: Annotation }>{
    return req(`/books/${bookId}/reading/annotations/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },
  async deleteAnnotation(bookId: number, id: number): Promise<{ success: boolean }>{
    return req(`/books/${bookId}/reading/annotations/${id}`, { method: 'DELETE' });
  }
};