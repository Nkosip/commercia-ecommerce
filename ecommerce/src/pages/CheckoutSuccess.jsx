import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { verifyStripeSession } from '../services/api/stripeApi';
import { useCart } from '../context/UseCart';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshCart } = useCart(); // ✅ Changed from deleteCart
  
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      navigate('/');
      return;
    }

    const verifyPayment = async () => {
      try {
        setLoading(true);
        
        // Verify the Stripe session
        const response = await verifyStripeSession(sessionId);
        
        if (response.status === 'SUCCESS') {
          setOrderDetails(response);
          
          // ✅ Refresh cart instead of deleting
          // (Backend already deleted it, we just need to sync)
          await refreshCart();
          
          // Clear shipping info from localStorage
          localStorage.removeItem('shippingInfo');
        } else {
          setError('Payment verification failed. Please contact support with your order ID.');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Failed to verify payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, refreshCart]); // ✅ Updated dependency

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-check text-green-600 text-4xl"></i>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-3">
              {orderDetails?.orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold text-gray-900">#{orderDetails.orderId}</span>
                </div>
              )}
              {orderDetails?.sessionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Reference:</span>
                  <span className="font-mono text-sm text-gray-900">{orderDetails.sessionId.slice(0, 20)}...</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  <i className="fa-solid fa-circle-check mr-2"></i>
                  Paid
                </span>
              </div>
            </div>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-info-circle text-blue-600 text-lg mt-1"></i>
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">What's Next?</p>
                <p>
                  You will receive an order confirmation email shortly. Your order will be processed and shipped within 2-3 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders" className="btn btn-primary">
              <i className="fa-solid fa-box mr-2"></i>
              View My Orders
            </Link>
            <Link to="/shop" className="btn btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Questions about your order? <Link to="/contact" className="text-red-600 hover:text-red-700 font-semibold">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;