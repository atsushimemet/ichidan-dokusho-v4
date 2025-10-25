# 一段読書 - Knowledge Loop Edition 仕様書

## 概要
一段読書は、読書内容の記録 → 理解 → 復習が循環するKnowledge Loopを実現する読書体験アプリケーションです。読書メモの作成、共有、復習機能を通じて、学びの定着を促進します。

## システム構成

### 技術スタック
- **フロントエンド**: Next.js 15 (App Router)
- **認証**: Clerk
- **データベース**: Supabase (2つのインスタンス)
  - メインデータベース: 書籍、メモ、ユーザー情報
  - 店舗データベース: 店舗情報、エリア、カテゴリタグ
- **スタイリング**: Tailwind CSS
- **デプロイ**: Vercel

### アーキテクチャ
```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Clerk Auth    │
│   (Next.js)     │◄──►│   (認証)        │
└─────────────────┘    └─────────────────┘
         │
         ├─────────────────┐
         ▼                 ▼
┌─────────────────┐    ┌─────────────────┐
│   Supabase      │    │   Supabase      │
│   (メインDB)     │    │   (店舗DB)       │
│   - 書籍        │    │   - 店舗        │
│   - メモ        │    │   - エリア      │
│   - ユーザー    │    │   - カテゴリ    │
└─────────────────┘    └─────────────────┘
```

## 機能仕様

### 1. 認証機能
- **認証プロバイダー**: Clerk
- **認証方式**: メールアドレス + パスワード
- **セッション管理**: Clerkのセッション管理機能を使用
- **認証状態**: 全ページで認証状態を確認可能

### 2. ホーム画面
- **おすすめ書籍スライダー**: 最新10件の書籍を表示
- **おすすめ店舗スライダー**: 最新10件の店舗を表示
- **書籍画像**: Amazon ASINから自動生成
- **ナビゲーション**: レスポンシブ対応

### 3. 書籍機能
- **書籍一覧**: 全書籍の検索・フィルタリング
- **書籍詳細**: 書籍情報、関連メモの表示
- **書籍検索**: タイトル、著者名での検索
- **カテゴリフィルタ**: カテゴリタグによる絞り込み

### 4. メモ機能
- **メモ作成**: 書籍に対するメモの作成
- **メモ編集**: 既存メモの編集
- **メモ削除**: メモの削除
- **メモ共有**: 公開/非公開の設定
- **ChatGPT連携**: メモの整形・改善

### 5. 店舗機能
- **店舗一覧**: 全店舗の表示
- **店舗詳細**: 店舗情報、エリア、カテゴリタグ
- **店舗検索**: 店舗名、説明での検索
- **エリアフィルタ**: エリアによる絞り込み

### 6. ナビゲーション機能
- **ルート復元**: 認証後の元のページへの復帰
- **ブラウザ履歴**: 戻るボタンの正常動作
- **レスポンシブ**: モバイル・デスクトップ対応

## データベース設計

### メインデータベース (NEXT_PUBLIC_SUPABASE_URL)

#### books テーブル
```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT,
  amazon_paper_url TEXT,
  amazon_ebook_url TEXT,
  amazon_audiobook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### memos テーブル
```sql
CREATE TABLE memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- Clerk User ID
  content TEXT NOT NULL,
  page_number INTEGER,
  chapter TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### category_tags テーブル
```sql
CREATE TABLE category_tags (
  id SERIAL PRIMARY KEY,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### book_category_tags テーブル
```sql
CREATE TABLE book_category_tags (
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  category_tag_id INTEGER REFERENCES category_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, category_tag_id)
);
```

### 店舗データベース (NEXT_PUBLIC_SUPABASE_URL_STORES)

#### stores テーブル
```sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  area_id INTEGER REFERENCES areas(id),
  x_link TEXT,
  instagram_link TEXT,
  website_link TEXT,
  x_post_url TEXT,
  google_map_link TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### areas テーブル
```sql
CREATE TABLE areas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### store_category_tags テーブル
```sql
CREATE TABLE store_category_tags (
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  category_tag_id INTEGER REFERENCES category_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (store_id, category_tag_id)
);
```

## API仕様

### 認証が必要なエンドポイント

#### POST /api/memos
**説明**: 新しいメモを作成
**認証**: Clerk認証必須
**リクエストボディ**:
```typescript
{
  book_id: string;
  content: string;
  page_number?: number;
  chapter?: string;
  tags?: string[];
  is_public?: boolean;
}
```
**レスポンス**:
```typescript
// 成功 (201)
{
  memo: {
    id: string;
    book_id: string;
    user_id: string;
    content: string;
    page_number?: number;
    chapter?: string;
    tags?: string[];
    is_public: boolean;
    created_at: string;
    books: {
      id: string;
      title: string;
      author: string;
    }
  }
}

// エラー (401, 400, 500)
{
  error: string;
}
```

#### PUT /api/memos/[id]
**説明**: 既存のメモを更新
**認証**: Clerk認証必須 + 所有権チェック
**リクエストボディ**:
```typescript
{
  content: string;
  page_number?: number;
  chapter?: string;
  tags?: string[];
  is_public?: boolean;
}
```
**レスポンス**:
```typescript
// 成功 (200)
{
  memo: {
    id: string;
    book_id: string;
    user_id: string;
    content: string;
    page_number?: number;
    chapter?: string;
    tags?: string[];
    is_public: boolean;
    updated_at: string;
    books: {
      id: string;
      title: string;
      author: string;
    }
  }
}

// エラー (401, 403, 404, 500)
{
  error: string;
}
```

#### DELETE /api/memos/[id]
**説明**: メモを削除
**認証**: Clerk認証必須 + 所有権チェック
**レスポンス**:
```typescript
// 成功 (200)
{
  message: "Memo deleted successfully";
}

// エラー (401, 403, 404, 500)
{
  error: string;
}
```

### 認証が不要なエンドポイント

#### GET /api/books
**説明**: 書籍一覧を取得
**クエリパラメータ**:
- `limit` (optional): 取得件数 (デフォルト: 10)
- `offset` (optional): オフセット (デフォルト: 0)
- `category` (optional): カテゴリフィルタ
- `search` (optional): 検索キーワード

**レスポンス**:
```typescript
// 成功 (200)
{
  books: Array<{
    id: string;
    title: string;
    author: string;
    isbn?: string;
    amazon_paper_url?: string;
    amazon_ebook_url?: string;
    amazon_audiobook_url?: string;
    asin?: string; // Amazon画像用
    created_at: string;
    updated_at: string;
  }>;
}

// エラー (500)
{
  error: string;
}
```

#### GET /api/books/[id]
**説明**: 特定の書籍詳細を取得
**パスパラメータ**:
- `id`: 書籍ID

**レスポンス**:
```typescript
// 成功 (200)
{
  book: {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    amazon_paper_url?: string;
    amazon_ebook_url?: string;
    amazon_audiobook_url?: string;
    asin?: string;
    created_at: string;
    updated_at: string;
  };
}

// エラー (404, 500)
{
  error: string;
}
```

#### GET /api/bookstores
**説明**: 店舗一覧を取得
**クエリパラメータ**:
- `limit` (optional): 取得件数 (デフォルト: 10)
- `offset` (optional): オフセット (デフォルト: 0)
- `search` (optional): 検索キーワード

**レスポンス**:
```typescript
// 成功 (200)
{
  stores: Array<{
    id: string;
    name: string;
    area_id: number;
    x_link?: string;
    instagram_link?: string;
    website_link?: string;
    x_post_url?: string;
    google_map_link?: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    area: {
      id: number;
      name: string;
    };
    category_tags: Array<{
      category_tag: {
        id: number;
        display_name: string;
      };
    }>;
  }>;
}

// エラー (500)
{
  error: string;
}
```

#### GET /api/memos
**説明**: メモ一覧を取得
**クエリパラメータ**:
- `book_id` (optional): 特定の書籍のメモのみ取得

**レスポンス**:
```typescript
// 成功 (200)
{
  memos: Array<{
    id: string;
    book_id: string;
    user_id: string;
    content: string;
    page_number?: number;
    chapter?: string;
    tags?: string[];
    is_public: boolean;
    created_at: string;
    updated_at: string;
    books: {
      id: string;
      title: string;
      author: string;
    };
  }>;
}

