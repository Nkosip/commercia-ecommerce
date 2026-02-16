/**
 * Authentication and Authorization Utilities
 */

import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from './authConstants';

// Export constants for convenience
export { ROLES, PERMISSIONS };

/**
 * Check if user has a specific role
 * @param {Object} user - User object with roles array
 * @param {string} role - Role to check (e.g., 'ROLE_ADMIN', 'ROLE_USER')
 * @returns {boolean}
 */
export const hasRole = (user, role) => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
};

/**
 * Check if user has admin privileges
 * @param {Object} user - User object with roles array
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return hasRole(user, 'ROLE_ADMIN');
};

/**
 * Check if user has a specific permission
 * Note: Since backend uses role-based access (roles array), 
 * this function checks if user has any role that grants the permission
 * @param {Object} user - User object with roles array
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) return false;
  
  // Check permissions for each role the user has
  return user.roles.some(role => {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  });
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (user, permissions) => {
  if (!Array.isArray(permissions)) return false;
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (user, permissions) => {
  if (!Array.isArray(permissions)) return false;
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Format user display name
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Guest';
  
  // Try firstName + lastName
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  
  // Fallback to firstName only
  if (user.firstName) {
    return user.firstName;
  }
  
  // Fallback to email or 'User'
  return user.email || 'User';
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user) => {
  if (!user) return '?';
  
  // Try firstName + lastName
  if (user.firstName && user.lastName) {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }
  
  // Try firstName only
  if (user.firstName) {
    return user.firstName.charAt(0).toUpperCase();
  }
  
  // Fallback to email first letter
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  
  return '?';
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumber) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: errors.length === 0 ? 'strong' : errors.length <= 2 ? 'medium' : 'weak',
  };
};

/**
 * Generate random password
 */
export const generatePassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const all = uppercase + lowercase + numbers + special;
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};