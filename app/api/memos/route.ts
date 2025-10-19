import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const book_id = searchParams.get('book_id')
    const user_id = searchParams.get('user_id')
    const limit = searchParams.get('limit') || '10'
    const offset = searchParams.get('offset') || '0'
    const visibility = searchParams.get('visibility')

    const supabase = createServerSupabaseClient()
    
    let query = supabase
      .from('memos')
      .select(
        `
        *,
        books (
          id,
          title,
          author
        )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })

    if (book_id) {
      query = query.eq('book_id', book_id)
    }

    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    if (visibility === 'public') {
      query = query.eq('is_public', true)
    } else if (visibility === 'private') {
      query = query.eq('is_public', false)
    }

    const { data, error, count } = await query
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      console.error('Error fetching memos:', error)
      return NextResponse.json({ error: 'Failed to fetch memos' }, { status: 500 })
    }

    return NextResponse.json({ memos: data, count })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { book_id, content, page_number, chapter, tags, is_public } = body

    if (!book_id || !content) {
      return NextResponse.json({ error: 'book_id and content are required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ownerId = user.id
    
    const publishFlag = typeof is_public === 'boolean' ? is_public : false

    const { data, error } = await supabase
      .from('memos')
      .insert([
        {
          book_id,
          user_id: ownerId,
          content,
          page_number,
          chapter,
          tags,
          is_public: publishFlag
        }
      ])
      .select(`
        *,
        books (
          id,
          title,
          author
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
