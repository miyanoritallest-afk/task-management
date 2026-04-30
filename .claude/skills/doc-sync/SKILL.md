---
name: doc-sync
description: Check for divergences between the current implementation and docs/ documentation. Produces a diff report of what is out of date, then asks the user whether to auto-fix the docs to match the implementation.
---

# doc-sync

実装を正として、`docs/` 配下のドキュメントとの差異を検出し、必要に応じて自動修正する。

## Phase 1: 実装の現状を調査する

以下のファイルを読み込んで実装の現状を把握する：

### フロントエンド
- `frontend/package.json` — 依存パッケージとバージョン
- `frontend/src/types.ts` — 型定義（Card, BoardColumn, Board, Priority 等）
- `frontend/src/components/Card.tsx` — カードの表示仕様（優先度バッジ、期限、クリック挙動）
- `frontend/src/components/AddCardModal.tsx` — カード追加 UI（入力フィールド、バリデーション方法）
- `frontend/src/components/EditCardModal.tsx` — カード編集・削除 UI
- `frontend/src/components/Column.tsx` — カラムの操作（ソート方式、追加ボタン）
- `frontend/src/components/KanbanBoard.tsx` — ドラッグ&ドロップ、全体構成

### バックエンド
- `backend/build.gradle.kts` — 依存ライブラリとプラグイン（バージョン含む）
- `backend/src/main/java/com/taskmanagement/backend/entity/Card.java` — Card エンティティ
- `backend/src/main/java/com/taskmanagement/backend/entity/BoardColumn.java` — Column エンティティ
- `backend/src/main/java/com/taskmanagement/backend/controller/CardController.java` — REST API エンドポイント
- `backend/src/main/resources/db/migration/V1__create_tables.sql` — テーブル定義

### ドキュメント
- `docs/requirements.md`
- `docs/features.md`
- `docs/screens.md`
- `docs/data-model.md`
- `docs/non-functional.md`
- `docs/tech-stack.md`

## Phase 2: 差異レポートを作成する

以下の観点でドキュメントと実装を比較し、差異をまとめる：

| チェック項目 | 確認ポイント |
|-------------|-------------|
| **tech-stack.md** | ライブラリ名・バージョン、追加/削除されたプラグインや依存関係 |
| **features.md** | UC の基本フロー（削除方法、移動方法、編集のトリガー等）が実装と一致しているか |
| **screens.md** | UI コンポーネントの操作方法（インライン vs モーダル、ボタン vs D&D）、エラー表示方法、画面遷移図 |
| **data-model.md** | テーブル定義・カラム型・制約が V1 マイグレーションと一致しているか |
| **requirements.md** | 技術スタック概要（フレームワーク名等）が実装と一致しているか |
| **non-functional.md** | 保存先・ORM・デプロイ方法の記述が実装と一致しているか |

差異がある場合は以下の形式でレポートする：

```
## ドキュメント差異レポート

### docs/tech-stack.md
- [差異] @hello-pangea/dnd のバージョンが「フェーズ3で導入」と記載されているが、実際は 18.0.1 で導入済み

### docs/features.md
- [差異] UC-02 の基本フローが「×ボタンを押す」と記載されているが、実際は EditCardModal の「削除する」ボタン経由

...（差異がなければ「差異なし」と記載）
```

差異がない場合は「すべてのドキュメントは実装と一致しています。」と報告して終了する。

## Phase 3: 自動修正の確認

差異がある場合、ユーザーに確認する：

```
上記の差異を自動修正しますか？
- はい：実装に合わせてドキュメントを修正します
- いいえ：レポートのみで終了します
```

ユーザーが「はい」を選択した場合のみ、Phase 4 を実行する。

## Phase 4: ドキュメントを自動修正する

差異ごとに Edit ツールで該当箇所を修正する。修正の原則：

1. **実装を正とする** — コードの挙動がドキュメントに優先する
2. **将来フェーズの記述は変更しない** — 未実装フェーズ（フェーズ4等）の計画記述はそのまま残す
3. **最小変更** — 差異がある箇所のみ修正し、周辺の文章は変えない
4. **日本語を維持** — ドキュメントの言語・文体をそのまま維持する

修正完了後、変更したファイルと変更箇所の一覧を報告する。
