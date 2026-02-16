/**
 * Authentication and Authorization Constants
 * 
 * Note: Backend uses role names like 'ROLE_ADMIN' and 'ROLE_USER'
 * These constants are kept for backwards compatibility and convenience
 */

// Role constants - matching backend format
export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  USER: 'ROLE_USER',
  GUEST: 'guest', // Not used by backend, kept for frontend logic
};

// Permission constants
export const PERMISSIONS = {
  VIEW_PRODUCTS: 'view_products',
  CREATE_PRODUCT: 'create_product',
  EDIT_PRODUCT: 'edit_product',
  DELETE_PRODUCT: 'delete_product',
  VIEW_ORDERS: 'view_orders',
  MANAGE_ORDERS: 'manage_orders',
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users',
};

// Role-Permission mapping
export const ROLE_PERMISSIONS = {
  'ROLE_ADMIN': [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.EDIT_PRODUCT,
    PERMISSIONS.DELETE_PRODUCT,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.MANAGE_USERS,
  ],
  'ROLE_USER': [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.VIEW_ORDERS,
  ],
  [ROLES.GUEST]: [
    PERMISSIONS.VIEW_PRODUCTS,
  ],
};