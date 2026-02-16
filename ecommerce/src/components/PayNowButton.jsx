import React, { useState } from 'react';

/**
 * Stripe Payment Component
 * 
 * This component handles the payment process for your checkout page.
 * It sends a payment request to your backend which processes it through Stripe.
 * 
 * Props:
 * - orderId: The ID of the order to be paid (required)
 * - authToken: JWT token for authentication (required)
 * - onSuccess: Callback function when payment succeeds (optional)
 * - onError: Callback function when payment fails (optional)
 * - apiUrl: Backend URL (optional, defaults to http://localhost:8080)
 */

const StripePaymentButton = ({ 
    orderId, 
    authToken, 
    onSuccess, 
    onError,
    apiUrl = 'http://localhost:8080'
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handlePayment = async () => {
        // Reset states
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Send payment request to backend
            const response = await fetch(`${apiUrl}/payments`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    orderId: orderId,
                    method: 'CARD' // This triggers Stripe payment in backend
                })
            });

            // Check if response is ok
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Payment request failed');
            }

            const data = await response.json();

            // Check payment status
            if (data.status === 'SUCCESS') {
                setSuccess(true);
                
                // Call success callback if provided
                if (onSuccess) {
                    onSuccess(data);
                } else {
                    // Default success behavior
                    alert(`Payment successful! Reference: ${data.reference}`);
                    // Optionally redirect to confirmation page
                    // window.location.href = '/order-confirmation';
                }
            } else {
                throw new Error('Payment failed. Please try again.');
            }

        } catch (err) {
            console.error('Payment error:', err);
            setError(err.message || 'An error occurred processing your payment');
            
            // Call error callback if provided
            if (onError) {
                onError(err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="stripe-payment-container">
            <button 
                onClick={handlePayment}
                disabled={loading || success}
                className={`payment-button ${loading ? 'loading' : ''} ${success ? 'success' : ''}`}
            >
                {loading ? 'Processing...' : success ? '✓ Payment Complete' : 'Pay Now'}
            </button>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                </div>
            )}

            {success && (
                <div className="success-message">
                    <span className="success-icon">✓</span>
                    Payment processed successfully!
                </div>
            )}

            <style jsx>{`
                .stripe-payment-container {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .payment-button {
                    padding: 16px 32px;
                    font-size: 18px;
                    font-weight: 600;
                    color: white;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }

                .payment-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
                }

                .payment-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .payment-button.loading {
                    background: #999;
                }

                .payment-button.success {
                    background: #28a745;
                }

                .error-message {
                    padding: 12px 16px;
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .error-icon {
                    font-size: 20px;
                }

                .success-message {
                    padding: 12px 16px;
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .success-icon {
                    font-size: 20px;
                }
            `}</style>
        </div>
    );
};

export default StripePaymentButton;