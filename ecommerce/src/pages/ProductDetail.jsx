import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/UseCart';
import { useAuth } from '../context/UseAuth';
import productApi from '../services/api/productApi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  // State management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await productApi.getProductById(parseInt(id));
        setProduct(data);
        
        // Set default size if product has sizes
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      const shouldLogin = window.confirm(
        'You need to be logged in to add items to cart. Would you like to log in now?'
      );
      if (shouldLogin) {
        // Redirect to login page with return URL
        navigate('/login', { state: { from: `/product/${id}` } });
      }
      return;
    }

    // Validate size selection if product has sizes
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    try {
      setAddingToCart(true);
      
      // Add to cart using the backend API
      const result = await addToCart(product.id, quantity);
      
      if (result.success) {
        alert(`${quantity} x ${product.name}${selectedSize ? ' (' + selectedSize + ')' : ''} added to cart!`);
      } else if (result.needsAuth) {
        // User needs to log in
        const shouldLogin = window.confirm(
          result.error + '. Would you like to log in now?'
        );
        if (shouldLogin) {
          navigate('/login', { state: { from: `/product/${id}` } });
        }
      } else {
        alert(result.error || 'Failed to add to cart. Please try again.');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      const shouldLogin = window.confirm(
        'You need to be logged in to make a purchase. Would you like to log in now?'
      );
      if (shouldLogin) {
        navigate('/login', { state: { from: `/product/${id}` } });
      }
      return;
    }

    // Validate size selection if product has sizes
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    try {
      setAddingToCart(true);
      
      const result = await addToCart(product.id, quantity);
      
      if (result.success) {
        navigate('/cart');
      } else if (result.needsAuth) {
        navigate('/login', { state: { from: `/product/${id}` } });
      } else {
        alert(result.error || 'Failed to add to cart');
        setAddingToCart(false);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart');
      setAddingToCart(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mb-4"></div>
              <p className="text-gray-600">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 py-20 text-center">
          <i className="fa-solid fa-exclamation-circle text-6xl text-red-500 mb-4"></i>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {error || 'Product Not Found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/shop" className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Get the category name safely
  const categoryName = product.category?.name || 'General';
  
  // Get the image URL with fallback
  const imageUrl = product.imageUrl || product.image || '/placeholder-product.jpg';

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link to="/" className="text-gray-600 hover:text-primary-red">Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/shop" className="text-gray-600 hover:text-primary-red">Shop</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Login prompt for non-authenticated users */}
        {!isAuthenticated() && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <i className="fa-solid fa-info-circle mr-2"></i>
              <Link to="/login" className="font-semibold underline hover:text-blue-900">
                Log in
              </Link>
              {' '}or{' '}
              <Link to="/signup" className="font-semibold underline hover:text-blue-900">
                create an account
              </Link>
              {' '}to add items to your cart and make a purchase.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg p-8">
          {/* Product Image */}
          <div className="relative">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-auto rounded-xl shadow-md"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.target.src = '/placeholder-product.jpg';
              }}
            />
            
            {/* Stock indicator (if available in your backend) */}
            {product.stockQuantity !== undefined && product.stockQuantity <= 5 && product.stockQuantity > 0 && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Only {product.stockQuantity} left!
              </div>
            )}
            
            {product.stockQuantity === 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Out of Stock
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
              {categoryName}
            </span>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-bold text-primary-red mb-6">
              R {Number(product.price).toFixed(2)}
            </p>

            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              {product.description || 'No description available'}
            </p>

            {/* Size Selection (if product has sizes) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        selectedSize === size
                          ? 'bg-primary-red text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold text-xl"
                  disabled={addingToCart}
                >
                  -
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold text-xl"
                  disabled={addingToCart}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || (product.stockQuantity !== undefined && product.stockQuantity === 0)}
                className="btn btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cart-plus mr-2"></i>
                    Add to Cart
                  </>
                )}
              </button>
              {/* <button
                onClick={handleBuyNow}
                disabled={addingToCart || (product.stockQuantity !== undefined && product.stockQuantity === 0)}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button> */}
            </div>

            {/* Out of stock message */}
            {product.stockQuantity === 0 && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">
                  <i className="fa-solid fa-circle-exclamation mr-2"></i>
                  This product is currently out of stock.
                </p>
              </div>
            )}

            {/* Support Message */}
            <div className="mt-8 p-6 bg-red-50 rounded-xl border-2 border-red-200">
              <p className="text-sm text-gray-700">
                <i className="fa-solid fa-heart text-primary-red mr-2"></i>
                <strong>Supporting youth education:</strong> 100% of proceeds from this purchase
                directly fund education programs and community development.
              </p>
            </div>

            {/* Additional product info (if available) */}
            {product.specifications && (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                <p className="text-sm text-gray-700 whitespace-pre-line">{product.specifications}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;