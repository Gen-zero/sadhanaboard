// BI reporting types
export type ReportFormat = 'pdf' | 'csv' | 'json' | 'email';
export type InsightType = 'practice_recommendation' | 'milestone_celebration' | 'consistency_improvement';
export type TemplateType = 'kpi_dashboard' | 'spiritual_progress' | 'engagement_analysis' | 'custom';

export interface ChartConfig {
  id?: string;
  chart_type: string; // e.g. 'line'|'bar'|'pie'|'table'|'kpi'
  data_source: string; // e.g. 'users'|'sadhanas'|'activity' etc.
  filters?: Record<string, any>;
  aggregations?: Array<{ field: string; op: 'count'|'sum'|'avg'|'max'|'min' }>;
  group_by?: string[];
  styling?: Record<string, any>;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  template: {
    layout: any;
    components: ChartConfig[];
  };
  template_type: TemplateType;
  owner_id?: string;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ScheduledReport {
  id: string;
  template_id: string;
  name: string;
  cron_expression: string;
  recipients: string[] | any[];
  output_format: ReportFormat;
  active: boolean;
  last_run?: string | null;
  next_run?: string | null;
  created_by?: string;
  created_at?: string;
}

export type ExecutionStatus = 'running' | 'completed' | 'failed' | 'queued';

export interface ReportExecution {
  id: string;
  template_id: string;
  scheduled_id?: string | null;
  started_at?: string;
  finished_at?: string;
  status?: ExecutionStatus;
  result_data?: any;
  result_url?: string | null;
  error?: string | null;
}

export interface SpiritualInsight {
  id: string;
  insight_type: InsightType;
  user_id?: string | null;
  content: any;
  score?: number;
  generated_at?: string;
  expires_at?: string | null;
}

export interface KPISnapshot {
  daily_active_practitioners: number;
  completion_rates: { [sadhana: string]: number } | number;
  average_session_duration_seconds: number;
  milestone_achievements: { total: number; by_milestone?: Record<string, number> };
  timestamp?: string;
}

export interface BIStreamKPIUpdate {
  kpi: Partial<KPISnapshot>;
  timestamp?: string;
}

export interface BIStreamExecutionUpdate {
  executionId: string;
  status: ExecutionStatus;
  progress?: number; // 0-100
  message?: string;
}
