import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/UseAuth';
import { getDashboardStats, getAllOrders, getAllProducts } from '../../services/api/adminApi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentOrders: [],
    lowStockProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats, orders, and products in parallel
        const [dashboardData, ordersData, productsData] = await Promise.all([
          getDashboardStats(),
          getAllOrders(),
          getAllProducts(),
        ]);

        // Process the data
        const recentOrders = ordersData
          .slice(0, 5)
          .map(order => ({
            id: order.orderId,
            orderNumber: `ORD-${String(order.orderId).padStart(3, '0')}`,
            customer: 'Customer', // Backend doesn't provide customer name in OrderDto
            total: parseFloat(order.totalAmount),
            status: order.status.toLowerCase(),
            date: new Date().toISOString().split('T')[0], // Backend doesn't provide date
          }));

        // Find low stock products (less than 10 items)
        const lowStockProducts = productsData
          .filter(product => product.availableQuantity < 10 && product.active)
          .slice(0, 3)
          .map(product => ({
            id: product.id,
            name: product.name,
            stock: product.availableQuantity,
          }));

        setStats({
          totalProducts: productsData.length,
          totalOrders: dashboardData.totalOrders || 0,
          totalRevenue: parseFloat(dashboardData.totalSales) || 0,
          totalUsers: dashboardData.totalUsers || 0,
          recentOrders,
          lowStockProducts,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const getStatusBadgeVariant = (status) => {
    const variants = {
      pending: 'warning',
      processing: 'default',
      shipped: 'default',
      delivered: 'success',
      cancelled: 'destructive',
    };
    return variants[status] || 'secondary';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-gray-500"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{stats.totalRevenue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-gray-500">Total sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-gray-500"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-gray-500">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-gray-500"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-gray-500">In catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-gray-500"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-gray-500">Registered users</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.customer}</p>
                      <p className="text-xs text-gray-400">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">R{order.total.toFixed(2)}</p>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="mt-1">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Link to="/admin/orders" className="block text-center mt-4 text-sm text-blue-600 hover:text-blue-800">
                  View all orders →
                </Link>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No orders yet</p>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
            <CardDescription>Products running low on inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">Product ID: {product.id}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="warning">
                        {product.stock} left
                      </Badge>
                    </div>
                  </div>
                ))}
                <Link to="/admin/products" className="block text-center mt-4 text-sm text-blue-600 hover:text-blue-800">
                  Manage inventory →
                </Link>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">All products well stocked</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/products/new" className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-center">
            <div className="text-3xl mb-2">➕</div>
            <h3 className="font-medium text-gray-900">Add New Product</h3>
            <p className="text-sm text-gray-500 mt-1">Create a new product listing</p>
          </Link>
          
          <Link to="/admin/orders" className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-center">
            <div className="text-3xl mb-2">📦</div>
            <h3 className="font-medium text-gray-900">Manage Orders</h3>
            <p className="text-sm text-gray-500 mt-1">View and process orders</p>
          </Link>
          
          <Link to="/admin/products" className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-medium text-gray-900">Manage Products</h3>
            <p className="text-sm text-gray-500 mt-1">View and edit product catalog</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;