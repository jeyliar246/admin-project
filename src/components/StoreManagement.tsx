import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Trash2, MapPin, Clock, Package } from 'lucide-react';

const StoreManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const stores = [
    {
      id: 'STR001',
      name: 'Downtown Hub',
      address: '123 Main Street, Lagos Island',
      manager: 'Alice Johnson',
      phone: '+234 805 123 4567',
      status: 'Active',
      operatingHours: '9:00 AM - 9:00 PM',
      dailyOrders: 156,
      weeklyRevenue: '₦1,245,000',
      numberOfProducts: 1250,
      lastUpdate: '2024-01-15'
    },
    {
      id: 'STR002',
      name: 'Uptown Express',
      address: '456 Oak Avenue, Victoria Island',
      manager: 'Bob Smith',
      phone: '+234 806 234 5678',
      status: 'Active',
      operatingHours: '8:00 AM - 10:00 PM',
      dailyOrders: 203,
      weeklyRevenue: '₦1,892,000',
      numberOfProducts: 1850,
      lastUpdate: '2024-01-15'
    },
    {
      id: 'STR003',
      name: 'Westside Station',
      address: '789 Pine Road, Ikeja',
      manager: 'Carol Davis',
      phone: '+234 807 345 6789',
      status: 'Maintenance',
      operatingHours: 'Closed for maintenance',
      dailyOrders: 0,
      weeklyRevenue: '₦0',
      numberOfProducts: 980,
      lastUpdate: '2024-01-14'
    },
    {
      id: 'STR004',
      name: 'Eastside Depot',
      address: '321 Elm Street, Surulere',
      manager: 'David Wilson',
      phone: '+234 808 456 7890',
      status: 'Active',
      operatingHours: '7:00 AM - 11:00 PM',
      dailyOrders: 189,
      weeklyRevenue: '₦1,567,000',
      numberOfProducts: 1650,
      lastUpdate: '2024-01-15'
    },
    {
      id: 'STR005',
      name: 'Southgate Center',
      address: '654 Maple Boulevard, Lekki',
      manager: 'Emma Brown',
      phone: '+234 809 567 8901',
      status: 'Active',
      operatingHours: '10:00 AM - 8:00 PM',
      dailyOrders: 134,
      weeklyRevenue: '₦983,000',
      numberOfProducts: 890,
      lastUpdate: '2024-01-15'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
            <p className="text-gray-600 mt-2">Manage pickup locations and distribution centers</p>
          </div>
          <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Store
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{store.name}</div>
                      <div className="text-sm text-gray-500">{store.id}</div>
                      <div className="flex items-center mt-1 text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {store.operatingHours}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-900">{store.address}</div>
                        <div className="text-sm text-gray-500">{store.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{store.manager}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(store.status)}`}>
                      {store.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <Package className="w-4 h-4 mr-1 text-gray-400" />
                        {store.dailyOrders} daily orders
                      </div>
                      <div className="text-sm font-medium text-green-600">{store.weeklyRevenue}/week</div>
                      <div className="text-xs text-blue-600">{store.numberOfProducts} products</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Store Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Stores</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Daily Orders</p>
              <p className="text-2xl font-bold text-gray-900">682</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Weekly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₦5,687,000</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">6,620</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreManagement;