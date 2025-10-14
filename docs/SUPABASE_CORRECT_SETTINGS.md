# Supabase 正しい設定方法（画像付き説明）

## ❌ 間違った設定

**Site URL** にワイルドカード `https://*.vercel.app/**` を設定してしまった
→ これは**間違い**です！

## ✅ 正しい設定

### 設定箇所の違い

Supabaseの **Authentication → URL Configuration** には2つの設定項目があります：

#### 1. Site URL（サイトURL）
- **用途**: メインのアプリケーションURL（1つだけ設定可能）
- **ワイルドカード**: ❌ 使用不可
- **設定値の例**:
  ```
  http://localhost:3000
  ```
  または
  ```
  https://your-production-domain.com
  ```

#### 2. Redirect URLs（リダイレクトURL）
- **用途**: Magic Linkなどのリダイレクト先の許可リスト（複数設定可能）
- **ワイルドカード**: ✅ 使用可能
- **設定値の例**:
  ```
  http://localhost:3000/**
  https://*.vercel.app/**
  https://your-production-domain.com/**
  ```

## 🔧 修正手順

### Step 1: Site URLを元に戻す

1. Supabaseダッシュボード → **Authentication** → **URL Configuration**
2. **Site URL** を以下に設定:
   ```
   http://localhost:3000
   ```
   または、プロダクションドメインがある場合:
   ```
   https://your-production-domain.com
   ```

### Step 2: Redirect URLsを正しく設定

**Redirect URLs** セクション（Site URLの下にあります）で:

1. **既存の誤った設定を削除**:
   - `https://*.vercel.app/**` が**Site URL**に設定されている場合は削除

2. **正しいRedirect URLsを追加**:
   
   **方法A: ワイルドカードを使う（推奨）**
   
   "Add URL" ボタンをクリックして、以下を1つずつ追加:
   
   ```
   http://localhost:3000/**
   ```
   
   ```
   https://*.vercel.app/**
   ```
   
   プロダクションドメインがあれば:
   ```
   https://your-production-domain.com/**
   ```

   **方法B: 特定のVercelプレビューURLを追加**
   
   ワイルドカードが使えない場合は、現在のVercelプレビューURLを追加:
   
   ```
   https://ichidan-dokusho-v4-git-hotfix-supabase-redirect-url-[YOUR-USERNAME].vercel.app/**
   ```
   
   ※ `[YOUR-USERNAME]` の部分は実際のユーザー名に置き換えてください

3. **保存**ボタンをクリック

## 📸 設定画面のイメージ

正しい設定は以下のようになります:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Authentication > URL Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Site URL
┌─────────────────────────────────────┐
│ http://localhost:3000               │  ← ワイルドカードなし
└─────────────────────────────────────┘

Redirect URLs
┌─────────────────────────────────────┐
│ ✓ http://localhost:3000/**          │
│ ✓ https://*.vercel.app/**           │  ← ワイルドカード使用OK
│ ✓ https://your-domain.com/**        │
│                                     │
│ [+ Add URL]                         │
└─────────────────────────────────────┘

[Save] ← 必ずクリック
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 🎯 現在のエラーを修正する手順

現在表示されているエラー:
```
https://ftfwhmowqjtypqzkgblc.supabase.co/auth/v1/verify?...redirect_to=%20%20%20https://*.vercel.app/**
```

これを修正するには:

### 1. Site URLを修正
```
変更前: https://*.vercel.app/**  ← 削除
変更後: http://localhost:3000    ← これを設定
```

### 2. Redirect URLsに追加

**現在テストしているVercelプレビューURLを確認**:

GitHub PR #24 のページで、Vercel botのコメントを確認し、実際のプレビューURLをコピーしてください。

例: `https://ichidan-dokusho-v4-git-hotfix-supabase-redirect-url-atsushimemet.vercel.app`

このURLを **Redirect URLs** に追加:
```
https://ichidan-dokusho-v4-git-hotfix-supabase-redirect-url-atsushimemet.vercel.app/**
```

**注意**: 末尾の `/**` を忘れずに！

### 3. 保存して再テスト

1. **Save** ボタンをクリック
2. 1-2分待つ
3. ブラウザのキャッシュをクリア
4. **新しいメールアドレス**でログインを試す
5. Magic Linkをクリック
6. 正しくVercelプレビュー環境にリダイレクトされることを確認

## ⚠️ よくある間違い

### ❌ 間違い1: Site URLにワイルドカードを設定
```
Site URL: https://*.vercel.app/**
```
→ Site URLは1つの具体的なURLのみ設定可能

### ❌ 間違い2: Redirect URLsに`/**`をつけ忘れ
```
Redirect URLs: https://*.vercel.app
```
→ 末尾の `/**` が必要です

### ❌ 間違い3: スペースが入っている
```
Redirect URLs:    https://*.vercel.app/**
```
→ 前後にスペースを入れないでください

### ✅ 正解
```
Site URL: http://localhost:3000
Redirect URLs: 
  - http://localhost:3000/**
  - https://*.vercel.app/**
```

## 🔍 設定確認チェックリスト

- [ ] Site URLは具体的なURL（ワイルドカードなし）
- [ ] Redirect URLsに`localhost:3000/**`がある
- [ ] Redirect URLsにVercelのURLがある（ワイルドカードまたは具体的なURL）
- [ ] すべてのURLの末尾に`/**`がついている
- [ ] URLの前後にスペースがない
- [ ] 設定を保存した（Saveボタンをクリック）

## 💡 ワイルドカードについて

### ワイルドカードが使える場合

Supabaseの有料プラン、または一部の無料プランで使えます:
```
https://*.vercel.app/**
```

### ワイルドカードが使えない場合

各VercelプレビューURLを個別に追加してください:
```
https://ichidan-dokusho-v4-git-feature-branch-1-username.vercel.app/**
https://ichidan-dokusho-v4-git-feature-branch-2-username.vercel.app/**
https://ichidan-dokusho-v4-git-hotfix-branch-username.vercel.app/**
```

## 🚀 次のステップ

設定を修正したら:

1. 設定を保存
2. 1-2分待つ
3. 新しいメールアドレスでテスト
4. コンソールでログを確認:
   ```
   Sending magic link with redirect URL: https://...
   ```
5. Magic Linkをクリック
6. 正しくリダイレクトされることを確認

## ❓ まだ問題が解決しない場合

以下の情報を共有してください:

1. **Site URLのスクリーンショット**
2. **Redirect URLsのスクリーンショット**
3. **実際のVercelプレビューURL**（GitHub PRから確認）
4. **ブラウザコンソールのログ**
5. **新しく受信したMagic LinkのURL**（トークン部分は隠して）

## 📞 参考リンク

- [Supabase公式ドキュメント: Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Vercel Preview URLs](https://vercel.com/docs/concepts/deployments/preview-deployments)

