resource "aws_security_group" "ec2" {
  name        = "${var.project_name}-ec2-sg"
  description = "Kanban board EC2 security group"
  vpc_id      = data.aws_vpc.default.id

  # SSH: 自分のIPからのみ許可（セキュリティのため全開放しない）
  ingress {
    description = "SSH from my IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip_cidr]
  }

  # HTTP: 全公開（アプリにブラウザからアクセスするため）
  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # アウトバウンド: 全許可（DockerイメージのDLやパッケージ取得に必要）
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ec2-sg"
  }
}
