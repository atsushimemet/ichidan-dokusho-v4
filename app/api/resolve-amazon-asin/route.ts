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
    // HEAD リクエストを送信してリダイレクト先を取得
    const response = await fetch(shortUrl, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    })
    
    // リダイレクト先のURLからASINを抽出
    const finalUrl = response.url
    return extractASIN(finalUrl)
  } catch (error) {
    console.error('Error resolving short URL:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')
  
  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    )
  }
  
  // 短縮URLかどうかをチェック
  const isShortUrl = url.includes('amzn.to') || url.includes('amzn.asia') || url.includes('a.co')
  
  let asin: string | null = null
  
  if (isShortUrl) {
    // 短縮URLの場合、解決してASINを取得
    asin = await resolveShortUrl(url)
  } else {
    // 通常のURLの場合、直接ASINを抽出
    asin = extractASIN(url)
  }
  
  if (!asin) {
    return NextResponse.json(
      { error: 'Could not extract ASIN from URL' },
      { status: 404 }
    )
  }
  
  return NextResponse.json({ asin })
}
