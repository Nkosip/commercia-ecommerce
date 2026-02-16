import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/UseCart";

const Cart = () => {
  const {
    cartItems,
    loading,
    error,
    removeFromCart,
    updateQuantity,
    clearCart,      // ✅ Add clearCart from context
    clearError,
  } = useCart();

  const [productDetails, setProductDetails] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false); // ✅ State for confirmation modal

  // Fetch + normalize product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!cartItems || cartItems.length === 0) {
        setLoadingProducts(false);
        return;
      }

      try {
        setLoadingProducts(true);
        const details = {};
        const productApi = await import("../services/api/productApi");

        for (const item of cartItems) {
          if (!details[item.productId]) {
            try {
              const product =
                await productApi.default.getProductById(item.productId);

              // 🔥 NORMALIZE BACKEND DTO HERE
              // Now includes imageUrl from the backend
              details[item.productId] = {
                id: product.id,
                name: product.name ?? "Unnamed Product",
                description: product.description ?? "",
                price: Number(product.price) || 0,
                categoryName: product.category?.name ?? "Uncategorized",
                // Use imageUrl from backend first, then fallback
                image:
                  product.imageUrl ||           // Primary: imageUrl from backend
                  product.images?.[0] ||        // Fallback: images array
                  product.image ||              // Fallback: image field
                  "/images/placeholder.png",    // Final fallback: placeholder
              };
            } catch (err) {
              console.error(
                `Error fetching product ${item.productId}:`,
                err
              );
              details[item.productId] = {
                id: item.productId,
                name: "Product Not Found",
                description: "",
                price: 0,
                categoryName: "Unknown",
                image: "/images/placeholder.png",
              };
            }
          }
        }

        setProductDetails(details);
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProductDetails();
  }, [cartItems]);

  const handleQuantityUpdate = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const result = await updateQuantity(productId, newQuantity);
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  const handleRemoveItem = async (productId) => {
    const result = await removeFromCart(productId);
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  // ✅ NEW: Handle clear cart with confirmation
  const handleClearCart = async () => {
    setShowClearConfirmation(false); // Close modal
    
    const result = await clearCart();
    
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  // Calculate totals from product details and cart items
  const calculateSubtotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    
    return cartItems.reduce((total, item) => {
      const product = productDetails[item.productId];
      if (product && product.price) {
        return total + (product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = 0;
  const total = subtotal + shipping;

  // Loading state
  if (loading || loadingProducts) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-red mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading your cart…</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Error Loading Cart
        </h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <button onClick={clearError} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  // Empty cart
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 mb-8">
          Start shopping to add items to your cart
        </p>
        <Link to="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* ✅ NEW: Header with Clear Cart button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </h1>
          
          <button
            onClick={() => setShowClearConfirmation(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
          >
            <i className="fa-solid fa-trash-can"></i>
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = productDetails[item.productId];
              if (!product) return null;

              const itemTotal = product.price * item.quantity;

              return (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex gap-6">
                    {/* Product Image with better error handling */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        console.warn(`Failed to load image: ${product.image}`);
                        e.target.src = "/images/placeholder.png";
                      }}
                    />

                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Category: {product.categoryName}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            handleRemoveItem(item.productId)
                          }
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Remove item"
                        >
                          <i className="fa-solid fa-trash text-xl"></i>
                        </button>
                      </div>

                      <p className="text-2xl font-bold text-primary-red mb-4">
                        R {product.price.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-700">
                          Quantity:
                        </span>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleQuantityUpdate(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="w-10 h-10 bg-gray-200 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>

                          <span className="w-8 text-center font-bold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantityUpdate(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className="w-10 h-10 bg-gray-200 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <span className="ml-auto font-bold text-gray-900">
                          R {itemTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>R {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>

                <hr />

                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>R {total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn btn-primary w-full mb-4"
              >
                Proceed to Checkout →
              </Link>

              <Link
                to="/shop"
                className="btn btn-secondary w-full"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ NEW: Clear Cart Confirmation Modal */}
      {showClearConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-trash-can text-3xl text-red-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Clear Cart?
              </h3>
              <p className="text-gray-600">
                Are you sure you want to remove all {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} from your cart? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirmation(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;