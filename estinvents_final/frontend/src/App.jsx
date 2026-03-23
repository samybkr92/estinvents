import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider }  from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

import Sidebar  from './components/Sidebar';
import Topbar   from './components/Topbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import AuthPage          from './pages/AuthPage';
import Dashboard         from './pages/Dashboard';
import EventsPage        from './pages/EventsPage';
import NewsPage          from './pages/NewsPage';
import ProfessorsPage    from './pages/ProfessorsPage';
import AdminEvents       from './pages/AdminEvents';
import AdminNews         from './pages/AdminNews';
import AdminProfessors   from './pages/AdminProfessors';

/* Page titles map */
const TITLES = {
  '/':                   'Dashboard',
  '/events':             'Events',
  '/news':               'News',
  '/professors':         'Professors',
  '/admin/events':       'Manage Events',
  '/admin/news':         'Manage News',
  '/admin/professors':   'Manage Professors',
};

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const path = window.location.pathname;
  const title = TITLES[path] || 'ESTINVENTS';

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <Topbar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<AuthPage />} />

              {/* Protected — students + admin */}
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout><Dashboard /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/events" element={
                <ProtectedRoute>
                  <AppLayout><EventsPage /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/news" element={
                <ProtectedRoute>
                  <AppLayout><NewsPage /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/professors" element={
                <ProtectedRoute>
                  <AppLayout><ProfessorsPage /></AppLayout>
                </ProtectedRoute>
              } />

              {/* Admin only */}
              <Route path="/admin/events" element={
                <AdminRoute>
                  <AppLayout><AdminEvents /></AppLayout>
                </AdminRoute>
              } />
              <Route path="/admin/news" element={
                <AdminRoute>
                  <AppLayout><AdminNews /></AppLayout>
                </AdminRoute>
              } />
              <Route path="/admin/professors" element={
                <AdminRoute>
                  <AppLayout><AdminProfessors /></AppLayout>
                </AdminRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
