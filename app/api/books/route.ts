import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '10'
    const offset = searchParams.get('offset') || '0'
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const supabase = createServerSupabaseClient()
    
    let query = supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`)
    }

    const { data, error } = await query
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      console.error('Error fetching books:', error)
      return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
    }

    return NextResponse.json({ books: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      author, 
      description, 
      amazon_paper_url, 
      amazon_ebook_url, 
      amazon_audiobook_url, 
      summary_text_url, 
      summary_video_url, 
      recommended_by_post_url,
      tags,
      cover_image_url 
    } = body

    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          title,
          author,
          description,
          amazon_paper_url,
          amazon_ebook_url,
          amazon_audiobook_url,
          summary_text_url,
          summary_video_url,
          recommended_by_post_url,
          tags,
          cover_image_url
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating book:', error)
      return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
    }

    return NextResponse.json({ book: data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
