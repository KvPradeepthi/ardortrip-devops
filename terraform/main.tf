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

# 1. Virtual Private Cloud (VPC)
resource "aws_vpc" "ardortrip_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Name        = "ardortrip-vpc"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

# 2. Public & Private Subnets
resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.ardortrip_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true
  tags = { Name = "ardortrip-public-1" }
}

resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.ardortrip_vpc.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "${var.aws_region}a"
  tags = { Name = "ardortrip-private-1" }
}

# 3. AWS ECR Repositories
resource "aws_ecr_repository" "backend_repo" {
  name                 = "ardortrip-backend"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "frontend_repo" {
  name                 = "ardortrip-frontend"
  image_tag_mutability = "MUTABLE"
}

# 4. AWS RDS PostgreSQL Database Subnet Group & Instance
resource "aws_db_subnet_group" "db_subnets" {
  name       = "ardortrip-db-subnets"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.public_1.id]
}

resource "aws_db_instance" "postgres" {
  identifier             = "ardorproddb-master"
  engine                 = "postgres"
  engine_version         = "16.1"
  instance_class         = "db.t4g.micro"
  allocated_storage      = 20
  db_name                = "ardortrip"
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.db_subnets.name
  skip_final_snapshot    = true
  publicly_accessible    = false
  tags = {
    Name = "ardortrip-rds-postgres"
  }
}
