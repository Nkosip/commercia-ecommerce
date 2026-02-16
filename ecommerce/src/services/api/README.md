# API Services Documentation

This directory contains all API service modules for communicating with the backend.

## Structure

```
api/
├── apiClient.js      - Axios instance with interceptors
├── authApi.js        - Authentication endpoints
├── productApi.js     - Product management
├── cartApi.js        - Shopping cart operations
├── orderApi.js       - Order management
├── categoryApi.js    - Category management
├── paymentApi.js     - Payment processing
├── checkoutApi.js    - Checkout process
└── index.js          - Central export file
```

## Setup

1. **Install axios** (if not already installed):
```bash
npm install axios
```

2. **Create .env file**:
Copy `.env.example` to `.env` and configure your API URL:
```env
VITE_API_BASE_URL=http://localhost:8080
```

3. **Backend CORS Configuration**:
Your Spring Boot backend needs CORS configuration. Add this to your backend:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // Vite dev server
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## Usage

### Import Methods

**Option 1: Named imports**
```javascript
import { authApi, productApi, cartApi } from '@/services/api';

const login = async () => {
  const response = await authApi.login({ username, password });
};
```

**Option 2: Default import**
```javascript
import api from '@/services/api';

const login = async () => {
  const response = await api.auth.login({ username, password });
};
```

## API Modules

### authApi
- `register(userData)` - Register new user
- `login(credentials)` - Login user
- `logout()` - Logout user
- `getCurrentUser()` - Get current user from localStorage
- `getToken()` - Get auth token
- `isAuthenticated()` - Check if user is authenticated

### productApi
- `getProducts(filters)` - Get all products with optional filters
- `getProductById(id)` - Get single product
- `createProduct(data)` - Create product (ADMIN)
- `updateProduct(id, data)` - Update product (ADMIN)
- `updateProductStatus(id, enabled)` - Enable/disable product (ADMIN)
- `deleteProduct(id)` - Delete product (ADMIN)
- `searchProducts(searchTerm)` - Search products
- `getProductsByCategory(categoryId)` - Get products by category
- `getProductsByPriceRange(min, max)` - Get products by price

### cartApi
- `createCart()` - Create new cart
- `getCart(cartId)` - Get cart details
- `addItem(cartId, item)` - Add item to cart
- `updateItem(cartId, item)` - Update cart item
- `removeItem(cartId, productId)` - Remove item from cart
- `clearCart(cartId)` - Clear all items
- `addToCart(productId, quantity)` - Helper: Add to cart with auto-init
- `getCurrentCart()` - Helper: Get current cart

### orderApi
- `getOrder(id)` - Get order by ID
- `getMyOrders()` - Get all user orders
- `cancelOrder(id)` - Cancel order
- `getOrderHistory(filters)` - Get filtered order history
- `getOrderStats()` - Get order statistics

### categoryApi
- `getAllCategories()` - Get all categories
- `getCategoryById(id)` - Get category by ID
- `createCategory(data)` - Create category (ADMIN)
- `updateCategory(id, data)` - Update category (ADMIN)
- `deleteCategory(id)` - Delete category (ADMIN)

### paymentApi
- `processPayment(paymentData)` - Process payment
- `payWithCreditCard(orderId, cardDetails)` - Pay with credit card
- `payWithPayPal(orderId, paypalDetails)` - Pay with PayPal
- `payWithDebitCard(orderId, cardDetails)` - Pay with debit card

### checkoutApi
- `checkout(cartId)` - Create order from cart
- `completeCheckout(cartId, additionalInfo)` - Complete checkout process

## Authentication Flow

The API client automatically handles authentication:

1. **Login**: Token is stored in localStorage
2. **Requests**: Token is automatically added to Authorization header
3. **401 Response**: User is logged out and redirected to login
4. **Logout**: Token is removed from localStorage

## Error Handling

All API calls return structured errors:

```javascript
try {
  const products = await productApi.getProducts();
} catch (error) {
  console.error(error.message); // User-friendly message
  console.error(error.status);  // HTTP status code
  console.error(error.data);    // Response data from server
}
```

## Example Usage in Components

### Login Component
```javascript
import { authApi } from '@/services/api';

const handleLogin = async (credentials) => {
  try {
    const response = await authApi.login(credentials);
    console.log('Logged in:', response.user);
    // Navigate to dashboard
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

### Product List Component
```javascript
import { productApi } from '@/services/api';
import { useState, useEffect } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getProducts({ active: true });
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    // Your component JSX
  );
};
```

### Cart Component
```javascript
import { cartApi } from '@/services/api';

const handleAddToCart = async (productId) => {
  try {
    const updatedCart = await cartApi.addToCart(productId, 1);
    console.log('Cart updated:', updatedCart);
  } catch (error) {
    console.error('Failed to add to cart:', error.message);
  }
};
```

## Backend Endpoint Reference

All endpoints and their corresponding Spring Boot paths:

| API Function | HTTP Method | Backend Path |
|-------------|-------------|--------------|
| `authApi.register()` | POST | `/auth/register` |
| `authApi.login()` | POST | `/auth/login` |
| `authApi.logout()` | POST | `/auth/logout` |
| `productApi.getProducts()` | GET | `/api/v1/products` |
| `productApi.getProductById(id)` | GET | `/api/v1/products/{id}` |
| `productApi.createProduct()` | POST | `/api/v1/products` |
| `productApi.updateProduct(id)` | PUT | `/api/v1/products/{id}` |
| `productApi.deleteProduct(id)` | DELETE | `/api/v1/products/{id}` |
| `cartApi.createCart()` | POST | `/cart` |
| `cartApi.getCart(cartId)` | GET | `/cart/{cartId}/my-cart` |
| `cartApi.addItem(cartId)` | POST | `/cart/{cartId}/items` |
| `cartApi.updateItem(cartId)` | PUT | `/cart/{cartId}/items` |
| `cartApi.removeItem(cartId, productId)` | DELETE | `/cart/{cartId}/items/{productId}` |
| `cartApi.clearCart(cartId)` | DELETE | `/cart/{cartId}/clear` |
| `orderApi.getMyOrders()` | GET | `/orders` |
| `orderApi.getOrder(id)` | GET | `/orders/{id}` |
| `orderApi.cancelOrder(id)` | DELETE | `/orders/{id}` |
| `categoryApi.getAllCategories()` | GET | `/api/v1/categories` |
| `categoryApi.getCategoryById(id)` | GET | `/api/v1/categories/{id}` |
| `paymentApi.processPayment()` | POST | `/payments` |
| `checkoutApi.checkout(cartId)` | POST | `/checkout/{cartId}` |

## Notes

- All endpoints except auth require authentication (JWT token)
- ADMIN-only endpoints will return 403 Forbidden for non-admin users
- Cart operations require USER role
- The backend runs on port 8080 by default
- Remember to update CORS settings in production
