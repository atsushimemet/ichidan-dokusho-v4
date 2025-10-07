import { createServerSupabaseStoresClient } from '@/lib/supabase-stores'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const supabase = createServerSupabaseStoresClient()
    
    const { data, error } = await supabase
      .from('stores')
      .select(`
        *,
        area:areas(*),
        category_tags:store_category_tags(
          category_tag:category_tags(*)
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching store:', error)
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const response = NextResponse.json({ store: data })
    
    // キャッシュを無効化
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
