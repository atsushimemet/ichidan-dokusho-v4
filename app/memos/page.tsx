'use client'

import { BookOpen, Calendar, ChevronLeft, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// メモデータ
const memoData = [
  {
    id: 1,
    bookTitle: '思考の整理学',
    bookAuthor: '外山滋比古',
    bookTags: ['思考法', '整理術', '創造性'],
    memoTitle: '思考の外化について',
    memoContent: '思考を整理するためには、頭の中の思考を一度外に出すことが重要だと学んだ。これは「思考の外化」と呼ばれる手法で、紙に書いたり、人に話したりすることで、客観的に自分の思考を見つめ直すことができる。特に創造的な発想が必要な時には、この手法が非常に効果的であることが分かった。実際に試してみると、頭の中だけで考えている時よりも、はるかに整理された思考ができるようになった。',
    createdAt: '2024年1月15日',
    recommender: '田中太郎'
  },
  {
    id: 2,
    bookTitle: 'アウトプット大全',
    bookAuthor: '樺沢紫苑',
    bookTags: ['学習法', 'アウトプット', '記憶'],
    memoTitle: '2週間に3回のアウトプット法則',
    memoContent: '学んだことを確実に身につけるためには、2週間に3回のアウトプットが必要だと学んだ。これは「2週間に3回のアウトプット法則」と呼ばれ、インプットした情報を定着させるための重要な手法である。具体的には、読書後にメモを取る、人に説明する、実際に行動に移すという3つのステップを繰り返すことで、記憶の定着率が大幅に向上する。実際にこの法則を実践してみると、以前よりもはるかに学んだ内容を覚えていることが分かった。',
    createdAt: '2024年1月10日',
    recommender: '佐藤花子'
  },
  {
    id: 3,
    bookTitle: 'デジタル時代の読書術',
    bookAuthor: '佐藤優',
    bookTags: ['読書術', 'デジタル', '情報処理'],
    memoTitle: '批判的思考力の重要性',
    memoContent: 'デジタル時代において最も重要なスキルは批判的思考力であると学んだ。情報が氾濫する現代では、すべての情報を鵜呑みにするのではなく、常に批判的な視点で情報を評価し、真偽を見極める能力が求められる。特にSNSやインターネット上の情報は、信頼性が低いものも多いため、複数の情報源を比較検討し、自分なりの判断を下すことが重要である。このスキルを身につけることで、より質の高い情報にアクセスできるようになった。',
    createdAt: '2024年1月8日',
    recommender: '山田次郎'
  },
  {
    id: 4,
    bookTitle: '習慣の力',
    bookAuthor: 'チャールズ・デュヒッグ',
    bookTags: ['習慣', '心理学', '行動科学'],
    memoTitle: '習慣の3つの要素',
    memoContent: '習慣は「きっかけ」「ルーチン」「報酬」の3つの要素で構成されていると学んだ。この「習慣のループ」を理解することで、悪い習慣を断ち切り、良い習慣を身につけることができる。きっかけは習慣を始めるトリガー、ルーチンは実際の行動、報酬は行動によって得られる満足感である。この3つの要素を意識的に設計することで、自分が望む習慣を効率的に身につけることができるようになった。実際に朝の読書習慣をこの理論に基づいて構築し、継続できている。',
    createdAt: '2024年1月5日',
    recommender: '鈴木一郎'
  },
  {
    id: 5,
    bookTitle: '深い学び',
    bookAuthor: 'ピーター・センゲ',
    bookTags: ['学習理論', '認知科学', '教育'],
    memoTitle: '学習する組織の5つの規律',
    memoContent: '学習する組織を構築するためには、5つの規律を実践することが重要だと学んだ。システム思考、自己マスタリー、メンタルモデル、共有ビジョン、チーム学習の5つである。特にシステム思考は、物事を全体的に捉える能力で、複雑な問題を解決する際に非常に有効である。自己マスタリーは個人の成長と学習への継続的な取り組みを意味し、メンタルモデルは固定観念を打破し、新しい視点で物事を見る能力である。これらの規律を実践することで、個人としても組織としても継続的に成長できるようになった。',
    createdAt: '2024年1月3日',
    recommender: '高橋美咲'
  }
]

export default function MemoListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  // 全メモからタグを抽出してユニークなタグリストを作成
  const allTags = Array.from(new Set(memoData.flatMap(memo => memo.bookTags)))

  const filteredMemos = memoData.filter(memo => {
    const matchesSearch = memo.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memo.memoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memo.memoContent.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTag = selectedTag === '' || memo.bookTags.includes(selectedTag)
    
    return matchesSearch && matchesTag
  })

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2663eb' }}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">一段読書</span>
                <p className="text-xs text-gray-500 -mt-1">Knowledge Loop Edition</p>
              </div>
            </div>
            
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>ホームに戻る</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              みんなのメモ一覧
            </h1>
            <p className="text-lg text-gray-600">
              他のユーザーの読書メモを確認できます
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="書籍名、メモタイトル、内容で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white"
            />
          </div>

          {/* Tag Slider */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700">タグで絞り込み:</h3>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag('')}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  すべて表示
                </button>
              )}
            </div>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTag === ''
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                すべて
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Memo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemos.map((memo) => (
              <div key={memo.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="flex flex-col h-full">
                  {/* Book Info */}
                  <div className="mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {memo.bookTitle}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{memo.bookAuthor}</p>
                        <div className="flex flex-wrap gap-1">
                          {memo.bookTags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Memo Content */}
                  <div className="flex-1 mb-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">
                      {memo.memoTitle}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {truncateText(memo.memoContent, 30)}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{memo.createdAt}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{memo.recommender}</span>
                      </div>
                    </div>
                    <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                      詳細を見る
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMemos.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">メモが見つかりませんでした</p>
              <p className="text-gray-400 text-sm">検索条件を変更してお試しください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
