import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mgxyftlkbbutgzcujzde.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1neHlmdGxrYmJ1dGd6Y3VqemRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1ODM1NDYsImV4cCI6MjA2NTE1OTU0Nn0.X8xccM5MihHPxAiMOjps6SOLTitaP6tLuw3PquOFs2o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchTableData(tableName: string) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching table data:', error)
    return null
  }
}

export async function fetchTables() {
  try {
    const { data, error } = await supabase
      .rpc('get_tables')
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching tables:', error)
    return []
  }
}

export const clearAllData = async () => {
  try {
    // Clear data in reverse order of dependencies
    await supabase.from('payments').delete().neq('id', 0)
    await supabase.from('deliveries').delete().neq('id', 0)
    await supabase.from('vendors').delete().neq('id', 0)
    await supabase.from('users').delete().neq('id', 0)
    
    return { success: true, message: 'All data cleared successfully' }
  } catch (error) {
    console.error('Error clearing data:', error)
    return { success: false, message: 'Error clearing data', error }
  }
} 