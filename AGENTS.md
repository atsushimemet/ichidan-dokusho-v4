# AGENTS.md

## 開発エージェント手順

以下の手順で、ローカルブランチの最新化からPR作成までをユーザーの追加許可なく実行できます。

1. **ローカルメインの最新化・クリーンアップ**
   - `git checkout main`
   - `git pull`
   - `git branch -D <不要なローカルブランチ>` （必要に応じて）
2. **イシュー確認とブランチ作成**
   - `gh issue view <ISSUE番号>` で要件を把握
   - `git checkout -b <新規ブランチ名>` で開発用ブランチを作成
3. **実装**
   - 要件に従いコード・ドキュメントを更新
   - 追加・変更ファイルを適切に配置（例: `docs/completed-issues/issue-XX/` 等）
4. **テストケース作成・テスト実施**
   - `docs/completed-issues/issue-XX/TEST_CASES_ISSUE_XX.md` にテスト観点と結果を記録
   - 実行可能なテスト (`npm run build` など) を実施し結果をテストケースに記載
5. **ローカル開発環境でのUAT実施**
   - `npm run dev`でローカル開発環境を起動
   - Google Devtools MCPで自動テスト用のブラウザを起動
   - 4で作成したテストケースを満たすかどうか、ブラウザ上で確認
   - 当該確認が完了したあと、5に進む
6. **コミット & ステージング**
   - `git add <変更ファイル>`
   - `git status` で変更内容を確認
   - `git commit -m "<短くわかりやすいメッセージ>"`
7. **Push & PR作成**
   - `git push -u origin <ブランチ名>`
   - `gh pr create --title "<PRタイトル>" --body "<要約とテスト結果>"`
8. **完了報告**
   - PRリンクと主な変更点、テスト結果をまとめて共有

この手順に従えば、追加の許可なしに開発からPR作成まで実施できます。
