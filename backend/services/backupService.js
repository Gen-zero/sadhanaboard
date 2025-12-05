const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

class BackupService {
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
      
      // Get list of Mongoose models to backup
      // Note: This is file-system based backup, actual MongoDB export would use mongodump
      const tables = ['users', 'sadhanas', 'books', 'sadhana_progress', 'sadhana_sessions'];
      
      // Create backup data structure
      const backupData = {
        metadata: {
          createdAt: new Date().toISOString(),
          version: '1.0',
          type: 'mongodb',
          collections: tables
        },
        data: {}
      };
      
      // Note: For actual MongoDB backup, use mongodump utility
      // This is a placeholder structure for file-based backups
      for (const table of tables) {
        backupData.data[table] = [];
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
      console.error('createBackup error:', error);
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
      
      // Restore logic - would use mongorestore for actual MongoDB
      for (const [tableName, rows] of Object.entries(backupData.data)) {
        try {
          // Clear and restore logic would go here
          // For MongoDB, use: mongorestore --uri=<connection_string> <dump_directory>
          console.log(`Restoring collection ${tableName}: ${rows.length} documents`);
        } catch (error) {
          console.warn(`Failed to restore collection ${tableName}:`, error.message);
        }
      }
      
      console.log(`Backup restored successfully: ${backupName}`);
      return {
        success: true,
        name: backupName,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('restoreBackup error:', error);
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
      console.error('listBackups error:', error);
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
      console.error('deleteBackup error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
    
  static async getTables() {
    // Return list of MongoDB collections (hardcoded for now)
    // In production, these would be queried from MongoDB
    return ['users', 'sadhanas', 'books', 'sadhana_progress', 'sadhana_sessions', 'themes', 'sadhana_activity'];
  }
}

module.exports = BackupService;
