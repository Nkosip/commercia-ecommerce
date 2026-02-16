// Cart API methods for frontend
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const cartApi = {
  // Get cart ID from localStorage
  getCartId: () => {
    return localStorage.getItem('cartId');
  },

  // Set cart ID in localStorage
  setCartId: (cartId) => {
    localStorage.setItem('cartId', cartId);
  },

  // Get current user's cart
  getCurrentCart: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/cart/my-cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Store cart ID for future use
    if (response.data && response.data.cartId) {
      cartApi.setCartId(response.data.cartId);
    }
    
    return response.data;
  },

  // Create a new cart
  createCart: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/cart`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Store the new cart ID
    const cartId = response.data;
    cartApi.setCartId(cartId);
    
    return cartId;
  },

  // Add item to cart
  addToCart: async (productId, quantity) => {
    const token = localStorage.getItem('token');
    let cartId = cartApi.getCartId();

    // If no cart exists, create one first
    if (!cartId) {
      console.log('No cart found, creating new cart...');
      cartId = await cartApi.createCart();
    }

    const response = await axios.post(
      `${API_BASE_URL}/cart/${cartId}/items`,
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (productId, quantity) => {
    const token = localStorage.getItem('token');
    const cartId = cartApi.getCartId();

    const response = await axios.put(
      `${API_BASE_URL}/cart/${cartId}/items`,
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    const token = localStorage.getItem('token');
    const cartId = cartApi.getCartId();

    const response = await axios.delete(
      `${API_BASE_URL}/cart/${cartId}/items/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Clear all items from cart (keeps cart entity)
  clearCart: async (cartId) => {
    const token = localStorage.getItem('token');

    await axios.delete(`${API_BASE_URL}/cart/${cartId}/clear`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Delete entire cart (cart entity and all items)
  deleteCart: async (cartId) => {
    const token = localStorage.getItem('token');

    await axios.delete(`${API_BASE_URL}/cart/${cartId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export { cartApi };
export default cartApi;