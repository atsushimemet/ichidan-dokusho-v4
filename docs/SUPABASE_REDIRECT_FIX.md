# Supabase Redirect URL修正手順（緊急対応）

## 問題の状況

- ✅ アプリケーション側：正しいVercelプレビューURLを送信している（コンソールで確認済み）
- ❌ Supabase側：Magic Linkが`localhost:3000`にリダイレクトされる

→ **原因：Supabaseダッシュボードの設定が不足している**

## 🚨 至急実施すべき対応

### ステップ1: Supabaseダッシュボードにアクセス

1. https://app.supabase.com/ にアクセス
2. 該当のプロジェクトを選択

### ステップ2: Redirect URLsの設定

1. 左サイドバーから **Authentication** をクリック
2. **URL Configuration** タブをクリック
3. **Redirect URLs** セクションを探す

### ステップ3: Vercel URLを追加

**重要**: 以下のURLを **追加** してください（既存の設定は残す）

```
https://*.vercel.app/**
```

または、より具体的に：

```
https://ichidan-dokusho-v4-*.vercel.app/**
https://ichidan-dokusho-v4-git-*.vercel.app/**
```

**追加方法**:
1. "Add a URL" ボタンをクリック
2. 上記のURLを入力
3. "Add" をクリック
4. 必ず **"Save"** ボタンをクリックして保存

### ステップ4: Site URLの確認（オプション）

**Site URL** が以下のいずれかになっているか確認：
- プロダクション環境のURL
- または `http://localhost:3000`（開発用）

**注意**: Vercelプレビュー環境の場合、Site URLは動的に変わるため、Redirect URLsにワイルドカードを使用することが重要です。

## 📸 スクリーンショット参考

設定画面は以下のようになります：

```
Authentication > URL Configuration

Site URL
http://localhost:3000  (または your-production-domain.com)

Redirect URLs
✓ http://localhost:3000/**
✓ https://*.vercel.app/**
✓ https://your-production-domain.com/**
```

## ✅ 設定後の確認手順

1. Supabaseダッシュボードで **"Save"** をクリック
2. 設定が反映されるまで **1-2分待つ**
3. Vercelプレビュー環境で再度ログインを試す
4. 新しいメールアドレスで試す（キャッシュを避けるため）

## 🔍 トラブルシューティング

### Q1: ワイルドカードが使えない場合

Supabaseの無料プランではワイルドカードが制限されている可能性があります。その場合：

1. 特定のVercelプレビューURLを追加：
   ```
   https://ichidan-dokusho-v4-abc123def.vercel.app/auth/callback
   ```

2. PRごとに異なるURLが生成されるため、テスト時にURLをコピーして追加

### Q2: 設定が反映されない

1. ブラウザのキャッシュをクリア
2. Supabaseダッシュボードからログアウト→再ログイン
3. 設定を再度確認して保存

### Q3: 複数のブランチ/PRをテストする場合

各PRのVercelプレビューURLを個別に追加する必要があります：

```
https://ichidan-dokusho-v4-feature-issue-3-memo-creation-abc123.vercel.app/**
https://ichidan-dokusho-v4-hotfix-supabase-redirect-url-def456.vercel.app/**
```

## 🎯 最も簡単な解決方法（推奨）

もしワイルドカードが使えない場合、以下の手順で対応してください：

### 方法1: 現在のVercelプレビューURLを直接追加

1. Vercelプレビュー環境のURLをコピー（例：`https://ichidan-dokusho-v4-git-hotfix-supabase-redirect-url-atsushimemet.vercel.app`）
2. Supabase Redirect URLsに以下を追加：
   ```
   https://ichidan-dokusho-v4-git-hotfix-supabase-redirect-url-atsushimemet.vercel.app/**
   ```
3. 保存

### 方法2: Vercelの環境変数を使用

Vercel側で環境変数を設定する方法もあります：

1. Vercel Dashboard → Project Settings → Environment Variables
2. `NEXT_PUBLIC_SITE_URL` を追加
3. 値：VercelプレビューのURL

ただし、この方法ではPRごとに異なるURLに対応できないため、方法1が推奨です。

## 📝 設定例（実際の値）

現在のPR（#24）のVercelプレビューURLを確認して、以下のように追加：

```
実際のURL例：
https://ichidan-dokusho-v4-git-hotfix-supabase-redirect-url-atsushimemet.vercel.app

Supabaseに追加するURL：
https://ichidan-dokusho-v4-git-hotfix-supabase-redirect-url-atsushimemet.vercel.app/**
```

**重要**: URLの末尾に `/**` を必ず追加してください。これにより、すべてのサブパスが許可されます。

## 🔄 設定反映後

設定を保存したら：
1. 新しいメールアドレスでテスト（推奨）
2. または、ブラウザのキャッシュとCookieをクリア
3. 再度ログインフローを試す

## ⏰ 反映時間

通常、Supabaseの設定変更は **即座に反映** されますが、場合によっては1-2分かかることがあります。

## 💡 今後の対応

プロダクション環境にデプロイする際は、以下も追加してください：

```
https://your-production-domain.com/**
```

## ❓ それでも解決しない場合

以下を確認してください：

1. **Supabaseプロジェクトは正しいか**：複数のプロジェクトがある場合、別のプロジェクトを編集していないか確認
2. **環境変数は正しいか**：Vercelの環境変数で`NEXT_PUBLIC_SUPABASE_URL`が正しいプロジェクトを指しているか確認
3. **Supabaseのステータス**：https://status.supabase.com/ でサービス障害がないか確認

## 📞 サポート

この手順で解決しない場合は、以下の情報を提供してください：

1. Supabase Redirect URLsのスクリーンショット
2. Vercelプレビュー環境のURL
3. ブラウザコンソールのログ（エラーメッセージ）
4. 受信したメールのMagic Linkの実際のURL（トークンは隠して）

