import { createServerSupabaseStoresClient } from '@/lib/supabase-stores'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseStoresClient()
    
    const { data, error } = await supabase
      .from('category_tags')
      .select('*')
      .eq('is_active', true)
      .order('display_name', { ascending: true })

    if (error) {
      console.error('Error fetching category tags:', error)
      return NextResponse.json({ error: 'Failed to fetch category tags' }, { status: 500 })
    }

    return NextResponse.json({ categoryTags: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

