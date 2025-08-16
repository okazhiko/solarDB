import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 環境変数のチェック
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined')
}
if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// データ型の定義
export interface PowerPlant {
  id: number
  plant_name: string
  plant_address: string
  prefecture: string
  city: string
  owner: string
  dc_capacity: number
  ac_capacity: number
  operation_start_date: string
  category: string
  created_at: string
  updated_at: string
}

export interface CreatePowerPlantData {
  plant_name: string
  plant_address: string
  prefecture: string
  city: string
  owner: string
  dc_capacity: number
  ac_capacity: number
  operation_start_date: string
  category: string
}

export interface UpdatePowerPlantData {
  plant_name?: string
  plant_address?: string
  prefecture?: string
  city?: string
  owner?: string
  dc_capacity?: number
  ac_capacity?: number
  operation_start_date?: string
  category?: string
}
