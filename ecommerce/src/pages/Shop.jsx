import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import productApi from "../services/api/productApi";
import categoryApi from "../services/api/categoryApi";

const ITEMS_PER_LOAD = 9;

const Shop = () => {
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  // State for data from API
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build filter object for API
        const filters = {
          active: true, // Only fetch active products
        };

        // Add category filter if any selected
        if (selectedCategories.length > 0) {
          // For multiple categories, we'll need to fetch all and filter client-side
          // Or you could make multiple API calls and combine results
          // For now, we'll fetch all products and filter client-side
          filters.categoryId = undefined;
        }

        // Add price range filter
        if (priceRange === "under-200") {
          filters.maxPrice = 199.99;
        } else if (priceRange === "200-400") {
          filters.minPrice = 200;
          filters.maxPrice = 400;
        } else if (priceRange === "over-400") {
          filters.minPrice = 400.01;
        }

        const data = await productApi.getProducts(filters);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, priceRange]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange("all");
    setVisibleCount(ITEMS_PER_LOAD);
  };

  // Filter products by selected categories (client-side)
  const filteredProducts = products.filter((product) => {
    if (selectedCategories.length > 0) {
      return selectedCategories.includes(product.category?.id);
    }
    return true;
  });

  // Reset visible items when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD);
  }, [selectedCategories, priceRange]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredProducts.length;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Title */}
      <section className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop Our Products
          </h1>
          <p className="text-lg text-gray-600">
            Every purchase supports youth empowerment and community development
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-filter text-primary-red"></i>
                Filters
              </h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                {categories.length > 0 ? (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="w-4 h-4 text-primary-red rounded focus:ring-primary-red"
                        />
                        <span className="text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Loading categories...</p>
                )}
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                >
                  <option value="all">All Prices</option>
                  <option value="under-200">Under R200</option>
                  <option value="200-400">R200 – R400</option>
                  <option value="over-400">Over R400</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="w-full btn btn-secondary text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Products */}
          <main className="lg:col-span-3">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing {visibleProducts.length} of{" "}
                    {filteredProducts.length} products
                  </p>
                </div>

                {visibleProducts.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {visibleProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {/* Load More */}
                    {canLoadMore && (
                      <div className="flex justify-center mt-10">
                        <button
                          onClick={() =>
                            setVisibleCount((prev) => prev + ITEMS_PER_LOAD)
                          }
                          className="btn btn-primary px-8 py-3"
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20">
                    <i className="fa-solid fa-box-open text-6xl text-gray-300 mb-4"></i>
                    <p className="text-xl text-gray-600">
                      No products found matching your filters.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="btn btn-primary mt-6"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;