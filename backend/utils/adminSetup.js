const db = require('../config/db');

// Create admin logs table and other necessary tables
async function setupAdminTables() {
  try {
    // Create admin_logs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER NOT NULL,
        action VARCHAR(255) NOT NULL,
        target_type VARCHAR(100),
        target_id INTEGER,
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create indexes for better performance
    await db.query('CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action)');

    // Ensure users table has necessary admin columns
    try {
      await db.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
        ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE
      `);
    } catch (error) {
      console.log('Admin columns already exist or error adding them:', error.message);
    }

    // Check if sadhanas table exists, if not create it
    try {
      const sadhanasExists = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'sadhanas'
        )
      `);
      
      if (!sadhanasExists.rows[0].exists) {
        await db.query(`
          CREATE TABLE sadhanas (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) DEFAULT 'active',
            duration INTEGER DEFAULT 21,
            start_date DATE,
            end_date DATE,
            progress JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `);
      }
    } catch (error) {
      console.log('Sadhanas table already exists or error creating it:', error.message);
    }

    // Check if books table exists, if not create it
    try {
      const booksExists = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'books'
        )
      `);
      
      if (!booksExists.rows[0].exists) {
        await db.query(`
          CREATE TABLE books (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255),
            tradition VARCHAR(100),
            file_path VARCHAR(500),
            description TEXT,
            upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            uploaded_by UUID REFERENCES users(id)
          )
        `);
      }
    } catch (error) {
      console.log('Books table already exists or error creating it:', error.message);
    }

    // Check if themes table exists, if not create it
    try {
      const themesExists = await db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'themes'
        )
      `);
      
      if (!themesExists.rows[0].exists) {
        await db.query(`
          CREATE TABLE themes (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            deity VARCHAR(100),
            colors JSONB,
            available BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `);
      }
    } catch (error) {
      console.log('Themes table already exists or error creating it:', error.message);
    }

    console.log('Admin tables setup completed successfully');
  } catch (error) {
    console.error('Error setting up admin tables:', error);
  }
}

// Additional admin-specific tables/enhancements for logs/security
async function setupAdminLogsAndSecurity() {
  try {
    // Add enrichment columns to admin_logs if missing
    await db.query(`ALTER TABLE admin_logs
      ADD COLUMN IF NOT EXISTS severity TEXT DEFAULT 'info',
      ADD COLUMN IF NOT EXISTS category TEXT,
      ADD COLUMN IF NOT EXISTS ip_address INET,
      ADD COLUMN IF NOT EXISTS user_agent TEXT,
      ADD COLUMN IF NOT EXISTS session_id TEXT,
      ADD COLUMN IF NOT EXISTS correlation_id UUID,
      ADD COLUMN IF NOT EXISTS risk_score INT DEFAULT 0,
      ADD COLUMN IF NOT EXISTS geo_location JSONB,
      ADD COLUMN IF NOT EXISTS metadata JSONB
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS security_events (
        id BIGSERIAL PRIMARY KEY,
        log_id BIGINT REFERENCES admin_logs(id) ON DELETE SET NULL,
        event_type TEXT,
        threat_level TEXT,
        detection_rule TEXT,
        correlation_id UUID,
        notes TEXT,
        false_positive BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        resolved_at TIMESTAMP WITH TIME ZONE,
        resolved_by BIGINT
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS log_alert_rules (
        id BIGSERIAL PRIMARY KEY,
        rule_name TEXT NOT NULL,
        conditions JSONB DEFAULT '{}',
        notification_channels JSONB DEFAULT '[]',
        enabled BOOLEAN DEFAULT TRUE,
        severity_threshold TEXT DEFAULT 'warn',
        created_by BIGINT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    await db.query('CREATE INDEX IF NOT EXISTS idx_admin_logs_correlation ON admin_logs(correlation_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_admin_logs_severity ON admin_logs(severity)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_security_events_log_id ON security_events(log_id)');
  } catch (e) {
    console.error('setupAdminLogsAndSecurity error', e);
  }
}

module.exports = { setupAdminTables, setupAdminLogsAndSecurity };