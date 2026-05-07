variable "aws_region" {
  description = "AWSリージョン（東京）"
  type        = string
  default     = "ap-northeast-1"
}

variable "project_name" {
  description = "プロジェクト名（リソース名のプレフィックス）"
  type        = string
  default     = "taskmanagement"
}

variable "my_ip_cidr" {
  description = "SSH接続を許可するIPアドレス（例: 1.2.3.4/32）。自分のグローバルIPを設定する。"
  type        = string
}

variable "key_pair_name" {
  description = "EC2にSSH接続するためのキーペア名（AWSコンソールで作成したもの）"
  type        = string
}

variable "db_password" {
  description = "RDS PostgreSQL のパスワード"
  type        = string
  sensitive   = true
}
