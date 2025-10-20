import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import AdminLayout from '@/pages/AdminLayout';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminUsersPage from '@/pages/AdminUsersPage';
import AdminLibraryPage from '@/pages/AdminLibraryPage';
import AdminSystemPage from '@/pages/AdminSystemPage';
import AdminCommunityPage from '@/pages/AdminCommunityPage';
import AdminContentPage from '@/pages/AdminContentPage';
import AdminLogsPage from '@/pages/AdminLogsPage';
import AdminSettingsReportsPage from '@/pages/AdminSettingsReportsPage';
import AdminAssetsPage from '@/pages/AdminAssetsPage';
import AdminTemplatesPage from '@/pages/AdminTemplatesPage';
import AdminThemesPage from '@/pages/AdminThemesPage';
import AdminBIDashboardPage from '@/pages/AdminBIDashboardPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import CosmicAdminPage from '@/pages/CosmicAdminPage';

// Protected admin routes
export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <CosmicAdminPage /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'library', element: <AdminLibraryPage /> },
      { path: 'system', element: <AdminSystemPage /> },
      { path: 'community', element: <AdminCommunityPage /> },
      { path: 'content', element: <AdminContentPage /> },
      { path: 'logs', element: <AdminLogsPage /> },
      { path: 'settings', element: <AdminSettingsReportsPage /> },
      { path: 'assets', element: <AdminAssetsPage /> },
      { path: 'templates', element: <AdminTemplatesPage /> },
      { path: 'themes', element: <AdminThemesPage /> },
      { path: 'bi-dashboard', element: <AdminBIDashboardPage /> },
      { path: '*', element: <Navigate to="/admin" replace /> }
    ]
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />
  }
];