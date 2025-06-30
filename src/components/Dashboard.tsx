import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Truck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import DatabaseViewer from './DatabaseViewer';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Deliveries',
      value: '2,847',
      change: '+12.5%',
      changeType: 'increase',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+8.2%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-emerald-500'
    },
    {
      title: 'Revenue',
      value: '₦4,567,800',
      change: '+15.3%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Orders',
      value: '89',
      change: '-5.4%',
      changeType: 'decrease',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  const recentDeliveries = [
    { id: 'DEL001', type: 'Instant', status: 'Delivered', customer: 'John Doe', amount: '₦4,599' },
    { id: 'DEL002', type: 'Same Day', status: 'In Transit', customer: 'Jane Smith', amount: '₦3,250' },
    { id: 'DEL003', type: 'Interstate', status: 'Pending', customer: 'Mike Johnson', amount: '₦8,725' },
    { id: 'DEL004', type: 'Bulk', status: 'Delivered', customer: 'Sarah Wilson', amount: '₦15,680' },
    { id: 'DEL005', type: 'Username City', status: 'In Transit', customer: 'David Brown', amount: '₦2,375' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="pb-5 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Welcome back, {user?.email}
              </h3>
            </div>

            {/* Database Tables Section */}
            <div className="mt-8">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Database Tables
              </h2>
              <div className="bg-white shadow rounded-lg">
                <DatabaseViewer />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Stats Cards */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                        📦
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Deliveries
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          248
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                        💰
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Revenue
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          $12,457
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                        👥
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Active Users
                        </dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          1,257
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Activity
              </h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <li key={item}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            Delivery #{item}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Completed
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              📍 New York, NY
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              Completed {item} hour{item !== 1 ? 's' : ''} ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;