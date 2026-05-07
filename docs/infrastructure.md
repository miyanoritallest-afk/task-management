# インフラ構成

## 概要

本アプリは AWS 上に以下の構成でデプロイされる。
インフラのコードは `infra/ec2/` 配下の Terraform で管理する。

---

## 構成図

```
インターネット
     │
     │ HTTP :80
     ▼
┌─────────────────────────────────┐
│  EC2 (Amazon Linux 2023)        │
│                                 │
│  Nginx                          │
│  ├── /          → React 静的ファイル│
│  └── /api/*     → :8080 へ転送  │
│                                 │
│  Spring Boot (Docker)  :8080    │
└─────────────────────────────────┘
     │
     │ PostgreSQL :5432
     │ (EC2 セキュリティグループからのみ)
     ▼
┌──────────────┐
│  RDS         │
│  PostgreSQL  │
└──────────────┘
```

---

## AWS リソース一覧

| リソース | サービス | スペック |
|---------|---------|---------|
| サーバー | EC2 | t3.micro、Amazon Linux 2023 |
| 固定 IP | Elastic IP | EC2 に紐付け（再起動後も IP 不変） |
| ストレージ | EBS | 20 GB gp2 |
| データベース | RDS PostgreSQL | db.t3.micro、PostgreSQL 16、Single-AZ |
| ネットワーク | VPC | AWS デフォルト VPC を使用 |

---

## ネットワーク・セキュリティ

### EC2 セキュリティグループ

| ポート | プロトコル | 許可元 | 用途 |
|--------|-----------|-------|------|
| 22 | TCP | 自分の IP のみ | SSH 接続 |
| 80 | TCP | 0.0.0.0/0 | HTTP アクセス |

### RDS セキュリティグループ

| ポート | プロトコル | 許可元 | 用途 |
|--------|-----------|-------|------|
| 5432 | TCP | EC2 セキュリティグループ | PostgreSQL 接続 |

RDS は `publicly_accessible = false` に設定しており、EC2 経由でのみアクセス可能。

---

## EC2 上のソフトウェア構成

| ソフトウェア | 役割 | 起動方法 |
|------------|------|---------|
| Nginx | 静的ファイル配信・リバースプロキシ | systemd（自動起動） |
| Docker | バックエンドコンテナ実行環境 | systemd（自動起動） |
| Spring Boot | REST API サーバー（Docker コンテナ） | `docker run --restart unless-stopped` |

### Nginx の役割

- `/` へのリクエスト → `/var/www/taskmanagement/` の React ビルド成果物を返す
- `/api/*` へのリクエスト → `localhost:8080` の Spring Boot コンテナへ転送
- SPA ルーティングのため `try_files $uri $uri/ /index.html` を設定

---

## ディレクトリ構成

```
infra/
└── ec2/
    ├── main.tf             # Terraform プロバイダー・VPC 参照
    ├── variables.tf        # 変数定義
    ├── terraform.tfvars    # 実際の設定値（.gitignore 対象、Git に上がらない）
    ├── terraform.tfvars.example  # tfvars のテンプレート
    ├── security_group.tf   # EC2・RDS のセキュリティグループ
    ├── ec2.tf              # EC2 インスタンス・EIP
    ├── rds.tf              # RDS インスタンス・サブネットグループ
    └── outputs.tf          # IP アドレス・接続情報の出力
```

---

## デプロイ手順

### 初回セットアップ（Terraform）

```bash
cd infra/ec2

# terraform.tfvars.example をコピーして値を設定
cp terraform.tfvars.example terraform.tfvars
# my_ip_cidr, key_pair_name, db_password を編集

terraform init
terraform plan
terraform apply
```

### バックエンドのデプロイ

```bash
# ローカルで Docker イメージをビルド
cd backend
docker build -t taskmanagement-backend:latest .

# EC2 に転送
docker save taskmanagement-backend:latest -o backend.tar
scp -i <キーファイル.pem> backend.tar ec2-user@<EC2_IP>:~

# EC2 上でコンテナを起動（SSH 接続後）
docker load -i ~/backend.tar
docker run -d --name kanban_backend --restart unless-stopped \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://<RDS_ENDPOINT>:5432/kanban_db \
  -e SPRING_DATASOURCE_USERNAME=kanban_user \
  -e SPRING_DATASOURCE_PASSWORD=<パスワード> \
  taskmanagement-backend:latest
```

### フロントエンドのデプロイ

```bash
# ローカルでビルド
cd frontend
npm run build

# EC2 に転送（SSH 接続後、/var/www/taskmanagement/ に配置）
scp -i <キーファイル.pem> -r dist/* ec2-user@<EC2_IP>:~/dist-upload/
```

EC2 上で `/var/www/taskmanagement/` に配置後、Nginx をリロード。

### 環境の削除

```bash
cd infra/ec2
terraform destroy
```

---

## 注意事項

- `terraform.tfvars` は絶対に Git にコミットしない（`.gitignore` で除外済み）
- SSH 秘密鍵（`.pem`）も Git にコミットしない
- 使わない期間は `terraform destroy` でリソースを削除してコストを抑える
