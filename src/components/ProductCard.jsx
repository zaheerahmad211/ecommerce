import { useState } from 'react';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="card group hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Heart 
              className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
          <button
            onClick={() => onViewDetails(product)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          >
            <Eye className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{product.category}</p>
          </div>
          <span className="text-2xl font-bold text-blue-600">${product.price}</span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between text-sm">
          <span className={`font-medium ${
            product.stock > 10 ? 'text-green-600' : 
            product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {product.stock > 10 ? 'In Stock' : 
             product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
          </span>
          <span className="text-gray-500">{product.stock} units</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg font-medium transition-all ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>

        {/* Admin Controls */}
        {user?.role === 'admin' && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex space-x-2">
              <button className="flex-1 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm font-medium">
                Edit
              </button>
              <button className="flex-1 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;