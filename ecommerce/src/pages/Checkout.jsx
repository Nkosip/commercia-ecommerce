import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/UseCart';
import { createCheckoutSession } from '../services/api/stripeApi';

const Checkout = () => {
  const { cart, cartItems } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [productDetails, setProductDetails] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Fetch product details for cart items
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
              const product = await productApi.default.getProductById(item.productId);
              details[item.productId] = {
                id: product.id,
                name: product.name ?? "Unnamed Product",
                price: Number(product.price) || 0,
                imageUrl: product.imageUrl,
              };
            } catch (err) {
              console.error(`Error fetching product ${item.productId}:`, err);
              details[item.productId] = {
                id: item.productId,
                name: "Product Not Found",
                price: 0,
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

  // Calculate totals
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const requiredFields = [
      'firstName', 
      'lastName', 
      'email', 
      'address', 
      'city', 
      'postalCode'
    ];
    
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      return { valid: false, error: 'Please fill in all required shipping information' };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { valid: false, error: 'Please enter a valid email address' };
    }

    return { valid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm();
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Check if cart has items
    if (!cart || !cartItems || cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Get cart ID
      const cartId = cart?.cartId || cart?.id;
      
      if (!cartId) {
        throw new Error('Cart ID not found');
      }

      // Create Stripe Checkout Session
      console.log('Creating Stripe checkout session...');
      const response = await createCheckoutSession(cartId);

      if (!response || !response.sessionUrl) {
        throw new Error('Failed to create checkout session');
      }

      // Save shipping info to localStorage (optional - for order confirmation)
      localStorage.setItem('shippingInfo', JSON.stringify(formData));

      // Redirect to Stripe Checkout
      console.log('Redirecting to Stripe Checkout...');
      window.location.href = response.sessionUrl;

    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to create checkout session. Please try again.';
      setError(errorMessage);
      setProcessing(false);
    }
  };

  if (loadingProducts) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Checkout
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left side: Shipping Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Shipping Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Johannesburg"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="2000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Payment Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-info-circle text-blue-600 text-xl mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Secure Payment with Stripe</h3>
                    <p className="text-sm text-blue-800">
                      After clicking "Proceed to Payment", you'll be redirected to Stripe's secure payment page to complete your purchase. Your payment information is never stored on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Cart Items Preview */}
                <div className="mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => {
                    const product = productDetails[item.productId];
                    if (!product) return null;

                    return (
                      <div key={item.productId} className="flex gap-3 py-3 border-b">
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            R {(product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">R {subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>

                  <hr className="border-gray-300" />

                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>R {total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="btn btn-primary w-full mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Redirecting to Stripe...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-lock"></i>
                      Proceed to Payment
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                  <span className="text-xs">Secured by Stripe</span>
                </div>

                <Link to="/cart" className="block text-center text-sm text-gray-600 hover:text-gray-900 mt-4">
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;










// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useCart } from '../context/UseCart';
// import checkoutApi from '../services/api/checkoutApi';
// import paymentApi from '../services/api/paymentApi';
// import { cartApi } from '../services/api';

// const Checkout = () => {
//   const { cart, cartItems, deleteCart } = useCart();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     address: '',
//     city: '',
//     postalCode: '',
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//     nameOnCard: '',
//   });

//   const [productDetails, setProductDetails] = useState({});
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch product details for cart items
//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       if (!cartItems || cartItems.length === 0) {
//         setLoadingProducts(false);
//         return;
//       }

//       try {
//         setLoadingProducts(true);
//         const details = {};
//         const productApi = await import("../services/api/productApi");

//         for (const item of cartItems) {
//           if (!details[item.productId]) {
//             try {
//               const product = await productApi.default.getProductById(item.productId);
//               details[item.productId] = {
//                 id: product.id,
//                 name: product.name ?? "Unnamed Product",
//                 price: Number(product.price) || 0,
//               };
//             } catch (err) {
//               console.error(`Error fetching product ${item.productId}:`, err);
//               details[item.productId] = {
//                 id: item.productId,
//                 name: "Product Not Found",
//                 price: 0,
//               };
//             }
//           }
//         }

//         setProductDetails(details);
//       } catch (err) {
//         console.error("Error fetching product details:", err);
//       } finally {
//         setLoadingProducts(false);
//       }
//     };

//     fetchProductDetails();
//   }, [cartItems]);

//   // Calculate totals
//   const calculateSubtotal = () => {
//     if (!cartItems || cartItems.length === 0) return 0;
    
//     return cartItems.reduce((total, item) => {
//       const product = productDetails[item.productId];
//       if (product && product.price) {
//         return total + (product.price * item.quantity);
//       }
//       return total;
//     }, 0);
//   };

//   const subtotal = calculateSubtotal();
//   const shipping = 0;
//   const total = subtotal + shipping;

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const validateForm = () => {
//     const requiredFields = [
//       'firstName', 
//       'lastName', 
//       'email', 
//       'address', 
//       'city', 
//       'postalCode', 
//       'cardNumber', 
//       'expiryDate', 
//       'cvv', 
//       'nameOnCard'
//     ];
    
//     const emptyFields = requiredFields.filter(field => !formData[field]);
    
//     if (emptyFields.length > 0) {
//       return { valid: false, error: 'Please fill in all required fields' };
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       return { valid: false, error: 'Please enter a valid email address' };
//     }

//     // Card number validation (basic - must be 13-19 digits)
//     const cardNumber = formData.cardNumber.replace(/\s/g, '');
//     if (cardNumber.length < 13 || cardNumber.length > 19 || !/^\d+$/.test(cardNumber)) {
//       return { valid: false, error: 'Please enter a valid card number' };
//     }

//     // Expiry date validation (MM/YY format)
//     const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
//     if (!expiryRegex.test(formData.expiryDate)) {
//       return { valid: false, error: 'Please enter expiry date in MM/YY format' };
//     }

//     // CVV validation (3-4 digits)
//     if (formData.cvv.length < 3 || formData.cvv.length > 4 || !/^\d+$/.test(formData.cvv)) {
//       return { valid: false, error: 'Please enter a valid CVV (3-4 digits)' };
//     }

//     return { valid: true };
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate form
//     const validation = validateForm();
//     if (!validation.valid) {
//       setError(validation.error);
//       return;
//     }

//     // Check if cart has items
//     if (!cart || !cartItems || cartItems.length === 0) {
//       setError('Your cart is empty');
//       return;
//     }

//     try {
//       setProcessing(true);
//       setError(null);

//       // Get cart ID
//       const cartId = cart?.cartId || cart?.id || cartApi.getCartId();
      
//       if (!cartId) {
//         throw new Error('Cart ID not found');
//       }

//       // Step 1: Create order through checkout
//       console.log('Creating order from cart...');
//       const order = await checkoutApi.checkout(cartId);

//       if (!order || !order.orderId) {
//         throw new Error('Failed to create order');
//       }

//       console.log('Order created:', order.orderId);

//       // Step 2: Process payment for the order
//       console.log('Processing payment...');
//       const paymentResult = await paymentApi.processPayment({
//         orderId: order.orderId,
//         method: 'CARD', // Using Stripe payment provider
//       });

//       console.log('Payment result:', paymentResult);

//       // Step 3: Check payment status
//       if (paymentResult && paymentResult.status === 'SUCCESS') {
//         // Delete the cart entirely after successful checkout
//         console.log('Payment successful! Deleting cart...');
//         const deleteResult = await deleteCart();
        
//         if (!deleteResult.success) {
//           console.error('Failed to delete cart:', deleteResult.error);
//           // Still proceed with success message, but log the error
//         }
        
//         // Show success message
//         alert(
//           `Order placed and paid successfully! 
          
// Order ID: ${order.orderId}
// Payment Reference: ${paymentResult.reference || 'N/A'}
// Total: R ${total.toFixed(2)}

// Thank you for supporting Afrika Tikkun!`
//         );
        
//         // Navigate to home or order confirmation page
//         navigate('/', { replace: true });
//       } else {
//         throw new Error('Payment failed. Please try again.');
//       }
//     } catch (err) {
//       console.error('Checkout error:', err);
//       const errorMessage = err.response?.data?.message || 
//                           err.message || 
//                           'Failed to process checkout. Please try again.';
//       setError(errorMessage);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // Loading state
//   if (loadingProducts) {
//     return (
//       <div className="bg-gray-50 min-h-screen py-20 text-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-red mx-auto mb-4"></div>
//         <p className="text-lg text-gray-600">Loading checkout...</p>
//       </div>
//     );
//   }

//   // Empty cart
//   if (!cartItems || cartItems.length === 0) {
//     return (
//       <div className="bg-gray-50 min-h-screen py-20">
//         <div className="container mx-auto px-4 text-center">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
//           <p className="text-lg text-gray-600 mb-8">
//             Add items to your cart before proceeding to checkout
//           </p>
//           <Link to="/shop" className="btn btn-primary">
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-12">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl font-bold text-gray-900 mb-4">Checkout</h1>
//         <p className="text-lg text-gray-600 mb-8">
//           Complete your purchase and support our mission
//         </p>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
//             <p className="font-semibold">Error</p>
//             <p>{error}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* Left side: Forms */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Shipping Information */}
//               <div className="bg-white rounded-xl shadow-md p-8">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-6">
//                   Shipping Information
//                 </h2>

//                 <div className="grid md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       First Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName}
//                       onChange={handleChange}
//                       placeholder="John"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Last Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName}
//                       onChange={handleChange}
//                       placeholder="Doe"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Email *
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="john@example.com"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Address *
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     placeholder="123 Main Street"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       City *
//                     </label>
//                     <input
//                       type="text"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleChange}
//                       placeholder="Johannesburg"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Postal Code *
//                     </label>
//                     <input
//                       type="text"
//                       name="postalCode"
//                       value={formData.postalCode}
//                       onChange={handleChange}
//                       placeholder="2000"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Information */}
//               <div className="bg-white rounded-xl shadow-md p-8">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-4">
//                   Payment Information
//                 </h2>
//                 <p className="text-sm text-gray-600 mb-4">
//                   🔒 Your card details are encrypted and tokenized.
//                 </p>

//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//                   <p className="text-sm text-blue-900">
//                     <strong>Stripe Test Card:</strong> 4242 4242 4242 4242 • Any future expiry • Any 3-digit CVV
//                   </p>
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Card Number *
//                   </label>
//                   <input
//                     type="text"
//                     name="cardNumber"
//                     value={formData.cardNumber}
//                     onChange={handleChange}
//                     placeholder="1234 5678 9012 3456"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Expiry Date *
//                     </label>
//                     <input
//                       type="text"
//                       name="expiryDate"
//                       value={formData.expiryDate}
//                       onChange={handleChange}
//                       placeholder="MM/YY"
//                       maxLength="5"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       CVV *
//                     </label>
//                     <input
//                       type="text"
//                       name="cvv"
//                       value={formData.cvv}
//                       onChange={handleChange}
//                       placeholder="123"
//                       maxLength="4"
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Name on Card *
//                   </label>
//                   <input
//                     type="text"
//                     name="nameOnCard"
//                     value={formData.nameOnCard}
//                     onChange={handleChange}
//                     placeholder="John Doe"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Right side: Order Summary */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-xl shadow-md p-8 sticky top-24">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

//                 {/* Cart Items Preview */}
//                 <div className="mb-6 max-h-64 overflow-y-auto">
//                   {cartItems.map((item) => {
//                     const product = productDetails[item.productId];
//                     if (!product) return null;

//                     return (
//                       <div key={item.productId} className="flex justify-between items-center py-2 border-b">
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-gray-900">{product.name}</p>
//                           <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
//                         </div>
//                         <p className="text-sm font-semibold text-gray-900">
//                           R {(product.price * item.quantity).toFixed(2)}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div className="space-y-4 mb-6">
//                   <div className="flex justify-between text-gray-700">
//                     <span>Subtotal</span>
//                     <span className="font-semibold">R {subtotal.toFixed(2)}</span>
//                   </div>

//                   <div className="flex justify-between text-gray-700">
//                     <span>Shipping</span>
//                     <span className="text-green-600 font-semibold">FREE</span>
//                   </div>

//                   <hr className="border-gray-300" />

//                   <div className="flex justify-between text-xl font-bold text-gray-900">
//                     <span>Total</span>
//                     <span>R {total.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={processing}
//                   className="btn btn-primary w-full mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {processing ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <i className="fa-solid fa-lock"></i>
//                       Complete Order
//                     </>
//                   )}
//                 </button>

//                 <p className="text-xs text-center text-gray-600">
//                   256-bit SSL encryption<br />
//                   Your payment is secure
//                 </p>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Checkout;