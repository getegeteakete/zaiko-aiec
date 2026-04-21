import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mfbykrwdiwxtethzjpzw.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mYnlrcndkaXd4dGV0aHpqcHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDQwODksImV4cCI6MjA5MjI4MDA4OX0.Cds8zWVU_oIz3EhIza-9ltwIKqKywQ060695RDpL-Yk'

let supabase = null
try {
  supabase = createClient(supabaseUrl, supabaseKey)
} catch (e) {
  console.warn('Supabase initialization failed:', e)
}

export { supabase }
export const isSupabaseReady = () => !!supabase
