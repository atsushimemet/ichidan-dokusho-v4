import { createServerSupabaseStoresClient } from '@/lib/supabase-stores'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseStoresClient()
    
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching areas:', error)
      return NextResponse.json({ error: 'Failed to fetch areas' }, { status: 500 })
    }

    return NextResponse.json({ areas: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

