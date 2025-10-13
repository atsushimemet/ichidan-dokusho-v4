// 非アフィリエイトリンク変換のテスト

// ASIN抽出関数
function extractASINFromUrl(url) {
  if (!url) return null
  
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }
  
  return null
}

// 非アフィリエイトリンクを生成する関数
function generateNonAffiliateLink(url, asin) {
  if (!url) return null
  
  // ASINが取得できている場合は、それを使って非アフィリエイトリンクを生成
  if (asin) {
    return `https://www.amazon.co.jp/dp/${asin}`
  }
  
  // ASINが取得できていない場合は、URLから抽出を試みる
  const extractedAsin = extractASINFromUrl(url)
  if (extractedAsin) {
    return `https://www.amazon.co.jp/dp/${extractedAsin}`
  }
  
  // ASINが抽出できない場合は元のURLをそのまま返す
  return url
}

// テストケース
const testCases = [
  {
    name: 'amazon_paper_url - アフィリエイトリンク付き',
    url: 'https://www.amazon.co.jp/USJ%E3%81%AE%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88%E3%82%B3%E3%83%BC%E3%82%B9%E3%82%BF%E3%83%BC%E3%81%AF%E3%81%AA%E3%81%9C%E5%BE%8C%E3%82%8D%E5%90%91%E3%81%8D%E3%81%AB%E8%B5%B0%E3%81%A3%E3%81%9F%E3%81%AE%E3%81%8B-%E8%A7%92%E5%B7%9D%E6%96%87%E5%BA%AB-%E6%A3%AE%E5%B2%A1-%E6%AF%85/dp/4041041929/ref=tmm_pap_swatch_0',
    asin: '4041041929',
    expected: 'https://www.amazon.co.jp/dp/4041041929'
  },
  {
    name: 'amazon_ebook_url - 短縮URL（ASINあり）',
    url: 'https://amzn.to/3IAHxJN',
    asin: 'B09FDC3MVH',
    expected: 'https://www.amazon.co.jp/dp/B09FDC3MVH'
  },
  {
    name: 'amazon_ebook_url - 短縮URL（ASINなし、URLから抽出不可）',
    url: 'https://amzn.asia/d/7cTcwLq',
    asin: 'B08GJWJ5B2',
    expected: 'https://www.amazon.co.jp/dp/B08GJWJ5B2'
  },
  {
    name: 'amazon_audiobook_url - 通常のAmazonリンク',
    url: 'https://www.amazon.co.jp/%E6%80%9D%E8%80%83%E3%81%AE%E6%95%B4%E7%90%86%E5%AD%A6-%E3%81%A1%E3%81%8F%E3%81%BE%E6%96%87%E5%BA%AB-%E5%A4%96%E5%B1%B1-%E6%BB%8B%E6%AF%94%E5%8F%A4/dp/4480020470',
    asin: null,
    expected: 'https://www.amazon.co.jp/dp/4480020470'
  }
]

console.log('=== 非アフィリエイトリンク変換テスト ===\n')

let passed = 0
let failed = 0

testCases.forEach((testCase, index) => {
  const result = generateNonAffiliateLink(testCase.url, testCase.asin)
  const success = result === testCase.expected
  
  console.log(`テスト ${index + 1}: ${testCase.name}`)
  console.log(`  元のURL: ${testCase.url}`)
  console.log(`  ASIN: ${testCase.asin || 'null'}`)
  console.log(`  期待値: ${testCase.expected}`)
  console.log(`  結果: ${result}`)
  console.log(`  ✓ ${success ? '成功' : '失敗'}\n`)
  
  if (success) {
    passed++
  } else {
    failed++
  }
})

console.log(`=== テスト結果 ===`)
console.log(`成功: ${passed}/${testCases.length}`)
console.log(`失敗: ${failed}/${testCases.length}`)

process.exit(failed > 0 ? 1 : 0)

