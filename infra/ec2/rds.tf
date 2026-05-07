# RDS 用セキュリティグループ
# EC2 のセキュリティグループからの 5432 番ポートのみ許可
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Allow PostgreSQL from EC2 only"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "PostgreSQL from EC2"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

# RDS サブネットグループ（2AZ 必要なため デフォルトサブネットを全て使う）
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = tolist(data.aws_subnets.default.ids)

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

# RDS PostgreSQL インスタンス
resource "aws_db_instance" "main" {
  identifier        = "${var.project_name}-postgres"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  storage_type      = "gp2"

  db_name  = "kanban_db"
  username = "kanban_user"
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  publicly_accessible     = false # EC2経由でのみアクセス可
  skip_final_snapshot     = true  # terraform destroy で即削除
  deletion_protection     = false
  multi_az                = false # 無料枠: Single-AZ
  backup_retention_period = 0     # 自動バックアップ無効

  tags = {
    Name = "${var.project_name}-rds"
  }
}
