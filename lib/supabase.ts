import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Vercelプレビュー環境でも正しく動作するよう、自動検出を有効化
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  })
}

// Admin client for server-side operations
export function createAdminClient() {
  return createBrowserClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
