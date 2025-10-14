# Supabase認証設定ガイド

## 問題: Magic LinkがLocalhostにリダイレクトされる

Vercelプレビュー環境でMagic Linkを使用してログインしようとすると、`localhost:3000`にリダイレクトされる問題が発生する場合があります。

## 原因

Supabaseのダッシュボードで設定されているRedirect URLsに、Vercelプレビュー環境のURLが含まれていない可能性があります。

## 解決方法

### 1. Supabaseダッシュボードでの設定

1. Supabaseプロジェクトのダッシュボードにログイン
2. **Authentication** → **URL Configuration** に移動
3. 以下のURLを **Redirect URLs** に追加：

```
http://localhost:3000/**
https://*.vercel.app/**
https://your-production-domain.com/**
```

**重要**: ワイルドカード (`*`) を使用して、すべてのVercelプレビューURLとプロダクションURLをカバーします。

### 2. Site URLの設定

**Site URL** を以下のように設定：

- 開発環境: `http://localhost:3000`
- プロダクション: `https://your-production-domain.com`

**注意**: Vercelプレビュー環境では、各プレビューで異なるURLが生成されるため、Site URLは手動で変更できません。そのため、Redirect URLsにワイルドカードを使用することが重要です。

### 3. コード側の対応（実装済み）

アプリケーションコードでは、以下の対応を実施しています：

- `window.location.origin` を使用して、現在のページのURLを動的に取得
- Vercelプレビュー環境でも正しいコールバックURLを生成
- デバッグログでリダイレクトURLを出力

### 4. 確認方法

1. Vercelプレビュー環境でログインページにアクセス
2. ブラウザの開発者ツール（Console）を開く
3. メールアドレスを入力してログインリンクを送信
4. Consoleに表示される `Sending magic link with redirect URL:` のログを確認
5. URLが正しいVercelプレビューURLになっているか確認

### 5. トラブルシューティング

#### 問題: まだlocalhost:3000にリダイレクトされる

**原因**: Supabaseの設定が反映されていない可能性があります。

**解決策**:
1. Supabaseダッシュボードで設定を再確認
2. ブラウザのキャッシュをクリア
3. Supabaseプロジェクトを再起動（必要に応じて）
4. 新しいメールアドレスでテスト

#### 問題: Magic Linkが届かない

**原因**: メールプロバイダーがブロックしている可能性があります。

**解決策**:
1. 迷惑メールフォルダを確認
2. Supabaseダッシュボードの Email Templates を確認
3. 別のメールアドレスでテスト

## Vercel環境変数の設定

Vercel側でも環境変数が正しく設定されているか確認してください：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

これらの環境変数は、以下の場所で設定されている必要があります：
- プロダクション環境
- プレビュー環境（すべてのブランチ）
- 開発環境

## 参考リンク

- [Supabase Auth Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

