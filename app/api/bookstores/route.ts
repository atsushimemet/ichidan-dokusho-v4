import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '10'
    const offset = searchParams.get('offset') || '0'
    const search = searchParams.get('search')

    const supabase = createServerSupabaseClient()
    
    let query = supabase
      .from('bookstores')
      .select('*')
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      console.error('Error fetching bookstores:', error)
      return NextResponse.json({ error: 'Failed to fetch bookstores' }, { status: 500 })
    }

    return NextResponse.json({ bookstores: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, description, website, phone, tags, latitude, longitude } = body

    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('bookstores')
      .insert([
        {
          name,
          address,
          description,
          website,
          phone,
          tags,
          latitude,
          longitude
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating bookstore:', error)
      return NextResponse.json({ error: 'Failed to create bookstore' }, { status: 500 })
    }

    return NextResponse.json({ bookstore: data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
