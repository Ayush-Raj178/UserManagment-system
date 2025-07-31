// Utility to clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  console.log('Authentication data cleared from localStorage');
};

// Debug function to check current auth state
export const debugAuthState = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  
  console.log('=== Auth Debug Info ===');
  console.log('Token:', token ? 'Present' : 'Missing');
  console.log('User:', user ? 'Present' : 'Missing');
  
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      console.log('User data:', parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  console.log('=====================');
};

// Force clear all authentication data and reload
export const forceReset = () => {
  localStorage.clear();
  sessionStorage.clear();
  console.log('All browser storage cleared');
  window.location.reload();
};

// Function to be called from browser console for debugging
window.clearAuth = clearAuthData;
window.debugAuth = debugAuthState;
window.forceReset = forceReset;
