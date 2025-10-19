# Hotfix Report: Issue #30 - メール中の Magic Link を押した後にログインが完了しない

## 事象
- PR [#29](https://github.com/atsushimemet/ichidan-dokusho-v4/pull/29) を本番環境へリリース後、メールの Magic Link を開いてもログイン完了画面に遷移しない。
- 同じセッションでホーム (`/`) を手動で再読み込みすると、ログインは完了している。

## 原因
- PR #29 で追加された `RouteRestorer` が、直前に表示していたパスを `sessionStorage` に保存し、`/` に戻った際にそのパスへ `router.replace()` で復帰する仕様になっている。
- Magic Link のフローでは、`/auth/callback?redirectTo=/` → `/` の順で遷移するが、`RouteRestorer` が `/` を検知した時点で **保存済みの `/auth/callback?...`** を再び `router.replace()` で表示し、リダイレクトがループに近い挙動になる。
- その結果、初回表示ではログインが完了していないように見え、ユーザーが手動でホームへ移動したタイミングでようやく `/` が保持されログイン状態が反映される。

## 対応
- `RouteRestorer` が `/auth/callback` などの認証コールバックを保存・復帰の対象から除外するよう修正。
- これにより、Magic Link のコールバック処理中に `router.replace()` が再度走らず、ログイン完了画面が意図通り表示されるようになる。
