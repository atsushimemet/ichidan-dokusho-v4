import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_STORES!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STORES!

export const supabaseStores = createClient(supabaseUrl, supabaseAnonKey)

// サーバーサイド用（Service Role Key使用）
export const createServerSupabaseStoresClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY_STORES!
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
}
