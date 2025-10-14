import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
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
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching memo:', error)
      return NextResponse.json({ error: 'Failed to fetch memo' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Memo not found' }, { status: 404 })
    }

    return NextResponse.json({ memo: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { content, is_public, page_number, chapter, tags } = body

    const supabase = createServerSupabaseClient()
    
    const updateData: any = {}
    if (content !== undefined) updateData.content = content
    if (is_public !== undefined) updateData.is_public = is_public
    if (page_number !== undefined) updateData.page_number = page_number
    if (chapter !== undefined) updateData.chapter = chapter
    if (tags !== undefined) updateData.tags = tags

    const { data, error } = await supabase
      .from('memos')
      .update(updateData)
      .eq('id', params.id)
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
      console.error('Error updating memo:', error)
      return NextResponse.json({ error: 'Failed to update memo' }, { status: 500 })
    }

    return NextResponse.json({ memo: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    
    const { error } = await supabase
      .from('memos')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting memo:', error)
      return NextResponse.json({ error: 'Failed to delete memo' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
