import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const book_id = searchParams.get('book_id')
    const user_id = searchParams.get('user_id')
    const limit = searchParams.get('limit') || '10'
    const offset = searchParams.get('offset') || '0'

    const supabase = createServerSupabaseClient()
    
    let query = supabase
      .from('memos')
      .select(`
        *,
        books (
          id,
          title,
          author
        ),
        user_profiles (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (book_id) {
      query = query.eq('book_id', book_id)
    }

    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    const { data, error } = await query
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      console.error('Error fetching memos:', error)
      return NextResponse.json({ error: 'Failed to fetch memos' }, { status: 500 })
    }

    return NextResponse.json({ memos: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { book_id, user_id, content, is_public, page_number, chapter, tags } = body

    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('memos')
      .insert([
        {
          book_id,
          user_id,
          content,
          is_public: is_public ?? false,
          page_number,
          chapter,
          tags
        }
      ])
      .select(`
        *,
        books (
          id,
          title,
          author
        ),
        user_profiles (
          id,
          name
        )
      `)
      .single()

    if (error) {
      console.error('Error creating memo:', error)
      return NextResponse.json({ error: 'Failed to create memo' }, { status: 500 })
    }

    return NextResponse.json({ memo: data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
