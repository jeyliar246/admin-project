import React, { useState } from 'react';
import { Search, Filter, Download, Eye, CreditCard, DollarSign, TrendingUp, RefreshCw, Package, ShoppingBag } from 'lucide-react';

const PaymentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Payments', count: 2847 },
    { id: 'completed', label: 'Completed', count: 2634 },
    { id: 'pending', label: 'Pending', count: 156 },
    { id: 'failed', label: 'Failed', count: 43 },
    { id: 'refunded', label: 'Refunded', count: 14 }
  ];

  const payments = [
    {
      id: 'PAY001',
      transactionId: 'TXN-2024-001',
      customer: 'John Doe',
      deliveryId: 'DEL001',
      amount: '₦4,599',
      method: 'Credit Card',
      status: 'Completed',
      date: '2024-01-15 14:32',
      processingFee: '₦184',
      paymentFor: 'Delivery',
      description: 'Instant delivery - FastFood Co.'
    },
    {
      id: 'PAY002',
      transactionId: 'TXN-2024-002',
      customer: 'Jane Smith',
      deliveryId: 'DEL002',
      amount: '₦15,675',
      method: 'Bank Transfer',
      status: 'Completed',
      date: '2024-01-15 13:45',
      processingFee: '₦470',
      paymentFor: 'Shopping',
      description: 'Electronics purchase - Electronics Plus'
    },
    {
      id: 'PAY003',
      transactionId: 'TXN-2024-003',
      customer: 'Mike Johnson',
      deliveryId: 'DEL003',
      amount: '₦78,950',
      method: 'Bank Transfer',
      status: 'Pending',
      date: '2024-01-15 12:15',
      processingFee: '₦790',
      paymentFor: 'Delivery',
      description: 'Interstate delivery - Supply Chain Pro'
    },
    {
      id: 'PAY004',
      transactionId: 'TXN-2024-004',
      customer: 'Sarah Wilson',
      deliveryId: 'DEL004',
      amount: '₦2,345',
      method: 'Credit Card',
      status: 'Failed',
      date: '2024-01-15 11:20',
      processingFee: '₦0',
      paymentFor: 'Shopping',
      description: 'Grocery items - Local Mart'
    },
    {
      id: 'PAY005',
      transactionId: 'TXN-2024-005',
      customer: 'David Brown',
      deliveryId: 'DEL005',
      amount: '₦6,789',
      method: 'Digital Wallet',
      status: 'Refunded',
      date: '2024-01-14 16:45',
      processingFee: '₦-204',
      paymentFor: 'Delivery',
      description: 'Same day delivery - Cancelled'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    const colors = {
      'Credit Card': 'bg-blue-100 text-blue-800',
      'PayPal': 'bg-orange-100 text-orange-800',
      'Bank Transfer': 'bg-green-100 text-green-800',
      'Digital Wallet': 'bg-purple-100 text-purple-800'
    };
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentTypeIcon = (paymentFor: string) => {
    return paymentFor === 'Delivery' ? (
      <Package className="w-4 h-4 text-blue-600" />
    ) : (
      <ShoppingBag className="w-4 h-4 text-green-600" />
    );
  };

  const getPaymentTypeColor = (paymentFor: string) => {
    return paymentFor === 'Delivery' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600 mt-2">Track transactions and financial data</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₦14,758,900</p>
              <p className="text-sm text-green-600">+12.5% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">2,847</p>
              <p className="text-sm text-blue-600">+8.2% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Order</p>
              <p className="text-2xl font-bold text-gray-900">₦5,184</p>
              <p className="text-sm text-purple-600">+5.7% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed Rate</p>
              <p className="text-2xl font-bold text-gray-900">1.5%</p>
              <p className="text-sm text-red-600">-0.3% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-500 bg-gray-200 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment For
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                      <div className="text-sm text-gray-500">Order: {payment.deliveryId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPaymentTypeColor(payment.paymentFor)}`}>
                        {getPaymentTypeIcon(payment.paymentFor)}
                        <span className="ml-1">{payment.paymentFor}</span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                      {payment.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.amount}</div>
                    <div className="text-xs text-gray-500">Fee: {payment.processingFee}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMethodColor(payment.method)}`}>
                      {payment.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;