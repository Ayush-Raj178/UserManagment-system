/* 
 * This file contains examples of how to use the API services
 * These are not meant to be run, but to show usage patterns
 */

import { authService, userService, adminService } from './index';

// Example: Login user
export const loginExample = async () => {
  const result = await authService.login('user@example.com', 'password123');
  
  if (result.success) {
    console.log('Login successful:', result.data);
    // User is now logged in, token stored automatically
  } else {
    console.error('Login failed:', result.message);
    // Handle login errors (show to user, etc.)
  }
};

// Example: Register new user
export const registerExample = async () => {
  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'securePassword123',
    confirmPassword: 'securePassword123'
  };
  
  const result = await authService.register(userData);
  
  if (result.success) {
    console.log('Registration successful:', result.data);
  } else {
    console.error('Registration failed:', result.message, result.errors);
  }
};

// Example: Get user profile
export const getProfileExample = async () => {
  const result = await userService.getProfile();
  
  if (result.success) {
    console.log('User profile:', result.data);
  } else {
    console.error('Failed to get profile:', result.message);
  }
};

// Example: Admin - Get all users with pagination
export const getAdminUsersExample = async () => {
  const result = await adminService.getAllUsers(1, 20, 'john', 'email', 'asc');
  
  if (result.success) {
    console.log('Users:', result.data.users);
    console.log('Total pages:', result.data.totalPages);
    console.log('Total users:', result.data.totalUsers);
  } else {
    console.error('Failed to get users:', result.message);
  }
};

// Example: Handle forgot password
export const forgotPasswordExample = async () => {
  const result = await authService.forgotPassword('user@example.com');
  
  if (result.success) {
    console.log('Password reset email sent');
    // Show success message to user
  } else {
    console.error('Failed to send reset email:', result.message);
  }
};

// Example: Upload profile picture
export const uploadProfilePictureExample = async (fileInput) => {
  const file = fileInput.files[0];
  
  if (!file) {
    console.error('No file selected');
    return;
  }
  
  const result = await userService.uploadProfilePicture(file);
  
  if (result.success) {
    console.log('Profile picture uploaded:', result.data);
    // Update UI with new profile picture
  } else {
    console.error('Failed to upload profile picture:', result.message);
  }
};

// Example: Error handling pattern
export const errorHandlingExample = async () => {
  try {
    const result = await userService.getProfile();
    
    if (result.success) {
      // Handle success
      return result.data;
    } else {
      // Handle API errors
      switch (result.status) {
        case 401:
          console.log('User not authenticated, redirecting to login...');
          break;
        case 403:
          console.log('Access forbidden');
          break;
        case 404:
          console.log('Profile not found');
          break;
        case 422:
          console.log('Validation errors:', result.errors);
          break;
        default:
          console.log('Unexpected error:', result.message);
      }
    }
  } catch (error) {
    // Handle network errors, timeout, etc.
    console.error('Network or unexpected error:', error);
  }
};
