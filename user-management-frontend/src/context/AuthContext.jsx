import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.REFRESH_TOKEN:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user || state.user,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication from localStorage
  const initializeAuth = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const storedToken = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      if (storedToken && storedUser) {
        try {
          // Verify token by fetching current user
          const result = await authService.getCurrentUser();
          
          if (result.success && result.data) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                user: result.data,
                token: storedToken,
              },
            });
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
          }
        } catch (apiError) {
          // API call failed, clear storage and logout
          console.warn('Auth API verification failed:', apiError);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        // No stored credentials, set loading to false
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear any potentially corrupted data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Login method
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const result = await authService.login(email, password);

      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: result.data.user,
            token: result.data.token,
          },
        });
        return { success: true, data: result.data };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Register method
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const result = await authService.register(userData);

      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: result.data.user,
            token: result.data.token,
          },
        });
        return { success: true, data: result.data };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.message });
        return { success: false, message: result.message, errors: result.errors };
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Logout method
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update user profile
  const updateUser = (userData) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: userData });
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const result = await authService.refreshToken();
      
      if (result.success) {
        dispatch({
          type: AUTH_ACTIONS.REFRESH_TOKEN,
          payload: {
            token: result.data.token,
            user: result.data.user,
          },
        });
        return { success: true };
      } else {
        // If refresh fails, logout user
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        return { success: false };
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: false };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const result = await authService.forgotPassword(email);

      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: true, message: result.message };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to send password reset email.';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const result = await authService.resetPassword(token, newPassword);

      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: true, message: result.message };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to reset password.';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const result = await authService.changePassword(currentPassword, newPassword);

      if (result.success) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: true, message: result.message };
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: result.message });
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to change password.';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Role checking methods
  const isAdmin = () => {
    return state.user?.role === 'admin';
  };

  const isUser = () => {
    return state.user?.role === 'user';
  };

  const isModerator = () => {
    return state.user?.role === 'moderator';
  };

  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role);
  };

  // Permission checking
  const hasPermission = (permission) => {
    if (!state.user || !state.user.permissions) return false;
    return state.user.permissions.includes(permission);
  };

  // Check if user account is active
  const isAccountActive = () => {
    return state.user?.isActive !== false;
  };

  // Check if email is verified
  const isEmailVerified = () => {
    return state.user?.isEmailVerified === true;
  };

  // Helper to get user display name
  const getUserDisplayName = () => {
    if (!state.user) return 'Guest';
    return state.user.firstName 
      ? `${state.user.firstName} ${state.user.lastName || ''}`.trim()
      : state.user.email;
  };
  
  // Helper to get user initials
  const getUserInitials = () => {
    if (!state.user) return 'G';
    if (state.user.firstName && state.user.lastName) {
      return `${state.user.firstName[0]}${state.user.lastName[0]}`.toUpperCase();
    }
    if (state.user.firstName) {
      return state.user.firstName[0].toUpperCase();
    }
    if (state.user.email) {
      return state.user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Methods
    login,
    register,
    logout,
    updateUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    changePassword,
    clearError,

    // Role checking
    isAdmin,
    isUser,
    isModerator,
    hasRole,
    hasAnyRole,
    hasPermission,
    isAccountActive,
    isEmailVerified,
    
    // Helper functions
    getUserDisplayName,
    getUserInitials,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
