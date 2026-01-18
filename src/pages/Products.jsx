import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Grid, List, Smartphone, Laptop, Home, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

// AsyncImage Component for better image loading
const AsyncImage = (props) => {
    const [loadedSrc, setLoadedSrc] = useState(null);
    
    useEffect(() => {
        setLoadedSrc(null);
        if (props.src) {
            const handleLoad = () => {
                setLoadedSrc(props.src);
            };
            const image = new Image();
            image.addEventListener('load', handleLoad);
            image.src = props.src;
            return () => {
                image.removeEventListener('load', handleLoad);
            };
        }
    }, [props.src]);
    
    if (loadedSrc === props.src) {
        return <img {...props} alt={props.alt || 'Product image'} />;
    }
    return null;
};

const Products = () => {
  const { addToCart } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [error, setError] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Enhanced categories with icons
  const categories = [
    { value: 'all', label: 'All Categories', icon: <Grid className="w-4 h-4" /> },
    { value: 'smartphones', label: 'Smartphones', icon: <Smartphone className="w-4 h-4" /> },
    { value: 'laptops', label: 'Laptops', icon: <Laptop className="w-4 h-4" /> },
    { value: 'home-decoration', label: 'Home Decor', icon: <Home className="w-4 h-4" /> },
    { value: 'skincare', label: 'Skincare', icon: <Sparkles className="w-4 h-4" /> },
    { value: 'fragrances', label: 'Fragrances' },
    { value: 'groceries', label: 'Groceries' }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'title', label: 'Title A-Z' }
  ];

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products from specific categories
        const categoriesToFetch = ['smartphones', 'laptops', 'home-decoration', 'skincare'];
        
        // Fetch each category separately to get more products
        const fetchPromises = categoriesToFetch.map(category => 
          fetch(`https://dummyjson.com/products/category/${category}`)
            .then(res => {
              if (!res.ok) throw new Error(`Failed to fetch ${category}`);
              return res.json();
            })
            .then(data => ({
              category: category,
              products: data.products
            }))
            .catch(err => {
              console.warn(`Could not fetch ${category}:`, err.message);
              return { category: category, products: [] };
            })
        );

        // Also fetch some general products for other categories
        const generalProductsPromise = fetch('https://dummyjson.com/products?limit=30')
          .then(res => res.json())
          .then(data => ({
            category: 'general',
            products: data.products.filter(p => 
              !categoriesToFetch.includes(p.category.replace(/\s+/g, '-'))
            )
          }));

        const allResults = await Promise.all([...fetchPromises, generalProductsPromise]);
        
        // Combine all products
        let allProducts = [];
        allResults.forEach(result => {
          const transformed = result.products.map(product => ({
            id: product.id + (result.category === 'general' ? 1000 : 0), // Ensure unique IDs
            name: product.title,
            description: product.description,
            price: product.price,
            category: product.category.replace(/\s+/g, '-').toLowerCase(),
            image: product.thumbnail || product.images?.[0] || `https://picsum.photos/400/400?random=${product.id}`,
            stock: product.stock || Math.floor(Math.random() * 50),
            rating: product.rating || Math.random() * 2 + 3,
            featured: (product.rating >= 4.5) || Math.random() > 0.7,
            brand: product.brand,
            specs: product.category === 'smartphones' ? {
              storage: `${Math.floor(Math.random() * 512) + 64}GB`,
              ram: `${Math.floor(Math.random() * 12) + 4}GB`,
              camera: `${Math.floor(Math.random() * 108) + 12}MP`
            } : product.category === 'laptops' ? {
              processor: `Intel Core i${Math.floor(Math.random() * 7) + 3}`,
              ram: `${Math.floor(Math.random() * 32) + 8}GB`,
              storage: `${Math.floor(Math.random() * 2) + 1}TB SSD`
            } : null
          }));
          allProducts = [...allProducts, ...transformed];
        });

        // Add some exclusive products for each category
        const exclusiveProducts = [
          // Exclusive Smartphones
          {
            id: 2001,
            name: 'iPhone 15 Pro Max',
            description: 'Latest Apple smartphone with A17 Pro chip and titanium design',
            price: 1299,
            category: 'smartphones',
            image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
            stock: 15,
            rating: 4.8,
            featured: true,
            brand: 'Apple',
            specs: { storage: '512GB', ram: '8GB', camera: '48MP' }
          },
          {
            id: 2002,
            name: 'Samsung Galaxy S24 Ultra',
            description: 'Premium Android phone with S-Pen and advanced AI features',
            price: 1199,
            category: 'smartphones',
            image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
            stock: 20,
            rating: 4.7,
            featured: true,
            brand: 'Samsung',
            specs: { storage: '1TB', ram: '12GB', camera: '200MP' }
          },
          // Exclusive Laptops
          {
            id: 2003,
            name: 'MacBook Pro 16"',
            description: 'Professional laptop with M3 Max chip for creative work',
            price: 2499,
            category: 'laptops',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w-400&h=400&fit=crop',
            stock: 8,
            rating: 4.9,
            featured: true,
            brand: 'Apple',
            specs: { processor: 'M3 Max', ram: '64GB', storage: '2TB SSD' }
          },
          {
            id: 2004,
            name: 'Dell XPS 15',
            description: 'Premium Windows laptop with OLED display',
            price: 1899,
            category: 'laptops',
            image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop',
            stock: 12,
            rating: 4.6,
            featured: true,
            brand: 'Dell',
            specs: { processor: 'Intel Core i9', ram: '32GB', storage: '1TB SSD' }
          },
          // Exclusive Home Decor
          {
            id: 2005,
            name: 'Modern Floor Lamp',
            description: 'Adjustable standing lamp with smart home integration',
            price: 199,
            category: 'home-decoration',
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
            stock: 25,
            rating: 4.5,
            featured: true,
            brand: 'HomeLuxe'
          },
          {
            id: 2006,
            name: 'Ceramic Vase Set',
            description: 'Handcrafted ceramic vases in minimalist design',
            price: 89,
            category: 'home-decoration',
            image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop',
            stock: 40,
            rating: 4.3,
            featured: false,
            brand: 'ArtisanDecor'
          },
          // Exclusive Skincare
          {
            id: 2007,
            name: 'Vitamin C Serum',
            description: 'Brightening serum with hyaluronic acid and antioxidants',
            price: 45,
            category: 'skincare',
            image: 'https://images.unsplash.com/photo-1556228578-9c360e0b8f3c?w=400&h=400&fit=crop',
            stock: 60,
            rating: 4.7,
            featured: true,
            brand: 'SkinScience'
          },
          {
            id: 2008,
            name: 'Retinol Night Cream',
            description: 'Anti-aging cream with retinol and peptides',
            price: 65,
            category: 'skincare',
            image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
            stock: 35,
            rating: 4.6,
            featured: true,
            brand: 'GlowLab'
          }
        ];

        allProducts = [...allProducts, ...exclusiveProducts];
        
        // Shuffle and limit to reasonable number
        allProducts = allProducts
          .sort(() => Math.random() - 0.5)
          .slice(0, 100); // Limit to 100 products
        
        setProducts(allProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Using sample data instead.');
        
        // Enhanced fallback data with all categories
        const fallbackProducts = [
          // Smartphones
          { id: 1, name: 'iPhone 14', description: 'Latest Apple smartphone', price: 999, category: 'smartphones', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop', stock: 25, rating: 4.5, featured: true, brand: 'Apple' },
          { id: 2, name: 'Samsung Galaxy S23', description: 'Premium Android phone', price: 899, category: 'smartphones', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop', stock: 30, rating: 4.7, featured: true, brand: 'Samsung' },
          { id: 3, name: 'Google Pixel 8', description: 'AI-powered smartphone', price: 799, category: 'smartphones', image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop', stock: 20, rating: 4.6, featured: false, brand: 'Google' },
          // Laptops
          { id: 4, name: 'MacBook Air', description: 'Lightweight Apple laptop', price: 1199, category: 'laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', stock: 15, rating: 4.8, featured: true, brand: 'Apple' },
          { id: 5, name: 'Dell XPS 13', description: 'Compact Windows laptop', price: 1099, category: 'laptops', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop', stock: 18, rating: 4.4, featured: false, brand: 'Dell' },
          { id: 6, name: 'Lenovo ThinkPad', description: 'Business laptop', price: 1299, category: 'laptops', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop', stock: 22, rating: 4.3, featured: false, brand: 'Lenovo' },
          // Home Decor
          { id: 7, name: 'Modern Wall Art', description: 'Abstract canvas painting', price: 149, category: 'home-decoration', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop', stock: 40, rating: 4.2, featured: true, brand: 'HomeArt' },
          { id: 8, name: 'Decorative Pillows', description: 'Set of 4 velvet pillows', price: 79, category: 'home-decoration', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', stock: 55, rating: 4.5, featured: false, brand: 'CozyHome' },
          { id: 9, name: 'Ceramic Table Lamp', description: 'Handmade lamp with shade', price: 89, category: 'home-decoration', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop', stock: 30, rating: 4.6, featured: true, brand: 'Lumina' },
          // Skincare
          { id: 10, name: 'Hyaluronic Acid Serum', description: 'Hydrating facial serum', price: 35, category: 'skincare', image: 'https://images.unsplash.com/photo-1556228578-9c360e0b8f3c?w=400&h=400&fit=crop', stock: 65, rating: 4.7, featured: true, brand: 'SkinCare+' },
          { id: 11, name: 'SPF 50 Sunscreen', description: 'Broad spectrum protection', price: 25, category: 'skincare', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop', stock: 80, rating: 4.4, featured: false, brand: 'SunSafe' },
          { id: 12, name: 'Night Repair Cream', description: 'Anti-aging moisturizer', price: 55, category: 'skincare', image: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=400&h=400&fit=crop', stock: 45, rating: 4.8, featured: true, brand: 'YouthLab' },
        ];
        
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => 
        (selectedCategory === 'all' || product.category === selectedCategory) &&
        (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())))
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low': return a.price - b.price;
          case 'price-high': return b.price - a.price;
          case 'rating': return b.rating - a.rating;
          case 'newest': return b.id - a.id;
          case 'title': return a.name.localeCompare(b.name);
          default: return a.featured ? -1 : 1;
        }
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Page number generation
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page === '...' || page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  const handleViewDetails = (product) => {
    alert(`Viewing details for: ${product.name}`);
  };

  // Get category icon
  const getCategoryIcon = (categoryValue) => {
    const category = categories.find(c => c.value === categoryValue);
    return category?.icon || null;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Our Products</h1>
        <p className="text-gray-600">Discover amazing products across all categories</p>
      </div>

      {/* Category Quick Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-gray-700 font-medium mr-2">Shop by:</span>
          {categories.filter(c => c.value !== 'all').map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon && <span className="mr-2">{category.icon}</span>}
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, description, or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field py-2"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field py-2"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      {!loading && selectedCategory === 'all' && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.filter(c => c.value !== 'all').map(category => {
            const categoryCount = products.filter(p => p.category === category.value).length;
            if (categoryCount === 0) return null;
            
            return (
              <div key={category.value} className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center">
                  {category.icon && <div className="mr-3 text-blue-600">{category.icon}</div>}
                  <div>
                    <div className="text-sm text-gray-600">{category.label}</div>
                    <div className="text-lg font-semibold">{categoryCount} products</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Products Grid/List */}
      {loading ? (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`card animate-pulse ${viewMode === 'list' ? 'flex' : ''}`}>
              <div className={`${viewMode === 'list' ? 'w-48 h-48 mr-6' : 'h-48'} bg-gray-300 rounded-lg mb-4`}></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-4 text-gray-600">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
            {selectedCategory !== 'all' && (
              <span className="flex items-center mt-1">
                <span className="mr-2">{getCategoryIcon(selectedCategory)}</span>
                in {categories.find(c => c.value === selectedCategory)?.label}
              </span>
            )}
          </div>

          {/* Products */}
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
                ImageComponent={AsyncImage}
                showCategory={true}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4">
          {/* Items per page selector */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="input-field py-1 text-sm"
            >
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="12">12</option>
              <option value="16">16</option>
              <option value="20">20</option>
            </select>
          </div>

          {/* Page navigation */}
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 border rounded-lg ${
                currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              Previous
            </button>
            
            {getPageNumbers().map((pageNum, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 border rounded-lg ${
                  pageNum === currentPage 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : pageNum === '...'
                    ? 'cursor-default'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                disabled={pageNum === '...'}
              >
                {pageNum}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 border rounded-lg ${
                currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              Next
            </button>
          </nav>

          {/* Page info */}
          <div className="text-gray-600 text-sm">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;