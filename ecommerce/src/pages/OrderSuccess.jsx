import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/UseCart';
import apiClient from '../services/api/apiClient';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [orderInfo, setOrderInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      navigate('/');
      return;
    }

    // Verify session status with backend
    const verifyPayment = async () => {
      try {
        const response = await apiClient.get(
          `/payment/stripe/session-status?sessionId=${sessionId}`
        );
        
        setOrderInfo(response.data);
        
        // Clear the cart after successful payment
        await clearCart();
        
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Unable to verify payment status. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, clearCart, navigate]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-red mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-xl shadow-md p-12 max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-exclamation-triangle text-red-600 text-3xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Verification Failed
            </h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="bg-white rounded-xl shadow-md p-12 max-w-md mx-auto">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-check text-green-600 text-3xl"></i>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-2">
            Thank you for your order. Your payment has been processed successfully.
          </p>

          {/* Order Details */}
          {orderInfo && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
              <p className="text-sm text-gray-600">
                <strong>Order ID:</strong> {orderInfo.orderId}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {orderInfo.customerEmail}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong>{' '}
                <span className="text-green-600 font-semibold">
                  {orderInfo.status === 'paid' ? 'Paid' : orderInfo.status}
                </span>
              </p>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-8">
            A confirmation email has been sent to your email address.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary w-full"
            >
              <i className="fa-solid fa-home mr-2"></i>
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="btn btn-secondary w-full"
            >
              <i className="fa-solid fa-box mr-2"></i>
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;