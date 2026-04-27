# 技術スタック

## 使用技術一覧

| 役割 | 技術 |
|------|------|
| フレームワーク | Next.js 14 |
| スタイリング | Tailwind CSS |
| データベース | Supabase（PostgreSQL） |
| ORM | Prisma |
| ドラッグ&ドロップ | dnd-kit（フェーズ3で導入） |
| ホスティング | Vercel |

---

## 各技術の採用理由

### Next.js 14
- Reactベースのフルスタックフレームワーク
- API Routeを使ってサーバーサイドでSupabaseにアクセスし、接続キーをクライアントに露出させない

### Tailwind CSS
- ユーティリティクラスベースのCSSフレームワーク
- コンポーネント単位でスタイルを管理しやすい

### Supabase（PostgreSQL）
- マネージドなPostgreSQLサービス
- リアルタイム保存・環境変数による接続キー管理

### Prisma
- TypeScriptファーストのORM
- 型安全なデータアクセスとスキーマ管理

### dnd-kit
- Reactに特化したドラッグ&ドロップライブラリ
- アクセシビリティ対応・軽量

### Vercel
- Next.jsの公式ホスティング環境
- 環境変数管理・デプロイの自動化
