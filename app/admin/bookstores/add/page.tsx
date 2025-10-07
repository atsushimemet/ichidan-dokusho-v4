'use client'

import Navigation from '@/components/Navigation'
import { useAreas } from '@/hooks/useAreas'
import { useCategoryTags } from '@/hooks/useCategoryTags'
import { ArrowLeft, MapPin, Save, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AddBookstorePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // データ取得
  const { areas, loading: areasLoading } = useAreas()
  const { categoryTags, loading: categoryTagsLoading } = useCategoryTags()

  // フォームデータ
  const [formData, setFormData] = useState({
    name: '',
    area_id: '',
    x_link: '',
    instagram_link: '',
    website_link: '',
    x_post_url: '',
    google_map_link: '',
    description: '',
    category_tag_ids: [] as number[]
  })

  // クライアントサイドでの初期化
  useEffect(() => {
    setIsClient(true)
    const adminLoginStatus = localStorage.getItem('adminLoggedIn')
    if (adminLoginStatus === 'true') {
      setIsLoggedIn(true)
    } else {
      window.location.href = '/admin/login'
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCategoryTagChange = (tagId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      category_tag_ids: checked 
        ? [...prev.category_tag_ids, tagId]
        : prev.category_tag_ids.filter(id => id !== tagId)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/bookstores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          area_id: parseInt(formData.area_id),
          x_link: formData.x_link || null,
          instagram_link: formData.instagram_link || null,
          website_link: formData.website_link || null,
          x_post_url: formData.x_post_url || null,
          google_map_link: formData.google_map_link || null,
          description: formData.description || null,
          category_tag_ids: formData.category_tag_ids
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('書店が正常に登録されました！')
        // フォームをリセット
        setFormData({
          name: '',
          area_id: '',
          x_link: '',
          instagram_link: '',
          website_link: '',
          x_post_url: '',
          google_map_link: '',
          description: '',
          category_tag_ids: []
        })
        // 3秒後にダッシュボードにリダイレクト
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 3000)
      } else {
        setError(data.error || '書店の登録に失敗しました')
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  // クライアントサイドでのレンダリングを待つ
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">読み込み中...</h2>
            </div>
          </div>
        </div>
      </div>
    )
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
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                新しい書店を登録
              </h1>
              <p className="text-gray-600">
                書店の詳細情報を入力してください
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  書店名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                  placeholder="書店名を入力"
                />
              </div>

              {/* Area */}
              <div>
                <label htmlFor="area_id" className="block text-sm font-medium text-gray-700 mb-2">
                  エリア <span className="text-red-500">*</span>
                </label>
                <select
                  id="area_id"
                  name="area_id"
                  value={formData.area_id}
                  onChange={handleInputChange}
                  required
                  disabled={areasLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                >
                  <option value="">エリアを選択してください</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name} ({area.prefecture})
                    </option>
                  ))}
                </select>
                {areasLoading && (
                  <p className="text-sm text-gray-500 mt-1">エリア情報を読み込み中...</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  説明
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                  placeholder="書店の説明を入力"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Website Link */}
                <div>
                  <label htmlFor="website_link" className="block text-sm font-medium text-gray-700 mb-2">
                    ウェブサイト
                  </label>
                  <input
                    type="url"
                    id="website_link"
                    name="website_link"
                    value={formData.website_link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Google Map Link */}
                <div>
                  <label htmlFor="google_map_link" className="block text-sm font-medium text-gray-700 mb-2">
                    Google Map
                  </label>
                  <input
                    type="url"
                    id="google_map_link"
                    name="google_map_link"
                    value={formData.google_map_link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* X Link */}
                <div>
                  <label htmlFor="x_link" className="block text-sm font-medium text-gray-700 mb-2">
                    X (旧Twitter)
                  </label>
                  <input
                    type="url"
                    id="x_link"
                    name="x_link"
                    value={formData.x_link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                    placeholder="https://x.com/..."
                  />
                </div>

                {/* Instagram Link */}
                <div>
                  <label htmlFor="instagram_link" className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    id="instagram_link"
                    name="instagram_link"
                    value={formData.instagram_link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>

              {/* X Post URL */}
              <div>
                <label htmlFor="x_post_url" className="block text-sm font-medium text-gray-700 mb-2">
                  X投稿URL
                </label>
                <input
                  type="url"
                  id="x_post_url"
                  name="x_post_url"
                  value={formData.x_post_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-text"
                  placeholder="https://x.com/username/status/..."
                />
              </div>

              {/* Category Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリタグ
                </label>
                <div className="space-y-2">
                  {categoryTagsLoading ? (
                    <p className="text-sm text-gray-500">カテゴリタグを読み込み中...</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {categoryTags.map((tag) => (
                        <label
                          key={tag.id}
                          className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.category_tag_ids.includes(tag.id)}
                            onChange={(e) => handleCategoryTagChange(tag.id, e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{tag.display_name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">該当するカテゴリタグを選択してください</p>
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
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>登録中...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>書店を登録</span>
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
