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

    console.log('Creating book with data:', { title, author, description })

    const supabase = createServerSupabaseClient()
    
    // まず、基本的なフィールドのみで挿入を試行（既存のスキーマに合わせる）
    const insertData: any = {
      title,
      author,
      description: description || null
    }

    // 新しいフィールドが存在する場合のみ追加（データベースにカラムが存在する場合のみ）
    // 注意: これらのカラムはデータベースマイグレーション後に有効になります
    // if (amazon_paper_url) insertData.amazon_paper_url = amazon_paper_url
    // if (amazon_ebook_url) insertData.amazon_ebook_url = amazon_ebook_url
    // if (amazon_audiobook_url) insertData.amazon_audiobook_url = amazon_audiobook_url
    // if (summary_text_url) insertData.summary_text_url = summary_text_url
    // if (summary_video_url) insertData.summary_video_url = summary_video_url
    // if (recommended_by_post_url) insertData.recommended_by_post_url = recommended_by_post_url
    // if (tags && Array.isArray(tags)) insertData.tags = tags
    // if (cover_image_url) insertData.cover_image_url = cover_image_url

    console.log('Insert data:', insertData)
    
    const { data, error } = await supabase
      .from('books')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Error creating book:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: 'Failed to create book', 
        details: error.message,
        code: error.code 
      }, { status: 500 })
    }

    return NextResponse.json({ book: data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
