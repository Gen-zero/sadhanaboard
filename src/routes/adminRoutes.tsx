import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';


// Protected admin routes
export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    // element: <AdminLayout />,
    element: <div>Admin Layout</div>,
    children: [
      // { index: true, element: <CosmicAdminPage /> },
      { index: true, element: <div>Cosmic Admin</div> },
      // { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'dashboard', element: <div>Admin Dashboard</div> },
      // { path: 'users', element: <AdminUsersPage /> },
      { path: 'users', element: <div>Admin Users</div> },
      // { path: 'library', element: <AdminLibraryPage /> },
      { path: 'library', element: <div>Admin Library</div> },
      // { path: 'system', element: <AdminSystemPage /> },
      { path: 'system', element: <div>Admin System</div> },
      // { path: 'community', element: <AdminCommunityPage /> },
      { path: 'community', element: <div>Admin Community</div> },
      // { path: 'content', element: <AdminContentPage /> },
      { path: 'content', element: <div>Admin Content</div> },
      // { path: 'logs', element: <AdminLogsPage /> },
      { path: 'logs', element: <div>Admin Logs</div> },
      // { path: 'settings', element: <AdminSettingsReportsPage /> },
      { path: 'settings', element: <div>Admin Settings</div> },
      // { path: 'assets', element: <AdminAssetsPage /> },
      { path: 'assets', element: <div>Admin Assets</div> },
      // { path: 'templates', element: <AdminTemplatesPage /> },
      { path: 'templates', element: <div>Admin Templates</div> },
      // { path: 'themes', element: <AdminThemesPage /> },
      { path: 'themes', element: <div>Admin Themes</div> },
      // { path: 'bi-dashboard', element: <AdminBIDashboardPage /> },
      { path: 'bi-dashboard', element: <div>Admin BI Dashboard</div> },
      { path: '*', element: <Navigate to="/admin" replace /> }
    ]
  },
  {
    path: '/admin/login',
    // element: <AdminLoginPage />
    element: <div>Admin Login</div>
  }
];