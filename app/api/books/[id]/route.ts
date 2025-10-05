import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching book:', error)
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    return NextResponse.json({ book: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('books')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating book:', error)
      return NextResponse.json({ error: 'Failed to update book' }, { status: 500 })
    }

    return NextResponse.json({ book: data })
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
      .from('books')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting book:', error)
      return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
