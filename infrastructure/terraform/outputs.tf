#VPC ID
output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

# subnet IDs
output "subnet_id" {
  description = "The ID of the public subnet"
  value       = aws_subnet.public.id
}

# security group ID
output "security_group_id" {
  description = "The ID of the security group"
  value       = aws_security_group.app_server.id
}

# EC2 instance public IP
output "instance_public_ips" {
  description = "The public IP addresses of the EC2 instances"
  value       = aws_instance.app_server[*].public_ip
}

# EC2 instance private IP
output "instance_private_ips" {
  description = "The private IP addresses of the EC2 instances"
  value       = aws_instance.app_server[*].private_ip
}

# EC2 instance IDs
output "instance_ids" {
  description = "The IDs of the EC2 instances"
  value       = aws_instance.app_server[*].id
}

# SSH connection string
output "ssh_connection" {
  description = "The SSH connection string for the EC2 instances"
  value       = "ssh -i alarm-app-key ec2-user@${aws_instance.app_server[0].public_ip}"
}


#Application URLs
output "application_urls" {
  description = "The URLs to access the application"
  value = {
    frontend   = "http://${aws_instance.app_server[0].public_ip}:3000"
    backend    = "http://${aws_instance.app_server[0].public_ip}:5000"
    grafana    = "http://${aws_instance.app_server[0].public_ip}:3001"
    prometheus = "http://${aws_instance.app_server[0].public_ip}:9090"
  }
}