import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// データ型の定義
export interface Task {
  id: number
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  created_at: string
  updated_at: string
}

export interface CreateTaskData {
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: 'pending' | 'in_progress' | 'completed'
}
