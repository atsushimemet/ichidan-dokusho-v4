export interface Area {
  id: number
  name: string
  prefecture: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface CategoryTag {
  id: number
  name: string
  display_name: string
  is_active: boolean
  created_at: string
}

export interface Store {
  id: string
  name: string
  area_id: number
  x_link: string | null
  instagram_link: string | null
  website_link: string | null
  x_post_url: string | null
  google_map_link: string | null
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  // リレーション
  area?: Area
  category_tags?: CategoryTag[]
}

export interface StoreCategoryTag {
  id: number
  store_id: string
  category_tag_id: number
  created_at: string
}

export interface CreateStoreData {
  name: string
  area_id: number
  x_link?: string | null
  instagram_link?: string | null
  website_link?: string | null
  x_post_url?: string | null
  google_map_link?: string | null
  description?: string | null
  is_active?: boolean
  category_tag_ids?: number[]
}

