# 技術スタック

## 使用技術一覧

### バックエンド

| 役割 | 技術 | バージョン |
|------|------|-----------|
| 言語 | Java | 21 LTS |
| フレームワーク | Spring Boot | 4.0.0 |
| ビルドツール | Gradle | 8.14 |
| ORM | Spring Data JPA + Hibernate | Spring Boot 4 管理 |
| DB マイグレーション | Flyway | 11.3.0 |
| バリデーション | spring-boot-starter-validation | Spring Boot 4 管理 |
| JDBC ドライバ | PostgreSQL JDBC Driver | 42.7.4 |
| コネクションプール | HikariCP | Spring Boot 4 同梱 |
| JSON シリアライズ | jackson-datatype-jsr310 | Spring Boot 4 管理 |
| テスト用 DB | H2 | Spring Boot 4 管理 |

### フロントエンド

| 役割 | 技術 | バージョン |
|------|------|-----------|
| UI ライブラリ | React | 19.2.5 |
| ビルドツール | Vite | 8.0.10 |
| 言語 | TypeScript | 6.0.3 |
| HTTP クライアント | Axios | 1.15.2 |
| 状態管理 | useState + Context API | — |
| ドラッグ&ドロップ | @hello-pangea/dnd | フェーズ3で導入 |
| スタイリング | CSS Modules | — |
| Vite プラグイン | @vitejs/plugin-react | 6.0.1 |
| リンター | ESLint | 10.2.1 |

### インフラ（ローカル開発）

| 役割 | 技術 | バージョン |
|------|------|-----------|
| データベース | PostgreSQL | 16 |
| DB 起動方法 | Docker Compose | — |

---

## 各技術の採用理由

### バックエンド

#### Java 21 LTS
- 最新の長期サポート（LTS）バージョン
- Spring Boot 4.0.0 との相性が最も良い

#### Spring Boot 4.0.0
- Java エコシステムの標準的な Web フレームワーク
- 組み込み Tomcat で単一 JAR として起動可能
- REST API を `@RestController` で簡潔に実装できる

#### Gradle 8.14
- Kotlin DSL（`build.gradle.kts`）で型安全なビルド定義が記述できる
- Spring Boot 4 の依存関係管理プラグイン（`io.spring.dependency-management`）と組み合わせて使用

#### Spring Data JPA + Hibernate
- `JpaRepository` を継承するだけで CRUD が実装できる
- `@Entity` アノテーションでエンティティクラスをテーブルにマッピング

#### Flyway 11.3.0
- 純 SQL 形式のマイグレーションファイル（`V1__create_boards.sql` など）
- Spring Boot 起動時に自動実行される
- `flyway-database-postgresql` で PostgreSQL 固有の方言をサポート

#### HikariCP
- Spring Boot の `spring-boot-starter-data-jpa` に同梱されており、追加設定不要

---

### フロントエンド

#### React 19.2.5
- コンポーネントベースの UI ライブラリ（最新安定版）
- フロントエンドのみ担当（バックエンドは Spring Boot が担う）

#### Vite 8.0.10
- Create React App（CRA）は非推奨のため Vite を採用
- ミリ秒単位の高速起動
- 開発サーバーのプロキシ機能（`/api/*` を Spring Boot の 8080 ポートへ転送）でローカル開発の CORS 問題を解消

#### TypeScript 6.0.3
- 型安全な開発でバグを早期発見
- React コンポーネントの props 型定義が明確になる

#### Axios 1.15.2
- `fetch` と比較してレスポンスの自動 JSON パースが可能
- インターセプターで API エラーの一元処理ができる

#### useState + Context API
- Redux は本プロジェクトの規模に対して過剰
- `BoardContext` にボード全体の状態を集約し、シンプルに管理する

#### @hello-pangea/dnd（フェーズ3）
- `react-beautiful-dnd`（Atlassian が開発停止）のコミュニティ継続フォーク
- API 互換性が高く、既存のチュートリアルがそのまま参照できる

#### CSS Modules
- コンポーネントスコープの CSS（グローバル汚染なし）
- Vite でゼロ設定で動作

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

## build.gradle.kts 主要依存関係

```kotlin
implementation("org.springframework.boot:spring-boot-starter-web")
implementation("org.springframework.boot:spring-boot-starter-data-jpa")
implementation("org.springframework.boot:spring-boot-starter-validation")
implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")
runtimeOnly("org.postgresql:postgresql:42.7.4")
runtimeOnly("com.h2database:h2")
implementation("org.flywaydb:flyway-core:11.3.0")
implementation("org.flywaydb:flyway-database-postgresql:11.3.0")
testImplementation("org.springframework.boot:spring-boot-starter-test")
```

---

## package.json 主要依存関係

```json
{
  "dependencies": {
    "axios": "^1.15.2",
    "react": "^19.2.5",
    "react-dom": "^19.2.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.2.1",
    "typescript": "^6.0.3",
    "vite": "^8.0.10"
  }
}
```

フェーズ3で追加予定: `"@hello-pangea/dnd": "^16.x"`

---

## ローカル開発環境の起動手順

```bash
# 1. PostgreSQL 起動
docker compose up -d

# 2. バックエンド起動（backend/ ディレクトリで）
./gradlew bootRun

# 3. フロントエンド起動（frontend/ ディレクトリで）
npm run dev
```

PostgreSQL 接続情報（docker-compose.yml で定義）:
- Host: `localhost:5432`
- Database: `kanban_db`
- User: `kanban_user`
- Password: `kanban_pass`
