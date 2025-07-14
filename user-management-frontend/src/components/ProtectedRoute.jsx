import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isAdmin, isUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You can replace this with a loading spinner component
    return <div>Loading...</div>;
  }

  if (!isAuthenticated()) {
    // Redirect to login page and save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const hasRequiredRole = 
      (requiredRole === 'admin' && isAdmin()) || 
      (requiredRole === 'user' && isUser());

    if (!hasRequiredRole) {
      // Redirect to home page if user doesn't have required role
      return <Navigate to="/" replace />;
    }
  }

  return children;
}; 