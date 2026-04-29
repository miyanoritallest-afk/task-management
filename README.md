# Task Management App

Trello スタイルの Kanban ボードアプリ。Spring Boot 4 + React 19 で構築。
タスクを **Todo / In Progress / Done** の3カラムにカードとして管理する。

## 機能概要

- カラムへのカード追加（タイトル・優先度 High/Medium/Low/None）
- カラム間のカード移動（フェーズ1: 矢印ボタン、フェーズ3: ドラッグ&ドロップ）
- カードタイトルのインライン編集・詳細モーダル（フェーズ2）
- 優先度・期限日によるカード並び替え
- 全データを PostgreSQL に永続化（Spring Boot REST API 経由）

13のユースケース・4フェーズの全機能一覧は [docs/features.md](docs/features.md) を参照。

## 技術スタック

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| 言語（バックエンド） | Java | 21 LTS |
| バックエンド | Spring Boot | 4.0.0 |
| ビルドツール | Gradle | 8.14 |
| DB マイグレーション | Flyway | 11.3.0 |
| PostgreSQL JDBC | postgresql | 42.7.4 |
| UI ライブラリ | React | 19.2.5 |
| フロントエンドビルド | Vite | 8.0.10 |
| 言語（フロントエンド） | TypeScript | 6.0.3 |
| HTTP クライアント | Axios | 1.15.2 |
| データベース | PostgreSQL | 16（Docker） |

採用理由・アーキテクチャ詳細は [docs/tech-stack.md](docs/tech-stack.md) を参照。

## 必要な環境

- **Java 21**（JDK — `./gradlew` が使用）
- **Node.js 20+** と **npm**
- **Docker**（Docker Compose で PostgreSQL を起動）
- **Git**

## ローカル開発セットアップ

### 1. PostgreSQL を起動

```bash
docker compose up -d
```

`docker-compose.yml` の設定で PostgreSQL 16 をポート 5432 で起動する。

### 2. バックエンドを起動

```bash
cd backend
./gradlew bootRun
```

API は `http://localhost:8080` で利用可能。起動時に Flyway が DB マイグレーションを自動実行する。

### 3. フロントエンドを起動

```bash
cd frontend
npm install   # 初回のみ
npm run dev
```

UI は `http://localhost:5173` で利用可能。Vite が `/api/*` リクエストをバックエンド（8080）へプロキシする。

### ポート一覧

| サービス | ポート | 設定ファイル |
|---------|------|------------|
| PostgreSQL | 5432 | `docker-compose.yml` |
| バックエンド（Spring Boot） | 8080 | `backend/src/main/resources/application.properties` |
| フロントエンド（Vite） | 5173 | Vite デフォルト |

ポートは固定。変更不可。Vite プロキシと Spring Boot CORS 設定がこの値に依存している。
ポート競合時の解消手順は [CLAUDE.md](CLAUDE.md) を参照。

## プロジェクト構造

```
TaskuManegement/
├── backend/                        # Spring Boot 4 アプリケーション
│   ├── src/main/java/              # Java ソース（controllers, services, repositories）
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── db/migration/           # Flyway SQL マイグレーション（V1__, V2__, ...）
│   ├── build.gradle.kts
│   └── Dockerfile
├── frontend/                       # React 19 + Vite 8 アプリケーション
│   ├── src/                        # TypeScript ソース（components, contexts, api）
│   ├── vite.config.js              # Vite 設定 + /api プロキシ → :8080
│   └── package.json
├── docs/                           # プロジェクトドキュメント
├── docker-compose.yml              # PostgreSQL + バックエンド定義
└── CLAUDE.md                       # 開発ワークフロールール
```

## ドキュメント

| ドキュメント | 内容 |
|------------|------|
| [docs/requirements.md](docs/requirements.md) | プロジェクト概要・背景 |
| [docs/features.md](docs/features.md) | 4フェーズ・13ユースケースの機能一覧 |
| [docs/data-model.md](docs/data-model.md) | ER 図・テーブル定義（boards, columns, cards） |
| [docs/screens.md](docs/screens.md) | UI 仕様・画面遷移 |
| [docs/non-functional.md](docs/non-functional.md) | パフォーマンス・ブラウザ対応・アクセシビリティ |
| [docs/tech-stack.md](docs/tech-stack.md) | 技術スタック詳細（バージョン・採用理由） |
| [CLAUDE.md](CLAUDE.md) | Git ワークフロー・コミット形式・ポートルール |

## データモデル

3テーブルの親子階層構造：

```
boards (1) ──< columns (N) ──< cards (N)
```

`card` の主なフィールド: `title`, `description`, `due_date`, `priority`（high/medium/low/none）, `color`, `position`

詳細は [docs/data-model.md](docs/data-model.md) の ER 図を参照。
