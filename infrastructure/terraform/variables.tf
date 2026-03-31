# AWS region to deploy resources in.
variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "us-east-2"
}

# Environment
variable "environment" {
  description = "The environment to deploy resources in (e.g., dev, staging, prod)."
  type        = string
  default     = "dev"
}

# Name of the project.
variable "project_name" {
  description = "The name of the project."
  type        = string
  default     = "alarm-app"
}

# VPC CIDR block.
variable "vpc_cidr" {
  description = "The CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}


variable "instance_type" {
  description = "The EC2 instance type to use for the application servers."
  type        = string
  default     = "t3.micro"
}

# SSH key pair name for EC2 instances.
variable "key_pair_name" {
  description = "The name of the EC2 key pair to use for SSH access."
  type        = string
  default     = "alarm-app-key"
}

# IP address to allow SSH access to EC2 instances (default is open to all).
variable "my_ip" {
  description = "Your IP address to allow SSH access to EC2 instances."
  type        = string
  default     = "0.0.0.0/0"
}

# AMI ID for the EC2 instances (Amazon Linux 2).
variable "ami_id" {
  description = "The AMI ID to use for the EC2 instances."
  type        = string
  default     = "ami-0edc0a81903bf24ef" # Amazon Linux 2 AMI (HVM), SSD Volume Type
}


variable "instance_count" {
  description = "The number of EC2 instances to launch for the application servers."
  type        = number
  default     = 1
}