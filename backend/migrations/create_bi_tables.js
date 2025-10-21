const db = require('../config/db');

async function createBITables() {
  try {
    console.log('Creating BI tables...');
    
    // Create report_templates table
    await db.query(`
      CREATE TABLE IF NOT EXISTS report_templates (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        owner_id INTEGER REFERENCES admin_details(id) ON DELETE SET NULL,
        template JSONB NOT NULL,
        template_type TEXT NOT NULL DEFAULT 'dashboard' CHECK (template_type IN ('dashboard','chart','table','mixed')),
        default_format TEXT NOT NULL DEFAULT 'pdf' CHECK (default_format IN ('pdf','csv','json')),
        is_public BOOLEAN DEFAULT false,
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    await db.query('CREATE INDEX IF NOT EXISTS idx_report_templates_owner_id ON report_templates(owner_id)');
    
    // Create scheduled_reports table
    await db.query(`
      CREATE TABLE IF NOT EXISTS scheduled_reports (
        id SERIAL PRIMARY KEY,
        template_id INTEGER REFERENCES report_templates(id) ON DELETE CASCADE,
        name TEXT,
        description TEXT,
        cron_expression TEXT NOT NULL,
        timezone TEXT DEFAULT 'UTC',
        next_run TIMESTAMP WITH TIME ZONE,
        recipients JSONB DEFAULT '[]'::JSONB,
        output_format TEXT NOT NULL DEFAULT 'pdf' CHECK (output_format IN ('pdf','csv','json')),
        active BOOLEAN DEFAULT true,
        last_run TIMESTAMP WITH TIME ZONE,
        retry_policy JSONB DEFAULT '{}'::JSONB,
        created_by INTEGER REFERENCES admin_details(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    await db.query('CREATE INDEX IF NOT EXISTS idx_scheduled_reports_template_id ON scheduled_reports(template_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_scheduled_reports_created_by ON scheduled_reports(created_by)');
    
    // Create report_executions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS report_executions (
        id SERIAL PRIMARY KEY,
        scheduled_id INTEGER REFERENCES scheduled_reports(id) ON DELETE SET NULL,
        template_id INTEGER REFERENCES report_templates(id) ON DELETE SET NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','running','completed','failed')),
        started_at TIMESTAMP WITH TIME ZONE,
        finished_at TIMESTAMP WITH TIME ZONE,
        result_url TEXT,
        result_data JSONB,
        logs TEXT,
        error TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    await db.query('CREATE INDEX IF NOT EXISTS idx_report_executions_template_id ON report_executions(template_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_report_executions_scheduled_id ON report_executions(scheduled_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_report_executions_status ON report_executions(status)');
    
    // Create spiritual_insights table
    await db.query(`
      CREATE TABLE IF NOT EXISTS spiritual_insights (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        sadhana_id INTEGER REFERENCES sadhanas(id) ON DELETE SET NULL,
        name TEXT,
        description TEXT,
        insight_type TEXT NOT NULL DEFAULT 'behavior' CHECK (insight_type IN ('behavior','community','predictive','custom')),
        score NUMERIC,
        content JSONB NOT NULL,
        source TEXT,
        generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    await db.query('CREATE INDEX IF NOT EXISTS idx_spiritual_insights_user_id ON spiritual_insights(user_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_spiritual_insights_type ON spiritual_insights(insight_type)');
    
    // Create report_shares table
    await db.query(`
      CREATE TABLE IF NOT EXISTS report_shares (
        id SERIAL PRIMARY KEY,
        execution_id INTEGER REFERENCES report_executions(id) ON DELETE CASCADE,
        shared_with JSONB DEFAULT '[]'::JSONB,
        access_token TEXT,
        link TEXT,
        expires_at TIMESTAMP WITH TIME ZONE,
        created_by INTEGER REFERENCES admin_details(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    await db.query('CREATE INDEX IF NOT EXISTS idx_report_shares_execution_id ON report_shares(execution_id)');
    
    // Create helpful view
    await db.query(`
      CREATE OR REPLACE VIEW recent_report_executions AS
      SELECT e.id, e.template_id, e.scheduled_id, e.status, e.started_at, e.finished_at, e.result_url, e.created_at
      FROM report_executions e
      ORDER BY e.created_at DESC
      LIMIT 100
    `);
    
    console.log('BI tables created successfully!');
  } catch (error) {
    console.error('Error creating BI tables:', error);
  }
}

// Run the migration
createBITables().then(() => {
  console.log('BI tables migration completed');
  process.exit(0);
}).catch((error) => {
  console.error('BI tables migration failed:', error);
  process.exit(1);
});