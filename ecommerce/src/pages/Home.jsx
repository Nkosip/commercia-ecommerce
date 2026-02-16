import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Fetch active products from backend
        const products = await productApi.getProducts({ active: true });
        
        // Get first 3 products as featured
        setFeaturedProducts(products.slice(0, 3));
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Through every purchase,<br />
                your contribution changes lives
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Support our mission to empower youth and transform communities across Africa.
                Every item you purchase directly funds education, skills development, and
                community programs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn btn-primary">
                  Shop Merchandise
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/photo.jpg"
                  alt="Community youth program"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600">
              See how your support is making a real difference
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-red-50 rounded-2xl p-8 text-center transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-primary-red rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                <i className="fas fa-users"></i> {/* 👥 */}
              </div>
              <h3 className="text-5xl font-bold text-primary-red mb-2">15,000+</h3>
              <span className="text-lg text-gray-700">Youth Empowered</span>
            </div>

            {/* Card 2 */}
            <div className="bg-blue-50 rounded-2xl p-8 text-center transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-primary-blue rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                <i className="fas fa-heart"></i> {/* ❤ */}
              </div>
              <h3 className="text-5xl font-bold text-primary-blue mb-2">50+</h3>
              <span className="text-lg text-gray-700">Communities Supported</span>
            </div>

            {/* Card 3 */}
            <div className="bg-red-50 rounded-2xl p-8 text-center transform hover:scale-105 transition-transform">
              <div className="w-20 h-20 bg-primary-red rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                <i className="fas fa-graduation-cap"></i> {/* 🎓 */}
              </div>
              <h3 className="text-5xl font-bold text-primary-red mb-2">85%</h3>
              <span className="text-lg text-gray-700">Education Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">
              Support our mission with meaningful merchandise
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <i className="fas fa-exclamation-circle text-red-500 text-3xl mb-3"></i>
                <p className="text-red-800 font-medium">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 btn btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-shopping-bag text-gray-300 text-5xl mb-4"></i>
              <p className="text-gray-600 text-lg">No products available at the moment.</p>
              <p className="text-gray-500 text-sm mt-2">Check back soon for new items!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-red to-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Every Purchase Makes a Difference
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            When you shop with Afrika Tikkun, 100% of proceeds go directly to empowering
            youth and transforming communities across Africa.
          </p>
          <Link to="/shop" className="btn bg-black text-primary-red hover:bg-blue-100 inline-flex items-center gap-2">
            Start Shopping
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;