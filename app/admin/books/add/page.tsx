'use client'

import Navigation from '@/components/Navigation'
import { ArrowLeft, BookOpen, Save, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AddBookPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // 初期化時にログイン状態をチェック
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminLoggedIn') === 'true'
    }
    return false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // フォームデータ
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    amazon_paper_url: '',
    amazon_ebook_url: '',
    amazon_audiobook_url: '',
    summary_text_url: '',
    summary_video_url: '',
    recommended_by_post_url: '',
    tags: ''
  })

  // ログイン状態のチェック（初回のみ）
  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = '/admin/login'
    }
  }, [isLoggedIn])

  // ASIN抽出関数
  const extractASIN = (url: string): string | null => {
    if (!url) return null
    const match = url.match(/\/dp\/([A-Z0-9]{10})/)
    return match ? match[1] : null
  }

  // Amazon画像URL生成関数
  const generateAmazonImageUrl = (asin: string, size: 'THUMBZZZ' | 'TZZZZZZZ' | 'MZZZZZZZ' | 'LZZZZZZZ' = 'MZZZZZZZ'): string => {
    return `https://images-na.ssl-images-amazon.com/images/P/${asin}.09.${size}.jpg`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // 紙の本のURLからASINを抽出して画像URLを生成
      const paperASIN = extractASIN(formData.amazon_paper_url)
      const coverImageUrl = paperASIN ? generateAmazonImageUrl(paperASIN) : null

      // タグを配列に変換
      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []

      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          description: formData.description || null,
          amazon_paper_url: formData.amazon_paper_url || null,
          amazon_ebook_url: formData.amazon_ebook_url || null,
          amazon_audiobook_url: formData.amazon_audiobook_url || null,
          summary_text_url: formData.summary_text_url || null,
          summary_video_url: formData.summary_video_url || null,
          recommended_by_post_url: formData.recommended_by_post_url || null,
          tags: tagsArray,
          cover_image_url: coverImageUrl
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('書籍が正常に登録されました！')
        // フォームをリセット
        setFormData({
          title: '',
          author: '',
          description: '',
          amazon_paper_url: '',
          amazon_ebook_url: '',
          amazon_audiobook_url: '',
          summary_text_url: '',
          summary_video_url: '',
          recommended_by_post_url: '',
          tags: ''
        })
        // 3秒後にダッシュボードにリダイレクト
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 3000)
      } else {
        setError(data.error || '書籍の登録に失敗しました')
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h2>
              <Link
                href="/admin/login"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                ログインページへ
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>ダッシュボードに戻る</span>
            </Link>
          </div>

          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                新しい書籍を登録
              </h1>
              <p className="text-gray-600">
                書籍の詳細情報を入力してください
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                  placeholder="書籍のタイトルを入力"
                />
              </div>

              {/* Author */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  著者 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                  placeholder="著者名を入力"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  書籍の概要
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                  placeholder="書籍の概要を入力"
                />
              </div>

              {/* Amazon Links Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Amazonのリンク</h3>
                
                {/* Amazon Paper Book */}
                <div>
                  <label htmlFor="amazon_paper_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Amazonのリンク.紙の本 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="amazon_paper_url"
                    name="amazon_paper_url"
                    value={formData.amazon_paper_url}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                    placeholder="https://www.amazon.co.jp/dp/4041041929/"
                  />
                  <p className="text-sm text-gray-500 mt-1">紙の本のAmazon URLを入力してください（ASINから自動で画像を取得します）</p>
                </div>

                {/* Amazon Ebook */}
                <div>
                  <label htmlFor="amazon_ebook_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Amazonのリンク.電子書籍
                  </label>
                  <input
                    type="url"
                    id="amazon_ebook_url"
                    name="amazon_ebook_url"
                    value={formData.amazon_ebook_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                    placeholder="https://www.amazon.co.jp/dp/B08XXXXXXX/"
                  />
                </div>

                {/* Amazon Audiobook */}
                <div>
                  <label htmlFor="amazon_audiobook_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Amazonのリンク.オーディオブック
                  </label>
                  <input
                    type="url"
                    id="amazon_audiobook_url"
                    name="amazon_audiobook_url"
                    value={formData.amazon_audiobook_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                    placeholder="https://www.amazon.co.jp/dp/B08XXXXXXX/"
                  />
                </div>
              </div>

              {/* Summary Links Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">要約のリンク</h3>
                
                {/* Summary Text URL */}
                <div>
                  <label htmlFor="summary_text_url" className="block text-sm font-medium text-gray-700 mb-2">
                    要約のリンク.テキスト
                  </label>
                  <input
                    type="url"
                    id="summary_text_url"
                    name="summary_text_url"
                    value={formData.summary_text_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                    placeholder="https://note.com/username/n/xxxxx"
                  />
                  <p className="text-sm text-gray-500 mt-1">noteなどのテキスト要約のリンクを入力してください</p>
                </div>

                {/* Summary Video URL */}
                <div>
                  <label htmlFor="summary_video_url" className="block text-sm font-medium text-gray-700 mb-2">
                    要約のリンク.動画
                  </label>
                  <input
                    type="url"
                    id="summary_video_url"
                    name="summary_video_url"
                    value={formData.summary_video_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                    placeholder="https://www.youtube.com/watch?v=xxxxx"
                  />
                  <p className="text-sm text-gray-500 mt-1">YouTubeなどの動画要約のリンクを入力してください</p>
                </div>

                {/* Recommended By Post URL */}
                <div>
                  <label htmlFor="recommended_by_post_url" className="block text-sm font-medium text-gray-700 mb-2">
                    推薦者のポストURL
                  </label>
                  <input
                    type="url"
                    id="recommended_by_post_url"
                    name="recommended_by_post_url"
                    value={formData.recommended_by_post_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                    placeholder="https://twitter.com/username/status/xxxxx"
                  />
                  <p className="text-sm text-gray-500 mt-1">推薦者のSNSポストやブログ記事のURLを入力してください</p>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    タグ
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                    placeholder="思考法, 整理術, 創造性"
                  />
                  <p className="text-sm text-gray-500 mt-1">複数のタグはカンマ（,）で区切ってください</p>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <X className="w-5 h-5 text-red-600" />
                    <p className="text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <Save className="w-5 h-5 text-green-600" />
                    <p className="text-green-600">{success}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>登録中...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>書籍を登録</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
