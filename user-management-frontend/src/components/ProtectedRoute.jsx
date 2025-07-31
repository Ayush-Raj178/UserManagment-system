import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Unauthorized access component
const UnauthorizedAccess = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
      <div className="mb-4">
        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
      <p className="text-gray-600 mb-6">
        You don't have permission to access this page.
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Account inactive component
const AccountInactive = ({ reason = 'inactive' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
      <div className="mb-4">
        <svg className="mx-auto h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Account {reason}</h2>
      <p className="text-gray-600 mb-6">
        {reason === 'suspended' 
          ? 'Your account has been suspended. Please contact support.'
          : reason === 'pending'
          ? 'Your account is pending approval. Please wait for an administrator to approve your account.'
          : 'Your account is inactive. Please contact support to reactivate your account.'
        }
      </p>
      <div className="space-y-2">
        <button
          onClick={() => window.location.href = '/contact'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Contact Support
        </button>
        <button
          onClick={() => window.location.href = '/logout'}
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);

// Email verification required component
const EmailVerificationRequired = () => {
  const { user, logout } = useAuth();

  const handleResendVerification = async () => {
    // This would call the resend verification API
    console.log('Resending verification email...');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-600 mb-4">
          Please verify your email address to continue. We've sent a verification link to:
        </p>
        <p className="text-sm font-medium text-blue-600 mb-6">{user?.email}</p>
        <div className="space-y-2">
          <button
            onClick={handleResendVerification}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Resend Verification Email
          </button>
          <button
            onClick={logout}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// Main ProtectedRoute component
const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [],
  requireEmailVerification = false,
  fallbackPath = '/login'
}) => {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    hasRole, 
    hasAnyRole, 
    hasPermission,
    isAccountActive,
    isEmailVerified
  } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check if account is active
  if (!isAccountActive()) {
    const status = user?.status || 'inactive';
    return <AccountInactive reason={status} />;
  }

  // Check if email verification is required
  if (requireEmailVerification && !isEmailVerified()) {
    return <EmailVerificationRequired />;
  }

  // Check role-based access
  if (requiredRoles.length > 0) {
    // Check if user has any of the required roles
    const hasRequiredRole = requiredRoles.some(role => hasRole(role)) || hasAnyRole(requiredRoles);
    
    if (!hasRequiredRole) {
      return <UnauthorizedAccess />;
    }
  }

  // Check permission-based access
  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.some(permission => hasPermission(permission));
    
    if (!hasRequiredPermission) {
      return <UnauthorizedAccess />;
    }
  }

  // All checks passed, render the protected component
  return <>{children}</>;
};

// Higher-order component for admin-only routes
export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requiredRoles={['admin']} 
    requireEmailVerification={true}
    {...props}
  >
    {children}
  </ProtectedRoute>
);

// Higher-order component for moderator and admin routes
export const ModeratorRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requiredRoles={['admin', 'moderator']} 
    requireEmailVerification={true}
    {...props}
  >
    {children}
  </ProtectedRoute>
);

// Higher-order component for user routes (any authenticated user)
export const UserRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requiredRoles={['admin', 'moderator', 'user']}
    {...props}
  >
    {children}
  </ProtectedRoute>
);

// Higher-order component for routes that require email verification
export const VerifiedRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requireEmailVerification={true}
    {...props}
  >
    {children}
  </ProtectedRoute>
);

// Component for public routes that redirect authenticated users
export const PublicRoute = ({ children, redirectPath = '/dashboard' }) => {
  const { isAuthenticated, isLoading, user, token } = useAuth();
  
  // Don't show anything while loading
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Only redirect if genuinely authenticated with valid session
  if (isAuthenticated && user && token) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // Show public content for unauthenticated users
  return children;
};

export default ProtectedRoute;
