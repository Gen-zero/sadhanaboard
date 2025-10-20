const express = require('express');
const { adminAuthenticate, requirePermission } = require('../middleware/adminAuth');
const { catchAsync } = require('../middleware/errorHandler');
const ValidationMiddleware = require('../middleware/validationMiddleware');
const BackupService = require('../services/backupService');

const router = express.Router();

// Get list of backups
router.get('/backups', 
  adminAuthenticate, 
  requirePermission('read:backup'),
  catchAsync(async (req, res) => {
    const backups = await BackupService.listBackups();
    res.json({ backups });
  })
);

// Create a new backup
router.post('/backups', 
  adminAuthenticate, 
  requirePermission('create:backup'),
  ValidationMiddleware.validateBackup(),
  catchAsync(async (req, res) => {
    const { name, includeLogs } = req.body;
    const result = await BackupService.createBackup(name);
    
    if (result.success) {
      // Log the backup creation
      req.secureLog('BACKUP_CREATED', 'backup', result.name, { 
        path: result.path,
        timestamp: result.timestamp
      }, { category: 'backup' });
      
      res.status(201).json({ 
        message: 'Backup created successfully',
        backup: result
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to create backup',
        message: result.error
      });
    }
  })
);

// Restore a backup
router.post('/backups/:name/restore', 
  adminAuthenticate, 
  requirePermission('restore:backup'),
  ValidationMiddleware.validateString('name', { required: true, minLength: 1, maxLength: 100 }),
  catchAsync(async (req, res) => {
    const { name } = req.params;
    
    // Log the restore attempt
    req.secureLog('BACKUP_RESTORE_ATTEMPT', 'backup', name, null, { 
      category: 'backup',
      severity: 'warning'
    });
    
    const result = await BackupService.restoreBackup(name);
    
    if (result.success) {
      // Log the successful restore
      req.secureLog('BACKUP_RESTORED', 'backup', name, { 
        timestamp: result.timestamp
      }, { category: 'backup' });
      
      res.json({ 
        message: 'Backup restored successfully',
        backup: result
      });
    } else {
      // Log the failed restore
      req.secureLog('BACKUP_RESTORE_FAILED', 'backup', name, { 
        error: result.error
      }, { 
        category: 'backup',
        severity: 'error'
      });
      
      res.status(500).json({ 
        error: 'Failed to restore backup',
        message: result.error
      });
    }
  })
);

// Delete a backup
router.delete('/backups/:name', 
  adminAuthenticate, 
  requirePermission('delete:backup'),
  ValidationMiddleware.validateString('name', { required: true, minLength: 1, maxLength: 100 }),
  catchAsync(async (req, res) => {
    const { name } = req.params;
    const result = await BackupService.deleteBackup(name);
    
    if (result.success) {
      // Log the deletion
      req.secureLog('BACKUP_DELETED', 'backup', name, null, { category: 'backup' });
      
      res.json({ 
        message: 'Backup deleted successfully',
        backup: result
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to delete backup',
        message: result.error
      });
    }
  })
);

// Get backup details
router.get('/backups/:name', 
  adminAuthenticate, 
  requirePermission('read:backup'),
  ValidationMiddleware.validateString('name', { required: true, minLength: 1, maxLength: 100 }),
  catchAsync(async (req, res) => {
    const { name } = req.params;
    const backups = await BackupService.listBackups();
    const backup = backups.find(b => b.name === name);
    
    if (!backup) {
      return res.status(404).json({ 
        error: 'Backup not found',
        message: `Backup with name '${name}' not found`
      });
    }
    
    res.json({ backup });
  })
);

// Download a backup
router.get('/backups/:name/download', 
  adminAuthenticate, 
  requirePermission('read:backup'),
  ValidationMiddleware.validateString('name', { required: true, minLength: 1, maxLength: 100 }),
  catchAsync(async (req, res) => {
    const { name } = req.params;
    
    // Get backup details
    const backups = await BackupService.listBackups();
    const backup = backups.find(b => b.name === name);
    
    if (!backup) {
      return res.status(404).json({ 
        error: 'Backup not found',
        message: `Backup with name '${name}' not found`
      });
    }
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${name}.json"`);
    res.setHeader('Content-Type', 'application/json');
    
    // Send the backup file
    res.sendFile(backup.path);
  })
);

module.exports = router;