import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export const ProtectedRoute = () => {
  const { user, token } = useAuthStore();
  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuthStore();
  
  if (!user?.role) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children || <Outlet />;
};

export const PublicRoute = () => {
  const { token } = useAuthStore();
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};