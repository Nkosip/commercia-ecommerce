import React, { createContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './UseAuth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const { isAuthenticated, user } = useAuth();

  /**
   * Load cart from backend when user is authenticated
   */
  useEffect(() => {
    const loadCart = async () => {
      // Only load cart if user is authenticated
      if (!isAuthenticated()) {
        setCart(null);
        setCartItems([]);
        setLoading(false);
        setInitialized(false); // Reset initialized when logged out
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading user cart...');
        const cartData = await cartApi.getCurrentCart();
        
        if (cartData) {
          console.log('✅ Cart loaded:', cartData);
          setCart(cartData);
          setCartItems(cartData.items || []);
        } else {
          // Cart doesn't exist yet - this is normal for new users
          console.log('ℹ️ No cart found - will be created when user adds first item');
          setCart(null);
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        
        // Don't set error for 404 (cart doesn't exist yet - this is expected)
        if (error.response?.status !== 404) {
          setError(error.message);
        } else {
          // 404 is fine - user just doesn't have a cart yet
          setCart(null);
          setCartItems([]);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    loadCart();
  }, [isAuthenticated, user?.id]); // Only re-run when auth state or user ID changes

  /**
   * Refresh cart data from backend
   */
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated()) {
      return;
    }

    try {
      setLoading(true);
      const cartData = await cartApi.getCurrentCart();
      
      if (cartData) {
        setCart(cartData);
        setCartItems(cartData.items || []);
      } else {
        setCart(null);
        setCartItems([]);
      }
      setError(null);
    } catch (error) {
      console.error('Error refreshing cart:', error);
      if (error.response?.status !== 404) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Add product to cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add (default: 1)
   * @returns {Promise<{success: boolean, error?: string, needsAuth?: boolean}>}
   */
  const addToCart = async (productId, quantity = 1) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      return { 
        success: false, 
        error: 'Please log in to add items to cart',
        needsAuth: true 
      };
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`Adding product ${productId} to cart...`);
      const updatedCart = await cartApi.addToCart(productId, quantity);
      
      setCart(updatedCart);
      setCartItems(updatedCart.items || []);
      
      console.log('✅ Cart updated successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add item to cart';
      setError(errorMessage);
      console.error('❌ Error adding to cart:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove product from cart
   * @param {number} productId - Product ID to remove
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const removeFromCart = async (productId) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please log in first' };
    }

    try {
      setLoading(true);
      setError(null);

      const updatedCart = await cartApi.removeFromCart(productId);
      
      setCart(updatedCart);
      setCartItems(updatedCart.items || []);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove item from cart';
      setError(errorMessage);
      console.error('Error removing from cart:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update product quantity in cart
   * @param {number} productId - Product ID
   * @param {number} quantity - New quantity
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please log in first' };
    }

    if (quantity <= 0) {
      return await removeFromCart(productId);
    }

    try {
      setLoading(true);
      setError(null);

      const updatedCart = await cartApi.updateCartItem(productId, quantity);
      
      setCart(updatedCart);
      setCartItems(updatedCart.items || []);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update quantity';
      setError(errorMessage);
      console.error('Error updating quantity:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear all items from cart (keeps the cart entity)
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const clearCart = async () => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please log in first' };
    }

    try {
      setLoading(true);
      setError(null);

      const cartId = cartApi.getCartId();
      
      console.log('🗑️ Clearing cart ID:', cartId);
      
      if (cartId) {
        // Call backend to clear cart items only
        await cartApi.clearCart(cartId);
        console.log('✅ Backend cart items cleared');
      }
      
      // Clear local state
      setCartItems([]);
      
      // Update cart to reflect empty state
      if (cart) {
        setCart({ ...cart, items: [], totalAmount: 0 });
      }
      
      console.log('✅ Cart cleared successfully (cart entity preserved)');
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to clear cart';
      setError(errorMessage);
      console.error('❌ Error clearing cart:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete the entire cart (used after checkout)
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const deleteCart = async () => {
    if (!isAuthenticated()) {
      return { success: false, error: 'Please log in first' };
    }

    try {
      setLoading(true);
      setError(null);

      const cartId = cartApi.getCartId();
      
      console.log('🗑️ Deleting cart ID:', cartId);
      
      if (cartId) {
        // Call backend to delete entire cart
        await cartApi.deleteCart(cartId);
        console.log('✅ Backend cart deleted');
      }
      
      // Clear all local state
      setCart(null);
      setCartItems([]);
      
      // Clear localStorage
      localStorage.removeItem('cartId');
      console.log('✅ LocalStorage cleared');
      
      console.log('✅ Cart deleted successfully');
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete cart';
      setError(errorMessage);
      console.error('❌ Error deleting cart:', error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get total number of items in cart
   * @returns {number}
   */
  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  /**
   * Get total price of all items in cart
   * @returns {number}
   */
  const getCartTotal = () => {
    return cart?.total || cart?.totalAmount || cartItems.reduce((sum, item) => {
      const price = item.price || item.product?.price || 0;
      const quantity = item.quantity || 0;
      return sum + (price * quantity);
    }, 0);
  };

  /**
   * Check if a product is in the cart
   * @param {number} productId - Product ID
   * @returns {boolean}
   */
  const isInCart = (productId) => {
    return cartItems.some(item => 
      item.productId === productId || item.product?.id === productId
    );
  };

  /**
   * Get quantity of a specific product in cart
   * @param {number} productId - Product ID
   * @returns {number}
   */
  const getProductQuantity = (productId) => {
    const item = cartItems.find(item => 
      item.productId === productId || item.product?.id === productId
    );
    return item?.quantity || 0;
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  const value = {
    cart,
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    deleteCart,
    refreshCart,
    getCartCount,
    getCartTotal,
    isInCart,
    getProductQuantity,
    clearError,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Export only for the useCart hook to use
export { CartContext };