import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, MapPin, Phone, Mail, Star, Store } from 'lucide-react';

const VendorManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const vendors = [
    {
      id: 'VEN001',
      name: 'FastFood Co.',
      category: 'Restaurant',
      email: 'contact@fastfood.com',
      phone: '+234 805 123 4567',
      address: '123 Business Ave, Lagos',
      rating: 4.8,
      totalOrders: 1247,
      numberOfStores: 5,
      status: 'Active',
      joinDate: '2023-03-15'
    },
    {
      id: 'VEN002',
      name: 'Electronics Plus',
      category: 'Electronics',
      email: 'info@electronicsplus.com',
      phone: '+234 806 234 5678',
      address: '456 Tech Street, Abuja',
      rating: 4.6,
      totalOrders: 892,
      numberOfStores: 3,
      status: 'Active',
      joinDate: '2023-05-22'
    },
    {
      id: 'VEN003',
      name: 'Fresh Groceries',
      category: 'Grocery',
      email: 'orders@freshgroceries.com',
      phone: '+234 807 345 6789',
      address: '789 Market Square, Port Harcourt',
      rating: 4.9,
      totalOrders: 2134,
      numberOfStores: 8,
      status: 'Active',
      joinDate: '2023-01-10'
    },
    {
      id: 'VEN004',
      name: 'Fashion Hub',
      category: 'Clothing',
      email: 'hello@fashionhub.com',
      phone: '+234 808 456 7890',
      address: '321 Style Boulevard, Kano',
      rating: 4.3,
      totalOrders: 567,
      numberOfStores: 2,
      status: 'Inactive',
      joinDate: '2023-07-18'
    },
    {
      id: 'VEN005',
      name: 'Book Haven',
      category: 'Books',
      email: 'contact@bookhaven.com',
      phone: '+234 809 567 8901',
      address: '654 Literature Lane, Ibadan',
      rating: 4.7,
      totalOrders: 423,
      numberOfStores: 1,
      status: 'Active',
      joinDate: '2023-04-03'
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Restaurant': 'bg-orange-100 text-orange-800',
      'Electronics': 'bg-blue-100 text-blue-800',
      'Grocery': 'bg-green-100 text-green-800',
      'Clothing': 'bg-purple-100 text-purple-800',
      'Books': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
            <p className="text-gray-600 mt-2">Manage your delivery partners and vendors</p>
          </div>
          <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                <p className="text-sm text-gray-600">{vendor.id}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vendor.status)}`}>
                {vendor.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(vendor.category)}`}>
                  {vendor.category}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{vendor.address}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{vendor.email}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span>{vendor.phone}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Store className="w-4 h-4 mr-2 text-gray-400" />
                <span>{vendor.numberOfStores} store{vendor.numberOfStores !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm font-medium text-gray-900">{vendor.rating}</span>
              </div>
              <div className="text-sm text-gray-600">
                {vendor.totalOrders} orders
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-500">
                Joined {new Date(vendor.joinDate).toLocaleDateString()}
              </span>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center">
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            Previous
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            1
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
            2
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default VendorManagement;