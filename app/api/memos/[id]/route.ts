import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

interface RouteContext {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const supabase = createServerSupabaseClient()
    const { id } = params

    const { data, error } = await supabase
      .from('memos')
      .select(
        `
          *,
          books (
            id,
            title,
            author
          )
        `
      )
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching memo detail:', error)
      return NextResponse.json({ error: 'Failed to fetch memo' }, { status: 500 })
    }

    return NextResponse.json({ memo: data })
  } catch (error) {
    console.error('Unexpected error fetching memo detail:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const body = await request.json()
    const { content, is_public } = body

    if (!content) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const publishFlag = typeof is_public === 'boolean' ? is_public : false

    const { data, error } = await supabase
      .from('memos')
      .update({
        content,
        is_public: publishFlag
      })
      .eq('id', params.id)
      .select(
        `
          *,
          books (
            id,
            title,
            author
          )
        `
      )
      .single()

    if (error) {
      console.error('Error updating memo:', error)
      return NextResponse.json({ error: 'Failed to update memo' }, { status: 500 })
    }

    return NextResponse.json({ memo: data })
  } catch (error) {
    console.error('Unexpected error updating memo:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('memos')
      .delete()
      .eq('id', params.id)
      .select('id')
      .single()

    if (error) {
      console.error('Error deleting memo:', error)
      return NextResponse.json({ error: 'Failed to delete memo' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Memo not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting memo:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
