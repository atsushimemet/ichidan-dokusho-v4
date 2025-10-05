'use client'

import { BookOpen, ExternalLink, Plus } from 'lucide-react'
import { useState } from 'react'

interface Book {
  id: string
  title: string
  author: string
  description: string
  amazonLink: string
  postUrl?: string
  coverImage?: string
}

// サンプルデータ
const sampleBooks: Book[] = [
  {
    id: '1',
    title: '思考の整理学',
    author: '外山滋比古',
    description: '思考を整理し、創造的な発想を生み出すための方法論を説いた名著。',
    amazonLink: 'https://amazon.co.jp/dp/4480020470',
    postUrl: 'https://example.com/post1',
  },
  {
    id: '2',
    title: 'アウトプット大全',
    author: '樺沢紫苑',
    description: '学んだことを確実に身につけるためのアウトプット術を解説。',
    amazonLink: 'https://amazon.co.jp/dp/4046047622',
    postUrl: 'https://example.com/post2',
  },
  {
    id: '3',
    title: 'デジタル時代の読書術',
    author: '佐藤優',
    description: 'デジタル時代における効果的な読書方法と知識の活用法。',
    amazonLink: 'https://amazon.co.jp/dp/4040820000',
  },
]

export default function BookList() {
  const [books] = useState<Book[]>(sampleBooks)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">書籍一覧</h2>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>書籍を追加</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="書籍名や著者名で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {book.description}
                </p>
                <div className="flex space-x-2">
                  <button className="btn-primary text-sm py-1 px-3">
                    メモを作成
                  </button>
                  <a
                    href={book.amazonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm py-1 px-3 flex items-center space-x-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Amazon</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">書籍が見つかりませんでした</p>
          <p className="text-gray-400 text-sm">検索条件を変更してお試しください</p>
        </div>
      )}
    </div>
  )
}