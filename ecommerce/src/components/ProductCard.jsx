import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const getCategoryColor = (categoryName) => {
    if (!categoryName) return 'bg-gray-100 text-gray-800';
    
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('apparel') || lowerName.includes('clothing')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (lowerName.includes('accessories') || lowerName.includes('accessory')) {
      return 'bg-green-100 text-green-800';
    }
    if (lowerName.includes('support') || lowerName.includes('donation')) {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  // Use placeholder image if no image URL is provided
  const imageUrl = product.imageUrl || product.image || '/placeholder-product.jpg';
  
  // Get category name from category object
  const categoryName = product.category?.name || 'General';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden group">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.target.src = '/placeholder-product.jpg';
          }}
        />
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
            categoryName
          )}`}
        >
          {categoryName}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description || 'No description available'}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-red">
            R {Number(product.price).toFixed(2)}
          </span>
          <Link
            to={`/product/${product.id}`}
            className="btn btn-primary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;