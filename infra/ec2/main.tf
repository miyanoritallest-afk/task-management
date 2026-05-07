terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# 新規VPCは作らず、AWSアカウントに最初からあるデフォルトVPCを使う
data "aws_vpc" "default" {
  default = true
}

# デフォルトVPC内のサブネット一覧を取得
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}
