import { createAdminSupabaseClient } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

// ASIN抽出関数
function extractASIN(url: string): string | null {
  if (!url) return null
  
  // Amazon URLからASINを抽出
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,  // /dp/ASIN
    /\/product\/([A-Z0-9]{10})/i,  // /product/ASIN
    /\/gp\/product\/([A-Z0-9]{10})/i,  // /gp/product/ASIN
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }
  
  return null
}

// 短縮URLを解決してASINを取得
async function resolveShortUrl(shortUrl: string): Promise<string | null> {
  try {
    // GETリクエストを送信してリダイレクト先を取得
    const response = await fetch(shortUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    
    // リダイレクト先のURLからASINを抽出
    const finalUrl = response.url
    console.log(`Resolved ${shortUrl} to ${finalUrl}`)
    const asin = extractASIN(finalUrl)
    console.log(`Extracted ASIN: ${asin}`)
    return asin
  } catch (error) {
    console.error('Error resolving short URL:', shortUrl, error)
    return null
  }
}

// 書籍からASINを取得する関数（優先順位: paper -> ebook -> audiobook）
async function getBookASIN(book: any): Promise<string | null> {
  const urls = [
    book.amazon_paper_url,
    book.amazon_ebook_url,
    book.amazon_audiobook_url
  ]
  
  for (const url of urls) {
    if (!url) continue
    
    // 短縮URLかどうかをチェック
    const isShortUrl = url.includes('amzn.to') || url.includes('amzn.asia') || url.includes('a.co')
    
    if (isShortUrl) {
      // 短縮URLの場合、解決してASINを取得
      const asin = await resolveShortUrl(url)
      if (asin) return asin
    } else {
      // 通常のURLの場合、直接ASINを抽出
      const asin = extractASIN(url)
      if (asin) return asin
    }
  }
  
  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminSupabaseClient()
    
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching book:', error)
      return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // ASINを追加
    const asin = await getBookASIN(data)
    const bookWithAsin = {
      ...data,
      asin: asin || null
    }

    return NextResponse.json({ book: bookWithAsin })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
