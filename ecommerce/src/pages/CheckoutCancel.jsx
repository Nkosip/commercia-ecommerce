import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CheckoutCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Cancel Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-xmark text-yellow-600 text-4xl"></i>
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your payment was not processed. No charges have been made to your account.
          </p>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-info-circle text-blue-600 text-lg mt-1"></i>
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Your cart items are still saved</p>
                <p>
                  Don't worry! All items in your cart have been saved. You can return to complete your purchase at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Common Reasons */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Common reasons for cancellation:</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle text-xs text-gray-400 mt-1.5"></i>
                <span>You clicked the back button or closed the payment window</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle text-xs text-gray-400 mt-1.5"></i>
                <span>You decided to review your order before completing payment</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle text-xs text-gray-400 mt-1.5"></i>
                <span>There was an issue with your payment method</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/checkout" className="btn btn-primary">
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Return to Checkout
            </Link>
            <Link to="/cart" className="btn btn-outline">
              <i className="fa-solid fa-shopping-cart mr-2"></i>
              View Cart
            </Link>
          </div>

          {/* Alternative Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Need help?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
              <Link to="/shop" className="text-red-600 hover:text-red-700 font-semibold">
                Continue Shopping
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link to="/contact" className="text-red-600 hover:text-red-700 font-semibold">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            <i className="fa-solid fa-lock mr-1"></i>
            All payments are securely processed through Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancel;