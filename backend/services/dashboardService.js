const { AdminDashboard } = require('../models');

class DashboardService {
  static async createCustomDashboard(adminId, name, layout = []) {
    try {
      const dashboard = new AdminDashboard({
        adminId,
        name,
        layout,
        isDefault: false
      });
      await dashboard.save();
      return dashboard.toJSON();
    } catch (error) {
      console.error('createCustomDashboard', error);
      throw error;
    }
  }
  static async getDashboardsForAdmin(adminId) {
    try {
      const dashboards = await AdminDashboard.find({ adminId })
        .sort({ isDefault: -1, createdAt: 1 })
        .lean();
      return dashboards;
    } catch (error) {
      console.error('getDashboardsForAdmin', error);
      throw error;
    }
  }
  static async getDashboardById(dashboardId, adminId) {
    try {
      const dashboard = await AdminDashboard.findOne({
        _id: dashboardId,
        adminId
      }).lean();
      return dashboard || null;
    } catch (error) {
      console.error('getDashboardById', error);
      throw error;
    }
  }
  static async updateDashboard(dashboardId, adminId, updates) {
    try {
      const updateData = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.layout !== undefined) updateData.layout = updates.layout;
      if (updates.is_default !== undefined) {
        updateData.isDefault = updates.is_default;
        if (updates.is_default) {
          await AdminDashboard.updateMany(
            { adminId, _id: { $ne: dashboardId } },
            { isDefault: false }
          );
        }
      }
      updateData.updatedAt = new Date();

      const dashboard = await AdminDashboard.findByIdAndUpdate(dashboardId, updateData, { new: true }).lean();
      if (!dashboard) throw new Error('Dashboard not found or unauthorized');
      return dashboard;
    } catch (error) {
      console.error('updateDashboard', error);
      throw error;
    }
  }
  static async deleteDashboard(dashboardId, adminId) {
    try {
      const dashboard = await AdminDashboard.findOneAndDelete({
        _id: dashboardId,
        adminId,
        isDefault: false
      }).lean();
      if (!dashboard) throw new Error('Dashboard not found, unauthorized, or is default dashboard');
      return dashboard;
    } catch (error) {
      console.error('deleteDashboard', error);
      throw error;
    }
  }
  static async getDefaultDashboard(adminId) {
    try {
      let dashboard = await AdminDashboard.findOne({
        adminId,
        isDefault: true
      }).lean();
      
      if (!dashboard) {
        dashboard = await this.createDefaultDashboard(adminId);
      }
      return dashboard;
    } catch (error) {
      console.error('getDefaultDashboard', error);
      throw error;
    }
  }
  static async createDefaultDashboard(adminId) {
    try {
      const defaultLayout = [
        { id: 'stats-overview', type: 'stats', x: 0, y: 0, w: 12, h: 6 },
        { id: 'recent-activity', type: 'activity', x: 0, y: 6, w: 8, h: 6 },
        { id: 'system-health', type: 'health', x: 8, y: 6, w: 4, h: 6 }
      ];
      
      const dashboard = new AdminDashboard({
        adminId,
        name: 'Default Dashboard',
        layout: defaultLayout,
        isDefault: true
      });
      await dashboard.save();
      return dashboard.toJSON();
    } catch (error) {
      console.error('createDefaultDashboard', error);
      throw error;
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