// Export AuthContext and AuthProvider
export { default as AuthContext, AuthProvider, useAuth as useAuthContext } from './AuthContext';

// Re-export hooks
export { useAuth, useAuthHelpers } from '../hooks/useAuth';

// Re-export ProtectedRoute components
export {
  default as ProtectedRoute,
  AdminRoute,
  ModeratorRoute,
  UserRoute,
  VerifiedRoute,
  PublicRoute
} from '../components/ProtectedRoute';
