const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const BaseService = require('./BaseService');

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

class BackupService extends BaseService {
  static async createBackup(backupName = null) {
    try {
      // Generate backup name if not provided
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const name = backupName || `backup-${timestamp}`;
      
      // Create backup directory if it doesn't exist
      const backupDir = path.join(__dirname, '..', 'backups');
      if (!fs.existsSync(backupDir)) {
        await mkdirAsync(backupDir, { recursive: true });
      }
      
      // Define backup file path
      const backupFilePath = path.join(backupDir, `${name}.json`);
      
      // Get list of tables to backup
      const tables = await this.getTables();
      
      // Create backup data structure
      const backupData = {
        metadata: {
          createdAt: new Date().toISOString(),
          version: '1.0',
          tables: tables
        },
        data: {}
      };
      
      // Backup each table
      for (const table of tables) {
        try {
          const result = await this.executeQuery(`SELECT * FROM ${table}`);
          backupData.data[table] = result.rows;
        } catch (error) {
          console.warn(`Failed to backup table ${table}:`, error.message);
          backupData.data[table] = [];
        }
      }
      
      // Write backup to file
      await writeFileAsync(backupFilePath, JSON.stringify(backupData, null, 2));
      
      console.log(`Backup created successfully: ${backupFilePath}`);
      return {
        success: true,
        path: backupFilePath,
        name: name,
        timestamp: backupData.metadata.createdAt
      };
    } catch (error) {
      this.handleError(error, 'createBackup', { backupName });
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  static async restoreBackup(backupName) {
    try {
      // Define backup file path
      const backupFilePath = path.join(__dirname, '..', 'backups', `${backupName}.json`);
      
      // Check if backup file exists
      if (!fs.existsSync(backupFilePath)) {
        throw new Error(`Backup file not found: ${backupFilePath}`);
      }
      
      // Read backup file
      const backupContent = fs.readFileSync(backupFilePath, 'utf8');
      const backupData = JSON.parse(backupContent);
      
      // Validate backup structure
      if (!backupData.metadata || !backupData.data) {
        throw new Error('Invalid backup file structure');
      }
      
      // Restore each table
      for (const [tableName, rows] of Object.entries(backupData.data)) {
        try {
          // Clear existing data
          await this.executeQuery(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`);
          
          // Insert backup data
          if (Array.isArray(rows) && rows.length > 0) {
            // Generate INSERT query
            const columns = Object.keys(rows[0]);
            const values = rows.map(row => 
              `(${columns.map(col => {
                const value = row[col];
                if (value === null) return 'NULL';
                if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
                if (typeof value === 'boolean') return value ? 'true' : 'false';
                return value;
              }).join(', ')})`
            ).join(',\n');
            
            const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${values}`;
            await this.executeQuery(query);
          }
        } catch (error) {
          console.warn(`Failed to restore table ${tableName}:`, error.message);
        }
      }
      
      console.log(`Backup restored successfully: ${backupName}`);
      return {
        success: true,
        name: backupName,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.handleError(error, 'restoreBackup', { backupName });
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  static async listBackups() {
    try {
      const backupDir = path.join(__dirname, '..', 'backups');
      
      // Check if backup directory exists
      if (!fs.existsSync(backupDir)) {
        return [];
      }
      
      // Read backup files
      const files = fs.readdirSync(backupDir);
      const backups = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filePath = path.join(backupDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: path.basename(file, '.json'),
            path: filePath,
            size: stats.size,
            createdAt: stats.birthtime.toISOString()
          };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return backups;
    } catch (error) {
      this.handleError(error, 'listBackups');
      return [];
    }
  }
  
  static async deleteBackup(backupName) {
    try {
      const backupFilePath = path.join(__dirname, '..', 'backups', `${backupName}.json`);
      
      // Check if backup file exists
      if (!fs.existsSync(backupFilePath)) {
        throw new Error(`Backup file not found: ${backupFilePath}`);
      }
      
      // Delete backup file
      fs.unlinkSync(backupFilePath);
      
      console.log(`Backup deleted successfully: ${backupName}`);
      return {
        success: true,
        name: backupName
      };
    } catch (error) {
      this.handleError(error, 'deleteBackup', { backupName });
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  static async getTables() {
    try {
      // Get list of tables (excluding system tables)
      const result = await this.executeQuery(`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename
      `);
      
      return result.rows.map(row => row.tablename);
    } catch (error) {
      this.handleError(error, 'getTables');
      return [];
    }
  }
  
  static async getTableSchema(tableName) {
    try {
      // Get table schema information
      const result = await this.executeQuery(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position
      `, [tableName]);
      
      return result.rows;
    } catch (error) {
      this.handleError(error, 'getTableSchema', { tableName });
      return [];
    }
  }
}

module.exports = BackupService;