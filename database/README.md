# データベースセットアップ

このプロジェクトではSupabaseを使用してデータベースを管理しています。

## セットアップ手順

### 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトのURLとAPIキーを取得

### 2. 環境変数の設定

`.env.local`ファイルに以下の環境変数を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. データベーススキーマの適用

SupabaseのSQL Editorで以下のファイルを実行：

1. `schema.sql` - テーブルとインデックスの作成
2. `sample_data.sql` - サンプルデータの挿入

### 4. Row Level Security (RLS) の確認

スキーマファイルには既にRLSポリシーが含まれていますが、必要に応じて調整してください。

## テーブル構成

- `books` - 書籍情報
- `bookstores` - 書店情報
- `memos` - 読書メモ
- `quizzes` - クイズ
- `user_progress` - ユーザーの読書進捗
- `quiz_attempts` - クイズの回答履歴
- `user_profiles` - ユーザープロファイル

## API エンドポイント

- `GET /api/books` - 書籍一覧取得
- `GET /api/books/[id]` - 個別書籍取得
- `POST /api/books` - 書籍作成
- `GET /api/bookstores` - 書店一覧取得
- `GET /api/memos` - メモ一覧取得
- `POST /api/memos` - メモ作成
