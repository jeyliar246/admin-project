import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, Filter, Plus, Eye, Edit, Trash2, Download } from 'lucide-react'

interface Delivery {
  id: number
  user_id: string
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled'
  location: string
  description: string
  completed_at: string | null
  created_at: string
  updated_at: string
  users?: {
    email: string
  }
}

interface InstantDelivery {
  id: bigint
  user_id: string
  vendor_id: number
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled'
  pickup_location: string
  delivery_location: string
  description: string | null
  estimated_time: string | null
  priority: 'normal' | 'high' | 'urgent'
  completed_at: string | null
  created_at: string
  updated_at: string
  vendor?: {
    name: string
    email: string
    phone: string
  }
  user?: {
    email: string
  }
}

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [instantDeliveries, setInstantDeliveries] = useState<InstantDelivery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const tabs = [
    { id: 'all', label: 'All Deliveries', count: 2847 },
    { id: 'instant', label: 'Instant', count: 456 },
    { id: 'same-day', label: 'Same Day', count: 678 },
    { id: 'interstate', label: 'Interstate', count: 234 },
    { id: 'username-city', label: 'Username City', count: 345 },
    { id: 'username-interstate', label: 'Username Interstate', count: 123 },
    { id: 'product-item', label: 'Product Item', count: 567 },
    { id: 'import-request', label: 'Import Request', count: 89 },
    { id: 'export-request', label: 'Export Request', count: 78 },
    { id: 'bulk', label: 'Bulk Delivery', count: 277 }
  ]

  useEffect(() => {
    if (activeTab === 'instant') {
      fetchInstantDeliveries()
    } else {
      fetchDeliveries()
    }
  }, [statusFilter, activeTab])

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('deliveries')
        .select(`
          *,
          users (
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setDeliveries(data || [])
    } catch (err) {
      console.error('Error fetching deliveries:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch deliveries')
    } finally {
      setLoading(false)
    }
  }

  const fetchInstantDeliveries = async () => {
    try {
      setLoading(true)
      
      // First fetch instant deliveries
      let query = supabase
        .from('instant_deliveries')
        .select('*')
        .order('created_at', { ascending: false })

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data: deliveriesData, error: deliveriesError } = await query

      if (deliveriesError) throw deliveriesError

      // Then fetch related vendors and users for the deliveries
      if (deliveriesData && deliveriesData.length > 0) {
        const vendorIds = [...new Set(deliveriesData.map(d => d.vendor_id))]
        const userIds = [...new Set(deliveriesData.map(d => d.user_id))]

        const [{ data: vendorsData }, { data: usersData }] = await Promise.all([
          supabase
            .from('vendors')
            .select('id, name, email, phone')
            .in('id', vendorIds),
          supabase
            .from('users')
            .select('id, email')
            .in('id', userIds)
        ])

        // Combine the data
        const enrichedDeliveries = deliveriesData.map(delivery => ({
          ...delivery,
          vendor: vendorsData?.find(v => v.id === delivery.vendor_id),
          user: usersData?.find(u => u.id === delivery.user_id)
        }))

        setInstantDeliveries(enrichedDeliveries)
      } else {
        setInstantDeliveries([])
      }
    } catch (err) {
      console.error('Error fetching instant deliveries:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch instant deliveries')
    } finally {
      setLoading(false)
    }
  }

  const updateDeliveryStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .update({ 
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', id)

      if (error) throw error
      
      // Refresh deliveries after update
      fetchDeliveries()
    } catch (err) {
      console.error('Error updating delivery:', err)
      setError(err instanceof Error ? err.message : 'Failed to update delivery')
    }
  }

  const updateInstantDeliveryStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('instant_deliveries')
        .update({ 
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', id)

      if (error) throw error
      
      fetchInstantDeliveries()
    } catch (err) {
      console.error('Error updating instant delivery:', err)
      setError(err instanceof Error ? err.message : 'Failed to update instant delivery')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'normal':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        Error: {error}
      </div>
    )
  }

  const renderInstantDeliveriesTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Delivery ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Pickup Location
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Delivery Location
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Vendor
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Customer
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Priority
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Created
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {instantDeliveries.map((delivery) => (
          <tr key={delivery.id} className="hover:bg-gray-50 transition-colors duration-200">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">#{delivery.id.toString()}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{delivery.pickup_location}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{delivery.delivery_location}</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">{delivery.description}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                <div>{delivery.vendor?.name}</div>
                <div className="text-xs text-gray-500">{delivery.vendor?.phone}</div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{delivery.user?.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(delivery.priority)}`}>
                {delivery.priority.charAt(0).toUpperCase() + delivery.priority.slice(1)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">
                {new Date(delivery.created_at).toLocaleDateString()}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delivery Management</h1>
            <p className="text-gray-600 mt-2">Manage and track all types of deliveries</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Plus className="w-4 h-4 mr-2" />
              New Delivery
            </button>
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
            placeholder="Search deliveries..."
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

      {/* Deliveries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'instant' ? renderInstantDeliveriesTable() : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{delivery.id}</div>
                        <div className="text-sm text-gray-500">{delivery.location}</div>
                        <div className="text-xs text-gray-400">{new Date(delivery.created_at).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{delivery.users?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">From: {delivery.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                        {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {/* Assuming amount is not available in the delivery data */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {/* Assuming driver is not available in the delivery data */}
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
          )}
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                <span className="font-medium">2847</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
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
        </div>
      </div>
    </div>
  )
}

export default DeliveryManagement