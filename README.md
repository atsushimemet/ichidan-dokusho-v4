# 一段読書 v4 - Knowledge Loop Edition

学びを定着させる読書体験を提供するWebアプリケーション。読書内容の記録 → 理解 → 復習が循環するKnowledge Loopを実現します。

## 🎯 プロジェクト概要

一段読書は、「読んで終わり」から「読んだことを使える」体験へと変化させる読書プラットフォームです。AIによるクイズ生成・リマインダー通知・学び履歴の再閲覧を中心に、ユーザーの学習定着率を向上させます。

## 🧩 主要機能

### 📚 Book（書籍管理）
- 書籍一覧・詳細表示
- 書籍検索機能
- Amazonリンク連携

### 📝 Memo（読書メモ）
- 構造化されたメモテンプレート
- 要点・学び・行動ToDoの記録
- 書籍との紐づけ

### 🧩 Quiz（理解度チェック）
- AI生成クイズ（GPT API連携予定）
- 選択式・○×問題
- 正答率・解説表示

### 🔁 Knowledge Loop
- 読書 → 理解 → 復習の循環
- リマインダー通知（実装予定）
- 学び履歴の可視化

## 🛠 技術スタック

- **フロントエンド**: Next.js 14, React 18, TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Supabase（予定）
- **AI**: GPT API（予定）
- **デプロイ**: Vercel（推奨）

## 🚀 セットアップ

### 前提条件
- Node.js 18.0以上
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd ichidan-dokusho-v4
```

2. 依存関係をインストール
```bash
npm install
# または
yarn install
```

3. 開発サーバーを起動
```bash
npm run dev
# または
yarn dev
```

4. ブラウザで `http://localhost:3000` を開く

## 📁 プロジェクト構造

```
ichidan-dokusho-v4/
├── app/                    # Next.js App Router
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── components/            # Reactコンポーネント
│   ├── Navigation.tsx     # ナビゲーション
│   ├── BookList.tsx       # 書籍一覧
│   ├── MemoForm.tsx       # メモ作成フォーム
│   └── QuizSection.tsx    # クイズ機能
├── docs/                  # プロジェクト資料
│   ├── business_plan.md   # 事業計画書
│   └── mvp_requirements.md # MVP要件定義
├── wireframes/            # デザイン資料
└── package.json           # 依存関係定義
```

## 🎨 デザインシステム

### カラーパレット
- **Primary**: Blue系（#0ea5e9）
- **Secondary**: Purple系（#d946ef）
- **Neutral**: Gray系

### コンポーネント
- カードベースのレイアウト
- グラデーション背景
- レスポンシブデザイン

## 📊 MVP KPI

- 初回クイズ生成率: 70%以上
- リマインダー再アクセス率: 30%以上
- 平均滞在時間: 3分以上
- 学び満足度: 4.0/5以上

## 🔮 今後の実装予定

- [ ] Supabaseデータベース連携
- [ ] GPT API連携（クイズ生成）
- [ ] ユーザー認証
- [ ] リマインダー通知機能
- [ ] 学び履歴の可視化
- [ ] モバイルアプリ対応

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。詳細は[CONTRIBUTING.md](CONTRIBUTING.md)をご覧ください。

## 📞 お問い合わせ

プロジェクトに関する質問やフィードバックは、GitHubのIssuesまでお願いします。