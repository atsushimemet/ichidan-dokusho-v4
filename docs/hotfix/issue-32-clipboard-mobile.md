# Hotfix Analysis: Issue #32 - モバイル Chrome で Sparkles 押下後にプロンプトがコピーされない

## 事象
- モバイル版 Chrome アプリ（Android を想定）で書籍詳細ページからメモカードの Sparkles ボタンを押す。
- 3 秒後に ChatGPT へ遷移はするものの、端末のクリップボードにプロンプト（メタプロンプト + メモ本文）がコピーされていない。

## コード現状
- `handleChatGPTExport` (app/books/[id]/page.tsx)
  - `setTimeout` で 3 秒後に `navigator.clipboard.writeText` を呼び出し。
  - 失敗した場合は `textarea` 要素を生成し `document.execCommand('copy')` でフォールバック。
  - 成功・失敗に関わらず ChatGPT を `window.open` で新規タブへ遷移。

## 原因
- モバイル Chrome では、ユーザー操作に直接紐づかない非同期処理（タイマー経由のクリップボード書き込み）がブラウザのセキュリティ仕様でブロックされる。
- `navigator.clipboard.writeText` は HTTPS かつユーザーアクション直後でなければ拒否される。`setTimeout` で遅延させている現行実装では、ユーザー意図と離れたクリップボード操作とみなされる。
- `document.execCommand('copy')` も、モバイル Chrome では 2022 年以降無効化されており、フォールバックは機能しない。
- その結果、Android Chrome ではコピーが常に失敗し、エラーメッセージも表示されないまま ChatGPT へ遷移してしまう。

## 対応
1. Sparkles クリック時は即時に ChatGPT へ遷移せず、コピー用のポップアップを表示する。
2. ポップアップ内の「プロンプトをコピーする」ボタンをユーザーが押したタイミングで `navigator.clipboard.writeText` を実行し、成功後に ChatGPT を開く。
3. 失敗時はエラーを通知し、手動コピーを促す。
