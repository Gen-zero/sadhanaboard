const BaseService = require('./BaseService');

class DashboardService extends BaseService {
  // Create a custom dashboard for an admin
  static async createCustomDashboard(adminId, name, layout = []) {
    try {
      const query = `
        INSERT INTO admin_dashboards 
        (admin_id, name, layout, is_default, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING *`;
      
      const result = await this.executeQuery(query, [adminId, name, this.stringifyJson(layout), false]);
      
      const dashboard = result.rows[0];
      return {
        ...dashboard,
        layout: this.parseJsonField(dashboard.layout, [])
      };
    } catch (error) {
      this.handleError(error, 'createCustomDashboard', { adminId, name });
    }
  }
  
  // Get all dashboards for an admin
  static async getDashboardsForAdmin(adminId) {
    try {
      const query = `
        SELECT * FROM admin_dashboards 
        WHERE admin_id = $1 
        ORDER BY is_default DESC, created_at ASC`;
      
      const result = await this.executeQuery(query, [adminId]);
      
      return result.rows.map(dashboard => ({
        ...dashboard,
        layout: this.parseJsonField(dashboard.layout, [])
      }));
    } catch (error) {
      this.handleError(error, 'getDashboardsForAdmin', { adminId });
    }
  }
  
  // Get dashboard by ID
  static async getDashboardById(dashboardId, adminId) {
    try {
      const query = `
        SELECT * FROM admin_dashboards 
        WHERE id = $1 AND admin_id = $2`;
      
      const result = await this.executeQuery(query, [dashboardId, adminId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const dashboard = result.rows[0];
      return {
        ...dashboard,
        layout: this.parseJsonField(dashboard.layout, [])
      };
    } catch (error) {
      this.handleError(error, 'getDashboardById', { dashboardId, adminId });
    }
  }
  
  // Update dashboard
  static async updateDashboard(dashboardId, adminId, updates) {
    try {
      const fields = [];
      const values = [];
      let paramIndex = 1;
      
      if (updates.name !== undefined) {
        fields.push(`name = $${paramIndex}`);
        values.push(updates.name);
        paramIndex++;
      }
      
      if (updates.layout !== undefined) {
        fields.push(`layout = $${paramIndex}`);
        values.push(this.stringifyJson(updates.layout));
        paramIndex++;
      }
      
      if (updates.is_default !== undefined) {
        fields.push(`is_default = $${paramIndex}`);
        values.push(updates.is_default);
        paramIndex++;
        
        // If setting this as default, unset others
        if (updates.is_default) {
          const unsetQuery = `
            UPDATE admin_dashboards 
            SET is_default = false 
            WHERE admin_id = $1 AND id != $2`;
          await this.executeQuery(unsetQuery, [adminId, dashboardId]);
        }
      }
      
      fields.push(`updated_at = NOW()`);
      
      if (fields.length === 1) {
        // Only updating timestamp
        values.push(dashboardId, adminId);
      } else {
        values.push(dashboardId, adminId);
      }
      
      const query = `
        UPDATE admin_dashboards 
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex} AND admin_id = $${paramIndex + 1}
        RETURNING *`;
      
      const result = await this.executeQuery(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Dashboard not found or unauthorized');
      }
      
      const dashboard = result.rows[0];
      return {
        ...dashboard,
        layout: this.parseJsonField(dashboard.layout, [])
      };
    } catch (error) {
      this.handleError(error, 'updateDashboard', { dashboardId, adminId, updates });
    }
  }
  
  // Delete dashboard
  static async deleteDashboard(dashboardId, adminId) {
    try {
      const query = `
        DELETE FROM admin_dashboards 
        WHERE id = $1 AND admin_id = $2 AND is_default = false
        RETURNING *`;
      
      const result = await this.executeQuery(query, [dashboardId, adminId]);
      
      if (result.rows.length === 0) {
        throw new Error('Dashboard not found, unauthorized, or is default dashboard');
      }
      
      return result.rows[0];
    } catch (error) {
      this.handleError(error, 'deleteDashboard', { dashboardId, adminId });
    }
  }
  
  // Get default dashboard for admin
  static async getDefaultDashboard(adminId) {
    try {
      const query = `
        SELECT * FROM admin_dashboards 
        WHERE admin_id = $1 AND is_default = true`;
      
      const result = await this.executeQuery(query, [adminId]);
      
      if (result.rows.length === 0) {
        // Create a default dashboard if none exists
        return await this.createDefaultDashboard(adminId);
      }
      
      const dashboard = result.rows[0];
      return {
        ...dashboard,
        layout: this.parseJsonField(dashboard.layout, [])
      };
    } catch (error) {
      this.handleError(error, 'getDefaultDashboard', { adminId });
    }
  }
  
  // Create default dashboard
  static async createDefaultDashboard(adminId) {
    try {
      const defaultLayout = [
        { id: 'stats-overview', type: 'stats', x: 0, y: 0, w: 12, h: 6 },
        { id: 'recent-activity', type: 'activity', x: 0, y: 6, w: 8, h: 6 },
        { id: 'system-health', type: 'health', x: 8, y: 6, w: 4, h: 6 }
      ];
      
      const query = `
        INSERT INTO admin_dashboards 
        (admin_id, name, layout, is_default, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING *`;
      
      const result = await this.executeQuery(query, [adminId, 'Default Dashboard', this.stringifyJson(defaultLayout), true]);
      
      const dashboard = result.rows[0];
      return {
        ...dashboard,
        layout: this.parseJsonField(dashboard.layout, [])
      };
    } catch (error) {
      this.handleError(error, 'createDefaultDashboard', { adminId });
    }
  }
  
  // Get available dashboard widgets
  static getAvailableWidgets() {
    return [
      { id: 'stats-overview', name: 'Statistics Overview', type: 'stats', description: 'Overview of key metrics' },
      { id: 'recent-activity', name: 'Recent Activity', type: 'activity', description: 'Recent user activity' },
      { id: 'system-health', name: 'System Health', type: 'health', description: 'System performance metrics' },
      { id: 'user-growth', name: 'User Growth', type: 'chart', description: 'User registration trends' },
      { id: 'content-metrics', name: 'Content Metrics', type: 'stats', description: 'Content upload statistics' },
      { id: 'security-events', name: 'Security Events', type: 'security', description: 'Recent security events' }
    ];
  }
}

module.exports = DashboardService;