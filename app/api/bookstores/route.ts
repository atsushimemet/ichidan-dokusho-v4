import { createServerSupabaseStoresClient } from '@/lib/supabase-stores'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '10'
    const offset = searchParams.get('offset') || '0'
    const search = searchParams.get('search')

    const supabase = createServerSupabaseStoresClient()
    
    let query = supabase
      .from('stores')
      .select(`
        *,
        area:areas(*),
        category_tags:store_category_tags(
          category_tag:category_tags(*)
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) {
      console.error('Error fetching stores:', error)
      return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
    }

    return NextResponse.json({ stores: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      area_id, 
      x_link, 
      instagram_link, 
      website_link, 
      x_post_url, 
      google_map_link, 
      description, 
      is_active = true,
      category_tag_ids = []
    } = body

    const supabase = createServerSupabaseStoresClient()
    
    // まず店舗を作成
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .insert([
        {
          name,
          area_id,
          x_link,
          instagram_link,
          website_link,
          x_post_url,
          google_map_link,
          description,
          is_active
        }
      ])
      .select()
      .single()

    if (storeError) {
      console.error('Error creating store:', storeError)
      return NextResponse.json({ error: 'Failed to create store' }, { status: 500 })
    }

    // カテゴリタグがある場合は関連付けを作成
    if (category_tag_ids.length > 0) {
      const storeCategoryTags = category_tag_ids.map((tagId: number) => ({
        store_id: storeData.id,
        category_tag_id: tagId
      }))

      const { error: tagError } = await supabase
        .from('store_category_tags')
        .insert(storeCategoryTags)

      if (tagError) {
        console.error('Error creating store category tags:', tagError)
        // 店舗は作成されているので、エラーをログに記録するが処理は続行
      }
    }

    return NextResponse.json({ store: storeData }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
