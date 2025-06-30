import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mgxyftlkbbutgzcujzde.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1neHlmdGxrYmJ1dGd6Y3VqemRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1ODM1NDYsImV4cCI6MjA2NTE1OTU0Nn0.X8xccM5MihHPxAiMOjps6SOLTitaP6tLuw3PquOFs2o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 