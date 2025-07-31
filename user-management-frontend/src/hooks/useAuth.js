import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Enhanced useAuth hook with additional helper methods
export const useAuthHelpers = () => {
  const auth = useAuth();
  
  // Helper to check if user can perform admin actions
  const canPerformAdminActions = () => {
    return auth.isAuthenticated && auth.isAdmin() && auth.isAccountActive();
  };
  
  // Helper to check if user can access user management
  const canAccessUserManagement = () => {
    return auth.isAuthenticated && (auth.isAdmin() || auth.isModerator()) && auth.isAccountActive();
  };
  
  // Helper to check if user needs to verify email
  const needsEmailVerification = () => {
    return auth.isAuthenticated && !auth.isEmailVerified();
  };
  
  // Helper to get user display name
  const getUserDisplayName = () => {
    if (!auth.user) return 'Guest';
    return auth.user.firstName 
      ? `${auth.user.firstName} ${auth.user.lastName || ''}`.trim()
      : auth.user.email;
  };
  
  // Helper to get user initials
  const getUserInitials = () => {
    if (!auth.user) return 'G';
    if (auth.user.firstName && auth.user.lastName) {
      return `${auth.user.firstName[0]}${auth.user.lastName[0]}`.toUpperCase();
    }
    if (auth.user.firstName) {
      return auth.user.firstName[0].toUpperCase();
    }
    if (auth.user.email) {
      return auth.user.email[0].toUpperCase();
    }
    return 'U';
  };
  
  // Helper to check if user has multiple roles
  const hasMultipleRoles = () => {
    return auth.user?.roles && Array.isArray(auth.user.roles) && auth.user.roles.length > 1;
  };
  
  // Helper to get all user roles
  const getAllRoles = () => {
    if (auth.user?.roles && Array.isArray(auth.user.roles)) {
      return auth.user.roles;
    }
    return auth.user?.role ? [auth.user.role] : [];
  };
  
  // Helper to check if account is suspended
  const isAccountSuspended = () => {
    return auth.user?.status === 'suspended' || auth.user?.isSuspended === true;
  };
  
  // Helper to check if account is pending approval
  const isAccountPending = () => {
    return auth.user?.status === 'pending' || auth.user?.isPending === true;
  };
  
  // Helper to get account status display text
  const getAccountStatusText = () => {
    if (!auth.isAuthenticated) return 'Not logged in';
    if (isAccountSuspended()) return 'Account suspended';
    if (isAccountPending()) return 'Account pending approval';
    if (!auth.isAccountActive()) return 'Account inactive';
    if (!auth.isEmailVerified()) return 'Email not verified';
    return 'Active';
  };
  
  // Helper to check if user can edit profile
  const canEditProfile = () => {
    return auth.isAuthenticated && auth.isAccountActive() && !isAccountSuspended();
  };
  
  // Helper to check session validity
  const isSessionValid = () => {
    return auth.isAuthenticated && auth.token && auth.user;
  };
  
  // Helper for login with additional validation
  const loginWithValidation = async (email, password) => {
    // Clear any existing errors
    auth.clearError();
    
    // Basic validation
    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required'
      };
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address'
      };
    }
    
    return await auth.login(email, password);
  };
  
  // Helper for registration with validation
  const registerWithValidation = async (userData) => {
    auth.clearError();
    
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    } = userData;
    
    // Required field validation
    if (!firstName || !lastName || !email || !password) {
      return {
        success: false,
        message: 'All fields are required'
      };
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address'
      };
    }
    
    // Password validation
    if (password.length < 8) {
      return {
        success: false,
        message: 'Password must be at least 8 characters long'
      };
    }
    
    if (password !== confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match'
      };
    }
    
    return await auth.register(userData);
  };
  
  // Helper to handle logout with confirmation
  const logoutWithConfirmation = async (showConfirmation = true) => {
    if (showConfirmation) {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (!confirmed) return false;
    }
    
    try {
      await auth.logout();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };
  
  return {
    ...auth,
    
    // Additional helper methods
    canPerformAdminActions,
    canAccessUserManagement,
    needsEmailVerification,
    getUserDisplayName,
    getUserInitials,
    hasMultipleRoles,
    getAllRoles,
    isAccountSuspended,
    isAccountPending,
    getAccountStatusText,
    canEditProfile,
    isSessionValid,
    loginWithValidation,
    registerWithValidation,
    logoutWithConfirmation,
  };
};

export default useAuth;
