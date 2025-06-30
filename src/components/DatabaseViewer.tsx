import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface TableData {
  [key: string]: any
}

const DatabaseViewer = () => {
  const [tables, setTables] = useState<string[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [tableData, setTableData] = useState<TableData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAvailableTables()
  }, [])

  useEffect(() => {
    if (selectedTable) {
      fetchTableContent(selectedTable)
    }
  }, [selectedTable])

  const fetchAvailableTables = async () => {
    try {
      // Fetch list of tables from public schema
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .not('table_name', 'like', 'pg_%')
        .not('table_name', 'like', '_prisma_%')

      if (error) throw error

      const tableNames = data.map(table => table.table_name)
      setTables(tableNames)
      if (tableNames.length > 0) {
        setSelectedTable(tableNames[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tables')
    } finally {
      setLoading(false)
    }
  }

  const fetchTableContent = async (tableName: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100)

      if (error) throw error
      setTableData(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch ${tableName} data`)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <label htmlFor="table-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Table
        </label>
        <select
          id="table-select"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : tableData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(tableData[0]).map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value: any, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-4">
          No data available in this table
        </div>
      )}
    </div>
  )
}

export default DatabaseViewer 