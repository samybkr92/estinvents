import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingPage } from './Loader';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingPage />;
  return user ? children : <Navigate to="/login" replace />;
}

export function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingPage />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
