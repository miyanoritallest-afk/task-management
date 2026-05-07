output "ec2_public_ip" {
  description = "EC2のパブリックIPアドレス（ElasticIP）"
  value       = aws_eip.main.public_ip
}

output "app_url" {
  description = "アプリケーションのURL"
  value       = "http://${aws_eip.main.public_ip}"
}

output "ssh_command" {
  description = "SSH接続コマンド（キーファイルのパスは自分の環境に合わせて変更）"
  value       = "ssh -i <キーファイル.pem> ec2-user@${aws_eip.main.public_ip}"
}

output "rds_endpoint" {
  description = "RDS のエンドポイント（EC2からの接続先ホスト名）"
  value       = aws_db_instance.main.address
}

output "rds_port" {
  description = "RDS のポート番号"
  value       = aws_db_instance.main.port
}
