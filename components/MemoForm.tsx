'use client'

import { BookOpen, Save, Brain } from 'lucide-react'
import { useState } from 'react'

interface MemoData {
  bookId: string
  title: string
  keyPoints: string
  learnings: string
  actionItems: string
}

export default function MemoForm() {
  const [memo, setMemo] = useState<MemoData>({
    bookId: '',
    title: '',
    keyPoints: '',
    learnings: '',
    actionItems: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // ここで実際のAPI呼び出しを行う
    console.log('Memo submitted:', memo)
    
    // シミュレーション用の遅延
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    alert('メモが保存されました！クイズを生成しています...')
  }

  const handleInputChange = (field: keyof MemoData, value: string) => {
    setMemo(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">読書メモ作成</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 書籍選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            対象書籍
          </label>
          <select
            value={memo.bookId}
            onChange={(e) => handleInputChange('bookId', e.target.value)}
            className="input-field"
            required
          >
            <option value="">書籍を選択してください</option>
            <option value="1">思考の整理学 - 外山滋比古</option>
            <option value="2">アウトプット大全 - 樺沢紫苑</option>
            <option value="3">デジタル時代の読書術 - 佐藤優</option>
          </select>
        </div>

        {/* メモタイトル */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メモタイトル
          </label>
          <input
            type="text"
            value={memo.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="この読書で得た学びのタイトルを入力"
            className="input-field"
            required
          />
        </div>

        {/* 要点 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            要点・要約
          </label>
          <textarea
            value={memo.keyPoints}
            onChange={(e) => handleInputChange('keyPoints', e.target.value)}
            placeholder="本の要点や重要なポイントをまとめてください"
            rows={4}
            className="input-field"
            required
          />
        </div>

        {/* 学び・気づき */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            学び・気づき
          </label>
          <textarea
            value={memo.learnings}
            onChange={(e) => handleInputChange('learnings', e.target.value)}
            placeholder="この本から得た学びや気づきを記録してください"
            rows={4}
            className="input-field"
            required
          />
        </div>

        {/* 行動ToDo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            行動ToDo
          </label>
          <textarea
            value={memo.actionItems}
            onChange={(e) => handleInputChange('actionItems', e.target.value)}
            placeholder="学んだことを活かすための具体的な行動計画を立ててください"
            rows={3}
            className="input-field"
          />
        </div>

        {/* 保存ボタン */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setMemo({
              bookId: '',
              title: '',
              keyPoints: '',
              learnings: '',
              actionItems: ''
            })}
          >
            リセット
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>保存中...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>保存してクイズ生成</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ヒント */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">メモ作成のコツ</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 要点は3-5個に絞って簡潔にまとめる</li>
              <li>• 学びは自分の言葉で表現し、具体例を交える</li>
              <li>• 行動ToDoは実現可能で具体的なものにする</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}