# Amazon Linux 2023 の最新AMIを自動取得（手動でAMI IDを調べなくてよい）
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "main" {
  ami                         = data.aws_ami.amazon_linux_2023.id
  instance_type               = "t3.micro"
  subnet_id                   = tolist(data.aws_subnets.default.ids)[0]
  vpc_security_group_ids      = [aws_security_group.ec2.id]
  key_name                    = var.key_pair_name
  associate_public_ip_address = true

  root_block_device {
    volume_size = 20 # GB（無料枠の上限は30GB）
    volume_type = "gp2"
  }

  # 起動時に自動実行されるシェルスクリプト
  # EC2が起動した時点でDockerとDocker Composeが使えるようになる
  user_data = <<-EOF
    #!/bin/bash
    set -e

    # パッケージ更新とDockerインストール
    dnf update -y
    dnf install -y docker
    systemctl enable docker
    systemctl start docker

    # ec2-userがsudoなしでdockerを使えるようにする
    usermod -aG docker ec2-user

    # Docker Compose v2 のインストール
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
      -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
  EOF

  tags = {
    Name = "${var.project_name}-ec2"
  }
}

# ElasticIP: EC2を再起動してもIPアドレスが変わらないようにする
# （IPが変わると毎回設定し直しになるので固定する）
resource "aws_eip" "main" {
  instance = aws_instance.main.id
  domain   = "vpc"

  tags = {
    Name = "${var.project_name}-eip"
  }

  # EC2インスタンスが作成されてからEIPを割り当てる
  depends_on = [aws_instance.main]
}