// エラー (500)
{
  error: string;
}
```

#### POST /api/bookstores
**説明**: 新しい店舗を作成
**認証**: 管理者認証必須
**リクエストボディ**:
```typescript
{
  name: string;
  area_id: number;
  x_link?: string;
  instagram_link?: string;
  website_link?: string;
  x_post_url?: string;
  google_map_link?: string;
  description?: string;
  is_active?: boolean;
  category_tag_ids?: number[];
}
```
**レスポンス**:
```typescript
// 成功 (201)
{
  store: {
    id: string;
    name: string;
    area_id: number;
    x_link?: string;
    instagram_link?: string;
    website_link?: string;
    x_post_url?: string;
    google_map_link?: string;
    description?: string;
    is_active: boolean;
    created_at: string;
  };
}

// エラー (400, 500)
{
  error: string;
}
```

### 共通レスポンス形式

#### 成功レスポンス
```typescript
// 単一リソース
{
  "book": { ... },
  "memo": { ... },
  "store": { ... }
}

// 複数リソース
{
  "books": [...],
  "memos": [...],
  "stores": [...]
}
```

#### エラーレスポンス
```typescript
{
  "error": "エラーメッセージ"
}
```

#### HTTPステータスコード
- `200`: 成功
- `201`: 作成成功
- `400`: リクエストエラー
- `401`: 認証エラー
- `403`: 権限エラー
- `404`: リソースが見つからない
- `500`: サーバーエラー

### 認証ヘッダー
認証が必要なエンドポイントでは、Clerkの認証トークンが自動的に処理されます。

### レート制限
現在、レート制限は実装されていませんが、今後の拡張で追加予定です。

### エラーハンドリング
- 全てのAPIエンドポイントで統一されたエラーレスポンス形式
- 詳細なエラーログの記録
- クライアントサイドでの適切なエラー表示

## 画面・ユースケース別API呼び出し

### ホーム画面
**目的**: おすすめ書籍と店舗の表示
**呼び出しAPI**:
- `GET /api/books?limit=10` - おすすめ書籍10件取得
- `GET /api/bookstores?limit=10` - おすすめ店舗10件取得

**データフロー**:
```
ホーム画面 → 書籍API → 書籍データ + ASIN画像URL
ホーム画面 → 店舗API → 店舗データ + エリア・カテゴリ情報
```

### 書籍一覧画面
**目的**: 全書籍の検索・フィルタリング
**呼び出しAPI**:
- `GET /api/books?limit=1000&search={keyword}&category={category}` - 書籍検索・フィルタ

**データフロー**:
```
書籍一覧画面 → 書籍API → 検索結果 + フィルタ適用
```

### 書籍詳細画面
**目的**: 特定書籍の詳細情報と関連メモの表示
**呼び出しAPI**:
- `GET /api/books/{id}` - 書籍詳細取得
- `GET /api/memos?book_id={id}` - 書籍関連メモ取得

**データフロー**:
```
書籍詳細画面 → 書籍API → 書籍詳細情報
書籍詳細画面 → メモAPI → 関連メモ一覧
```

### メモ作成画面
**目的**: 新しいメモの作成
**呼び出しAPI**:
- `POST /api/memos` - メモ作成（認証必須）

**リクエストデータ**:
```typescript
{
  book_id: string;
  content: string;
  page_number?: number;
  chapter?: string;
  tags?: string[];
  is_public: boolean;
}
```

**データフロー**:
```
メモ作成画面 → メモAPI → メモ作成 → 書籍詳細画面へリダイレクト
```

### メモ編集画面
**目的**: 既存メモの編集
**呼び出しAPI**:
- `PUT /api/memos/{id}` - メモ更新（認証必須 + 所有権チェック）

**リクエストデータ**:
```typescript
{
  content: string;
  page_number?: number;
  chapter?: string;
  tags?: string[];
  is_public: boolean;
}
```

**データフロー**:
```
メモ編集画面 → メモAPI → メモ更新 → 書籍詳細画面へリダイレクト
```

### メモ削除機能
**目的**: メモの削除
**呼び出しAPI**:
- `DELETE /api/memos/{id}` - メモ削除（認証必須 + 所有権チェック）

**データフロー**:
```
メモカード → メモAPI → メモ削除 → 画面更新
```

### 店舗一覧画面
**目的**: 全店舗の検索・フィルタリング
**呼び出しAPI**:
- `GET /api/bookstores?limit=1000&search={keyword}` - 店舗検索

**データフロー**:
```
店舗一覧画面 → 店舗API → 検索結果 + エリア・カテゴリ情報
```

### 店舗詳細画面
**目的**: 特定店舗の詳細情報表示
**呼び出しAPI**:
- `GET /api/bookstores/{id}` - 店舗詳細取得（実装予定）

**データフロー**:
```
店舗詳細画面 → 店舗API → 店舗詳細情報 + エリア・カテゴリ情報
```

### 管理者画面（店舗登録）
**目的**: 新しい店舗の登録
**呼び出しAPI**:
- `POST /api/bookstores` - 店舗作成（管理者認証必須）

**リクエストデータ**:
```typescript
{
  name: string;
  area_id: number;
  x_link?: string;
  instagram_link?: string;
  website_link?: string;
  x_post_url?: string;
  google_map_link?: string;
  description?: string;
  is_active?: boolean;
  category_tag_ids?: number[];
}
```

**データフロー**:
```
管理者画面 → 店舗API → 店舗作成 → 店舗一覧画面へリダイレクト
```

### 認証フロー
**目的**: ユーザー認証とセッション管理
**認証プロバイダー**: Clerk
**認証が必要な画面**:
- メモ作成画面
- メモ編集画面
- メモ削除機能
- 管理者画面

**認証が不要な画面**:
- ホーム画面
- 書籍一覧画面
- 書籍詳細画面
- 店舗一覧画面
- 店舗詳細画面

### エラーハンドリング（画面別）
**認証エラー (401)**:
- ログイン画面へのリダイレクト
- 適切なエラーメッセージの表示

**権限エラー (403)**:
- アクセス拒否メッセージの表示
- 適切な画面へのリダイレクト

**データ取得エラー (404, 500)**:
- エラーメッセージの表示
- リトライ機能の提供

## 環境変数

### メインデータベース
```env
NEXT_PUBLIC_SUPABASE_URL=メインSupabase URL
SUPABASE_SERVICE_ROLE_KEY=メインSupabase Service Role Key
```

### 店舗データベース
```env
NEXT_PUBLIC_SUPABASE_URL_STORES=店舗Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY_STORES=店舗Supabase Anon Key
SUPABASE_SERVICE_ROLE_KEY_STORES=店舗Supabase Service Role Key
```

### Clerk認証
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=Clerk Publishable Key
CLERK_SECRET_KEY=Clerk Secret Key
```

### Google Analytics
```env
NEXT_PUBLIC_GA_ID=Google Analytics ID
```

## セキュリティ

### 認証・認可
- Clerk認証によるユーザー認証
- API Routeでの認証状態確認
- メモの所有権チェック

### データ保護
- Row Level Security (RLS) の実装
- ユーザーデータの暗号化
- セキュアなAPI通信

### 入力検証
- クライアントサイドでの入力検証
- サーバーサイドでのデータ検証
- SQLインジェクション対策

## パフォーマンス

### 最適化
- Next.js App Routerの活用
- 画像の最適化
- API呼び出しの最適化
- キャッシュ戦略

### 監視
- Google Analyticsによる使用状況監視
- エラーログの収集
- パフォーマンスメトリクス

## デプロイメント

### 本番環境
- **ホスティング**: Vercel
- **ドメイン**: カスタムドメイン
- **SSL**: 自動SSL証明書

### CI/CD
- GitHub Actions
- 自動デプロイ
- テスト実行


---

**作成日**: 2024年10月25日  
**バージョン**: 1.0.0  
**最終更新**: 2024年10月25日
