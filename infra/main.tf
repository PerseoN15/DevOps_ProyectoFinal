# Infrastructure as Code - Security Group Example
# This file is ONLY for security analysis (Checkov) in the DevSecOps pipeline.

provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "reactapp_sg" {
  name        = "reactapp-security-group"
  description = "Security group for React App on EC2"

  # Allow HTTP
  ingress {
    description = "Allow HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow SSH only from YOUR IP (replace it)
  ingress {
    description = "Allow SSH only from my IP"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Replace with your IP for better security
  }

  # Allow outgoing traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
