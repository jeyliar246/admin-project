import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { clearAllData } from '../lib/supabaseClient'
import Sidebar from './Sidebar'
import DatabaseViewer from './DatabaseViewer'

interface DashboardStats {
  totalDeliveries: number
  totalRevenue: number
  activeUsers: number
}

interface DeliveryActivity {
  id: number
  status: string
  location: string
  completed_at: string
}

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalDeliveries: 0,
    totalRevenue: 0,
    activeUsers: 0
  })
  const [recentDeliveries, setRecentDeliveries] = useState<DeliveryActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch total deliveries
      const { data: deliveriesData, error: deliveriesError } = await supabase
        .from('deliveries')
        .select('count')
        .single()

      if (deliveriesError) throw deliveriesError

      // Fetch total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('payments')
        .select('amount')

      if (revenueError) throw revenueError

      // Fetch active users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('count')
        .eq('status', 'active')
        .single()

      if (usersError) throw usersError

      // Fetch recent deliveries
      const { data: recentDeliveriesData, error: recentDeliveriesError } = await supabase
        .from('deliveries')
        .select('id, status, location, completed_at')
        .order('completed_at', { ascending: false })
        .limit(5)

      if (recentDeliveriesError) throw recentDeliveriesError

      // Calculate total revenue
      const totalRevenue = revenueData.reduce((sum: number, payment: any) => sum + payment.amount, 0)

      setStats({
        totalDeliveries: deliveriesData?.count || 0,
        totalRevenue: totalRevenue || 0,
        activeUsers: usersData?.count || 0
      })

      setRecentDeliveries(recentDeliveriesData || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setResetting(true)
      try {
        const result = await clearAllData()
        if (result.success) {
          alert('All data has been cleared successfully')
          fetchDashboardData() // Refresh the dashboard data
        } else {
          alert('Error clearing data: ' + result.message)
        }
      } catch (error) {
        console.error('Error during reset:', error)
        alert('An unexpected error occurred during reset')
      } finally {
        setResetting(false)
      }
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="pb-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Welcome back, {user?.email}
              </h3>
              <button
                onClick={handleReset}
                disabled={resetting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {resetting ? 'Clearing Data...' : 'Clear All Data'}
              </button>
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

            {loading ? (
              <div className="mt-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
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
                              {stats.totalDeliveries}
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
                              ${stats.totalRevenue.toLocaleString()}
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
                              {stats.activeUsers}
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
                      {recentDeliveries.map((delivery) => (
                        <li key={delivery.id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                Delivery #{delivery.id}
                              </p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  delivery.status === 'completed' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  📍 {delivery.location}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p>
                                  {new Date(delivery.completed_at).toLocaleDateString()} at{' '}
                                  {new Date(delivery.completed_at).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard