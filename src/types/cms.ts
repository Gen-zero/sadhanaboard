import type { EnhancedUser } from './admin';

export type ContentStatus = 'draft' | 'published' | 'archived' | 'pending_review';

export interface MediaVariant {
  id?: number;
  asset_id?: number;
  variant_type: string;
  file_path: string;
  width?: number;
  height?: number;
  file_size?: number;
  metadata?: Record<string, any>;
}

export interface CmsAsset {
  id: number;
  title?: string;
  description?: string;
  type?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  category_id?: number | null;
  status?: ContentStatus;
  variants?: MediaVariant[];
  created_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CmsTheme {
  id?: number;
  name: string;
  deity?: string;
  description?: string;
  color_palette?: Record<string, string>;
  css_variables?: Record<string, string>;
  preview_image?: string;
  status?: ContentStatus;
  version?: number;
}

export interface CmsTemplate {
  id?: number;
  title: string;
  description?: string;
  type?: string;
  difficulty_level?: string;
  duration_minutes?: number;
  instructions?: any[];
  components?: any[];
  tags?: string[];
  status?: ContentStatus;
  version?: number;
}

export interface VersionHistory {
  id: number;
  content_type: string;
  content_id: number;
  version: number;
  payload: any;
  created_by?: number;
  created_at?: string;
}
