import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authApi.getToken();
        const savedUser = authApi.getCurrentUser();
        
        if (token && savedUser) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user with email and password
   * @param {string} email - User's email address
   * @param {string} password - Password
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login({ email, password });
      
      // authApi.login already stores token and user in localStorage
      setUser(response.user);
      
      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - Email
   * @param {string} userData.password - Password
   * @param {string} userData.firstName - First name
   * @param {string} userData.lastName - Last name
   * @returns {Promise<{success: boolean, user?: object, error?: string}>}
   */
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await authApi.register(userData);
      
      // After registration, automatically log the user in using email
      const loginResult = await login(userData.email, userData.password);
      
      if (loginResult.success) {
        return { success: true, user: loginResult.user };
      }
      
      // If auto-login fails, still return success but user needs to login manually
      return { 
        success: true, 
        user, 
        message: 'Registration successful! Please login.' 
      };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout the current user
   */
  const logout = async () => {
    try {
      setLoading(true);
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
      setError(null);
      setLoading(false);
      // authApi.logout already clears localStorage
    }
  };

  /**
   * Update user information
   * @param {Object} updates - User updates
   */
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  /**
   * Check if current user is admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ADMIN') || user?.roles?.includes('admin');
  };

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return !!user && !!authApi.getToken();
  };

  /**
   * Clear any error messages
   */
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateUser,
    isAdmin,
    isAuthenticated,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export only for the useAuth hook to use
export { AuthContext };