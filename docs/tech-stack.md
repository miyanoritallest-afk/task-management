# 技術スタック

## 使用技術一覧

### バックエンド

| 役割 | 技術 |
|------|------|
| 言語 | Java 21 LTS |
| フレームワーク | Spring Boot 3.3.x |
| ビルドツール | Maven |
| ORM | Spring Data JPA + Hibernate |
| DB マイグレーション | Flyway |
| バリデーション | spring-boot-starter-validation（Jakarta Validation 3.x） |
| JDBC ドライバ | PostgreSQL JDBC Driver |
| コネクションプール | HikariCP（Spring Boot 同梱） |

### フロントエンド

| 役割 | 技術 |
|------|------|
| UI ライブラリ | React 18.x |
| ビルドツール | Vite 5.x |
| HTTP クライアント | Axios |
| 状態管理 | useState + Context API |
| ルーティング | React Router v6 |
| ドラッグ&ドロップ | @hello-pangea/dnd（フェーズ3で導入） |
| スタイリング | CSS Modules |
| トースト通知 | react-hot-toast |

### インフラ（ローカル開発）

| 役割 | 技術 |
|------|------|
| データベース | PostgreSQL 16 |
| DB 起動方法 | Docker Compose |

---

## 各技術の採用理由

### バックエンド

#### Java 21 LTS
- 最新の長期サポート（LTS）バージョン
- Spring Boot 3.3.x との相性が最も良い

#### Spring Boot 3.3.x
- Java エコシステムの標準的な Web フレームワーク
- 組み込み Tomcat で単一 JAR として起動可能
- REST API を `@RestController` で簡潔に実装できる

#### Maven
- Spring Initializr のデフォルトビルドツール
- `pom.xml` が明示的で学習コストが低い

#### Spring Data JPA + Hibernate
- Prisma に相当する型安全な DB アクセス層
- `JpaRepository` を継承するだけで CRUD が実装できる
- `@Entity` アノテーションでエンティティクラスをテーブルにマッピング

#### Flyway
- 純 SQL 形式のマイグレーションファイル（`V1__create_boards.sql` など）
- Spring Boot 起動時に自動実行される
- Liquibase（XML/YAML 形式）より可読性が高い

#### HikariCP
- Spring Boot の `spring-boot-starter-data-jpa` に同梱されており、追加設定不要

---

### フロントエンド

#### React 18.x
- コンポーネントベースの UI ライブラリ（安定版）
- Next.js は使用しない（バックエンドは Spring Boot が担う）

#### Vite 5.x
- Create React App（CRA）は非推奨のため Vite を採用
- ミリ秒単位の高速起動
- 開発サーバーのプロキシ機能（`/api/*` を Spring Boot の 8080 ポートへ転送）でローカル開発の CORS 問題を解消

#### Axios
- `fetch` と比較してレスポンスの自動 JSON パースが可能
- インターセプターで API エラーのトースト表示を一元処理できる

#### useState + Context API
- Redux は本プロジェクトの規模に対して過剰
- `BoardContext` にボード全体の状態を集約し、シンプルに管理する

#### React Router v6
- フェーズ4（複数ボード対応）を見越して `/boards/:boardId` のルーティングを初期から導入

#### @hello-pangea/dnd（フェーズ3）
- `react-beautiful-dnd`（Atlassian が開発停止）のコミュニティ継続フォーク
- API 互換性が高く、既存のチュートリアルがそのまま参照できる

#### CSS Modules
- コンポーネントスコープの CSS（グローバル汚染なし）
- Vite でゼロ設定で動作
- プロトタイプ（`prototype/index.html`）の CSS をそのまま流用しやすい

---

## アーキテクチャ概要

```
[React (port 5173)]
      ↓ /api/* (Vite プロキシで転送)
[Spring Boot (port 8080)]
      ↓ JDBC
[PostgreSQL (port 5432, Docker Compose)]
```

### CORS 戦略（2層構成）

| 層 | 役割 |
|---|---|
| Vite プロキシ（開発時） | フロントエンドの `/api/*` を `localhost:8080` へ透過転送。CORS ヘッダー不要 |
| Spring Boot `CorsConfig`（本番対応） | `allowedOrigins("http://localhost:5173")` を `/api/**` に設定。安全網として機能 |

---

## pom.xml 主要依存関係

```xml
<dependency> spring-boot-starter-web </dependency>
<dependency> spring-boot-starter-data-jpa </dependency>
<dependency> spring-boot-starter-validation </dependency>
<dependency scope="runtime"> postgresql </dependency>
<dependency> flyway-core </dependency>
<dependency scope="test"> spring-boot-starter-test </dependency>
```

---

## package.json 主要依存関係

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.x",
    "axios": "^1.x",
    "react-hot-toast": "^2.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

フェーズ3で追加: `"@hello-pangea/dnd": "^16.x"`

---

## ローカル開発環境の起動手順

```bash
# 1. PostgreSQL 起動
docker compose up -d

# 2. バックエンド起動（backend/ ディレクトリで）
./mvnw spring-boot:run

# 3. フロントエンド起動（frontend/ ディレクトリで）
npm run dev
```

PostgreSQL 接続情報（docker-compose.yml で定義）:
- Host: `localhost:5432`
- Database: `kanban_db`
- User: `kanban_user`
- Password: `kanban_pass`
