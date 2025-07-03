import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Vendor {
  id: number
  name: string
}

interface BulkDeliveryItem {
  location: string
  description: string
  vendor_id: number
}

const BulkDelivery = () => {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(false)
  const [deliveryItems, setDeliveryItems] = useState<BulkDeliveryItem[]>([
    { location: '', description: '', vendor_id: 0 }
  ])
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, name')
        .eq('status', 'active')

      if (error) throw error
      setVendors(data || [])
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const handleAddDelivery = () => {
    setDeliveryItems([...deliveryItems, { location: '', description: '', vendor_id: 0 }])
  }

  const handleRemoveDelivery = (index: number) => {
    const newItems = deliveryItems.filter((_, i) => i !== index)
    setDeliveryItems(newItems)
  }

  const handleDeliveryChange = (index: number, field: keyof BulkDeliveryItem, value: string | number) => {
    const newItems = [...deliveryItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setDeliveryItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const deliveriesToCreate = deliveryItems.map(item => ({
        ...item,
        user_id: userData.user.id,
        status: 'pending'
      }))

      const { error } = await supabase
        .from('deliveries')
        .insert(deliveriesToCreate)

      if (error) throw error

      setMessage({ type: 'success', text: 'Bulk deliveries created successfully!' })
      setDeliveryItems([{ location: '', description: '', vendor_id: 0 }])
    } catch (error) {
      console.error('Error creating bulk deliveries:', error)
      setMessage({ type: 'error', text: 'Error creating bulk deliveries. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Bulk Delivery Creation</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {deliveryItems.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Delivery #{index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveDelivery(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vendor</label>
                <select
                  value={item.vendor_id}
                  onChange={(e) => handleDeliveryChange(index, 'vendor_id', Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value={0}>Select a vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={item.location}
                  onChange={(e) => handleDeliveryChange(index, 'location', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleDeliveryChange(index, 'description', e.target.value)}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleAddDelivery}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Another Delivery
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Bulk Deliveries'}
          </button>
        </div>
      </form>

      {message && (
        <div className={`mt-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  )
}

export default BulkDelivery 