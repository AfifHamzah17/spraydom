// src/pages/Product.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import { FaPlus, FaSearch, FaFilter, FaSortAmountDown, FaBoxOpen } from 'react-icons/fa';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, filterStatus, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts();
      if (response && response.result && response.result.products) {
        setProducts(response.result.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(product => {
        if (filterStatus === 'available') {
          return product.status === 'available' || product.available !== false;
        } else if (filterStatus === 'unavailable') {
          return product.status === 'unavailable' || product.available === false;
        }
        return true;
      });
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  // Skeleton Loader Component
  const ProductSkeleton = () => (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 animate-pulse">
      <div className="bg-gray-700 h-56"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="flex space-x-2">
          <div className="h-10 bg-gray-700 rounded flex-1"></div>
          <div className="h-10 bg-gray-700 rounded flex-1"></div>
          <div className="h-10 bg-gray-700 rounded flex-1"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Skeleton Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="h-10 bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-64 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-700 rounded w-36 mt-4 md:mt-0 animate-pulse"></div>
          </div>
          {/* Skeleton Search & Filter */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700 animate-pulse">
            <div className="h-10 bg-gray-700 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-700 rounded w-48"></div>
          </div>
          {/* Skeleton Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary text-white max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Our Products</h1>
            <p className="text-gray-400">Find various product options to improve your sleep quality.</p>
          </div>
          
          {token && user?.role === 'admin' && (
            <Link
              to="/admin/product-create"
              className="mt-4 md:mt-0 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-lg"
            >
              <FaPlus className="mr-2" />
              Add Product
            </Link>
          )}
        </div>

        {/* Search, Filter, and Sort */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <FaSortAmountDown className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isAdmin={token && user?.role === 'admin'}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700">
            <FaBoxOpen className="text-gray-500 text-6xl mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">
              {searchTerm || filterStatus !== 'all' 
                ? 'No products match your criteria.' 
                : 'No products are currently available.'}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              {token && user?.role === 'admin' 
                ? "Start by adding your first product." 
                : "Try changing your filters or search keywords."}
            </p>
            {token && user?.role === 'admin' && !searchTerm && filterStatus === 'all' && (
              <Link
                to="/admin/product-create"
                className="inline-flex items-center bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <FaPlus className="mr-2" />
                Add First Product
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}