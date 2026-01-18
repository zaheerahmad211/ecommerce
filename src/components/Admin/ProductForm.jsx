import { useState, useEffect } from 'react';
import { Save, Upload, X, Camera, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductForm = ({ product = null, onSubmit, loading = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    brand: '',
    imageUrl: '',
    featured: false,
    specifications: {
      color: '',
      weight: '',
      dimensions: ''
    }
  });

  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  const categories = [
    'smartphones',
    'laptops',
    'home-decoration',
    'skincare',
    'fragrances',
    'groceries',
    'electronics',
    'clothing',
    'books',
    'other'
  ];

  const brands = {
    smartphones: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi'],
    laptops: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Microsoft'],
    'home-decoration': ['IKEA', 'HomeGoods', 'West Elm', 'Pottery Barn'],
    skincare: ['La Roche-Posay', 'CeraVe', 'The Ordinary', 'Neutrogena', 'Clinique'],
    fragrances: ['Chanel', 'Dior', 'Gucci', 'Versace'],
    groceries: ['Organic Valley', 'Whole Foods', 'Trader Joe\'s'],
    other: ['Generic', 'Unbranded']
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category: product.category || '',
        stock: product.stock?.toString() || '',
        brand: product.brand || '',
        imageUrl: product.image || '',
        featured: product.featured || false,
        specifications: {
          color: product.specifications?.color || '',
          weight: product.specifications?.weight || '',
          dimensions: product.specifications?.dimensions || ''
        }
      });
      
      if (product.image) {
        setImagePreview(product.image);
      }
    }
  }, [product]);

  useEffect(() => {
    if (formData.category) {
      setFormData(prev => ({
        ...prev,
        brand: ''
      }));
    }
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload to a server
      // For demo, create a local URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }
    if (!formData.brand && formData.category !== 'other') newErrors.brand = 'Brand is required';
    if (!formData.imageUrl) newErrors.imageUrl = 'Product image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      image: formData.imageUrl,
      rating: product?.rating || 4.0,
      createdAt: new Date().toISOString()
    };
    
    onSubmit(productData);
  };

  const getAvailableBrands = () => {
    if (!formData.category) return [];
    return brands[formData.category] || brands.other;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Package className="w-6 h-6 mr-2 text-blue-600" />
          <h1 className="text-3xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
        <p className="text-gray-600">
          {product ? 'Update product information' : 'Add a new product to your store'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Product Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Describe the product features and benefits"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className={`input-field pl-8 ${errors.price ? 'border-red-500' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className={`input-field ${errors.stock ? 'border-red-500' : ''}`}
                      placeholder="Enter stock quantity"
                    />
                    {errors.stock && (
                      <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`input-field ${errors.category ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand {formData.category && formData.category !== 'other' && '*'}
                    </label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      disabled={!formData.category}
                      className={`input-field ${errors.brand ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select a brand</option>
                      {getAvailableBrands().map(brand => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                    {errors.brand && (
                      <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    name="specifications.color"
                    value={formData.specifications.color}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Black, White"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight
                  </label>
                  <input
                    type="text"
                    name="specifications.weight"
                    value={formData.specifications.weight}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., 1.5 kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="specifications.dimensions"
                    value={formData.specifications.dimensions}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., 10 x 5 x 2 cm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image & Actions */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Product Image *</h2>
              
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData(prev => ({ ...prev, imageUrl: '' }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 mb-2">No image selected</p>
                      <p className="text-sm text-gray-400">Recommended: 400x400px</p>
                    </div>
                  )}
                  
                  {errors.imageUrl && (
                    <p className="mt-2 text-sm text-red-600 text-center">{errors.imageUrl}</p>
                  )}
                </div>

                {/* Upload Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <span className="text-sm text-gray-500">or</span>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Enter image URL"
                        value={formData.imageUrl}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, imageUrl: e.target.value }));
                          if (e.target.value) {
                            setImagePreview(e.target.value);
                          }
                        }}
                        className="input-field text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Product */}
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Featured Product</h3>
                  <p className="text-sm text-gray-500">Show this product on homepage</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="card">
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {product ? 'Update Product' : 'Add Product'}
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;