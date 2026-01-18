import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, RefreshCw, Tag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { addToCart } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockProducts = [
      {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling headphones with 30-hour battery life',
        price: 199.99,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        stock: 25,
        rating: 4.5,
        featured: true
      },
      {
        id: 2,
        name: 'Smart Watch Pro',
        description: 'Track your fitness and receive notifications on this advanced smartwatch',
        price: 299.99,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w-400&h=400&fit=crop',
        stock: 15,
        rating: 4.8,
        featured: true
      },
      {
        id: 3,
        name: 'Designer Backpack',
        description: 'Water-resistant backpack with laptop compartment',
        price: 89.99,
        category: 'clothing',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        stock: 40,
        rating: 4.3,
        featured: true
      },
      {
        id: 4,
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe',
        price: 129.99,
        category: 'home',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
        stock: 30,
        rating: 4.6,
        featured: true
      }
    ];
    
    setFeaturedProducts(mockProducts);
    setLoading(false);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  const handleViewDetails = (product) => {
    // Navigate to product detail page
    alert(`Viewing details for: ${product.name}`);
  };

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Free Shipping',
      description: 'Free delivery on orders over $50'
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: <Tag className="w-8 h-8" />,
      title: 'Best Price',
      description: 'Price match guarantee'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Products
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Shop the latest trends in electronics, fashion, home decor and more. 
            Quality products at unbeatable prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/products" 
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Shop Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center bg-transparent border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-blue-600/50"></div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="card text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-gray-600">Handpicked items just for you</p>
          </div>
          <Link 
            to="/products" 
            className="btn-primary inline-flex items-center"
          >
            View All
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['electronics', 'clothing', 'home', 'books'].map((category) => (
            <Link
              key={category}
              to={`/products?category=${category}`}
              className="group relative overflow-hidden rounded-xl h-48 bg-gradient-to-br from-blue-500 to-purple-600"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-2xl font-bold capitalize">
                  {category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;