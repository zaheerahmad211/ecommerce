import { useState, useEffect, useRef } from 'react';
import { 
  Users, Package, ShoppingCart, DollarSign, 
  TrendingUp, Activity, Plus, Trash2, Edit,
  BarChart3, PieChart, Download, Filter,
  Search, X, Check, AlertCircle, MoreVertical
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const { user } = useAuth();
  const dashboardRef = useRef(null);
  const productsTableRef = useRef(null);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'electronics',
    stock: '',
    image: '',
    sku: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // In real app, these would be API calls
      // Mock data with more realistic structure
      const mockStats = {
        totalProducts: 156,
        totalUsers: 1245,
        totalOrders: 892,
        totalRevenue: 45678.90
      };

      const mockOrders = [
        { id: 1, customer: 'John Doe', email: 'john@example.com', amount: 299.99, status: 'completed', date: '2024-01-15', items: 3 },
        { id: 2, customer: 'Jane Smith', email: 'jane@example.com', amount: 199.99, status: 'processing', date: '2024-01-15', items: 2 },
        { id: 3, customer: 'Bob Johnson', email: 'bob@example.com', amount: 599.99, status: 'shipped', date: '2024-01-14', items: 5 },
        { id: 4, customer: 'Alice Brown', email: 'alice@example.com', amount: 89.99, status: 'pending', date: '2024-01-14', items: 1 },
        { id: 5, customer: 'Charlie Wilson', email: 'charlie@example.com', amount: 349.99, status: 'completed', date: '2024-01-13', items: 4 }
      ];

      const mockProducts = [
        { 
          id: 1, 
          name: 'Wireless Headphones', 
          description: 'Premium noise-cancelling wireless headphones',
          price: 199.99, 
          stock: 25, 
          category: 'electronics',
          sku: 'ELEC-001',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
        },
        { 
          id: 2, 
          name: 'Smart Watch', 
          description: 'Latest model smart watch with health tracking',
          price: 299.99, 
          stock: 15, 
          category: 'electronics',
          sku: 'ELEC-002',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop'
        },
        { 
          id: 3, 
          name: 'Designer Backpack', 
          description: 'Waterproof laptop backpack',
          price: 89.99, 
          stock: 40, 
          category: 'clothing',
          sku: 'CLOTH-001',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop'
        },
        { 
          id: 4, 
          name: 'Coffee Maker', 
          description: 'Automatic drip coffee machine',
          price: 129.99, 
          stock: 30, 
          category: 'home',
          sku: 'HOME-001',
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop'
        },
        { 
          id: 5, 
          name: 'Fiction Book', 
          description: 'Bestselling fiction novel',
          price: 19.99, 
          stock: 100, 
          category: 'books',
          sku: 'BOOK-001',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=100&fit=crop'
        }
      ];

      setStats(mockStats);
      setRecentOrders(mockOrders);
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Export Functionality
  const handleExport = async (type) => {
    try {
      setLoading(true);
      
      switch(type) {
        case 'pdf':
          await exportToPDF();
          break;
        case 'excel':
          await exportToExcel();
          break;
        case 'image':
          await exportToImage();
          break;
        case 'csv':
          await exportToCSV();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    const element = dashboardRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(products.map(p => ({
      ID: p.id,
      Name: p.name,
      SKU: p.sku,
      Category: p.category,
      Price: `$${p.price}`,
      Stock: p.stock,
      Description: p.description
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    
    // Add stats sheet
    const statsWs = XLSX.utils.json_to_sheet([stats]);
    XLSX.utils.book_append_sheet(wb, statsWs, "Statistics");
    
    XLSX.writeFile(wb, `products-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToImage = async () => {
    const element = dashboardRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const link = document.createElement('a');
    link.download = `dashboard-snapshot-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const exportToCSV = () => {
    const headers = ['ID,Name,SKU,Category,Price,Stock,Description'];
    const rows = products.map(p => 
      `${p.id},"${p.name}","${p.sku}","${p.category}",${p.price},${p.stock},"${p.description}"`
    );
    
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 2. Add/Edit Product Functionality
  const handleAddProduct = (e) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...newProduct, id: editingProduct.id }
          : p
      ));
      setEditingProduct(null);
    } else {
      // Add new product
      const productToAdd = {
        ...newProduct,
        id: products.length + 1,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        sku: newProduct.sku || `SKU-${Date.now()}`
      };
      setProducts([...products, productToAdd]);
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
    }
    
    setShowAddProduct(false);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: 'electronics',
      stock: '',
      image: '',
      sku: ''
    });
    
    alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image,
      sku: product.sku
    });
    setShowAddProduct(true);
  };

  // 3. Delete Product Functionality
  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
      alert('Product deleted successfully!');
    }
  };

  // 4. Delete Order Functionality
  const handleDeleteOrder = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setRecentOrders(recentOrders.filter(order => order.id !== id));
      setStats(prev => ({ ...prev, totalOrders: prev.totalOrders - 1 }));
      alert('Order deleted successfully!');
    }
  };

  // 5. Analytics Functionality
  const handleShowAnalytics = () => {
    setShowAnalytics(true);
    setShowReports(false);
    
    // In a real app, you would fetch analytics data here
    console.log('Fetching analytics data...');
  };

  // 6. Reports Functionality
  const handleShowReports = () => {
    setShowReports(true);
    setShowAnalytics(false);
    
    // In a real app, you would generate reports here
    console.log('Generating reports...');
  };

  // 7. Filter Functionality
  const handleApplyFilters = () => {
    // Filter products based on search term and category
    const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    return filteredProducts;
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setOrderFilter('all');
  };

  // 8. Update Order Status
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setRecentOrders(recentOrders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
    alert(`Order ${orderId} status updated to ${newStatus}`);
  };

  // Filtered data
  const filteredProducts = handleApplyFilters();
  const filteredOrders = orderFilter === 'all' 
    ? recentOrders 
    : recentOrders.filter(order => order.status === orderFilter);

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      change: '+12.5%'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Package className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-600',
      change: '+5.2%'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <Users className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-600',
      change: '+23.1%'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'from-orange-500 to-red-600',
      change: '+8.7%'
    }
  ];

  return (
    <div className="space-y-6" ref={dashboardRef}>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name} 👋</h1>
        <p className="text-blue-100">Here's what's happening with your store today.</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Last login: Today, 10:30 AM</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Store health: Excellent</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <p className="text-green-600 text-sm mt-1">{stat.change} from last month</p>
              </div>
              <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              <button onClick={() => setShowAnalytics(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
                <div className="h-64 bg-gradient-to-b from-blue-50 to-white rounded-lg flex items-end p-4">
                  {[40, 60, 75, 90, 85, 95, 100].map((height, i) => (
                    <div key={i} className="flex-1 mx-1">
                      <div 
                        className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg"
                        style={{ height: `${height}%` }}
                      />
                      <div className="text-center text-xs mt-2">Day {i+1}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Top Products</h3>
                <div className="space-y-3">
                  {products.slice(0, 5).map((product, i) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{i+1}.</span>
                        <span>{product.name}</span>
                      </div>
                      <span className="font-semibold">${product.price * product.stock}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowAnalytics(false)} className="btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReports && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Generate Reports</h2>
              <button onClick={() => setShowReports(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="card">
                <h3 className="text-lg font-semibold mb-3">Select Report Type</h3>
                <div className="space-y-2">
                  {[
                    { id: 'sales', name: 'Sales Report', desc: 'Daily, weekly, and monthly sales' },
                    { id: 'inventory', name: 'Inventory Report', desc: 'Stock levels and alerts' },
                    { id: 'customer', name: 'Customer Report', desc: 'Customer acquisition and retention' },
                    { id: 'product', name: 'Product Performance', desc: 'Best and worst selling products' }
                  ].map(report => (
                    <label key={report.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="report" className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{report.name}</div>
                        <div className="text-sm text-gray-500">{report.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold mb-3">Date Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">From</label>
                    <input type="date" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">To</label>
                    <input type="date" className="input-field" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowReports(false)} className="btn-secondary">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert('Report generated successfully!');
                    setShowReports(false);
                  }}
                  className="btn-primary"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products Header with Search and Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Products</h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary inline-flex items-center"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
              <button
                onClick={() => setShowAddProduct(true)}
                className="btn-primary inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="card p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="home">Home</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stock Status</label>
                  <select className="input-field">
                    <option>All</option>
                    <option>In Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <select className="input-field">
                    <option>All Prices</option>
                    <option>Under $50</option>
                    <option>$50 - $200</option>
                    <option>Over $200</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Add/Edit Product Form */}
          {(showAddProduct || editingProduct) && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">SKU *</label>
                    <input
                      type="text"
                      value={newProduct.sku}
                      onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                      className="input-field"
                      required
                      placeholder="e.g., PROD-001"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Stock *</label>
                    <input
                      type="number"
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="input-field"
                    rows="3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="input-field"
                      required
                    >
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="books">Books</option>
                      <option value="home">Home</option>
                      <option value="sports">Sports</option>
                      <option value="beauty">Beauty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <input
                      type="url"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      className="input-field"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="flex items-end">
                    {newProduct.image && (
                      <div className="h-20 w-20 rounded-lg overflow-hidden border">
                        <img 
                          src={newProduct.image} 
                          alt="Preview" 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddProduct(false);
                      setEditingProduct(null);
                      setNewProduct({
                        name: '',
                        description: '',
                        price: '',
                        category: 'electronics',
                        stock: '',
                        image: '',
                        sku: ''
                      });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div className="card overflow-hidden" ref={productsTableRef}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded object-cover"
                                src={product.image}
                                alt={product.name}
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold">${product.price}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 20 
                              ? 'bg-green-100 text-green-800' 
                              : product.stock > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No products found. Try adjusting your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Orders & Quick Stats */}
        <div className="space-y-6">
          {/* Recent Orders */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Recent Orders</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="text-sm border rounded-lg px-2 py-1"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 group">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.amount}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No orders found with the selected filter.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleShowAnalytics}
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Analytics</span>
              </button>
              <button 
                onClick={handleShowReports}
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <PieChart className="w-6 h-6 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Reports</span>
              </button>
              <div className="relative group">
                <button className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors w-full">
                  <Download className="w-6 h-6 text-green-600 mb-2" />
                  <span className="text-sm font-medium">Export</span>
                </button>
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 bg-white border rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <button 
                      onClick={() => handleExport('pdf')}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      Export as PDF
                    </button>
                    <button 
                      onClick={() => handleExport('excel')}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      Export as Excel
                    </button>
                    <button 
                      onClick={() => handleExport('image')}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      Export as Image
                    </button>
                    <button 
                      onClick={() => handleExport('csv')}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      Export as CSV
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowAddProduct(true)}
                className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-6 h-6 text-orange-600 mb-2" />
                <span className="text-sm font-medium">Add Product</span>
              </button>
            </div>
          </div>

          {/* Order Status Summary */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Order Status</h3>
            <div className="space-y-3">
              {[
                { status: 'Pending', count: 45, color: 'bg-yellow-500' },
                { status: 'Processing', count: 28, color: 'bg-blue-500' },
                { status: 'Shipped', count: 32, color: 'bg-purple-500' },
                { status: 'Delivered', count: 156, color: 'bg-green-500' },
                { status: 'Cancelled', count: 12, color: 'bg-red-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span>{item.status}</span>
                  </div>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Avg. Order Value</span>
                  <span className="font-semibold">$156.45</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Conversion Rate</span>
                  <span className="font-semibold">3.2%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Customer Satisfaction</span>
                  <span className="font-semibold">94.5%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '94.5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;