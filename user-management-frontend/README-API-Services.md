# API Services Documentation

This document describes the API service layer for the User Management Frontend application.

## Overview

The API service layer provides a centralized way to interact with the backend API. It includes proper error handling, request/response interceptors, and service methods for different functionalities.

## File Structure

```
src/services/
├── api.js              # Axios configuration and interceptors
├── authService.js      # Authentication related methods
├── userService.js      # User profile and data methods
├── adminService.js     # Admin functionality methods
├── index.js            # Service exports
└── examples.js         # Usage examples
```

## Core Configuration (api.js)

### Features
- **Axios Instance**: Pre-configured with base URL and timeout
- **Request Interceptor**: Automatically adds JWT token to requests
- **Response Interceptor**: Handles 401 errors, network issues, and error formatting
- **Helper Functions**: `handleApiResponse()` and `handleApiError()`

### Error Handling
- **Network Errors**: Connection issues, timeouts
- **HTTP Status Codes**: 401, 403, 404, 422, 500
- **Automatic Token Cleanup**: Removes invalid tokens and redirects to login

## Authentication Service (authService.js)

### Methods
- `login(email, password)` - User login
- `register(userData)` - User registration
- `forgotPassword(email)` - Request password reset
- `resetPassword(token, newPassword)` - Reset password with token
- `getCurrentUser()` - Get current user info
- `logout()` - User logout
- `isAuthenticated()` - Check if user is logged in
- `getStoredUser()` - Get user data from localStorage
- `refreshToken()` - Refresh JWT token
- `changePassword(currentPassword, newPassword)` - Change password
- `verifyEmail(token)` - Verify email address
- `resendVerification(email)` - Resend verification email

## User Service (userService.js)

### Methods
- `getProfile()` - Get current user profile
- `updateProfile(userData)` - Update user profile
- `getAllUsers(page, size, searchTerm, sortBy, sortOrder)` - Get users with pagination
- `getUserById(id)` - Get user by ID
- `uploadProfilePicture(file)` - Upload profile picture
- `deleteProfilePicture()` - Delete profile picture
- `getUserActivity(page, size)` - Get user activity logs
- `updatePreferences(preferences)` - Update user preferences
- `getPreferences()` - Get user preferences

## Admin Service (adminService.js)

### Methods
- `getAllUsers(page, size, searchTerm, sortBy, sortOrder)` - Get all users (admin view)
- `createUser(userData)` - Create new user
- `updateUserRole(id, role)` - Update user role
- `deleteUser(id)` - Delete user
- `getUserById(id)` - Get user details (admin view)
- `updateUser(id, userData)` - Update any user
- `toggleUserStatus(id, isActive)` - Block/unblock user
- `resetUserPassword(id)` - Reset user password
- `getSystemStats()` - Get system statistics
- `getDashboardData()` - Get admin dashboard data
- `bulkUserAction(userIds, action)` - Bulk operations
- `exportUsers(format, filters)` - Export users data
- `importUsers(file)` - Import users from file
- `sendNotification(userIds, notification)` - Send notifications
- `getUserActivityById(userId, page, size)` - Get user activity
- `terminateUserSessions(userId)` - Terminate user sessions
- `getUserSessions(userId)` - Get user sessions

## Usage Examples

### Basic Authentication
```javascript
import { authService } from './services';

// Login
const loginUser = async (email, password) => {
  const result = await authService.login(email, password);
  if (result.success) {
    console.log('Login successful:', result.data);
  } else {
    console.error('Login failed:', result.message);
  }
};

// Register
const registerUser = async (userData) => {
  const result = await authService.register(userData);
  if (result.success) {
    console.log('Registration successful');
  } else {
    console.error('Registration failed:', result.errors);
  }
};
```

### User Profile Management
```javascript
import { userService } from './services';

// Get profile
const getProfile = async () => {
  const result = await userService.getProfile();
  if (result.success) {
    return result.data;
  }
};

// Update profile
const updateProfile = async (profileData) => {
  const result = await userService.updateProfile(profileData);
  if (result.success) {
    console.log('Profile updated successfully');
  }
};
```

### Admin Operations
```javascript
import { adminService } from './services';

// Get all users with pagination
const getUsers = async (page = 1, searchTerm = '') => {
  const result = await adminService.getAllUsers(page, 20, searchTerm);
  if (result.success) {
    return {
      users: result.data.users,
      totalPages: result.data.totalPages
    };
  }
};

// Create new user
const createUser = async (userData) => {
  const result = await adminService.createUser(userData);
  if (result.success) {
    console.log('User created successfully');
  }
};
```

## Error Handling Patterns

### Standard Pattern
```javascript
const result = await someService.someMethod();

if (result.success) {
  // Handle success
  console.log('Success:', result.data);
} else {
  // Handle error
  console.error('Error:', result.message);
  
  // Check specific error codes
  if (result.status === 422) {
    console.log('Validation errors:', result.errors);
  }
}
```

### Try-Catch Pattern
```javascript
try {
  const result = await someService.someMethod();
  
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.message);
  }
} catch (error) {
  console.error('Operation failed:', error.message);
  // Handle error appropriately
}
```

## Response Format

All service methods return a consistent response format:

### Success Response
```javascript
{
  success: true,
  data: { /* API response data */ },
  message: "Operation completed successfully"
}
```

### Error Response
```javascript
{
  success: false,
  message: "Error description",
  errors: { /* Validation errors if any */ },
  status: 400 // HTTP status code
}
```

## Environment Configuration

Make sure your `.env` file contains:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Token Management

- Tokens are automatically stored in `localStorage`
- Expired tokens trigger automatic logout and redirect to login page
- User data is cached in `localStorage` and updated on successful API calls

## Best Practices

1. Always check the `success` property before accessing data
2. Handle different error types appropriately
3. Use the provided helper functions for consistent error handling
4. Cache user data in localStorage but refresh from server when needed
5. Use pagination for large data sets
6. Implement loading states in your components
7. Show meaningful error messages to users
