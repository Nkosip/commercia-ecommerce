import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderApi from '../services/api/orderApi';
import productApi from '../services/api/productApi';
import {  getTimestamp } from '../utils/DateUtils';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderApi.getMyOrders();
      
      // Sort by most recent first using utility function
      const sortedOrders = data.sort((a, b) => 
        getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
      );
      
      setOrders(sortedOrders);

      // Fetch product details for all order items
      const productIds = new Set();
      sortedOrders.forEach(order => {
        order.items?.forEach(item => {
          productIds.add(item.productId);
        });
      });

      // Fetch all unique products
      const productPromises = Array.from(productIds).map(async (id) => {
        try {
          const product = await productApi.getProductById(id);
          return { id, product };
        } catch (err) {
          console.error(`Failed to fetch product ${id}:`, err);
          return { id, product: null };
        }
      });

      const productResults = await Promise.all(productPromises);
      const productsMap = {};
      productResults.forEach(({ id, product }) => {
        if (product) {
          productsMap[id] = product;
        }
      });
      
      setProductDetails(productsMap);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
      SHIPPED: 'bg-purple-100 text-purple-800 border-purple-300',
      CANCELLED: 'bg-red-100 text-red-800 border-red-300',
      DELIVERED: 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: 'fa-clock',
      CONFIRMED: 'fa-check-circle',
      SHIPPED: 'fa-truck',
      CANCELLED: 'fa-times-circle',
      DELIVERED: 'fa-box-check',
    };
    return icons[status] || 'fa-circle';
  };

  const getTrackingSteps = (status) => {
    const steps = [
      { status: 'PENDING', label: 'Order Placed', icon: 'fa-receipt' },
      { status: 'CONFIRMED', label: 'Confirmed', icon: 'fa-check-circle' },
      { status: 'SHIPPED', label: 'Shipped', icon: 'fa-truck' },
      { status: 'DELIVERED', label: 'Delivered', icon: 'fa-box-check' },
    ];

    const statusOrder = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // Use the imported formatLongDate utility function
  // Removed local formatDate function as we're using the utility

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-red mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <i className="fa-solid fa-exclamation-circle text-4xl text-red-600 mb-4"></i>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
          <div className="flex border-b">
            {[
              { value: 'all', label: 'All Orders', count: orders.length },
              { value: 'PENDING', label: 'Pending', count: orders.filter(o => o.status === 'PENDING').length },
              { value: 'CONFIRMED', label: 'Confirmed', count: orders.filter(o => o.status === 'CONFIRMED').length },
              { value: 'SHIPPED', label: 'Shipped', count: orders.filter(o => o.status === 'SHIPPED').length },
              { value: 'CANCELLED', label: 'Cancelled', count: orders.filter(o => o.status === 'CANCELLED').length },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                  filterStatus === tab.value
                    ? 'text-primary-red border-b-2 border-primary-red bg-red-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <i className="fa-solid fa-box-open text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all' 
                ? "You haven't placed any orders yet." 
                : `You don't have any ${filterStatus.toLowerCase()} orders.`}
            </p>
            <Link to="/shop" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6 border-b">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="text-lg font-bold text-gray-900">#{order.orderId}</p>
                      </div>
                      
                      <div className="h-12 w-px bg-gray-200 hidden md:block"></div>
                      <div className="hidden md:block">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-lg font-bold text-primary-red">
                          R {order.totalAmount?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <i className={`fa-solid ${getStatusIcon(order.status)} mr-2`}></i>
                        {order.status}
                      </span>
                      <button
                        onClick={() =>
                          setSelectedOrder(selectedOrder === order.orderId ? null : order.orderId)
                        }
                        className="text-primary-red hover:text-red-700 font-medium text-sm"
                      >
                        {selectedOrder === order.orderId ? 'Hide Details' : 'View Details'}
                        <i
                          className={`fa-solid fa-chevron-${
                            selectedOrder === order.orderId ? 'up' : 'down'
                          } ml-2`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Details - Expandable */}
                {selectedOrder === order.orderId && (
                  <div className="p-6 bg-gray-50">
                    {/* Order Tracking */}
                    {order.status !== 'CANCELLED' && (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Tracking</h3>
                        <div className="relative">
                          {/* Progress Line */}
                          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200">
                            <div
                              className="h-full bg-primary-red transition-all duration-500"
                              style={{
                                width: `${
                                  (getTrackingSteps(order.status).filter((s) => s.completed)
                                    .length /
                                    getTrackingSteps(order.status).length) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>

                          {/* Tracking Steps */}
                          <div className="relative flex justify-between">
                            {getTrackingSteps(order.status).map((step, index) => (
                              <div key={index} className="flex flex-col items-center flex-1">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                                    step.completed
                                      ? 'bg-primary-red border-green-200 text-green-400'
                                      : 'bg-white border-gray-200 text-gray-400'
                                  }`}
                                >
                                  <i className={`fa-solid ${step.icon} text-lg`}></i>
                                </div>
                                <p
                                  className={`mt-2 text-xs font-medium text-center ${
                                    step.completed ? 'text-gray-900' : 'text-gray-500'
                                  }`}
                                >
                                  {step.label}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {order.items?.map((item, index) => {
                          const product = productDetails[item.productId];
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-4 bg-white p-4 rounded-lg"
                            >
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                {product?.imageUrl ? (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <i className="fa-solid fa-image text-2xl text-gray-400"></i>
                                )}
                              </div>
                              <div className="flex-grow">
                                <h4 className="font-semibold text-gray-900">
                                  {product?.name || `Product #${item.productId}`}
                                </h4>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">
                                  R {(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-600">
                                  R {item.price?.toFixed(2)} each
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 bg-white p-4 rounded-lg border-t-4 border-primary-red">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Subtotal</span>
                        <span className="font-semibold">
                          R {order.totalAmount?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Shipping</span>
                        <span className="font-semibold text-green-600">FREE</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">Total</span>
                          <span className="text-xl font-bold text-primary-red">
                            R {order.totalAmount?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-question text-primary-red text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about your order or need assistance, please contact our
                support team.
              </p>
              <div className="flex gap-4">
                <a href="mailto:support@afrikatikkun.org" className="text-primary-red hover:underline font-medium">
                  <i className="fa-solid fa-envelope mr-2"></i>
                  Email Support
                </a>
                <a href="tel:+27123456789" className="text-primary-red hover:underline font-medium">
                  <i className="fa-solid fa-phone mr-2"></i>
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;